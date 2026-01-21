import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as storage from './storage';
import { Preferences } from '@capacitor/preferences';

// Mock Capacitor Preferences
vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    keys: vi.fn(),
  },
}));

// Mock Capacitor Core
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(() => true), // Default to native for these tests
  },
}));

// Mock idb (no direct import required in this test file)
vi.mock('./idb', () => ({
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  clear: vi.fn(),
  keys: vi.fn(),
  exportAll: vi.fn(),
  importAll: vi.fn(),
}));

describe('Storage Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Native Platform (Capacitor Preferences)', () => {
    it('should get value from Preferences', async () => {
      const mockValue = { test: 'data' };
      vi.mocked(Preferences.get).mockResolvedValue({ value: JSON.stringify(mockValue) });

      const result = await storage.get('test-key');
      expect(Preferences.get).toHaveBeenCalledWith({ key: 'test-key' });
      expect(result).toEqual(mockValue);
    });

    it('should return undefined if key does not exist', async () => {
      vi.mocked(Preferences.get).mockResolvedValue({ value: null });

      const result = await storage.get('non-existent');
      expect(result).toBeUndefined();
    });

    it('should set value to Preferences', async () => {
      const mockValue = { test: 'data' };
      await storage.set('test-key', mockValue);

      expect(Preferences.set).toHaveBeenCalledWith({
        key: 'test-key',
        value: JSON.stringify(mockValue),
      });
    });

    it('should remove value from Preferences', async () => {
      await storage.del('test-key');
      expect(Preferences.remove).toHaveBeenCalledWith({ key: 'test-key' });
    });

    it('should clear Preferences', async () => {
      await storage.clear();
      expect(Preferences.clear).toHaveBeenCalled();
    });

    it('should get keys from Preferences', async () => {
      const mockKeys = ['key1', 'key2'];
      vi.mocked(Preferences.keys).mockResolvedValue({ keys: mockKeys });

      const result = await storage.keys();
      expect(Preferences.keys).toHaveBeenCalled();
      expect(result).toEqual(mockKeys);
    });
  });

  // Note: Testing the "Web" path (isNativePlatform = false) requires changing the mock of Capacitor.isNativePlatform
  // which might be tricky if it's a top-level mock. 
  // For now, we focus on the native path as it seems to be the default in the test environment based on logs.
});
