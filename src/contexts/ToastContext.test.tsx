import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { ToastProvider, useToast } from './ToastContext';

// Composant de test
const TestComponent = () => {
  const { addToast } = useToast();

  return (
    <div>
      <button onClick={() => addToast('Success message', 'success', 3000)}>
        Show Success
      </button>
      <button onClick={() => addToast('Error message', 'error', 5000)}>
        Show Error
      </button>
      <button onClick={() => addToast('Warning message', 'warning', 4000)}>
        Show Warning
      </button>
      <button onClick={() => addToast('Info message', 'info', 3000)}>
        Show Info
      </button>
    </div>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  describe('ToastProvider', () => {
    it('should render children', () => {
      render(
        <ToastProvider>
          <div>Test Content</div>
        </ToastProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should provide toast context', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      expect(screen.getByText('Show Success')).toBeInTheDocument();
      expect(screen.getByText('Show Error')).toBeInTheDocument();
    });
  });

  describe('addToast function', () => {
    it('should add success toast', async () => {
      const { getByText } = render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        getByText('Show Success').click();
      });

      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
      });
    });

    it('should add error toast', async () => {
      const { getByText } = render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        getByText('Show Error').click();
      });

      await waitFor(() => {
        expect(screen.getByText('Error message')).toBeInTheDocument();
      });
    });

    it('should add warning toast', async () => {
      const { getByText } = render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        getByText('Show Warning').click();
      });

      await waitFor(() => {
        expect(screen.getByText('Warning message')).toBeInTheDocument();
      });
    });

    it('should add info toast', async () => {
      const { getByText } = render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        getByText('Show Info').click();
      });

      await waitFor(() => {
        expect(screen.getByText('Info message')).toBeInTheDocument();
      });
    });
  });

  describe('Toast behavior', () => {
    it('should auto-dismiss toast after duration', async () => {
      const { getByText } = render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        getByText('Show Success').click();
      });

      // Toast devrait être visible
      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
      });

      // Avancer le temps de 3 secondes
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Toast devrait disparaître
      await waitFor(() => {
        expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      });
    });

    it('should handle multiple toasts', async () => {
      const { getByText } = render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        getByText('Show Success').click();
        getByText('Show Error').click();
      });

      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
      });
    });
  });

  describe('Toast types', () => {
    it('should render different toast types correctly', async () => {
      const types = [
        { button: 'Show Success', message: 'Success message' },
        { button: 'Show Error', message: 'Error message' },
        { button: 'Show Warning', message: 'Warning message' },
        { button: 'Show Info', message: 'Info message' },
      ];

      const { getByText } = render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      for (const type of types) {
        act(() => {
          getByText(type.button).click();
        });

        await waitFor(() => {
          expect(screen.getByText(type.message)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Error handling', () => {
    it('should not crash with empty message', async () => {
      const TestEmptyMessage = () => {
        const { addToast } = useToast();
        return (
          <button onClick={() => addToast('', 'info', 1000)}>
            Empty Toast
          </button>
        );
      };

      const { getByText } = render(
        <ToastProvider>
          <TestEmptyMessage />
        </ToastProvider>
      );

      expect(() => {
        act(() => {
          getByText('Empty Toast').click();
        });
      }).not.toThrow();
    });

    it('should handle very long messages', async () => {
      const longMessage = 'x'.repeat(1000);
      const TestLongMessage = () => {
        const { addToast } = useToast();
        return (
          <button onClick={() => addToast(longMessage, 'info', 1000)}>
            Long Toast
          </button>
        );
      };

      const { getByText } = render(
        <ToastProvider>
          <TestLongMessage />
        </ToastProvider>
      );

      act(() => {
        getByText('Long Toast').click();
      });

      await waitFor(() => {
        expect(screen.getByText(longMessage)).toBeInTheDocument();
      });
    });
  });
});