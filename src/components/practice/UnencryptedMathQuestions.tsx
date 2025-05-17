
import { Question } from '@/types/QuestionInterface';
import { fetchMathQuestions } from '@/services/questionService';
import { useQuery } from '@tanstack/react-query';
import { toast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { callEdgeFunction } from '@/services/edgeFunctionService';

interface UnencryptedMathQuestionsProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

const UnencryptedMathQuestions = ({ onQuestionsLoaded }: UnencryptedMathQuestionsProps) => {
  // Use React Query to fetch questions
  const { isLoading, error } = useQuery({
    queryKey: ['mathQuestions'],
    queryFn: async () => {
      try {
        // Use our new fetch utility instead of Supabase functions.invoke
        const { data, error } = await callEdgeFunction<Question[]>('get-sat-math-questions');
        
        if (error || !data) {
          throw error || new Error('No data returned');
        }
        
        console.log(`Successfully loaded ${data.length} math questions`);
        // Process data on successful fetch
        onQuestionsLoaded(data);
        return data;
      } catch (err) {
        console.error('Error loading questions, trying fallback method');
        toast({
          title: "Error loading questions",
          description: "Using sample questions instead",
          variant: "destructive",
        });
        
        // Try the alternate method if the primary one fails
        const fallbackData = await fetchMathQuestions();
        onQuestionsLoaded(fallbackData);
        return fallbackData;
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 1,
    gcTime: 10 * 60 * 1000,
  });

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Failed to load questions: {(error as Error).message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  return null; // Component doesn't need to render anything after questions are loaded
};

export default UnencryptedMathQuestions;
