/**
 * Module Visites (Visits)
 * Gestion modulaire avec validation et système de snapshot pour WhatsApp Auto-Action
 */

import { Visit, ValidationError, VisitStatus, LocationType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// SNAPSHOT SYSTEM - Pour détecter les modifications et marquer "À renvoyer"
// ============================================================================

export interface VisitSnapshot {
  visitDate: string;
  visitTime: string;
  host: string;
  hostAssignments?: string; // JSON stringified for comparison
  locationType: LocationType;
  talkNoOrType: string | null;
}

export interface SnapshotComparison {
  hasChanges: boolean;
  changes: VisitChange[];
  requiresResend: boolean;
}

export interface VisitChange {
  field: string;
  oldValue: string | null;
  newValue: string | null;
  label: string;
}

/**
 * Create a snapshot of critical visit fields
 */
export function createVisitSnapshot(visit: Visit): VisitSnapshot {
  return {
    visitDate: visit.visitDate,
    visitTime: visit.visitTime,
    host: visit.host,
    hostAssignments: visit.hostAssignments ? JSON.stringify(visit.hostAssignments) : undefined,
    locationType: visit.locationType,
    talkNoOrType: visit.talkNoOrType,
  };
}

/**
 * Compare two snapshots and return the differences
 */
export function compareSnapshots(
  oldSnapshot: VisitSnapshot,
  newSnapshot: VisitSnapshot
): SnapshotComparison {
  const changes: VisitChange[] = [];

  // Date change
  if (oldSnapshot.visitDate !== newSnapshot.visitDate) {
    changes.push({
      field: 'visitDate',
      oldValue: oldSnapshot.visitDate,
      newValue: newSnapshot.visitDate,
      label: '📅 Date modifiée',
    });
  }

  // Time change
  if (oldSnapshot.visitTime !== newSnapshot.visitTime) {
    changes.push({
      field: 'visitTime',
      oldValue: oldSnapshot.visitTime,
      newValue: newSnapshot.visitTime,
      label: '🕐 Heure modifiée',
    });
  }

  // Host change
  if (oldSnapshot.host !== newSnapshot.host) {
    changes.push({
      field: 'host',
      oldValue: oldSnapshot.host,
      newValue: newSnapshot.host,
      label: '🏠 Hôte modifié',
    });
  }

  // Host assignments change
  if (oldSnapshot.hostAssignments !== newSnapshot.hostAssignments) {
    changes.push({
      field: 'hostAssignments',
      oldValue: oldSnapshot.hostAssignments || null,
      newValue: newSnapshot.hostAssignments || null,
      label: '👥 Attributions d\'hôtes modifiées',
    });
  }

  // Location type change
  if (oldSnapshot.locationType !== newSnapshot.locationType) {
    changes.push({
      field: 'locationType',
      oldValue: oldSnapshot.locationType,
      newValue: newSnapshot.locationType,
      label: '📍 Type de lieu modifié',
    });
  }

  // Talk change
  if (oldSnapshot.talkNoOrType !== newSnapshot.talkNoOrType) {
    changes.push({
      field: 'talkNoOrType',
      oldValue: oldSnapshot.talkNoOrType,
      newValue: newSnapshot.talkNoOrType,
      label: '🎤 Discours modifié',
    });
  }

  // Determine if resend is required (date, time, host changes require resend)
  const criticalFields = ['visitDate', 'visitTime', 'host', 'hostAssignments', 'locationType'];
  const requiresResend = changes.some((c) => criticalFields.includes(c.field));

  return {
    hasChanges: changes.length > 0,
    changes,
    requiresResend,
  };
}

/**
 * Format changes for display in a message
 */
export function formatChangesForMessage(changes: VisitChange[]): string {
  return changes.map((c) => `${c.label}: ${c.oldValue || '(vide)'} → ${c.newValue || '(vide)'}`).join('\n');
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface VisitValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export function validateVisit(visit: Partial<Visit>): VisitValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!visit.nom?.trim()) {
    errors.push({ field: 'nom', message: 'Le nom de l\'orateur est obligatoire' });
  }

  if (!visit.visitDate) {
    errors.push({ field: 'visitDate', message: 'La date de visite est obligatoire' });
  } else {
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(visit.visitDate)) {
      errors.push({ field: 'visitDate', message: 'Format de date invalide (YYYY-MM-DD)' });
    }
  }

  if (!visit.visitTime) {
    errors.push({ field: 'visitTime', message: 'L\'heure de visite est obligatoire' });
  } else {
    // Validate time format
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(visit.visitTime)) {
      errors.push({ field: 'visitTime', message: 'Format d\'heure invalide (HH:MM)' });
    }
  }

  if (!visit.locationType) {
    errors.push({ field: 'locationType', message: 'Le type de lieu est obligatoire' });
  }

  // Warnings
  if (!visit.host?.trim() && (!visit.hostAssignments || visit.hostAssignments.length === 0)) {
    warnings.push('Aucun hôte assigné');
  }

  if (!visit.talkNoOrType) {
    warnings.push('Aucun discours assigné');
  }

  if (visit.locationType === 'zoom' && !visit.zoomLink) {
    warnings.push('Lien Zoom manquant pour une visite en Zoom');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

export function createVisit(
  data: Omit<Visit, 'visitId' | 'status' | 'createdAt' | 'updatedAt'>
): Visit {
  const now = new Date().toISOString();
  return {
    ...data,
    visitId: uuidv4(),
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
}

export function updateVisitData(visit: Visit, updates: Partial<Visit>): Visit {
  return {
    ...visit,
    ...updates,
    visitId: visit.visitId, // Prevent visitId change
    id: visit.id, // Prevent speaker ID change
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// STATUS MANAGEMENT
// ============================================================================

export function canTransitionTo(currentStatus: VisitStatus, newStatus: VisitStatus): boolean {
  const transitions: Record<VisitStatus, VisitStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled', 'pending'],
    completed: [], // No transitions from completed
    cancelled: ['pending'], // Can reactivate a cancelled visit
  };

  return transitions[currentStatus]?.includes(newStatus) ?? false;
}

export function completeVisitData(visit: Visit): Visit {
  if (!canTransitionTo(visit.status, 'completed')) {
    throw new Error(`Cannot complete visit with status: ${visit.status}`);
  }

  return {
    ...visit,
    status: 'completed',
    updatedAt: new Date().toISOString(),
  };
}

export function cancelVisitData(visit: Visit): Visit {
  if (!canTransitionTo(visit.status, 'cancelled')) {
    throw new Error(`Cannot cancel visit with status: ${visit.status}`);
  }

  return {
    ...visit,
    status: 'cancelled',
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================

export interface VisitFilters {
  search?: string;
  status?: VisitStatus | VisitStatus[];
  locationType?: LocationType | LocationType[];
  dateFrom?: string;
  dateTo?: string;
  congregation?: string;
  hasHost?: boolean;
  needsAction?: boolean;
}

export function filterVisits(visits: Visit[], filters: VisitFilters): Visit[] {
  return visits.filter((visit) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        visit.nom.toLowerCase().includes(searchLower) ||
        visit.congregation.toLowerCase().includes(searchLower) ||
        visit.host?.toLowerCase().includes(searchLower) ||
        visit.talkTheme?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      if (!statuses.includes(visit.status)) return false;
    }

    // Location type filter
    if (filters.locationType) {
      const types = Array.isArray(filters.locationType) ? filters.locationType : [filters.locationType];
      if (!types.includes(visit.locationType)) return false;
    }

    // Date range filter
    if (filters.dateFrom && visit.visitDate < filters.dateFrom) return false;
    if (filters.dateTo && visit.visitDate > filters.dateTo) return false;

    // Congregation filter
    if (filters.congregation && visit.congregation !== filters.congregation) return false;

    // Has host filter
    if (filters.hasHost !== undefined) {
      const hasHost = !!visit.host?.trim() || (visit.hostAssignments?.length ?? 0) > 0;
      if (hasHost !== filters.hasHost) return false;
    }

    return true;
  });
}

// ============================================================================
// SORTING
// ============================================================================

export type VisitSortField = 'visitDate' | 'nom' | 'congregation' | 'status' | 'createdAt';

export function sortVisits(
  visits: Visit[],
  field: VisitSortField = 'visitDate',
  order: 'asc' | 'desc' = 'asc'
): Visit[] {
  return [...visits].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'visitDate':
        comparison = `${a.visitDate}${a.visitTime}`.localeCompare(`${b.visitDate}${b.visitTime}`);
        break;
      case 'nom':
        comparison = a.nom.localeCompare(b.nom);
        break;
      case 'congregation':
        comparison = a.congregation.localeCompare(b.congregation);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'createdAt':
        comparison = (a.createdAt || '').localeCompare(b.createdAt || '');
        break;
    }

    return order === 'desc' ? -comparison : comparison;
  });
}

