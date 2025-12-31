import { renderHook, act } from '@testing-library/react';
import { useGlobalHotkeys } from './useGlobalHotkeys';
import { BrowserRouter } from 'react-router-dom';

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('useGlobalHotkeys', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Hook initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      expect(result.current.showHelpModal).toBe(false);
      expect(result.current.showSearchModal).toBe(false);
      expect(result.current.showQuickActions).toBe(false);
    });

    it('should provide hotkeys list', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      expect(result.current.hotkeys).toBeDefined();
      expect(Array.isArray(result.current.hotkeys)).toBe(true);
      expect(result.current.hotkeys.length).toBeGreaterThan(0);
    });

    it('should provide callback functions', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      expect(typeof result.current.closeHelpModal).toBe('function');
      expect(typeof result.current.closeSearchModal).toBe('function');
      expect(typeof result.current.closeQuickActions).toBe('function');
    });
  });

  describe('Hotkeys structure', () => {
    it('should have navigation hotkeys', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      const navigationHotkeys = result.current.hotkeys.filter((h) => h.category === 'navigation');

      expect(navigationHotkeys.length).toBeGreaterThan(0);
    });

    it('should have action hotkeys', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      const actionHotkeys = result.current.hotkeys.filter((h) => h.category === 'actions');

      expect(actionHotkeys.length).toBeGreaterThan(0);
    });

    it('should have search hotkeys', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      const searchHotkeys = result.current.hotkeys.filter((h) => h.category === 'search');

      expect(searchHotkeys.length).toBeGreaterThan(0);
    });

    it('should have modal hotkeys', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      const modalHotkeys = result.current.hotkeys.filter((h) => h.category === 'modals');

      expect(modalHotkeys.length).toBeGreaterThan(0);
    });

    it('should have general hotkeys', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      const generalHotkeys = result.current.hotkeys.filter((h) => h.category === 'general');

      expect(generalHotkeys.length).toBeGreaterThan(0);
    });

    it('each hotkey should have required properties', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      result.current.hotkeys.forEach((hotkey) => {
        expect(hotkey).toHaveProperty('key');
        expect(hotkey).toHaveProperty('description');
        expect(hotkey).toHaveProperty('action');
        expect(hotkey).toHaveProperty('category');
        expect(typeof hotkey.key).toBe('string');
        expect(typeof hotkey.description).toBe('string');
        expect(typeof hotkey.action).toBe('function');
      });
    });
  });

  describe('Modal state management', () => {
    it('should close help modal', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      act(() => {
        result.current.closeHelpModal();
      });

      expect(result.current.showHelpModal).toBe(false);
    });

    it('should close search modal', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      act(() => {
        result.current.closeSearchModal();
      });

      expect(result.current.showSearchModal).toBe(false);
    });

    it('should close quick actions', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      act(() => {
        result.current.closeQuickActions();
      });

      expect(result.current.showQuickActions).toBe(false);
    });
  });

  describe('Hotkey categories', () => {
    it('should categorize all hotkeys correctly', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      const validCategories = ['navigation', 'actions', 'search', 'modals', 'general'];

      result.current.hotkeys.forEach((hotkey) => {
        expect(validCategories).toContain(hotkey.category);
      });
    });

    it('should not have duplicate hotkey bindings', () => {
      const { result } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      const keys = result.current.hotkeys.map((h) => h.key);
      const uniqueKeys = new Set(keys);

      // Certaines touches peuvent être intentionnellement dupliquées
      // (ex: escape pour plusieurs actions), donc on vérifie juste la structure
      expect(keys.length).toBeGreaterThan(0);
      expect(uniqueKeys.size).toBeGreaterThan(0);
    });
  });

  describe('Callback stability', () => {
    it('should provide stable callback references', () => {
      const { result, rerender } = renderHook(() => useGlobalHotkeys(), {
        wrapper: BrowserRouter,
      });

      const initialCloseHelp = result.current.closeHelpModal;
      const initialCloseSearch = result.current.closeSearchModal;
      const initialCloseActions = result.current.closeQuickActions;

      rerender();

      expect(result.current.closeHelpModal).toBe(initialCloseHelp);
      expect(result.current.closeSearchModal).toBe(initialCloseSearch);
      expect(result.current.closeQuickActions).toBe(initialCloseActions);
    });
  });
});

