
import { Clock, Flag, Settings, Lightbulb } from "lucide-react";
import CountdownTimer from "./CountDownTimer";
import HintDialog from "./HintDialog";
import { Button } from "@/components/ui/button";
import PracticeTabSelector from "./PracticeTabSelector";
import { useState } from "react";
import SettingsDialog from "./SettingsDialog";
import { useTheme } from "@/contexts/ThemeContext";

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
  activeTab: "problem" | "solution" | "quote";
  setActiveTab: (tab: "problem" | "solution" | "quote") => void;
  currentQuestionIndex: number;
  currentQuestionHint?: string;
  objective?: {
    type: "questions" | "time";
    value: number;
  } | null;
  progress?: number;
  onAutoNext?: () => void;
  onPomodoroBreak?: () => void;
  settings?: {
    fontFamily: string;
    fontSize: number;
    colorStyle: string;
    textColor: string;
  };
  onSettingsChange?: (key: string, value: string | number) => void;
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
  setTimeRemaining,
  activeTab,
  setActiveTab,
  currentQuestionIndex,
  currentQuestionHint = "Try breaking down the problem into smaller parts.",
  objective = null,
  progress = 0,
  onAutoNext,
  onPomodoroBreak,
  settings = {
    fontFamily: 'inter',
    fontSize: 14,
    colorStyle: 'plain',
    textColor: '#374151'
  },
  onSettingsChange
}: PracticeProgressProps) => {
  const { isDarkMode } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const calculateProgress = () => {
    const targetTotal = (objective?.type === "questions" && objective?.value)
      ? objective.value
      : totalQuestions;

    const totalAnswered = Math.min(correctAnswers + incorrectAnswers, targetTotal);

    return {
      correct: Math.min((correctAnswers / targetTotal) * 100, 100),
      incorrect: Math.min((incorrectAnswers / targetTotal) * 100, 100),
      unattempted: Math.max(((targetTotal - totalAnswered) / targetTotal) * 100, 0),
      totalPercentage: Math.round((totalAnswered / targetTotal) * 100)
    };
  };

  const {
    correct,
    incorrect,
    unattempted,
    totalPercentage
  } = calculateProgress();

  const targetProgressPercentage =
    (objective?.type === "questions" && typeof progress === "number")
      ? Math.round(progress)
      : totalPercentage;

  const correctWidth = `${correct}%`;
  const incorrectWidth = `${incorrect}%`;
  const unattemptedWidth = `${unattempted}%`;
  const incorrectLeft = `${correct}%`;

  const handleSettingsChange = (key: string, value: string | number) => {
    if (onSettingsChange) {
      onSettingsChange(key, value);
    }
  };

  return (
    <div className={`px-4 py-3 border-b transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
    }`}>
      {/* First row: Icons on left, Progress elements distributed across the remaining space */}
      <div className="flex items-center w-full mb-3">
        {/* Left side: Icons - fixed width */}
        <div className="flex items-center gap-2 mr-8">
          {/* Hint button */}
          <HintDialog hint={currentQuestionHint} currentQuestionIndex={currentQuestionIndex} />
          
          {/* Settings button */}
          <SettingsDialog 
            open={showSettings} 
            onOpenChange={setShowSettings} 
            settings={settings} 
            onApply={handleSettingsChange}
          >
            <Button variant="ghost" size="sm" className="p-1 h-6 rounded-full border-none">
              <Settings className="h-4 w-4 text-gray-400" />
            </Button>
          </SettingsDialog>
          
          {/* Flag button */}
          <Button variant="ghost" size="sm" className="p-1 h-6 rounded-full">
            <Flag className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        {/* Right side: Progress elements distributed across remaining space */}
        <div className="flex items-center justify-between flex-1">
          {/* Progress legends */}
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className={`font-thin ${isDarkMode ? 'text-green-400' : 'text-gray-700'}`}>Correct</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className={`font-thin ${isDarkMode ? 'text-green-400' : 'text-gray-700'}`}>Incorrect</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
              <span className={`font-thin ${isDarkMode ? 'text-green-400' : 'text-gray-700'}`}>Unattempted</span>
            </div>
          </div>

          {/* Progress bar - taking more space */}
          <div className="flex-1 max-w-md mx-8">
            <div className={`relative h-3 rounded-full overflow-hidden progress-bar ${
              isDarkMode ? 'bg-gray-800 border border-green-500/20' : 'bg-gray-100'
            }`}>
              {/* Correct answers - green */}
              <div
                className="absolute left-0 top-0 h-full bg-green-500 rounded-l-full transition-all duration-500 ease-out shine-animation"
                style={{ width: correctWidth, zIndex: 3 }}
              />
              {/* Incorrect answers - red */}
              <div
                className="absolute top-0 h-full bg-red-500 transition-all duration-500 ease-out"
                style={{
                  left: incorrectLeft,
                  width: incorrectWidth,
                  zIndex: 2
                }}
              />
              {/* Unattempted - grey */}
              <div
                className={`absolute top-0 right-0 h-full rounded-r-full transition-all duration-500 ease-out ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}
                style={{ width: unattemptedWidth, zIndex: 1 }}
              />
            </div>
          </div>

          {/* Target Progress and Timer */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-1">
              <span className={`font-thin text-xs ${
                isDarkMode ? 'text-green-400' : 'text-blue-600'
              }`}>
                Target: {targetProgressPercentage}%
              </span>
            </div>
            
            {/* Timer */}
            <div className="flex items-center gap-1">
              <Clock className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`} />
              {timerDuration > 0 ? (
                <CountdownTimer
                  durationInSeconds={timerDuration}
                  onComplete={handleTimerComplete}
                  isActive={isTimerActive}
                  mode={mode}
                  onUpdate={(remaining: string) => setTimeRemaining(remaining)}
                  onAutoNext={onAutoNext}
                  onPomodoroBreak={onPomodoroBreak}
                />
              ) : (
                <span className={`font-thin text-xs ${isDarkMode ? 'text-green-400' : 'text-gray-700'}`}>{timeRemaining}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Second row: Tab menu centered across full width */}
      <div className="w-full">
        <PracticeTabSelector activeTab={activeTab} setActiveTab={setActiveTab} className="h-8 min-h-0" />
      </div>

      {/* Shining animation for progress bar */}
      <style>
        {`
        @keyframes shine {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        .shine-animation {
          background-image: linear-gradient(
            90deg, 
            rgba(255,255,255,0) 0%, 
            rgba(255,255,255,0.3) 50%, 
            rgba(255,255,255,0) 100%
          );
          background-size: 200% 100%;
          animation: shine 10s infinite linear;
        }
        `}
      </style>
    </div>
  );
};

export default PracticeProgress;
