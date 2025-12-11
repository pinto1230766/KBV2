import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isRetrying: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, maxRetries = 3, retryDelay = 1000 } = this.props;
    
    this.setState({
      errorInfo
    });

    // Log l'erreur
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Callback personnalisé pour analytics/debugging
    if (onError) {
      onError(error, errorInfo);
    }

    // Auto-retry si configuré
    const { enableRetry = true } = this.props;
    if (enableRetry && this.state.retryCount < maxRetries) {
      this.scheduleRetry(error, errorInfo, maxRetries, retryDelay);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private scheduleRetry = (
    _error: Error, 
    _errorInfo: ErrorInfo, 
    maxRetries: number, 
    delay: number
  ) => {
    const { retryCount } = this.state;
    const nextRetryCount = retryCount + 1;
    
    console.log(`Programmation du retry ${nextRetryCount}/${maxRetries} dans ${delay}ms`);
    
    this.retryTimeoutId = setTimeout(() => {
      this.handleRetry();
    }, delay * Math.pow(2, retryCount)); // Backoff exponentiel
  };

  handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;
    
    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
        isRetrying: true
      }));
      
      // Reset isRetrying après un court délai
      setTimeout(() => {
        this.setState({ isRetrying: false });
      }, 500);
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false
    });
    
    // Recharger la page en cas d'erreur critique
    if (this.state.retryCount >= (this.props.maxRetries || 3)) {
      window.location.reload();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, errorInfo, retryCount, isRetrying } = this.state;
    const { 
      children, 
      fallback, 
      enableRetry = true, 
      maxRetries = 3, 
      showDetails = false 
    } = this.props;

    if (hasError) {
      // Fallback personnalisé
      if (fallback) {
        return fallback;
      }

      const canRetry = enableRetry && retryCount < maxRetries;
      const shouldReload = retryCount >= maxRetries;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            {/* Icône d'erreur */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>

            {/* Message d'erreur */}
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Oups ! Une erreur s'est produite
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {shouldReload 
                ? 'Trop de tentatives ont échoué. La page va être rechargée.'
                : canRetry 
                  ? `Nous avons rencontré un problème. Tentative ${retryCount}/${maxRetries}.`
                  : 'Nous avons rencontré un problème inattendu.'
              }
            </p>

            {/* Actions */}
            <div className="space-y-3">
              {canRetry && (
                <Button
                  onClick={this.handleRetry}
                  disabled={isRetrying}
                  variant="primary"
                  leftIcon={isRetrying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  className="w-full"
                >
                  {isRetrying ? 'Nouvelle tentative...' : `Réessayer (${retryCount}/${maxRetries})`}
                </Button>
              )}
              
              {shouldReload && (
                <Button
                  onClick={this.handleReset}
                  variant="primary"
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  className="w-full"
                >
                  Recharger la page
                </Button>
              )}
              
              <Button
                onClick={this.handleGoHome}
                variant="ghost"
                leftIcon={<Home className="w-4 h-4" />}
                className="w-full"
              >
                Retour à l'accueil
              </Button>
            </div>

            {/* Détails de l'erreur (mode debug) */}
            {showDetails && error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Détails techniques
                </summary>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Erreur:</strong> {error.message}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap">{error.stack}</pre>
                    </div>
                  )}
                  {errorInfo && (
                    <div className="mt-2">
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

// Hook pour utiliser Error Boundary avec retry automatique
export function useErrorHandler() {
  return {
    handleError: (error: Error, errorInfo?: ErrorInfo) => {
      // Log l'erreur pour debugging
      console.error('Erreur capturée:', error, errorInfo);
      
      // Ici on pourrait envoyer à un service de monitoring comme Sentry
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    },
    
    createBoundary: (componentName: string) => {
      return (props: Omit<Props, 'onError'>) => (
        <ErrorBoundary
          {...props}
          onError={(error, errorInfo) => {
            console.error(`Erreur dans ${componentName}:`, error, errorInfo);
            // Actions spécifiques par composant
          }}
        />
      );
    }
  };
}

// Error Boundary pour les composants spécifiques
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<Props, 'children'> = {}
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;
