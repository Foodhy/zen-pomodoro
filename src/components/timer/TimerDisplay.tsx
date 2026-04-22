
import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../services/translationService';

interface TimerDisplayProps {
  currentPhase: 'work' | 'shortBreak' | 'longBreak';
  timeLeft: number;
  theme: string;
}

const PHASE_KEYS: Record<string, string> = {
  work: 'timer.phase.focus',
  shortBreak: 'timer.shortBreak',
  longBreak: 'timer.longBreak',
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  currentPhase,
  timeLeft,
  theme
}) => {
  const { settings } = useApp();
  const lang = settings.language;

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
        {t(PHASE_KEYS[currentPhase], lang)}
      </p>
      <div className={getTimerClass()}>{formatTime(timeLeft)}</div>
    </div>
  );
};

export default TimerDisplay;
