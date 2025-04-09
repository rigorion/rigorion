
import { supabase } from '@/lib/supabase';
import { uint8ArrayToBase64, base64ToUint8Array, secureWipe } from '@/utils/crypto';

const STORAGE_BUCKET = 'sat';
const QUESTIONS_FILE = 'satMath.json';

/**
 * Upload encrypted data to Supabase storage
 */
export async function uploadEncryptedData(data: Uint8Array): Promise<void> {
  try {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(QUESTIONS_FILE, blob, {
        contentType: 'application/octet-stream',
        upsert: true
      });
      
    if (error) throw error;
    
    console.log('Encrypted data uploaded successfully');
  } catch (error) {
    console.error('Error uploading encrypted data:', error);
    throw error;
  }
}

/**
 * Download encrypted data from Supabase storage
 */
export async function downloadEncryptedData(): Promise<Uint8Array> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(QUESTIONS_FILE);
      
    if (error) throw error;
    if (!data) throw new Error('No data received');
    
    return new Uint8Array(await data.arrayBuffer());
  } catch (error) {
    console.error('Error downloading encrypted data:', error);
    throw error;
  }
}

/**
 * Store encrypted data in IndexedDB for offline use
 */
export async function storeDataLocally(encryptedData: Uint8Array): Promise<void> {
  try {
    // Create a storage request
    const request = indexedDB.open('secureExamDB', 1);
    
    // Create object store if needed
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result;
      if (!db.objectStoreNames.contains('encryptedQuestions')) {
        db.createObjectStore('encryptedQuestions');
      }
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata');
      }
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBRequest).result;
      const tx = db.transaction(['encryptedQuestions', 'metadata'], 'readwrite');
      
      // Store the encrypted data
      tx.objectStore('encryptedQuestions').put(encryptedData, 'currentQuestions');
      
      // Update metadata
      tx.objectStore('metadata').put(Date.now(), 'lastUpdate');
      
      tx.oncomplete = () => {
        db.close();
        console.log('Data stored locally');
      };
      
      tx.onerror = (event) => {
        console.error('IndexedDB transaction error:', event);
      };
    };
    
    request.onerror = (event) => {
      console.error('IndexedDB open error:', event);
    };
  } catch (error) {
    console.error('Error storing data locally:', error);
    throw error;
  }
}

/**
 * Retrieve encrypted data from local storage
 */
export async function retrieveLocalData(): Promise<Uint8Array | null> {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open('secureExamDB', 1);
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;
        const tx = db.transaction('encryptedQuestions', 'readonly');
        const store = tx.objectStore('encryptedQuestions');
        
        const getRequest = store.get('currentQuestions');
        
        getRequest.onsuccess = () => {
          db.close();
          if (getRequest.result) {
            resolve(getRequest.result);
          } else {
            resolve(null);
          }
        };
        
        getRequest.onerror = (event) => {
          db.close();
          reject(new Error('Failed to retrieve local data'));
        };
      };
      
      request.onerror = (event) => {
        reject(new Error('Failed to open database'));
      };
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Check if local data is valid (less than 24 hours old)
 */
export async function isLocalDataValid(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open('secureExamDB', 1);
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;
        if (!db.objectStoreNames.contains('metadata')) {
          db.close();
          resolve(false);
          return;
        }
        
        const tx = db.transaction('metadata', 'readonly');
        const store = tx.objectStore('metadata');
        
        const getRequest = store.get('lastUpdate');
        
        getRequest.onsuccess = () => {
          db.close();
          const lastUpdate = getRequest.result;
          if (!lastUpdate) {
            resolve(false);
            return;
          }
          
          // Check if the data is less than 24 hours old
          const twentyFourHours = 24 * 60 * 60 * 1000; // milliseconds
          const isValid = (Date.now() - lastUpdate) < twentyFourHours;
          resolve(isValid);
        };
        
        getRequest.onerror = () => {
          db.close();
          resolve(false);
        };
      };
      
      request.onerror = () => {
        resolve(false);
      };
      
    } catch (error) {
      resolve(false);
    }
  });
}
