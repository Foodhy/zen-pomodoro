
import React from 'react';

interface PomodoroCountProps {
  count: number;
  theme: string;
}

export const PomodoroCount: React.FC<PomodoroCountProps> = ({ count, theme }) => {
  return (
    <div className={`text-sm opacity-70 ${theme === 'nes-retro' ? 'font-pixelated text-xs' : ''}`}>
      {count} {count === 1 ? 'Pomodoro' : 'Pomodoros'} Completed
    </div>
  );
};

export default PomodoroCount;
