
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  storeSecureFunctionData,
  safeGetSecureData,
  clearAllSecureData,
  isSecureStorageValid,
} from "@/services/secureIndexedDbService";
import { mapQuestions, validateQuestion } from "@/utils/mapQuestion";
import { Question } from "@/types/QuestionInterface";
import { callEdgeFunction } from "@/services/edgeFunctionService";

const ENDPOINT = "my-function";
const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

export const usePracticeQuestions = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStorageValid, setIsStorageValid] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Initializing secure question system...");

  const fetchAndStoreQuestions = async (retryCount = 0): Promise<number> => {
    try {
      setLoadingMessage("Connecting to secure server...");
      
      const { data: result, error: fetchError } = await callEdgeFunction(ENDPOINT);
      
      if (fetchError || !result) {
        throw new Error(fetchError?.message || "Failed to fetch questions from server");
      }
      
      setLoadingMessage("Encrypting and securing data...");
      await storeSecureFunctionData(ENDPOINT, result);

      let rawQuestions: any[] = [];
      if (result && typeof result === 'object') {
        const resultObj = result as any;
        if (resultObj.questions && Array.isArray(resultObj.questions)) {
          rawQuestions = resultObj.questions;
        } else if (Array.isArray(result)) {
          rawQuestions = result as any[];
        } else if (resultObj.data && Array.isArray(resultObj.data)) {
          rawQuestions = resultObj.data;
        }
      }

      setLoadingMessage("Processing and validating questions...");
      const mappedQuestions = mapQuestions(rawQuestions);
      const validQuestions = mappedQuestions.filter(validateQuestion);

      setQuestions(validQuestions);
      setLastFetched(new Date());
      setError(null);
      
      return validQuestions.length;
    } catch (e: any) {
      console.error("Error in fetchAndStoreQuestions:", e);
      
      // Retry logic for network failures
      if (retryCount < MAX_RETRIES && (e.message.includes("fetch") || e.message.includes("network") || e.message.includes("Failed to fetch"))) {
        console.log(`Retrying fetch attempt ${retryCount + 1}/${MAX_RETRIES}...`);
        setLoadingMessage(`Connection failed. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return await fetchAndStoreQuestions(retryCount + 1);
      }
      
      throw new Error(e.message || "Failed to fetch questions from server");
    }
  };

  const loadLatestQuestions = async () => {
    try {
      setLoadingMessage("Accessing secure storage...");
      
      // First, try to get cached data
      const cachedData = await safeGetSecureData(ENDPOINT, async () => {
        setLoadingMessage("No cached data found. Fetching fresh data...");
        await fetchAndStoreQuestions();
        return null; // Return null since we just want to store, not return data
      });
      
      if (cachedData && cachedData.data) {
        setLoadingMessage("Decrypting and processing questions...");
        
        let rawQuestions: any[] = [];
        const data = cachedData.data;
        
        if (data && typeof data === 'object') {
          const dataObj = data as any;
          if (dataObj.questions && Array.isArray(dataObj.questions)) {
            rawQuestions = dataObj.questions;
          } else if (Array.isArray(data)) {
            rawQuestions = data as any[];
          } else if (dataObj.data && Array.isArray(dataObj.data)) {
            rawQuestions = dataObj.data;
          }
        }

        const mappedQuestions = mapQuestions(rawQuestions);
        const validQuestions = mappedQuestions.filter(validateQuestion);

        setQuestions(validQuestions);
        setLastFetched(new Date());
        setError(null);
        
        if (!cachedData.fromCache) {
          toast({
            title: "Questions Updated",
            description: `Successfully loaded ${validQuestions.length} questions and secured them locally.`,
            duration: 3000,
          });
        }
        
        return validQuestions;
      }
    } catch (e: any) {
      console.error("Error in loadLatestQuestions:", e);
      
      // If cached data fails, try direct fetch with retry logic
      try {
        await fetchAndStoreQuestions();
      } catch (fetchError: any) {
        setError(fetchError.message || "Unable to load questions at this time");
        throw fetchError;
      }
    }
  };

  const initializeQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsStorageValid(isSecureStorageValid());
      
      await loadLatestQuestions();
    } catch (e: any) {
      console.error("All initialization attempts failed:", e);
      setError("Unable to connect to the question service. The system will automatically retry in a few moments.");
      
      // Auto-retry after 5 seconds
      setTimeout(() => {
        console.log("Auto-retrying initialization...");
        initializeQuestions();
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = async () => {
    try {
      await clearAllSecureData();
      setQuestions([]);
      setLastFetched(null);
      setIsStorageValid(true);
      toast({
        title: "Storage Cleared",
        description: "All secure data has been removed. The system will fetch fresh data automatically.",
      });
      await initializeQuestions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear storage. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    initializeQuestions();
  }, []);

  return {
    questions,
    lastFetched,
    loading,
    isStorageValid,
    error,
    loadingMessage,
    initializeQuestions,
    handleClearStorage,
  };
};
