/**
 * Module Cloud Sync - Isolation stricte
 * 
 * Ce module est strictement utilitaire. L'utilisateur déclenche la synchro
 * manuellement (Source externe optionnelle), et le résultat est fusionné
 * intelligemment sans écraser les notes locales.
 */

import { Visit, Speaker, Host } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface SyncResult {
  success: boolean;
  stats: SyncStats;
  conflicts: SyncConflict[];
  errors: string[];
}

export interface SyncStats {
  visitsAdded: number;
  visitsUpdated: number;
  visitsSkipped: number;
  speakersAdded: number;
  speakersUpdated: number;
  hostsAdded: number;
  hostsUpdated: number;
}

export interface SyncConflict {
  type: 'visit' | 'speaker' | 'host';
  localItem: any;
  remoteItem: any;
  field: string;
  resolution: 'keep_local' | 'keep_remote' | 'merge' | 'manual';
}

export interface MergeOptions {
  preserveLocalNotes: boolean;
  preserveLocalHosts: boolean;
  preserveLocalCommunicationStatus: boolean;
  preserveLocalAttachments: boolean;
  onlyAddNew: boolean; // If true, never update existing items
}

const DEFAULT_MERGE_OPTIONS: MergeOptions = {
  preserveLocalNotes: true,
  preserveLocalHosts: true,
  preserveLocalCommunicationStatus: true,
  preserveLocalAttachments: true,
  onlyAddNew: false,
};

// ============================================================================
// INTELLIGENT MERGE - Visits
// ============================================================================

/**
 * Merge remote visits with local visits, preserving local data
 */
export function mergeVisitsIntelligent(
  localVisits: Visit[],
  remoteVisits: Visit[],
  options: Partial<MergeOptions> = {}
): { merged: Visit[]; stats: Partial<SyncStats>; conflicts: SyncConflict[] } {
  const opts = { ...DEFAULT_MERGE_OPTIONS, ...options };
  const stats: Partial<SyncStats> = { visitsAdded: 0, visitsUpdated: 0, visitsSkipped: 0 };
  const conflicts: SyncConflict[] = [];
  
  // Create a map of local visits by externalId or visitDate+nom
  const localMap = new Map<string, Visit>();
  localVisits.forEach((v) => {
    const key = v.externalId || `${v.visitDate}__${v.nom.toLowerCase()}`;
    localMap.set(key, v);
  });
  
  const merged: Visit[] = [...localVisits];
  
  for (const remote of remoteVisits) {
    const key = remote.externalId || `${remote.visitDate}__${remote.nom.toLowerCase()}`;
    const local = localMap.get(key);
    
    if (!local) {
      // New visit - add it
      merged.push(remote);
      stats.visitsAdded = (stats.visitsAdded || 0) + 1;
    } else if (opts.onlyAddNew) {
      // Skip update when onlyAddNew is true
      stats.visitsSkipped = (stats.visitsSkipped || 0) + 1;
    } else {
      // Existing visit - intelligent merge
      const mergedVisit = mergeVisit(local, remote, opts, conflicts);
      
      // Replace the local visit with the merged one
      const index = merged.findIndex((v) => v.visitId === local.visitId);
      if (index > -1) {
        merged[index] = mergedVisit;
        stats.visitsUpdated = (stats.visitsUpdated || 0) + 1;
      }
    }
  }
  
  return { merged, stats, conflicts };
}

/**
 * Merge a single visit, preserving local data according to options
 */
function mergeVisit(
  local: Visit,
  remote: Visit,
  opts: MergeOptions,
  conflicts: SyncConflict[]
): Visit {
  const merged: Visit = {
    ...remote,
    // Always keep local IDs
    visitId: local.visitId,
    id: local.id,
    // Keep local creation date
    createdAt: local.createdAt,
    updatedAt: new Date().toISOString(),
  };
  
  // Preserve local notes if option enabled
  if (opts.preserveLocalNotes && local.notes) {
    if (remote.notes && remote.notes !== local.notes) {
      // Conflict - merge notes
      conflicts.push({
        type: 'visit',
        localItem: local,
        remoteItem: remote,
        field: 'notes',
        resolution: 'merge',
      });
      merged.notes = `${local.notes}\n---[Sync]---\n${remote.notes}`;
    } else {
      merged.notes = local.notes;
    }
  }
  
  // Preserve local host assignments if option enabled
  if (opts.preserveLocalHosts) {
    if (local.hostAssignments?.length) {
      merged.hostAssignments = local.hostAssignments;
    }
    if (local.host && local.host !== 'À définir' && local.host !== 'N/A') {
      merged.host = local.host;
    }
  }
  
  // Preserve local communication status if option enabled
  if (opts.preserveLocalCommunicationStatus && local.communicationStatus) {
    merged.communicationStatus = {
      ...remote.communicationStatus,
      ...local.communicationStatus,
    };
  }
  
  // Preserve local attachments if option enabled
  if (opts.preserveLocalAttachments && local.attachments?.length) {
    merged.attachments = local.attachments;
  }
  
  // Preserve local logistics
  if (local.logistics) {
    merged.logistics = local.logistics;
  }
  
  // Preserve local feedback
  if (local.feedback || local.visitFeedback) {
    merged.feedback = local.feedback;
    merged.visitFeedback = local.visitFeedback;
  }
  
  // Preserve local message resend status
  if (local.messageResendStatus) {
    merged.messageResendStatus = local.messageResendStatus;
  }
  
  return merged;
}

