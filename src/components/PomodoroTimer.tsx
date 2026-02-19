
import React from 'react';
import { useApp } from '../context/AppContext';
import TimerDisplay from './timer/TimerDisplay';
import TimerProgress from './timer/TimerProgress';
import TimerControls from './timer/TimerControls';
import PomodoroCount from './timer/PomodoroCount';

interface PomodoroTimerProps {
  onToggleFullscreen: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onToggleFullscreen }) => {
  const { 
    settings,
    timeLeft, 
    isTimerRunning, 
    timerPhase, 
    pomodoroCount, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    skipToNextPhase, 
    calculateProgress
  } = useApp();
  
  return (
    <div className="flex flex-col items-center justify-center py-8 px-6 fade-in">
      <TimerDisplay 
        currentPhase={timerPhase} 
        timeLeft={timeLeft} 
        theme={settings.theme}
      />
      
      <TimerProgress 
        progress={calculateProgress()} 
        theme={settings.theme}
      />
      
      <TimerControls 
        isRunning={isTimerRunning}
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
