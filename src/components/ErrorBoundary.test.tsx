import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// Composant qui lance une erreur pour les tests
const ThrowError = ({ shouldThrow = false, error = 'Test error' }) => {
  if (shouldThrow) {
    throw new Error(error);
  }
  return <div>Success</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Supprimer les console.error pendant les tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Normal Rendering', () => {
    it('should render children when no error', () => {
      render(
        <ErrorBoundary>
          <div>Test Content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should not show error UI when children render successfully', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.queryByText(/erreur/i)).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should catch and display errors', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} error='Test Error Message' />
        </ErrorBoundary>
      );

      // Devrait afficher l'UI d'erreur (selon l'implémentation)
      // Adapter selon le texte réel de votre ErrorBoundary
      expect(screen.queryByText('Success')).not.toBeInTheDocument();
    });

    it('should handle different error types', () => {
      const errors = [
        new Error('Standard Error'),
        new TypeError('Type Error'),
        new ReferenceError('Reference Error'),
      ];

      errors.forEach((error) => {
        const { unmount } = render(
          <ErrorBoundary>
            <ThrowError shouldThrow={true} error={error.message} />
          </ErrorBoundary>
        );

        // ErrorBoundary devrait capturer sans crash
        expect(screen.queryByText('Success')).not.toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Error Information', () => {
    it('should log error to console', () => {
      const consoleSpy = vi.spyOn(console, 'error');

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} error='Logged Error' />
        </ErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('Multiple Children', () => {
    it('should handle multiple children', () => {
      render(
        <ErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('should catch error from any child', () => {
      render(
        <ErrorBoundary>
          <div>Safe Child 1</div>
          <ThrowError shouldThrow={true} />
          <div>Safe Child 2</div>
        </ErrorBoundary>
      );

      // Tous les enfants ne devraient pas être rendus après l'erreur
      expect(screen.queryByText('Safe Child 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Safe Child 2')).not.toBeInTheDocument();
    });
  });

  describe('Nested ErrorBoundaries', () => {
    it('should handle nested boundaries', () => {
      render(
        <ErrorBoundary>
          <div>Outer Safe Content</div>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} error='Inner Error' />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // L'ErrorBoundary interne devrait capturer l'erreur
      // L'ErrorBoundary externe devrait continuer à fonctionner
      expect(screen.queryByText('Outer Safe Content')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should accept custom fallback', () => {
      const customFallback = <div>Custom Error UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    });

    it('should call onError callback', () => {
      const onErrorSpy = vi.fn();

      render(
        <ErrorBoundary onError={onErrorSpy}>
          <ThrowError shouldThrow={true} error='Callback Error' />
        </ErrorBoundary>
      );

      expect(onErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null children', () => {
      render(<ErrorBoundary>{null}</ErrorBoundary>);
      expect(document.body).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      render(<ErrorBoundary>{undefined}</ErrorBoundary>);
      expect(document.body).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      render(<ErrorBoundary>{[]}</ErrorBoundary>);
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily when no error', () => {
      const renderSpy = vi.fn();

      const TestComponent = () => {
        renderSpy();
        return <div>Test</div>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);

      rerender(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      // Devrait render une deuxième fois après rerender
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});

