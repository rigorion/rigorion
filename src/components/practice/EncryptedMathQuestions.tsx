
import { useState, useEffect } from 'react';
import { useSecureContent } from '@/hooks/useSecureContent';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Question } from '@/types/QuestionInterface';

interface EncryptedMathQuestionsProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

const EncryptedMathQuestions = ({ onQuestionsLoaded }: EncryptedMathQuestionsProps) => {
  const { decryptQuestion, isLoading, error } = useSecureContent();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  
  // Try to decrypt and parse the entire question bank
  const loadQuestions = async () => {
    try {
      setIsDecrypting(true);
      setDecryptionError(null);
      
      // Use the special key '_encrypted' to get the entire encrypted JSON
      const result = await decryptQuestion('_encrypted');
      
      // Parse the decrypted JSON
      try {
        const parsedQuestions = JSON.parse(result);
        if (Array.isArray(parsedQuestions)) {
          // Convert to the expected Question interface format if needed
          const formattedQuestions = parsedQuestions.map((q: any) => ({
            id: q.id || '',
            content: q.content || q.question || '',
            solution: q.solution || q.answer || '',
            difficulty: q.difficulty || 'medium',
            chapter: q.chapter || 'SAT Math',
            bookmarked: false,
            examNumber: q.examNumber || 2024,
            choices: q.choices || [],
            correctAnswer: q.correctAnswer || q.answer || '',
            explanation: q.explanation || '',
            solutionSteps: q.solutionSteps || [q.solution || ''],
            quote: q.quote || { text: "Practice makes perfect", source: "SAT Math" }
          }));
          
          setQuestions(formattedQuestions);
          onQuestionsLoaded(formattedQuestions);
        } else {
          // If it's an object with questions as a property
          const questionArray = parsedQuestions.questions || Object.values(parsedQuestions);
          const formattedQuestions = questionArray.map((q: any) => ({
            id: q.id || '',
            content: q.content || q.question || '',
            solution: q.solution || q.answer || '',
            difficulty: q.difficulty || 'medium',
            chapter: q.chapter || 'SAT Math',
            bookmarked: false,
            examNumber: q.examNumber || 2024,
            choices: q.choices || [],
            correctAnswer: q.correctAnswer || q.answer || '',
            explanation: q.explanation || '',
            solutionSteps: q.solutionSteps || [q.solution || ''],
            quote: q.quote || { text: "Practice makes perfect", source: "SAT Math" }
          }));
          
          setQuestions(formattedQuestions);
          onQuestionsLoaded(formattedQuestions);
        }
      } catch (parseError) {
        console.error('Error parsing decrypted data:', parseError);
        setDecryptionError('The decrypted data is not valid JSON');
      }
    } catch (error) {
      console.error('Decryption error:', error);
      setDecryptionError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsDecrypting(false);
    }
  };

  // Auto-load questions when the component mounts
  useEffect(() => {
    if (!isLoading) {
      loadQuestions();
    }
  }, [isLoading]);

  if (isLoading || isDecrypting) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
        <p className="text-sm text-gray-600">
          {isLoading ? 'Loading secure content...' : 'Decrypting questions...'}
        </p>
      </div>
    );
  }

  if (error || decryptionError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p className="text-sm font-medium">Error:</p>
        <p className="text-sm">{error || decryptionError}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadQuestions} 
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-4 bg-blue-50 text-blue-700 rounded-md">
        <p className="text-sm">No questions loaded. Click to decrypt and load SAT Math questions.</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadQuestions} 
          className="mt-2"
        >
          Load Questions
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 text-green-700 rounded-md">
      <p className="text-sm font-medium">Success!</p>
      <p className="text-sm">{questions.length} questions loaded successfully.</p>
    </div>
  );
};

export default EncryptedMathQuestions;
