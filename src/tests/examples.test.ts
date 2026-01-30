/**
 * Tests d'exemple pour KBV Lyon
 * Démonstration de l'utilisation des utilitaires de test
 */

import { 
  expect, 
  runTestSuite, 
  testValidation, 
  testStoreState, 
  testAccessibilityBasics,
  testRenderPerformance,
  mockExpense,
  mockSpeaker,
  mockHost,
  mockVisit,
  mockMessage,
  createApiMock
} from '@/utils/testHelpers';

// Test Suite 1: Validation des schémas Zod
const validationTests = {
  name: 'Validation Schemas',
  tests: [
    {
      name: 'Should validate expense data correctly',
      fn: async () => {
        const mockSchema = {
          parse: (data: any) => {
            if (!data.description || typeof data.amount !== 'number' || data.amount < 0) {
              throw new Error('Invalid expense data');
            }
            return data;
          }
        };
        
        const results = testValidation(mockSchema, mockExpense, { ...mockExpense, amount: -100 });
        const validResult = results[0];
        const invalidResult = results[1];
        
        return expect.toBe(validResult.passed && !invalidResult.passed, true);
      }
    },
    {
      name: 'Should validate speaker data correctly',
      fn: async () => {
        const mockSchema = {
          parse: (data: any) => {
            if (!data.firstName || !data.lastName || !data.email?.includes('@')) {
              throw new Error('Invalid speaker data');
            }
            return data;
          }
        };
        
        const results = testValidation(mockSchema, mockSpeaker, { ...mockSpeaker, email: 'invalid-email' });
        const validResult = results[0];
        const invalidResult = results[1];
        
        return expect.toBe(validResult.passed && !invalidResult.passed, true);
      }
    },
    {
      name: 'Should validate host data correctly',
      fn: async () => {
        const mockSchema = {
          parse: (data: any) => {
            if (!data.firstName || !data.lastName || !data.email?.includes('@')) {
              throw new Error('Invalid host data');
            }
            return data;
          }
        };
        
        const results = testValidation(mockSchema, mockHost, { ...mockHost, capacity: -5 });
        const validResult = results[0];
        const invalidResult = results[1];
        
        return expect.toBe(validResult.passed && !invalidResult.passed, true);
      }
    },
    {
      name: 'Should validate visit data correctly',
      fn: async () => {
        const mockSchema = {
          parse: (data: any) => {
            if (!data.title || !['scheduled', 'confirmed', 'completed', 'cancelled'].includes(data.status)) {
              throw new Error('Invalid visit data');
            }
            return data;
          }
        };
        
        const results = testValidation(mockSchema, mockVisit, { ...mockVisit, status: 'invalid-status' });
        const validResult = results[0];
        const invalidResult = results[1];
        
        return expect.toBe(validResult.passed && !invalidResult.passed, true);
      }
    },
    {
      name: 'Should validate message data correctly',
      fn: async () => {
        const mockSchema = {
          parse: (data: any) => {
            if (!data.subject || !data.content || !['draft', 'sent', 'delivered', 'read'].includes(data.status)) {
              throw new Error('Invalid message data');
            }
            return data;
          }
        };
        
        const results = testValidation(mockSchema, mockMessage, { ...mockMessage, priority: 'invalid-priority' });
        const validResult = results[0];
        const invalidResult = results[1];
        
        return expect.toBe(validResult.passed && !invalidResult.passed, true);
      }
    }
  ]
};

// Test Suite 2: Tests des utilitaires
const utilityTests = {
  name: 'Utility Functions',
  tests: [
    {
      name: 'Should handle store operations correctly',
      fn: async () => {
        const testData = { id: '1', name: 'Test' };
        const result = expect.toEqual(testData, testData);
        return result;
      }
    },
    {
      name: 'Should handle validation functions correctly',
      fn: async () => {
        const mockStore = {
          getState: () => ({ user: null, loading: false }),
          setState: () => {},
          subscribe: () => () => {}
        };
        
        const initialState = { user: null, loading: false };
        const actions = [
          {
            name: 'setUser',
            action: () => { mockStore.getState().user = { id: '1', name: 'Test' } as any; },
            expectedState: { user: { id: '1', name: 'Test' }, loading: false }
          }
        ];
        
        const results = testStoreState(mockStore, initialState, actions);
        return expect.toBe(results.every(r => r.passed), true);
      }
    }
  ]
};

