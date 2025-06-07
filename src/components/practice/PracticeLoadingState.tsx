
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface PracticeLoadingStateProps {
  loadingMessage: string;
}

const PracticeLoadingState = ({ loadingMessage }: PracticeLoadingStateProps) => {
  return (
    <ThemeProvider>
      <Card className="min-h-screen bg-white dark:bg-gray-900 relative transition-colors duration-300 dark:border-green-500/30">
        <CardContent className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold dark:text-green-400">Loading Practice Questions</h2>
              <p className="text-gray-600 dark:text-green-500 animate-pulse">{loadingMessage}</p>
            </div>
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-green-600">
              <Lock className="h-4 w-4 mr-2" />
              All data is encrypted and secured during transfer
            </div>
          </div>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default PracticeLoadingState;
