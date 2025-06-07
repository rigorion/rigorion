
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PracticeContent from "@/components/practice/PracticeContent";
import AIAnalyzer from "@/components/ai/AIAnalyzer";
import CommentSection from "@/components/practice/CommentSection";
import PracticeLoadingState from "@/components/practice/PracticeLoadingState";
import PracticeErrorState from "@/components/practice/PracticeErrorState";
import PracticeMainHeader from "@/components/practice/PracticeMainHeader";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { usePracticeQuestions } from "@/hooks/usePracticeQuestions";

const Practice = () => {
  const {
    questions,
    lastFetched,
    loading,
    isStorageValid,
    error,
    loadingMessage,
    initializeQuestions,
    handleClearStorage,
  } = usePracticeQuestions();

  const [settings, setSettings] = useState({
    fontFamily: "inter",
    fontSize: 14,
    colorStyle: "plain" as const,
    textColor: "#374151"
  });

  const handleSettingsChange = (key: any, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Show loading state
  if (loading) {
    return <PracticeLoadingState loadingMessage={loadingMessage} />;
  }

  // Show error state
  if (error) {
    return (
      <PracticeErrorState
        error={error}
        isStorageValid={isStorageValid}
        onRetry={initializeQuestions}
        onClearStorage={handleClearStorage}
      />
    );
  }

  return (
    <ThemeProvider>
      <Card className="min-h-screen bg-white dark:bg-gray-900 relative transition-colors duration-300 dark:border-green-500/30">
        <PracticeMainHeader
          questionsCount={questions.length}
          lastFetched={lastFetched}
          onClearStorage={handleClearStorage}
        />
        
        <CardContent className="p-0">
          {questions.length > 0 ? (
            <>
              <PracticeContent 
                questions={questions} 
                settings={settings} 
                onSettingsChange={handleSettingsChange}
              />
              <AIAnalyzer
                context="practice"
                data={{
                  currentQuestion: questions[0],
                  currentIndex: 0,
                  totalQuestions: questions.length,
                  questions: questions.slice(0, 3),
                }}
              />
              <div className="fixed bottom-6 left-6 z-40">
                <CommentSection />
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-400 dark:text-green-500">
              No questions available. System will automatically retry loading.
            </div>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default Practice;
