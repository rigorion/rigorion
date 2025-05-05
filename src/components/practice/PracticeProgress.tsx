
import { Clock, Flag, Lamp, Sparkles } from "lucide-react";
import CountdownTimer from "./CountDownTimer";
import HintDialog from "./HintDialog";
import { Button } from "@/components/ui/button";
import PracticeTabSelector from "./PracticeTabSelector";
import { useState } from "react";
import SettingsDialog from "./SettingsDialog";

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
  objective?: { type: "questions" | "time", value: number } | null;
  progress?: number;
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
  progress = 0
}: PracticeProgressProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    fontFamily: 'inter',
    fontSize: 14,
    colorStyle: 'plain' as const,
    textColor: '#374151',
  });

  const handleSettingsChange = (key: string, value: string | number) => {
    if (key === 'fontFamily') {
      setSettings(prev => ({
        ...prev,
        fontFamily: value as string
      }));
    } else if (key === 'fontSize') {
      setSettings(prev => ({
        ...prev,
        fontSize: value as number
      }));
    } else if (key === 'textColor') {
      setSettings(prev => ({
        ...prev,
        textColor: value as string
      }));
    }
  };
  
  const calculateProgress = () => {
    const total = totalQuestions;
    const totalAnswered = correctAnswers + incorrectAnswers;
    
    return {
      correct: (correctAnswers / total) * 100,
      incorrect: (incorrectAnswers / total) * 100,
      unattempted: ((total - totalAnswered) / total) * 100,
      totalPercentage: Math.round((totalAnswered / total) * 100)
    };
  };

  const { correct, incorrect, unattempted, totalPercentage } = calculateProgress();

  return (
    <div className="px-3 py-2 border-b bg-white">
      <div className="flex items-center justify-between mb-2">
        {/* Progress bar with percentage indicator */}
        <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden flex-grow">
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
          
          {/* Unattempted - grey */}
          <div 
            className="absolute top-0 right-0 h-full bg-gray-300 rounded-r-full transition-all duration-500 ease-out"
            style={{ width: `${unattempted}%` }}
          />
          
          {/* Progress percentage */}
          <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-full mt-1.5 ml-2 text-xs font-medium text-blue-600">
            {totalPercentage}%
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        {/* Left side with collapsible icons and flag */}
        <div className="flex items-center gap-3">
          {/* Legend for progress bar */}
          <div className="flex gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Correct</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span>Incorrect</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
              <span>Unattempted</span>
            </div>
          </div>
        </div>

        {/* Center - Hint, Style, Flag, and Tab selector */}
        <div className="flex items-center gap-2">
          {/* Hint button */}
          <HintDialog 
            hint={currentQuestionHint} 
            currentQuestionIndex={currentQuestionIndex} 
          />
          
          {/* Star icon for styling - Next to hint */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="p-1 h-6 rounded-full"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
          </Button>

          {/* Flag icon for "review later" */}
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-6 rounded-full"
          >
            <Flag className="h-4 w-4 text-blue-600" />
          </Button>
          
          {/* Tab selector */}
          <PracticeTabSelector
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className="h-8 min-h-0"
          />
        </div>

        {/* Right side - Target Progress and Timer */}
        <div className="flex items-center gap-4">
          {/* Target Progress indicator placed before the timer */}
          <div className="flex items-center text-sm">
            <span className="text-blue-600 font-medium">Target Progress: {objective?.value ? Math.round(progress) : totalPercentage}%</span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
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

      {/* Add a condensed stats display only for mobile views */}
      <div className="flex justify-center gap-4 text-xs mt-2 md:hidden">
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

      {/* Settings Dialog */}
      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onApply={handleSettingsChange}
      />

      {/* Add the keyframes animation for the shining effect */}
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
