
import { Clock, Flag, Sparkles } from "lucide-react";
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
  onPomodoroBreak
}: PracticeProgressProps) => {
  const { isDarkMode } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    fontFamily: 'inter',
    fontSize: 14,
    colorStyle: 'plain' as const,
    textColor: '#374151'
  });

  // Updated: Progress calculation is now relative to the objective (if set), or totalQuestions.
  const calculateProgress = () => {
    // Use objective.value as "target" if type is questions and value is set, else totalQuestions
    const targetTotal = (objective?.type === "questions" && objective?.value)
      ? objective.value
      : totalQuestions;

    // Clamp the totalAnswered to the targetTotal to never exceed 100%
    const totalAnswered = Math.min(correctAnswers + incorrectAnswers, targetTotal);

    // Calculate each percentage based on the targetTotal (objective or totalQuestions)
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

  // Target progress for display: If "objective" is set, use its progress, else use totalPercentage.
  const targetProgressPercentage =
    (objective?.type === "questions" && typeof progress === "number")
      ? Math.round(progress)
      : totalPercentage;

  // Style helpers for the progress bar
  const correctWidth = `${correct}%`;
  const incorrectWidth = `${incorrect}%`;
  const unattemptedWidth = `${unattempted}%`;
  const incorrectLeft = `${correct}%`;

  const handleSettingsChange = (key: string, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className={`px-3 py-2 border-b transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        {/* Progress bar with percentage indicator */}
        <div className="relative h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex-grow progress-bar">
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
            className="absolute top-0 right-0 h-full bg-gray-300 dark:bg-gray-600 rounded-r-full transition-all duration-500 ease-out"
            style={{ width: unattemptedWidth, zIndex: 1 }}
          />
          {/* Progress percentage */}
          <div className={`absolute right-0 top-0 -translate-y-1/2 translate-x-full mt-1.5 ml-2 text-xs font-medium ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {totalPercentage}%
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {/* Left side: Progress bar legend */}
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Correct</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Incorrect</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Unattempted</span>
            </div>
          </div>
        </div>

        {/* Center: Hint, settings, flag, and tab selector */}
        <div className="flex items-center gap-2">
          {/* Hint button */}
          <HintDialog hint={currentQuestionHint} currentQuestionIndex={currentQuestionIndex} />
          {/* Settings button */}
          <SettingsDialog open={showSettings} onOpenChange={setShowSettings} settings={settings} onApply={handleSettingsChange}>
            <Button variant="ghost" size="sm" className="p-1 h-6 rounded-full border-none">
              <Sparkles className={`h-4 w-4 ${
                isDarkMode 
                  ? 'text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent' 
                  : 'text-amber-500'
              }`} />
            </Button>
          </SettingsDialog>
          {/* Flag button */}
          <Button variant="ghost" size="sm" className="p-1 h-6 rounded-full">
            <Flag className={`h-4 w-4 ${
              isDarkMode 
                ? 'text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent' 
                : 'text-blue-600'
            }`} />
          </Button>
          {/* Tab selector */}
          <PracticeTabSelector activeTab={activeTab} setActiveTab={setActiveTab} className="h-8 min-h-0" />
        </div>

        {/* Right side: Target Progress and Timer */}
        <div className="flex items-center gap-4">
          {/* Target Progress indicator */}
          <div className="flex items-center text-sm">
            <span className={`font-medium ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Target Progress: {targetProgressPercentage}%
            </span>
          </div>
          {/* Timer */}
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 ${
              isDarkMode 
                ? 'text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent' 
                : 'text-blue-600'
            }`} />
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
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{timeRemaining}</span>
            )}
          </div>
        </div>
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
