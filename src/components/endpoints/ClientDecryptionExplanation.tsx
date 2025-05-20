
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const ClientDecryptionExplanation = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Client-Side Decryption</CardTitle>
        <CardDescription>How browser-based decryption works</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            This component demonstrates fetching encrypted data from a Supabase Edge Function
            and decrypting it entirely in the browser using the Web Crypto API.
          </p>
          <div>
            <h3 className="font-medium">Security Considerations:</h3>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>The encryption key is currently hardcoded for demonstration purposes</li>
              <li>In a production app, the key should be securely stored and retrieved</li>
              <li>Client-side decryption means the key must be available to the browser</li>
              <li>This approach works well for personalized encrypted content</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium">Implementation Steps:</h3>
            <ol className="list-decimal pl-6 space-y-1 mt-2">
              <li>Fetch the encrypted data (ciphertext and IV) from the server</li>
              <li>Convert the Base64-encoded data to binary arrays</li>
              <li>Import the encryption key for use with the Web Crypto API</li>
              <li>Decrypt the data using AES-GCM algorithm</li>
              <li>Convert the decrypted binary data back to text</li>
              <li>Parse the result as JSON (if applicable)</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientDecryptionExplanation;
