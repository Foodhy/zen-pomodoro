
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PomodoroSession } from '../models/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import notificationService from '../services/notificationService';

interface PomodoroTimerProps {
  onToggleFullscreen: () => void;
}

type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onToggleFullscreen }) => {
  const { activeProfile, saveSession, settings } = useApp();
  
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>('work');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize timer when active profile changes
  useEffect(() => {
    if (activeProfile) {
      resetTimer();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeProfile]);
  
  // Setup audio
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    audioRef.current.volume = 0.7;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);
  
  // Timer completion logic
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }
  }, [timeLeft, isRunning]);
  
  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    // Play sound if enabled
    if (settings.soundEnabled && audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Audio playback failed:', error);
      }
    }
    
    // Send notification
    if (settings.notificationsEnabled) {
      await notificationService.notifyPomodoroCompleted(currentPhase);
    }
    
    // Update current session as completed
    if (currentSession) {
      const completedSession: PomodoroSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        completed: true
      };
      saveSession(completedSession);
      setCurrentSession(null);
    }
    
    // Determine next phase
    if (currentPhase === 'work') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      if (activeProfile && newCount % activeProfile.longBreakInterval === 0) {
        setCurrentPhase('longBreak');
        setTimeLeft(activeProfile.longBreakDuration * 60);
      } else {
        setCurrentPhase('shortBreak');
        setTimeLeft(activeProfile?.shortBreakDuration ? activeProfile.shortBreakDuration * 60 : 5 * 60);
      }
    } else {
      setCurrentPhase('work');
      setTimeLeft(activeProfile?.workDuration ? activeProfile.workDuration * 60 : 25 * 60);
    }
  };
  
  const startTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
      
      // Create a new session when starting work phase
      if (currentPhase === 'work' && !currentSession && activeProfile) {
        const newSession: PomodoroSession = {
          id: `session-${Date.now()}`,
          profileId: activeProfile.id,
          startTime: new Date().toISOString(),
          duration: activeProfile.workDuration * 60,
          type: 'work',
          completed: false
        };
        
        setCurrentSession(newSession);
        saveSession(newSession);
      }
      
      // Send notification of phase started
      if (settings.notificationsEnabled) {
        notificationService.notifyPhaseStarted(currentPhase);
      }
    }
  };
  
  const pauseTimer = () => {
    setIsRunning(false);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    
    if (activeProfile) {
      if (currentPhase === 'work') {
        setTimeLeft(activeProfile.workDuration * 60);
      } else if (currentPhase === 'shortBreak') {
        setTimeLeft(activeProfile.shortBreakDuration * 60);
      } else {
        setTimeLeft(activeProfile.longBreakDuration * 60);
      }
    }
    
    // Clear current session if resetting during work phase
    if (currentPhase === 'work' && currentSession) {
      setCurrentSession(null);
    }
  };
  
  const skipToNextPhase = () => {
    if (currentSession && currentPhase === 'work') {
      const completedSession: PomodoroSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        completed: true
      };
      saveSession(completedSession);
      setCurrentSession(null);
    }
    
    handleTimerComplete();
  };
  
  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (!activeProfile) return 0;
    
    let totalSeconds;
    if (currentPhase === 'work') {
      totalSeconds = activeProfile.workDuration * 60;
    } else if (currentPhase === 'shortBreak') {
      totalSeconds = activeProfile.shortBreakDuration * 60;
    } else {
      totalSeconds = activeProfile.longBreakDuration * 60;
    }
    
    return 100 - ((timeLeft / totalSeconds) * 100);
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-6 fade-in">
      <div className="mb-2">
        <Badge variant={currentPhase === 'work' ? 'default' : 'secondary'} className="rounded-full px-3 py-1 text-xs">
          {currentPhase === 'work' ? 'Work' : currentPhase === 'shortBreak' ? 'Short Break' : 'Long Break'}
        </Badge>
      </div>
      
      <div className="timer-display mb-6">{formatTime(timeLeft)}</div>
      
      <div className="w-full max-w-sm mb-6">
        <div className="timer-progress">
          <div
            className="timer-progress-bar"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        {isRunning ? (
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={pauseTimer}
          >
            <Pause className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full btn-primary"
            onClick={startTimer}
          >
            <Play className="h-5 w-5" />
          </Button>
        )}
        
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={resetTimer}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={skipToNextPhase}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-sm opacity-70">
        {pomodoroCount} {pomodoroCount === 1 ? 'Pomodoro' : 'Pomodoros'} Completed
      </div>
    </div>
  );
};

export default PomodoroTimer;
