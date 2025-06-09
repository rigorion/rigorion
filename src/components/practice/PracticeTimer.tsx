import { Button } from "@/components/ui/button";
import { Play, Pause, Timer, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface PracticeTimerProps {
  timeRemaining: number | null;
  isPaused: boolean;
  onTogglePause: () => void;
  mode?: "timer" | "pomodoro" | "exam" | "manual" | "level";
  pomodoroPhase?: "work" | "break";
  sessionCount?: number;
}

export const PracticeTimer = ({ 
  timeRemaining, 
  isPaused, 
  onTogglePause, 
  mode = "manual",
  pomodoroPhase = "work",
  sessionCount = 0
}: PracticeTimerProps) => {
  if (timeRemaining === null) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const getModeIcon = () => {
    switch (mode) {
      case "timer": return <Timer className="h-5 w-5" />;
      case "pomodoro": return <Clock className="h-5 w-5" />;
      case "exam": return <FileText className="h-5 w-5" />;
      default: return <Timer className="h-5 w-5" />;
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case "timer": return "from-blue-500 to-cyan-500";
      case "pomodoro": return pomodoroPhase === "work" ? "from-red-500 to-pink-500" : "from-blue-500 to-indigo-500";
      case "exam": return "from-orange-500 to-red-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case "timer": return "Per Question";
      case "pomodoro": return pomodoroPhase === "work" ? `Focus Session ${sessionCount + 1}` : "Break Time";
      case "exam": return "Exam Mode";
      default: return "Timer";
    }
  };

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mb-8 text-center"
    >
      <div className={`inline-flex items-center gap-4 bg-gradient-to-r ${getModeColor()} p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-white/20`}>
        {/* Mode Icon and Label */}
        <div className="flex flex-col items-center gap-2 text-white">
          <div className="p-2 bg-white/20 rounded-full">
            {getModeIcon()}
          </div>
          <span className="text-xs font-medium opacity-90">
            {getModeLabel()}
          </span>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center">
          <div className="font-mono text-4xl font-bold text-white tracking-wider">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          {mode === "pomodoro" && (
            <div className="text-xs text-white/80 mt-1">
              {pomodoroPhase === "work" ? "Focus Time" : "Break Time"}
            </div>
          )}
        </div>

        {/* Control Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePause}
          className="rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 h-12 w-12"
        >
          {isPaused ? (
            <Play className="h-6 w-6 text-white" />
          ) : (
            <Pause className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>

      {/* Progress Indicator for Pomodoro */}
      {mode === "pomodoro" && (
        <div className="mt-4 flex justify-center gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < sessionCount ? 'bg-red-500' : 'bg-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-xs text-gray-600">
            Sessions completed: {sessionCount}
          </span>
        </div>
      )}
    </motion.div>
  );
};