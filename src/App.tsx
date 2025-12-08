import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from '@/contexts/DataContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ConfirmProvider } from '@/contexts/ConfirmContext';
import { PlatformProvider, usePlatformContext } from '@/contexts/PlatformContext';
import { IOSMainLayout } from '@/components/layout/IOSMainLayout';
import { TabletLayout } from '@/components/layout/TabletLayout';
import { Spinner } from '@/components/ui/Spinner';
import '@/styles/print.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load pages for code splitting
const Dashboard = React.lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Planning = React.lazy(() => import('@/pages/Planning.tsx').then(module => ({ default: module.Planning })));
const Messages = React.lazy(() => import('@/pages/Messages').then(module => ({ default: module.Messages })));
const Speakers = React.lazy(() => import('@/pages/Speakers').then(module => ({ default: module.Speakers })));

const Settings = React.lazy(() => import('@/pages/Settings').then(module => ({ default: module.Settings })));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" />
  </div>
);

// Composant interne qui peut accéder au contexte Platform
function AppContent() {
  const { deviceType } = usePlatformContext();
  const isTablet = deviceType === 'tablet';
  const LayoutComponent = isTablet ? TabletLayout : IOSMainLayout;

  return (
    <ErrorBoundary>
      <SettingsProvider>
        <ToastProvider>
          <ConfirmProvider>
            <DataProvider>
              <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<LayoutComponent />}>
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
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <PlatformProvider>
        <AppContent />
      </PlatformProvider>
    </ErrorBoundary>
  );
}

export default App;
