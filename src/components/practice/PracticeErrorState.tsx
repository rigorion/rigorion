
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, KeyRound } from "lucide-react";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface PracticeErrorStateProps {
  error: string;
  isStorageValid: boolean;
  onRetry: () => void;
  onClearStorage: () => void;
}

const PracticeErrorState = ({ 
  error, 
  isStorageValid, 
  onRetry, 
  onClearStorage 
}: PracticeErrorStateProps) => {
  return (
    <ThemeProvider>
      <Card className="min-h-screen bg-white dark:bg-gray-900 relative transition-colors duration-300 dark:border-red-500/30">
        <CardContent className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center space-y-6 max-w-md">
            <div className="flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Service Temporarily Unavailable</h2>
              <p className="text-gray-600 dark:text-gray-300">{error}</p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={onRetry} 
                className="w-full dark:bg-green-600 dark:hover:bg-green-700"
              >
                Retry Connection
              </Button>
              {!isStorageValid && (
                <Button 
                  onClick={onClearStorage} 
                  variant="outline"
                  className="w-full dark:border-green-500/30 dark:text-green-400 dark:hover:bg-gray-800"
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Reset Storage & Retry
                </Button>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-green-600">
              If this issue persists, please check your internet connection or contact support.
            </div>
          </div>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default PracticeErrorState;
