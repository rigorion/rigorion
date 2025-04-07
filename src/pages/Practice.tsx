import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Questions from "@/components/practice/EncryptedQuestions"; // Import as default export
import { supabase } from "@/lib/supabase";
import { fetchQuestions, fetchQuestionById } from "@/services/questionService";
import { Question } from "@/types/QuestionInterface";
import ContentSection from "@/components/practice/ContentSection";

import {
  Search,
  Link, 
  Mail, 
  MessageCircle,
  Compass,
  Target,
  Clock,
  Bookmark,
  BookOpen,
  Share2,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Menu,
  BookMarked,
  CheckCircle,
  XCircle,
  Music,
  Music2,
  Music4,
  Users,
  Palette
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../components/practice/CountDownTimer";
import ModeDialog from "../components/practice/ModeDialog";
import ObjectiveDialog from "../components/practice/ObjectiveDialogue";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import CommunityStats from "../components/practice/CommunityStats";
import CommentSection from "@/components/practice/CommentSection";
import { sampleQuestions } from "@/components/practice/sampleQuestion";
import SettingsDialog from "@/components/practice/SettingsDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

const Practice = ({ chapterTitle = "Chapter 1", totalQuestions = sampleQuestions.length
}: PracticeProps) => {
  const navigate = useNavigate();

// Basic question and UI states
// In your component
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
  const [timeRemaining, setTimeRemaining] = useState("00:00");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // New states for enhanced progress and music menu
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [isMusicMenuOpen, setIsMusicMenuOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Share dialog state
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Go-to question input states
  const [showGoToInput, setShowGoToInput] = useState(false);
  const [targetQuestion, setTargetQuestion] = useState('');
  const [inputError, setInputError] = useState('');
  // New state to toggle CommunityStats
  const [showCommunityStats, setShowCommunityStats] = useState(false);

    // Add new states for Supabase
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
    const [fontSettings, setFontSettings] = useState({
      questionFont: 'default',
      solutionFont: 'default'
    });
    const [colorSettings, setColorSettings] = useState({
      content: '#374151',
      keyPhrase: '#2563eb',
      formula: '#dc2626',
    });
    const [boardColor, setBoardColor] = useState('white');

// 1. Update the state interface and initial state
const [displaySettings, setDisplaySettings] = useState({
  fontFamily: 'times-new-roman',
  fontSize: 14,
  colorStyle: 'plain' as 'gradient'
});
// 2. Modify handleApplySettings
const handleApplySettings = (key: string, value: string | number) => {
  setDisplaySettings(prev => ({
    ...prev,
    [key]: value
  }));
};
// Handler for "Go to Question"
const handleGoToQuestion = () => {
  const questionNumber = parseInt(targetQuestion);
  
  // Validate input
  if (isNaN(questionNumber)) {
    setInputError('Please enter a valid number');
    return;
  }
  
  // Use sampleQuestions.length instead of totalQuestions prop for accuracy
  if (questionNumber < 1 || questionNumber > sampleQuestions.length) {
    setInputError(`Please enter a number between 1 and ${sampleQuestions.length}`);
    return;
  }

  // Convert to 0-based index and update state
  setCurrentQuestionIndex(questionNumber - 1);
  
  // Reset UI states
  setTargetQuestion('');
  setShowGoToInput(false);
  setInputError('');
  setSelectedAnswer(null);
  setIsCorrect(null);
};

  const correctAnswer = "25π cm²";

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

  // Share handler
  const handleShare = (platform: string) => {
    const currentUrl = window.location.href;
    const message = "Check out this practice platform: ";
    switch(platform) {
      case 'whatsapp':
        window.open(`whatsapp://send?text=${encodeURIComponent(message + currentUrl)}`);
        break;
      case 'email':
        window.open(`mailto:?body=${encodeURIComponent(message + currentUrl)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(currentUrl);
        break;
      default:
        window.open(`https://${platform}.com/share?url=${encodeURIComponent(currentUrl)}`);
    }
    setShowShareDialog(false);
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
  

  // Progress effect
  useEffect(() => {
    if (objective?.type === "questions" && objective.value > 0) {
      const totalAnswered = correctAnswers + incorrectAnswers;
      setProgress(Math.round((totalAnswered / objective.value) * 100));
    }
  }, [correctAnswers, incorrectAnswers, objective]);

  // Audio cleanup effect
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement]);

  // Calculate enhanced progress stats
  function calculateProgress() {
    const total = objective?.type === "questions" 
      ? objective.value 
      : sampleQuestions.length;
    const totalAnswered = correctAnswers + incorrectAnswers;
    
    return {
      correct: (correctAnswers / total) * 100,
      incorrect: (incorrectAnswers / total) * 100,
      unattempted: ((total - totalAnswered) / total) * 100
    };
  }

  // Music handling: auto-play new track if selected
  useEffect(() => {
    if (currentTrack && audioElement) {
      audioElement.play();
    }
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [currentTrack, audioElement]);

  const handleMusicSelect = (trackPath: string) => {
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
    const newAudio = new Audio(trackPath);
    newAudio.loop = true;
    newAudio.play();
    setAudioElement(newAudio);
    setCurrentTrack(trackPath);
    setIsMusicMenuOpen(false);
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

  const getAnswerButtonStyles = (answer: string) => {
    if (selectedAnswer !== answer)
      return "border-2 border-gray-200 rounded-full p-4 hover:bg-gray-50 transition-all text-left flex justify-between items-center";
    if (answer === correctAnswer)
      return "border-2 border-emerald-500 bg-emerald-50 rounded-full p-4 transition-all text-left flex justify-between items-center animate-pulse";
    return "border-2 border-red-500 bg-red-50 rounded-full p-4 transition-all text-left flex justify-between items-center animate-pulse";
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const selectChapter = (index: number) => {
    setSelectedChapter(index);
    setSidebarOpen(false);
  };

  // ProgressBar component
  const ProgressBar = () => {
    const { correct, incorrect } = calculateProgress();
    return (
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
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
          <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <CollapsibleTrigger className="rounded-lg p-2 hover:bg-gray-100">
              <BookMarked className="h-5 w-5 text-blue-500" />
            </CollapsibleTrigger>
          </Collapsible>
          <h1
            className="text-xl font-bold text-gray-800"
            style={{ fontFamily: '"Dancing Script", cursive' }}
          >
            Academic Arc
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
<Button
  variant="outline"
  size="sm"
  onClick={() => setSettingsOpen(true)}
  className="rounded-full"
>
  <Palette className="h-4 w-4 mr-1.5" />
  Display
</Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setObjectiveDialogOpen(true)}
            className="rounded-full text-gray-500"
          >
            <Target className="h-4 w-4 mr-1.5 text-blue-500" />
            Chapter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setObjectiveDialogOpen(true)}
            className="rounded-full text-gray-500"
          >
            <Target className="h-4 w-4 mr-1.5 text-blue-500" />
            Set Objectives
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModeDialogOpen(true)}
            className={`rounded-full ${mode !== "manual" ? "text-emerald-500" : ""}`}
          >
            <Clock className="h-4 w-4 mr-1.5" />
            {mode === "manual" ? "Manual" : mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        </div>
      </header>

      {/* Enhanced Progress Section */}
      <div className="px-3 py-2 border-b bg-white">
        <div className="mb-1">
          <ProgressBar />
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

      {/* Sidebar */}
      <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <CollapsibleContent
          className="absolute left-0 top-[56px] h-[calc(100vh-56px)] w-64 bg-white shadow-lg z-50 transform transition-all duration-500 ease-in-out"
          style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", opacity: sidebarOpen ? 1 : 0 }}
        >
          <div className="py-4 px-4">
            <h3 className="text-lg font-semibold mb-4">
              <Compass className="h-5 w-5 text-gray-600" />
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
<div className="">
  <div className="flex justify-center px-6 py-2">
    <div className="inline-flex rounded-lg bg-white p-1 border">
      <Button
        variant="ghost"
        className={`px-8 rounded-full transition-all ${activeTab === "problem" 
          ? "text-red-500 bg-white shadow-md shadow-red-100" 
          : "text-gray-500 hover:text-red-400"}`}
        onClick={() => setActiveTab("problem")}
      >
        <Target className="h-4 w-4 text-gray-400 mr-2" />
        Problem
      </Button>
      <Button
        variant="ghost"
        className={`px-8 rounded-full transition-all ${activeTab === "solution" 
          ? "text-yellow-500 bg-white shadow-md shadow-yellow-100" 
          : "text-gray-500 hover:text-yellow-400"}`}
        onClick={() => setActiveTab("solution")}
      >
        <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
        Solution
      </Button>
      <Button
        variant="ghost"
        className={`px-8 rounded-full transition-all ${activeTab === "quote" 
          ? "text-green-500 bg-white shadow-md shadow-green-100" 
          : "text-gray-500 hover:text-green-400"}`}
        onClick={() => setActiveTab("quote")}
      >
        <BookMarked className="h-4 w-4 text-gray-400 mr-2" />
        Idea
      </Button>
    </div>
  </div>
</div>

{/* Main Content Container */}
<div className="flex gap-8 px-6 h-[calc(100vh-300px)]">
  {/* Left Section - Question & Choices (60% width) */}
  <div className="flex-1 w-[60%] overflow-y-auto" style={{ 
       backgroundColor: boardColor === 'black' ? '#000' : 
                       boardColor === 'green' ? '#f0fdf4' : '#fff',
       color: boardColor === 'black' ? '#fff' : colorSettings.content
     }}>
    {currentQuestion && (
      // 3. Apply styles to question content section
// In your Practice component
<div className="mb-8 pr-4" style={{
  fontFamily: displaySettings.fontFamily,
  fontSize: `${displaySettings.fontSize}px`,
  background: displaySettings.colorStyle === 'gradient' 
    ? 'linear-gradient(145deg, #f8fafc 0%, #f0fdf4 100%)' 
    : '#ffffff'
}}>
  <h2 className="text-2xl font-semibold mb-4">
    Question {currentQuestionIndex + 1}
  </h2>
  
  {/* Question Content */}
  <p className="mb-6 leading-relaxed">
    {currentQuestion.content.split('**').map((part, i) => 
      i % 2 === 1 ? (
        <span key={i} className="font-bold text-blue-600">
          {part}
        </span>
      ) : (
        part
      )
    )}
  </p>

  {/* Answer Choices */}
  <div className="space-y-4">
    {currentQuestion.choices.map((choice, index) => (
      <div
        key={index}
        className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => checkAnswer(choice)}
        style={{
          borderColor: selectedAnswer === choice 
            ? (isCorrect ? '#10b981' : '#ef4444')
            : '#e5e7eb',
          backgroundColor: selectedAnswer === choice
            ? (isCorrect ? '#ecfdf5' : '#fef2f2')
            : 'transparent'
        }}
      >
        <span className="mr-2 text-gray-500">{index + 1}.</span>
        <span className={selectedAnswer === choice ? "font-medium" : ""}>
          {choice}
        </span>
        {selectedAnswer === choice && (
          <span className="float-right">
            {isCorrect ? (
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </span>
        )}
      </div>
    ))}
  </div>
</div>
    )}
  </div>
  {/* Right Section - Solution/Idea/Graph (40% width) */}
<div className="w-[40%] min-w-[400px] sticky top-32">
  <div 
    className={`bg-white rounded-lg shadow-md border p-6 transition-all duration-300 ${
      (currentQuestion?.graph || 
      (activeTab === 'solution' && currentQuestion?.solutionSteps?.length > 0) || 
      (activeTab === 'quote' && currentQuestion?.quote)) 
        ? 'opacity-100' 
        : 'opacity-0 pointer-events-none'
    }`}
    style={{ 
      maxHeight: 'calc(100vh - 300px)',
      minHeight: '400px',
      overflowY: 'auto'
    }}
  >
    {currentQuestion && (
      <>
        {/* Graph Section */}
        {currentQuestion.graph && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-600">
              <Compass className="h-5 w-5" />
              Visual Explanation
            </h3>
            <img 
              src={currentQuestion.graph.url}
              alt={currentQuestion.graph.alt || "Diagram explanation"}
              className="rounded-lg border p-2 w-full h-auto max-h-[300px] object-contain"
            />
            {currentQuestion.graph.caption && (
              <p className="text-sm text-gray-500 mt-2">
                {currentQuestion.graph.caption}
              </p>
            )}
          </div>
        )}

        {/* Solution Steps */}
        {activeTab === 'solution' && currentQuestion.solutionSteps?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
              <CheckCircle className="h-5 w-5" />
              Step-by-Step Solution
            </h3>
            <ol className="space-y-3 list-decimal list-inside pl-4">
              {currentQuestion.solutionSteps.map((step, index) => (
                <li key={`step-${index}`} className="mb-3 text-gray-700">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Quote Section */}
        {activeTab === 'quote' && currentQuestion.quote && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-600">
              <BookMarked className="h-5 w-5" />
              Historical Context
            </h3>
            <blockquote className="italic text-gray-700 border-l-4 border-emerald-500 pl-4 py-2">
              {currentQuestion.quote.text}
            </blockquote>
            {currentQuestion.quote.source && (
              <div className="mt-4 text-sm text-gray-500">
                - {currentQuestion.quote.source}
              </div>
            )}
          </div>
        )}
      </>
    )}
  </div>
</div>

</div>

      {/* Footer Navigation */}
      <div className="border-t px-6 py-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          {/* Music Menu Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setIsMusicMenuOpen(!isMusicMenuOpen)}
            >
              <Music className="h-4 w-4" />
              {currentTrack ? "Playing" : "Music"}
            </Button>
            {isMusicMenuOpen && (
              <div className="absolute bottom-full mb-2 left-0 bg-white border rounded-lg shadow-lg p-2 w-48">
                <div className="text-sm text-gray-700 px-3 py-1">Background Music</div>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleMusicSelect("/music/ambient.mp3")}
                >
                  <Music2 className="h-4 w-4 mr-2" />
                  Ambient Study
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleMusicSelect("/music/classical.mp3")}
                >
                  <Music4 className="h-4 w-4 mr-2" />
                  Classical
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    if (audioElement) {
                      audioElement.pause();
                      setAudioElement(null);
                      setCurrentTrack(null);
                    }
                  }}
                >
                  <Music className="h-4 w-4 mr-2" />
                  Off
                </Button>
              </div>
            )}
          </div>
          {/* Community Stats Toggle Button next to Music Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setShowCommunityStats(!showCommunityStats)}
            >
              <Users className="h-4 w-4" />
              Stats
            </Button>
          </div>
        </div>

        {/* Secondary Footer Navigation */}
      <div className="border-t px-6 py-4 flex items-center justify-between gap-4 bg-gray-50">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={prevQuestion}
          disabled={currentQuestionIndex <= 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="relative flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setShowGoToInput(!showGoToInput)}
          >
            <Search className="h-4 w-4 mr-2" />
            Go to Question
          </Button>

          {showGoToInput && (
            <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-4 w-64">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={totalQuestions}
                    value={targetQuestion}
                    onChange={(e) => {
                      setTargetQuestion(e.target.value);
                      setInputError('');
                    }}
                    className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter question (1-${totalQuestions})`}
                    onKeyPress={(e) => e.key === 'Enter' && handleGoToQuestion()}
                  />
                </div>
                {inputError && (
                  <div className="text-sm text-red-500">{inputError}</div>
                )}
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={handleGoToQuestion}
                >
                  Go
                </Button>
              </div>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          className="rounded-full"
          onClick={nextQuestion}
          disabled={currentQuestionIndex >= sampleQuestions.length - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
        {/* checking the secured data */}
      
        <CommentSection />
        <Questions id="q1"/>
      </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full relative"
            onClick={() => setShowShareDialog(!showShareDialog)}
          >
            <Share2 className="h-4 w-4" />
            {showShareDialog && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-2 w-48">
                <div className="text-sm font-medium text-gray-700 p-2">Share Practice Session</div>
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleShare('whatsapp')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleShare('email')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleShare('copy')}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
            )}
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>

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

     

      
// 5. Update SettingsDialog integration
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
function setBoardColor(value: string) {
  throw new Error("Function not implemented.");
}
