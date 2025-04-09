
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { Question } from "@/types/QuestionInterface";

interface PracticeDisplayProps {
  currentQuestion: Question;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  checkAnswer: (answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
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
  selectedAnswer,
  isCorrect,
  checkAnswer,
  nextQuestion,
  prevQuestion,
  currentQuestionIndex,
  totalQuestions,
  displaySettings,
  boardColor,
  colorSettings,
  activeTab
}: PracticeDisplayProps) => {
  const [showGoToInput, setShowGoToInput] = useState(false);
  const [targetQuestion, setTargetQuestion] = useState('');
  const [inputError, setInputError] = useState('');

  // Handler for "Go to Question"
  const handleGoToQuestion = () => {
    const questionNumber = parseInt(targetQuestion);
    
    // Validate input
    if (isNaN(questionNumber)) {
      setInputError('Please enter a valid number');
      return;
    }
    
    if (questionNumber < 1 || questionNumber > totalQuestions) {
      setInputError(`Please enter a number between 1 and ${totalQuestions}`);
      return;
    }

    // Reset UI states
    setTargetQuestion('');
    setShowGoToInput(false);
    setInputError('');
  };

  return (
    <>
      {/* Main Content Container */}
      <div className="flex gap-4 px-6 h-[calc(100vh-300px)] w-full">
        {/* Left Section - Question & Choices (70% width) */}
        <div className="flex-1 w-[70%] overflow-y-auto" 
          style={{ 
            backgroundColor: boardColor === 'black' ? '#000' : 
                              boardColor === 'green' ? '#f0fdf4' : '#fff',
            color: boardColor === 'black' ? '#fff' : colorSettings.content
          }}
        >
          {currentQuestion && (
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
                    <span key={i} className="font-bold" style={{ color: colorSettings.keyPhrase }}>
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-emerald-500">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-red-500">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Section - Solution/Idea/Graph (30% width) */}
        <div className="w-[30%] min-w-[300px] sticky top-32">
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                      </svg>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Step-by-Step Solution
                    </h3>
                    <ol className="space-y-3 list-decimal list-inside pl-4">
                      {currentQuestion.solutionSteps.map((step, index) => (
                        <li key={`step-${index}`} className="mb-3" style={{ color: colorSettings.content }}>
                          {step.includes("x") || step.includes("=") || step.includes("+") ? 
                            <span style={{ color: colorSettings.formula }}>{step}</span> : 
                            step
                          }
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Quote Section */}
                {activeTab === 'quote' && currentQuestion.quote && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                      </svg>
                      Historical Context
                    </h3>
                    <blockquote className="italic border-l-4 border-emerald-500 pl-4 py-2" style={{ color: colorSettings.keyPhrase }}>
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

      {/* Bottom Navigation */}
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
            <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-4 w-64 animate-in fade-in slide-in-from-bottom-5">
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
          disabled={currentQuestionIndex >= totalQuestions - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </>
  );
};

export default PracticeDisplay;
