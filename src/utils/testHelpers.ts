/**
 * Helpers de test simplifiés pour KBV Lyon
 * Fonctions utilitaires pour les tests sans dépendances externes
 */

// Types pour les tests
export interface TestResult {
  passed: boolean;
  message: string;
  expected?: any;
  actual?: any;
}

export interface TestSuite {
  name: string;
  tests: TestCase[];
}

export interface TestCase {
  name: string;
  fn: () => TestResult | Promise<TestResult>;
  skip?: boolean;
}

// Assertion helpers simples
export const expect = {
  toBe: (actual: any, expected: any): TestResult => ({
    passed: actual === expected,
    message:
      actual === expected
        ? `✅ PASS: ${actual} === ${expected}`
        : `❌ FAIL: Expected ${expected}, got ${actual}`,
    expected,
    actual,
  }),

  toEqual: (actual: any, expected: any): TestResult => {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    return {
      passed: actualStr === expectedStr,
      message:
        actualStr === expectedStr
          ? `✅ PASS: Objects are equal`
          : `❌ FAIL: Expected ${expectedStr}, got ${actualStr}`,
      expected,
      actual,
    };
  },

  toBeTruthy: (actual: any): TestResult => ({
    passed: Boolean(actual),
    message: actual
      ? `✅ PASS: ${actual} is truthy`
      : `❌ FAIL: Expected truthy value, got ${actual}`,
    expected: true,
    actual,
  }),

  toBeFalsy: (actual: any): TestResult => ({
    passed: !actual,
    message: !actual
      ? `✅ PASS: ${actual} is falsy`
      : `❌ FAIL: Expected falsy value, got ${actual}`,
    expected: false,
    actual,
  }),

  toThrow: (fn: () => any): TestResult => {
    try {
      fn();
      return {
        passed: false,
        message: '❌ FAIL: Expected function to throw',
        expected: 'Error to be thrown',
        actual: 'No error thrown',
      };
    } catch (error) {
      return {
        passed: true,
        message: `✅ PASS: Function threw error: ${error}`,
        expected: 'Error to be thrown',
        actual: error,
      };
    }
  },
};

// Test runner simple
export async function runTest(testCase: TestCase): Promise<TestResult> {
  if (testCase.skip) {
    return {
      passed: true,
      message: `⏭️ SKIP: ${testCase.name}`,
    };
  }

  try {
    const result = await testCase.fn();
    return result;
  } catch (error) {
    return {
      passed: false,
      message: `❌ ERROR: ${testCase.name} - ${error}`,
      actual: error,
    };
  }
}

export async function runTestSuite(testSuite: TestSuite): Promise<TestResult[]> {
  console.log(`\n🧪 Running test suite: ${testSuite.name}`);
  console.log('='.repeat(50));

  const results: TestResult[] = [];

  for (const testCase of testSuite.tests) {
    const result = await runTest(testCase);
    console.log(result.message);
    results.push(result);
  }

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const skipped = results.filter((r) => r.message.includes('SKIP')).length;

  console.log(`\n📊 Results: ${passed}/${total - skipped} passed, ${skipped} skipped`);

  return results;
}

// Données de test pour les entités
export const mockExpense = {
  id: '1',
  description: 'Test expense',
  amount: 100,
  category: 'Test Category',
  date: '2025-12-11',
  receiptUrl: '',
  createdAt: new Date('2025-12-11T00:00:00Z'),
  updatedAt: new Date('2025-12-11T00:00:00Z'),
};

export const mockSpeaker = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+33123456789',
  company: 'Test Company',
  bio: 'Test bio',
  tags: ['test'],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    website: 'https://johndoe.com',
  },
  createdAt: new Date('2025-12-11T00:00:00Z'),
  updatedAt: new Date('2025-12-11T00:00:00Z'),
};

export const mockHost = {
  id: '1',
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phone: '+33987654321',
  address: {
    street: '123 Test Street',
    city: 'Test City',
    postalCode: '12345',
    country: 'France',
  },
  capacity: 50,
  amenities: ['WiFi', 'Parking'],
  notes: 'Test notes',
  createdAt: new Date('2025-12-11T00:00:00Z'),
  updatedAt: new Date('2025-12-11T00:00:00Z'),
};

export const mockVisit = {
  id: '1',
  title: 'Test Visit',
  description: 'Test description',
  date: '2025-12-11',
  startTime: '09:00',
  endTime: '10:00',
  speakerId: '1',
  hostId: '1',
  status: 'scheduled' as const,
  notes: 'Test notes',
  createdAt: new Date('2025-12-11T00:00:00Z'),
  updatedAt: new Date('2025-12-11T00:00:00Z'),
};

export const mockMessage = {
  id: '1',
  recipientId: '1',
  subject: 'Test Subject',
  content: 'Test content',
  template: 'test',
  status: 'draft' as const,
  priority: 'normal' as const,
  scheduledAt: '2025-12-11T09:00:00Z',
  sentAt: new Date('2025-12-11T00:00:00Z'),
  createdAt: new Date('2025-12-11T00:00:00Z'),
  updatedAt: new Date('2025-12-11T00:00:00Z'),
};

