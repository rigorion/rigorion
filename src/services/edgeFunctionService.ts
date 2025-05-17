
// Generic fetch utility for Supabase Edge Functions
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

// Base URL for Supabase Edge Functions
const EDGE_FUNCTION_BASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://eantvimmgdmxzwrjwrop.supabase.co";

export interface EdgeFunctionResponse<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Calls a Supabase Edge Function using the fetch API
 * @param functionName Name of the edge function to call
 * @param options Additional fetch options (method, headers, body)
 * @param queryParams Optional URL query parameters
 * @returns Promise with the edge function response
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
    
    console.log(`Calling Edge Function: ${functionName}`, { url, method: options.method });
    
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Edge Function ${functionName} failed:`, errorText);
      throw new Error(`Error from ${functionName}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error(`Error calling Edge Function ${functionName}:`, error);
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
