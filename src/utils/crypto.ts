// utils/crypto.ts

// Helper function with proper TypeScript return type
export function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Initialize crypto key once
let CRYPTO_KEY: CryptoKey;

async function getCryptoKey(): Promise<CryptoKey> {
    if (!CRYPTO_KEY) {
        const rawKey = base64ToUint8Array(import.meta.env.VITE_ENCRYPTION_KEY);
        CRYPTO_KEY = await crypto.subtle.importKey(
            "raw",
            rawKey,
            { name: "AES-GCM" },
            false,
            ["decrypt"]
        );
    }
    return CRYPTO_KEY;
}

// Enhanced decryption with error handling
export async function secureDecrypt(encrypted: string): Promise<string> {
    try {
        const [ivStr, cipherStr] = encrypted.split(':');
        
        if (!ivStr || !cipherStr) {
            throw new Error('Invalid encrypted format');
        }

        const key = await getCryptoKey();
        const [iv, ciphertext] = [ivStr, cipherStr].map(base64ToUint8Array);

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decrypted);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error(
            error instanceof Error 
            ? error.message 
            : 'Failed to decrypt content'
        );
    }
}

// Optional: Add encryption if needed
export async function secureEncrypt(data: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await getCryptoKey();
    
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        new TextEncoder().encode(data)
    );

    return [
        btoa(String.fromCharCode(...iv)),
        btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    ].join(':');
}