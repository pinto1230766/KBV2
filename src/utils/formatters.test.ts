import { describe, it, expect } from 'vitest';

// Tests pour les fonctions de formatage communes
describe('Date Formatters', () => {
  const formatDate = (date: string | Date): string => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('fr-FR');
  };

  describe('formatDate', () => {
    it('should format valid ISO date', () => {
      const result = formatDate('2025-01-15');
      expect(result).toBe('15/01/2025');
    });

    it('should format Date object', () => {
      const date = new Date('2025-01-15');
      const result = formatDate(date);
      expect(result).toBe('15/01/2025');
    });

    it('should handle invalid date string', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('');
    });

    it('should handle empty string', () => {
      const result = formatDate('');
      expect(result).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(formatDate(null as any)).toBe('');
      expect(formatDate(undefined as any)).toBe('');
    });
  });
});

describe('Number Formatters', () => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatNumber = (num: number, decimals: number = 0): string => {
    return num.toFixed(decimals);
  };

  describe('formatCurrency', () => {
    it('should format positive amount', () => {
      const result = formatCurrency(100.5);
      expect(result).toContain('100');
      expect(result).toContain('€');
    });

    it('should format zero', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0');
      expect(result).toContain('€');
    });

    it('should format negative amount', () => {
      const result = formatCurrency(-50.25);
      expect(result).toContain('50');
      expect(result).toContain('€');
    });

    it('should format large numbers', () => {
      const result = formatCurrency(1000000);
      expect(result).toContain('1');
      expect(result).toContain('000');
      expect(result).toContain('€');
    });
  });

  describe('formatNumber', () => {
    it('should format integer', () => {
      expect(formatNumber(42)).toBe('42');
    });

    it('should format with decimals', () => {
      expect(formatNumber(42.567, 2)).toBe('42.57');
    });

    it('should round decimals', () => {
      expect(formatNumber(42.999, 1)).toBe('43.0');
    });

    it('should handle zero decimals', () => {
      expect(formatNumber(42.567, 0)).toBe('43');
    });
  });
});

describe('String Formatters', () => {
  const capitalize = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const truncate = (str: string, length: number): string => {
    if (!str || str.length <= length) return str;
    return str.slice(0, length) + '...';
  };

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should lowercase rest of string', () => {
      expect(capitalize('HELLO')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('truncate', () => {
    it('should truncate long string', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate short string', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('');
    });
  });
});

describe('Phone Formatters', () => {
  const formatPhone = (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    return phone;
  };

  describe('formatPhone', () => {
    it('should format French phone number', () => {
      expect(formatPhone('0612345678')).toBe('06 12 34 56 78');
    });

    it('should clean non-digits', () => {
      expect(formatPhone('06-12-34-56-78')).toBe('06 12 34 56 78');
    });

    it('should handle invalid format', () => {
      expect(formatPhone('123')).toBe('123');
    });

    it('should handle empty string', () => {
      expect(formatPhone('')).toBe('');
    });
  });
});

describe('Time Formatters', () => {
  const formatTime = (hours: number, minutes: number): string => {
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  describe('formatTime', () => {
    it('should format time with padding', () => {
      expect(formatTime(9, 5)).toBe('09:05');
    });

    it('should handle double digits', () => {
      expect(formatTime(14, 30)).toBe('14:30');
    });

    it('should handle midnight', () => {
      expect(formatTime(0, 0)).toBe('00:00');
    });

    it('should handle noon', () => {
      expect(formatTime(12, 0)).toBe('12:00');
    });
  });
});
