
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, RefreshCw, AlertTriangle, KeyRound, Filter } from "lucide-react";
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
import { mapQuestions, validateQuestion, filterQuestions, getUniqueExams, getUniqueChapters } from "@/utils/mapQuestion";
import { Question } from "@/types/QuestionInterface";
import { callEdgeFunction } from "@/services/edgeFunctionService";

const ENDPOINT = "my-function"; // Customize this to your questions endpoint

const Practice = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [isStorageValid, setIsStorageValid] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedExam, setSelectedExam] = useState<number | "all">("all");
  const [selectedChapter, setSelectedChapter] = useState<string | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  
  // Progress data
  const [progressData, setProgressData] = useState<any>(null);
  const [progressLoading, setProgressLoading] = useState(false);

  // Fetch progress data
  const fetchProgressData = async () => {
    setProgressLoading(true);
    try {
      const { data, error } = await callEdgeFunction('get-user-progress');
      
      if (!error && data && Array.isArray(data) && data.length > 0) {
        setProgressData(data[0]);
        console.log('[PRACTICE] Progress data loaded:', data[0]);
        toast({
          title: "Progress Data Loaded",
          description: "User progress information updated successfully.",
        });
      } else {
        console.warn('[PRACTICE] No progress data available');
      }
    } catch (e: any) {
      console.error('[PRACTICE] Progress fetch error:', e);
      toast({
        title: "Progress Error",
        description: "Could not load progress data.",
        variant: "destructive",
      });
    } finally {
      setProgressLoading(false);
    }
  };

  // Filter questions when filters change
  useEffect(() => {
    const filtered = filterQuestions(questions, selectedExam, selectedChapter);
    setFilteredQuestions(filtered);
    console.log('[PRACTICE] Filtered questions:', filtered.length, 'of', questions.length);
  }, [questions, selectedExam, selectedChapter]);

  // Get unique values for filters
  const availableExams = getUniqueExams(questions);
  const availableChapters = getUniqueChapters(questions);

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

      console.log('[PRACTICE] Raw API response:', result);

      // Store the raw data
      await storeSecureFunctionData(ENDPOINT, result);
      
      // Extract and map questions
      let rawQuestions: any[] = [];
      if (result.questions && Array.isArray(result.questions)) {
        rawQuestions = result.questions;
      } else if (Array.isArray(result)) {
        rawQuestions = result;
      } else if (result.data && Array.isArray(result.data)) {
        rawQuestions = result.data;
      }

      // Map the questions using our mapping utility
      const mappedQuestions = mapQuestions(rawQuestions);
      const validQuestions = mappedQuestions.filter(validateQuestion);
      
      console.log('[PRACTICE] Mapped and validated questions:', validQuestions);
      
      setQuestions(validQuestions);
      setLastFetched(new Date());
      toast({
        title: "Questions Fetched & Encrypted",
        description: `Fetched ${validQuestions.length} questions and stored securely.`,
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
        console.log('[PRACTICE] Loaded raw data from cache:', data);
        
        // Extract and map questions from cached data
        let rawQuestions: any[] = [];
        if (data.questions && Array.isArray(data.questions)) {
          rawQuestions = data.questions;
        } else if (Array.isArray(data)) {
          rawQuestions = data;
        } else if (data.data && Array.isArray(data.data)) {
          rawQuestions = data.data;
        }

        // Map and validate the questions
        const mappedQuestions = mapQuestions(rawQuestions);
        const validQuestions = mappedQuestions.filter(validateQuestion);
        
        console.log('[PRACTICE] Mapped cached questions:', validQuestions);
        
        setQuestions(validQuestions);
        setLastFetched(new Date());
        setError(null);
        toast({
          title: "Questions Loaded",
          description: fromCache
            ? `Loaded ${validQuestions.length} questions from secure storage.`
            : `Fetched ${validQuestions.length} questions from server and stored securely.`,
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
    setFilteredQuestions([]);
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
    fetchProgressData();
  }, []);

  return (
    <Card className="min-h-screen bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              Practice Questions
              {progressData && (
                <span className="text-sm text-gray-500 ml-2">
                  Score: {progressData.avg_score}% | Streak: {progressData.streak_days} days
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Questions are securely encrypted and mapped to ensure consistent UI display.
              {filteredQuestions.length !== questions.length && (
                <span className="text-blue-600 font-medium ml-2">
                  Showing {filteredQuestions.length} of {questions.length} questions
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button
              size="sm"
              onClick={fetchProgressData}
              disabled={progressLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {progressLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Progress
            </Button>
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
              Clear Cache
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Exam:</label>
                <select 
                  value={selectedExam} 
                  onChange={(e) => setSelectedExam(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All Exams</option>
                  {availableExams.map(exam => (
                    <option key={exam} value={exam}>Exam {exam}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Chapter:</label>
                <select 
                  value={selectedChapter} 
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All Chapters</option>
                  {availableChapters.map(chapter => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </select>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedExam("all");
                  setSelectedChapter("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-green-600 mt-2 flex items-center">
          <Lock className="h-3 w-3 inline mr-1" />
          Secure mode: Questions are mapped and validated for consistent display.
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
            <span className="ml-2">Loading and mapping secure questions...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-8">
            <div className="text-red-600 mb-2">{error}</div>
            <Button onClick={fetchAndStoreQuestions}>Retry</Button>
          </div>
        ) : filteredQuestions && filteredQuestions.length > 0 ? (
          <>
            <PracticeContent questions={filteredQuestions} />
            <AIAnalyzer
              context="practice"
              data={{
                currentQuestion: filteredQuestions[0],
                currentIndex: 0,
                totalQuestions: filteredQuestions.length,
                questions: filteredQuestions.slice(0, 3),
                progressData: progressData,
              }}
            />
            <CommentSection />
          </>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-400">
            No questions match the current filters. Please adjust filters or fetch new data.
          </div>
        )}
        {lastFetched && (
          <div className="text-xs text-gray-500 p-2">
            Last updated: {lastFetched.toLocaleTimeString()}
            {progressData && (
              <span className="ml-4">
                Progress: {progressData.total_attempted}/{progressData.total_questions} questions
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Practice;
