
import { useState } from "react";
import useSecureContent from "@/hooks/useSecureContent";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Unlock } from "lucide-react";

interface EncryptedQuestionsProps {
  id: string;
  showHint?: boolean;
}

function EncryptedQuestions({ id, showHint = false }: EncryptedQuestionsProps) {
  const { decryptQuestion, isLoading, error } = useSecureContent();
  const [answer, setAnswer] = useState<string>('');
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  
  const handleRevealAnswer = async () => {
    try {
      setIsDecrypting(true);
      setDecryptionError(null);
      
      const result = await decryptQuestion(id);
      setAnswer(result);
    } catch (error) {
      console.error("Decryption error:", error);
      setDecryptionError(error instanceof Error ? error.message : "Failed to decrypt answer");
    } finally {
      setIsDecrypting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
        <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
        <p className="text-sm text-gray-600">Loading secure content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p className="text-sm">Error loading secure content: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md border p-4 shadow-sm">
      <div className="flex flex-col space-y-4">
        {showHint && (
          <div className="text-sm text-gray-500 italic">
            This content is securely encrypted and decrypted only when needed.
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRevealAnswer}
          disabled={isDecrypting}
          className="flex items-center"
        >
          {isDecrypting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Decrypting...
            </>
          ) : answer ? (
            <>
              <Unlock className="h-4 w-4 mr-2 text-green-500" />
              Hide Answer
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2 text-blue-500" />
              Show Answer
            </>
          )}
        </Button>
        
        {decryptionError && (
          <div className="p-2 bg-red-50 text-red-700 text-sm rounded-md">
            {decryptionError}
          </div>
        )}
        
        {answer && !decryptionError && (
          <div className="p-4 bg-green-50 rounded-md border border-green-100 secure-content">
            <p className="text-sm font-medium">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EncryptedQuestions;
