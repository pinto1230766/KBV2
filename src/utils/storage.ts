import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import * as idb from './idb';

// ============================================================================
// STOCKAGE HYBRIDE : Capacitor Preferences (mobile) + IndexedDB (web)
// ============================================================================

const isNativePlatform = Capacitor.isNativePlatform();

export async function get<T = any>(key: string): Promise<T | undefined> {
  try {
    if (isNativePlatform) {
      // Mobile : utiliser Capacitor Preferences (persistant entre installations)
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) : undefined;
    } else {
      // Web : utiliser IndexedDB
      return await idb.get<T>(key);
    }
  } catch (error) {
    console.error('Error reading from storage:', error);
    return undefined;
  }
}

export async function set(key: string, value: any): Promise<void> {
  try {
    if (isNativePlatform) {
      // Mobile : utiliser Capacitor Preferences
      await Preferences.set({
        key,
        value: JSON.stringify(value),
      });
    } else {
      // Web : utiliser IndexedDB
      await idb.set(key, value);
    }
  } catch (error) {
    console.error('Error writing to storage:', error);
    throw error;
  }
}

export async function del(key: string): Promise<void> {
  try {
    if (isNativePlatform) {
      await Preferences.remove({ key });
    } else {
      await idb.del(key);
    }
  } catch (error) {
    console.error('Error deleting from storage:', error);
    throw error;
  }
}

export async function clear(): Promise<void> {
  try {
    if (isNativePlatform) {
      await Preferences.clear();
    } else {
      await idb.clear();
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
}

export async function keys(): Promise<string[]> {
  try {
    if (isNativePlatform) {
      const { keys } = await Preferences.keys();
      return keys;
    } else {
      const idbKeys = await idb.keys();
      return idbKeys.map((k) => String(k));
    }
  } catch (error) {
    console.error('Error getting keys from storage:', error);
    return [];
  }
}

// ============================================================================
// MIGRATION DEPUIS INDEXEDDB VERS CAPACITOR PREFERENCES
// ============================================================================

export async function migrateToCapacitor(): Promise<void> {
  if (!isNativePlatform) return;

  try {
    console.log('🔄 Migration vers Capacitor Preferences...');

    // Vérifier si déjà migré
    const { value: migrated } = await Preferences.get({ key: 'migration-completed' });
    if (migrated === 'true') {
      console.log('✅ Migration déjà effectuée');
      return;
    }

    // Tenter de récupérer les données depuis IndexedDB
    const appData = await idb.get('kbv-app-data');

    if (appData) {
      console.log('📦 Données trouvées dans IndexedDB, migration...');
      await Preferences.set({
        key: 'kbv-app-data',
        value: JSON.stringify(appData),
      });
      console.log('✅ Données migrées vers Capacitor Preferences');
    }

    // Marquer la migration comme terminée
    await Preferences.set({ key: 'migration-completed', value: 'true' });
    console.log('✅ Migration terminée');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
}

// ============================================================================
// EXPORT/IMPORT
// ============================================================================

export async function exportAll(): Promise<Record<string, any>> {
  try {
    if (isNativePlatform) {
      const { keys: allKeys } = await Preferences.keys();
      const result: Record<string, any> = {};

      for (const key of allKeys) {
        const { value } = await Preferences.get({ key });
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      }

      return result;
    } else {
      return await idb.exportAll();
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    return {};
  }
}

export async function importAll(data: Record<string, any>): Promise<void> {
  try {
    if (isNativePlatform) {
      for (const [key, value] of Object.entries(data)) {
        await Preferences.set({
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
        });
      }
    } else {
      await idb.importAll(data);
    }
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}
