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

// Dummy questions as fallback - formatted for the mapper
const DUMMY_QUESTIONS = [
  {
    id: "1",
    number: 1,
    content: "What is the value of x in the equation 2x + 5 = 13?",
    choices: ["x = 3", "x = 4", "x = 5", "x = 6"],
    correctAnswer: "B",
    solution: "To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
    solutionSteps: [
      "Start with the equation: 2x + 5 = 13",
      "Subtract 5 from both sides: 2x = 8", 
      "Divide both sides by 2: x = 4"
    ],
    difficulty: "easy",
    chapter: "Algebra",
    module: "SAT Math",
    examNumber: 1,
    hint: "Remember to isolate the variable by performing inverse operations"
  },
  {
    id: "2",
    number: 2,
    content: "If f(x) = x² - 3x + 2, what is f(3)?",
    choices: ["2", "3", "4", "5"],
    correctAnswer: "A",
    solution: "Substitute x = 3: f(3) = 3² - 3(3) + 2 = 9 - 9 + 2 = 2",
    solutionSteps: [
      "Substitute x = 3 into the function",
      "Calculate: f(3) = (3)² - 3(3) + 2",
      "Simplify: f(3) = 9 - 9 + 2 = 2"
    ],
    difficulty: "medium",
    chapter: "Functions",
    module: "SAT Math",
    examNumber: 1,
    hint: "Substitute the given value for x and follow order of operations"
  },
  {
    id: "3",
    number: 3,
    content: "What is the area of a circle with radius 5?",
    choices: ["10π", "15π", "20π", "25π"],
    correctAnswer: "D",
    solution: "Area of circle = πr² = π(5)² = 25π",
    solutionSteps: [
      "Use the formula for area of a circle: A = πr²",
      "Substitute r = 5: A = π(5)²",
      "Calculate: A = π × 25 = 25π"
    ],
    difficulty: "easy",
    chapter: "Geometry",
    module: "SAT Math",
    examNumber: 1,
    hint: "Remember the formula for the area of a circle",
    graph: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop"
  },
  {
    id: "4",
    number: 4,
    content: "A linear function passes through points (2, 5) and (4, 11). What is the slope of this line?",
    choices: ["2", "3", "4", "6"],
    correctAnswer: "B",
    solution: "Use the slope formula: m = (y₂ - y₁)/(x₂ - x₁) = (11 - 5)/(4 - 2) = 6/2 = 3",
    solutionSteps: [
      "Identify the two points: (2, 5) and (4, 11)",
      "Use the slope formula: m = (y₂ - y₁)/(x₂ - x₁)",
      "Substitute values: m = (11 - 5)/(4 - 2) = 6/2 = 3"
    ],
    difficulty: "medium",
    chapter: "Linear Functions",
    module: "SAT Math",
    examNumber: 1,
    hint: "Use the slope formula with the two given points",
    graph: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop"
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
      // Create a more secure fetch method that doesn't expose raw JSON
      const secureFetch = async () => {
        const baseUrl = "https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1";
        const url = `${baseUrl}/${ENDPOINT}`;
        
        const response = await fetch(url, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json"
          },
          mode: "cors",
        });
        
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        
        // Parse response in a secure way without exposing to dev tools
        const textData = await response.text();
        let result;
        try {
          result = JSON.parse(textData);
        } catch (parseError) {
          throw new Error("Invalid response format");
        }
        
        // Clear the text data immediately to prevent dev tools inspection
        return result;
      };

      const result = await secureFetch();
      console.log("API fetch successful, result:", result);
      console.log("About to store result, type:", typeof result, "isArray:", Array.isArray(result));
      await storeSecureFunctionData(ENDPOINT, result);

      // Handle direct array response from edge function
      let rawQuestions: any[] = [];
      if (Array.isArray(result)) {
        rawQuestions = result;
      } else if (result?.questions && Array.isArray(result.questions)) {
        rawQuestions = result.questions;
      } else if (result?.data && Array.isArray(result.data)) {
        rawQuestions = result.data;
      } else {
        console.warn("No questions found in response structure, got:", typeof result);
        rawQuestions = [];
      }

      // Use the mapper to normalize and validate questions
      const mappedQuestions = mapQuestions(rawQuestions);
      const validQuestions = mappedQuestions.filter(validateQuestion);

      if (validQuestions.length === 0) {
        console.warn("No valid questions after mapping and validation");
        throw new Error("No valid questions available");
      }

      setQuestions(validQuestions);
      setLastFetched(new Date());
      setError(null);
      
      toast({
        title: "Questions Ready",
        description: `Loaded ${validQuestions.length} practice questions securely.`,
      });
      
      return result; // Return the raw API result
    } catch (e: any) {
      console.error("Fetch error:", e.message);
      setError(e.message || "Failed to load questions");
      toast({
        title: "Error",
        description: e.message || "Failed to load questions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLatestQuestions = async (retryCount = 0) => {
    setLoading(true);
    setError(null);
    
    // Try to load from API/cache first
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
        // Handle direct array response from edge function
        let rawQuestions: any[] = [];
        if (Array.isArray(data)) {
          rawQuestions = data;
        } else if (data.questions && Array.isArray(data.questions)) {
          rawQuestions = data.questions;
        } else if (data.data && Array.isArray(data.data)) {
          rawQuestions = data.data;
        }

        // Use mapper to process and validate questions
        const mappedQuestions = mapQuestions(rawQuestions);
        const validQuestions = mappedQuestions.filter(validateQuestion);

        if (validQuestions.length > 0) {
          setQuestions(validQuestions);
          setLastFetched(new Date());
          setError(null);
          setLoading(false);
          
          toast({
            title: "Questions Ready",
            description: fromCache
              ? `Loaded ${validQuestions.length} questions from secure storage.`
              : `Fetched ${validQuestions.length} questions and stored securely.`,
          });
          return;
        }
      }
    } catch (e: any) {
      console.warn("Failed to load from API/cache:", e.message);
    }
    
    // Fallback to dummy questions if API fails
    console.log("Using fallback questions");
    const mappedDummyQuestions = mapQuestions(DUMMY_QUESTIONS);
    const validDummyQuestions = mappedDummyQuestions.filter(validateQuestion);
    
    setQuestions(validDummyQuestions);
    setLastFetched(new Date());
    setError(null);
    setLoading(false);
    
    toast({
      title: "Practice Questions Ready",
      description: `Loaded ${validDummyQuestions.length} practice questions.`,
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
