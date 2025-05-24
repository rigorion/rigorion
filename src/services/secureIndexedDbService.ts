import Dexie from 'dexie';
import { applyEncryptionMiddleware, cryptoOptions } from 'dexie-encrypted';
import { FunctionData } from './dexieService';

// Extend FunctionData for extra fields (optional for your case)
declare module './dexieService' {
  interface FunctionData {
    integrity?: string;
    encrypted?: boolean;
  }
}

// In-memory session key
let encryptionKey: Uint8Array | null = null;

function getEncryptionKey(): Uint8Array {
  if (!encryptionKey) {
    const storedKey = localStorage.getItem('secure_db_key');
    if (storedKey) {
      try {
        const keyArray = new Uint8Array(
          storedKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
        );
        encryptionKey = keyArray;
        sessionStorage.setItem('secure_storage_active', 'true');
        return encryptionKey;
      } catch {
        localStorage.removeItem('secure_db_key');
      }
    }
    // Generate new key and persist
    encryptionKey = crypto.getRandomValues(new Uint8Array(32));
    const hexKey = Array.from(encryptionKey).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem('secure_db_key', hexKey);
    sessionStorage.setItem('secure_storage_active', 'true');
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

    // 🟢 IMPORTANT: Spread the cryptoOptions to satisfy Dexie-encrypted types!
    applyEncryptionMiddleware(
      this,
      getEncryptionKey(),
      {
        functionData: { ...cryptoOptions.NON_INDEXED_FIELDS },
      },
      () => {
        sessionStorage.setItem('secure_storage_active', 'true');
      }
    );
  }
}

const secureDb = new SecureAppDB();

// Store a new record, with integrity hash
export async function storeSecureFunctionData(endpoint: string, data: unknown): Promise<number> {
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
  return await secureDb.functionData.add(record);
}

export async function getSecureLatestFunctionData(endpoint: string): Promise<FunctionData | undefined> {
  try {
    const record = await secureDb.functionData
      .where('endpoint')
      .equals(endpoint)
      .reverse()
      .first();

    if (!record) return undefined;

    if (isDataExpired(record.timestamp)) {
      await clearAllSecureData();
      return undefined;
    }
    if (record.integrity && !verifyIntegrityHash(record.data, record.integrity)) {
      return undefined;
    }
    return record;
  } catch (error: any) {
    if (error.name === 'DatabaseClosedError' || (error.message && error.message.includes('decrypt'))) {
      await handleDecryptionError();
      return undefined;
    }
    return undefined;
  }
}

export async function getAllSecureFunctionData(endpoint: string): Promise<FunctionData[]> {
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

    return validResults.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error: any) {
    if (error.name === 'DatabaseClosedError' || (error.message && error.message.includes('decrypt'))) {
      await handleDecryptionError();
      return [];
    }
    return [];
  }
}

async function handleDecryptionError(): Promise<void> {
  try {
    await clearAllSecureData();
    localStorage.removeItem('secure_db_key');
    encryptionKey = null;
  } catch {}
}

export async function clearAllSecureData(): Promise<void> {
  localStorage.removeItem(STORAGE_VERSION_KEY);
  await secureDb.functionData.clear();
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
}

export function clearEncryptionKey(): void {
  encryptionKey = null;
  localStorage.removeItem('secure_db_key');
  sessionStorage.removeItem('secure_storage_active');
}

function generateIntegrityHash(data: any): string {
  try {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return `${hash}-v1`;
  } catch {
    return '';
  }
}

function verifyIntegrityHash(data: any, storedHash: string): boolean {
  try {
    const currentHash = generateIntegrityHash(data);
    return currentHash === storedHash;
  } catch {
    return false;
  }
}

function isDataExpired(timestamp: Date): boolean {
  const expiryTime = OFFLINE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(timestamp).getTime() > expiryTime;
}

export async function safeGetSecureData(
  endpoint: string,
  fetchFallback?: () => Promise<any>
): Promise<{ data: any | null; fromCache: boolean }> {
  try {
    const record = await getSecureLatestFunctionData(endpoint);
    if (record && record.data) {
      return { data: record.data, fromCache: true };
    }
    if (fetchFallback) {
      const freshData = await fetchFallback();
      if (freshData) {
        await storeSecureFunctionData(endpoint, freshData);
        return { data: freshData, fromCache: false };
      }
    }
    return { data: null, fromCache: false };
  } catch (e) {
    if (fetchFallback) {
      try {
        const freshData = await fetchFallback();
        if (freshData) {
          return { data: freshData, fromCache: false };
        }
      } catch {}
    }
    return { data: null, fromCache: false };
  }
}

export default secureDb;
