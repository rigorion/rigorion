
import SecureProgressDataButton from "@/components/progress/SecureProgressDataButton";
import PracticeContent from "@/components/practice/PracticeContent";
import SecureQuestionProvider from "@/components/practice/SecureQuestionProvider";
import AIAnalyzer from "@/components/ai/AIAnalyzer";
import CommentSection from "@/components/practice/CommentSection";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
import useSecureQuestions from "@/hooks/useSecureQuestions";

const Practice = () => {
  const { refetch: refetchSecureQuestions } = useSecureQuestions();

  const handleRefreshSecureData = () => {
    refetchSecureQuestions();
  };

  return (
    <Card className="min-h-screen bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              Practice Questions
            </CardTitle>
            <CardDescription>
              Questions are securely decrypted from encrypted storage and displayed below.
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <SecureProgressDataButton onRefresh={handleRefreshSecureData} />
          </div>
        </div>
        <p className="text-xs text-green-600 mt-2 flex items-center">
          <Lock className="h-3 w-3 inline mr-1" />
          Secure mode: Only encrypted, fetched questions are used. No local or sample data.
        </p>
      </CardHeader>

      <CardContent className="p-0">
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
            <>
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
              
              {/* AI Analyzer positioned at bottom right */}
              <AIAnalyzer 
                context="practice"
                data={{
                  currentQuestion,
                  currentIndex,
                  totalQuestions: questions.length,
                  questions: questions.slice(0, 3) // Limited data for context
                }}
              />
              
              {/* Comment Section positioned at bottom left */}
              <div className="fixed bottom-6 left-6 z-40">
                <CommentSection />
              </div>
            </>
          )}
        </SecureQuestionProvider>
      </CardContent>
    </Card>
  );
};

export default Practice;
