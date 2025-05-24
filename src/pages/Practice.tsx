import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, RefreshCw, AlertTriangle, KeyRound } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  storeSecureFunctionData,
  getSecureLatestFunctionData,
  safeGetSecureData,
  clearAllSecureData,
  isSecureStorageValid,
} from "@/services/secureIndexedDbService";
import PracticeContent from "@/components/practice/PracticeContent";
import AIAnalyzer from "@/components/ai/AIAnalyzer";
import CommentSection from "@/components/practice/CommentSection";

const ENDPOINT = "my-function"; // Customize this to your questions endpoint

const Practice = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState([]);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [isStorageValid, setIsStorageValid] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch from API and store securely
  const fetchAndStoreQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = "https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1";
      const url = `${baseUrl}/${ENDPOINT}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const result = await response.json();

      await storeSecureFunctionData(ENDPOINT, result);
      setQuestions(result);
      setLastFetched(new Date());
      toast({
        title: "Questions Fetched & Encrypted",
        description: "Fetched questions stored securely.",
      });
    } catch (e: any) {
      setError(e.message || "Unknown error");
      toast({
        title: "Error",
        description: e.message || "Failed to fetch or store questions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load latest from encrypted storage (with fallback fetch if needed)
  const loadLatestQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, fromCache } = await safeGetSecureData(ENDPOINT, fetchAndStoreQuestions);
      if (data) {
        setQuestions(data);
        setLastFetched(new Date());
        setError(null);
        toast({
          title: "Questions Loaded",
          description: fromCache
            ? "Loaded from secure storage."
            : "Fetched from server and stored securely.",
        });
      } else {
        setQuestions([]);
        setError("No secure questions found.");
      }
    } catch (e: any) {
      setQuestions([]);
      setError(e.message || "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  // Clear secure cache (optional, for manual testing)
  const handleClearStorage = async () => {
    await clearAllSecureData();
    setQuestions([]);
    setLastFetched(null);
    setIsStorageValid(true);
    toast({
      title: "Storage Cleared",
      description: "All secure questions have been removed.",
    });
  };

  // Check validity on mount
  useEffect(() => {
    setIsStorageValid(isSecureStorageValid());
    loadLatestQuestions();
  }, []);

  return (
    <Card className="min-h-screen bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              Practice Questions
            </CardTitle>
            <CardDescription>
              Only encrypted, fetched questions are used. No local or sample data.
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              onClick={fetchAndStoreQuestions}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Fetch & Encrypt
            </Button>
            <Button
              size="sm"
              onClick={loadLatestQuestions}
              disabled={loading}
              className="flex items-center gap-2"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" />
              Load Latest
            </Button>
            <Button
              size="sm"
              onClick={handleClearStorage}
              disabled={loading}
              className="flex items-center gap-2"
              variant="destructive"
            >
              <KeyRound className="h-4 w-4" />
              Clear Secure Cache
            </Button>
          </div>
        </div>
        <p className="text-xs text-green-600 mt-2 flex items-center">
          <Lock className="h-3 w-3 inline mr-1" />
          Secure mode: Only encrypted, fetched questions are used.
        </p>
        {!isStorageValid && (
          <div className="mt-2 flex items-center text-red-600 text-xs">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Storage integrity check failed. Please clear cache and refetch.
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">Loading secure questions...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-8">
            <div className="text-red-600 mb-2">{error}</div>
            <Button onClick={fetchAndStoreQuestions}>Retry</Button>
          </div>
        ) : questions && questions.length > 0 ? (
          <>
            <PracticeContent questions={questions} />
            {/* AI Analyzer & Comment Section, as before */}
            <AIAnalyzer
              context="practice"
              data={{
                currentQuestion: questions[0],
                currentIndex: 0,
                totalQuestions: questions.length,
                questions: questions.slice(0, 3),
              }}
            />
            <div className="fixed bottom-6 left-6 z-40">
              <CommentSection />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-400">
            No secure questions available. Please fetch data.
          </div>
        )}
        {lastFetched && (
          <div className="text-xs text-gray-500 p-2">
            Last updated: {lastFetched.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Practice;
