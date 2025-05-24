
import { useState } from "react";
import { sampleQuestions } from "@/components/practice/sampleQuestion";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lock, Unlock, RefreshCw } from "lucide-react";
import useSecureQuestions from "@/hooks/useSecureQuestions";
import SecureProgressDataButton from "@/components/progress/SecureProgressDataButton";
import { QuestionsProvider } from "@/contexts/QuestionsContext";
import PracticeContent from "@/components/practice/PracticeContent";
import SecureQuestionProvider from "@/components/practice/SecureQuestionProvider";

const Practice = () => {
  const [useSecureData, setUseSecureData] = useState(false);
  const { refetch: refetchSecureQuestions } = useSecureQuestions();
  
  const toggleDataSource = () => {
    setUseSecureData(prev => !prev);
  };

  const handleRefreshSecureData = () => {
    refetchSecureQuestions();
  };

  return (
    <Card className="min-h-screen bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              {useSecureData ? (
                <Lock className="h-5 w-5 text-green-600" />
              ) : (
                <Unlock className="h-5 w-5 text-amber-500" />
              )}
              Practice Questions
            </CardTitle>
            <CardDescription>
              Switch between secure encrypted data and sample question modes.
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="data-mode"
                checked={useSecureData}
                onCheckedChange={setUseSecureData}
              />
              <Label htmlFor="data-mode" className="flex items-center cursor-pointer text-sm">
                {useSecureData ? (
                  <>
                    <Lock className="h-4 w-4 mr-1 text-green-600" /> 
                    <span>Using Secure Data</span>
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 mr-1 text-amber-600" /> 
                    <span>Using Sample Data</span>
                  </>
                )}
              </Label>
            </div>
            
            {useSecureData && (
              <SecureProgressDataButton onRefresh={handleRefreshSecureData} />
            )}
          </div>
        </div>
        
        {useSecureData && (
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <Lock className="h-3 w-3 inline mr-1" /> 
            Questions are decrypted from secure storage and only accessible in memory
          </p>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
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
          <PracticeContent questions={sampleQuestions} />
        )}
      </CardContent>
    </Card>
  );
};

export default Practice;
