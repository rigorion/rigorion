import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { sampleQuestions } from "@/components/practice/sampleQuestion";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Question } from "@/types/QuestionInterface";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Lamp, Clock } from "lucide-react";

// Import refactored components
import PracticeHeader from "@/components/practice/PracticeHeader";
import PracticeProgress from "@/components/practice/PracticeProgress";
import PracticeTabSelector from "@/components/practice/PracticeTabSelector";
import PracticeDisplay from "@/components/practice/PracticeDisplay";
import PracticeFooter from "@/components/practice/PracticeFooter";
import CommunityStats from "@/components/practice/CommunityStats";
import ModeDialog from "@/components/practice/ModeDialog";
import ObjectiveDialog from "@/components/practice/ObjectiveDialogue";
import HintDialog from "@/components/practice/HintDialog";
import CommentsDialog from "@/components/practice/CommentsDialog";
import ModulesDialog from "@/components/practice/ModulesDialog";

// Import correct icons from lucide-react
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

interface PracticeProps {
  chapterTitle?: string;
  totalQuestions?: number;
}

const chapters = [
  "Chapter 1: Introduction to Mathematics",
  "Chapter 2: Basic Algebra",
  "Chapter 3: Geometry Fundamentals",
  "Chapter 4: Probability & Statistics",
  "Chapter 5: Advanced Functions"
];

