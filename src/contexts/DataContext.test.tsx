/**
 * Tests unitaires - DataContext
 * Couvre: CRUD operations, state management, WhatsApp auto-action integration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { DataProvider, useData } from './DataContext';
import { ToastProvider } from './ToastContext';
import { Visit, Speaker, Host } from '@/types';

// ============================================================================
// MOCKS
// ============================================================================

// Mock storage
vi.mock('@/utils/storage', () => ({
  loadData: vi.fn(() => null),
  saveData: vi.fn(),
  loadSyncQueue: vi.fn(() => []),
  saveSyncQueue: vi.fn(),
}));

// Mock completeData
vi.mock('@/data/completeData', () => ({
  completeData: {
    speakers: [],
    hosts: [],
    visits: [],
    archivedVisits: [],
    specialDates: [],
    congregationProfile: {
      name: 'Test Congregation',
      meetingTime: '14:30',
    },
    customTemplates: [],
    customHostRequestTemplates: [],
    savedViews: [],
    dataVersion: '1.0.0',
  },
}));

// Mock googleSheetSync
vi.mock('@/utils/googleSheetSync', () => ({
  processSheetRows: vi.fn(() => []),
  mergeVisitsIdempotent: vi.fn((current: Visit[]) => ({ mergedVisits: current, stats: { added: 0, updated: 0, deleted: 0 } })),
  backfillExternalIds: vi.fn((visits: Visit[]) => visits),
}));

// Mock visits module
vi.mock('@/data/modules/visits', () => ({
  checkMessageResendStatus: vi.fn(() => ({
    needsResend: false,
    messageTypes: [],
    reason: '',
    changes: [],
  })),
}));

// ============================================================================
// TEST WRAPPER
// ============================================================================

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>
    <DataProvider>{children}</DataProvider>
  </ToastProvider>
);

// ============================================================================
// FIXTURES
// ============================================================================

const createMockSpeaker = (overrides: Partial<Speaker> = {}): Speaker => ({
  id: `speaker-${Date.now()}`,
  nom: 'Jean Dupont',
  congregation: 'Lyon Centre',
  telephone: '0600000000',
  gender: 'male',
  talkHistory: [],
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const createMockVisit = (overrides: Partial<Visit> = {}): Visit => ({
  id: 'speaker-1',
  visitId: `visit-${Date.now()}`,
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const createMockHost = (overrides: Partial<Host> = {}): Host => ({
  nom: `Host-${Date.now()}`,
  telephone: '0611111111',
  gender: 'male',
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// ============================================================================
// SPEAKER CRUD TESTS
// ============================================================================

describe('DataContext - Speaker CRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should provide initial empty speakers array', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    await waitFor(() => {
      expect(result.current.speakers).toBeDefined();
      expect(Array.isArray(result.current.speakers)).toBe(true);
    });
  });

  it('should add a new speaker', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    const newSpeaker = createMockSpeaker({ id: 'new-speaker-1', nom: 'Marie Martin' });

    await act(async () => {
      result.current.addSpeaker(newSpeaker);
    });

    await waitFor(() => {
      expect(result.current.speakers.some(s => s.id === 'new-speaker-1')).toBe(true);
    });
  });

  it('should update an existing speaker', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    const speaker = createMockSpeaker({ id: 'update-test-1', nom: 'Original Name' });

    await act(async () => {
      result.current.addSpeaker(speaker);
    });

    await act(async () => {
      result.current.updateSpeaker({ ...speaker, nom: 'Updated Name' });
    });

    await waitFor(() => {
      const updated = result.current.speakers.find(s => s.id === 'update-test-1');
      expect(updated?.nom).toBe('Updated Name');
    });
  });

  it('should delete a speaker', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    const speaker = createMockSpeaker({ id: 'delete-test-1' });

    await act(async () => {
      result.current.addSpeaker(speaker);
    });

    await act(async () => {
      result.current.deleteSpeaker('delete-test-1');
    });

    await waitFor(() => {
      expect(result.current.speakers.some(s => s.id === 'delete-test-1')).toBe(false);
    });
  });
});

// ============================================================================
// VISIT CRUD TESTS
// ============================================================================

describe('DataContext - Visit CRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add a new visit', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    const newVisit = createMockVisit({ visitId: 'new-visit-1' });

    await act(async () => {
      result.current.addVisit(newVisit);
    });

    await waitFor(() => {
      expect(result.current.visits.some(v => v.visitId === 'new-visit-1')).toBe(true);
    });
  });

  it('should update an existing visit', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    const visit = createMockVisit({ visitId: 'update-visit-1', host: 'Original Host' });

    await act(async () => {
      result.current.addVisit(visit);
    });

    await act(async () => {
      result.current.updateVisit({ ...visit, host: 'Updated Host' });
    });

    await waitFor(() => {
      const updated = result.current.visits.find(v => v.visitId === 'update-visit-1');
      expect(updated?.host).toBe('Updated Host');
    });
  });

  it('should delete a visit', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    const visit = createMockVisit({ visitId: 'delete-visit-1' });

    await act(async () => {
      result.current.addVisit(visit);
    });

    await act(async () => {
      result.current.deleteVisit('delete-visit-1');
    });

    await waitFor(() => {
      expect(result.current.visits.some(v => v.visitId === 'delete-visit-1')).toBe(false);
    });
  });
});

// ============================================================================
// HOST CRUD TESTS
// ============================================================================

describe('DataContext - Host CRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add a new host', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    const newHost = createMockHost({ nom: 'New Host Test' });

    await act(async () => {
      result.current.addHost(newHost);
    });

    await waitFor(() => {
      expect(result.current.hosts.some(h => h.nom === 'New Host Test')).toBe(true);
    });
  });

  it('should update an existing host', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    const host = createMockHost({ nom: 'Update Host Test' });

    await act(async () => {
      result.current.addHost(host);
    });

    await act(async () => {
      result.current.updateHost('Update Host Test', { telephone: '0699999999' });
    });

    await waitFor(() => {
      const updated = result.current.hosts.find(h => h.nom === 'Update Host Test');
      expect(updated?.telephone).toBe('0699999999');
    });
  });

  it('should delete a host', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    const host = createMockHost({ nom: 'Delete Host Test' });

    await act(async () => {
      result.current.addHost(host);
    });

    await act(async () => {
      result.current.deleteHost('Delete Host Test');
    });

    await waitFor(() => {
      expect(result.current.hosts.some(h => h.nom === 'Delete Host Test')).toBe(false);
    });
  });
});

// ============================================================================
// WHATSAPP AUTO-ACTION INTEGRATION TESTS
// ============================================================================

describe('DataContext - WhatsApp Auto-Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call checkMessageResendStatus when updating visit', async () => {
    const { checkMessageResendStatus } = await import('@/data/modules/visits');
    
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    const visit = createMockVisit({ visitId: 'whatsapp-test-1' });

    await act(async () => {
      result.current.addVisit(visit);
    });

    await act(async () => {
      result.current.updateVisit({ ...visit, visitDate: '2026-03-01' });
    });

    // The mock should have been called
    expect(checkMessageResendStatus).toHaveBeenCalled();
  });

  it('should mark visit for resend when critical fields change', async () => {
    const { checkMessageResendStatus } = await import('@/data/modules/visits');
    
    // Configure mock to return needsResend: true
    vi.mocked(checkMessageResendStatus).mockReturnValue({
      needsResend: true,
      messageTypes: ['confirmation', 'host_request'],
      reason: '📅 Date modifiée: 2026-02-15 → 2026-03-01',
      changes: [{ field: 'visitDate', oldValue: '2026-02-15', newValue: '2026-03-01', label: '📅 Date modifiée' }],
    });

    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    const visit = createMockVisit({ visitId: 'resend-test-1', visitDate: '2026-02-15' });

    await act(async () => {
      result.current.addVisit(visit);
    });

    await act(async () => {
      result.current.updateVisit({ ...visit, visitDate: '2026-03-01' });
    });

    await waitFor(() => {
      const updated = result.current.visits.find(v => v.visitId === 'resend-test-1');
      expect(updated?.messageResendStatus?.needsResend).toBe(true);
    });
  });
});

// ============================================================================
// DATA EXPORT/IMPORT TESTS
// ============================================================================

describe('DataContext - Export/Import', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export data as JSON string', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    await waitFor(() => {
      const exported = result.current.exportData();
      expect(typeof exported).toBe('string');
      
      const parsed = JSON.parse(exported);
      expect(parsed).toHaveProperty('speakers');
      expect(parsed).toHaveProperty('visits');
      expect(parsed).toHaveProperty('hosts');
    });
  });

  it('should import data from JSON string', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    const importData = JSON.stringify({
      speakers: [createMockSpeaker({ id: 'imported-speaker' })],
      visits: [createMockVisit({ visitId: 'imported-visit' })],
      hosts: [createMockHost({ nom: 'Imported Host' })],
      archivedVisits: [],
      specialDates: [],
      congregationProfile: { name: 'Imported Congregation' },
      customTemplates: [],
      customHostRequestTemplates: [],
      savedViews: [],
      dataVersion: '1.0.0',
    });

    await act(async () => {
      result.current.importData(importData);
    });

    await waitFor(() => {
      expect(result.current.speakers.some(s => s.id === 'imported-speaker')).toBe(true);
      expect(result.current.visits.some(v => v.visitId === 'imported-visit')).toBe(true);
    });
  });
});

// ============================================================================
// SPECIAL DATES TESTS
// ============================================================================

describe('DataContext - Special Dates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide specialDates array', async () => {
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper });

    await waitFor(() => {
      expect(result.current.specialDates).toBeDefined();
      expect(Array.isArray(result.current.specialDates)).toBe(true);
    });
  });
});
