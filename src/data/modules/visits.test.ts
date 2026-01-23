/**
 * Tests unitaires - Module Visits
 * Couvre: validation, conflits, snapshot/WhatsApp, CRUD, filtres
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createVisitSnapshot,
  compareSnapshots,
  formatChangesForMessage,
  validateVisit,
  createVisit,
  updateVisitData,
  canTransitionTo,
  completeVisitData,
  cancelVisitData,
  filterVisits,
  sortVisits,
  getVisitById,
  getVisitsBySpeakerId,
  detectConflicts,
  checkMessageResendStatus,
} from './visits';
import { Visit } from '@/types';

// ============================================================================
// FIXTURES
// ============================================================================

const createMockVisit = (overrides: Partial<Visit> = {}): Visit => ({
  id: 'speaker-1',
  visitId: 'visit-1',
  nom: 'Jean Dupont',
  congregation: 'Lyon Centre',
  visitDate: '2026-02-15',
  visitTime: '14:30',
  host: 'Pierre Martin',
  accommodation: '',
  meals: '',
  status: 'pending',
  locationType: 'physical',
  talkNoOrType: '42',
  talkTheme: 'La foi qui sauve',
  createdAt: '2026-01-01T10:00:00Z',
  updatedAt: '2026-01-01T10:00:00Z',
  ...overrides,
});

// ============================================================================
// SNAPSHOT SYSTEM TESTS
// ============================================================================

describe('Snapshot System (WhatsApp Auto-Action)', () => {
  describe('createVisitSnapshot', () => {
    it('should create a snapshot with all critical fields', () => {
      const visit = createMockVisit();
      const snapshot = createVisitSnapshot(visit);

      expect(snapshot.visitDate).toBe('2026-02-15');
      expect(snapshot.visitTime).toBe('14:30');
      expect(snapshot.host).toBe('Pierre Martin');
      expect(snapshot.locationType).toBe('physical');
      expect(snapshot.talkNoOrType).toBe('42');
    });

    it('should stringify hostAssignments for comparison', () => {
      const visit = createMockVisit({
        hostAssignments: [
          { id: 'ha-1', hostId: 'host-1', hostName: 'Pierre', role: 'accommodation' },
          { id: 'ha-2', hostId: 'host-2', hostName: 'Marie', role: 'meals' },
        ],
      });
      const snapshot = createVisitSnapshot(visit);

      expect(snapshot.hostAssignments).toBeDefined();
      expect(typeof snapshot.hostAssignments).toBe('string');
      expect(JSON.parse(snapshot.hostAssignments!)).toHaveLength(2);
    });
  });

  describe('compareSnapshots', () => {
    it('should detect no changes when snapshots are identical', () => {
      const visit = createMockVisit();
      const snapshot1 = createVisitSnapshot(visit);
      const snapshot2 = createVisitSnapshot(visit);

      const result = compareSnapshots(snapshot1, snapshot2);

      expect(result.hasChanges).toBe(false);
      expect(result.changes).toHaveLength(0);
      expect(result.requiresResend).toBe(false);
    });

    it('should detect date change', () => {
      const visit1 = createMockVisit({ visitDate: '2026-02-15' });
      const visit2 = createMockVisit({ visitDate: '2026-02-22' });

      const result = compareSnapshots(
        createVisitSnapshot(visit1),
        createVisitSnapshot(visit2)
      );

      expect(result.hasChanges).toBe(true);
      expect(result.requiresResend).toBe(true);
      expect(result.changes).toContainEqual(
        expect.objectContaining({ field: 'visitDate', oldValue: '2026-02-15', newValue: '2026-02-22' })
      );
    });

    it('should detect time change', () => {
      const visit1 = createMockVisit({ visitTime: '14:30' });
      const visit2 = createMockVisit({ visitTime: '10:00' });

      const result = compareSnapshots(
        createVisitSnapshot(visit1),
        createVisitSnapshot(visit2)
      );

      expect(result.hasChanges).toBe(true);
      expect(result.requiresResend).toBe(true);
      expect(result.changes).toContainEqual(
        expect.objectContaining({ field: 'visitTime' })
      );
    });

    it('should detect host change', () => {
      const visit1 = createMockVisit({ host: 'Pierre Martin' });
      const visit2 = createMockVisit({ host: 'Jacques Durand' });

      const result = compareSnapshots(
        createVisitSnapshot(visit1),
        createVisitSnapshot(visit2)
      );

      expect(result.hasChanges).toBe(true);
      expect(result.requiresResend).toBe(true);
      expect(result.changes).toContainEqual(
        expect.objectContaining({ field: 'host', label: '🏠 Hôte modifié' })
      );
    });

    it('should detect location type change', () => {
      const visit1 = createMockVisit({ locationType: 'physical' });
      const visit2 = createMockVisit({ locationType: 'zoom' });

      const result = compareSnapshots(
        createVisitSnapshot(visit1),
        createVisitSnapshot(visit2)
      );

      expect(result.hasChanges).toBe(true);
      expect(result.requiresResend).toBe(true);
    });

    it('should detect multiple changes', () => {
      const visit1 = createMockVisit({
        visitDate: '2026-02-15',
        visitTime: '14:30',
        host: 'Pierre',
      });
      const visit2 = createMockVisit({
        visitDate: '2026-02-22',
        visitTime: '10:00',
        host: 'Jacques',
      });

      const result = compareSnapshots(
        createVisitSnapshot(visit1),
        createVisitSnapshot(visit2)
      );

      expect(result.hasChanges).toBe(true);
      expect(result.changes.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('formatChangesForMessage', () => {
    it('should format changes for display', () => {
      const changes = [
        { field: 'visitDate', oldValue: '2026-02-15', newValue: '2026-02-22', label: '📅 Date modifiée' },
        { field: 'host', oldValue: 'Pierre', newValue: 'Jacques', label: '🏠 Hôte modifié' },
      ];

      const formatted = formatChangesForMessage(changes);

      expect(formatted).toContain('📅 Date modifiée');
      expect(formatted).toContain('2026-02-15');
      expect(formatted).toContain('2026-02-22');
      expect(formatted).toContain('🏠 Hôte modifié');
    });

    it('should handle null values', () => {
      const changes = [
        { field: 'host', oldValue: null, newValue: 'Jacques', label: '🏠 Hôte modifié' },
      ];

      const formatted = formatChangesForMessage(changes);

      expect(formatted).toContain('(vide)');
      expect(formatted).toContain('Jacques');
    });
  });

  describe('checkMessageResendStatus', () => {
    it('should return needsResend=false when no critical changes', () => {
      const oldVisit = createMockVisit({ notes: 'Old note' });
      const newVisit = createMockVisit({ notes: 'New note' });

      const result = checkMessageResendStatus(oldVisit, newVisit);

      expect(result.needsResend).toBe(false);
      expect(result.messageTypes).toHaveLength(0);
    });

    it('should return needsResend=true for date change', () => {
      const oldVisit = createMockVisit({ visitDate: '2026-02-15' });
      const newVisit = createMockVisit({ visitDate: '2026-02-22' });

      const result = checkMessageResendStatus(oldVisit, newVisit);

      expect(result.needsResend).toBe(true);
      expect(result.messageTypes).toContain('confirmation');
      expect(result.messageTypes).toContain('preparation');
    });

    it('should return needsResend=true for host change', () => {
      const oldVisit = createMockVisit({ host: 'Pierre' });
      const newVisit = createMockVisit({ host: 'Jacques' });

      const result = checkMessageResendStatus(oldVisit, newVisit);

      expect(result.needsResend).toBe(true);
      expect(result.messageTypes).toContain('host_request');
    });

    it('should include reason with change summary', () => {
      const oldVisit = createMockVisit({ visitTime: '14:30' });
      const newVisit = createMockVisit({ visitTime: '10:00' });

      const result = checkMessageResendStatus(oldVisit, newVisit);

      expect(result.reason).toContain('Heure');
      expect(result.changes).toHaveLength(1);
    });
  });
});

// ============================================================================
// VALIDATION TESTS
// ============================================================================

describe('Visit Validation', () => {
  describe('validateVisit', () => {
    it('should pass for valid visit', () => {
      const visit = createMockVisit();
      const result = validateVisit(visit);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail without nom', () => {
      const visit = createMockVisit({ nom: '' });
      const result = validateVisit(visit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'nom' })
      );
    });

    it('should fail without visitDate', () => {
      const visit = createMockVisit({ visitDate: undefined as any });
      const result = validateVisit(visit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'visitDate' })
      );
    });

    it('should fail with invalid date format', () => {
      const visit = createMockVisit({ visitDate: '15/02/2026' });
      const result = validateVisit(visit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'visitDate', message: expect.stringContaining('Format') })
      );
    });

    it('should fail without visitTime', () => {
      const visit = createMockVisit({ visitTime: undefined as any });
      const result = validateVisit(visit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'visitTime' })
      );
    });

    it('should fail with invalid time format', () => {
      const visit = createMockVisit({ visitTime: '2:30 PM' });
      const result = validateVisit(visit);

      expect(result.isValid).toBe(false);
    });

    it('should warn when no host assigned', () => {
      const visit = createMockVisit({ host: '', hostAssignments: [] });
      const result = validateVisit(visit);

      expect(result.warnings).toContain('Aucun hôte assigné');
    });

    it('should warn for Zoom without link', () => {
      const visit = createMockVisit({ locationType: 'zoom', zoomLink: undefined });
      const result = validateVisit(visit);

      expect(result.warnings).toContain('Lien Zoom manquant pour une visite en Zoom');
    });
  });
});

// ============================================================================
// CRUD TESTS
// ============================================================================

describe('Visit CRUD Operations', () => {
  describe('createVisit', () => {
    it('should create visit with generated ID and timestamps', () => {
      const data = {
        id: 'speaker-1',
        nom: 'Jean Dupont',
        congregation: 'Lyon',
        visitDate: '2026-02-15',
        visitTime: '14:30',
        host: 'Pierre',
        accommodation: '',
        meals: '',
        locationType: 'physical' as const,
        talkNoOrType: '42',
        talkTheme: 'Test',
      };

      const visit = createVisit(data);

      expect(visit.visitId).toBeDefined();
      expect(visit.visitId.length).toBeGreaterThan(0);
      expect(visit.status).toBe('pending');
      expect(visit.createdAt).toBeDefined();
      expect(visit.updatedAt).toBeDefined();
    });
  });

  describe('updateVisitData', () => {
    it('should update fields while preserving IDs', () => {
      const original = createMockVisit();
      const updated = updateVisitData(original, { host: 'New Host', notes: 'New notes' });

      expect(updated.host).toBe('New Host');
      expect(updated.notes).toBe('New notes');
      expect(updated.visitId).toBe(original.visitId);
      expect(updated.id).toBe(original.id);
      expect(updated.updatedAt).not.toBe(original.updatedAt);
    });

    it('should not allow changing visitId', () => {
      const original = createMockVisit();
      const updated = updateVisitData(original, { visitId: 'new-id' } as any);

      expect(updated.visitId).toBe(original.visitId);
    });
  });
});

// ============================================================================
// STATUS MANAGEMENT TESTS
// ============================================================================

describe('Status Management', () => {
  describe('canTransitionTo', () => {
    it('should allow pending → confirmed', () => {
      expect(canTransitionTo('pending', 'confirmed')).toBe(true);
    });

    it('should allow pending → cancelled', () => {
      expect(canTransitionTo('pending', 'cancelled')).toBe(true);
    });

    it('should allow confirmed → completed', () => {
      expect(canTransitionTo('confirmed', 'completed')).toBe(true);
    });

    it('should not allow pending → completed', () => {
      expect(canTransitionTo('pending', 'completed')).toBe(false);
    });

    it('should not allow completed → any', () => {
      expect(canTransitionTo('completed', 'pending')).toBe(false);
      expect(canTransitionTo('completed', 'confirmed')).toBe(false);
      expect(canTransitionTo('completed', 'cancelled')).toBe(false);
    });

    it('should allow cancelled → pending (reactivation)', () => {
      expect(canTransitionTo('cancelled', 'pending')).toBe(true);
    });
  });

  describe('completeVisitData', () => {
    it('should complete a confirmed visit', () => {
      const visit = createMockVisit({ status: 'confirmed' });
      const completed = completeVisitData(visit);

      expect(completed.status).toBe('completed');
    });

    it('should throw for invalid transition', () => {
      const visit = createMockVisit({ status: 'pending' });
      
      expect(() => completeVisitData(visit)).toThrow();
    });
  });

  describe('cancelVisitData', () => {
    it('should cancel a pending visit', () => {
      const visit = createMockVisit({ status: 'pending' });
      const cancelled = cancelVisitData(visit);

      expect(cancelled.status).toBe('cancelled');
    });

    it('should throw for completed visit', () => {
      const visit = createMockVisit({ status: 'completed' });
      
      expect(() => cancelVisitData(visit)).toThrow();
    });
  });
});

// ============================================================================
// FILTER & SORT TESTS
// ============================================================================

describe('Filter and Sort', () => {
  let visits: Visit[];

  beforeEach(() => {
    visits = [
      createMockVisit({ visitId: '1', nom: 'Alice', visitDate: '2026-02-10', status: 'pending', congregation: 'Lyon' }),
      createMockVisit({ visitId: '2', nom: 'Bob', visitDate: '2026-02-15', status: 'confirmed', congregation: 'Paris' }),
      createMockVisit({ visitId: '3', nom: 'Charlie', visitDate: '2026-02-20', status: 'completed', congregation: 'Lyon' }),
      createMockVisit({ visitId: '4', nom: 'Diana', visitDate: '2026-03-01', status: 'cancelled', locationType: 'zoom' }),
    ];
  });

  describe('filterVisits', () => {
    it('should filter by search term', () => {
      const result = filterVisits(visits, { search: 'alice' });
      expect(result).toHaveLength(1);
      expect(result[0].nom).toBe('Alice');
    });

    it('should filter by status', () => {
      const result = filterVisits(visits, { status: 'pending' });
      expect(result).toHaveLength(1);
    });

    it('should filter by multiple statuses', () => {
      const result = filterVisits(visits, { status: ['pending', 'confirmed'] });
      expect(result).toHaveLength(2);
    });

    it('should filter by date range', () => {
      const result = filterVisits(visits, { dateFrom: '2026-02-15', dateTo: '2026-02-20' });
      expect(result).toHaveLength(2);
    });

    it('should filter by congregation', () => {
      const result = filterVisits(visits, { congregation: 'Lyon' });
      expect(result).toHaveLength(2);
    });

    it('should filter by locationType', () => {
      const result = filterVisits(visits, { locationType: 'zoom' });
      expect(result).toHaveLength(1);
    });

    it('should combine multiple filters', () => {
      const result = filterVisits(visits, { congregation: 'Lyon', status: 'pending' });
      expect(result).toHaveLength(1);
      expect(result[0].nom).toBe('Alice');
    });
  });

  describe('sortVisits', () => {
    it('should sort by date ascending', () => {
      const result = sortVisits(visits, 'visitDate', 'asc');
      expect(result[0].visitDate).toBe('2026-02-10');
      expect(result[result.length - 1].visitDate).toBe('2026-03-01');
    });

    it('should sort by date descending', () => {
      const result = sortVisits(visits, 'visitDate', 'desc');
      expect(result[0].visitDate).toBe('2026-03-01');
    });

    it('should sort by name', () => {
      const result = sortVisits(visits, 'nom', 'asc');
      expect(result[0].nom).toBe('Alice');
      expect(result[result.length - 1].nom).toBe('Diana');
    });

    it('should sort by status', () => {
      const result = sortVisits(visits, 'status', 'asc');
      expect(result[0].status).toBe('cancelled');
    });
  });

  describe('getVisitById', () => {
    it('should find visit by ID', () => {
      const result = getVisitById(visits, '2');
      expect(result?.nom).toBe('Bob');
    });

    it('should return undefined for unknown ID', () => {
      const result = getVisitById(visits, 'unknown');
      expect(result).toBeUndefined();
    });
  });

  describe('getVisitsBySpeakerId', () => {
    it('should find all visits for speaker', () => {
      const visitsWithSameSpeaker = [
        ...visits,
        createMockVisit({ visitId: '5', id: 'speaker-1', nom: 'Jean Dupont', visitDate: '2026-04-01' }),
      ];
      const result = getVisitsBySpeakerId(visitsWithSameSpeaker, 'speaker-1');
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });
});

// ============================================================================
// CONFLICT DETECTION TESTS
// ============================================================================

describe('Conflict Detection', () => {
  let existingVisits: Visit[];

  beforeEach(() => {
    existingVisits = [
      createMockVisit({ visitId: '1', visitDate: '2026-02-15', id: 'speaker-1' }),
      createMockVisit({ visitId: '2', visitDate: '2026-03-15', id: 'speaker-2' }),
    ];
  });

  describe('detectConflicts', () => {
    it('should detect same date conflict', () => {
      const newVisit = { visitDate: '2026-02-15', visitId: 'new' };
      const conflicts = detectConflicts(newVisit, existingVisits);

      expect(conflicts.some(c => c.type === 'same_date')).toBe(true);
    });

    it('should not flag same visit as conflict', () => {
      const newVisit = { visitDate: '2026-02-15', visitId: '1' };
      const conflicts = detectConflicts(newVisit, existingVisits);

      expect(conflicts.filter(c => c.type === 'same_date')).toHaveLength(0);
    });

    it('should detect same speaker in close timeframe', () => {
      const newVisit = { visitDate: '2026-02-20', visitId: 'new', id: 'speaker-1' };
      const conflicts = detectConflicts(newVisit, existingVisits);

      expect(conflicts.some(c => c.type === 'same_speaker')).toBe(true);
    });

    it('should not flag speaker with distant visits', () => {
      const newVisit = { visitDate: '2026-06-15', visitId: 'new', id: 'speaker-1' };
      const conflicts = detectConflicts(newVisit, existingVisits);

      expect(conflicts.filter(c => c.type === 'same_speaker')).toHaveLength(0);
    });

    it('should detect special event conflict', () => {
      const specialDates = [
        { date: '2026-02-28', name: 'Assemblée de Circonscription', type: 'assembly' },
      ];
      const newVisit = { visitDate: '2026-02-28', visitId: 'new' };
      const conflicts = detectConflicts(newVisit, existingVisits, specialDates);

      expect(conflicts.some(c => c.type === 'special_event')).toBe(true);
      expect(conflicts.find(c => c.type === 'special_event')?.specialEventName).toBe('Assemblée de Circonscription');
    });

    it('should return empty array when no conflicts', () => {
      const newVisit = { visitDate: '2026-04-15', visitId: 'new', id: 'speaker-new' };
      const conflicts = detectConflicts(newVisit, existingVisits);

      expect(conflicts).toHaveLength(0);
    });

    it('should handle missing visitDate', () => {
      const newVisit = { visitId: 'new' };
      const conflicts = detectConflicts(newVisit, existingVisits);

      expect(conflicts).toHaveLength(0);
    });
  });
});
