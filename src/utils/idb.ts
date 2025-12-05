import { openDB, DBSchema, IDBPDatabase } from 'idb';

// ============================================================================
// SCHÉMA DE BASE DE DONNÉES
// ============================================================================

interface KBVDBSchema extends DBSchema {
  appData: {
    key: string;
    value: any;
  };
  encrypted: {
    key: string;
    value: {
      data: string;
      iv: string;
      salt: string;
    };
  };
}

const DB_NAME = 'kbv-lyon-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<KBVDBSchema> | null = null;

// ============================================================================
// INITIALISATION DE LA BASE DE DONNÉES
// ============================================================================

async function getDB(): Promise<IDBPDatabase<KBVDBSchema>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<KBVDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Store pour les données non chiffrées
      if (!db.objectStoreNames.contains('appData')) {
        db.createObjectStore('appData');
      }

      // Store pour les données chiffrées
      if (!db.objectStoreNames.contains('encrypted')) {
        db.createObjectStore('encrypted');
      }
    },
  });

  return dbInstance;
}

// ============================================================================
// FONCTIONS CRUD
// ============================================================================

export async function get<T = any>(key: string): Promise<T | undefined> {
  try {
    const db = await getDB();
    return await db.get('appData', key);
  } catch (error) {
    console.error('Error reading from IndexedDB:', error);
    return undefined;
  }
}

export async function set(key: string, value: any): Promise<void> {
  try {
    const db = await getDB();
    await db.put('appData', value, key);
  } catch (error) {
    console.error('Error writing to IndexedDB:', error);
    throw error;
  }
}

export async function del(key: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('appData', key);
  } catch (error) {
    console.error('Error deleting from IndexedDB:', error);
    throw error;
  }
}

export async function clear(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('appData');
    await db.clear('encrypted');
  } catch (error) {
    console.error('Error clearing IndexedDB:', error);
    throw error;
  }
}

export async function keys(): Promise<IDBValidKey[]> {
  try {
    const db = await getDB();
    return await db.getAllKeys('appData');
  } catch (error) {
    console.error('Error getting keys from IndexedDB:', error);
    return [];
  }
}

// ============================================================================
// FONCTIONS POUR DONNÉES CHIFFRÉES
// ============================================================================

export async function getEncrypted(key: string) {
  try {
    const db = await getDB();
    return await db.get('encrypted', key);
  } catch (error) {
    console.error('Error reading encrypted data from IndexedDB:', error);
    return undefined;
  }
}

export async function setEncrypted(
  key: string,
  value: { data: string; iv: string; salt: string }
): Promise<void> {
  try {
    const db = await getDB();
    await db.put('encrypted', value, key);
  } catch (error) {
    console.error('Error writing encrypted data to IndexedDB:', error);
    throw error;
  }
}

export async function delEncrypted(key: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('encrypted', key);
  } catch (error) {
    console.error('Error deleting encrypted data from IndexedDB:', error);
    throw error;
  }
}

// ============================================================================
// MIGRATION DEPUIS LOCALSTORAGE
// ============================================================================

export async function migrateFromLocalStorage(): Promise<void> {
  try {
    // Vérifier si des données existent dans localStorage
    const localStorageKeys = ['kbv-app-data', 'kbv-settings'];
    
    for (const key of localStorageKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          await set(key, parsed);
          localStorage.removeItem(key); // Nettoyage
          console.log(`Migrated ${key} from localStorage to IndexedDB`);
        } catch (e) {
          console.error(`Error migrating ${key}:`, e);
        }
      }
    }
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

// ============================================================================
// EXPORT/IMPORT
// ============================================================================

export async function exportAll(): Promise<Record<string, any>> {
  try {
    const db = await getDB();
    const allKeys = await db.getAllKeys('appData');
    const result: Record<string, any> = {};

    for (const key of allKeys) {
      const value = await db.get('appData', key);
      result[key as string] = value;
    }

    return result;
  } catch (error) {
    console.error('Error exporting data:', error);
    return {};
  }
}

export async function importAll(data: Record<string, any>): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('appData', 'readwrite');

    for (const [key, value] of Object.entries(data)) {
      await tx.store.put(value, key);
    }

    await tx.done;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}