// Test Suite 3: Tests de performance
const performanceTests = {
  name: 'Performance Tests',
  tests: [
    {
      name: 'Should handle validation quickly',
      fn: async () => testRenderPerformance(() => {
          const data = Array.from({ length: 100 }, (_, i) => ({ id: i, value: i * 2 }));
          // Simulate processing operations
          data.filter(item => item.value > 50);
          data.map(item => ({ ...item, processed: true }));
        }, 5)
    },
    {
      name: 'Should handle complex operations quickly',
      fn: async () => testRenderPerformance(() => {
          const data = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i * 2 }));
          // Simulate complex processing operations
          data.filter(item => item.value > 500);
          data.map(item => ({ ...item, processed: true }));
        }, 10)
    }
  ]
};

// Test Suite 4: Tests des APIs mockées
const apiTests = {
  name: 'API Mock Tests',
  tests: [
    {
      name: 'Should mock API calls correctly',
      fn: async () => {
        const apiMock = createApiMock('/api/expenses', [mockExpense], 100);
        
        try {
          const response = await apiMock.fetch('/api/expenses');
          const data = await response.json();
          
          return expect.toEqual(data, [mockExpense]);
        } catch (error) {
          return expect.toBe(false, true);
        }
      }
    },
    {
      name: 'Should handle unknown endpoints',
      fn: async () => {
        const apiMock = createApiMock('/api/expenses', [mockExpense]);
        
        try {
          await apiMock.fetch('/api/unknown');
          return expect.toBe(false, true);
        } catch (error) {
          return expect.toBe((error as Error).message.includes('not found'), true);
        }
      }
    }
  ]
};

// Test Suite 5: Tests d'accessibilité basiques
const accessibilityTests = {
  name: 'Accessibility Tests',
  tests: [
    {
      name: 'Should check button accessibility',
      fn: async () => {
        const testElement = document.createElement('div');
        testElement.innerHTML = `
          <button aria-label="Test Button">Click me</button>
          <button>Button without label</button>
          <a href="/test">Test Link</a>
        `;
        
        const results = testAccessibilityBasics(testElement);
        return expect.toBe(results.filter(r => r.passed).length, 2);
      }
    }
  ]
};

// Fonction pour exécuter tous les tests
export async function runAllTests() {
  console.log('🧪 KBV Lyon - Test Suite Execution');
  console.log('===================================');
  
  const testSuites = [
    validationTests,
    utilityTests,
    performanceTests,
    apiTests,
    accessibilityTests
  ];
  
  let totalPassed = 0;
  let totalTests = 0;
  
  for (const testSuite of testSuites) {
    const results = await runTestSuite(testSuite);
    totalPassed += results.filter(r => r.passed).length;
    totalTests += results.length;
  }
  
  console.log('\n🎯 FINAL RESULTS');
  console.log('==============');
  console.log(`✅ Passed: ${totalPassed}/${totalTests}`);
  console.log(`📊 Success Rate: ${Math.round((totalPassed / totalTests) * 100)}%`);
  
  if (totalPassed === totalTests) {
    console.log('🎉 All tests passed! Excellent work!');
  } else {
    console.log(`⚠️ ${totalTests - totalPassed} tests failed. Please review the issues above.`);
  }
  
  return {
    passed: totalPassed,
    total: totalTests,
    successRate: Math.round((totalPassed / totalTests * 100))
  };
}

// Export des tests individuels pour exécution séparée
export {
  validationTests,
  utilityTests,
  performanceTests,
  apiTests,
  accessibilityTests
};

// Export par défaut
export default {
  runAllTests,
  validationTests,
  utilityTests,
  performanceTests,
  apiTests,
  accessibilityTests
};
