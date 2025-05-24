import Dexie from 'dexie'
import { applyEncryptionMiddleware, cryptoOptions } from 'dexie-encrypted'
import { FunctionData } from './dexieService'

// Extend the FunctionData interface to include the integrity property
declare module './dexieService' {
  interface FunctionData {
    integrity?: string;
    encrypted?: boolean;
  }
}

// In-memory key (session-only)
let encryptionKey: Uint8Array | null = null

function getEncryptionKey(): Uint8Array {
  if (!encryptionKey) {
    // Try to get a persistent key from localStorage first
    const storedKey = localStorage.getItem('secure_db_key')
    if (storedKey) {
      try {
        // Convert hex string back to Uint8Array
        const keyArray = new Uint8Array(storedKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
        encryptionKey = keyArray
        sessionStorage.setItem('secure_storage_active', 'true')
        return encryptionKey
      } catch (e) {
        console.warn('Failed to restore encryption key, generating new one')
        localStorage.removeItem('secure_db_key')
      }
    }
    
    // Generate new key and store it persistently
    encryptionKey = crypto.getRandomValues(new Uint8Array(32))
    // Store as hex string in localStorage for persistence
    const hexKey = Array.from(encryptionKey).map(b => b.toString(16).padStart(2, '0')).join('')
    localStorage.setItem('secure_db_key', hexKey)
    sessionStorage.setItem('secure_storage_active', 'true')
  }
  return encryptionKey
}

// Store last known good timestamp for integrity validation
const STORAGE_VERSION_KEY = 'secure_db_version'
const OFFLINE_EXPIRY_DAYS = 7

export class SecureAppDB extends Dexie {
  functionData!: Dexie.Table<FunctionData, number>

  constructor() {
    super('SecureAppDB')

    // 1) Define your schema FIRST
    this.version(1).stores({
      functionData: '++id, endpoint, timestamp'
    })

    // 2) Apply encryption middleware AFTER schema definition
    // Use the correct format - direct assignment of the crypto option
    const encryptionOptions = {
      functionData: cryptoOptions.NON_INDEXED_FIELDS
    }

    // Apply encryption middleware
    applyEncryptionMiddleware(
      this,
      getEncryptionKey(),
      encryptionOptions,
      () => {
        console.log('Encryption key changed')
        sessionStorage.setItem('secure_storage_active', 'true')
      }
    )
  }
}

const secureDb = new SecureAppDB()

export async function storeSecureFunctionData(
  endpoint: string,
  data: unknown
): Promise<number> {
  const timestamp = new Date()
  const integrity = generateIntegrityHash(data)
  
  const record: FunctionData = {
    endpoint,
    timestamp,
    data,
    encrypted: true,
    integrity
  }
  
  // Store version information for validation
  localStorage.setItem(STORAGE_VERSION_KEY, Date.now().toString())
  
  return await secureDb.functionData.add(record)
}

export async function getSecureLatestFunctionData(
  endpoint: string
): Promise<FunctionData | undefined> {
  try {
    const record = await secureDb.functionData
      .where('endpoint')
      .equals(endpoint)
      .reverse()
      .first()
    
    if (!record) return undefined
    
    // Check for offline expiry
    if (isDataExpired(record.timestamp)) {
      console.warn('Secure data has expired, clearing cache')
      await clearAllSecureData()
      return undefined
    }
    
    // Verify data integrity
    if (record.integrity && !verifyIntegrityHash(record.data, record.integrity)) {
      console.error('Data integrity check failed')
      return undefined
    }
    
    return record
  } catch (error) {
    console.error('Error accessing secure data:', error)
    
    // Handle decryption errors specifically
    if (error.name === 'DatabaseClosedError' || (error.message && error.message.includes('decrypt'))) {
      console.warn('Decryption failed, clearing corrupt data')
      await handleDecryptionError()
      return undefined
    }
    
    return undefined
  }
}

export async function getAllSecureFunctionData(
  endpoint: string
): Promise<FunctionData[]> {
  try {
    const results = await secureDb.functionData
      .where('endpoint')
      .equals(endpoint)
      .toArray()
    
    // Filter out any expired or invalid data
    const validResults = results.filter(record => {
      const expired = isDataExpired(record.timestamp)
      const valid = !record.integrity || verifyIntegrityHash(record.data, record.integrity)
      return !expired && valid
    })
    
    // sort descending by timestamp
    return validResults.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  } catch (error) {
    console.error('Error accessing secure data collection:', error)
    
    // Handle decryption errors specifically
    if (error.name === 'DatabaseClosedError' || (error.message && error.message.includes('decrypt'))) {
      console.warn('Decryption failed, clearing corrupt data')
      await handleDecryptionError()
      return []
    }
    
    return []
  }
}

async function handleDecryptionError(): Promise<void> {
  try {
    // Clear the database and reset the key
    await clearAllSecureData()
    
    // Clear the stored key to force regeneration
    localStorage.removeItem('secure_db_key')
    encryptionKey = null
    
    console.log('Cleared corrupt encrypted data and reset encryption key')
  } catch (error) {
    console.error('Error handling decryption failure:', error)
  }
}

export async function clearAllSecureData(): Promise<void> {
  localStorage.removeItem(STORAGE_VERSION_KEY)
  await secureDb.functionData.clear()
}

export function isSecureStorageValid(): boolean {
  const versionTimestamp = localStorage.getItem(STORAGE_VERSION_KEY)
  if (!versionTimestamp) return false
  
  // The storage is valid if we have both a version timestamp and an active key
  return isSecureStorageActive() && !isNaN(Number(versionTimestamp))
}

export function isSecureStorageActive(): boolean {
  return (
    encryptionKey !== null ||
    sessionStorage.getItem('secure_storage_active') === 'true'
  )
}

export function regenerateEncryptionKey(): void {
  // Clear old key
  localStorage.removeItem('secure_db_key')
  encryptionKey = null
  
  // Generate new key (will be stored automatically by getEncryptionKey)
  getEncryptionKey()
  
  // Update version timestamp to reflect the key change
  localStorage.setItem(STORAGE_VERSION_KEY, Date.now().toString())
}

export function clearEncryptionKey(): void {
  encryptionKey = null
  localStorage.removeItem('secure_db_key')
  sessionStorage.removeItem('secure_storage_active')
}

function generateIntegrityHash(data: any): string {
  try {
    // Simple hash generation for demonstration
    // In production use a proper HMAC library
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash |= 0 // Convert to 32bit integer
    }
    return `${hash}-v1`
  } catch (e) {
    return ''
  }
}

