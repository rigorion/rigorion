
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, BarChart2, MessageCircle, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";

interface PracticeFooterProps {
  onToggleCommunityStats: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  showGoToInput: boolean;
  setShowGoToInput: (show: boolean) => void;
  targetQuestion: string;
  setTargetQuestion: (target: string) => void;
  handleGoToQuestion: () => void;
  inputError: string;
}

const PracticeFooter = ({
  onToggleCommunityStats,
  onPrevious,
  onNext,
  currentQuestionIndex,
  totalQuestions,
  showGoToInput,
  setShowGoToInput,
  targetQuestion,
  setTargetQuestion,
  handleGoToQuestion,
  inputError,
}: PracticeFooterProps) => {
  const { isDarkMode } = useTheme();

  return (
    <>
      {/* Footer Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 border-t transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
      } z-10`}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Left: Community Stats */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCommunityStats}
            className={`flex items-center gap-2 transition-colors ${
              isDarkMode ? 'text-green-400 hover:text-green-300 hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <BarChart2 className={`h-4 w-4 ${
              isDarkMode 
                ? 'text-green-400' 
                : 'text-blue-600'
            }`} />
            <span className={isDarkMode ? 'text-green-400' : 'text-gray-700'}>Community Stats</span>
          </Button>

          {/* Center: Navigation Controls */}
          <div className="flex items-center gap-3">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 transition-colors ${
                isDarkMode 
                  ? 'border-green-500/30 bg-gray-900 text-green-400 hover:bg-gray-800 disabled:bg-gray-900 disabled:text-green-600/50' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Question Counter & Go To */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium px-3 py-1 rounded-full border ${
                isDarkMode ? 'bg-gray-900 text-green-400 border-green-500/30' : 'bg-gray-100 text-gray-700'
              }`}>
                {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGoToInput(!showGoToInput)}
                className={`p-2 transition-colors ${
                  isDarkMode ? 'text-green-400 hover:text-green-300 hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Search className={`h-4 w-4 ${
                  isDarkMode 
                    ? 'text-green-400' 
                    : 'text-blue-600'
                }`} />
              </Button>
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className={`flex items-center gap-2 transition-colors ${
                isDarkMode 
                  ? 'border-green-500/30 bg-gray-900 text-green-400 hover:bg-gray-800 disabled:bg-gray-900 disabled:text-green-600/50' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400'
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right: Empty space for balance */}
          <div className="w-24"></div>
        </div>
      </div>

      {/* Bottom Corner Buttons */}
      {/* Comment Button - Left Bottom Corner */}
      <Button
        className="fixed bottom-6 left-6 h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-30"
        onClick={() => console.log("Open comments")}
      >
        <MessageCircle className="h-5 w-5" />
      </Button>

      {/* AI Assistance Button - Right Bottom Corner */}
      <Button
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-30"
        onClick={() => console.log("Open AI assistance")}
      >
        <Bot className="h-5 w-5" />
      </Button>

      {/* Go to Question Popup */}
      {showGoToInput && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 border rounded-lg shadow-lg p-4 w-64 animate-in fade-in slide-in-from-bottom-5 z-20 transition-colors ${
          isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-300'
        }`}>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max={totalQuestions}
                value={targetQuestion}
                onChange={(e) => {
                  setTargetQuestion(e.target.value);
                }}
                className={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-900 border-green-500/30 text-green-400 placeholder-green-600' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
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
              className={`w-full transition-colors ${
                isDarkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-500/30' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              onClick={handleGoToQuestion}
            >
              Go
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PracticeFooter;
