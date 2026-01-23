/**
 * Tests unitaires - Cloud Sync Module
 * Couvre: fusion intelligente, préservation notes locales, validation
 */
import { describe, it, expect } from 'vitest';
import {
  mergeVisitsIntelligent,
  mergeSpeakersIntelligent,
  mergeHostsIntelligent,
  formatSyncSummary,
  validateSyncData,
} from './cloudSync';
import { Visit, Speaker, Host } from '@/types';

// ============================================================================
// FIXTURES
// ============================================================================

const createMockVisit = (overrides: Partial<Visit> = {}): Visit => ({
  id: 'speaker-1',
  visitId: 'visit-1',
  externalId: 'ext-1',
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
  notes: '',
  createdAt: '2026-01-01T10:00:00Z',
  updatedAt: '2026-01-01T10:00:00Z',
  ...overrides,
});

const createMockSpeaker = (overrides: Partial<Speaker> = {}): Speaker => ({
  id: 'speaker-1',
  nom: 'Jean Dupont',
  congregation: 'Lyon Centre',
  telephone: '0600000000',
  gender: 'male',
  talkHistory: [],
  tags: ['actif'],
  notes: '',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

const createMockHost = (overrides: Partial<Host> = {}): Host => ({
  nom: 'Pierre Martin',
  telephone: '0611111111',
  gender: 'male',
  tags: ['repas'],
  notes: '',
  unavailableDates: [],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

// ============================================================================
// mergeVisitsIntelligent TESTS
// ============================================================================

describe('Intelligent Visit Merging', () => {
  describe('mergeVisitsIntelligent', () => {
    it('should add new visits from remote', () => {
      const local: Visit[] = [createMockVisit({ visitId: '1', externalId: 'ext-1' })];
      const remote: Visit[] = [createMockVisit({ visitId: '2', externalId: 'ext-2', nom: 'Marie Martin' })];

      const { merged, stats } = mergeVisitsIntelligent(local, remote);

      expect(merged).toHaveLength(2);
      expect(stats.visitsAdded).toBe(1);
    });

    it('should preserve local notes when merging', () => {
      const local: Visit[] = [
        createMockVisit({ visitId: '1', externalId: 'ext-1', notes: 'Important local note' }),
      ];
      const remote: Visit[] = [
        createMockVisit({ visitId: '1', externalId: 'ext-1', notes: '' }),
      ];

      const { merged } = mergeVisitsIntelligent(local, remote, { preserveLocalNotes: true });

      const mergedVisit = merged.find(v => v.externalId === 'ext-1');
      expect(mergedVisit?.notes).toBe('Important local note');
    });

    it('should merge conflicting notes', () => {
      const local: Visit[] = [
        createMockVisit({ visitId: '1', externalId: 'ext-1', notes: 'Local note' }),
      ];
      const remote: Visit[] = [
        createMockVisit({ visitId: '1', externalId: 'ext-1', notes: 'Remote note' }),
      ];

      const { merged, conflicts } = mergeVisitsIntelligent(local, remote, { preserveLocalNotes: true });

      const mergedVisit = merged.find(v => v.externalId === 'ext-1');
      expect(mergedVisit?.notes).toContain('Local note');
      expect(mergedVisit?.notes).toContain('Remote note');
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].field).toBe('notes');
    });

    it('should preserve local host assignments', () => {
      const local: Visit[] = [
        createMockVisit({
          visitId: '1',
          externalId: 'ext-1',
          host: 'Local Host',
          hostAssignments: [{ id: 'ha-1', hostId: 'h-1', hostName: 'Local Host', role: 'accommodation' }],
        }),
      ];
      const remote: Visit[] = [
        createMockVisit({ visitId: '1', externalId: 'ext-1', host: 'À définir' }),
      ];

      const { merged } = mergeVisitsIntelligent(local, remote, { preserveLocalHosts: true });

      const mergedVisit = merged.find(v => v.externalId === 'ext-1');
      expect(mergedVisit?.host).toBe('Local Host');
      expect(mergedVisit?.hostAssignments).toHaveLength(1);
    });

    it('should preserve local communication status', () => {
      const local: Visit[] = [
        createMockVisit({
          visitId: '1',
          externalId: 'ext-1',
          communicationStatus: { confirmation: { speaker: '2026-01-15T10:00:00Z' } },
        }),
      ];
      const remote: Visit[] = [
        createMockVisit({ visitId: '1', externalId: 'ext-1', communicationStatus: {} }),
      ];

      const { merged } = mergeVisitsIntelligent(local, remote, { preserveLocalCommunicationStatus: true });

      const mergedVisit = merged.find(v => v.externalId === 'ext-1');
      expect(mergedVisit?.communicationStatus?.confirmation?.speaker).toBeDefined();
    });

    it('should skip updates when onlyAddNew is true', () => {
      const local: Visit[] = [
        createMockVisit({ visitId: '1', externalId: 'ext-1', nom: 'Local Name' }),
      ];
      const remote: Visit[] = [
        createMockVisit({ visitId: '1', externalId: 'ext-1', nom: 'Remote Name' }),
      ];

      const { merged, stats } = mergeVisitsIntelligent(local, remote, { onlyAddNew: true });

      const mergedVisit = merged.find(v => v.externalId === 'ext-1');
      expect(mergedVisit?.nom).toBe('Local Name');
      expect(stats.visitsSkipped).toBe(1);
    });

    it('should keep local visitId when merging', () => {
      const local: Visit[] = [
        createMockVisit({ visitId: 'local-id', externalId: 'ext-1' }),
      ];
      const remote: Visit[] = [
        createMockVisit({ visitId: 'remote-id', externalId: 'ext-1' }),
      ];

      const { merged } = mergeVisitsIntelligent(local, remote);

      const mergedVisit = merged.find(v => v.externalId === 'ext-1');
      expect(mergedVisit?.visitId).toBe('local-id');
    });

    it('should match by date+nom when no externalId', () => {
      const local: Visit[] = [
        createMockVisit({ visitId: '1', externalId: undefined, nom: 'Jean', visitDate: '2026-02-15' }),
      ];
      const remote: Visit[] = [
        createMockVisit({ visitId: '2', externalId: undefined, nom: 'Jean', visitDate: '2026-02-15' }),
      ];

      const { stats } = mergeVisitsIntelligent(local, remote);

      expect(stats.visitsAdded).toBe(0);
      expect(stats.visitsUpdated).toBe(1);
    });
  });
});

// ============================================================================
// mergeSpeakersIntelligent TESTS
// ============================================================================

describe('Intelligent Speaker Merging', () => {
  describe('mergeSpeakersIntelligent', () => {
    it('should add new speakers', () => {
      const local: Speaker[] = [createMockSpeaker({ id: '1', nom: 'Jean' })];
      const remote: Speaker[] = [createMockSpeaker({ id: '2', nom: 'Marie' })];

      const { merged, stats } = mergeSpeakersIntelligent(local, remote);

      expect(merged).toHaveLength(2);
      expect(stats.speakersAdded).toBe(1);
    });

    it('should match speakers by name (case-insensitive)', () => {
      const local: Speaker[] = [createMockSpeaker({ id: '1', nom: 'JEAN DUPONT' })];
      const remote: Speaker[] = [createMockSpeaker({ id: '2', nom: 'jean dupont' })];

      const { stats } = mergeSpeakersIntelligent(local, remote);

      expect(stats.speakersAdded).toBe(0);
      expect(stats.speakersUpdated).toBe(1);
    });

    it('should preserve local notes', () => {
      const local: Speaker[] = [
        createMockSpeaker({ id: '1', nom: 'Jean', notes: 'Local speaker note' }),
      ];
      const remote: Speaker[] = [
        createMockSpeaker({ id: '2', nom: 'Jean', notes: '' }),
      ];

      const { merged } = mergeSpeakersIntelligent(local, remote, { preserveLocalNotes: true });

      expect(merged[0].notes).toBe('Local speaker note');
    });

    it('should merge talk history', () => {
      const local: Speaker[] = [
        createMockSpeaker({
          id: '1',
          nom: 'Jean',
          talkHistory: [{ visitId: 'v1', date: '2026-01-01', talkNo: '42', talkTheme: 'Test', locationType: 'physical' }],
        }),
      ];
      const remote: Speaker[] = [
        createMockSpeaker({
          id: '2',
          nom: 'Jean',
          talkHistory: [{ visitId: 'v2', date: '2026-02-01', talkNo: '51', talkTheme: 'Test 2', locationType: 'physical' }],
        }),
      ];

      const { merged } = mergeSpeakersIntelligent(local, remote);

      expect(merged[0].talkHistory).toHaveLength(2);
    });

    it('should merge tags without duplicates', () => {
      const local: Speaker[] = [
        createMockSpeaker({ id: '1', nom: 'Jean', tags: ['ancien', 'actif'] }),
      ];
      const remote: Speaker[] = [
        createMockSpeaker({ id: '2', nom: 'Jean', tags: ['actif', 'extérieur'] }),
      ];

      const { merged } = mergeSpeakersIntelligent(local, remote);

      expect(merged[0].tags).toContain('ancien');
      expect(merged[0].tags).toContain('actif');
      expect(merged[0].tags).toContain('extérieur');
      expect(merged[0].tags?.filter(t => t === 'actif')).toHaveLength(1);
    });

    it('should preserve local photo when remote has none', () => {
      const local: Speaker[] = [
        createMockSpeaker({ id: '1', nom: 'Jean', photoUrl: 'local-photo.jpg' }),
      ];
      const remote: Speaker[] = [
        createMockSpeaker({ id: '2', nom: 'Jean', photoUrl: undefined }),
      ];

      const { merged } = mergeSpeakersIntelligent(local, remote);

      expect(merged[0].photoUrl).toBe('local-photo.jpg');
    });

    it('should keep local ID when merging', () => {
      const local: Speaker[] = [createMockSpeaker({ id: 'local-id', nom: 'Jean' })];
      const remote: Speaker[] = [createMockSpeaker({ id: 'remote-id', nom: 'Jean' })];

      const { merged } = mergeSpeakersIntelligent(local, remote);

      expect(merged[0].id).toBe('local-id');
    });
  });
});

// ============================================================================
// mergeHostsIntelligent TESTS
// ============================================================================

describe('Intelligent Host Merging', () => {
  describe('mergeHostsIntelligent', () => {
    it('should add new hosts', () => {
      const local: Host[] = [createMockHost({ nom: 'Pierre' })];
      const remote: Host[] = [createMockHost({ nom: 'Marie' })];

      const { merged, stats } = mergeHostsIntelligent(local, remote);

      expect(merged).toHaveLength(2);
      expect(stats.hostsAdded).toBe(1);
    });

    it('should match hosts by name (case-insensitive)', () => {
      const local: Host[] = [createMockHost({ nom: 'PIERRE MARTIN' })];
      const remote: Host[] = [createMockHost({ nom: 'pierre martin' })];

      const { stats } = mergeHostsIntelligent(local, remote);

      expect(stats.hostsAdded).toBe(0);
      expect(stats.hostsUpdated).toBe(1);
    });

    it('should preserve local notes', () => {
      const local: Host[] = [createMockHost({ nom: 'Pierre', notes: 'Local host note' })];
      const remote: Host[] = [createMockHost({ nom: 'Pierre', notes: '' })];

      const { merged } = mergeHostsIntelligent(local, remote, { preserveLocalNotes: true });

      expect(merged[0].notes).toBe('Local host note');
    });

    it('should merge unavailable dates', () => {
      const local: Host[] = [
        createMockHost({ nom: 'Pierre', unavailableDates: ['2026-02-15', '2026-02-22'] }),
      ];
      const remote: Host[] = [
        createMockHost({ nom: 'Pierre', unavailableDates: ['2026-02-22', '2026-03-01'] }),
      ];

      const { merged } = mergeHostsIntelligent(local, remote);

      expect(merged[0].unavailableDates).toContain('2026-02-15');
      expect(merged[0].unavailableDates).toContain('2026-02-22');
      expect(merged[0].unavailableDates).toContain('2026-03-01');
      // Should be deduplicated
      expect(merged[0].unavailableDates?.filter(d => d === '2026-02-22')).toHaveLength(1);
    });

    it('should merge tags without duplicates', () => {
      const local: Host[] = [createMockHost({ nom: 'Pierre', tags: ['repas', 'hébergement'] })];
      const remote: Host[] = [createMockHost({ nom: 'Pierre', tags: ['repas', 'transport'] })];

      const { merged } = mergeHostsIntelligent(local, remote);

      expect(merged[0].tags).toContain('repas');
      expect(merged[0].tags).toContain('hébergement');
      expect(merged[0].tags).toContain('transport');
    });

    it('should preserve local address when remote has none', () => {
      const local: Host[] = [createMockHost({ nom: 'Pierre', address: '123 Rue Test' })];
      const remote: Host[] = [createMockHost({ nom: 'Pierre', address: undefined })];

      const { merged } = mergeHostsIntelligent(local, remote);

      expect(merged[0].address).toBe('123 Rue Test');
    });
  });
});

// ============================================================================
// UTILITY FUNCTIONS TESTS
// ============================================================================

describe('Sync Utilities', () => {
  describe('formatSyncSummary', () => {
    it('should format successful sync', () => {
      const result = {
        success: true,
        stats: { visitsAdded: 2, visitsUpdated: 1, visitsSkipped: 0, speakersAdded: 0, speakersUpdated: 0, hostsAdded: 1, hostsUpdated: 0 },
        conflicts: [],
        errors: [],
      };

      const summary = formatSyncSummary(result);

      expect(summary).toContain('✅ Synchronisation réussie');
      expect(summary).toContain('2 visite(s) ajoutée(s)');
      expect(summary).toContain('1 visite(s) mise(s) à jour');
      expect(summary).toContain('1 hôte(s) ajouté(s)');
    });

    it('should format sync with errors', () => {
      const result = {
        success: false,
        stats: { visitsAdded: 0, visitsUpdated: 0, visitsSkipped: 0, speakersAdded: 0, speakersUpdated: 0, hostsAdded: 0, hostsUpdated: 0 },
        conflicts: [],
        errors: ['Connection failed', 'Invalid data'],
      };

      const summary = formatSyncSummary(result);

      expect(summary).toContain('❌ Synchronisation avec erreurs');
      expect(summary).toContain('Connection failed');
      expect(summary).toContain('Invalid data');
    });

    it('should show conflict count', () => {
      const result = {
        success: true,
        stats: { visitsAdded: 1, visitsUpdated: 0, visitsSkipped: 0, speakersAdded: 0, speakersUpdated: 0, hostsAdded: 0, hostsUpdated: 0 },
        conflicts: [
          { type: 'visit' as const, localItem: {}, remoteItem: {}, field: 'notes', resolution: 'merge' as const },
        ],
        errors: [],
      };

      const summary = formatSyncSummary(result);

      expect(summary).toContain('1 conflit(s) résolu(s)');
    });
  });

  describe('validateSyncData', () => {
    it('should pass for valid data', () => {
      const data = {
        visits: [],
        speakers: [],
        hosts: [],
      };

      const { valid, errors } = validateSyncData(data);

      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('should fail for null data', () => {
      const { valid, errors } = validateSyncData(null);

      expect(valid).toBe(false);
      expect(errors).toContain('Données vides');
    });

    it('should fail for invalid visits format', () => {
      const data = {
        visits: 'not an array',
        speakers: [],
        hosts: [],
      };

      const { valid, errors } = validateSyncData(data);

      expect(valid).toBe(false);
      expect(errors).toContain('Format de visites invalide');
    });

    it('should fail for invalid speakers format', () => {
      const data = {
        visits: [],
        speakers: { not: 'array' },
        hosts: [],
      };

      const { valid, errors } = validateSyncData(data);

      expect(valid).toBe(false);
      expect(errors).toContain("Format d'orateurs invalide");
    });

    it('should fail for invalid hosts format', () => {
      const data = {
        visits: [],
        speakers: [],
        hosts: 'invalid',
      };

      const { valid, errors } = validateSyncData(data);

      expect(valid).toBe(false);
      expect(errors).toContain("Format d'hôtes invalide");
    });
  });
});