// Utilitaires pour les tests de validation
export const testValidation = (schema: any, validData: any, invalidData: any): TestResult[] => {
  const results: TestResult[] = [];

  // Test avec des données valides
  try {
    schema.parse(validData);
    results.push({
      passed: true,
      message: '✅ PASS: Validation passed for valid data',
    });
  } catch (error) {
    results.push({
      passed: false,
      message: `❌ FAIL: Valid data should pass validation: ${error}`,
      actual: error,
    });
  }

  // Test avec des données invalides
  try {
    schema.parse(invalidData);
    results.push({
      passed: false,
      message: '❌ FAIL: Invalid data should not pass validation',
    });
  } catch (error) {
    results.push({
      passed: true,
      message: '✅ PASS: Invalid data correctly rejected',
    });
  }

  return results;
};

// Utilitaires pour les tests de performance simples
export const measureExecutionTime = async <T>(
  fn: () => T | Promise<T>
): Promise<{ result: T; time: number }> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  return {
    result,
    time: end - start,
  };
};

// Utilitaires pour les tests d'accessibilité basiques
export const testAccessibilityBasics = (element: HTMLElement): TestResult[] => {
  const results: TestResult[] = [];

  // Test des boutons
  const buttons = element.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const hasAriaLabel = button.hasAttribute('aria-label');
    const hasText = button.textContent && button.textContent.trim().length > 0;

    if (hasAriaLabel || hasText) {
      results.push({
        passed: true,
        message: `✅ PASS: Button ${index + 1} has proper labeling`,
      });
    } else {
      results.push({
        passed: false,
        message: `❌ FAIL: Button ${index + 1} lacks aria-label or text content`,
      });
    }
  });

  // Test des liens
  const links = element.querySelectorAll('a');
  links.forEach((link, index) => {
    const hasText = link.textContent && link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label');

    if (hasText || hasAriaLabel) {
      results.push({
        passed: true,
        message: `✅ PASS: Link ${index + 1} has proper labeling`,
      });
    } else {
      results.push({
        passed: false,
        message: `❌ FAIL: Link ${index + 1} lacks aria-label or text content`,
      });
    }
  });

  return results;
};

// Utilitaires pour les tests d'état (Zustand stores)
export const testStoreState = (
  store: any,
  initialState: any,
  actions: Array<{ name: string; action: () => void; expectedState: any }>
): TestResult[] => {
  const results: TestResult[] = [];

  // Test de l'état initial
  const initialResult = expect.toEqual(store.getState(), initialState);
  results.push(initialResult);

  // Test des actions
  actions.forEach(({ name, action, expectedState }) => {
    action();
    const result = expect.toEqual(store.getState(), expectedState);
    result.message = `${result.message} (${name})`;
    results.push(result);
  });

  return results;
};

// Utilitaires pour les tests de performance des composants
export const testRenderPerformance = async (
  renderFn: () => void | Promise<void>,
  maxTimeMs: number = 16
): Promise<TestResult> => {
  const start = performance.now();

  try {
    await renderFn();
    const end = performance.now();
    const renderTime = end - start;

    if (renderTime <= maxTimeMs) {
      return {
        passed: true,
        message: `✅ PASS: Render completed in ${renderTime.toFixed(2)}ms (under ${maxTimeMs}ms limit)`,
      };
    } else {
      return {
        passed: false,
        message: `❌ FAIL: Render took ${renderTime.toFixed(2)}ms (exceeded ${maxTimeMs}ms limit)`,
      };
    }
  } catch (error) {
    return {
      passed: false,
      message: `❌ ERROR: Render failed: ${error}`,
      actual: error,
    };
  }
};

// Mock simple pour les APIs externes
export const createApiMock = (endpoint: string, response: any, delay: number = 0) => ({
  fetch: async (url: string, _options?: any): Promise<any> => {
    if (url.includes(endpoint)) {
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      return {
        ok: true,
        status: 200,
        json: async () => response,
      };
    }
    throw new Error(`Mock API: Endpoint ${endpoint} not found`);
  },
});

// Utilitaires pour tester les hooks personnalisés
export const testCustomHook = <T>(hookFn: () => T, initialState?: any): TestResult[] => {
  const results: TestResult[] = [];

  try {
    // Simulation simple du hook (sans React Test Renderer)
    const state = hookFn();

    results.push({
      passed: true,
      message: `✅ PASS: Hook executed successfully`,
      actual: state,
    });

    if (initialState) {
      const stateTest = expect.toEqual(state, initialState);
      results.push(stateTest);
    }
  } catch (error) {
    results.push({
      passed: false,
      message: `❌ FAIL: Hook execution failed: ${error}`,
      actual: error,
    });
  }

  return results;
};

// Configuration pour les tests
export const testConfig = {
  timeout: 5000,
  maxRenderTime: 16,
  enablePerformanceTests: true,
  enableAccessibilityTests: true,
};

// Export par défaut avec toutes les fonctions
export default {
  expect,
  runTest,
  runTestSuite,
  testValidation,
  measureExecutionTime,
  testAccessibilityBasics,
  testStoreState,
  testRenderPerformance,
  testCustomHook,
  createApiMock,
  testConfig,
  mockExpense,
  mockSpeaker,
  mockHost,
  mockVisit,
  mockMessage,
};
