
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';

// Helper function to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

const ClientSideDecryptionFetcher = () => {
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [decrypting, setDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This would be your encryption key - in a real app, this should be securely managed
  // For demo purposes we're using a fixed key (same as in the edge function)
  const encryptionKey = "1234567890abcdef"; // Must match the key used on the server

  const fetchEncryptedData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching encrypted data...");
      const response = await fetch('https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/encrypt-sample-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
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

      // Auto-attempt to decrypt
      decryptData(data);
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

  const decryptData = async (data = encryptedData) => {
    if (!data || !data.ciphertext || !data.iv) {
      toast({
        title: "Missing Data",
        description: "No encrypted data available to decrypt",
        variant: "destructive"
      });
      return;
    }

    setDecrypting(true);
    try {
      console.log("Starting decryption process...");
      
      // Convert the encryption key string to bytes
      const encoder = new TextEncoder();
      const keyBytes = encoder.encode(encryptionKey);
      
      // Convert Base64 ciphertext and IV to ArrayBuffer
      const ivBytes = base64ToArrayBuffer(data.iv);
      const ciphertextBytes = base64ToArrayBuffer(data.ciphertext);

      // Import the key for AES-GCM
      const webKey = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      // Decrypt the data
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(ivBytes) },
        webKey,
        ciphertextBytes
      );

      // Convert decrypted data to string and parse as JSON
      const decryptedText = new TextDecoder().decode(decrypted);
      console.log("Decrypted text:", decryptedText);
      
      try {
        const jsonData = JSON.parse(decryptedText);
        setDecryptedData(jsonData);
        toast({
          title: "Decryption successful",
          description: "Data decrypted and parsed as JSON"
        });
      } catch (parseError) {
        // If not valid JSON, just set as text
        setDecryptedData({ text: decryptedText });
        toast({
          title: "Decryption successful",
          description: "Data decrypted as text (not valid JSON)"
        });
      }
    } catch (err: any) {
      console.error("Decryption error:", err);
      setError(`Decryption error: ${err.message}`);
      toast({
        title: "Decryption failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setDecrypting(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchEncryptedData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Client-Side Decryption</CardTitle>
        <CardDescription>Fetch encrypted data and decrypt it in the browser</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={fetchEncryptedData} 
            disabled={loading || decrypting}
            className="mb-4"
          >
            {loading ? "Fetching..." : "Refresh Data"}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 mb-4">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {loading && !encryptedData && (
            <div className="text-center py-4">Loading data...</div>
          )}

          {decrypting && (
            <div className="text-center py-4">Decrypting data...</div>
          )}

          {encryptedData && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Encrypted Data (stored in memory):</h3>
              <div className="bg-gray-50 p-3 rounded border overflow-auto max-h-[150px]">
                <pre className="text-xs font-mono">
                  {JSON.stringify(encryptedData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {decryptedData && (
            <div>
              <h3 className="text-sm font-medium mb-2">Decrypted Data (stored in memory):</h3>
              <div className="bg-gray-50 p-3 rounded border overflow-auto max-h-[300px]">
                <pre className="text-xs font-mono">
                  {JSON.stringify(decryptedData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientSideDecryptionFetcher;
