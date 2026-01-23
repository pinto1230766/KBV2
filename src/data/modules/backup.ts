/**
 * Module Backup - Sauvegarde automatique et structure Git-ready
 * 
 * Renforcement du système de sauvegarde automatique avec:
 * - Sauvegarde auto hebdomadaire
 * - Rotation des anciennes sauvegardes
 * - Export structuré pour Git
 * - Compression des données
 */

import { AppData } from '@/types';
import { compressPhotosInData } from '@/utils/imageCompression';

// ============================================================================
// TYPES
// ============================================================================

export interface BackupMetadata {
  id: string;
  createdAt: string;
  dataVersion: string;
  itemCounts: {
    speakers: number;
    hosts: number;
    visits: number;
    archivedVisits: number;
    specialDates: number;
  };
  sizeBytes: number;
  compressed: boolean;
  checksum?: string;
}

export interface BackupFile {
  metadata: BackupMetadata;
  data: AppData;
}

export interface BackupConfig {
  autoBackupEnabled: boolean;
  autoBackupIntervalDays: number;
  maxBackupsToKeep: number;
  compressPhotos: boolean;
  includeArchived: boolean;
}

const DEFAULT_BACKUP_CONFIG: BackupConfig = {
  autoBackupEnabled: true,
  autoBackupIntervalDays: 7,
  maxBackupsToKeep: 5,
  compressPhotos: true,
  includeArchived: true,
};

// ============================================================================
// BACKUP CREATION
// ============================================================================

/**
 * Create a backup with metadata
 */
export async function createBackup(
  data: AppData,
  config: Partial<BackupConfig> = {}
): Promise<BackupFile> {
  const opts = { ...DEFAULT_BACKUP_CONFIG, ...config };
  
  // Optionally compress photos
  let processedData = data;
  if (opts.compressPhotos) {
    processedData = await compressPhotosInData(data);
  }
  
  // Optionally exclude archived visits
  if (!opts.includeArchived) {
    processedData = {
      ...processedData,
      archivedVisits: [],
    };
  }
  
  const jsonString = JSON.stringify(processedData);
  
  const metadata: BackupMetadata = {
    id: `backup-${Date.now()}`,
    createdAt: new Date().toISOString(),
    dataVersion: data.dataVersion,
    itemCounts: {
      speakers: data.speakers.length,
      hosts: data.hosts.length,
      visits: data.visits.length,
      archivedVisits: opts.includeArchived ? data.archivedVisits.length : 0,
      specialDates: data.specialDates?.length || 0,
    },
    sizeBytes: new Blob([jsonString]).size,
    compressed: opts.compressPhotos,
  };
  
  return {
    metadata,
    data: processedData,
  };
}

/**
 * Export backup to JSON string
 */
export function exportBackupToJson(backup: BackupFile): string {
  return JSON.stringify(backup, null, 2);
}

/**
 * Import backup from JSON string
 */
export function importBackupFromJson(jsonString: string): BackupFile | null {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Validate structure
    if (!parsed.metadata || !parsed.data) {
      // Try to import as raw AppData (legacy format)
      if (parsed.speakers && parsed.visits) {
        return {
          metadata: {
            id: `imported-${Date.now()}`,
            createdAt: new Date().toISOString(),
            dataVersion: parsed.dataVersion || '1.0.0',
            itemCounts: {
              speakers: parsed.speakers?.length || 0,
              hosts: parsed.hosts?.length || 0,
              visits: parsed.visits?.length || 0,
              archivedVisits: parsed.archivedVisits?.length || 0,
              specialDates: parsed.specialDates?.length || 0,
            },
            sizeBytes: new Blob([jsonString]).size,
            compressed: false,
          },
          data: parsed as AppData,
        };
      }
      return null;
    }
    
    return parsed as BackupFile;
  } catch (error) {
    console.error('Failed to parse backup:', error);
    return null;
  }
}

// ============================================================================
// BACKUP ROTATION
// ============================================================================

/**
 * Get list of backup keys from storage
 */
export function getBackupKeys(storage: Storage): string[] {
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key?.startsWith('auto_backup_') || key?.startsWith('backup-')) {
      keys.push(key);
    }
  }
  return keys.sort().reverse(); // Most recent first
}

/**
 * Rotate backups, keeping only the specified number
 */
export function rotateBackups(
  storage: Storage,
  maxToKeep: number = DEFAULT_BACKUP_CONFIG.maxBackupsToKeep
): { kept: number; deleted: number } {
  const keys = getBackupKeys(storage);
  let deleted = 0;
  
  if (keys.length > maxToKeep) {
    const toDelete = keys.slice(maxToKeep);
    toDelete.forEach((key) => {
      storage.removeItem(key);
      deleted++;
    });
  }
  
  return { kept: Math.min(keys.length, maxToKeep), deleted };
}

// ============================================================================
// AUTO BACKUP
// ============================================================================

/**
 * Check if auto backup is needed
 */
