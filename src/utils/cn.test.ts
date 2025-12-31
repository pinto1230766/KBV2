import { cn } from './cn';

describe('cn utility', () => {
  describe('Basic functionality', () => {
    it('should combine class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('should handle single class name', () => {
      const result = cn('single-class');
      expect(result).toBe('single-class');
    });

    it('should handle empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle undefined values', () => {
      const result = cn('class1', undefined, 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).not.toContain('undefined');
    });

    it('should handle null values', () => {
      const result = cn('class1', null, 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('should handle false values', () => {
      const result = cn('class1', false, 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });
  });

  describe('Conditional classes', () => {
    it('should handle conditional class names', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toContain('base');
      expect(result).toContain('active');
    });

    it('should exclude false conditional classes', () => {
      const isActive = false;
      const result = cn('base', isActive && 'active');
      expect(result).toContain('base');
      expect(result).not.toContain('active');
    });

    it('should handle multiple conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn('base', isActive && 'active', isDisabled && 'disabled');
      expect(result).toContain('base');
      expect(result).toContain('active');
      expect(result).not.toContain('disabled');
    });
  });

  describe('Tailwind class merging', () => {
    it('should merge conflicting Tailwind classes', () => {
      const result = cn('p-4', 'p-6');
      // Le dernier padding devrait être pris en compte
      expect(result).toContain('p-6');
    });

    it('should handle color conflicts', () => {
      const result = cn('text-blue-500', 'text-red-500');
      // La dernière couleur devrait être prise en compte
      expect(result).toContain('text-red-500');
    });

    it('should preserve non-conflicting classes', () => {
      const result = cn('p-4', 'text-center', 'bg-blue-500');
      expect(result).toContain('p-4');
      expect(result).toContain('text-center');
      expect(result).toContain('bg-blue-500');
    });
  });

  describe('Complex scenarios', () => {
    it('should handle arrays of classes', () => {
      const classes = ['class1', 'class2', 'class3'];
      const result = cn(...classes);
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });

    it('should handle nested conditionals', () => {
      const isPrimary = true;
      const isLarge = false;
      const result = cn('btn', isPrimary && 'btn-primary', isLarge && 'btn-lg');
      expect(result).toContain('btn');
      expect(result).toContain('btn-primary');
      expect(result).not.toContain('btn-lg');
    });

    it('should handle object syntax', () => {
      const result = cn({
        class1: true,
        class2: false,
        class3: true,
      });
      expect(result).toContain('class1');
      expect(result).not.toContain('class2');
      expect(result).toContain('class3');
    });

    it('should trim whitespace', () => {
      const result = cn('  class1  ', '  class2  ');
      expect(result).not.toMatch(/^\s/);
      expect(result).not.toMatch(/\s$/);
    });

    it('should handle empty strings', () => {
      const result = cn('class1', '', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });
  });

  describe('Edge cases', () => {
    it('should handle very long class names', () => {
      const longClass = 'a'.repeat(1000);
      const result = cn(longClass);
      expect(result).toBe(longClass);
    });

    it('should handle special characters in class names', () => {
      const result = cn('class-with-dash', 'class_with_underscore');
      expect(result).toContain('class-with-dash');
      expect(result).toContain('class_with_underscore');
    });

    it('should handle numbers in class names', () => {
      const result = cn('p-4', 'text-2xl', 'gap-8');
      expect(result).toContain('p-4');
      expect(result).toContain('text-2xl');
      expect(result).toContain('gap-8');
    });

    it('should handle responsive classes', () => {
      const result = cn('sm:p-4', 'md:p-6', 'lg:p-8');
      expect(result).toContain('sm:p-4');
      expect(result).toContain('md:p-6');
      expect(result).toContain('lg:p-8');
    });

    it('should handle dark mode classes', () => {
      const result = cn('bg-white', 'dark:bg-gray-900');
      expect(result).toContain('bg-white');
      expect(result).toContain('dark:bg-gray-900');
    });

    it('should handle pseudo-class modifiers', () => {
      const result = cn('hover:bg-blue-500', 'focus:ring-2');
      expect(result).toContain('hover:bg-blue-500');
      expect(result).toContain('focus:ring-2');
    });
  });

  describe('Performance', () => {
    it('should handle many classes efficiently', () => {
      const classes = Array.from({ length: 100 }, (_, i) => `class${i}`);
      const result = cn(...classes);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle repeated calls', () => {
      for (let i = 0; i < 1000; i++) {
        const result = cn('class1', 'class2', 'class3');
        expect(result).toBeDefined();
      }
    });
  });
});

