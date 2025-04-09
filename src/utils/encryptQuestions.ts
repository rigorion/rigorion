
import CryptoJS from 'crypto-js';

/**
 * Encrypts a question bank object and returns the encrypted string
 * This is for preparing data before uploading to Supabase
 */
export function encryptQuestionBank(
  questionBank: Record<string, any>, 
  key: string = 'secure-key-for-demo-purposes-only'
): string {
  try {
    // Convert the question bank to a JSON string
    const jsonString = JSON.stringify(questionBank);
    
    // Encrypt the JSON string
    const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
    
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt question bank');
  }
}

/**
 * Encrypt individual questions in a question bank
 * This provides per-question encryption for more granular access control
 */
export function encryptIndividualQuestions(
  questionBank: Record<string, any>,
  key: string = 'secure-key-for-demo-purposes-only'
): Record<string, string> {
  const encryptedQuestions: Record<string, string> = {};
  
  try {
    // Encrypt each question individually
    Object.entries(questionBank).forEach(([id, question]) => {
      const questionJson = JSON.stringify(question);
      encryptedQuestions[id] = CryptoJS.AES.encrypt(questionJson, key).toString();
    });
    
    return encryptedQuestions;
  } catch (error) {
    console.error('Individual encryption error:', error);
    throw new Error('Failed to encrypt individual questions');
  }
}

/**
 * Advanced encryption using IV and returning separate components
 * This uses the more secure approach with initialization vectors
 */
export function advancedEncrypt(
  data: Record<string, any>,
  key: string = 'secure-key-for-demo-purposes-only'
): { iv: string, encryptedData: string } {
  try {
    // Generate a random IV
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Convert key to WordArray
    const keyWordArray = CryptoJS.enc.Utf8.parse(key);
    
    // Encrypt data with AES using CBC mode instead of GCM (which is not available in CryptoJS)
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      keyWordArray,
      { iv: iv, mode: CryptoJS.mode.CBC }
    );
    
    // Return IV and encrypted data separately
    return {
      iv: CryptoJS.enc.Base64.stringify(iv),
      encryptedData: encrypted.toString()
    };
  } catch (error) {
    console.error('Advanced encryption error:', error);
    throw new Error('Failed to encrypt data with advanced method');
  }
}
