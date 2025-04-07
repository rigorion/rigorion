import { Button } from "@/components/ui/button";
import { Timer, Clock, Hand } from "lucide-react";

interface ModeSelectorProps {
  currentMode: "timer" | "pomodoro" | "manual" | "level" | "exam";
  onModeChange: (mode: "timer" | "pomodoro" | "manual" | "level" | "exam") => void;
}


const ModeSelector = ({ currentMode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentMode === "timer" ? "default" : "outline"}
        size="sm"
        onClick={() => onModeChange("timer")}
        className="flex items-center gap-2"
      >
        <Timer className="w-4 h-4" />
        Timer
      </Button>
      
      <Button
        variant={currentMode === "pomodoro" ? "default" : "outline"}
        size="sm"
        onClick={() => onModeChange("pomodoro")}
        className="flex items-center gap-2"
      >
        <Clock className="w-4 h-4" />
        Pomodoro
      </Button>
      
      <Button
        variant={currentMode === "manual" ? "default" : "outline"}
        size="sm"
        onClick={() => onModeChange("manual")}
        className="flex items-center gap-2"
      >
        <Hand className="w-4 h-4" />
        Manual
      </Button>
    </div>
  );
};

export default ModeSelector;
