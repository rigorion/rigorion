
import { Clock } from "lucide-react";
import CountdownTimer from "./CountDownTimer";

interface PracticeProgressProps {
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  timerDuration: number;
  isTimerActive: boolean;
  handleTimerComplete: () => void;
  mode: "timer" | "level" | "manual" | "pomodoro" | "exam";
  timeRemaining: string;
  setTimeRemaining: (time: string) => void;
}

const PracticeProgress = ({
  correctAnswers,
  incorrectAnswers,
  totalQuestions,
  timerDuration,
  isTimerActive,
  handleTimerComplete,
  mode,
  timeRemaining,
  setTimeRemaining
}: PracticeProgressProps) => {
  const calculateProgress = () => {
    const total = totalQuestions;
    const totalAnswered = correctAnswers + incorrectAnswers;
    
    return {
      correct: (correctAnswers / total) * 100,
      incorrect: (incorrectAnswers / total) * 100,
      unattempted: ((total - totalAnswered) / total) * 100
    };
  };

  const { correct, incorrect } = calculateProgress();

  // Generate segments for the broken pieces design
  const generateSegments = (count: number, filledCount: number) => {
    return Array.from({ length: count }).map((_, index) => {
      const isFilled = index < filledCount;
      return (
        <div 
          key={index} 
          className={`h-full rounded-sm mx-0.5 transition-all duration-300 ${
            isFilled 
              ? 'bg-gradient-to-r from-emerald-400 to-blue-500 shadow-[0_0_10px_rgba(52,211,153,0.7)]' 
              : 'bg-gray-200'
          }`}
          style={{ width: `calc(${100 / count}% - 4px)` }}
        />
      );
    });
  };

  // Calculate how many segments should be filled
  const segmentCount = 20; // Total number of segments
  const filledSegments = Math.round((correctAnswers / totalQuestions) * segmentCount);

  return (
    <div className="px-3 py-2 border-b bg-white">
      {/* Modern segmented progress bar with glow effect */}
      <div className="mb-2 relative">
        <div className="h-3 flex items-center relative">
          {generateSegments(segmentCount, filledSegments)}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full" />
            <span>Correct: {correctAnswers}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>Incorrect: {incorrectAnswers}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-300 rounded-full" />
            <span>Unattempted: {totalQuestions - correctAnswers - incorrectAnswers}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          {timerDuration > 0 ? (
            <CountdownTimer
              durationInSeconds={timerDuration}
              onComplete={handleTimerComplete}
              isActive={isTimerActive}
              mode={mode}
              onUpdate={(remaining: string) => setTimeRemaining(remaining)}
            />
          ) : (
            <span>{timeRemaining}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeProgress;
