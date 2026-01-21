import { describe, it, expect } from 'vitest';
import { Visit } from '@/types';
import {
  getPrimaryHostName,
  hasHostAssigned,
  needsHost,
  getActiveHostsCount,
  filterVisitsNeedingHost,
  getAllHostsWithRoles,
} from './hostUtils';

// Mock data
const mockVisitWithMultipleHosts = {
  id: 'speaker1',
  visitId: 'visit1',
  nom: 'Jean Dupont',
  congregation: 'Paris',
  visitDate: '2024-12-25',
  visitTime: '14:30',
  locationType: 'physical' as const,
  status: 'confirmed' as const,
  talkNoOrType: '5',
  talkTheme: 'Theme 1',
  host: '',
  accommodation: '',
  meals: '',
  hostAssignments: [
    { id: '1', hostId: 'marie', hostName: 'Marie', role: 'accommodation' as const, createdAt: '2024-01-01T10:00:00Z' },
    { id: '2', hostId: 'paul', hostName: 'Paul', role: 'pickup' as const, createdAt: '2024-01-01T10:00:00Z' },
    { id: '3', hostId: 'sophie', hostName: 'Sophie', role: 'meals' as const, createdAt: '2024-01-01T10:00:00Z' },
  ],
} as Visit;

const mockVisitWithSingleHost = {
  id: 'speaker2',
  visitId: 'visit2',
  nom: 'Pierre Martin',
  congregation: 'Paris',
  visitDate: '2024-12-26',
  visitTime: '14:30',
  locationType: 'physical' as const,
  status: 'confirmed' as const,
  talkNoOrType: '10',
  talkTheme: 'Theme 2',
  host: 'Jacques',
  accommodation: '',
  meals: '',
} as Visit;

const mockVisitLyonSpeaker = {
  id: 'speaker3',
  visitId: 'visit3',
  nom: 'Luc Lyon',
  congregation: 'Lyon KBV',
  visitDate: '2024-12-27',
  visitTime: '14:30',
  locationType: 'physical' as const,
  status: 'confirmed' as const,
  talkNoOrType: '15',
  talkTheme: 'Theme 3',
  host: '',
  accommodation: '',
  meals: '',
} as Visit;

const mockVisitZoom = {
  id: 'speaker4',
  visitId: 'visit4',
  nom: 'Anne Zoom',
  congregation: 'Paris',
  visitDate: '2024-12-28',
  visitTime: '14:30',
  locationType: 'zoom' as const,
  status: 'confirmed' as const,
  talkNoOrType: '20',
  talkTheme: 'Theme 4',
  host: '',
  accommodation: '',
  meals: '',
} as Visit;

const mockVisitNoHost = {
  id: 'speaker5',
  visitId: 'visit5',
  nom: 'Marie NoHost',
  congregation: 'Paris',
  visitDate: '2024-12-29',
  visitTime: '14:30',
  locationType: 'physical' as const,
  status: 'pending' as const,
  talkNoOrType: '25',
  talkTheme: 'Theme 5',
  host: '',
  accommodation: '',
  meals: '',
} as Visit;

const mockVisits = [
  mockVisitWithMultipleHosts,
  mockVisitWithSingleHost,
  mockVisitLyonSpeaker,
  mockVisitZoom,
  mockVisitNoHost,
];

describe('hostUtils', () => {
  describe('getPrimaryHostName', () => {
    it('should return accommodation host for multiple hosts', () => {
      expect(getPrimaryHostName(mockVisitWithMultipleHosts)).toBe('Marie');
    });

    it('should return first host if no accommodation role', () => {
      const visitWithoutAccommodation = {
        ...mockVisitWithMultipleHosts,
        hostAssignments: [
          { id: '1', hostId: 'paul', hostName: 'Paul', role: 'pickup' as const, createdAt: '2024-01-01T10:00:00Z' },
        ],
      } as Visit;
      expect(getPrimaryHostName(visitWithoutAccommodation)).toBe('Paul');
    });

    it('should return legacy host field if no hostAssignments', () => {
      expect(getPrimaryHostName(mockVisitWithSingleHost)).toBe('Jacques');
    });

    it('should return empty string if no host data', () => {
      expect(getPrimaryHostName(mockVisitNoHost)).toBe('');
    });
  });

  describe('hasHostAssigned', () => {
    it('should return true for visit with multiple host assignments', () => {
      expect(hasHostAssigned(mockVisitWithMultipleHosts)).toBe(true);
    });

    it('should return true for visit with legacy host', () => {
      expect(hasHostAssigned(mockVisitWithSingleHost)).toBe(true);
    });

    it('should return false for visit without host', () => {
      expect(hasHostAssigned(mockVisitNoHost)).toBe(false);
    });

    it('should return false for invalid legacy host', () => {
      const visitWithInvalidHost = { ...mockVisitNoHost, host: 'À définir' };
      expect(hasHostAssigned(visitWithInvalidHost)).toBe(false);
    });
  });

  describe('needsHost', () => {
    it('should return false for Lyon speakers', () => {
      expect(needsHost(mockVisitLyonSpeaker)).toBe(false);
    });

    it('should return false for zoom visits', () => {
      expect(needsHost(mockVisitZoom)).toBe(false);
    });

    it('should return true for physical visits without host', () => {
      expect(needsHost(mockVisitNoHost)).toBe(true);
    });

    it('should return false for physical visits with host', () => {
      expect(needsHost(mockVisitWithSingleHost)).toBe(false);
    });
  });

  describe('getAllHostsWithRoles', () => {
    it('should return host assignments array', () => {
      const result = getAllHostsWithRoles(mockVisitWithMultipleHosts);
      expect(result).toHaveLength(3);
      expect(result[0].role).toBe('accommodation');
      expect(result[1].role).toBe('pickup');
      expect(result[2].role).toBe('meals');
    });

    it('should return empty array for visit without host assignments', () => {
      expect(getAllHostsWithRoles(mockVisitWithSingleHost)).toEqual([]);
    });
  });

  describe('filterVisitsNeedingHost', () => {
    it('should filter visits that need hosts', () => {
      const result = filterVisitsNeedingHost(mockVisits);
      expect(result).toHaveLength(1);
      expect(result[0].visitId).toBe('visit5');
    });
  });

  describe('getActiveHostsCount', () => {
    it('should count unique hosts from multiple assignments', () => {
      const count = getActiveHostsCount(mockVisits);
      expect(count).toBe(4); // Marie, Paul, Sophie, Jacques
    });

    it('should handle empty visits array', () => {
      expect(getActiveHostsCount([])).toBe(0);
    });

    it('should ignore invalid host names', () => {
      const visitsWithInvalidHosts = [
        { ...mockVisitNoHost, host: 'À définir' },
        { ...mockVisitNoHost, host: '' },
      ];
      expect(getActiveHostsCount(visitsWithInvalidHosts)).toBe(0);
    });
  });
});
