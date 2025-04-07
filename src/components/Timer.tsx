import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimerSnackbarProps {
  timeRemaining: number | null;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const TimerSnackbar = ({ timeRemaining, isPaused, onTogglePause }: TimerSnackbarProps) => {
  if (timeRemaining === null) return null;

  // Convert seconds into minutes and seconds.
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    // This small snackbar is fixed in the bottom-right corner.
    <div className="fixed bottom-4 right-4 bg-white shadow-md rounded-lg p-2 flex items-center space-x-2 z-50">
      <div className="text-sm font-mono text-gray-700">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onTogglePause}
        className="p-1"
      >
        {isPaused ? (
          <Play className="w-4 h-4" />
        ) : (
          <Pause className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};
