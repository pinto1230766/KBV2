import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { IOSTabBar } from '@/components/navigation/IOSTabBar';
import { SPenCursor } from '@/components/spen/SPenCursor';
import { usePlatformContext } from '@/contexts/PlatformContext';
import { cn } from '@/utils/cn';
import { useSettings } from '@/contexts/SettingsContext';

// Navigation items - centralisé
const NAV_ITEMS = [
  { path: '/', label: 'Accueil', icon: LayoutDashboard },
  { path: '/planning', label: 'Planning', icon: Calendar },
  { path: '/speakers', label: 'Orateurs', icon: Users },
  { path: '/settings', label: 'Paramètres', icon: Settings },
];

/**
 * ResponsiveLayout - Layout unifié qui s'adapte au deviceType
 * Remplace MainLayout, PhoneLayout et TabletLayout
 */
export const ResponsiveLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { deviceType, orientation } = usePlatformContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { settings, setTheme } = useSettings();

  const isTablet = deviceType === 'tablet';
  const isPhone = deviceType === 'phone';
  const isLandscape = orientation === 'landscape';
  const isDarkMode = settings.theme === 'dark';

  const toggleTheme = () => setTheme(settings.theme === 'dark' ? 'light' : 'dark');
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const currentIndex = NAV_ITEMS.findIndex((item) => item.path === location.pathname);
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < NAV_ITEMS.length - 1;

  const goToPrevious = () => {
    if (canGoBack) navigate(NAV_ITEMS[currentIndex - 1].path);
  };

  const goToNext = () => {
    if (canGoForward) navigate(NAV_ITEMS[currentIndex + 1].path);
  };

  // Render pour Phone (bottom navigation)
  if (isPhone) {
    return (
      <div className='flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden'>
        <main className='flex-1 overflow-y-auto px-4 pb-[83px] pt-4'>
          <div className='max-w-7xl mx-auto py-4'>
            <Outlet />
          </div>
        </main>
        <IOSTabBar />
      </div>
    );
  }

  // Render pour Tablet/Desktop (avec sidebar)
  return (
    <SPenCursor>
      <div className='flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden samsung-optimized w-screen max-w-none'>
        {/* Sidebar Premium */}
        <aside
          className={cn(
            'flex-shrink-0 bg-slate-900 border-r border-slate-800 transition-all duration-300 relative overflow-hidden flex flex-col',
            isSidebarOpen ? 'w-80' : 'w-20',
            isLandscape ? 'block' : isSidebarOpen ? 'block' : 'hidden'
          )}
        >
          {/* Ambient Background */}
          <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0'>
            <div className='absolute top-[-10%] left-[-20%] w-[80%] h-[30%] bg-blue-500/10 blur-[80px] rounded-full'></div>
            <div className='absolute bottom-[-10%] right-[-20%] w-[80%] h-[30%] bg-indigo-500/10 blur-[80px] rounded-full'></div>
          </div>

          {/* Header */}
          <div className='relative z-10 flex items-center justify-between h-24 px-4 border-b border-white/5'>
            <div
              className={cn(
                'flex flex-col gap-1 transition-opacity duration-300',
                !isSidebarOpen && 'opacity-0 hidden'
              )}
            >
              <div className='text-[10px] font-black tracking-[0.3em] uppercase text-slate-500'>
                GROUPE DE
              </div>
              <div className='text-3xl font-black tracking-tighter leading-none text-white drop-shadow-lg transform scale-y-90'>
                LYON
              </div>
            </div>

            {!isSidebarOpen && (
              <div className='w-full flex justify-center'>
                <span className='text-2xl font-black text-white'>GL</span>
              </div>
            )}

            {isLandscape && (
              <button
                onClick={toggleSidebar}
                className='p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors'
                title={isSidebarOpen ? 'Réduire la sidebar' : 'Agrandir la sidebar'}
              >
                {isSidebarOpen ? <X className='w-5 h-5' /> : <Menu className='w-6 h-6' />}
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className='relative z-10 flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar'>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center rounded-xl transition-all duration-200 group relative',
                  isSidebarOpen ? 'px-4 py-4' : 'px-0 py-4 justify-center',
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/40'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <item.icon
                  className={cn(
                    'w-6 h-6 transition-colors',
                    isSidebarOpen && 'mr-4',
                    location.pathname === item.path
                      ? 'text-white'
                      : 'text-slate-500 group-hover:text-white'
                  )}
                />
                {isSidebarOpen && (
                  <span className='font-bold text-lg tracking-wide'>{item.label}</span>
                )}
                {location.pathname === item.path && (
                  <div className='absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full blur-[1px]'></div>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className='relative z-10 p-4 border-t border-white/5 bg-slate-900 space-y-4'>
            {/* Theme Toggle */}
            <div
              className={cn(
                'flex items-center',
                isSidebarOpen ? 'justify-between' : 'justify-center'
              )}
            >
              {isSidebarOpen && (
                <span className='text-xs font-bold uppercase tracking-widest text-slate-500'>
                  Mode sombre
                </span>
              )}
              <button
                onClick={toggleTheme}
                title={isDarkMode ? 'Désactiver le mode clair' : 'Activer le mode sombre'}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
                  isDarkMode ? 'bg-blue-600' : 'bg-slate-700'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            {/* Navigation Arrows */}
            {isSidebarOpen && (
              <div className='flex justify-between items-center pt-2'>
                <button
                  onClick={goToPrevious}
                  disabled={!canGoBack}
                  title='Page précédente'
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    canGoBack
                      ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                      : 'opacity-30 cursor-not-allowed text-slate-600'
                  )}
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>
                <span className='text-[10px] font-bold text-slate-600 uppercase tracking-wider'>
                  {currentIndex + 1} / 4
                </span>
                <button
                  onClick={goToNext}
                  disabled={!canGoForward}
                  title='Page suivante'
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    canGoForward
                      ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                      : 'opacity-30 cursor-not-allowed text-slate-600'
                  )}
                >
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Contenu principal */}
        <div className='flex-1 flex flex-col overflow-hidden'>
          <main className='flex-1 overflow-hidden pt-4'>
            <div className='h-full overflow-y-auto'>
              <Outlet />
            </div>
          </main>

          {/* Tab bar iOS - seulement en mode portrait sur tablette */}
          {isTablet && !isLandscape && <IOSTabBar />}
        </div>
      </div>
    </SPenCursor>
  );
}
;
