
import React from 'react';
import { Button } from '@/components/ui/button';
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
  return (
    <div className="flex items-center gap-4 mb-8">
      {isRunning ? (
        <Button
          variant="outline"
          size="icon"
          className={`h-16 w-16 rounded-full ${theme === 'nes-retro' ? 'nes-btn' : ''}`}
          onClick={onPause}
        >
          <Pause className="h-6 w-6" />
        </Button>
      ) : (
        <Button
          variant="default"
          size="icon"
          className={`h-16 w-16 rounded-full btn-primary ${theme === 'nes-retro' ? 'nes-btn' : ''}`}
          onClick={onStart}
        >
          <Play className="h-6 w-6" />
        </Button>
      )}
      
      <Button
        variant="outline"
        size="icon"
        className={`h-12 w-12 rounded-full ${theme === 'nes-retro' ? 'nes-btn' : ''}`}
        onClick={onReset}
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className={`h-12 w-12 rounded-full ${theme === 'nes-retro' ? 'nes-btn' : ''}`}
        onClick={onSkip}
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default TimerControls;
