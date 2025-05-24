
import { useState } from "react";
import { sampleQuestions } from "@/components/practice/sampleQuestion";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import useSecureQuestions from "@/hooks/useSecureQuestions";
import SecureProgressDataButton from "@/components/progress/SecureProgressDataButton";
import { QuestionsProvider } from "@/contexts/QuestionsContext";
import PracticeContent from "@/components/practice/PracticeContent";
import SecureQuestionProvider from "@/components/practice/SecureQuestionProvider";

const Practice = () => {
  const [useSecureData, setUseSecureData] = useState(false);
  const { refetch: refetchSecureQuestions } = useSecureQuestions();
  
  // Data Source Controls
  const toggleDataSource = () => {
    setUseSecureData(prev => !prev);
  };

  const handleRefreshSecureData = () => {
    refetchSecureQuestions();
  };

  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Data Source Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Button
            variant={useSecureData ? "default" : "outline"}
            size="sm"
            onClick={toggleDataSource}
            className="text-xs"
          >
            {useSecureData ? "Using Secure Data" : "Using Sample Data"}
          </Button>
        </div>
        
        <SecureProgressDataButton onRefresh={handleRefreshSecureData} />
      </div>
      
      {/* Main Content */}
      {useSecureData ? (
      <SecureQuestionProvider>
  {({
    questions,
    currentQuestion,
    currentIndex,
    handleNext,
    handlePrevious,
    handleJumpToQuestion,
    isLoading,
    error,
    refreshQuestions,
  }) => (
    <PracticeContent
      questions={questions}
      currentQuestion={currentQuestion}
      currentIndex={currentIndex}
      onNext={handleNext}
      onPrev={handlePrevious}
      onJumpTo={handleJumpToQuestion}
      isLoading={isLoading}
      error={error}
      refreshQuestions={refreshQuestions}
    />
  )}
</SecureQuestionProvider>

      ) : (
        <PracticeContent questions={questions} />
      )}
    </div>
  );
};

export default Practice;
