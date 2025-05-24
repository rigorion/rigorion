
import React, { useState, useCallback } from "react";
import { Question } from "@/types/QuestionInterface";
import { useQuestions } from "@/contexts/QuestionsContext";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Import refactored components
import PracticeHeader from "@/components/practice/PracticeHeader";
import PracticeProgress from "@/components/practice/PracticeProgress";
import PracticeDisplay from "@/components/practice/PracticeDisplay";
import PracticeFooter from "@/components/practice/PracticeFooter";
import ContentSection from "@/components/practice/ContentSection";
import ModeDialog from "@/components/practice/ModeDialog";
import ObjectiveDialog from "@/components/practice/ObjectiveDialogue";
import { Sidebar } from "@/components/practice/Sidebar";
import SettingsDialog from "@/components/practice/SettingsDialog";

interface PracticeContentProps {
  questions?: Question[];
}

export default function PracticeContent({ questions: propQuestions }: PracticeContentProps) {
  const { toast } = useToast();
  // Use questions from props or from context
  const questionsContext = useQuestions();
  const isUsingContext = !propQuestions;
  
  const questions = propQuestions || questionsContext.questions;
  const isLoading = isUsingContext ? questionsContext.isLoading : false;
  const error = isUsingContext ? questionsContext.error : null;
  const refreshQuestions = isUsingContext ? questionsContext.refreshQuestions : () => {};
  
  // Basic question and UI states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
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
  
  // New settings dialog state
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [displaySettings, setDisplaySettings] = useState({
    fontFamily: 'inter',
    fontSize: 14,
    colorStyle: 'plain' as const,
    textColor: '#374151'
  });

  // Stats and feedback states
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [showCommunityStats, setShowCommunityStats] = useState(false);
  
  const [boardColor, setBoardColor] = useState('white');
  const [colorSettings, setColorSettings] = useState({
    content: '#374151',
    keyPhrase: '#2563eb',
    formula: '#dc2626'
  });

  // Get current question
  const currentQuestion = questions.length > 0 && currentQuestionIndex < questions.length 
    ? questions[currentQuestionIndex]
    : null;

  // Update progress effect
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

  // Update displaySettings when settings change
  useEffect(() => {
    if (displaySettings.textColor) {
      setContentColor(displaySettings.textColor);
      setColorSettings(prev => ({
        ...prev,
        content: displaySettings.textColor
      }));
    }
  }, [displaySettings.textColor]);

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
    } else if (key === 'textColor') {
      setContentColor(value as string);
      setDisplaySettings(prev => ({
        ...prev,
        textColor: value as string
      }));
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
    const maxIndex = questions.length > 0 ? questions.length - 1 : 0;
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

  // Handler for opening the settings dialog
  const handleOpenSettings = () => {
    setSettingsDialogOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading secure questions...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error.message}</span>
        </div>
        <Button className="mt-4" onClick={() => refreshQuestions()}>
          Retry
        </Button>
      </div>
    );
  }

  // No questions state
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No Questions!</strong>
          <span className="block sm:inline"> No questions available.</span>
        </div>
      </div>
    );
  }

  return (
    <>
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
        totalQuestions={questions.length} 
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
        <CollapsibleContent className="absolute left-0 top-[56px] z-50 transform transition-all duration-300 ease-in-out">
          {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
        </CollapsibleContent>
      </Collapsible>

      {/* Main Content Container */}
      <div className="flex max-w-full mx-auto w-full flex-grow py-[28px]">
        {/* Main Content */}
        {currentQuestion ? (
          <PracticeDisplay 
            currentQuestion={currentQuestion} 
            selectedAnswer={selectedAnswer} 
            isCorrect={isCorrect} 
            checkAnswer={checkAnswer} 
            currentQuestionIndex={currentQuestionIndex} 
            totalQuestions={questions.length} 
            displaySettings={displaySettings}
            boardColor={boardColor} 
            colorSettings={colorSettings}
            activeTab={activeTab} 
          />
        ) : (
          <div className="w-full p-8 text-center">No question selected</div>
        )}
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

      {/* Settings Dialog */}
      <SettingsDialog 
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        settings={displaySettings}
        onApply={handleUpdateStyle}
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
    </>
  );
}

// Needed for useEffect
import { useEffect } from 'react';
