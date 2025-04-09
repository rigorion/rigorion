
import { useState, useEffect } from 'react';
import { useSecureContent } from '@/hooks/useSecureContent';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Question } from '@/types/QuestionInterface';
import { useToast } from '@/components/ui/use-toast';

interface EncryptedMathQuestionsProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

const EncryptedMathQuestions = ({ onQuestionsLoaded }: EncryptedMathQuestionsProps) => {
  const { decryptQuestion, isLoading, error } = useSecureContent();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const { toast } = useToast();
  
  // Try to decrypt and parse the entire question bank
  const loadQuestions = async () => {
    try {
      setIsDecrypting(true);
      setDecryptionError(null);
      
      // Use the special key '_encrypted' to get the entire encrypted JSON
      const result = await decryptQuestion('_encrypted');
      console.log('Decryption result:', result.substring(0, 100) + '...'); // Log just the beginning to avoid flooding console
      
      // Parse the decrypted JSON
      try {
        const parsedQuestions = JSON.parse(result);
        console.log('Parsed questions structure:', Object.keys(parsedQuestions));
        
        if (Array.isArray(parsedQuestions)) {
          // If it's already an array of questions
          processQuestions(parsedQuestions);
        } else if (parsedQuestions.questions && Array.isArray(parsedQuestions.questions)) {
          // If questions are nested in a 'questions' property
          processQuestions(parsedQuestions.questions);
        } else {
          // Try to extract questions from object structure
          const extractedQuestions = extractQuestionsFromObject(parsedQuestions);
          if (extractedQuestions.length > 0) {
            processQuestions(extractedQuestions);
          } else {
            throw new Error('Could not find questions in the decrypted data');
          }
        }
      } catch (parseError) {
        console.error('Error parsing decrypted data:', parseError);
        setDecryptionError('The decrypted data is not valid JSON or does not contain questions');
        toast({
          title: "Decryption Error",
          description: "Could not parse the decrypted data. Check console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Decryption error:', error);
      setDecryptionError(error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: "Decryption Failed",
        description: error instanceof Error ? error.message : 'Unknown error during decryption',
        variant: "destructive"
      });
    } finally {
      setIsDecrypting(false);
    }
  };
  
  // Process and format questions to match our Question interface
  const processQuestions = (rawQuestions: any[]) => {
    const formattedQuestions = rawQuestions.map((q: any) => ({
      id: q.id || `q-${Math.random().toString(36).substring(2, 9)}`,
      content: q.content || q.question || q.problem || '',
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
    
    toast({
      title: "Questions Loaded",
      description: `Successfully loaded ${formattedQuestions.length} questions`,
      variant: "default"
    });
  };
  
  // Helper function to extract questions from various possible object structures
  const extractQuestionsFromObject = (obj: any): any[] => {
    // Look for arrays that might contain questions
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        // Check if this array contains question-like objects
        if (obj[key].length > 0 && 
           (obj[key][0].question || obj[key][0].content || obj[key][0].problem)) {
          return obj[key];
        }
      }
    }
    
    // If we can't find an array of questions, try to construct from object keys
    if (!Array.isArray(obj)) {
      const possibleQuestions = [];
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          possibleQuestions.push(obj[key]);
        }
      }
      if (possibleQuestions.length > 0) {
        return possibleQuestions;
      }
    }
    
    return [];
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
