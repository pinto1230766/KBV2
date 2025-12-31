/**
 * Configuration de test Vitest pour KBV Lyon
 * Setup global pour tous les tests
 */
/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

// Déclaration des types manquants
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
    IntersectionObserver: typeof IntersectionObserver;
  }
}

// Mock des APIs navigateur non disponibles dans jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// Mock de navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  value: () => true,
  writable: true,
});

// Mock de Notification API
class MockNotification {
  static permission: NotificationPermission = 'granted';
  static requestPermission = async () => 'granted' as NotificationPermission;

  constructor(
    public title: string,
    public options?: NotificationOptions
  ) {}
}

Object.defineProperty(window, 'Notification', {
  value: MockNotification,
  writable: true,
});

// Mock de crypto.subtle pour les tests
const mockCrypto = {
  subtle: {
    encrypt: async () => new ArrayBuffer(16),
    decrypt: async () => new TextEncoder().encode('{}'),
    importKey: async () => ({}) as CryptoKey,
    deriveKey: async () => ({}) as CryptoKey,
    digest: async () => new ArrayBuffer(32),
  },
  getRandomValues: <T extends ArrayBufferView>(array: T): T => {
    const bytes = new Uint8Array(array.buffer);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return array;
  },
};

Object.defineProperty(window, 'crypto', {
  value: mockCrypto,
  writable: true,
});

// Reset des mocks après chaque test
// afterEach(() => {
//   localStorageMock.clear();
// });

// Mock global pour ResizeObserver
class MockResizeObserver {
  constructor(public callback: ResizeObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock global pour IntersectionObserver
class MockIntersectionObserver {
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Assigner les mocks aux objets globaux
window.ResizeObserver = MockResizeObserver as any;
window.IntersectionObserver = MockIntersectionObserver as any;

// Console silencieuse pour les tests (optionnel)
// Décommenter pour masquer les logs pendant les tests
// console.log = () => {};
// console.warn = () => {};
// console.error = () => {};
