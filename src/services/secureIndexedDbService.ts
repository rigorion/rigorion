
import Dexie from 'dexie';
import { FunctionData } from './dexieService';

// Import the correct encryption module 
import { encrypt, clearEncryptedTables } from 'dexie-encrypted';

// In-memory key generation
// This key exists only in memory during the session
let encryptionKey: Uint8Array | null = null;

function getEncryptionKey(): Uint8Array {
  if (!encryptionKey) {
    // For production, consider:
    // 1. Deriving from user passphrase via PBKDF2
    // 2. Fetching from your edge function over HTTPS
    // 3. Using a secure key from user input
    
    // For now, we'll generate a session key
    encryptionKey = crypto.getRandomValues(new Uint8Array(32));
    
    // Optional: Store an indicator that encryption is active
    // but NOT the key itself
    sessionStorage.setItem('secure_storage_active', 'true');
  }
  
  return encryptionKey;
}

// Define our secure database class
class SecureAppDB extends Dexie {
  // Define tables
  functionData!: Dexie.Table<FunctionData, number>;
  
  constructor() {
    super('SecureAppDB');
    
    // Define schema
    this.version(1).stores({
      functionData: '++id, endpoint, timestamp, [endpoint+timestamp]'
    });
    
    // Initialize encryption on specific fields with the correct API usage
    encrypt(this, getEncryptionKey(), {
      functionData: {
        // Only encrypt the 'data' property
        type: encrypt.ENCRYPT_LIST,
        fields: ['data'],
        // Optional salt for AES-GCM nonce derivation
        salt: 'lovable-app-salt-2025'
      }
    });
  }
}

// Create the database instance
const secureDb = new SecureAppDB();

// Store function data with encryption
export async function storeSecureFunctionData(
  endpoint: string, 
  data: any
): Promise<number> {
  try {
    const record: FunctionData = {
      endpoint,
      timestamp: new Date(),
      data,
      encrypted: true
    };
    
    return await secureDb.functionData.add(record);
  } catch (error) {
    console.error("Error storing secure function data:", error);
    throw error;
  }
}

// Get latest data for a specific endpoint
export async function getSecureLatestFunctionData(
  endpoint: string
): Promise<FunctionData | undefined> {
  try {
    // Get the latest record for this endpoint
    const result = await secureDb.functionData
      .where('endpoint')
      .equals(endpoint)
      .reverse() // Newest first
      .first();
    
    return result;
  } catch (error) {
    console.error(`Error retrieving secure data for ${endpoint}:`, error);
    throw error;
  }
}

// Get all data for a specific endpoint
export async function getAllSecureFunctionData(
  endpoint: string
): Promise<FunctionData[]> {
  try {
    const results = await secureDb.functionData
      .where('endpoint')
      .equals(endpoint)
      .toArray();
    
    // Sort by timestamp in descending order (newest first)
    return results.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error(`Error retrieving all secure data for ${endpoint}:`, error);
    throw error;
  }
}

// Clear all stored secure data
export async function clearAllSecureData(): Promise<void> {
  try {
    await secureDb.functionData.clear();
  } catch (error) {
    console.error("Error clearing secure data:", error);
    throw error;
  }
}

// Check if secure storage is active/initialized
export function isSecureStorageActive(): boolean {
  return encryptionKey !== null || sessionStorage.getItem('secure_storage_active') === 'true';
}

// Generate a new encryption key (useful for key rotation)
export function regenerateEncryptionKey(): void {
  encryptionKey = crypto.getRandomValues(new Uint8Array(32));
}

// Reset the encryption key (e.g., on logout)
export function clearEncryptionKey(): void {
  encryptionKey = null;
  sessionStorage.removeItem('secure_storage_active');
}
