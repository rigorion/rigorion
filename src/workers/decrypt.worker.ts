
// This file is imported as a web worker through the Vite worker plugin
import CryptoJS from 'crypto-js';

// Listen for messages from the main thread
self.onmessage = (e: MessageEvent<{ cipherText: string }>) => {
  try {
    const { cipherText } = e.data;
    
    if (!cipherText) {
      self.postMessage({ success: false, error: 'No cipher text provided' });
      return;
    }
    
    // Use a fixed key for demonstration (in production, use a more secure approach)
    const key = 'secure-key-for-demo-purposes-only';
    
    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
    // Send the decrypted data back to the main thread
    self.postMessage({ success: true, result: decryptedText });
  } catch (error) {
    console.error('Decryption error:', error);
    self.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error during decryption' 
    });
  }
};

// Make sure TypeScript knows we're in a worker context
export {};
