
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, ToggleLeft, ToggleRight, Check, X } from "lucide-react";
import { Question } from "@/types/QuestionInterface";
import { Input } from "@/components/ui/input";

// NEW: Allow navigation handlers as optional props
interface PracticeDisplayProps {
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer?: string | null;
  isCorrect?: boolean | null;
  checkAnswer?: (answer: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onJumpTo?: (index: number) => void;
  displaySettings: {
    fontFamily: string;
    fontSize: number;
    colorStyle: string;
  };
  boardColor: string;
  colorSettings: {
    content: string;
    keyPhrase: string;
    formula: string;
  };
  activeTab: "problem" | "solution" | "quote";
}

const PracticeDisplay = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer: propSelectedAnswer,
  isCorrect: propIsCorrect,
  checkAnswer: propCheckAnswer,
  onNext,
  onPrev,
  onJumpTo,
  displaySettings,
  boardColor,
  colorSettings,
  activeTab,
}: PracticeDisplayProps) => {
  // If handlers aren't provided (using sample data), manage local state:
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<string | null>(null);
  const [localIsCorrect, setLocalIsCorrect] = useState<boolean | null>(null);
  const [showGoToInput, setShowGoToInput] = useState(false);
  const [targetQuestion, setTargetQuestion] = useState('');
  const [inputError, setInputError] = useState('');
  const [isMultipleChoice, setIsMultipleChoice] = useState(true);
  const [fillInAnswer, setFillInAnswer] = useState('');

  // Use either prop or local state
  const selectedAnswer = propSelectedAnswer !== undefined ? propSelectedAnswer : localSelectedAnswer;
  const isCorrect = propIsCorrect !== undefined ? propIsCorrect : localIsCorrect;

  // Local answer check if not provided via props
  const localCheckAnswer = (answer: string) => {
    if (!currentQuestion) return;
    const correct = answer === currentQuestion.correctAnswer;
    setLocalSelectedAnswer(answer);
    setLocalIsCorrect(correct);
    // Optionally: toast messages or custom logic
  };

  // Use propCheckAnswer or fallback to local
  const checkAnswer = propCheckAnswer || localCheckAnswer;

  // Navigation logic: use provided handler or fallback
  const nextQuestion = () => {
    if (onNext) onNext();
    else setLocalSelectedAnswer(null), setLocalIsCorrect(null);
  };
  const prevQuestion = () => {
    if (onPrev) onPrev();
    else setLocalSelectedAnswer(null), setLocalIsCorrect(null);
  };
  const handleGoToQuestion = () => {
    const questionNumber = parseInt(targetQuestion);
    if (isNaN(questionNumber) || questionNumber < 1 || questionNumber > totalQuestions) {
      setInputError(`Please enter a number between 1 and ${totalQuestions}`);
      return;
    }
    setTargetQuestion('');
    setShowGoToInput(false);
    setInputError('');
    if (onJumpTo) onJumpTo(questionNumber - 1);
  };

  const handleSubmitFillIn = () => {
    checkAnswer(fillInAnswer);
    setFillInAnswer('');
  };

  const toggleQuestionType = () => {
    setIsMultipleChoice(!isMultipleChoice);
    setFillInAnswer('');
    setLocalSelectedAnswer(null);
    setLocalIsCorrect(null);
  };

  if (!currentQuestion) {
    return (
      <div className="w-full p-8 text-center">No question selected</div>
    );
  }

  // --- UI Below ---
  return (
    <>
      {/* Main Content Container */}
      <div className="flex gap-4 h-[calc(100vh-300px)] w-full px-[28px]">
        {/* Left Section - Question & Choices */}
        <div
          className="flex-1 w-[70%] overflow-y-auto"
          style={{
            backgroundColor: boardColor === 'black' ? '#000' : boardColor === 'green' ? '#f0fdf4' : '#fff',
            color: boardColor === 'black' ? '#fff' : colorSettings.content,
          }}
        >
          <div
            className="mb-8 pr-4 py-0"
            style={{
              fontFamily: displaySettings.fontFamily,
              fontSize: `${displaySettings.fontSize}px`,
              color: colorSettings.content,
              background:
                displaySettings.colorStyle === 'gradient'
                  ? 'linear-gradient(145deg, #f8fafc 0%, #f0fdf4 100%)'
                  : '#ffffff',
            }}
          >
            <div className="flex items-center mb-4 justify-between">
              <h2
                className="text-2xl font-semibold"
                style={{
                  fontFamily: displaySettings.fontFamily,
                  color: colorSettings.content,
                }}
              >
                Question {currentQuestionIndex + 1}
              </h2>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={toggleQuestionType}
              >
                <span className="text-sm text-gray-500">
                  {isMultipleChoice ? "Multiple Choice" : "Fill-in"}
                </span>
                {isMultipleChoice ? (
                  <ToggleRight className="h-6 w-6 text-blue-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-500" />
                )}
              </div>
            </div>
            {/* Question Content */}
            <p
              className="mb-6 leading-relaxed"
              style={{
                fontFamily: displaySettings.fontFamily,
                fontSize: `${displaySettings.fontSize}px`,
                color: colorSettings.content,
              }}
            >
              {currentQuestion.content.split('**').map((part, i) =>
                i % 2 === 1 ? (
                  <span
                    key={i}
                    className="font-bold"
                    style={{
                      color: colorSettings.keyPhrase,
                      fontFamily: displaySettings.fontFamily,
                    }}
                  >
                    {part}
                  </span>
                ) : (
                  part
                )
              )}
            </p>
            {/* Answer Choices or Fill-in Input */}
            {isMultipleChoice ? (
              <div className="space-y-4">
                {(currentQuestion.choices || []).map((choice, index) => (
                  <div
                    key={index}
                    onClick={() => checkAnswer(choice)}
                    style={{
                      borderColor:
                        selectedAnswer === choice
                          ? isCorrect
                            ? '#10b981'
                            : '#ef4444'
                          : '#e5e7eb',
                      backgroundColor:
                        selectedAnswer === choice
                          ? isCorrect
                            ? '#ecfdf5'
                            : '#fef2f2'
                          : 'transparent',
                      fontFamily: displaySettings.fontFamily,
                      fontSize: `${displaySettings.fontSize}px`,
                      color: colorSettings.content,
                    }}
                    className="p-4 border-1 cursor-pointer transition-colors bg-transparent shadow-md hover:shadow-large py-[10px] px-[16px] rounded-full"
                  >
                    <span className="mr-2 text-gray-500">{index + 1}.</span>
                    <span className={selectedAnswer === choice ? "font-medium" : ""}>
                      {choice}
                    </span>
                    {selectedAnswer === choice && (
                      <span className="float-right">
                        {isCorrect ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    value={fillInAnswer}
                    onChange={(e) => setFillInAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="flex-1 p-4 border bg-white text-gray-800 shadow-md rounded-md"
                    style={{
                      fontFamily: displaySettings.fontFamily,
                      fontSize: `${displaySettings.fontSize}px`,
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitFillIn()}
                  />
                  <Button onClick={handleSubmitFillIn} className="shadow-md">
                    Submit
                  </Button>
                </div>
                {selectedAnswer && (
                  <div
                    className={`p-4 mt-2 rounded-md ${
                      isCorrect
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {isCorrect ? (
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-600 mr-2" />
                        <span>Correct answer!</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <X className="h-5 w-5 text-red-600 mr-2" />
                        <span>
                          Incorrect. The correct answer is: {currentQuestion.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Right Section - Solution/Graph/Quote */}
        <div className="w-[30%] min-w-[300px] sticky top-32">
          {/* ... your solution, graph, and quote rendering here ... */}
        </div>
      </div>
      {/* Go to Question Popup */}
      {showGoToInput && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white border rounded-lg shadow-lg p-4 w-64 animate-in fade-in slide-in-from-bottom-5 z-20">
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
            {inputError && <div className="text-sm text-red-500">{inputError}</div>}
            <Button variant="default" size="sm" className="w-full" onClick={handleGoToQuestion}>
              Go
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PracticeDisplay;
