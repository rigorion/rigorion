
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

const ENDPOINT = "my-function";

export const usePracticeQuestions = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStorageValid, setIsStorageValid] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Initializing secure question system...");

  const fetchAndStoreQuestions = async () => {
    try {
      setLoadingMessage("Connecting to secure server...");
      const baseUrl = "https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1";
      const url = `${baseUrl}/${ENDPOINT}`;
      
      setLoadingMessage("Downloading encrypted question data...");
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      });
      
      if (!response.ok) throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      
      setLoadingMessage("Encrypting and securing data...");
      const result = await response.json();
      await storeSecureFunctionData(ENDPOINT, result);

      let rawQuestions: any[] = [];
      if (result.questions && Array.isArray(result.questions)) {
        rawQuestions = result.questions;
      } else if (Array.isArray(result)) {
        rawQuestions = result;
      } else if (result.data && Array.isArray(result.data)) {
        rawQuestions = result.data;
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
      throw new Error(e.message || "Failed to fetch questions from server");
    }
  };

  const loadLatestQuestions = async () => {
    try {
      setLoadingMessage("Accessing secure storage...");
      
      const { data, fromCache } = await safeGetSecureData(ENDPOINT, async () => {
        setLoadingMessage("No cached data found. Fetching fresh data...");
        return await fetchAndStoreQuestions();
      });
      
      if (data) {
        setLoadingMessage("Decrypting and processing questions...");
        
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
        
        if (!fromCache) {
          toast({
            title: "Questions Updated",
            description: `Successfully loaded ${validQuestions.length} questions and secured them locally.`,
            duration: 3000,
          });
        }
        
        return validQuestions;
      } else {
        throw new Error("No question data available");
      }
    } catch (e: any) {
      console.error("Error in loadLatestQuestions:", e);
      setError(e.message || "Unable to load questions at this time");
      throw e;
    }
  };

  const initializeQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsStorageValid(isSecureStorageValid());
      
      await loadLatestQuestions();
    } catch (e: any) {
      setError(e.message || "Failed to initialize question system");
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