const Practice = ({ 
  chapterTitle = "Chapter 1", 
  totalQuestions = sampleQuestions.length 
}: PracticeProps) => {
  // Basic question and UI states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(sampleQuestions[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [mode, setMode] = useState<"timer" | "level" | "manual" | "pomodoro" | "exam">("manual");
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [objective, setObjective] = useState<{ type: "questions" | "time", value: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [modeDialogOpen, setModeDialogOpen] = useState(false);
  const [objectiveDialogOpen, setObjectiveDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"problem" | "solution" | "quote">("problem");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00");

  // Style states
  const [fontFamily, setFontFamily] = useState<string>('inter');
  const [fontSize, setFontSize] = useState<number>(14);
  const [contentColor, setContentColor] = useState<string>('#374151');
  const [keyPhraseColor, setKeyPhraseColor] = useState<string>('#2563eb');
  const [formulaColor, setFormulaColor] = useState<string>('#dc2626');
  const [styleCollapsed, setStyleCollapsed] = useState(true);

  // Stats and feedback states
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [showCommunityStats, setShowCommunityStats] = useState(false);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  
  // Display settings
  const [displaySettings, setDisplaySettings] = useState({
    fontFamily: 'times-new-roman',
    fontSize: 14,
    colorStyle: 'plain' as 'gradient' | 'plain'
  });
  
  const [colorSettings, setColorSettings] = useState({
    content: '#374151',
    keyPhrase: '#2563eb',
    formula: '#dc2626',
  });
  
  const [boardColor, setBoardColor] = useState('white');

  // Update current question when questions change or index changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      setCurrentQuestion(questions[currentQuestionIndex]);
    }
  }, [questions, currentQuestionIndex]);

  // Progress effect
  useEffect(() => {
    if (objective?.type === "questions" && objective.value > 0) {
      const totalAnswered = correctAnswers + incorrectAnswers;
      setProgress(Math.round((totalAnswered / objective.value) * 100));
    }
  }, [correctAnswers, incorrectAnswers, objective]);

  // Mode and objective handlers
  const handleSetMode = (selectedMode: "timer" | "level" | "manual" | "pomodoro" | "exam", duration?: number) => {
    setMode(selectedMode);
    if (duration) {
      setTimerDuration(duration);
      setIsTimerActive(true);
    } else {
      setTimerDuration(0);
      setIsTimerActive(false);
    }
  };

  const handleSetObjective = (type: "questions" | "time", value: number) => {
    setObjective({ type, value });
    if (type === "time" && value > 0) {
      setTimerDuration(value);
      setIsTimerActive(true);
    }
  };

  const handleTimerComplete = () => {
    setIsTimerActive(false);
    console.log("Time's up!");
  };

  // Update styling settings
  const handleUpdateStyle = (key: string, value: string | number) => {
    if (key === 'fontFamily') {
      setFontFamily(value as string);
      setDisplaySettings(prev => ({...prev, fontFamily: value as string}));
    } else if (key === 'fontSize') {
      setFontSize(value as number);
      setDisplaySettings(prev => ({...prev, fontSize: value as number}));
    } else if (key === 'contentColor') {
      setContentColor(value as string);
      setColorSettings(prev => ({...prev, content: value as string}));
    } else if (key === 'keyPhraseColor') {
      setKeyPhraseColor(value as string);
      setColorSettings(prev => ({...prev, keyPhrase: value as string}));
    } else if (key === 'formulaColor') {
      setFormulaColor(value as string);
      setColorSettings(prev => ({...prev, formula: value as string}));
    }
  };

  // Answer checking
  const checkAnswer = (answer: string) => {
    if (!currentQuestion) return;
    
    const correct = answer === currentQuestion.correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      toast({
        title: "Correct!",
        description: "Great job on answering correctly!",
        variant: "default",
      });
    } else {
      setIncorrectAnswers(prev => prev + 1);
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${currentQuestion.correctAnswer}`,
        variant: "destructive",
      });
    }
    
    if (correct && currentQuestionIndex < questions.length - 1) {
      setTimeout(nextQuestion, 1500);
    }
  };

  const nextQuestion = () => {
    const maxIndex = questions.length > 0 ? questions.length - 1 : sampleQuestions.length - 1;
    if (currentQuestionIndex < maxIndex) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const selectChapter = (index: number) => {
    setSelectedChapter(index);
    setSidebarOpen(false);
  };

  // Display an error message if there's an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <PracticeHeader
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenObjective={() => setObjectiveDialogOpen(true)}
        onOpenMode={() => setModeDialogOpen(true)}
        mode={mode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Progress Bar with Stats and Icons */}
      <div className="px-3 py-2 border-b bg-white">
        <PracticeProgress
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          totalQuestions={questions.length || totalQuestions}
          timerDuration={timerDuration}
          isTimerActive={isTimerActive}
          handleTimerComplete={handleTimerComplete}
          mode={mode}
          timeRemaining={timeRemaining}
          setTimeRemaining={setTimeRemaining}
        />
        
        {/* Icons Row - Moved here from separate section */}
        <div className="flex items-center justify-end gap-4 mt-2">
          {/* Styling Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm" 
                className="style-glow rounded-full"
                aria-label="Text styling options"
              >
                <Sparkles className="h-4 w-4 text-blue-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-64 p-4 rounded-xl border border-blue-100 shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in"
              sideOffset={5}
              align="center"
            >
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Text Styling</h3>
                
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-gray-600">Font</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => handleUpdateStyle('fontFamily', e.target.value)}
                      className="p-1.5 text-sm border rounded-lg bg-gray-50 focus:ring-1 focus:ring-blue-300 outline-none"
                    >
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
                      <label className="text-xs font-medium text-gray-600">Size: {fontSize}px</label>
                    </div>
                    <Slider
                      value={[fontSize]}
                      min={10}
                      max={24}
                      step={1}
                      onValueChange={(value) => handleUpdateStyle('fontSize', value[0])}
                      className="py-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1 items-center">
                      <label className="text-xs font-medium text-gray-600">Text</label>
                      <input
                        type="color"
                        value={contentColor}
                        onChange={(e) => handleUpdateStyle('contentColor', e.target.value)}
                        className="w-8 h-8 p-0 border-none rounded-full"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1 items-center">
                      <label className="text-xs font-medium text-gray-600">Key</label>
                      <input
                        type="color"
                        value={keyPhraseColor}
                        onChange={(e) => handleUpdateStyle('keyPhraseColor', e.target.value)}
                        className="w-8 h-8 p-0 border-none rounded-full"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1 items-center">
                      <label className="text-xs font-medium text-gray-600">Formula</label>
                      <input
                        type="color"
                        value={formulaColor}
                        onChange={(e) => handleUpdateStyle('formulaColor', e.target.value)}
                        className="w-8 h-8 p-0 border-none rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Hint Button */}
          <HintDialog 
            hint={currentQuestion?.hint || "Break down the problem into smaller parts."} 
            currentQuestionIndex={currentQuestionIndex} 
          />

          {/* Timer */}
          <div className="flex items-center gap-1 ml-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{timeRemaining}</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Collapsible open={sidebarOpen}>
        <CollapsibleContent
          className="absolute left-0 top-[56px] h-[calc(100vh-56px)] w-64 bg-white shadow-lg z-50 transform transition-all duration-500 ease-in-out"
          style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", opacity: sidebarOpen ? 1 : 0 }}
        >
          <div className="py-4 px-4">
            <h3 className="text-lg font-semibold mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-600">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              Navigation
            </h3>
            <ul className="space-y-3">
              {chapters.map((chapter, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left ${selectedChapter === index ? "text-blue-600 font-medium" : "text-gray-700"}`}
                    onClick={() => selectChapter(index)}
                  >
                    {chapter}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Question Tabs */}
      <PracticeTabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Container with max width */}
      <div className="flex max-w-full mx-auto w-full">
        {/* Main Content - Modified to use more space */}
        <PracticeDisplay
          currentQuestion={currentQuestion}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          checkAnswer={checkAnswer}
          nextQuestion={nextQuestion}
          prevQuestion={prevQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length || totalQuestions}
          displaySettings={{
            fontFamily,
            fontSize,
            colorStyle: 'plain'
          }}
          boardColor={boardColor}
          colorSettings={{
            content: contentColor,
            keyPhrase: keyPhraseColor,
            formula: formulaColor
          }}
          activeTab={activeTab}
        />
      </div>

      {/* Footer with Controls */}
      <PracticeFooter
        onToggleCommunityStats={() => setShowCommunityStats(!showCommunityStats)}
      />

      {/* Conditionally render CommunityStats based on toggle */}
      {showCommunityStats && (
        <div className="mt-4 transition-all duration-500 ease-in-out">
          <CommunityStats />
        </div>
      )}

      {/* Dialogs */}
      <ModeDialog
        open={modeDialogOpen}
        onOpenChange={setModeDialogOpen}
        onSetMode={handleSetMode}
      />

      <ObjectiveDialog
        open={objectiveDialogOpen}
        onOpenChange={setObjectiveDialogOpen}
        onSetObjective={handleSetObjective}
      />

      {/* Global styles for animations */}
      <style>
        {`
          @keyframes style-pulse {
            0% {
              box-shadow: 0 0 5px 2px rgba(59, 130, 246, 0.2);
            }
            50% {
              box-shadow: 0 0 8px 4px rgba(59, 130, 246, 0.4);
            }
            100% {
              box-shadow: 0 0 5px 2px rgba(59, 130, 246, 0.2);
            }
          }
          
          .style-glow {
            animation: style-pulse 10s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default Practice;
