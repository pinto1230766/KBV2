import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LocalNotifications } from '@capacitor/local-notifications';
import { DataProvider } from '@/contexts/DataContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ConfirmProvider } from '@/contexts/ConfirmContext';
import { PlatformProvider, usePlatformContext } from '@/contexts/PlatformContext';
import { AccessibilityProvider, useKeyboardShortcuts } from '@/components/ui/Accessibility';
import { IOSMainLayout } from '@/components/layout/IOSMainLayout';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Spinner } from '@/components/ui/Spinner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/cacheManager';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import '@/styles/print.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load pages for code splitting
const Dashboard = React.lazy(() =>
  import('@/pages/Dashboard').then((module) => ({ default: module.Dashboard }))
);
const Planning = React.lazy(() =>
  import('@/pages/Planning').then((module) => ({ default: module.Planning }))
);
const Messages = React.lazy(() =>
  import('@/pages/Messages').then((module) => ({ default: module.Messages }))
);
const Speakers = React.lazy(() =>
  import('@/pages/Speakers').then((module) => ({ default: module.Speakers }))
);

const Settings = React.lazy(() =>
  import('@/pages/Settings').then((module) => ({ default: module.Settings }))
);

// Lazy load portals
const SpeakerPortal = React.lazy(() =>
  import('@/pages/portal/SpeakerPortal').then((module) => ({ default: module.SpeakerPortal }))
);
const HostPortal = React.lazy(() =>
  import('@/pages/portal/HostPortal').then((module) => ({ default: module.HostPortal }))
);

// Loading fallback component
const PageLoader = () => (
  <div className='flex items-center justify-center h-64'>
    <Spinner size='lg' />
  </div>
);

// Composant interne qui peut accéder au contexte Platform
function AppContent() {
  const { deviceType } = usePlatformContext();
  const isTablet = deviceType === 'tablet';
  const isPhone = deviceType === 'phone';
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Gestion des notifications Capacitor (Deep Linking)
  useEffect(() => {
    let notificationListener: any = null;

    const setupNotificationListener = async () => {
      try {
        notificationListener = await LocalNotifications.addListener(
          'localNotificationActionPerformed',
          (notification) => {
            const { extra } = notification.notification;
            if (extra && extra.visitId) {
              console.log('🔔 Notification cliquée:', extra);
              // Rediriger vers le planning avec des params pour ouvrir la modale
              const queryParams = new URLSearchParams();
              queryParams.set('visitId', extra.visitId);
              if (extra.messageType) queryParams.set('messageType', extra.messageType);
              if (extra.target) queryParams.set('target', extra.target);

              navigate(`/planning?${queryParams.toString()}`);
            }
          }
        );
      } catch (error) {
        console.error('Erreur lors de la configuration du listener de notifications:', error);
      }
    };

    setupNotificationListener();

    return () => {
      if (notificationListener) {
        notificationListener.remove();
      }
    };
  }, [navigate]);

  // Configuration des raccourcis clavier
  useKeyboardShortcuts({
    'ctrl+k': () => setIsGlobalSearchOpen(true),
  });

  // Choix du layout en fonction du type d'appareil
  // ResponsiveLayout gère maintenant phone et tablet de manière unifiée
  const LayoutComponent = isTablet || isPhone ? ResponsiveLayout : IOSMainLayout;

  return (
    <ErrorBoundary>
      <SettingsProvider>
        <ToastProvider>
          <DataProvider>
            <ConfirmProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Portails externes (Sans le layout principal) */}
                  <Route
                    path='/portal/speaker/:id'
                    element={
                      <ErrorBoundary>
                        <SpeakerPortal />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path='/portal/host/:id'
                    element={
                      <ErrorBoundary>
                        <HostPortal />
                      </ErrorBoundary>
                    }
                  />

                  <Route path='/' element={<LayoutComponent />}>
                    <Route
                      index
                      element={
                        <ErrorBoundary>
                          <Dashboard />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path='planning'
                      element={
                        <ErrorBoundary>
                          <Planning />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path='messages'
                      element={
                        <ErrorBoundary>
                          <Messages />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path='speakers'
                      element={
                        <ErrorBoundary>
                          <Speakers />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path='settings'
                      element={
                        <ErrorBoundary>
                          <Settings />
                        </ErrorBoundary>
                      }
                    />
                    <Route path='*' element={<Navigate to='/' replace />} />
                  </Route>
                </Routes>

                {/* Global Search Modal - Accessible depuis Ctrl+K */}
                <GlobalSearch
                  isOpen={isGlobalSearchOpen}
                  onClose={() => setIsGlobalSearchOpen(false)}
                />
              </Suspense>
            </ConfirmProvider>
          </DataProvider>
        </ToastProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AccessibilityProvider>
          <PlatformProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </PlatformProvider>
        </AccessibilityProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
