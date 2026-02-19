
import React from 'react';
import { useApp } from '../../context/AppContext';

interface TimerDisplayProps {
  currentPhase: 'work' | 'shortBreak' | 'longBreak';
  timeLeft: number;
  theme: string;
}

const PHASE_LABELS: Record<string, string> = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  currentPhase,
  timeLeft,
  theme
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (theme === 'nes-retro') return 'timer-display-nes';
    if (theme === 'netflix') return 'timer-display-netflix';
    return 'timer-display';
  };

  return (
    <div className="flex flex-col items-center gap-1 mb-5">
      <p className={`text-sm font-medium tracking-widest uppercase opacity-60 ${theme === 'nes-retro' ? 'font-pixelated text-xs' : ''}`}>
        {PHASE_LABELS[currentPhase]}
      </p>
      <div className={getTimerClass()}>{formatTime(timeLeft)}</div>
    </div>
  );
};

export default TimerDisplay;
