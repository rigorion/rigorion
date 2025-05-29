
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, ToggleLeft, ToggleRight, Check, X } from "lucide-react";
import { Question } from "@/types/QuestionInterface";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { isDarkMode } = useTheme();
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

  // Helper function to get graph URL from the graph field
  const getGraphUrl = (question: Question) => {
    if (!question.graph) return null;
    
    // If graph is an object with url property
    if (typeof question.graph === 'object' && question.graph.url) {
      return question.graph.url;
    }
    
    // If graph is a string URL
    if (typeof question.graph === 'string' && question.graph.trim() !== '') {
      return question.graph.trim();
    }
    
    return null;
  };

  if (!currentQuestion) {
    return (
      <div className={`w-full p-8 text-center ${isDarkMode ? 'text-green-300' : 'text-gray-700'}`}>No question selected</div>
    );
  }

  const graphUrl = getGraphUrl(currentQuestion);

  return (
    <>
      {/* Main Content Container - Made responsive */}
      <div className="flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-300px)] w-full px-2 sm:px-[28px]">
        {/* Left Section - Question & Choices */}
        <div
          className="flex-1 w-full lg:w-[70%] overflow-y-auto"
          style={{
            backgroundColor: boardColor === 'black' ? '#000' : boardColor === 'green' ? '#f0fdf4' : (isDarkMode ? '#1f2937' : '#fff'),
            color: boardColor === 'black' ? '#fff' : (isDarkMode ? '#fff' : colorSettings.content),
          }}
        >
          <div
            className="mb-6 sm:mb-8 pr-2 sm:pr-4 py-0"
            style={{
              fontFamily: displaySettings.fontFamily,
              fontSize: `${displaySettings.fontSize}px`,
              color: isDarkMode ? '#fff' : colorSettings.content,
              background:
                displaySettings.colorStyle === 'gradient'
                  ? (isDarkMode ? 'linear-gradient(145deg, #374151 0%, #1f2937 100%)' : 'linear-gradient(145deg, #f8fafc 0%, #f0fdf4 100%)')
                  : (isDarkMode ? '#1f2937' : '#ffffff'),
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 justify-between gap-2">
              <h2
                className="text-xl sm:text-2xl font-semibold"
                style={{
                  fontFamily: displaySettings.fontFamily,
                  color: isDarkMode ? '#fff' : colorSettings.content,
                }}
              >
                Question {currentQuestionIndex + 1}
              </h2>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={toggleQuestionType}
              >
                <span className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-gray-500'}`}>
                  {isMultipleChoice ? "Multiple Choice" : "Fill-in"}
                </span>
                {isMultipleChoice ? (
                  <ToggleRight className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-blue-600'}`} />
                ) : (
                  <ToggleLeft className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-gray-500'}`} />
                )}
              </div>
            </div>

            {/* Question Content */}
            <p
              className="mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base"
              style={{
                fontFamily: displaySettings.fontFamily,
                fontSize: `${displaySettings.fontSize}px`,
                color: isDarkMode ? '#fff' : colorSettings.content,
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

            {/* Graph Display - Only if graph URL exists */}
            {graphUrl && (
              <div className="mb-6 flex justify-center">
                <img
                  src={graphUrl}
                  alt="Question graph"
                  className="max-w-full max-h-32"
                  style={{ border: 'none', height: 'auto' }}
                  onError={(e) => {
                    // Hide the image if it fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Answer Choices or Fill-in Input - Made responsive with 2 rows */}
            {isMultipleChoice ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {(currentQuestion.choices || []).map((choice, index) => {
                  const choiceLetter = String.fromCharCode(65 + index); // A, B, C, D
                  const isSelected = selectedAnswer === choiceLetter || selectedAnswer === choice;
                  const isCorrectChoice = currentQuestion.correctAnswer === choiceLetter;
                  
                  return (
                    <div
                      key={index}
                      onClick={() => checkAnswer(choiceLetter)}
                      className={`p-3 sm:p-4 border-1 cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg py-2 sm:py-[10px] px-3 sm:px-[16px] rounded-full relative overflow-hidden text-sm sm:text-base ${
                        isSelected && isCorrect 
                          ? (isDarkMode ? 'border-green-400 bg-green-900/50 animate-pulse' : 'border-green-500 bg-green-50 animate-pulse')
                          : isSelected && !isCorrect 
                          ? (isDarkMode ? 'border-red-400 bg-red-900/50' : 'border-red-500 bg-red-50')
                          : (isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-transparent')
                      }`}
                      style={{
                        fontFamily: displaySettings.fontFamily,
                        fontSize: `${Math.max(displaySettings.fontSize - 2, 12)}px`,
                        color: isDarkMode ? '#fff' : colorSettings.content,
                      }}
                    >
                      {/* Green animation overlay for correct answer */}
                      {isSelected && isCorrect && (
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-green-500/30 to-green-400/20 animate-ping rounded-full"></div>
                      )}
                      
                      <span className={`mr-2 font-bold ${isDarkMode ? 'text-green-400' : 'text-gray-500'}`}>{choiceLetter}.</span>
                      <span className={isSelected ? "font-medium relative z-10" : "relative z-10"}>
                        {choice}
                      </span>
                      {isSelected && (
                        <span className="float-right relative z-10">
                          {isCorrect ? (
                            <Check className="h-5 w-5 text-green-600 animate-bounce" />
                          ) : (
                            <X className="h-5 w-5 text-red-600" />
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={fillInAnswer}
                    onChange={(e) => setFillInAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className={`flex-1 p-3 sm:p-4 border shadow-md rounded-md text-sm sm:text-base ${
                      isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
                    }`}
                    style={{
                      fontFamily: displaySettings.fontFamily,
                      fontSize: `${displaySettings.fontSize}px`,
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitFillIn()}
                  />
                  <Button onClick={handleSubmitFillIn} className="shadow-md w-full sm:w-auto">
                    Submit
                  </Button>
                </div>
                {selectedAnswer && (
                  <div
                    className={`p-4 mt-2 rounded-md transition-all duration-300 ${
                      isCorrect
                        ? (isDarkMode ? 'bg-green-900/10 text-green-300 border border-green-600 animate-pulse' : 'bg-green-50 text-green-800 border border-green-200 animate-pulse')
                        : (isDarkMode ? 'bg-red-900/10 text-red-300 border border-red-600' : 'bg-red-50 text-red-800 border border-red-200')
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

        {/* Right Section - Solution/Graph/Quote - Made responsive */}
        <div className="w-full lg:w-[30%] lg:min-w-[300px] mt-4 lg:mt-0 lg:sticky lg:top-32">
          {activeTab === "solution" && (
            <div className={`p-4 sm:p-6 rounded-lg h-full overflow-y-auto ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-green-300' : 'text-blue-600'}`}>Solution</h3>
              
              {/* Enhanced Solution with HTML formatting */}
              <div className={`mb-6 p-4 rounded-lg border-l-4 ${
                isDarkMode ? 'border-green-400 bg-gray-700' : 'border-blue-500 bg-white'
              }`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-green-300' : 'text-gray-800'}`}>Explanation:</h4>
                <div 
                  className={`leading-relaxed solution-content text-sm sm:text-base ${isDarkMode ? 'text-green-400' : 'text-gray-700'}`}
                  dangerouslySetInnerHTML={{ __html: currentQuestion.solution }}
                  style={{
                    fontFamily: displaySettings.fontFamily,
                    fontSize: `${displaySettings.fontSize}px`,
                  }}
                />
              </div>
              
              {/* Solution Steps */}
              {currentQuestion.solutionSteps && currentQuestion.solutionSteps.length > 0 && (
                <div className="mb-4">
                  <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-green-300' : 'text-gray-800'}`}>Step-by-step solution:</h4>
                  <div className="space-y-3">
                    {currentQuestion.solutionSteps.map((step, index) => (
                      <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border ${
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                      }`}>
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          isDarkMode ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div 
                          className={`text-sm leading-relaxed ${isDarkMode ? 'text-green-400' : 'text-gray-700'}`}
                          style={{
                            fontFamily: displaySettings.fontFamily,
                            fontSize: `${Math.max(displaySettings.fontSize - 2, 12)}px`,
                          }}
                        >
                          {typeof step === 'string' ? step : String(step)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Correct Answer Display */}
              <div className={`mt-4 p-3 border rounded-lg ${
                isDarkMode ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>Correct Answer:</h4>
                <p className={`font-bold text-lg ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>{currentQuestion.correctAnswer}</p>
              </div>
            </div>
          )}

          {activeTab === "quote" && (
            <div className={`p-4 sm:p-6 rounded-lg h-full overflow-y-auto ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-green-300' : 'text-gray-900'}`}>Quote</h3>
              {currentQuestion.quote ? (
                <blockquote className={`text-lg italic border-l-4 pl-4 ${
                  isDarkMode ? 'border-green-400 text-green-400' : 'border-blue-500 text-gray-700'
                }`}>
                  "{currentQuestion.quote.text}"
                  {currentQuestion.quote.source && (
                    <footer className={`mt-2 text-sm ${isDarkMode ? 'text-green-500' : 'text-gray-500'}`}>- {currentQuestion.quote.source}</footer>
                  )}
                </blockquote>
              ) : (
                <p className={`italic ${isDarkMode ? 'text-green-500' : 'text-gray-500'}`}>No quote available for this question.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Go to Question Popup */}
      {showGoToInput && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 border rounded-lg shadow-lg p-4 w-64 animate-in fade-in slide-in-from-bottom-5 z-20 ${
          isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
        }`}>
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
                className={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
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

      {/* Green animation styles */}
      <style>
        {`
          @keyframes green-pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
            }
          }
          
          .animate-green-pulse {
            animation: green-pulse 2s infinite;
          }
        `}
      </style>

      {/* Additional CSS for solution content formatting */}
      <style>
        {`
          .solution-content .formula {
            background-color: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: #dc2626;
            font-weight: 600;
          }
          
          .solution-content strong {
            color: #2563eb;
          }
          
          @keyframes green-pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
            }
          }
          
          .animate-green-pulse {
            animation: green-pulse 2s infinite;
          }
        `}
      </style>
    </>
  );
};

export default PracticeDisplay;
