
// Generic fetch utility for Supabase Edge Functions
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';

// Use the same URL as the main supabase client
const EDGE_FUNCTION_BASE_URL = "https://evfxcdzwmmiguzxdxktl.supabase.co";

export interface EdgeFunctionResponse<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Retrieves current auth token from Supabase with timeout
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Auth timeout')), 3000)
    );
    
    const sessionPromise = supabase.auth.getSession();
    const { data } = await Promise.race([sessionPromise, timeoutPromise]) as any;
    
    if (data.session?.access_token) {
      return {
        Authorization: `Bearer ${data.session.access_token}`
      };
    }
    return {};
  } catch (error) {
    console.error("Error getting auth token:", error);
    return {};
  }
}

/**
 * Enhanced fetch with retry logic and better error handling
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      console.log(`🔄 Attempt ${i + 1}/${retries + 1} for ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log(`✅ Success on attempt ${i + 1}`);
        return response;
      }
      
      if (response.status >= 500 && i < retries) {
        console.log(`⚠️ Server error ${response.status}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Progressive delay
        continue;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error: any) {
      console.error(`❌ Attempt ${i + 1} failed:`, error.message);
      
      if (i === retries) {
        // Final attempt failed
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          throw new Error('Request timed out - your Supabase project may be paused or unreachable');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Network error - check your internet connection and Supabase project status');
        }
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw new Error('All retry attempts failed');
}

/**
 * Calls a Supabase Edge Function with improved error handling
 */
export async function callEdgeFunction<T>(
  functionName: string,
  options: RequestInit = { method: 'GET' },
  queryParams: Record<string, string> = {}
): Promise<EdgeFunctionResponse<T>> {
  try {
    // Build query string from params
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${EDGE_FUNCTION_BASE_URL}/functions/v1/${functionName}${queryString ? `?${queryString}` : ''}`;
    
    console.log(`🚀 Calling Edge Function: ${functionName}`, { url, method: options.method });
    
    // Get auth headers
    const authHeaders = await getAuthHeaders();
    
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZnhjZHp3bW1pZ3V6eGR4a3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODkxNjksImV4cCI6MjA1ODI2NTE2OX0.AN7JVRiz4aFANJPliLpyIfWYC3JxYBeVTYkyZm1sBPo',
      ...authHeaders,
      ...options.headers,
    };

    const response = await fetchWithRetry(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    console.log(`✅ ${functionName} response:`, data);
    return { data, error: null };
  } catch (error) {
    console.error(`❌ Edge Function ${functionName} failed:`, error);
    return { data: null, error: error as Error };
  }
}

/**
 * Hook to fetch data from a Supabase Edge Function
 * @param functionName Name of the edge function to call
 * @param options Additional fetch options
 * @param queryParams Optional URL query parameters 
 * @returns Object containing data, loading state, and any errors
 */
export function useEdgeFunction<T>(
  functionName: string, 
  options: RequestInit = { method: 'GET' },
  queryParams: Record<string, string> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const result = await callEdgeFunction<T>(functionName, options, queryParams);
        
        if (!isMounted) return;
        
        if (result.error) {
          setError(result.error);
          toast({
            title: "Error",
            description: `Failed to load data from ${functionName}`,
            variant: "destructive",
          });
        } else {
          setData(result.data);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err as Error);
        toast({
          title: "Error",
          description: `Failed to load data from ${functionName}`,
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [functionName, JSON.stringify(options), JSON.stringify(queryParams)]);

  return { data, loading, error };
}

/**
 * Specialized function to fetch data from the my-function endpoint
 * @param options Additional fetch options
 * @returns Promise with the edge function response
 */
export async function fetchMyFunctionData<T>(options: RequestInit = { method: 'GET' }) {
  try {
    console.log('Fetching data from my-function endpoint...');
    const result = await callEdgeFunction<T>('my-function', options);
    
    if (result.error) {
      console.error('Error fetching from my-function endpoint:', result.error);
      toast({
        title: "API Error",
        description: `Failed to fetch from my-function: ${result.error.message}`,
        variant: "destructive",
      });
    }
    
    return result;
  } catch (error) {
    console.error('Exception when fetching from my-function:', error);
    toast({
      title: "Exception",
      description: `Exception when calling my-function: ${error instanceof Error ? error.message : String(error)}`,
      variant: "destructive",
    });
    throw error;
  }
}

/**
 * Hook to fetch data from the my-function endpoint
 * @param options Additional fetch options
 * @param queryParams Optional URL query parameters
 * @returns Object containing data, loading state, and any errors
 */
export function useMyFunctionData<T>(
  options: RequestInit = { method: 'GET' },
  queryParams: Record<string, string> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const result = await callEdgeFunction<T>('my-function', options, queryParams);
        
        if (!isMounted) return;
        
        if (result.error) {
          setError(result.error);
          toast({
            title: "Error",
            description: `Failed to load data from my-function`,
            variant: "destructive",
          });
        } else {
          setData(result.data);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err as Error);
        toast({
          title: "Error",
          description: `Failed to load data from my-function`,
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(options), JSON.stringify(queryParams)]);

  return { data, loading, error };
}

/**
 * Specialized function to log interactions via the log-interaction endpoint
 * @param interactionData Data to log
 * @param options Additional fetch options
 * @returns Promise with the edge function response
 */
export async function logInteraction<T>(
  interactionData: any,
  options: RequestInit = {}
): Promise<EdgeFunctionResponse<T>> {
  try {
    console.log('Logging interaction...', interactionData);
    
    // Set up default POST options
    const postOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(interactionData),
      ...options,
    };
    
    const result = await callEdgeFunction<T>('log-interaction', postOptions);
    
    if (result.error) {
      console.error('Error logging interaction:', result.error);
      toast({
        title: "API Error",
        description: `Failed to log interaction: ${result.error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Interaction logged successfully",
      });
    }
    
    return result;
  } catch (error) {
    console.error('Exception when logging interaction:', error);
    toast({
      title: "Exception",
      description: `Exception when logging interaction: ${error instanceof Error ? error.message : String(error)}`,
      variant: "destructive",
    });
    throw error;
  }
}

/**
 * Hook to log interactions using the log-interaction endpoint
 */
export function useLogInteraction() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitInteraction = async (interactionData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await logInteraction(interactionData);
      setData(result.data);
      return result;
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return { submitInteraction, data, loading, error };
}
