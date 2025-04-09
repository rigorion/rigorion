
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { writeFileSync } from 'fs';
import path from 'path';

// Configuration
const SUPABASE_URL = "https://eantvimmgdmxzwrjwrop.supabase.co/storage/v1/object/public/sat/satMath.json";
const OUTPUT_FILE = path.join(process.cwd(), 'encrypted-sat-math.json');
const ENCRYPTION_KEY = 'secure-key-for-demo-purposes-only'; // Change this to your own secure key in production

async function fetchAndEncryptJson() {
  try {
    console.log('Fetching JSON data from Supabase...');
    const response = await axios.get(SUPABASE_URL);
    const jsonData = response.data;
    
    console.log('Data fetched successfully. Encrypting...');
    
    // Encrypt the entire JSON object
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(jsonData),
      ENCRYPTION_KEY
    ).toString();
    
    // Save the encrypted data to a file
    writeFileSync(OUTPUT_FILE, encrypted);
    console.log(`✅ Encryption successful. File saved to: ${OUTPUT_FILE}`);
    
    // For direct usage in the application, you can also upload this to Supabase
    console.log('\nTo use this encrypted data:');
    console.log('1. Upload the encrypted-sat-math.json file to your Supabase bucket');
    console.log('2. Update the QUESTIONS_FILE in secureStorageService.ts to point to your encrypted file');
    
  } catch (error) {
    console.error('❌ Encryption failed:');
    if (axios.isAxiosError(error)) {
      console.error('HTTP Error:', error.response?.status, error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run the encryption process
fetchAndEncryptJson();
