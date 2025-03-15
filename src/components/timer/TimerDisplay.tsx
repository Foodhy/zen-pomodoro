
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '@/components/ui/badge';

interface TimerDisplayProps {
  currentPhase: 'work' | 'shortBreak' | 'longBreak';
  timeLeft: number;
  theme: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  currentPhase,
  timeLeft,
  theme
}) => {
  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Determine the timer class based on theme
  const getTimerClass = () => {
    if (theme === 'nes-retro') {
      return 'timer-display-nes';
    } else if (theme === 'netflix') {
      return 'timer-display-netflix';
    } else {
      return 'timer-display';
    }
  };
  
  return (
    <>
      <div className="mb-4">
        <Badge 
          variant={currentPhase === 'work' ? 'default' : 'secondary'} 
          className={`rounded-full px-4 py-1 text-sm ${theme === 'nes-retro' ? 'font-pixelated' : ''}`}
        >
          {currentPhase === 'work' ? 'Work' : currentPhase === 'shortBreak' ? 'Short Break' : 'Long Break'}
        </Badge>
      </div>
      
      <div className={getTimerClass()}>{formatTime(timeLeft)}</div>
    </>
  );
};

export default TimerDisplay;
