
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { sampleQuestions } from "@/components/practice/sampleQuestion";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Question } from "@/types/QuestionInterface";

// Import refactored components
import PracticeHeader from "@/components/practice/PracticeHeader";
import PracticeProgress from "@/components/practice/PracticeProgress";
import PracticeTabSelector from "@/components/practice/PracticeTabSelector";
import PracticeDisplay from "@/components/practice/PracticeDisplay";
import PracticeFooter from "@/components/practice/PracticeFooter";
import CommunityStats from "@/components/practice/CommunityStats";
import ModeDialog from "@/components/practice/ModeDialog";
import ObjectiveDialog from "@/components/practice/ObjectiveDialogue";
import SettingsDialog from "@/components/practice/SettingsDialog";

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
  const currentQuestion = sampleQuestions[currentQuestionIndex];  
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
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Stats and feedback states
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [showCommunityStats, setShowCommunityStats] = useState(false);

  // Loading and error states
  const [questions, setQuestions] = useState<Question[]>([]);
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

  // Initialize loading to false since we're using sample data
  useEffect(() => {
    // This ensures the component doesn't get stuck in loading state
    setLoading(false);
    
    // Optionally fetch questions from Supabase in the future
    // const loadQuestions = async () => {
    //   try {
    //     const { data, count } = await fetchQuestions(page, perPage, selectedDifficulty);
    //     if (data) {
    //       setQuestions(data);
    //       setTotalPages(Math.ceil((count || 0) / perPage));
    //     }
    //   } catch (err) {
    //     setError("Failed to load questions");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // loadQuestions();
  }, []);

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

  const handleApplySettings = (key: string, value: string | number) => {
    setDisplaySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Answer checking
  const checkAnswer = (answer: string) => {
    const correct = answer === currentQuestion?.correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => prev + 1);
    }
    
    if (correct && currentQuestionIndex < sampleQuestions.length - 1) {
      setTimeout(nextQuestion, 1500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
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

  // Display a loading indicator while content is loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-blue-500">Loading practice questions...</p>
      </div>
    );
  }

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
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenObjective={() => setObjectiveDialogOpen(true)}
        onOpenMode={() => setModeDialogOpen(true)}
        mode={mode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Progress Bar */}
      <PracticeProgress
        correctAnswers={correctAnswers}
        incorrectAnswers={incorrectAnswers}
        totalQuestions={totalQuestions}
        timerDuration={timerDuration}
        isTimerActive={isTimerActive}
        handleTimerComplete={handleTimerComplete}
        mode={mode}
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
      />

      {/* Sidebar */}
      <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen}>
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

      {/* Main Content */}
      <PracticeDisplay
        currentQuestion={currentQuestion}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
        checkAnswer={checkAnswer}
        nextQuestion={nextQuestion}
        prevQuestion={prevQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        displaySettings={displaySettings}
        boardColor={boardColor}
        colorSettings={colorSettings}
        activeTab={activeTab}
      />

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

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={displaySettings}
        onApply={handleApplySettings}
      />

      <ObjectiveDialog
        open={objectiveDialogOpen}
        onOpenChange={setObjectiveDialogOpen}
        onSetObjective={handleSetObjective}
      />
    </div>
  );
};

export default Practice;
