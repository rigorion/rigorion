import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface PracticeTimerProps {
  timeRemaining: number | null;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const PracticeTimer = ({ timeRemaining, isPaused, onTogglePause }: PracticeTimerProps) => {
  if (timeRemaining === null) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="mb-8 text-center flex items-center justify-center gap-3 debug">
      <div className="font-digital text-4xl text-[#48D1CC]">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onTogglePause}
        className="rounded-full hover:bg-[#48D1CC]/10"
      >
        {isPaused ? (
          <Play className="h-4 w-4 text-black font-normal" />
        ) : (
          <Pause className="h-4 w-4 text-black font-normal" />
        )}
      </Button>
    </div>
  );
};