
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, KeyRound, Lock } from "lucide-react";

interface PracticeMainHeaderProps {
  questionsCount: number;
  lastFetched: Date | null;
  onClearStorage: () => void;
}

const PracticeMainHeader = ({ 
  questionsCount, 
  lastFetched, 
  onClearStorage 
}: PracticeMainHeaderProps) => {
  return (
    <CardHeader className="dark:border-b dark:border-green-500/30">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="flex items-center gap-2 dark:text-green-400">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            Practice Questions
          </CardTitle>
          <CardDescription className="dark:text-green-500">
            {questionsCount} questions loaded and ready for practice
          </CardDescription>
        </div>
        <Button
          size="sm"
          onClick={onClearStorage}
          className="flex items-center gap-2"
          variant="outline"
        >
          <KeyRound className="h-4 w-4" />
          Reset Storage
        </Button>
      </div>
      <div className="flex items-center justify-between text-xs">
        <p className="text-green-600 dark:text-green-400 flex items-center">
          <Lock className="h-3 w-3 inline mr-1" />
          Questions are automatically encrypted and validated for security
        </p>
        {lastFetched && (
          <span className="text-gray-500 dark:text-green-500">
            Last updated: {lastFetched.toLocaleTimeString()}
          </span>
        )}
      </div>
    </CardHeader>
  );
};

export default PracticeMainHeader;
