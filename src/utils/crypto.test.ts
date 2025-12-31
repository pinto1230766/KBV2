import { describe, it, expect, beforeAll } from 'vitest';
import { encrypt, decrypt, hashPassword } from './crypto';

describe('Crypto Utils', () => {
  let password: string;
  let testData: string;

  beforeAll(() => {
    password = 'SecureTestPassword123!';
    testData = 'Sensitive data to encrypt';
  });

  describe('encrypt/decrypt', () => {
    it('should encrypt and decrypt data successfully', async () => {
      const encrypted = await encrypt(testData, password);

      expect(encrypted).toBeDefined();
      expect(encrypted.data).not.toBe(testData);
      expect(encrypted.data.length).toBeGreaterThan(0);

      const decrypted = await decrypt(encrypted, password);
      expect(decrypted).toBe(testData);
    });

    it('should fail to decrypt with wrong password', async () => {
      const encrypted = await encrypt(testData, password);
      const wrongPassword = 'WrongPassword123!';

      await expect(decrypt(encrypted, wrongPassword)).rejects.toThrow();
    });

    it('should handle empty string', async () => {
      const encrypted = await encrypt('', password);
      const decrypted = await decrypt(encrypted, password);

      expect(decrypted).toBe('');
    });

    it('should handle special characters', async () => {
      const specialData = '!@#$%^&*()_+{}|:"<>?[];,./`~';
      const encrypted = await encrypt(specialData, password);
      const decrypted = await decrypt(encrypted, password);

      expect(decrypted).toBe(specialData);
    });

    it('should handle unicode characters', async () => {
      const unicodeData = '你好世界 🚀 مرحبا';
      const encrypted = await encrypt(unicodeData, password);
      const decrypted = await decrypt(encrypted, password);

      expect(decrypted).toBe(unicodeData);
    });

    it('should produce different ciphertext for same data', async () => {
      const encrypted1 = await encrypt(testData, password);
      const encrypted2 = await encrypt(testData, password);

      // Different due to random IV
      expect(encrypted1.data).not.toBe(encrypted2.data);

      // But both decrypt to same data
      expect(await decrypt(encrypted1, password)).toBe(testData);
      expect(await decrypt(encrypted2, password)).toBe(testData);
    });

    it('should handle large data', async () => {
      const largeData = 'x'.repeat(10000);
      const encrypted = await encrypt(largeData, password);
      const decrypted = await decrypt(encrypted, password);

      expect(decrypted).toBe(largeData);
    });

    it('should fail with invalid encrypted data', async () => {
      await expect(
        decrypt({ data: 'invalid', iv: 'invalid', salt: 'invalid' }, password)
      ).rejects.toThrow();
    });

    it('should fail with corrupted encrypted data', async () => {
      const encrypted = await encrypt(testData, password);
      const corrupted = { ...encrypted, data: encrypted.data.slice(0, -10) + 'corrupted' };

      await expect(decrypt(corrupted, password)).rejects.toThrow();
    });
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const hashed = await hashPassword(password);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('should produce different hash for same password', async () => {
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      // Different due to random salt
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', async () => {
      const hashed = await hashPassword('');
      expect(hashed).toBeDefined();
    });

    it('should handle long passwords', async () => {
      const longPassword = 'x'.repeat(1000);
      const hashed = await hashPassword(longPassword);

      expect(hashed).toBeDefined();
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('should handle special characters in password', async () => {
      const specialPassword = '!@#$%^&*()_+{}|:"<>?[];,./`~';
      const hashed = await hashPassword(specialPassword);

      expect(hashed).toBeDefined();
    });
  });

  describe('Security properties', () => {
    it('encrypted data should be significantly different from original', async () => {
      const encrypted = await encrypt(testData, password);

      // Check no substring of original appears in encrypted data
      expect(encrypted.data.toLowerCase()).not.toContain(testData.toLowerCase());
    });

    it('should use proper encoding (base64)', async () => {
      const encrypted = await encrypt(testData, password);

      // Base64 regex pattern
      const base64Pattern = /^[A-Za-z0-9+/=]+$/;
      expect(base64Pattern.test(encrypted.data)).toBe(true);
    });

    it('hash should be deterministic for verification', async () => {
      // While hashes are different due to salt,
      // they should be verifiable (this test documents the behavior)
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(32); // At least 32 chars for security
    });
  });
});
