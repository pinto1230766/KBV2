import { ExpenseSchema, SpeakerSchema } from './validation';

describe('Zod Schemas', () => {
  describe('ExpenseSchema', () => {
    it('should validate valid expense', () => {
      const validExpense = {
        description: 'Test expense',
        amount: 100.5,
        category: 'Food',
        date: '2025-01-15',
      };

      const result = ExpenseSchema.safeParse(validExpense);
      expect(result.success).toBe(true);
    });

    it('should reject expense with negative amount', () => {
      const invalidExpense = {
        description: 'Test',
        amount: -10,
        date: '2025-01-15',
      };

      const result = ExpenseSchema.safeParse(invalidExpense);
      expect(result.success).toBe(false);
    });

    it('should reject expense with empty description', () => {
      const invalidExpense = {
        description: '',
        amount: 100,
        date: '2025-01-15',
      };

      const result = ExpenseSchema.safeParse(invalidExpense);
      expect(result.success).toBe(false);
    });

    it('should reject expense with amount exceeding max', () => {
      const invalidExpense = {
        description: 'Test',
        amount: 1000000,
        date: '2025-01-15',
      };

      const result = ExpenseSchema.safeParse(invalidExpense);
      expect(result.success).toBe(false);
    });

    it('should reject expense with invalid date', () => {
      const invalidExpense = {
        description: 'Test',
        amount: 100,
        date: 'invalid-date',
      };

      const result = ExpenseSchema.safeParse(invalidExpense);
      expect(result.success).toBe(false);
    });

    it('should trim description whitespace', () => {
      const expense = {
        description: '  Test expense  ',
        amount: 100,
        date: '2025-01-15',
      };

      const result = ExpenseSchema.parse(expense);
      expect(result.description).toBe('Test expense');
    });

    it('should accept optional fields', () => {
      const minimalExpense = {
        description: 'Test',
        amount: 100,
        date: '2025-01-15',
      };

      const result = ExpenseSchema.safeParse(minimalExpense);
      expect(result.success).toBe(true);
    });

    it('should validate receipt URL if provided', () => {
      const expenseWithReceipt = {
        description: 'Test',
        amount: 100,
        date: '2025-01-15',
        receiptUrl: 'https://example.com/receipt.pdf',
      };

      const result = ExpenseSchema.safeParse(expenseWithReceipt);
      expect(result.success).toBe(true);
    });

    it('should reject invalid receipt URL', () => {
      const expenseWithBadReceipt = {
        description: 'Test',
        amount: 100,
        date: '2025-01-15',
        receiptUrl: 'not-a-url',
      };

      const result = ExpenseSchema.safeParse(expenseWithBadReceipt);
      expect(result.success).toBe(false);
    });
  });

  describe('SpeakerSchema', () => {
    it('should validate valid speaker', () => {
      const validSpeaker = {
        nom: 'John Doe',
        email: 'john.doe@example.com',
      };

      const result = SpeakerSchema.safeParse(validSpeaker);
      expect(result.success).toBe(true);
    });

    it('should reject speaker with empty nom', () => {
      const invalidSpeaker = {
        nom: '',
        email: 'john@example.com',
      };

      const result = SpeakerSchema.safeParse(invalidSpeaker);
      expect(result.success).toBe(false);
    });

    it('should reject speaker with invalid email', () => {
      const invalidSpeaker = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'not-an-email',
      };

      const result = SpeakerSchema.safeParse(invalidSpeaker);
      expect(result.success).toBe(false);
    });

    it('should reject speaker with invalid phone format', () => {
      const invalidSpeaker = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: 'abc-def-ghij',
      };

      const result = SpeakerSchema.safeParse(invalidSpeaker);
      expect(result.success).toBe(false);
    });

    it('should accept valid phone formats', () => {
      const validPhones = ['+33612345678', '0612345678', '+1234567890'];

      validPhones.forEach((phone) => {
        const speaker = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone,
        };

        const result = SpeakerSchema.safeParse(speaker);
        expect(result.success).toBe(true);
      });
    });

    it('should trim name field `nom`', () => {
      const speaker = {
        nom: '  John Doe  ',
        email: 'john@example.com',
      };

      const result = SpeakerSchema.parse(speaker);
      expect(result.nom).toBe('John Doe');
    });

    it('should accept optional phone field', () => {
      const speaker = {
        nom: 'John Doe',
        email: 'john@example.com',
      };

      const result = SpeakerSchema.safeParse(speaker);
      expect(result.success).toBe(true);
    });

    it('should reject names exceeding max length', () => {
      const speaker = {
        nom: 'x'.repeat(100),
        email: 'john@example.com',
      };

      const result = SpeakerSchema.safeParse(speaker);
      expect(result.success).toBe(false);
    });

    it('should accept empty string for optional phone', () => {
      const speaker = {
        nom: 'John Doe',
        email: 'john@example.com',
        telephone: '',
      };

      const result = SpeakerSchema.safeParse(speaker);
      expect(result.success).toBe(true);
    });
  });

  describe('Schema edge cases', () => {
    it('should handle undefined optional fields', () => {
      const expense = {
        description: 'Test',
        amount: 100,
        date: '2025-01-15',
        category: undefined,
        receiptUrl: undefined,
      };

      const result = ExpenseSchema.safeParse(expense);
      expect(result.success).toBe(true);
    });

    it('should validate multiple schemas independently', () => {
      const expense = {
        description: 'Test',
        amount: 100,
        date: '2025-01-15',
      };

      const speaker = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      expect(ExpenseSchema.safeParse(expense).success).toBe(true);
      expect(SpeakerSchema.safeParse(speaker).success).toBe(true);
    });
  });
});
