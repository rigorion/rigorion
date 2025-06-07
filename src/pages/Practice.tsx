import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, AlertTriangle, KeyRound, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  storeSecureFunctionData,
  safeGetSecureData,
  clearAllSecureData,
  isSecureStorageValid,
} from "@/services/secureIndexedDbService";
import PracticeContent from "@/components/practice/PracticeContent";
import AIAnalyzer from "@/components/ai/AIAnalyzer";
import CommentSection from "@/components/practice/CommentSection";
import { mapQuestions, validateQuestion } from "@/utils/mapQuestion";
import { Question } from "@/types/QuestionInterface";
import { ThemeProvider } from "@/contexts/ThemeContext";

const ENDPOINT = "my-function";

const Practice = () => {
  const { toast } = useToast();

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

  const [questions, setQuestions] = useState<Question[]>([]);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStorageValid, setIsStorageValid] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Initializing secure question system...");

  const fetchAndStoreQuestions = async () => {
    try {
      setLoadingMessage("Connecting to secure server...");
      const baseUrl = "https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1";
      const url = `${baseUrl}/${ENDPOINT}`;
      
      setLoadingMessage("Downloading encrypted question data...");
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      });
      
      if (!response.ok) throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      
      setLoadingMessage("Encrypting and securing data...");
      const result = await response.json();
      await storeSecureFunctionData(ENDPOINT, result);

      let rawQuestions: any[] = [];
      if (result.questions && Array.isArray(result.questions)) {
        rawQuestions = result.questions;
      } else if (Array.isArray(result)) {
        rawQuestions = result;
      } else if (result.data && Array.isArray(result.data)) {
        rawQuestions = result.data;
      }

      setLoadingMessage("Processing and validating questions...");
      const mappedQuestions = mapQuestions(rawQuestions);
      const validQuestions = mappedQuestions.filter(validateQuestion);

      setQuestions(validQuestions);
      setLastFetched(new Date());
      setError(null);
      
      return validQuestions.length;
    } catch (e: any) {
      console.error("Error in fetchAndStoreQuestions:", e);
      throw new Error(e.message || "Failed to fetch questions from server");
    }
  };

  const loadLatestQuestions = async () => {
    try {
      setLoadingMessage("Accessing secure storage...");
      
      const { data, fromCache } = await safeGetSecureData(ENDPOINT, async () => {
        setLoadingMessage("No cached data found. Fetching fresh data...");
        return await fetchAndStoreQuestions();
      });
      
      if (data) {
        setLoadingMessage("Decrypting and processing questions...");
        
        let rawQuestions: any[] = [];
        if (data.questions && Array.isArray(data.questions)) {
          rawQuestions = data.questions;
        } else if (Array.isArray(data)) {
          rawQuestions = data;
        } else if (data.data && Array.isArray(data.data)) {
          rawQuestions = data.data;
        }

        const mappedQuestions = mapQuestions(rawQuestions);
        const validQuestions = mappedQuestions.filter(validateQuestion);

        setQuestions(validQuestions);
        setLastFetched(new Date());
        setError(null);
        
        // Show success message
        if (!fromCache) {
          toast({
            title: "Questions Updated",
            description: `Successfully loaded ${validQuestions.length} questions and secured them locally.`,
            duration: 3000,
          });
        }
        
        return validQuestions;
      } else {
        throw new Error("No question data available");
      }
    } catch (e: any) {
      console.error("Error in loadLatestQuestions:", e);
      setError(e.message || "Unable to load questions at this time");
      throw e;
    }
  };

  const initializeQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsStorageValid(isSecureStorageValid());
      
      await loadLatestQuestions();
    } catch (e: any) {
      setError(e.message || "Failed to initialize question system");
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = async () => {
    try {
      await clearAllSecureData();
      setQuestions([]);
      setLastFetched(null);
      setIsStorageValid(true);
      toast({
        title: "Storage Cleared",
        description: "All secure data has been removed. The system will fetch fresh data automatically.",
      });
      // Automatically reload after clearing
      await initializeQuestions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear storage. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    initializeQuestions();
  }, []);

  // Show loading state with professional message
  if (loading) {
    return (
      <ThemeProvider>
        <Card className="min-h-screen bg-white dark:bg-gray-900 relative transition-colors duration-300 dark:border-green-500/30">
          <CardContent className="flex flex-col items-center justify-center min-h-screen p-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 dark:text-green-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold dark:text-green-400">Loading Practice Questions</h2>
                <p className="text-gray-600 dark:text-green-500 animate-pulse">{loadingMessage}</p>
              </div>
              <div className="flex items-center justify-center text-sm text-gray-500 dark:text-green-600">
                <Lock className="h-4 w-4 mr-2" />
                All data is encrypted and secured during transfer
              </div>
            </div>
          </CardContent>
        </Card>
      </ThemeProvider>
    );
  }

  // Show error state with professional message
  if (error) {
    return (
      <ThemeProvider>
        <Card className="min-h-screen bg-white dark:bg-gray-900 relative transition-colors duration-300 dark:border-red-500/30">
          <CardContent className="flex flex-col items-center justify-center min-h-screen p-8">
            <div className="text-center space-y-6 max-w-md">
              <div className="flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Service Temporarily Unavailable</h2>
                <p className="text-gray-600 dark:text-gray-300">{error}</p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={initializeQuestions} 
                  className="w-full dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Retry Connection
                </Button>
                {!isStorageValid && (
                  <Button 
                    onClick={handleClearStorage} 
                    variant="outline"
                    className="w-full dark:border-green-500/30 dark:text-green-400 dark:hover:bg-gray-800"
                  >
                    Reset Storage & Retry
                  </Button>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-green-600">
                If this issue persists, please check your internet connection or contact support.
              </div>
            </div>
          </CardContent>
        </Card>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Card className="min-h-screen bg-white dark:bg-gray-900 relative transition-colors duration-300 dark:border-green-500/30">
        {/* Header section - simplified */}
        <CardHeader className="dark:border-b dark:border-green-500/30">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 dark:text-green-400">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                Practice Questions
              </CardTitle>
              <CardDescription className="dark:text-green-500">
                {questions.length} questions loaded and ready for practice
              </CardDescription>
            </div>
            {/* Keep only the clear storage button for maintenance */}
            <Button
              size="sm"
              onClick={handleClearStorage}
              className="flex items-center gap-2"
              variant="outline"
            >
              <KeyRound className="h-4 w-4" />
              Reset Storage
            </Button>
          </div>
          <div className="flex items-center justify-between text-xs">
            <p className="text-green-600 dark:text-green-400 flex items-center">
              <Lock className="h-3 w-3 inline mr-1" />
              Questions are automatically encrypted and validated for security
            </p>
            {lastFetched && (
              <span className="text-gray-500 dark:text-green-500">
                Last updated: {lastFetched.toLocaleTimeString()}
              </span>
            )}
          </div>
        </CardHeader>
        
        {/* Content area */}
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
