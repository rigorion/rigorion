
// This file is imported as a web worker through the Vite worker plugin
import CryptoJS from 'crypto-js';

// Define a type for the messages
type WorkerMessage = {
  cipherText: string;
  iv?: string;
  key?: string;
  action: 'decrypt' | 'status';
};

// Define a type for the response
type WorkerResponse = {
  success: boolean;
  result?: string;
  error?: string;
  status?: string;
};

// Initialize secure context
let secureContext: {
  key?: string;
  isReady: boolean;
} = {
  isReady: false
};

// Handle messages from the main thread
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  try {
    const { action, cipherText, iv, key } = e.data;
    
    // Handle status check
    if (action === 'status') {
      self.postMessage({ 
        success: true, 
        status: secureContext.isReady ? 'ready' : 'not-ready' 
      } as WorkerResponse);
      return;
    }
    
    // For decryption action
    if (action === 'decrypt') {
      if (!cipherText) {
        self.postMessage({ 
          success: false, 
          error: 'No cipher text provided' 
        } as WorkerResponse);
        return;
      }
      
      // Use provided key or stored key
      const decryptionKey = key || secureContext.key || 'secure-key-for-demo-purposes-only';
      
      try {
        // Split IV and ciphertext if provided separately
        let decrypted;
        
        if (iv) {
          // Use Web Crypto API format (IV separate from ciphertext)
          const ivArray = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
          const encryptedArray = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
          
          // Convert to CryptoJS format
          const ivWordArray = CryptoJS.lib.WordArray.create(ivArray as unknown as number[]);
          const cipherWordArray = CryptoJS.lib.WordArray.create(encryptedArray as unknown as number[]);
          
          // Decrypt
          const decryptedWordArray = CryptoJS.AES.decrypt(
            { ciphertext: cipherWordArray },
            CryptoJS.enc.Utf8.parse(decryptionKey),
            { iv: ivWordArray, mode: CryptoJS.mode.GCM }
          );
          
          decrypted = decryptedWordArray.toString(CryptoJS.enc.Utf8);
        } else {
          // Legacy format (all-in-one ciphertext)
          decrypted = CryptoJS.AES.decrypt(cipherText, decryptionKey).toString(CryptoJS.enc.Utf8);
        }
        
        if (!decrypted) {
          throw new Error('Decryption resulted in empty string');
        }
        
        // Send the decrypted result back to the main thread
        self.postMessage({ success: true, result: decrypted } as WorkerResponse);
      } catch (decryptError) {
        console.error('Decryption processing error:', decryptError);
        self.postMessage({ 
          success: false, 
          error: decryptError instanceof Error ? decryptError.message : 'Unknown decryption error' 
        } as WorkerResponse);
      }
      
      return;
    }
    
    // Unknown action
    self.postMessage({ 
      success: false, 
      error: `Unknown action: ${action}` 
    } as WorkerResponse);
    
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error in decrypt worker' 
    } as WorkerResponse);
  }
};

// Initialize the worker context
self.postMessage({ success: true, status: 'initialized' } as WorkerResponse);

// Make sure TypeScript knows we're in a worker context
export {};
