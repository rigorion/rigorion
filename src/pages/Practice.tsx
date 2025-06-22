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

// Dummy questions as fallback
const DUMMY_QUESTIONS: Question[] = [
  {
    id: "1",
    question: "What is the value of x in the equation 2x + 5 = 13?",
    options: ["x = 3", "x = 4", "x = 5", "x = 6"],
    correctAnswer: 1,
    explanation: "To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
    difficulty: "easy",
    chapter: "Algebra",
    timeLimit: 60
  },
  {
    id: "2", 
    question: "If f(x) = x² - 3x + 2, what is f(3)?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 0,
    explanation: "Substitute x = 3: f(3) = 3² - 3(3) + 2 = 9 - 9 + 2 = 2",
    difficulty: "medium",
    chapter: "Functions",
    timeLimit: 90
  },
  {
    id: "3",
    question: "What is the area of a circle with radius 5?",
    options: ["10π", "15π", "20π", "25π"],
    correctAnswer: 3,
    explanation: "Area of circle = πr² = π(5)² = 25π",
    difficulty: "easy",
    chapter: "Geometry",
    timeLimit: 60
  }
];

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

  const loadLatestQuestions = async (retryCount = 0) => {
    setLoading(true);
    setError(null);
    
    // If retryCount is 0, try to load from API/cache
    if (retryCount === 0) {
      try {
        const result = await safeGetSecureData(ENDPOINT, fetchAndStoreQuestions);
        
        // Handle the case where result might be undefined or not have expected structure
        let data = null;
        let fromCache = false;
        
        if (result && typeof result === 'object') {
          data = result.data || result;
          fromCache = result.fromCache || false;
        } else {
          data = result;
        }
        
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

          if (validQuestions.length > 0) {
            setQuestions(validQuestions);
            setLastFetched(new Date());
            setError(null);
            setLoading(false);
            toast({
              title: "Questions Loaded",
              description: fromCache
                ? `Loaded ${validQuestions.length} questions from secure storage.`
                : `Fetched ${validQuestions.length} questions from server and stored securely.`,
            });
            return;
          }
        }
      } catch (e: any) {
        console.log("API failed, falling back to dummy data:", e.message);
      }
    }
    
    // Use dummy questions as fallback
    setQuestions(DUMMY_QUESTIONS);
    setLastFetched(new Date());
    setError(null);
    setLoading(false);
    toast({
      title: "Practice Questions Ready",
      description: `Loaded ${DUMMY_QUESTIONS.length} practice questions.`,
    });
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
        
        {/* Content area */}
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-green-400" />
              <span className="ml-2 dark:text-green-400">Loading and mapping secure questions...</span>
            </div>
          ) : questions && questions.length > 0 ? (
            <>
              <PracticeContent 
                questions={questions}
                isLoading={false}
                error={null}
                settings={settings} 
                onSettingsChange={handleSettingsChange}
              />
              {/* Removed AIAnalyzer and CommentSection since they're now in the footer */}
            </>
          ) : (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-green-400" />
              <span className="ml-2 dark:text-green-400">Loading questions...</span>
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
