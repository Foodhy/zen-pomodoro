
import React from 'react';

interface TimerProgressProps {
  progress: number;
  theme: string;
}

export const TimerProgress: React.FC<TimerProgressProps> = ({ progress, theme }) => {
  return (
    <div className="w-full max-w-xs mb-8">
      <div className={`timer-progress ${theme === 'nes-retro' ? 'timer-progress-nes' : ''}`}>
        <div
          className={`timer-progress-bar ${
            theme === 'nes-retro' ? 'timer-progress-bar-nes' : 
            theme === 'netflix' ? 'timer-progress-bar-netflix' : ''
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TimerProgress;
