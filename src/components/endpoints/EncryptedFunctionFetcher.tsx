
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { simonDecrypt, base64ToBytes } from '@/utils/simon';
import { toast } from '@/components/ui/use-toast';

interface EncryptedFunctionFetcherProps {
  url: string;
  title?: string;
  description?: string;
}

const EncryptedFunctionFetcher = ({ 
  url,
  title = "Encrypted Function Data",
  description = "Data fetched and decrypted using Simon cipher"
}: EncryptedFunctionFetcherProps) => {
  const [encryptedData, setEncryptedData] = useState<string | null>(null);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [key, setKey] = useState<string>("1234567890abcdef"); // Default key, should be 16 chars (128 bits)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEncryptedData = async () => {
    setLoading(true);
    setError(null);
    setDecryptedData(null);

    try {
      console.log(`Fetching encrypted data from ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Response from encrypted function:", result);
      
      // Check if the response contains a base64-encoded data field
      if (result?.data) {
        setEncryptedData(result.data);
        toast({
          title: "Data fetched",
          description: "Encrypted data received successfully"
        });
      } else {
        // If not encrypted, just store the raw data
        setEncryptedData(JSON.stringify(result));
        toast({
          title: "Warning",
          description: "Received data doesn't appear to be encrypted",
          // Fix: Change 'warning' to 'destructive' as it's one of the accepted values
          variant: "destructive"
        });
      }
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

  const decryptData = () => {
    if (!encryptedData) {
      toast({
        title: "No data",
        description: "No encrypted data to decrypt",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if key is valid (16 bytes)
      if (key.length !== 16) {
        throw new Error("Key must be exactly 16 characters (128 bits)");
      }

      // Try to decode as base64
      let ciphertext: Uint8Array;
      try {
        console.log("Decoding base64 data");
        ciphertext = base64ToBytes(encryptedData);
        console.log("Successfully decoded base64 to bytes, length:", ciphertext.length);
      } catch (e) {
        console.error("Base64 decoding error:", e);
        throw new Error("Invalid Base64 data");
      }

      // Decrypt the data
      console.log("Attempting to decrypt data with key:", key);
      const decrypted = simonDecrypt(ciphertext, key);
      console.log("Decryption result:", decrypted);
      
      // Parse as JSON if possible
      try {
        const parsed = JSON.parse(decrypted);
        setDecryptedData(parsed);
        toast({
          title: "Decryption successful",
          description: "Data decrypted and parsed as JSON"
        });
      } catch (e) {
        // If not valid JSON, just set as text
        setDecryptedData(decrypted);
        toast({
          title: "Decryption successful",
          description: "Data decrypted as text"
        });
      }
    } catch (err: any) {
      console.error("Error decrypting data:", err);
      setError(err.message);
      toast({
        title: "Decryption error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="key" className="text-sm font-medium">
              Decryption Key (16 characters):
            </label>
            <div className="flex space-x-2">
              <Input
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="font-mono"
                maxLength={16}
              />
              <Button onClick={fetchEncryptedData} disabled={loading}>
                {loading ? "Fetching..." : "Fetch Data"}
              </Button>
              <Button 
                onClick={decryptData} 
                disabled={!encryptedData || loading}
                variant="outline"
              >
                Decrypt
              </Button>
            </div>
            {key.length !== 16 && (
              <p className="text-xs text-red-500">
                Key must be exactly 16 characters (currently {key.length})
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {encryptedData && (
            <div>
              <h3 className="text-sm font-medium mb-1">Encrypted Data:</h3>
              <div className="bg-gray-50 p-3 rounded border text-xs font-mono overflow-auto max-h-[100px]">
                {encryptedData}
              </div>
            </div>
          )}

          {decryptedData && (
            <div>
              <h3 className="text-sm font-medium mb-1">Decrypted Data:</h3>
              <div className="bg-gray-50 p-3 rounded border overflow-auto max-h-[300px]">
                <pre className="text-xs font-mono">
                  {typeof decryptedData === 'object'
                    ? JSON.stringify(decryptedData, null, 2)
                    : decryptedData}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EncryptedFunctionFetcher;
