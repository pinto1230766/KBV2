import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from '@/contexts/DataContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ConfirmProvider } from '@/contexts/ConfirmContext';
import { PlatformProvider } from '@/contexts/PlatformContext';
import { AuthProvider } from '@/contexts/AuthContext';

/**
 * TestWrapper component that provides all necessary contexts for testing
 */
export function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <PlatformProvider>
        <AuthProvider>
          <SettingsProvider>
            <ToastProvider>
              <ConfirmProvider>
                <DataProvider>{children}</DataProvider>
              </ConfirmProvider>
            </ToastProvider>
          </SettingsProvider>
        </AuthProvider>
      </PlatformProvider>
    </BrowserRouter>
  );
}
