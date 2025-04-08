
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

  return (
    <div className="px-3 py-2 border-b bg-white">
      <div className="mb-1">
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${correct}%` }}
          />
          <div 
            className="absolute h-full bg-red-500 transition-all duration-300"
            style={{ left: `${correct}%`, width: `${incorrect}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
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
