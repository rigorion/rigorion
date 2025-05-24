
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

  const selectedAnswer = propSelectedAnswer !== undefined ? propSelectedAnswer : localSelectedAnswer;
  const isCorrect = propIsCorrect !== undefined ? propIsCorrect : localIsCorrect;

  const localCheckAnswer = (answer: string) => {
    if (!currentQuestion) return;
    const correct = answer === currentQuestion.correctAnswer;
    setLocalSelectedAnswer(answer);
    setLocalIsCorrect(correct);
  };

  const checkAnswer = propCheckAnswer || localCheckAnswer;

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
                    className={`p-4 border-1 cursor-pointer transition-all bg-transparent shadow-md hover:shadow-large py-[10px] px-[16px] rounded-full ${
                      selectedAnswer === choice && isCorrect
                        ? 'animate-pulse border-green-500 bg-green-50 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                        : selectedAnswer === choice && !isCorrect
                        ? 'animate-pulse border-red-500 bg-red-50'
                        : ''
                    }`}
                  >
                    <span className="mr-2 text-gray-500">{index + 1}.</span>
                    <span className={selectedAnswer === choice ? "font-medium" : ""}>
                      {choice}
                    </span>
                    {selectedAnswer === choice && (
                      <span className="float-right">
                        {isCorrect ? (
                          <Check className="h-5 w-5 text-green-600 animate-bounce" />
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
                    className={`p-4 mt-2 rounded-md transition-all ${
                      isCorrect
                        ? 'bg-green-50 text-green-800 border border-green-200 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {isCorrect ? (
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-600 mr-2 animate-bounce" />
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
          {activeTab === "solution" && (
            <div className="bg-gray-50 p-6 rounded-lg h-full overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Solution</h3>
              
              {/* Main solution content */}
              <div className="mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {currentQuestion.solution}
                  </p>
                </div>
              </div>
              
              {/* Step-by-step solution */}
              {currentQuestion.solutionSteps && currentQuestion.solutionSteps.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-3 text-gray-800 flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm mr-2">
                      Steps
                    </span>
                    Step-by-step solution
                  </h4>
                  <div className="space-y-3">
                    {currentQuestion.solutionSteps.map((step, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-start gap-3">
                          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                            {index + 1}
                          </span>
                          <p className="text-sm text-gray-700 leading-relaxed flex-1">
                            {typeof step === 'string' ? step : String(step)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional explanation if available */}
              {currentQuestion.explanation && currentQuestion.explanation !== currentQuestion.solution && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-gray-800">Additional Explanation</h4>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "quote" && (
            <div className="bg-gray-50 p-6 rounded-lg h-full overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Quote</h3>
              {currentQuestion.quote ? (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <blockquote className="text-lg italic text-gray-700 leading-relaxed">
                    "{currentQuestion.quote.text}"
                    {currentQuestion.quote.source && (
                      <footer className="mt-4 text-gray-500 text-base not-italic font-medium">
                        — {currentQuestion.quote.source}
                      </footer>
                    )}
                  </blockquote>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-500 italic text-center">No quote available for this question.</p>
                </div>
              )}
            </div>
          )}
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

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes correct-glow {
          0% { box-shadow: 0 0 5px rgba(34,197,94,0.3); }
          50% { box-shadow: 0 0 20px rgba(34,197,94,0.8), 0 0 30px rgba(34,197,94,0.4); }
          100% { box-shadow: 0 0 5px rgba(34,197,94,0.3); }
        }
        
        .animate-correct {
          animation: correct-glow 1s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default PracticeDisplay;
