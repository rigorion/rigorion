
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

  const { correct, incorrect, unattempted } = calculateProgress();

  return (
    <div className="px-3 py-2 border-b bg-white">
      {/* Progress bar with smooth animated gradient effect - 20% thinner */}
      <div className="mb-2 relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
        {/* Correct answers - green */}
        <div 
          className="absolute left-0 top-0 h-full bg-green-500 rounded-l-full transition-all duration-500 ease-out shine-animation"
          style={{ width: `${correct}%` }}
        />
        
        {/* Incorrect answers - red */}
        <div 
          className="absolute top-0 h-full bg-red-500 transition-all duration-500 ease-out"
          style={{ left: `${correct}%`, width: `${incorrect}%` }}
        />
        
        {/* Unattempted - grey (changed from orange) */}
        <div 
          className="absolute top-0 right-0 h-full bg-gray-300 rounded-r-full transition-all duration-500 ease-out"
          style={{ width: `${unattempted}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Correct: {correctAnswers}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>Incorrect: {incorrectAnswers}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
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

      {/* Add the keyframes animation for the shining effect as a global style with slower interval */}
      <style>
        {`
        @keyframes shine {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .shine-animation {
          background-image: linear-gradient(
            90deg, 
            rgba(255,255,255,0) 0%, 
            rgba(255,255,255,0.3) 50%, 
            rgba(255,255,255,0) 100%
          );
          background-size: 200% 100%;
          animation: shine 10s infinite linear; /* Changed from 2s to 10s */
        }
        `}
      </style>
    </div>
  );
};

export default PracticeProgress;
