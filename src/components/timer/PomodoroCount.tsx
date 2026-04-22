
import React from 'react';
import { useApp } from '../../context/AppContext';
import { tn } from '../../services/translationService';

interface PomodoroCountProps {
  count: number;
  theme: string;
}

export const PomodoroCount: React.FC<PomodoroCountProps> = ({ count, theme }) => {
  const { settings } = useApp();
  // Show dots representing pomodoros in current long-break cycle (up to 4)
  const dots = Array.from({ length: 4 }, (_, i) => i < (count % 4 || (count > 0 && count % 4 === 0 ? 4 : 0)));

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1.5">
        {dots.map((filled, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              filled
                ? 'bg-primary opacity-100'
                : 'bg-muted opacity-40'
            } ${theme === 'nes-retro' ? 'rounded-none' : ''}`}
          />
        ))}
      </div>
      <p className={`text-xs opacity-40 ${theme === 'nes-retro' ? 'font-pixelated' : ''}`}>
        {tn('timer.pomodoroToday', settings.language, count)}
      </p>
    </div>
  );
};

export default PomodoroCount;
