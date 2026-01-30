/**
 * Configuration de test Vitest pour KBV Lyon
 * Setup global pour tous les tests
 */
/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Déclaration des types manquants
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
    IntersectionObserver: typeof IntersectionObserver;
  }
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Valeurs par défaut pour usePlatform en tests
(window as any).__TEST_PLATFORM_INFO__ = {
  platform: 'web',
  deviceType: 'desktop',
  screenSize: { width: 1280, height: 720 },
  orientation: 'landscape',
  isSamsung: false,
  hasSPen: false,
  isTabletS10Ultra: false,
  isPhoneS25Ultra: false,
};

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

// Mock IndexedDB minimal
class MockIDBRequest<T = unknown> {
  onsuccess: ((this: IDBRequest<T>, ev: Event) => any) | null = null;
  onerror: ((this: IDBRequest<T>, ev: Event) => any) | null = null;
  result: T | null = null;
  error: DOMException | null = null;
  readyState: IDBRequestReadyState = 'done';
  source: IDBObjectStore | IDBIndex | IDBCursor | null = null;
  transaction: IDBTransaction | null = null;

  constructor(result?: T) {
    this.result = result ?? null;
    queueMicrotask(() => {
      this.onsuccess?.call(this as unknown as IDBRequest<T>, new Event('success'));
    });
  }

  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
}

class MockIDBDatabase {
  createObjectStore() {
    return new MockObjectStore();
  }
  transaction() {
    return new MockTransaction();
  }
  close() {}
  addEventListener() {}
}

class MockObjectStore {
  get() {
    return new MockIDBRequest();
  }
  put() {
    return new MockIDBRequest();
  }
  delete() {
    return new MockIDBRequest();
  }
  index() {
    return new MockIndex();
  }
}

class MockTransaction {
  objectStore() {
    return new MockObjectStore();
  }
}

class MockIndex {
  getAll() {
    return new MockIDBRequest();
  }
}

class MockIDBOpenDBRequest<T = MockIDBDatabase> extends MockIDBRequest<T> {
  onblocked: ((this: IDBOpenDBRequest, ev: Event) => any) | null = null;
  onupgradeneeded: ((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any) | null = null;
  oldVersion = 1;
  newVersion: number | null = 1;
}

const mockIndexedDB = {
  open: () => {
    const request = new MockIDBOpenDBRequest(new MockIDBDatabase());
    return request as unknown as IDBOpenDBRequest;
  },
};

Object.defineProperty(window, 'indexedDB', {
  value: mockIndexedDB,
  writable: true,
});

(window as any).IDBRequest = MockIDBRequest;
(window as any).IDBOpenDBRequest = MockIDBOpenDBRequest;
(window as any).IDBDatabase = MockIDBDatabase;

// Mock URL.createObjectURL / revokeObjectURL pour les composants Upload
if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = vi.fn(() => 'blob:mock');
}

if (!window.URL.revokeObjectURL) {
  window.URL.revokeObjectURL = vi.fn();
}

// Mock scroll/animation helpers
window.scrollTo = vi.fn();
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 0);
}
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (id: number) => clearTimeout(id);
}

// Mock document.createRange pour les tests utilisant selection API
if (!document.createRange) {
  (document as any).createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: document.body,
    selectNodeContents: () => {},
  });
}

// Mock window.open pour éviter les ouvertures réelles
if (!window.open) {
  window.open = vi.fn();
}

// Mock navigator.clipboard si nécessaire
if (!navigator.clipboard) {
  (navigator as any).clipboard = {
    writeText: vi.fn(async () => {}),
    readText: vi.fn(async () => ''),
  };
}

const emptyDataTransferItemList = {
  add: () => null,
  clear: () => {},
  item: () => null,
  remove: () => {},
  length: 0,
  [Symbol.iterator]: function (): IterableIterator<DataTransferItem> {
    return ([] as DataTransferItem[])[Symbol.iterator]();
  },
} as unknown as DataTransferItemList;

// Mock DataTransfer utilisé dans les tests Drag & Drop
class MockDataTransfer implements DataTransfer {
  dropEffect: "none" | "copy" | "link" | "move" = 'none';
  effectAllowed: "none" | "copy" | "copyLink" | "copyMove" | "link" | "linkMove" | "move" | "all" | "uninitialized" = 'all';
  files: FileList = {
    length: 0,
    item: () => null,
    [Symbol.iterator]: function* () {},
  } as unknown as FileList;
  items: DataTransferItemList = emptyDataTransferItemList;
  types: string[] = [];
  getData: (format: string) => string = () => '';
  setData: (format: string, data: string) => void = () => {};
  clearData: (format?: string | undefined) => void = () => {};
  setDragImage: (image: Element, x: number, y: number) => void = () => {};
}

(window as any).MockDataTransfer = MockDataTransfer;

// Utilitaires globaux pour faciliter les tests (ex: FileUpload)
(globalThis as any).createFileList = (...files: File[]) => {
  return {
    length: files.length,
    item: (index: number) => files[index] ?? null,
    [Symbol.iterator]: function* () {
      for (const file of files) {
        yield file;
      }
    },
  } as FileList;
};

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
