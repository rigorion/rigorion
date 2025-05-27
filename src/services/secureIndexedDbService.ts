import Dexie, { Table } from 'dexie';
import CryptoJS from 'crypto-js';

interface SecureFunctionData {
  id?: number;
  functionName: string;
  data: any;
  timestamp: Date;
  hash: string;
}

const SECRET_KEY = process.env.NEXT_PUBLIC_DB_ENCRYPTION_KEY || 'default_secret_key';

// Encryption function
const encrypt = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

// Decryption function
const decrypt = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption Error:", error);
    return '';
  }
};

// Hash function
const hashData = (data: any): string => {
  const dataString = JSON.stringify(data);
  return CryptoJS.SHA256(dataString).toString();
};

class SecureDatabase extends Dexie {
  functionData!: Table<SecureFunctionData>;

  constructor() {
    super('SecureDatabase');
    this.version(1).stores({
      functionData: '++id, functionName, data, timestamp, hash'
    });

    // Apply encryption to the entire table
    this.functionData.hook('creating', function (primKey, obj, trans) {
      obj.data = encrypt(JSON.stringify(obj.data));
    });

    this.functionData.hook('reading', function (obj) {
      if (obj.data) {
        try {
          obj.data = JSON.parse(decrypt(obj.data));
        } catch (e) {
          console.error('Decryption failed:', e);
        }
      }
    });
  }
}

const db = new SecureDatabase();

// Store function data securely
export const storeSecureFunctionData = async (functionName: string, data: any): Promise<void> => {
  const timestamp = new Date();
  const hash = hashData(data);

  try {
    await db.functionData.put({ functionName, data, timestamp, hash });
    console.log(`Securely stored data for function: ${functionName}`);
  } catch (error) {
    console.error(`Failed to store data securely for function ${functionName}:`, error);
    throw error;
  }
};

// Get function data securely
export const safeGetSecureData = async (functionName: string, refreshFunction: () => Promise<any>): Promise<{ data: any, fromCache: boolean }> => {
  try {
    const storedData = await db.functionData
      .where('functionName')
      .equals(functionName)
      .sortBy('timestamp');

    if (storedData.length > 0) {
      const latestEntry = storedData[storedData.length - 1];
      const currentHash = hashData(latestEntry.data);

      if (latestEntry.hash === currentHash) {
        console.log(`Returning secure cached data for function: ${functionName}`);
        return { data: latestEntry.data, fromCache: true };
      } else {
        console.warn(`Hash mismatch. Refreshing data for function: ${functionName}`);
        const newData = await refreshFunction();
        return { data: newData, fromCache: false };
      }
    } else {
      console.log(`No secure data found. Fetching and storing for function: ${functionName}`);
      const newData = await refreshFunction();
      return { data: newData, fromCache: false };
    }
  } catch (error: any) {
    console.error(`Failed to retrieve secure data for function ${functionName}:`, error);
    throw error;
  }
};

// Clear all secure data
export const clearAllSecureData = async (): Promise<void> => {
  try {
    await db.functionData.clear();
    console.log('All secure data cleared.');
  } catch (error) {
    console.error('Failed to clear secure data:', error);
    throw error;
  }
};

// Check if secure storage is valid
export const isSecureStorageValid = (): boolean => {
  try {
    // Attempt to write and read a test value
    const testKey = 'testKey';
    const testData = { value: 'testValue' };

    // Use a separate, temporary table for the validity check
    const testDb = new Dexie('TestDatabase');
    testDb.version(1).stores({
      testData: 'id'
    });
    const testTable = testDb.table('testData');

    return testDb.transaction('rw', testTable, async () => {
      await testTable.put({ id: testKey, data: testData });
      const retrievedData = await testTable.get(testKey);
      await testTable.delete(testKey); // Clean up the test data
      return JSON.stringify(retrievedData?.data) === JSON.stringify(testData);
    }).finally(() => {
      testDb.close(); // Close the test database
    });
  } catch (error) {
    console.error('Secure storage validity check failed:', error);
    return false;
  }
};
