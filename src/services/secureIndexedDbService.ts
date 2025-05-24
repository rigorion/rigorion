import Dexie from 'dexie';
import { applyEncryptionMiddleware, cryptoOptions } from 'dexie-encrypted';
import { FunctionData } from './dexieService';

// Extend the FunctionData interface to include integrity and encrypted properties
declare module './dexieService' {
  interface FunctionData {
    integrity?: string;
    encrypted?: boolean;
  }
}

// In-memory key (session-only)
let encryptionKey: Uint8Array | null = null;

function getEncryptionKey(): Uint8Array {
  if (!encryptionKey) {
    const storedKey = localStorage.getItem('secure_db_key');
    if (storedKey) {
      try {
        const keyArray = new Uint8Array(storedKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
        encryptionKey = keyArray;
        sessionStorage.setItem('secure_storage_active', 'true');
        console.log('[SECURE DB] Restored encryption key from localStorage:', keyArray);
        return encryptionKey;
      } catch (e) {
        console.warn('[SECURE DB] Failed to restore encryption key, generating new one', e);
        localStorage.removeItem('secure_db_key');
      }
    }
    encryptionKey = crypto.getRandomValues(new Uint8Array(32));
    const hexKey = Array.from(encryptionKey).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem('secure_db_key', hexKey);
    sessionStorage.setItem('secure_storage_active', 'true');
    console.log('[SECURE DB] Generated and stored new encryption key.');
  }
  return encryptionKey;
}

const STORAGE_VERSION_KEY = 'secure_db_version';
const OFFLINE_EXPIRY_DAYS = 7;

export class SecureAppDB extends Dexie {
  functionData!: Dexie.Table<FunctionData, number>;

  constructor() {
    super('SecureAppDB');
    this.version(1).stores({
      functionData: '++id, endpoint, timestamp',
    });

    try {
      // The correct way is to specify the option for the table directly:
      applyEncryptionMiddleware(
        this,
        getEncryptionKey(),
        { functionData: cryptoOptions.NON_INDEXED_FIELDS },
        () => {
          console.log('[SECURE DB] Encryption key changed (middleware callback)');
          sessionStorage.setItem('secure_storage_active', 'true');
        }
      );
      console.log('[SECURE DB] Encryption middleware applied.');
    } catch (error) {
      console.error('[SECURE DB] Failed to apply encryption middleware:', error);
    }
  }
}

const secureDb = new SecureAppDB();

// --- STORE DATA ---
export async function storeSecureFunctionData(
  endpoint: string,
  data: unknown
): Promise<number> {
  const timestamp = new Date();
  const integrity = generateIntegrityHash(data);

  const record: FunctionData = {
    endpoint,
    timestamp,
    data,
    encrypted: true,
    integrity,
  };

  localStorage.setItem(STORAGE_VERSION_KEY, Date.now().toString());

  try {
    const result = await secureDb.functionData.add(record);
    console.log('[SECURE STORE] Data stored:', { endpoint, record });
    return result;
  } catch (err) {
    console.error('[SECURE STORE ERROR]', { endpoint, record, err });
    throw err;
  }
}

// --- GET LATEST DATA ---
export async function getSecureLatestFunctionData(
  endpoint: string
): Promise<FunctionData | undefined> {
  try {
    const record = await secureDb.functionData
      .where('endpoint')
      .equals(endpoint)
      .reverse()
      .first();

    console.log('[SECURE GET] Retrieved record:', record);

    if (!record) return undefined;

    if (isDataExpired(record.timestamp)) {
      console.warn('[SECURE GET] Secure data expired. Clearing...');
      await clearAllSecureData();
      return undefined;
    }
    if (record.integrity && !verifyIntegrityHash(record.data, record.integrity)) {
      console.error('[SECURE GET] Data integrity check failed');
      return undefined;
    }
    return record;
  } catch (error: any) {
    console.error('[SECURE GET ERROR]', error);
    if (
      error.name === 'DatabaseClosedError' ||
      (error.message && error.message.includes('decrypt'))
    ) {
      console.warn('[SECURE GET] Decryption failed, clearing corrupt data');
      await handleDecryptionError();
      return undefined;
    }
    return undefined;
  }
}

// --- GET ALL ---
export async function getAllSecureFunctionData(
  endpoint: string
): Promise<FunctionData[]> {
  try {
    const results = await secureDb.functionData
      .where('endpoint')
      .equals(endpoint)
      .toArray();

    const validResults = results.filter(record => {
      const expired = isDataExpired(record.timestamp);
      const valid = !record.integrity || verifyIntegrityHash(record.data, record.integrity);
      return !expired && valid;
    });

    return validResults.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error: any) {
    console.error('[SECURE GET ALL ERROR]', error);
    if (
      error.name === 'DatabaseClosedError' ||
      (error.message && error.message.includes('decrypt'))
    ) {
      await handleDecryptionError();
      return [];
    }
    return [];
  }
}

// --- DECRYPTION/RESET ---
async function handleDecryptionError(): Promise<void> {
  try {
    await clearAllSecureData();
    localStorage.removeItem('secure_db_key');
    encryptionKey = null;
    console.log('[SECURE DB] Cleared corrupt encrypted data and reset key');
  } catch (error) {
    console.error('[SECURE DB] Error handling decryption failure:', error);
  }
}

export async function clearAllSecureData(): Promise<void> {
  localStorage.removeItem(STORAGE_VERSION_KEY);
  await secureDb.functionData.clear();
  console.log('[SECURE DB] Cleared all secure data.');
}

export function isSecureStorageValid(): boolean {
  const versionTimestamp = localStorage.getItem(STORAGE_VERSION_KEY);
  if (!versionTimestamp) return false;
  return isSecureStorageActive() && !isNaN(Number(versionTimestamp));
}

export function isSecureStorageActive(): boolean {
  return (
    encryptionKey !== null ||
    sessionStorage.getItem('secure_storage_active') === 'true'
  );
}

export function regenerateEncryptionKey(): void {
  localStorage.removeItem('secure_db_key');
  encryptionKey = null;
  getEncryptionKey();
  localStorage.setItem(STORAGE_VERSION_KEY, Date.now().toString());
  console.log('[SECURE DB] Regenerated encryption key.');
}

export function clearEncryptionKey(): void {
  encryptionKey = null;
  localStorage.removeItem('secure_db_key');
  sessionStorage.removeItem('secure_storage_active');
  console.log('[SECURE DB] Encryption key cleared.');
}

// --- UTILS ---
function generateIntegrityHash(data: any): string {
  try {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `${hash}-v1`;
  } catch (e) {
    return '';
  }
}

function verifyIntegrityHash(data: any, storedHash: string): boolean {
  try {
    const currentHash = generateIntegrityHash(data);
    return currentHash === storedHash;
  } catch (e) {
    return false;
  }
}

function isDataExpired(timestamp: Date): boolean {
  const expiryTime = OFFLINE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(timestamp).getTime() > expiryTime;
}

// --- SAFE GETTER ---
export async function safeGetSecureData(
  endpoint: string,
  fetchFallback?: () => Promise<any>
): Promise<{ data: any | null; fromCache: boolean }> {
  try {
    const record = await getSecureLatestFunctionData(endpoint);
    if (record && record.data) {
      console.log('[SECURE SAFE GET] Returning cached data:', record);
      return { data: record.data, fromCache: true };
    }
    if (fetchFallback) {
      const freshData = await fetchFallback();
      if (freshData) {
        await storeSecureFunctionData(endpoint, freshData);
        console.log('[SECURE SAFE GET] Fetched and stored fresh data.');
        return { data: freshData, fromCache: false };
      }
    }
    return { data: null, fromCache: false };
  } catch (e) {
    console.error(`[SECURE SAFE GET ERROR for ${endpoint}]:`, e);
    if (fetchFallback) {
      try {
        const freshData = await fetchFallback();
        if (freshData) {
          await storeSecureFunctionData(endpoint, freshData);
          return { data: freshData, fromCache: false };
        }
      } catch (fallbackError) {
        console.error('[SECURE SAFE GET Fallback Error]:', fallbackError);
      }
    }
    return { data: null, fromCache: false };
  }
}

export default secureDb;
