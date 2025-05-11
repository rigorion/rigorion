
import CryptoJS from 'crypto-js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { supabase } from '@/lib/supabase';

// Load environment variables
dotenv.config();

// Configure paths
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_STORAGE_URL || "";
const OUTPUT_DIR = './src/stored';
const OUTPUT_FILE = `${OUTPUT_DIR}/encrypted-rigor.json`;

// Validate environment variables
if (!import.meta.env.VITE_ENCRYPTION_KEY) {
  console.warn('Missing VITE_ENCRYPTION_KEY in .env file');
}
if (!SUPABASE_URL) {
  console.warn('Missing VITE_SUPABASE_STORAGE_URL in .env file');
}

// Create storage directory if not exists
try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
} catch (err) {
  console.error('Error creating directory:', err);
}

async function fetchAndEncrypt() {
  try {
    // Fetch JSON from Supabase
    const response = await axios.get(SUPABASE_URL, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ""}`,
        'Apikey': `${import.meta.env.VITE_SUPABASE_ANON_KEY || ""}`
      }
    });

    // Encrypt content
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(response.data), 
      import.meta.env.VITE_ENCRYPTION_KEY || 'secure-key-for-demo-purposes-only'
    ).toString();

    // Save encrypted file
    writeFileSync(OUTPUT_FILE, encrypted);
    console.log(`✅ Encryption successful. File saved to: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('❌ Operation failed:');
    if (axios.isAxiosError(error)) {
      console.error('HTTP Error:', error.response?.status, error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// This function is meant to be executed in a Node.js environment, not in the browser
// You would run this script separately with Node.js to prepare the encrypted data
// export const runEncryption = fetchAndEncrypt; // Uncomment if you need to export for use elsewhere
