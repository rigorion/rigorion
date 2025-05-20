
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { getAuthHeaders } from '@/services/edgeFunctionService';

const ClientSideDecryptionFetcher = () => {
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // This is for demonstration only; in a real app, this would be securely stored
  const ENCRYPTION_KEY = "TmV2ZXJVc2VUaGlzS2V5SW5Qcm9k"; // Base64 encoded demo key

  const fetchEncryptedData = async () => {
    setLoading(true);
    setError(null);
    setEncryptedData(null);
    setDecryptedData(null);
    
    try {
      console.log('Fetching encrypted data...');
      
      // Get authentication headers
      const authHeaders = await getAuthHeaders();
      
      // Check if we have auth headers
      if (!authHeaders.Authorization) {
        console.warn('No authentication token available. The request might fail.');
      }
      
      const response = await fetch('https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/encrypt-sample-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      setEncryptedData(result);
      
      // Now decrypt the data
      const decrypted = await decryptData(result.ciphertext, result.iv);
      setDecryptedData(decrypted);
      setLastUpdated(new Date());
      
      toast({
        title: "Data Decrypted",
        description: "Successfully fetched and decrypted the data client-side",
      });
    } catch (error) {
      console.error('Error fetching encrypted data:', error);
      setError(error as Error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch or decrypt data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const decryptData = async (ciphertext: string, iv: string) => {
    try {
      // Convert base64 encoded strings to array buffers
      const keyData = atob(ENCRYPTION_KEY);
      const keyBuffer = new Uint8Array(keyData.length);
      for (let i = 0; i < keyData.length; i++) {
        keyBuffer[i] = keyData.charCodeAt(i);
      }
      
      const ivBuffer = base64ToArrayBuffer(iv);
      const ciphertextBuffer = base64ToArrayBuffer(ciphertext);
      
      // Import the key
      const key = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );
      
      // Decrypt the data
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivBuffer
        },
        key,
        ciphertextBuffer
      );
      
      // Convert result to string and parse as JSON
      const decoder = new TextDecoder();
      const jsonStr = decoder.decode(decrypted);
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data: ' + (error instanceof Error ? error.message : String(error)));
    }
  };
  
  // Helper function to convert Base64 to ArrayBuffer
  const base64ToArrayBuffer = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Client-Side Decryption</CardTitle>
        <CardDescription>Fetches encrypted data and decrypts it in the browser</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button 
            onClick={fetchEncryptedData} 
            disabled={loading}
            variant="outline"
            className="mb-2"
          >
            {loading ? "Processing..." : "Fetch & Decrypt Data"}
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
        
        {encryptedData && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Encrypted Data:</h3>
            <pre className="bg-gray-50 p-3 rounded border border-gray-200 text-xs overflow-auto max-h-32">
              {JSON.stringify(encryptedData, null, 2)}
            </pre>
          </div>
        )}
        
        {decryptedData && (
          <div className="mt-4">
            <div className="flex items-center text-green-700 mb-2">
              <CheckCircle size={16} className="mr-1" />
              <h3 className="text-sm font-medium">Decrypted Data:</h3>
            </div>
            <pre className="bg-green-50 p-3 rounded border border-green-200 text-sm overflow-auto">
              {JSON.stringify(decryptedData, null, 2)}
            </pre>
          </div>
        )}
        
        {!encryptedData && !error && !loading && (
          <div className="text-center py-8 text-gray-400">
            Click the button above to fetch and decrypt data
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientSideDecryptionFetcher;
