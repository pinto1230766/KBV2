import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  resolve: ((value: boolean) => void) | null;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    options: { message: '' },
    resolve: null,
  });

  const confirm = useCallback(
    (options: ConfirmOptions | string): Promise<boolean> =>
      new Promise((resolve) => {
        const confirmOptions: ConfirmOptions =
          typeof options === 'string' ? { message: options } : options;

        setState({
          isOpen: true,
          options: {
            title: 'Confirmation',
            confirmText: 'Confirmer',
            cancelText: 'Annuler',
            confirmVariant: 'primary',
            ...confirmOptions,
          },
          resolve,
        });
      }),
    []
  );

  const handleConfirm = useCallback(() => {
    if (state.resolve) {
      state.resolve(true);
    }
    setState({ isOpen: false, options: { message: '' }, resolve: null });
  }, [state.resolve]);

  const handleCancel = useCallback(() => {
    if (state.resolve) {
      state.resolve(false);
    }
    setState({ isOpen: false, options: { message: '' }, resolve: null });
  }, [state.resolve]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state.isOpen && (
        <ConfirmDialog options={state.options} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </ConfirmContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context;
}

// ============================================================================
// CONFIRM DIALOG
// ============================================================================

function ConfirmDialog({
  options,
  onConfirm,
  onCancel,
}: {
  options: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmButtonClass = options.confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary';

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 z-50 fade-in'
        onClick={onCancel}
        aria-hidden='true'
      />

      {/* Dialog */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div
          className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full slide-up'
          role='dialog'
          aria-modal='true'
          aria-labelledby='confirm-title'
        >
          {/* Header */}
          <div className='flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex-shrink-0'>
              <div className='w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900 flex items-center justify-center'>
                <AlertTriangle className='w-5 h-5 text-warning-600 dark:text-warning-400' />
              </div>
            </div>
            <h2
              id='confirm-title'
              className='text-lg font-semibold text-gray-900 dark:text-gray-100'
            >
              {options.title}
            </h2>
          </div>

          {/* Body */}
          <div className='p-6'>
            <p className='text-gray-700 dark:text-gray-300'>{options.message}</p>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700'>
            <button onClick={onCancel} className='btn-secondary'>
              {options.cancelText}
            </button>
            <button onClick={onConfirm} className={confirmButtonClass} autoFocus>
              {options.confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
