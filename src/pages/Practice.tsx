import { useState, useEffect } from "react";
import { sampleQuestions } from "@/components/practice/sampleQuestion";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Question } from "@/types/QuestionInterface";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Import refactored components
import PracticeHeader from "@/components/practice/PracticeHeader";
import PracticeProgress from "@/components/practice/PracticeProgress";
import PracticeDisplay from "@/components/practice/PracticeDisplay";
import PracticeFooter from "@/components/practice/PracticeFooter";
import ModeDialog from "@/components/practice/ModeDialog";
import ObjectiveDialog from "@/components/practice/ObjectiveDialogue";

interface PracticeProps {
  chapterTitle?: string;
  totalQuestions?: number;
}

const chapters = ["Chapter 1: Introduction to Mathematics", "Chapter 2: Basic Algebra", "Chapter 3: Geometry Fundamentals", "Chapter 4: Probability & Statistics", "Chapter 5: Advanced Functions"];

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
  const [objective, setObjective] = useState<{
    type: "questions" | "time";
    value: number;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [modeDialogOpen, setModeDialogOpen] = useState(false);
  const [objectiveDialogOpen, setObjectiveDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"problem" | "solution" | "quote">("problem");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00");
  const [showGoToInput, setShowGoToInput] = useState(false);
  const [targetQuestion, setTargetQuestion] = useState('');
  const [inputError, setInputError] = useState('');

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
    formula: '#dc2626'
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
      setProgress(Math.round(totalAnswered / objective.value * 100));
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
    setObjective({
      type,
      value
    });
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
      setDisplaySettings(prev => ({
        ...prev,
        fontFamily: value as string
      }));
    } else if (key === 'fontSize') {
      setFontSize(value as number);
      setDisplaySettings(prev => ({
        ...prev,
        fontSize: value as number
      }));
    } else if (key === 'contentColor') {
      setContentColor(value as string);
      setColorSettings(prev => ({
        ...prev,
        content: value as string
      }));
    } else if (key === 'keyPhraseColor') {
      setKeyPhraseColor(value as string);
      setColorSettings(prev => ({
        ...prev,
        keyPhrase: value as string
      }));
    } else if (key === 'formulaColor') {
      setFormulaColor(value as string);
      setColorSettings(prev => ({
        ...prev,
        formula: value as string
      }));
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
        variant: "default"
      });
    } else {
      setIncorrectAnswers(prev => prev + 1);
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${currentQuestion.correctAnswer}`,
        variant: "destructive"
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

  // Handler for "Go to Question"
  const handleGoToQuestion = () => {
    const questionNumber = parseInt(targetQuestion);

    // Validate input
    if (isNaN(questionNumber)) {
      setInputError('Please enter a valid number');
      return;
    }
    if (questionNumber < 1 || questionNumber > questions.length) {
      setInputError(`Please enter a number between 1 and ${questions.length}`);
      return;
    }

    // Set new current question index
    setCurrentQuestionIndex(questionNumber - 1);
    setSelectedAnswer(null);
    setIsCorrect(null);

    // Reset UI states
    setTargetQuestion('');
    setShowGoToInput(false);
    setInputError('');
  };

  // Display an error message if there's an error
  if (error) {
    return <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>;
  }

  return <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <PracticeHeader 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        onOpenObjective={() => setObjectiveDialogOpen(true)} 
        onOpenMode={() => setModeDialogOpen(true)} 
        mode={mode} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Progress Bar with Stats and Tabs */}
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
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentQuestionIndex={currentQuestionIndex} 
        currentQuestionHint={currentQuestion?.hint} 
        objective={objective} 
        progress={progress} 
      />

      {/* Sidebar */}
      <Collapsible open={sidebarOpen}>
        <CollapsibleContent className="absolute left-0 top-[56px] h-[calc(100vh-56px)] w-64 bg-white shadow-lg z-50 transform transition-all duration-500 ease-in-out" style={{
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        opacity: sidebarOpen ? 1 : 0
      }}>
          <div className="py-4 px-4">
            <h3 className="text-lg font-semibold mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-600">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              Navigation
            </h3>
            <ul className="space-y-3">
              {chapters.map((chapter, index) => <li key={index}>
                  <Button variant="ghost" className={`w-full justify-start text-left ${selectedChapter === index ? "text-blue-600 font-medium" : "text-gray-700"}`} onClick={() => selectChapter(index)}>
                    {chapter}
                  </Button>
                </li>)}
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Main Content Container */}
      <div className="flex max-w-full mx-auto w-full flex-grow py-[28px]">
        {/* Main Content */}
        <PracticeDisplay 
          currentQuestion={currentQuestion} 
          selectedAnswer={selectedAnswer} 
          isCorrect={isCorrect} 
          checkAnswer={checkAnswer} 
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

      {/* Footer with Navigation Controls */}
      <PracticeFooter 
        onToggleCommunityStats={() => setShowCommunityStats(!showCommunityStats)} 
        onPrevious={prevQuestion} 
        onNext={nextQuestion} 
        currentQuestionIndex={currentQuestionIndex} 
        totalQuestions={questions.length} 
        showGoToInput={showGoToInput} 
        setShowGoToInput={setShowGoToInput} 
        targetQuestion={targetQuestion} 
        setTargetQuestion={setTargetQuestion} 
        handleGoToQuestion={handleGoToQuestion} 
        inputError={inputError} 
      />

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
    </div>;
};

export default Practice;
