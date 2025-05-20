
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const EndpointsAesExplanation = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AES-GCM Encryption</CardTitle>
        <CardDescription>How the AES-GCM encryption works</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            This implementation demonstrates using the AES-GCM (Advanced Encryption Standard in Galois/Counter Mode),
            a widely-used secure encryption algorithm for protecting data between edge functions and the client.
          </p>
          <div>
            <h3 className="font-medium">Key Security Notes:</h3>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>The encryption key should never be sent from the server to the client</li>
              <li>In a real application, keys would be stored securely as environment variables</li>
              <li>AES-GCM requires both a key and an initialization vector (IV) for security</li>
              <li>The IV must be unique for each encryption operation but doesn't need to be secret</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium">How It Works:</h3>
            <ol className="list-decimal pl-6 space-y-1 mt-2">
              <li>Server generates a random IV and encrypts data using the key</li>
              <li>Server sends the encrypted data and IV to the client (but never the key)</li>
              <li>Client must know the key in advance to decrypt</li>
              <li>Client uses the key and IV to decrypt the data</li>
              <li>The decrypted data is then parsed and displayed</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EndpointsAesExplanation;
