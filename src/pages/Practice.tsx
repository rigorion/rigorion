import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, RefreshCw, AlertTriangle, KeyRound } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [isStorageValid, setIsStorageValid] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndStoreQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = "https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1";
      const url = `${baseUrl}/${ENDPOINT}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
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

      const mappedQuestions = mapQuestions(rawQuestions);
      const validQuestions = mappedQuestions.filter(validateQuestion);

      setQuestions(validQuestions);
      setLastFetched(new Date());
      toast({
        title: "Questions Fetched & Encrypted",
        description: `Fetched ${validQuestions.length} questions and stored securely.`,
      });
    } catch (e: any) {
      setError(e.message || "Unknown error");
      toast({
        title: "Error",
        description: e.message || "Failed to fetch or store questions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLatestQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, fromCache } = await safeGetSecureData(ENDPOINT, fetchAndStoreQuestions);
      if (data) {
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
        toast({
          title: "Questions Loaded",
          description: fromCache
            ? `Loaded ${validQuestions.length} questions from secure storage.`
            : `Fetched ${validQuestions.length} questions from server and stored securely.`,
        });
      } else {
        setQuestions([]);
        setError("No secure questions found.");
      }
    } catch (e: any) {
      setQuestions([]);
      setError(e.message || "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = async () => {
    await clearAllSecureData();
    setQuestions([]);
    setLastFetched(null);
    setIsStorageValid(true);
    toast({
      title: "Storage Cleared",
      description: "All secure questions have been removed.",
    });
  };

  useEffect(() => {
    setIsStorageValid(isSecureStorageValid());
    loadLatestQuestions();
  }, []);

  return (
    <ThemeProvider>
      <Card className="min-h-screen bg-white dark:bg-gray-900 relative transition-colors duration-300 dark:border-green-500/30">
        {/* Header section */}
        <CardHeader className="dark:border-b dark:border-green-500/30">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 dark:text-green-400">
                <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                Practice Questions
              </CardTitle>
              <CardDescription className="dark:text-green-500">
                Questions are securely encrypted and mapped to ensure consistent UI display.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                onClick={fetchAndStoreQuestions}
                disabled={loading}
                className="flex items-center gap-2 dark:bg-green-600 dark:hover:bg-green-700 dark:border-green-500/30"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Fetch & Encrypt
              </Button>
              <Button
                size="sm"
                onClick={loadLatestQuestions}
                disabled={loading}
                className="flex items-center gap-2 dark:border-green-500/30 dark:text-green-400 dark:hover:bg-gray-800"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" />
                Load Latest
              </Button>
              <Button
                size="sm"
                onClick={handleClearStorage}
                disabled={loading}
                className="flex items-center gap-2"
                variant="destructive"
              >
                <KeyRound className="h-4 w-4" />
                Clear Secure Cache
              </Button>
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center">
            <Lock className="h-3 w-3 inline mr-1" />
            Secure mode: Questions are mapped and validated for consistent display.
          </p>
          {!isStorageValid && (
            <div className="mt-2 flex items-center text-red-600 text-xs">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Storage integrity check failed. Please clear cache and refetch.
            </div>
          )}
        </CardHeader>
        
        {/* Content area */}
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-green-400" />
              <span className="ml-2 dark:text-green-400">Loading and mapping secure questions...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-8">
              <div className="text-red-600 dark:text-red-400 mb-2">{error}</div>
              <Button onClick={fetchAndStoreQuestions} className="dark:bg-green-600 dark:hover:bg-green-700">Retry</Button>
            </div>
          ) : questions && questions.length > 0 ? (
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
              No secure questions available. Please fetch data.
            </div>
          )}
          {lastFetched && (
            <div className="text-xs text-gray-500 dark:text-green-500 p-2 border-t dark:border-green-500/30">
              Last updated: {lastFetched.toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default Practice;
