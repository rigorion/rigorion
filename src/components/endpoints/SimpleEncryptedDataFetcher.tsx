
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle } from "lucide-react";

const SimpleEncryptedDataFetcher = () => {
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [corsError, setCorsError] = useState(false);

  const fetchEncryptedData = async () => {
    setLoading(true);
    setError(null);
    setCorsError(false);

    try {
      console.log("Attempting to fetch from encrypt-sample-data endpoint...");
      
      const response = await fetch('https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/encrypt-sample-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any authorization headers if needed
        },
        mode: 'cors',
        credentials: 'omit', // Don't send cookies to avoid CORS preflight issues
      });

      // Log headers for debugging
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.log("Response headers:", responseHeaders);

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Response from encrypted function:", data);
      
      setEncryptedData(data);
      toast({
        title: "Data fetched",
        description: "Encrypted data received successfully"
      });
    } catch (err: any) {
      console.error("Error fetching encrypted data:", err);
      
      // Check if this is likely a CORS error
      if (err.message && (
          err.message.includes('CORS') || 
          err.message.includes('cross-origin') ||
          err.message.includes('Cross-Origin')
      )) {
        setCorsError(true);
      }
      
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to fetch data: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchEncryptedData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Simple Encrypted Data</CardTitle>
        <CardDescription>Data fetched from encrypt-sample-data endpoint</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={fetchEncryptedData} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? "Fetching..." : "Refresh Data"}
          </Button>

          {corsError && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded text-amber-800 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">CORS Policy Error Detected</h4>
                  <p className="text-sm">The server may not have proper CORS headers configured. The Edge Function needs to include these headers:</p>
                  <pre className="bg-amber-100 p-2 rounded text-xs mt-2 overflow-auto">
{`const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};

// Then return with: 
return new Response(
  JSON.stringify(data),
  { headers: { ...corsHeaders, "Content-Type": "application/json" } }
);`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {error && !corsError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {loading && !encryptedData && (
            <div className="text-center py-4">Loading data...</div>
          )}

          {encryptedData && (
            <div>
              <h3 className="text-sm font-medium mb-1">Fetched Encrypted Data:</h3>
              <div className="bg-gray-50 p-3 rounded border overflow-auto max-h-[300px]">
                {encryptedData.ciphertext && (
                  <div className="mb-2">
                    <p className="font-medium text-sm">Ciphertext:</p>
                    <p className="text-xs font-mono break-all">{encryptedData.ciphertext.substring(0, 100)}...</p>
                  </div>
                )}
                {encryptedData.iv && (
                  <div>
                    <p className="font-medium text-sm">IV:</p>
                    <p className="text-xs font-mono">{encryptedData.iv}</p>
                  </div>
                )}
                <pre className="text-xs font-mono mt-4 pt-4 border-t">
                  {JSON.stringify(encryptedData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleEncryptedDataFetcher;
