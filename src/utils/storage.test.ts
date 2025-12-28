import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Storage Utils', () => {
  beforeEach(() => {
    // Clear storage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Basic Storage Operations', () => {
    it('should store and retrieve string data', () => {
      const key = 'testKey';
      const value = 'testValue';
      
      localStorage.setItem(key, value);
      const retrieved = localStorage.getItem(key);
      
      expect(retrieved).toBe(value);
    });

    it('should store and retrieve object data', () => {
      const key = 'testObject';
      const value = { name: 'Test', age: 25 };
      
      localStorage.setItem(key, JSON.stringify(value));
      const retrieved = JSON.parse(localStorage.getItem(key) || '{}');
      
      expect(retrieved).toEqual(value);
    });

    it('should return null for non-existent key', () => {
      const retrieved = localStorage.getItem('nonExistent');
      expect(retrieved).toBeNull();
    });

    it('should handle removal of items', () => {
      const key = 'toRemove';
      localStorage.setItem(key, 'value');
      
      expect(localStorage.getItem(key)).toBe('value');
      
      localStorage.removeItem(key);
      expect(localStorage.getItem(key)).toBeNull();
    });

    it('should clear all storage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.setItem('key3', 'value3');
      
      expect(localStorage.length).toBe(3);
      
      localStorage.clear();
      expect(localStorage.length).toBe(0);
    });
  });

  describe('Complex Data Types', () => {
    it('should handle arrays', () => {
      const key = 'testArray';
      const value = [1, 2, 3, 4, 5];
      
      localStorage.setItem(key, JSON.stringify(value));
      const retrieved = JSON.parse(localStorage.getItem(key) || '[]');
      
      expect(retrieved).toEqual(value);
    });

    it('should handle nested objects', () => {
      const key = 'nestedObject';
      const value = {
        user: {
          name: 'John',
          preferences: {
            theme: 'dark',
            language: 'fr',
          },
        },
      };
      
      localStorage.setItem(key, JSON.stringify(value));
      const retrieved = JSON.parse(localStorage.getItem(key) || '{}');
      
      expect(retrieved).toEqual(value);
    });

    it('should handle boolean values', () => {
      const key = 'boolValue';
      const value = true;
      
      localStorage.setItem(key, JSON.stringify(value));
      const retrieved = JSON.parse(localStorage.getItem(key) || 'false');
      
      expect(retrieved).toBe(value);
    });

    it('should handle number values', () => {
      const key = 'numberValue';
      const value = 42.5;
      
      localStorage.setItem(key, JSON.stringify(value));
      const retrieved = JSON.parse(localStorage.getItem(key) || '0');
      
      expect(retrieved).toBe(value);
    });

    it('should handle null values', () => {
      const key = 'nullValue';
      const value = null;
      
      localStorage.setItem(key, JSON.stringify(value));
      const retrieved = JSON.parse(localStorage.getItem(key) || 'null');
      
      expect(retrieved).toBe(value);
    });
  });

  describe('Error Handling', () => {
    it('should handle JSON parse errors gracefully', () => {
      const key = 'invalidJSON';
      localStorage.setItem(key, '{invalid json}');
      
      expect(() => {
        try {
          JSON.parse(localStorage.getItem(key) || '{}');
        } catch (e) {
          throw e;
        }
      }).toThrow();
    });

    it('should handle empty strings', () => {
      const key = 'emptyString';
      localStorage.setItem(key, '');
      
      const retrieved = localStorage.getItem(key);
      expect(retrieved).toBe('');
    });
  });

  describe('Storage Limits', () => {
    it('should handle reasonably sized data', () => {
      const key = 'largeData';
      const value = 'x'.repeat(1000); // 1KB
      
      localStorage.setItem(key, value);
      const retrieved = localStorage.getItem(key);
      
      expect(retrieved).toBe(value);
      expect(retrieved?.length).toBe(1000);
    });
  });

  describe('Key Management', () => {
    it('should handle special characters in keys', () => {
      const specialKeys = [
        'key-with-dash',
        'key_with_underscore',
        'key.with.dots',
        'key:with:colons',
      ];
      
      specialKeys.forEach(key => {
        localStorage.setItem(key, 'value');
        expect(localStorage.getItem(key)).toBe('value');
      });
    });

    it('should handle empty string as key', () => {
      localStorage.setItem('', 'emptyKey');
      expect(localStorage.getItem('')).toBe('emptyKey');
    });
  });

  describe('Data Persistence', () => {
    it('should maintain data across operations', () => {
      localStorage.setItem('persist1', 'value1');
      localStorage.setItem('persist2', 'value2');
      localStorage.setItem('persist3', 'value3');
      
      expect(localStorage.getItem('persist1')).toBe('value1');
      
      localStorage.setItem('persist4', 'value4');
      
      expect(localStorage.getItem('persist1')).toBe('value1');
      expect(localStorage.getItem('persist2')).toBe('value2');
      expect(localStorage.getItem('persist3')).toBe('value3');
      expect(localStorage.getItem('persist4')).toBe('value4');
    });
  });

  describe('SessionStorage vs LocalStorage', () => {
    it('should be independent storage spaces', () => {
      const key = 'sameKey';
      
      localStorage.setItem(key, 'local');
      sessionStorage.setItem(key, 'session');
      
      expect(localStorage.getItem(key)).toBe('local');
      expect(sessionStorage.getItem(key)).toBe('session');
    });

    it('should not share data between storages', () => {
      localStorage.setItem('localOnly', 'value');
      sessionStorage.setItem('sessionOnly', 'value');
      
      expect(sessionStorage.getItem('localOnly')).toBeNull();
      expect(localStorage.getItem('sessionOnly')).toBeNull();
    });
  });

  describe('Unicode and Special Characters', () => {
    it('should handle unicode characters', () => {
      const key = 'unicode';
      const value = '你好世界 🚀 مرحبا';
      
      localStorage.setItem(key, value);
      expect(localStorage.getItem(key)).toBe(value);
    });

    it('should handle emoji', () => {
      const key = 'emoji';
      const value = '😀😃😄😁🎉🎊';
      
      localStorage.setItem(key, value);
      expect(localStorage.getItem(key)).toBe(value);
    });
  });
});