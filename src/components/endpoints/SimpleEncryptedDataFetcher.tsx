
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';

const SimpleEncryptedDataFetcher = () => {
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEncryptedData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/encrypt-sample-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

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

          {error && (
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
