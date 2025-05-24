
import React, { createContext, useContext, useState, useEffect } from "react";
import { Question } from "@/types/QuestionInterface";
import { getSecureLatestFunctionData } from "@/services/secureIndexedDbService";
import { useToast } from "@/components/ui/use-toast";

interface QuestionsContextType {
  questions: Question[];
  isLoading: boolean;
  error: Error | null;
  refreshQuestions: () => Promise<void>;
}

export const QuestionsContext = createContext<QuestionsContextType>({
  questions: [],
  isLoading: true,
  error: null,
  refreshQuestions: async () => {},
});

export const useQuestions = () => useContext(QuestionsContext);

interface QuestionsProviderProps {
  children: React.ReactNode;
}

// Define the shape of the data we expect from the secure storage
interface SecureQuestionData {
  questions?: Array<{
    id?: string | number;
    text?: string;
    answer?: string;
    difficulty?: string;
    choices?: string[];
    explanation?: string;
    steps?: string[];
    hint?: string;
    quote?: string;
    source?: string;
  }>;
}

// Helper function to validate difficulty
const validateDifficulty = (difficulty: string | undefined): "easy" | "medium" | "hard" => {
  if (difficulty === "easy" || difficulty === "hard") {
    return difficulty;
  }
  return "medium"; // Default to medium if not specified or invalid
};

export const QuestionsProvider: React.FC<QuestionsProviderProps> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchSecureQuestions = async () => {
    try {
      setIsLoading(true);
      
      // Get the latest secure data
      const record = await getSecureLatestFunctionData('my-function');
      
      if (!record || !record.data) {
        console.log("No secure question data found");
        setIsLoading(false);
        return;
      }
      
      console.log("Found secure question data:", record.data);
      
      // Cast to the expected type
      const secureData = record.data as SecureQuestionData;
      
      // Transform the data into Question format
      if (secureData.questions && Array.isArray(secureData.questions)) {
        const mappedQuestions: Question[] = secureData.questions.map((q, index) => ({
          id: q.id?.toString() || `secure-${index}`,
          content: q.text || "",
          solution: q.answer || "",
          difficulty: validateDifficulty(q.difficulty), // Use the helper function
          chapter: "Secure Chapter",
          bookmarked: false,
          examNumber: 1,
          choices: Array.isArray(q.choices) ? q.choices : ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: q.answer || "",
          explanation: q.explanation || "",
          solutionSteps: Array.isArray(q.steps) ? q.steps : [q.answer || "Solution step"],
          hint: q.hint || "Think about the problem carefully",
          quote: q.quote ? {
            text: q.quote,
            source: q.source || "Unknown"
          } : {
            text: "Practice makes perfect",
            source: "Common saying"
          }
        }));
        
        console.log("Transformed secure questions:", mappedQuestions);
        setQuestions(mappedQuestions);
      } else {
        console.log("No questions array found in secure data");
        setQuestions([]);
      }
    } catch (err) {
      console.error("Error getting secure questions:", err);
      setError(err instanceof Error ? err : new Error("Failed to load secure questions"));
      toast({
        title: "Error loading questions",
        description: err instanceof Error ? err.message : "Failed to load secure questions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSecureQuestions();
  }, []);

  const refreshQuestions = async () => {
    await fetchSecureQuestions();
  };

  return (
    <QuestionsContext.Provider value={{ questions, isLoading, error, refreshQuestions }}>
      {children}
    </QuestionsContext.Provider>
  );
};

export default QuestionsProvider;
