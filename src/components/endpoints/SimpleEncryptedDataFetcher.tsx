
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from '@/services/edgeFunctionService';
import { AlertTriangle, CheckCircle } from "lucide-react";

const SimpleEncryptedDataFetcher = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchEncryptedData = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      console.log('Attempting to fetch from encrypt-sample-data endpoint...');
      
      // Get authentication headers
      const authHeaders = await getAuthHeaders();
      console.log('Auth headers for encrypted data:', authHeaders);
      
      // Check if we have auth headers
      if (!authHeaders.Authorization) {
        console.warn('No authentication token available. The request might fail.');
      }
      
      const response = await fetch('https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/encrypt-sample-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        mode: 'cors' // Explicitly set CORS mode
      });
      
      // Log response headers for debugging
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', responseHeaders);
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Response error: ${errorBody}`);
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching encrypted data:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Simple Encrypted Data</CardTitle>
        <CardDescription>Raw encrypted data from the edge function</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button 
            onClick={fetchEncryptedData} 
            disabled={loading}
            variant="outline"
            className="mb-4"
          >
            {loading ? "Fetching..." : "Fetch Encrypted Data"}
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
              Please ensure you are logged in with an account that has access to this resource.
            </p>
          </div>
        )}
        
        {data && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Encrypted Response:</h3>
            <pre className="bg-gray-50 p-3 rounded border border-gray-200 text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
            
            {data.iv && data.ciphertext && (
              <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                <div className="flex items-center text-green-700">
                  <CheckCircle size={16} className="mr-1" />
                  <span className="font-medium">Encrypted data received successfully</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Use the Client Decryption tab to see this data decrypted.
                </p>
              </div>
            )}
          </div>
        )}
        
        {!data && !error && !loading && (
          <div className="text-center py-8 text-gray-400">
            Click the button above to fetch encrypted data
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleEncryptedDataFetcher;
