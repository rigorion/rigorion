
// src/services/secureIndexedDbService.ts

import Dexie from 'dexie'
import * as dexieEncrypted from 'dexie-encrypted'
import { FunctionData } from './dexieService'  // your existing interface

// In-memory key (session-only)
let encryptionKey: Uint8Array | null = null

function getEncryptionKey(): Uint8Array {
  if (!encryptionKey) {
    // In production you might derive this via PBKDF2 or fetch it securely
    encryptionKey = crypto.getRandomValues(new Uint8Array(32))
    sessionStorage.setItem('secure_storage_active', 'true')
  }
  return encryptionKey
}

export class SecureAppDB extends Dexie {
  functionData!: Dexie.Table<FunctionData, number>

  constructor() {
    super('SecureAppDB')

    // 1) Define your schema
    this.version(1).stores({
      functionData: '++id, endpoint, timestamp'
    })

    // 2) Install the encryption plugin
    dexieEncrypted.default(
      this,                    // your Dexie instance
      getEncryptionKey(),      // Uint8Array(32)—holds in JS memory only
      {
        functionData: {
          type: dexieEncrypted.ENCRYPT_LIST,  // encrypt a list of fields
          fields: ['data'],    // only the `data` property is encrypted
          salt: 'lovable-app-salt-2025'
        }
      }
    )
  }
}

const secureDb = new SecureAppDB()

/**
 * Store a FunctionData record securely.
 * The `data` field will be AES-GCM encrypted in IndexedDB.
 */
export async function storeSecureFunctionData(
  endpoint: string,
  data: unknown
): Promise<number> {
  const record: FunctionData = {
    endpoint,
    timestamp: new Date(),
    data,
    encrypted: true
  }
  return await secureDb.functionData.add(record)
}

/**
 * Get the latest FunctionData for a given endpoint (decrypted in memory).
 */
export async function getSecureLatestFunctionData(
  endpoint: string
): Promise<FunctionData | undefined> {
  return await secureDb.functionData
    .where('endpoint')
    .equals(endpoint)
    .reverse()    // newest first
    .first()
}

/**
 * Get all FunctionData for a given endpoint (decrypted in memory).
 */
export async function getAllSecureFunctionData(
  endpoint: string
): Promise<FunctionData[]> {
  const results = await secureDb.functionData
    .where('endpoint')
    .equals(endpoint)
    .toArray()
  // sort descending by timestamp
  return results.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

/**
 * Clear all stored FunctionData records.
 */
export async function clearAllSecureData(): Promise<void> {
  await secureDb.functionData.clear()
}

/**
 * Has the secure storage been initialized this session?
 */
export function isSecureStorageActive(): boolean {
  return (
    encryptionKey !== null ||
    sessionStorage.getItem('secure_storage_active') === 'true'
  )
}

/**
 * Rotate the encryption key (old data becomes unreadable until re-encrypted).
 */
export function regenerateEncryptionKey(): void {
  encryptionKey = crypto.getRandomValues(new Uint8Array(32))
  sessionStorage.setItem('secure_storage_active', 'true')
}

/**
 * Clear the in-memory encryption key (e.g. on logout).
 * Existing encrypted records remain, but can't be decrypted until a key is re‐set.
 */
export function clearEncryptionKey(): void {
  encryptionKey = null
  sessionStorage.removeItem('secure_storage_active')
}

export default secureDb
