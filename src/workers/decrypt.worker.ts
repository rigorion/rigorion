/// <reference lib="webworker" />

// Import both functions from crypto
import { secureDecrypt, base64ToUint8Array } from '../utils/crypto';

addEventListener('message', async ({ data }) => {
    try {
        const decrypted = await secureDecrypt(data.cipherText);
        postMessage({ success: true, result: decrypted });
    } catch (error) {
        postMessage({ success: false, error: error.message });
    }
});