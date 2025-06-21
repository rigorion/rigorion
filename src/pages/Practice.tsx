
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, RefreshCw, AlertTriangle, KeyRound, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  storeSecureFunctionData,
  safeGetSecureData,
  clearAllSecureData,
  isSecureStorageValid,
} from "@/services/secureIndexedDbService";
import PracticeContent from "@/components/practice/PracticeContent";
import { mapQuestions, validateQuestion } from "@/utils/mapQuestion";
import { Question } from "@/types/QuestionInterface";
import { ThemeProvider } from "@/contexts/ThemeContext";

const ENDPOINT = "my-function";

const Practice = () => {
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    fontFamily: "inter",
    fontSize: 14,
    colorStyle: "plain" as const,
    textColor: "#374151"
  });

  const handleSettingsChange = (key: any, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [questions, setQuestions] = useState<Question[]>([]);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [isStorageValid, setIsStorageValid] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Test connection status
  const testConnection = async () => {
    setConnectionStatus('checking');
    try {
      const response = await fetch('https://evfxcdzwmmiguzxdxktl.supabase.co/rest/v1/', {
        method: 'HEAD',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
      });
      
      setConnectionStatus(response.ok ? 'online' : 'offline');
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('offline');
      return false;
    }
  };

  const fetchAndStoreQuestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test connection first
      const isOnline = await testConnection();
      
      if (!isOnline) {
        throw new Error("Cannot connect to Supabase. Your project may be paused or unreachable.");
      }

      const baseUrl = "https://evfxcdzwmmiguzxdxktl.supabase.co/functions/v1";
      const url = `${baseUrl}/${ENDPOINT}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      console.log('🔄 Fetching questions from:', url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY || ''
        },
        mode: "cors",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Received data:', result);

      await storeSecureFunctionData(ENDPOINT, result);

      let rawQuestions: any[] = [];
      if (result.questions && Array.isArray(result.questions)) {
        rawQuestions = result.questions;
      } else if (Array.isArray(result)) {
        rawQuestions = result;
      } else if (result.data && Array.isArray(result.data)) {
        rawQuestions = result.data;
      }

      const mappedQuestions = mapQuestions(rawQuestions);
      const validQuestions = mappedQuestions.filter(validateQuestion);

      setQuestions(validQuestions);
      setLastFetched(new Date());
      setConnectionStatus('online');
      
      toast({
        title: "Questions Loaded Successfully",
        description: `Fetched ${validQuestions.length} questions and stored securely.`,
      });
    } catch (e: any) {
      console.error('❌ Fetch error:', e);
      setError(e.message || "Failed to fetch questions");
      setConnectionStatus('offline');
      
      // Try to load from cache as fallback
      try {
        const cachedData = await safeGetSecureData(ENDPOINT);
        if (cachedData.data) {
          console.log('📦 Loading from cache as fallback');
          // Process cached data same way
          let rawQuestions: any[] = [];
          if (cachedData.data.questions && Array.isArray(cachedData.data.questions)) {
            rawQuestions = cachedData.data.questions;
          } else if (Array.isArray(cachedData.data)) {
            rawQuestions = cachedData.data;
          } else if (cachedData.data.data && Array.isArray(cachedData.data.data)) {
            rawQuestions = cachedData.data.data;
          }

          const mappedQuestions = mapQuestions(rawQuestions);
          const validQuestions = mappedQuestions.filter(validateQuestion);
          setQuestions(validQuestions);
          
          toast({
            title: "Loaded from Cache",
            description: `Using ${validQuestions.length} cached questions while offline.`,
          });
        }
      } catch (cacheError) {
        console.error('Cache fallback also failed:', cacheError);
      }
      
      toast({
        title: "Connection Error",
        description: e.message.includes('timeout') ? 
          "Request timed out. Your Supabase project may be paused." :
          "Failed to fetch questions. Check your connection and Supabase project status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLatestQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, fromCache } = await safeGetSecureData(ENDPOINT, fetchAndStoreQuestions);
      if (data) {
        let rawQuestions: any[] = [];
        if (data.questions && Array.isArray(data.questions)) {
          rawQuestions = data.questions;
        } else if (Array.isArray(data)) {
          rawQuestions = data;
        } else if (data.data && Array.isArray(data.data)) {
          rawQuestions = data.data;
        }

        const mappedQuestions = mapQuestions(rawQuestions);
        const validQuestions = mappedQuestions.filter(validateQuestion);

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

  useEffect(() => {
    setIsStorageValid(isSecureStorageValid());
    testConnection();
    loadLatestQuestions();
  }, []);

  return (
    <ThemeProvider>
      <Card className="min-h-screen bg-white dark:bg-gray-900 relative transition-colors duration-300 dark:border-green-500/30">
        {/* Header section */}
        <CardHeader className="dark:border-b dark:border-green-500/30">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 dark:text-green-400">
                <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                Practice Questions
                {/* Connection status indicator */}
                {connectionStatus === 'online' && <Wifi className="h-4 w-4 text-green-500" />}
                {connectionStatus === 'offline' && <WifiOff className="h-4 w-4 text-red-500" />}
                {connectionStatus === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />}
              </CardTitle>
              <CardDescription className="dark:text-green-500">
                Questions are securely encrypted and mapped to ensure consistent UI display.
                {connectionStatus === 'offline' && (
                  <span className="text-red-500 block mt-1">
                    ⚠️ Offline mode - using cached data
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                onClick={fetchAndStoreQuestions}
                disabled={loading}
                className="flex items-center gap-2 dark:bg-green-600 dark:hover:bg-green-700 dark:border-green-500/30"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Fetch & Encrypt
              </Button>
              <Button
                size="sm"
                onClick={loadLatestQuestions}
                disabled={loading}
                className="flex items-center gap-2 dark:border-green-500/30 dark:text-green-400 dark:hover:bg-gray-800"
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
          
          {/* Enhanced error display */}
          {connectionStatus === 'offline' && (
            <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
              <WifiOff className="h-4 w-4 mr-2" />
              Connection failed. Please check:
              <ul className="ml-4 list-disc">
                <li>Your Supabase project is not paused</li>
                <li>Your internet connection is stable</li>
                <li>The Supabase URL and API keys are correct</li>
              </ul>
            </div>
          )}
          
          {!isStorageValid && (
            <div className="mt-2 flex items-center text-red-600 text-xs">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Storage integrity check failed. Please clear cache and refetch.
            </div>
          )}
        </CardHeader>
        
        {/* Content area */}
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-green-400" />
              <span className="ml-2 dark:text-green-400">Loading and mapping secure questions...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-8">
              <div className="text-red-600 dark:text-red-400 mb-2">{error}</div>
              <Button onClick={fetchAndStoreQuestions} className="dark:bg-green-600 dark:hover:bg-green-700">Retry</Button>
            </div>
          ) : questions && questions.length > 0 ? (
            <>
              <PracticeContent 
                questions={questions} 
                settings={settings} 
                onSettingsChange={handleSettingsChange}
              />
              {/* Removed AIAnalyzer and CommentSection since they're now in the footer */}
            </>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-400 dark:text-green-500">
              No secure questions available. Please fetch data.
            </div>
          )}
          {lastFetched && (
            <div className="text-xs text-gray-500 dark:text-green-500 p-2 border-t dark:border-green-500/30">
              Last updated: {lastFetched.toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default Practice;
