
// Web Worker for decryption
import CryptoJS from 'crypto-js';

const secretKey = 'test-key-for-encryption'; // This should be stored securely

self.onmessage = (e: MessageEvent) => {
  const { cipherText } = e.data;
  
  try {
    if (!cipherText) {
      self.postMessage({ success: false, error: 'No cipher text provided' });
      return;
    }

    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      self.postMessage({ success: false, error: 'Decryption failed' });
      return;
    }
    
    self.postMessage({ success: true, result: decryptedText });
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error during decryption' 
    });
  }
};

export {}; // Add this to make TypeScript treat this as a module
