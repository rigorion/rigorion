
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from '@/services/edgeFunctionService';
import { AlertTriangle } from "lucide-react";

interface EncryptedFunctionFetcherProps {
  url: string;
  title: string;
  description?: string;
  refreshInterval?: number;
}

const EncryptedFunctionFetcher = ({ 
  url, 
  title, 
  description, 
  refreshInterval 
}: EncryptedFunctionFetcherProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get authentication headers
      const authHeaders = await getAuthHeaders();
      console.log("Auth headers for encrypted function:", authHeaders);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        mode: 'cors' // Explicitly set CORS mode
      });
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching encrypted function data:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button 
            onClick={fetchData} 
            disabled={loading}
            variant="outline"
          >
            {loading ? "Loading..." : "Fetch Encrypted Data"}
          </Button>
          
          {lastUpdated && (
            <div className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 mb-4">
            <div className="flex items-center">
              <AlertTriangle size={16} className="mr-1" />
              <span className="font-medium">Error:</span> {error.message}
            </div>
            <p className="text-sm mt-2">
              This error may occur if you need to authenticate to access the encrypted data.
              Please ensure you are logged in.
            </p>
          </div>
        )}
        
        {data && (
          <div className="overflow-auto">
            <pre className="bg-gray-50 p-4 rounded text-sm">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
        
        {!loading && !error && !data && (
          <div className="text-center py-4 text-gray-500">No data received.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default EncryptedFunctionFetcher;