// ============================================================================
// INTELLIGENT MERGE - Speakers
// ============================================================================

/**
 * Merge remote speakers with local speakers, preserving local data
 */
export function mergeSpeakersIntelligent(
  localSpeakers: Speaker[],
  remoteSpeakers: Speaker[],
  options: Partial<MergeOptions> = {}
): { merged: Speaker[]; stats: Partial<SyncStats>; conflicts: SyncConflict[] } {
  const opts = { ...DEFAULT_MERGE_OPTIONS, ...options };
  const stats: Partial<SyncStats> = { speakersAdded: 0, speakersUpdated: 0 };
  const conflicts: SyncConflict[] = [];
  
  // Create a map of local speakers by name (normalized)
  const localMap = new Map<string, Speaker>();
  localSpeakers.forEach((s) => {
    localMap.set(s.nom.toLowerCase().trim(), s);
  });
  
  const merged: Speaker[] = [...localSpeakers];
  
  for (const remote of remoteSpeakers) {
    const key = remote.nom.toLowerCase().trim();
    const local = localMap.get(key);
    
    if (!local) {
      // New speaker - add it
      merged.push(remote);
      stats.speakersAdded = (stats.speakersAdded || 0) + 1;
    } else if (!opts.onlyAddNew) {
      // Existing speaker - intelligent merge
      const mergedSpeaker = mergeSpeaker(local, remote, opts, conflicts);
      
      // Replace the local speaker with the merged one
      const index = merged.findIndex((s) => s.id === local.id);
      if (index > -1) {
        merged[index] = mergedSpeaker;
        stats.speakersUpdated = (stats.speakersUpdated || 0) + 1;
      }
    }
  }
  
  return { merged, stats, conflicts };
}

/**
 * Merge a single speaker, preserving local data
 */
function mergeSpeaker(
  local: Speaker,
  remote: Speaker,
  opts: MergeOptions,
  conflicts: SyncConflict[]
): Speaker {
  const merged: Speaker = {
    ...remote,
    // Always keep local ID
    id: local.id,
    // Keep local creation date
    createdAt: local.createdAt,
    updatedAt: new Date().toISOString(),
    // Merge talk history
    talkHistory: [
      ...local.talkHistory,
      ...remote.talkHistory.filter(
        (rt) => !local.talkHistory.some((lt) => lt.visitId === rt.visitId)
      ),
    ],
    // Merge tags
    tags: Array.from(new Set([...(local.tags || []), ...(remote.tags || [])])),
  };
  
  // Preserve local notes
  if (opts.preserveLocalNotes && local.notes) {
    if (remote.notes && remote.notes !== local.notes) {
      conflicts.push({
        type: 'speaker',
        localItem: local,
        remoteItem: remote,
        field: 'notes',
        resolution: 'merge',
      });
      merged.notes = `${local.notes}\n---[Sync]---\n${remote.notes}`;
    } else {
      merged.notes = local.notes;
    }
  }
  
  // Preserve local photo if exists
  if (local.photoUrl && !remote.photoUrl) {
    merged.photoUrl = local.photoUrl;
  }
  
  // Preserve local phone if exists
  if (local.telephone && !remote.telephone) {
    merged.telephone = local.telephone;
  }
  
  return merged;
}

// ============================================================================
// INTELLIGENT MERGE - Hosts
// ============================================================================

/**
 * Merge remote hosts with local hosts, preserving local data
 */
