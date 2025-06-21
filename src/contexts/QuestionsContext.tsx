
import React, { createContext, useContext, useState, useEffect } from "react";
import { Question } from "@/types/QuestionInterface";
import { getSecureLatestFunctionData } from "@/services/secureIndexedDbService";
import { useToast } from "@/components/ui/use-toast";
import { mapQuestions, validateQuestion } from "@/utils/mapQuestion";

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

export const QuestionsProvider: React.FC<QuestionsProviderProps> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchSecureQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('⏰ Questions fetch timeout - setting loading to false');
        setIsLoading(false);
      }, 8000); // 8 second timeout
      
      // Get the latest secure data
      const record = await getSecureLatestFunctionData('my-function');
      clearTimeout(timeoutId);
      
      if (!record || !record.data) {
        console.log("ℹ️ No secure question data found");
        setQuestions([]);
        setIsLoading(false);
        return;
      }
      
      console.log("✅ Found secure question data:", record.data);
      
      let rawQuestions: any[] = [];
      
      // Handle different possible data structures from the backend
      if (record.data.questions && Array.isArray(record.data.questions)) {
        rawQuestions = record.data.questions;
      } else if (Array.isArray(record.data)) {
        rawQuestions = record.data;
      } else if (record.data.data && Array.isArray(record.data.data)) {
        rawQuestions = record.data.data;
      } else {
        console.log("ℹ️ No questions array found in secure data structure");
        setQuestions([]);
        setIsLoading(false);
        return;
      }
      
      // Use the mapping utility to normalize the questions
      const mappedQuestions = mapQuestions(rawQuestions);
      
      // Validate the mapped questions
      const validQuestions = mappedQuestions.filter(question => {
        const isValid = validateQuestion(question);
        if (!isValid) {
          console.warn('[CONTEXT] Filtered out invalid question:', question);
        }
        return isValid;
      });
      
      console.log(`✅ [CONTEXT] Processed ${rawQuestions.length} raw questions into ${validQuestions.length} valid questions`);
      setQuestions(validQuestions);
      
    } catch (err) {
      console.error("❌ Error getting secure questions:", err);
      setError(err instanceof Error ? err : new Error("Failed to load secure questions"));
      toast({
        title: "Loading Issue",
        description: "Unable to load questions. Please try refreshing or check your connection.",
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
