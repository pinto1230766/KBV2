import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from '@/contexts/DataContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ConfirmProvider } from '@/contexts/ConfirmContext';
import { PlatformProvider } from '@/contexts/PlatformContext';
import { IOSMainLayout } from '@/components/layout/IOSMainLayout';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load pages for code splitting
const Dashboard = React.lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Planning = React.lazy(() => import('@/pages/Planning.tsx').then(module => ({ default: module.Planning })));
const Messages = React.lazy(() => import('@/pages/Messages').then(module => ({ default: module.Messages })));
const Speakers = React.lazy(() => import('@/pages/Speakers').then(module => ({ default: module.Speakers })));
const Talks = React.lazy(() => import('@/pages/Talks').then(module => ({ default: module.Talks })));
const Settings = React.lazy(() => import('@/pages/Settings').then(module => ({ default: module.Settings })));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <PlatformProvider>
        <SettingsProvider>
          <ToastProvider>
            <ConfirmProvider>
              <DataProvider>
                <BrowserRouter>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<IOSMainLayout />}>
                        <Route index element={
                          <ErrorBoundary>
                            <Dashboard />
                          </ErrorBoundary>
                        } />
                        <Route path="planning" element={
                          <ErrorBoundary>
                            <Planning />
                          </ErrorBoundary>
                        } />
                        <Route path="messages" element={
                          <ErrorBoundary>
                            <Messages />
                          </ErrorBoundary>
                        } />
                        <Route path="speakers" element={
                          <ErrorBoundary>
                            <Speakers />
                          </ErrorBoundary>
                        } />
                        <Route path="talks" element={
                          <ErrorBoundary>
                            <Talks />
                          </ErrorBoundary>
                        } />
                        <Route path="settings" element={
                          <ErrorBoundary>
                            <Settings />
                          </ErrorBoundary>
                        } />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </DataProvider>
            </ConfirmProvider>
          </ToastProvider>
        </SettingsProvider>
      </PlatformProvider>
    </ErrorBoundary>
  );
}

export default App;