export function mergeHostsIntelligent(
  localHosts: Host[],
  remoteHosts: Host[],
  options: Partial<MergeOptions> = {}
): { merged: Host[]; stats: Partial<SyncStats>; conflicts: SyncConflict[] } {
  const opts = { ...DEFAULT_MERGE_OPTIONS, ...options };
  const stats: Partial<SyncStats> = { hostsAdded: 0, hostsUpdated: 0 };
  const conflicts: SyncConflict[] = [];
  
  // Create a map of local hosts by name (normalized)
  const localMap = new Map<string, Host>();
  localHosts.forEach((h) => {
    localMap.set(h.nom.toLowerCase().trim(), h);
  });
  
  const merged: Host[] = [...localHosts];
  
  for (const remote of remoteHosts) {
    const key = remote.nom.toLowerCase().trim();
    const local = localMap.get(key);
    
    if (!local) {
      // New host - add it
      merged.push(remote);
      stats.hostsAdded = (stats.hostsAdded || 0) + 1;
    } else if (!opts.onlyAddNew) {
      // Existing host - intelligent merge
      const mergedHost = mergeHost(local, remote, opts, conflicts);
      
      // Replace the local host with the merged one
      const index = merged.findIndex((h) => h.nom === local.nom);
      if (index > -1) {
        merged[index] = mergedHost;
        stats.hostsUpdated = (stats.hostsUpdated || 0) + 1;
      }
    }
  }
  
  return { merged, stats, conflicts };
}

/**
 * Merge a single host, preserving local data
 */
function mergeHost(
  local: Host,
  remote: Host,
  opts: MergeOptions,
  conflicts: SyncConflict[]
): Host {
  const merged: Host = {
    ...remote,
    // Keep local creation date
    createdAt: local.createdAt,
    updatedAt: new Date().toISOString(),
    // Merge tags
    tags: Array.from(new Set([...(local.tags || []), ...(remote.tags || [])])),
    // Merge unavailable dates
    unavailableDates: Array.from(
      new Set([...(local.unavailableDates || []), ...(remote.unavailableDates || [])])
    ).sort(),
  };
  
  // Preserve local notes
  if (opts.preserveLocalNotes && local.notes) {
    if (remote.notes && remote.notes !== local.notes) {
      conflicts.push({
        type: 'host',
        localItem: local,
        remoteItem: remote,
        field: 'notes',
        resolution: 'merge',
      });
      merged.notes = `${local.notes}\n---[Sync]---\n${remote.notes}`;
    } else {
      merged.notes = local.notes;
    }
  }
  
  // Preserve local photo if exists
  if (local.photoUrl && !remote.photoUrl) {
    merged.photoUrl = local.photoUrl;
  }
  
  // Preserve local phone if exists
  if (local.telephone && !remote.telephone) {
    merged.telephone = local.telephone;
  }
  
  // Preserve local address if exists
  if (local.address && !remote.address) {
    merged.address = local.address;
  }
  
  return merged;
}

// ============================================================================
// SYNC UTILITIES
// ============================================================================

/**
 * Create a summary of sync results for user display
 */
export function formatSyncSummary(result: SyncResult): string {
  const { stats, conflicts, errors } = result;
  const lines: string[] = [];
  
  if (result.success) {
    lines.push('✅ Synchronisation réussie');
  } else {
    lines.push('❌ Synchronisation avec erreurs');
  }
  
  lines.push('');
  lines.push('📊 Résumé:');
  
  if (stats.visitsAdded) lines.push(`  • ${stats.visitsAdded} visite(s) ajoutée(s)`);
  if (stats.visitsUpdated) lines.push(`  • ${stats.visitsUpdated} visite(s) mise(s) à jour`);
  if (stats.visitsSkipped) lines.push(`  • ${stats.visitsSkipped} visite(s) ignorée(s)`);
  if (stats.speakersAdded) lines.push(`  • ${stats.speakersAdded} orateur(s) ajouté(s)`);
  if (stats.speakersUpdated) lines.push(`  • ${stats.speakersUpdated} orateur(s) mis à jour`);
  if (stats.hostsAdded) lines.push(`  • ${stats.hostsAdded} hôte(s) ajouté(s)`);
  if (stats.hostsUpdated) lines.push(`  • ${stats.hostsUpdated} hôte(s) mis à jour`);
  
  if (conflicts.length > 0) {
    lines.push('');
    lines.push(`⚠️ ${conflicts.length} conflit(s) résolu(s) automatiquement`);
  }
  
  if (errors.length > 0) {
    lines.push('');
    lines.push('❌ Erreurs:');
    errors.forEach((e) => lines.push(`  • ${e}`));
  }
  
  return lines.join('\n');
}

/**
 * Validate sync data before merging
 */
export function validateSyncData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data) {
    errors.push('Données vides');
    return { valid: false, errors };
  }
  
  if (data.visits && !Array.isArray(data.visits)) {
    errors.push('Format de visites invalide');
  }
  
  if (data.speakers && !Array.isArray(data.speakers)) {
    errors.push('Format d\'orateurs invalide');
  }
  
  if (data.hosts && !Array.isArray(data.hosts)) {
    errors.push('Format d\'hôtes invalide');
  }
  
  return { valid: errors.length === 0, errors };
}
