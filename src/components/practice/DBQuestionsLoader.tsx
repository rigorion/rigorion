
import { useState, useEffect } from 'react';
import { Question } from '@/types/QuestionInterface';
import { fetchMathQuestions } from '@/services/mathQuestionService';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface DBQuestionsLoaderProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

const DBQuestionsLoader = ({ onQuestionsLoaded }: DBQuestionsLoaderProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number | null>(null);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching questions from database...');
      const questions = await fetchMathQuestions();
      
      if (questions && questions.length > 0) {
        console.log(`Successfully loaded ${questions.length} questions from database`);
        setQuestionCount(questions.length);
        onQuestionsLoaded(questions);
        
        toast({
          title: "Questions Loaded",
          description: `Successfully loaded ${questions.length} questions for your practice`,
          variant: "default",
        });
      } else {
        throw new Error('No questions found in database');
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      setError(err instanceof Error ? err.message : 'Unknown error loading questions');
      
      toast({
        title: "Error Loading Questions",
        description: err instanceof Error ? err.message : 'Unknown error loading questions',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">SAT Math Questions Loader</h3>
      
      {questionCount !== null && (
        <p className="text-sm text-green-600 mb-2">
          {questionCount} questions loaded successfully!
        </p>
      )}
      
      {error && (
        <p className="text-sm text-red-600 mb-2">{error}</p>
      )}
      
      <Button
        onClick={loadQuestions}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Loading Questions...
          </>
        ) : (
          questionCount === null ? 'Load Questions' : 'Reload Questions'
        )}
      </Button>
      
      <p className="text-xs text-gray-500 mt-2">
        This will load SAT Math questions from your Supabase database.
      </p>
    </div>
  );
};

export default DBQuestionsLoader;
