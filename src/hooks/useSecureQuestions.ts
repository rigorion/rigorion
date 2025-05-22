
import { useState, useEffect } from 'react';
import { Question } from '@/types/QuestionInterface';
import { getSecureLatestFunctionData } from '@/services/secureIndexedDbService';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';

export function useSecureQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { toast } = useToast();
  
  const { data: secureQuestions, isLoading, error, refetch } = useQuery({
    queryKey: ['secureQuestions'],
    queryFn: async () => {
      try {
        // Get the latest secure data
        const record = await getSecureLatestFunctionData('my-function');
        
        if (!record || !record.data) {
          console.log("No secure question data found");
          return null;
        }
        
        console.log("Found secure question data:", record.data);
        
        // Transform the data into Question format
        if (record.data.questions && Array.isArray(record.data.questions)) {
          const mappedQuestions: Question[] = record.data.questions.map((q: any, index: number) => ({
            id: q.id?.toString() || `secure-${index}`,
            content: q.text || "",
            solution: q.answer || "",
            difficulty: q.difficulty || "medium",
            chapter: "Secure Chapter",
            bookmarked: false,
            examNumber: 1,
            choices: q.choices || ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: q.answer || "",
            explanation: q.explanation || "",
            solutionSteps: q.steps || [q.answer || "Solution step"],
            hint: q.hint || "Think about the problem carefully",
            quote: q.quote ? {
              text: q.quote,
              source: q.source || "Unknown"
            } : undefined
          }));
          
          return mappedQuestions;
        }
        
        return null;
      } catch (err) {
        console.error("Error getting secure questions:", err);
        throw err;
      }
    },
    enabled: true,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  useEffect(() => {
    if (secureQuestions && Array.isArray(secureQuestions)) {
      setQuestions(secureQuestions);
    }
  }, [secureQuestions]);
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading secure questions",
        description: error instanceof Error ? error.message : "Failed to load secure questions",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  return {
    questions,
    isLoading,
    error,
    refetch
  };
}

export default useSecureQuestions;