function verifyIntegrityHash(data: any, storedHash: string): boolean {
  try {
    const currentHash = generateIntegrityHash(data)
    return currentHash === storedHash
  } catch (e) {
    return false
  }
}

function isDataExpired(timestamp: Date): boolean {
  const expiryTime = OFFLINE_EXPIRY_DAYS * 24 * 60 * 60 * 1000 // days in ms
  return Date.now() - new Date(timestamp).getTime() > expiryTime
}

export async function safeGetSecureData(
  endpoint: string,
  fetchFallback?: () => Promise<any>
): Promise<{data: any | null, fromCache: boolean}> {
  try {
    // Try to get from secure storage
    const record = await getSecureLatestFunctionData(endpoint)
    
    if (record && record.data) {
      return { data: record.data, fromCache: true }
    }
    
    // If we have a fallback function, use it
    if (fetchFallback) {
      const freshData = await fetchFallback()
      if (freshData) {
        // Store the fresh data securely
        await storeSecureFunctionData(endpoint, freshData)
        return { data: freshData, fromCache: false }
      }
    }
    
    return { data: null, fromCache: false }
  } catch (e) {
    console.error(`Error retrieving secure data for ${endpoint}:`, e)
    
    // Try fallback if provided
    if (fetchFallback) {
      try {
        const freshData = await fetchFallback()
        if (freshData) {
          return { data: freshData, fromCache: false }
        }
      } catch (fallbackError) {
        console.error('Fallback fetch failed:', fallbackError)
      }
    }
    
    return { data: null, fromCache: false }
  }
}

export default secureDb
