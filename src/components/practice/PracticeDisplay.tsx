import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, ToggleLeft, ToggleRight, Check, X, Bot } from "lucide-react";
import { Question } from "@/types/QuestionInterface";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/contexts/ThemeContext";
import { analyzeWithAIML } from "@/services/aimlApi";

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
    textColor: string;
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
  const [writingAnswer, setWritingAnswer] = useState('');
  const [aiEvaluation, setAiEvaluation] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  const selectedAnswer = propSelectedAnswer !== undefined ? propSelectedAnswer : localSelectedAnswer;
  const isCorrect = propIsCorrect !== undefined ? propIsCorrect : localIsCorrect;

  // Check if this is a SAT Writing module
  const isSATWriting = currentQuestion?.chapter?.toLowerCase().includes('writing') || 
                      currentQuestion?.module?.toLowerCase().includes('writing');

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

  const handleAIEvaluation = async () => {
    if (!writingAnswer.trim()) return;
    
    setIsEvaluating(true);
    try {
      const prompt = `Please evaluate this SAT Writing response:

Question: ${currentQuestion?.content}

Student's Response: ${writingAnswer}

Please provide a detailed evaluation including:
1. Grammar and mechanics
2. Organization and structure
3. Use of evidence and examples
4. Clarity and style
5. Overall score out of 6 points
6. Specific suggestions for improvement

Keep the evaluation constructive and educational.`;

      const evaluation = await analyzeWithAIML({ query: prompt });
      setAiEvaluation(evaluation);
    } catch (error) {
      console.error('AI Evaluation error:', error);
      setAiEvaluation('Unable to evaluate at this time. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const toggleQuestionType = () => {
    if (!isSATWriting) {
      setIsMultipleChoice(!isMultipleChoice);
      setFillInAnswer('');
      setLocalSelectedAnswer(null);
      setLocalIsCorrect(null);
    }
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

  // Font mapping for consistent styling
  const getFontFamily = () => {
    switch (displaySettings.fontFamily) {
      case 'inter': return 'Inter, sans-serif';
      case 'roboto': return 'Roboto, sans-serif';
      case 'open-sans': return 'Open Sans, sans-serif';
      case 'comic-sans': return 'Comic Sans MS, cursive';
      case 'courier-new': return 'Courier New, monospace';
      case 'poppins': return 'Poppins, sans-serif';
      case 'merriweather': return 'Merriweather, serif';
      case 'dancing-script': return 'Dancing Script, cursive';
      case 'ubuntu': return 'Ubuntu, sans-serif';
      default: return 'Inter, sans-serif';
    }
  };

  // Main content styling - applies to question content, choices, and solutions
  const contentTextStyle = {
    fontFamily: getFontFamily(),
    fontSize: `${displaySettings.fontSize}px`,
    color: displaySettings.textColor,
    lineHeight: '1.6'
  };

  if (!currentQuestion) {
    return (
      <div className={`w-full p-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>No question selected</div>
    );
  }

  const graphUrl = getGraphUrl(currentQuestion);

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-300px)] w-full px-2 sm:px-[28px]">
      {/* Content Section */}
      <div className={`flex-1 rounded-xl p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`} style={{ backgroundColor: boardColor }}>
        {/* Question Content - Always visible */}
        <div className="space-y-6">
          {/* Question Display */}
          <div className="space-y-4">
            <div 
              style={contentTextStyle}
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: currentQuestion.content }}
            />

            {/* Graph Display */}
            {graphUrl && (
              <div className="mt-4 flex justify-center">
                <img 
                  src={graphUrl} 
                  alt="Question Graph" 
                  className="max-w-full h-auto rounded-lg shadow-md"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}
          </div>

          {/* Answer Section */}
          <div className="mt-6 space-y-4">
            {/* SAT Writing Mode */}
            {isSATWriting ? (
              <div className="space-y-4">
                <Textarea
                  value={writingAnswer}
                  onChange={(e) => setWritingAnswer(e.target.value)}
                  placeholder="Write your response here..."
                  className={`w-full min-h-[200px] p-4 border rounded-lg resize-none transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 border-green-500/30 text-green-400 placeholder-green-600' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  style={contentTextStyle}
                />
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    isDarkMode ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {writingAnswer.length} characters
                  </span>
                  
                  <Button
                    onClick={handleAIEvaluation}
                    disabled={!writingAnswer.trim() || isEvaluating}
                    className={`transition-colors ${
                      isDarkMode 
                        ? 'bg-green-600 hover:bg-green-700 text-white border-green-500/30' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isEvaluating ? (
                      <>
                        <Bot className="h-4 w-4 mr-2 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 mr-2" />
                        Get AI Feedback
                      </>
                    )}
                  </Button>
                </div>

                {/* AI Evaluation Display */}
                {aiEvaluation && (
                  <div className={`mt-4 p-4 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 border-green-500/30 text-green-400' 
                      : 'bg-blue-50 border-blue-200 text-gray-800'
                  }`}>
                    <h4 className={`font-semibold mb-2 ${
                      isDarkMode ? 'text-green-400' : 'text-blue-800'
                    }`}>
                      AI Evaluation:
                    </h4>
                    <div className="whitespace-pre-wrap text-sm">
                      {aiEvaluation}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Regular Question Mode */
              <div className="space-y-4">
                {/* Question Type Toggle */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleQuestionType}
                    className={`flex items-center gap-2 transition-colors ${
                      isDarkMode 
                        ? 'border-green-500/30 text-green-400 hover:bg-gray-800' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isMultipleChoice ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                    {isMultipleChoice ? 'Multiple Choice' : 'Fill in the Blank'}
                  </Button>
                </div>

                {/* Multiple Choice - Fully Rounded White Buttons */}
                {isMultipleChoice ? (
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {currentQuestion.choices?.map((choice, index) => {
                      const choiceKey = String.fromCharCode(65 + index);
                      const isSelected = selectedAnswer === choiceKey;
                      const isCorrectChoice = currentQuestion.correctAnswer === choiceKey;
                      
                      let buttonStyle = '';
                      let animationClass = '';
                      
                      if (selectedAnswer && isSelected) {
                        if (isCorrect) {
                          buttonStyle = 'bg-green-100 border-green-400 text-green-800 shadow-md';
                          animationClass = 'animate-pulse';
                        } else {
                          buttonStyle = 'bg-red-100 border-red-400 text-red-800 shadow-md';
                          animationClass = 'animate-bounce';
                        }
                      } else if (selectedAnswer && isCorrectChoice) {
                        buttonStyle = 'bg-green-100 border-green-400 text-green-800 shadow-md';
                        animationClass = 'animate-pulse';
                      } else {
                        buttonStyle = 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md';
                      }

                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className={`w-full h-auto min-h-[60px] rounded-full px-4 py-3 text-center justify-center transition-all duration-200 ${buttonStyle} ${animationClass}`}
                          onClick={() => checkAnswer(choiceKey)}
                          disabled={!!selectedAnswer}
                          style={{ 
                            fontFamily: getFontFamily(),
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          <div className="flex items-center justify-center w-full gap-2">
                            <div className="flex flex-col items-center text-center">
                              <span className="text-xs text-gray-500 mb-1">Option {choiceKey}</span>
                              <span 
                                className="text-sm leading-tight"
                                dangerouslySetInnerHTML={{ __html: choice }}
                              />
                            </div>
                            {selectedAnswer && isSelected && (
                              isCorrect ? <Check className="h-4 w-4 ml-2 flex-shrink-0" /> : <X className="h-4 w-4 ml-2 flex-shrink-0" />
                            )}
                            {selectedAnswer && !isSelected && isCorrectChoice && (
                              <Check className="h-4 w-4 ml-2 flex-shrink-0" />
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  /* Fill in the Blank */
                  <div className="flex gap-3">
                    <Input
                      value={fillInAnswer}
                      onChange={(e) => setFillInAnswer(e.target.value)}
                      placeholder="Enter your answer..."
                      className={`flex-1 transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-800 border-green-500/30 text-green-400 placeholder-green-600' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      style={contentTextStyle}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmitFillIn()}
                    />
                    <Button 
                      onClick={handleSubmitFillIn}
                      disabled={!fillInAnswer.trim()}
                      className={`transition-colors ${
                        isDarkMode 
                          ? 'bg-green-600 hover:bg-green-700 text-white border-green-500/30' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Submit
                    </Button>
                  </div>
                )}

                {/* Answer Feedback */}
                {selectedAnswer && (
                  <div className={`p-4 rounded-lg transition-colors ${
                    isCorrect 
                      ? isDarkMode 
                        ? 'bg-green-900/50 border border-green-500/30 text-green-300' 
                        : 'bg-green-50 border border-green-200 text-green-700'
                      : isDarkMode 
                        ? 'bg-red-900/50 border border-red-500/30 text-red-300' 
                        : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                      <span className="font-semibold">
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <p className="text-sm">
                        The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Tab Content - Shows below the question */}
        {activeTab === "solution" && (
          <div className="mt-8 space-y-4 border-t pt-6">
            <h3 className={`text-xl font-semibold ${
              isDarkMode ? 'text-green-400' : 'text-gray-800'
            }`}>
              Solution & Explanation
            </h3>
            <div 
              style={contentTextStyle}
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: currentQuestion.solution || 'No solution available for this question.' }}
            />
          </div>
        )}

        {/* Quote/Idea Tab */}
        {activeTab === "quote" && (
          <div className="mt-8 space-y-4 border-t pt-6">
            <h3 className={`text-xl font-semibold ${
              isDarkMode ? 'text-green-400' : 'text-gray-800'
            }`}>
              Key Idea
            </h3>
            <div 
              style={contentTextStyle}
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: currentQuestion.quote || 'No key idea available for this question.' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeDisplay;
