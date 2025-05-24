
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQuestions } from "@/contexts/QuestionsContext";
import { Question } from "@/types/QuestionInterface";

interface SecureQuestionProviderProps {
  children: (props: {
    questions: Question[];
    currentQuestion: Question | null;
    currentIndex: number;
    isLoading: boolean;
    error: Error | null;
    handleNext: () => void;
    handlePrevious: () => void;
    handleJumpToQuestion: (index: number) => void;
  }) => React.ReactNode;
}

export const SecureQuestionProvider: React.FC<SecureQuestionProviderProps> = ({ 
  children 
}) => {
  const { questions, isLoading, error, refreshQuestions } = useQuestions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions.length > 0 && currentIndex >= 0 && currentIndex < questions.length 
    ? questions[currentIndex] 
    : null;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading secure questions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-red-800 font-medium">Error loading questions</h3>
        <p className="text-red-600 mt-1">{error.message}</p>
        <button 
          className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded"
          onClick={() => refreshQuestions()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h3 className="text-yellow-800 font-medium">No secure questions available</h3>
        <p className="text-yellow-600 mt-1">
          Try clicking the "Secure Data" button to fetch secure questions.
        </p>
      </div>
    );
  }

  return (
    <>
      {children({
        questions,
        currentQuestion,
        currentIndex,
        isLoading,
        error,
        handleNext,
        handlePrevious,
        handleJumpToQuestion
      })}
    </>
  );
};

export default SecureQuestionProvider;
