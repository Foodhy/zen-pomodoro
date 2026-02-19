
import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  theme: string;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip,
  theme
}) => {
  const isNes = theme === 'nes-retro';

  return (
    <div className="flex items-center justify-center gap-4 mb-7">
      {/* Reset */}
      <button
        onClick={onReset}
        className={`zen-ctrl-btn zen-ctrl-sm ${isNes ? 'nes-btn' : ''}`}
        aria-label="Reset timer"
      >
        <RotateCcw className="h-4 w-4" />
      </button>

      {/* Play / Pause - primary */}
      {isRunning ? (
        <button
          onClick={onPause}
          className={`zen-ctrl-btn zen-ctrl-primary ${isNes ? 'nes-btn' : ''}`}
          aria-label="Pause timer"
        >
          <Pause className="h-5 w-5" />
        </button>
      ) : (
        <button
          onClick={onStart}
          className={`zen-ctrl-btn zen-ctrl-primary zen-ctrl-accent ${isNes ? 'nes-btn' : ''}`}
          aria-label="Start timer"
        >
          <Play className="h-5 w-5" />
        </button>
      )}

      {/* Skip */}
      <button
        onClick={onSkip}
        className={`zen-ctrl-btn zen-ctrl-sm ${isNes ? 'nes-btn' : ''}`}
        aria-label="Skip phase"
      >
        <SkipForward className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TimerControls;
