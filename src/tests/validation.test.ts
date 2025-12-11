/**
 * Tests unitaires pour le système de validation
 * KBV Lyon - Vitest
 */

import { describe, it, expect } from 'vitest';
import { 
  sanitizeInput, 
  sanitizeFormData,
  isValidEmail,
  isValidPhone,
  isValidDate
} from '@/utils/validation';

describe('Validation Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove HTML tags from input', () => {
      const input = '<script>alert("xss")</script>Hello';
      const result = sanitizeInput(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('Hello');
    });

    it('should remove javascript: protocol', () => {
      const input = 'javascript:alert("xss")';
      const result = sanitizeInput(input);
      expect(result).not.toContain('javascript:');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const result = sanitizeInput(input);
      expect(result).toBe('Hello World');
    });
  });

  describe('sanitizeFormData', () => {
    it('should sanitize all string fields in an object', () => {
      const data = {
        name: '<b>John</b>',
        email: 'john@example.com',
        age: 25,
        active: true
      };
      
      const result = sanitizeFormData(data);
      expect(result.name).not.toContain('<b>');
      expect(result.email).toBe('john@example.com');
      expect(result.age).toBe(25);
      expect(result.active).toBe(true);
    });

    it('should handle nested objects', () => {
      const data = {
        user: {
          name: '<script>bad</script>Test',
          email: 'test@test.com'
        }
      };
      
      const result = sanitizeFormData(data);
      expect(result.user.name).not.toContain('<script>');
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('spaces in@email.com')).toBe(false);
    });
  });

  describe('Phone Validation', () => {
    it('should validate French phone numbers', () => {
      expect(isValidPhone('0612345678')).toBe(true);
      expect(isValidPhone('06 12 34 56 78')).toBe(true);
      expect(isValidPhone('+33612345678')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abcdefghij')).toBe(false);
    });
  });

  describe('Date Validation', () => {
    it('should validate correct date formats', () => {
      expect(isValidDate('2024-01-15')).toBe(true);
      expect(isValidDate('2024-12-31')).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate('2024-13-01')).toBe(false);
      expect(isValidDate('2024-02-30')).toBe(false);
    });
  });
});
