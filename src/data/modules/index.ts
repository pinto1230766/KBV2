/**
 * Data Modules - Central Export
 * Architecture modulaire pour la gestion des données
 */

// ============================================================================
// SPEAKER MODULE
// ============================================================================
export {
  // Validation
  validateSpeaker,
  type SpeakerValidationResult,
  // CRUD
  createSpeaker,
  updateSpeakerData,
  // Search & Filter
  filterSpeakers,
  type SpeakerFilters,
  // Utilities
  getSpeakerById,
  getSpeakerByName,
  getUniqueCongregations,
  getUniqueTags as getSpeakerTags,
  // Duplicates
  findDuplicateSpeakers,
  type DuplicateGroup as SpeakerDuplicateGroup,
  // Merge
  mergeSpeakers,
} from './speakers';

// ============================================================================
// HOST MODULE
// ============================================================================
export {
  // Validation
  validateHost,
  type HostValidationResult,
  // CRUD
  createHost,
  updateHostData,
  // Availability
  isHostAvailable,
  getAvailableHosts,
  addUnavailableDate,
  removeUnavailableDate,
  // Search & Filter
  filterHosts,
  type HostFilters,
  // Utilities
  getHostByName,
  getUniqueTags as getHostTags,
  // Duplicates
  findDuplicateHosts,
  type HostDuplicateGroup,
  // Merge
  mergeHosts,
} from './hosts';

// ============================================================================
// VISIT MODULE
// ============================================================================
export {
  // Snapshot System (WhatsApp Auto-Action)
  createVisitSnapshot,
  compareSnapshots,
  formatChangesForMessage,
  checkMessageResendStatus,
  type VisitSnapshot,
  type SnapshotComparison,
  type VisitChange,
  type MessageResendStatus,
  // Validation
  validateVisit,
  type VisitValidationResult,
  // CRUD
  createVisit,
  updateVisitData,
  // Status Management
  canTransitionTo,
  completeVisitData,
  cancelVisitData,
  // Search & Filter
  filterVisits,
  type VisitFilters,
  // Sorting
  sortVisits,
  type VisitSortField,
  // Utilities
  getVisitById,
  getVisitsBySpeakerId,
  getUpcomingVisits,
  getPastVisits,
  // Conflict Detection
  detectConflicts,
  type VisitConflict,
} from './visits';

// ============================================================================
// SPECIAL EVENTS MODULE
// ============================================================================
export {
  // Types & Config
  type SpecialEvent,
  EVENT_TYPE_CONFIG,
  // Validation
  validateSpecialEvent,
  type SpecialEventValidationResult,
  // CRUD
  createSpecialEvent,
  updateSpecialEvent,
  // Recurring Events
  generateRecurringOccurrences,
  // Conflict Detection
  checkDateConflict,
  getBlockingDates,
  type EventConflict,
  // Search & Filter
  filterSpecialEvents,
  type SpecialEventFilters,
  // Utilities
  getEventById,
  getEventsForMonth,
  getUpcomingEvents as getUpcomingSpecialEvents,
  sortEventsByDate,
  // Templates
  STANDARD_EVENTS,
  createFromTemplate,
} from './specialEvents';

// ============================================================================
// CLOUD SYNC MODULE (Isolation stricte - Synchro manuelle uniquement)
// ============================================================================
export {
  // Types
  type SyncResult,
  type SyncStats,
  type SyncConflict,
  type MergeOptions,
  // Intelligent Merge
  mergeVisitsIntelligent,
  mergeSpeakersIntelligent,
  mergeHostsIntelligent,
  // Utilities
  formatSyncSummary,
  validateSyncData,
} from './cloudSync';

// ============================================================================
// BACKUP MODULE (Sauvegarde automatique et Git-ready)
// ============================================================================
export {
  // Types
  type BackupMetadata,
  type BackupFile,
  type BackupConfig,
  type GitReadyExport,
  // Backup Creation
  createBackup,
  exportBackupToJson,
  importBackupFromJson,
  // Backup Rotation
  getBackupKeys,
  rotateBackups,
  // Auto Backup
  isAutoBackupNeeded,
  generateBackupFilename,
  // Git-Ready Export
  exportForGit,
  importFromGit,
  // Validation
  validateBackupData,
} from './backup';