// ============================================================================
// UTILITIES
// ============================================================================

export function getVisitById(visits: Visit[], visitId: string): Visit | undefined {
  return visits.find((v) => v.visitId === visitId);
}

export function getVisitsBySpeakerId(visits: Visit[], speakerId: string): Visit[] {
  return visits.filter((v) => v.id === speakerId);
}

export function getUpcomingVisits(visits: Visit[], days: number = 30): Visit[] {
  const today = new Date().toISOString().slice(0, 10);
  const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return filterVisits(visits, {
    dateFrom: today,
    dateTo: futureDate,
    status: ['pending', 'confirmed'],
  });
}

export function getPastVisits(visits: Visit[]): Visit[] {
  const today = new Date().toISOString().slice(0, 10);
  return visits.filter((v) => v.visitDate < today);
}

// ============================================================================
// CONFLICT DETECTION
// ============================================================================

export interface VisitConflict {
  type: 'same_date' | 'same_speaker' | 'same_host' | 'special_event';
  message: string;
  conflictingVisit?: Visit;
  specialEventName?: string;
}

export function detectConflicts(
  newVisit: Partial<Visit>,
  existingVisits: Visit[],
  specialDates?: Array<{ date: string; name: string; type: string }>
): VisitConflict[] {
  const conflicts: VisitConflict[] = [];

  if (!newVisit.visitDate) return conflicts;

  // Check for same date (another visit on same day)
  const sameDateVisits = existingVisits.filter(
    (v) => v.visitDate === newVisit.visitDate && v.visitId !== newVisit.visitId
  );

  if (sameDateVisits.length > 0) {
    conflicts.push({
      type: 'same_date',
      message: `Il y a déjà ${sameDateVisits.length} visite(s) prévue(s) ce jour`,
      conflictingVisit: sameDateVisits[0],
    });
  }

  // Check for same speaker in close timeframe (within 2 months)
  if (newVisit.id) {
    const twoMonthsBefore = new Date(newVisit.visitDate);
    twoMonthsBefore.setMonth(twoMonthsBefore.getMonth() - 2);
    const twoMonthsAfter = new Date(newVisit.visitDate);
    twoMonthsAfter.setMonth(twoMonthsAfter.getMonth() + 2);

    const sameSpeakerVisits = existingVisits.filter(
      (v) =>
        v.id === newVisit.id &&
        v.visitId !== newVisit.visitId &&
        v.visitDate >= twoMonthsBefore.toISOString().slice(0, 10) &&
        v.visitDate <= twoMonthsAfter.toISOString().slice(0, 10)
    );

    if (sameSpeakerVisits.length > 0) {
      conflicts.push({
        type: 'same_speaker',
        message: `L'orateur a déjà une visite proche (${sameSpeakerVisits[0].visitDate})`,
        conflictingVisit: sameSpeakerVisits[0],
      });
    }
  }

  // Check for special events on same date
  if (specialDates) {
    const specialEvent = specialDates.find((sd) => sd.date === newVisit.visitDate);
    if (specialEvent) {
      conflicts.push({
        type: 'special_event',
        message: `Cette date est réservée: ${specialEvent.name}`,
        specialEventName: specialEvent.name,
      });
    }
  }

  return conflicts;
}

