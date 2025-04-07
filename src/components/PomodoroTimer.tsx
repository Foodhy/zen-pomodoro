
import React from 'react';
import { useApp } from '../context/AppContext';
import TimerDisplay from './timer/TimerDisplay';
import TimerProgress from './timer/TimerProgress';
import TimerControls from './timer/TimerControls';
import PomodoroCount from './timer/PomodoroCount';
import useTimer from './timer/useTimer';

interface PomodoroTimerProps {
  onToggleFullscreen: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onToggleFullscreen }) => {
  const { settings } = useApp();
  
  const {
    timeLeft,
    isRunning,
    currentPhase,
    pomodoroCount,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToNextPhase,
    calculateProgress,
  } = useTimer();
  
  return (
    <div className="flex flex-col items-center justify-center py-6 fade-in">
     
      
      <TimerProgress 
        progress={calculateProgress()} 
        theme={settings.theme}
      />
      
      <TimerControls 
        isRunning={isRunning}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
        onSkip={skipToNextPhase}
        theme={settings.theme}
      />
      
      <PomodoroCount count={pomodoroCount} theme={settings.theme} />
    </div>
  );
};

export default PomodoroTimer;
