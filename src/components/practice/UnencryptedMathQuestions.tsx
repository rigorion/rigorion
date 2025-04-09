
import { useState, useEffect } from 'react';
import { Question } from '@/types/QuestionInterface';
import { fetchMathQuestions } from '@/services/mathQuestionService';
import { toast } from "@/hooks/use-toast";

interface UnencryptedMathQuestionsProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

const UnencryptedMathQuestions = ({ onQuestionsLoaded }: UnencryptedMathQuestionsProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const questions = await fetchMathQuestions();
        
        if (questions && questions.length > 0) {
          console.log(`Loaded ${questions.length} questions successfully`);
          onQuestionsLoaded(questions);
          // Removed toast notification here
        } else {
          setError("No questions available");
          toast({
            title: "No questions available",
            description: "Using sample questions instead",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        setError(err instanceof Error ? err.message : 'Unknown error loading questions');
        toast({
            title: "Error loading questions",
            description: "Using sample questions instead",
            variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [onQuestionsLoaded]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Failed to load questions: {error}</p>
      </div>
    );
  }

  if (loading) {
    return <span className="text-sm text-gray-500">Loading questions...</span>;
  }

  return null; // Component doesn't need to render anything after questions are loaded
};

export default UnencryptedMathQuestions;
