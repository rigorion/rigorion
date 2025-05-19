
/**
 * AES-GCM encryption/decryption utilities for use with Supabase edge functions
 */

/**
 * Convert a base64 string to Uint8Array
 */
export function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Convert Uint8Array to base64 string
 */
export function bytesToBase64(bytes: Uint8Array): string {
  const binString = Array.from(bytes)
    .map(byte => String.fromCharCode(byte))
    .join("");
  return btoa(binString);
}

/**
 * Import a key from raw bytes for AES-GCM
 * @param keyBytes Raw key bytes as Uint8Array
 * @returns CryptoKey that can be used for encryption/decryption
 */
export async function importAesGcmKey(keyBytes: Uint8Array): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM" },
    false, // not extractable
    ["decrypt"]
  );
}

/**
 * Decrypt data using AES-GCM
 * @param encryptedBase64 Base64-encoded encrypted data
 * @param ivBase64 Base64-encoded initialization vector
 * @param key The raw key as a string (will be converted to bytes)
 * @returns Decrypted text
 */
export async function aesGcmDecrypt(
  encryptedBase64: string, 
  ivBase64: string, 
  key: string
): Promise<string> {
  try {
    // Convert base64 strings to byte arrays
    const encryptedBytes = base64ToBytes(encryptedBase64);
    const ivBytes = base64ToBytes(ivBase64);
    
    // Convert the key string to bytes and import as CryptoKey
    const keyBytes = new TextEncoder().encode(key);
    const cryptoKey = await importAesGcmKey(keyBytes);
    
    // Decrypt the data
    const decryptedBytes = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBytes },
      cryptoKey,
      encryptedBytes
    );
    
    // Convert the decrypted bytes to text
    return new TextDecoder().decode(decryptedBytes);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error(`Failed to decrypt: ${error instanceof Error ? error.message : String(error)}`);
  }
}
