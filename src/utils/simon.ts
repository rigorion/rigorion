
/**
 * Simple implementation of the Simon block cipher (Simon64/128) in TypeScript
 * Based on the paper "The Simon and Speck Families of Lightweight Block Ciphers"
 * by Ray Beaulieu, Douglas Shors, Jason Smith, Stefan Treatman-Clark, Bryan Weeks, Louis Wingers
 * 
 * This is a simplified implementation for educational purposes.
 */

// Rotate left operation
const rotateLeft = (x: number, n: number): number => {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
};

// Constants for Simon64/128
const Z = [
  1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1,
  0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1,
  1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0,
  1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0
];

// Simplified key schedule for demonstration
const generateRoundKeys = (key: Uint8Array): Uint32Array => {
  const keyWords = new Uint32Array(4);
  for (let i = 0; i < 4; i++) {
    keyWords[i] = (key[i * 4] | (key[i * 4 + 1] << 8) | (key[i * 4 + 2] << 16) | (key[i * 4 + 3] << 24)) >>> 0;
  }

  const roundKeys = new Uint32Array(44);
  for (let i = 0; i < 4; i++) {
    roundKeys[i] = keyWords[i];
  }

  const c = 0xffffc000; // 2^32 - 4
  let z = 0;

  for (let i = 4; i < 44; i++) {
    let tmp = rotateLeft(roundKeys[i - 1], 3);
    tmp = tmp ^ roundKeys[i - 3];
    tmp = tmp ^ (tmp >>> 1);
    roundKeys[i] = (~roundKeys[i - 4] ^ tmp ^ Z[z] ^ 3) >>> 0;
    z = (z + 1) % 62;
  }

  return roundKeys;
};

// Simon round function
const simonRound = (x: number, y: number, k: number): [number, number] => {
  const tmp = x;
  x = y ^ ((rotateLeft(x, 1) & rotateLeft(x, 8)) ^ rotateLeft(x, 2) ^ k);
  y = tmp;
  return [x, y];
};

/**
 * Encrypt data using Simon64/128
 * @param plaintext The text to encrypt
 * @param key The encryption key (16 bytes)
 * @returns Encrypted bytes
 */
export const simonEncrypt = (plaintext: string, key: string): Uint8Array => {
  // Convert key to bytes
  const keyBytes = new TextEncoder().encode(key);
  if (keyBytes.length !== 16) {
    throw new Error("Key must be 16 bytes (128 bits)");
  }

  // Pad plaintext to multiple of 8 bytes
  const textBytes = new TextEncoder().encode(plaintext);
  const paddingLength = 8 - (textBytes.length % 8);
  const paddedBytes = new Uint8Array(textBytes.length + paddingLength);
  paddedBytes.set(textBytes);
  paddedBytes[textBytes.length] = paddingLength; // Store padding length

  // Generate round keys
  const roundKeys = generateRoundKeys(keyBytes);

  // Encrypt blocks (64-bit blocks)
  const ciphertext = new Uint8Array(paddedBytes.length);
  for (let i = 0; i < paddedBytes.length; i += 8) {
    // Split block into two 32-bit words
    let x = (paddedBytes[i] | (paddedBytes[i + 1] << 8) | (paddedBytes[i + 2] << 16) | (paddedBytes[i + 3] << 24)) >>> 0;
    let y = (paddedBytes[i + 4] | (paddedBytes[i + 5] << 8) | (paddedBytes[i + 6] << 16) | (paddedBytes[i + 7] << 24)) >>> 0;

    // Apply 44 rounds
    for (let j = 0; j < 44; j++) {
      [x, y] = simonRound(x, y, roundKeys[j]);
    }

    // Store result
    ciphertext[i] = x & 0xFF;
    ciphertext[i + 1] = (x >>> 8) & 0xFF;
    ciphertext[i + 2] = (x >>> 16) & 0xFF;
    ciphertext[i + 3] = (x >>> 24) & 0xFF;
    ciphertext[i + 4] = y & 0xFF;
    ciphertext[i + 5] = (y >>> 8) & 0xFF;
    ciphertext[i + 6] = (y >>> 16) & 0xFF;
    ciphertext[i + 7] = (y >>> 24) & 0xFF;
  }

  return ciphertext;
};

/**
 * Decrypt data using Simon64/128
 * @param ciphertext The encrypted bytes
 * @param key The encryption key (16 bytes)
 * @returns Decrypted text
 */
export const simonDecrypt = (ciphertext: Uint8Array, key: string): string => {
  // Convert key to bytes
  const keyBytes = new TextEncoder().encode(key);
  if (keyBytes.length !== 16) {
    throw new Error("Key must be 16 bytes (128 bits)");
  }

  // Generate round keys
  const roundKeys = generateRoundKeys(keyBytes);

  // Decrypt blocks
  const plainBytes = new Uint8Array(ciphertext.length);
  for (let i = 0; i < ciphertext.length; i += 8) {
    // Split block into two 32-bit words
    let x = (ciphertext[i] | (ciphertext[i + 1] << 8) | (ciphertext[i + 2] << 16) | (ciphertext[i + 3] << 24)) >>> 0;
    let y = (ciphertext[i + 4] | (ciphertext[i + 5] << 8) | (ciphertext[i + 6] << 16) | (ciphertext[i + 7] << 24)) >>> 0;

    // Apply 44 rounds in reverse
    for (let j = 43; j >= 0; j--) {
      [y, x] = simonRound(y, x, roundKeys[j]);
    }

    // Store result
    plainBytes[i] = x & 0xFF;
    plainBytes[i + 1] = (x >>> 8) & 0xFF;
    plainBytes[i + 2] = (x >>> 16) & 0xFF;
    plainBytes[i + 3] = (x >>> 24) & 0xFF;
    plainBytes[i + 4] = y & 0xFF;
    plainBytes[i + 5] = (y >>> 8) & 0xFF;
    plainBytes[i + 6] = (y >>> 16) & 0xFF;
    plainBytes[i + 7] = (y >>> 24) & 0xFF;
  }

  // Remove padding
  const paddingLength = plainBytes[plainBytes.length - 1];
  const unpaddedBytes = plainBytes.slice(0, plainBytes.length - paddingLength);

  // Convert to string
  return new TextDecoder().decode(unpaddedBytes);
};

/**
 * Base64 encode a Uint8Array
 * @param bytes The bytes to encode
 * @returns Base64 encoded string
 */
export const bytesToBase64 = (bytes: Uint8Array): string => {
  const binString = Array.from(bytes)
    .map(byte => String.fromCharCode(byte))
    .join("");
  return btoa(binString);
};

/**
 * Decode a Base64 string to Uint8Array
 * @param base64 The Base64 string
 * @returns Decoded bytes
 */
export const base64ToBytes = (base64: string): Uint8Array => {
  const binString = atob(base64);
  return Uint8Array.from(binString, char => char.charCodeAt(0));
};