export function isAutoBackupNeeded(
  lastBackupDate: string | null,
  intervalDays: number = DEFAULT_BACKUP_CONFIG.autoBackupIntervalDays
): boolean {
  if (!lastBackupDate) return true;
  
  const lastDate = new Date(lastBackupDate);
  const now = new Date();
  const diffMs = now.getTime() - lastDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  return diffDays >= intervalDays;
}

/**
 * Generate backup filename with timestamp
 */
export function generateBackupFilename(prefix: string = 'kbv-backup'): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 5).replace(':', '-');
  return `${prefix}-${dateStr}-${timeStr}.json`;
}

// ============================================================================
// GIT-READY EXPORT
// ============================================================================

/**
 * Export data in a Git-friendly format (separate files for each collection)
 */
export interface GitReadyExport {
  'speakers.json': string;
  'hosts.json': string;
  'visits.json': string;
  'archivedVisits.json': string;
  'specialDates.json': string;
  'settings.json': string;
  'metadata.json': string;
}

export function exportForGit(data: AppData): GitReadyExport {
  const metadata = {
    exportedAt: new Date().toISOString(),
    dataVersion: data.dataVersion,
    counts: {
      speakers: data.speakers.length,
      hosts: data.hosts.length,
      visits: data.visits.length,
      archivedVisits: data.archivedVisits.length,
      specialDates: data.specialDates?.length || 0,
    },
  };
  
  return {
    'speakers.json': JSON.stringify(data.speakers, null, 2),
    'hosts.json': JSON.stringify(data.hosts, null, 2),
    'visits.json': JSON.stringify(data.visits, null, 2),
    'archivedVisits.json': JSON.stringify(data.archivedVisits, null, 2),
    'specialDates.json': JSON.stringify(data.specialDates || [], null, 2),
    'settings.json': JSON.stringify({
      congregationProfile: data.congregationProfile,
      customTemplates: data.customTemplates,
      customHostRequestTemplates: data.customHostRequestTemplates,
      savedViews: data.savedViews,
    }, null, 2),
    'metadata.json': JSON.stringify(metadata, null, 2),
  };
}

/**
 * Import from Git-friendly format (merge separate files)
 */
export function importFromGit(files: Partial<GitReadyExport>): Partial<AppData> {
  const result: Partial<AppData> = {};
  
  if (files['speakers.json']) {
    try {
      result.speakers = JSON.parse(files['speakers.json']);
    } catch (e) {
      console.error('Failed to parse speakers.json');
    }
  }
  
  if (files['hosts.json']) {
    try {
      result.hosts = JSON.parse(files['hosts.json']);
    } catch (e) {
      console.error('Failed to parse hosts.json');
    }
  }
  
  if (files['visits.json']) {
    try {
      result.visits = JSON.parse(files['visits.json']);
    } catch (e) {
      console.error('Failed to parse visits.json');
    }
  }
  
  if (files['archivedVisits.json']) {
    try {
      result.archivedVisits = JSON.parse(files['archivedVisits.json']);
    } catch (e) {
      console.error('Failed to parse archivedVisits.json');
    }
  }
  
  if (files['specialDates.json']) {
    try {
      result.specialDates = JSON.parse(files['specialDates.json']);
    } catch (e) {
      console.error('Failed to parse specialDates.json');
    }
  }
  
  if (files['settings.json']) {
    try {
      const settings = JSON.parse(files['settings.json']);
      result.congregationProfile = settings.congregationProfile;
      result.customTemplates = settings.customTemplates;
      result.customHostRequestTemplates = settings.customHostRequestTemplates;
      result.savedViews = settings.savedViews;
    } catch (e) {
      console.error('Failed to parse settings.json');
    }
  }
  
  return result;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate backup data integrity
 */
export function validateBackupData(data: AppData): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check required collections
  if (!Array.isArray(data.speakers)) {
    issues.push('Collection speakers manquante ou invalide');
  }
  
  if (!Array.isArray(data.hosts)) {
    issues.push('Collection hosts manquante ou invalide');
  }
  
  if (!Array.isArray(data.visits)) {
    issues.push('Collection visits manquante ou invalide');
  }
  
  // Check for orphaned visits (visits without matching speaker)
  if (data.speakers && data.visits) {
    const speakerIds = new Set(data.speakers.map((s) => s.id));
    const orphanedVisits = data.visits.filter((v) => !speakerIds.has(v.id));
    if (orphanedVisits.length > 0) {
      issues.push(`${orphanedVisits.length} visite(s) orpheline(s) détectée(s)`);
    }
  }
  
  // Check for duplicate visit IDs
  if (data.visits) {
    const visitIds = data.visits.map((v) => v.visitId);
    const uniqueIds = new Set(visitIds);
    if (uniqueIds.size !== visitIds.length) {
      issues.push('IDs de visite en double détectés');
    }
  }
  
  return { valid: issues.length === 0, issues };
}
