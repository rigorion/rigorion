
import Dexie from 'dexie';
import { encryptedIndexed } from 'dexie-encrypted';

// Define database schema
export class AppDatabase extends Dexie {
  functionData: Dexie.Table<FunctionData, number>;
  
  constructor() {
    super("AppDatabase");
    
    // Apply encryption middleware
    this.use(encryptedIndexed());
    
    // Define tables and their schemas
    this.version(1).stores({
      functionData: '++id, endpoint, timestamp, data'
    });
    
    // Define types for tables
    this.functionData = this.table("functionData");
  }
}

// Create and export a database instance
export const db = new AppDatabase();

// Interface for function data
export interface FunctionData {
  id?: number;
  endpoint: string;
  timestamp: Date;
  data: any;
  encrypted?: boolean;
}

// Store function data in IndexedDB
export async function storeFunctionData(endpoint: string, data: any): Promise<number> {
  try {
    const id = await db.functionData.add({
      endpoint,
      timestamp: new Date(),
      data,
      encrypted: true
    });
    
    console.log(`Data from ${endpoint} stored with ID: ${id}`);
    return id;
  } catch (error) {
    console.error("Error storing function data:", error);
    throw error;
  }
}

// Get latest data for a specific endpoint
export async function getLatestFunctionData(endpoint: string): Promise<FunctionData | undefined> {
  try {
    const result = await db.functionData
      .where("endpoint")
      .equals(endpoint)
      .reverse()
      .first();
      
    return result;
  } catch (error) {
    console.error(`Error retrieving data for ${endpoint}:`, error);
    throw error;
  }
}

// Get all data for a specific endpoint
export async function getAllFunctionData(endpoint: string): Promise<FunctionData[]> {
  try {
    const results = await db.functionData
      .where("endpoint")
      .equals(endpoint)
      .reverse()
      .toArray();
      
    return results;
  } catch (error) {
    console.error(`Error retrieving all data for ${endpoint}:`, error);
    throw error;
  }
}

// Clear all stored data
export async function clearAllData(): Promise<void> {
  try {
    await db.functionData.clear();
    console.log("All function data cleared from IndexedDB");
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
}
