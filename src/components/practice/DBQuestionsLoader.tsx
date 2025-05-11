import { useState, useEffect } from 'react';
import { Question } from '@/types/QuestionInterface';
import { fetchMathQuestions } from '@/services/mathQuestionService';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
interface DBQuestionsLoaderProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}
const DBQuestionsLoader = ({
  onQuestionsLoaded
}: DBQuestionsLoaderProps) => {
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
          variant: "default"
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
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return;
};
export default DBQuestionsLoader;