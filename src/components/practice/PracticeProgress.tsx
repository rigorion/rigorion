import { Clock, Flag, Lamp, Sparkles } from "lucide-react";
import CountdownTimer from "./CountDownTimer";
import HintDialog from "./HintDialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PracticeTabSelector from "./PracticeTabSelector";
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
  const calculateProgress = () => {
    const total = totalQuestions;
    const totalAnswered = correctAnswers + incorrectAnswers;
    return {
      correct: correctAnswers / total * 100,
      incorrect: incorrectAnswers / total * 100,
      unattempted: (total - totalAnswered) / total * 100,
      totalPercentage: Math.round(totalAnswered / total * 100)
    };
  };
  const {
    correct,
    incorrect,
    unattempted,
    totalPercentage
  } = calculateProgress();
  return <div className="px-3 py-2 border-b bg-white">
      <div className="flex items-center justify-between mb-2">
        {/* Progress bar with percentage indicator */}
        <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden flex-grow">
          {/* Correct answers - green */}
          <div className="absolute left-0 top-0 h-full bg-green-500 rounded-l-full transition-all duration-500 ease-out shine-animation" style={{
          width: `${correct}%`
        }} />
          
          {/* Incorrect answers - red */}
          <div className="absolute top-0 h-full bg-red-500 transition-all duration-500 ease-out" style={{
          left: `${correct}%`,
          width: `${incorrect}%`
        }} />
          
          {/* Unattempted - grey */}
          <div style={{
          width: `${unattempted}%`
        }} className="absolute top-0 right-0 h-2 bg-gray-300 rounded-r-full transition-all duration-500 ease-out" />
          
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

        {/* Center - Styling, Hint, Flag, and Tab selector */}
        <div className="flex items-center gap-2">
          {/* Style button inline */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-6 rounded-full" aria-label="Text styling options">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 rounded-xl border border-blue-100 shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in" sideOffset={5} align="center">
              {/* Style content remains the same */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Text Styling</h3>
                
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-gray-600">Font</label>
                    <select value="" onChange={() => {}} className="p-1.5 text-sm border rounded-lg bg-gray-50 focus:ring-1 focus:ring-blue-300 outline-none">
                      <option value="inter">Inter</option>
                      <option value="times-new-roman">Times New Roman</option>
                      <option value="roboto">Roboto</option>
                      <option value="poppins">Poppins</option>
                      <option value="share-tech-mono">Monospace</option>
                      <option value="dancing-script">Cursive</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-gray-600">Size: px</label>
                    </div>
                    <input type="range" min="10" max="24" step="1" value="14" onChange={() => {}} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1 items-center">
                      <label className="text-xs font-medium text-gray-600">Text</label>
                      <input type="color" value="#374151" onChange={() => {}} className="w-8 h-8 p-0 border-none rounded-full" />
                    </div>
                    
                    <div className="flex flex-col gap-1 items-center">
                      <label className="text-xs font-medium text-gray-600">Key</label>
                      <input type="color" value="#2563eb" onChange={() => {}} className="w-8 h-8 p-0 border-none rounded-full" />
                    </div>
                    
                    <div className="flex flex-col gap-1 items-center">
                      <label className="text-xs font-medium text-gray-600">Formula</label>
                      <input type="color" value="#dc2626" onChange={() => {}} className="w-8 h-8 p-0 border-none rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Hint button inline */}
          <HintDialog hint={currentQuestionHint} currentQuestionIndex={currentQuestionIndex} />

          {/* Flag icon for "review later" */}
          <Button variant="ghost" size="sm" className="p-1 h-6 rounded-full">
            <Flag className="h-4 w-4 text-blue-600" />
          </Button>
          
          {/* Tab selector */}
          <PracticeTabSelector activeTab={activeTab} setActiveTab={setActiveTab} className="h-8 min-h-0" />
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
            {timerDuration > 0 ? <CountdownTimer durationInSeconds={timerDuration} onComplete={handleTimerComplete} isActive={isTimerActive} mode={mode} onUpdate={(remaining: string) => setTimeRemaining(remaining)} /> : <span>{timeRemaining}</span>}
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
    </div>;
};
export default PracticeProgress;