// ============================================================================
// MESSAGE RESEND STATUS
// ============================================================================

export interface MessageResendStatus {
  needsResend: boolean;
  messageTypes: string[];
  reason: string;
  changes: VisitChange[];
}

/**
 * Check if messages need to be resent based on visit changes
 */
export function checkMessageResendStatus(
  oldVisit: Visit,
  newVisit: Visit
): MessageResendStatus {
  const oldSnapshot = createVisitSnapshot(oldVisit);
  const newSnapshot = createVisitSnapshot(newVisit);
  const comparison = compareSnapshots(oldSnapshot, newSnapshot);

  if (!comparison.requiresResend) {
    return {
      needsResend: false,
      messageTypes: [],
      reason: '',
      changes: [],
    };
  }

  // Determine which messages need to be resent
  const messageTypes: string[] = [];

  // Date/time changes affect all confirmations
  if (comparison.changes.some((c) => ['visitDate', 'visitTime'].includes(c.field))) {
    messageTypes.push('confirmation', 'preparation', 'host_request');
  }

  // Host changes affect host-related messages
  if (comparison.changes.some((c) => ['host', 'hostAssignments'].includes(c.field))) {
    messageTypes.push('host_request', 'host_request_individual');
  }

  // Location changes affect confirmations
  if (comparison.changes.some((c) => c.field === 'locationType')) {
    messageTypes.push('confirmation', 'preparation');
  }

  return {
    needsResend: true,
    messageTypes: [...new Set(messageTypes)],
    reason: formatChangesForMessage(comparison.changes),
    changes: comparison.changes,
  };
}
