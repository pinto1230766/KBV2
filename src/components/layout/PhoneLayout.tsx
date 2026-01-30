import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { IOSTabBar } from '@/components/navigation/IOSTabBar';
import { usePlatformContext } from '@/contexts/PlatformContext';
import { cn } from '@/utils/cn';
import { useSettings } from '@/contexts/SettingsContext';

const NAV_ITEMS = [
  { path: '/', label: 'Accueil', icon: LayoutDashboard },
  { path: '/planning', label: 'Planning', icon: Calendar },
  { path: '/speakers', label: 'Orateurs', icon: Users },
  { path: '/settings', label: 'Paramètres', icon: Settings },
];

export const PhoneLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { deviceType, orientation, isPhoneS25Ultra } = usePlatformContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { settings, setTheme } = useSettings();

  const isPhone = deviceType === 'phone';
  const isLandscape = orientation === 'landscape';
  const isDarkMode = settings.theme === 'dark';
  const toggleTheme = () => setTheme(settings.theme === 'dark' ? 'light' : 'dark');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  
  if (!isPhone) {
    // Fallback vers le layout tablette si ce n'est pas un téléphone
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 pb-[83px] pt-4">
          <div className="max-w-7xl mx-auto py-4">
            <Outlet />
          </div>
        </main>
        <IOSTabBar />
      </div>
    );
  }

  // Layout optimisé pour Samsung S25 Ultra
  if (isPhoneS25Ultra) {
    return (
      <div className={cn(
        "flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden",
        "s25-ultra-optimized"
      )}>
        {/* Header avec hamburger menu */}
        <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex flex-col items-center">
            <div className="text-[18px] font-bold tracking-widest leading-none text-blue-600 dark:text-blue-400">KBV</div>
            <div className="text-[9px] font-bold leading-none text-blue-500 dark:text-blue-300">LYON</div>
          </div>
          
          <button className="s25-touch-zone p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Notifications">
            <Bell className="w-6 h-6" />
          </button>
        </header>

        {/* Sidebar overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleSidebar} />
            <aside className="relative flex-shrink-0 w-80 bg-white dark:bg-gray-800 shadow-xl">
              {/* Header de la sidebar */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-[20px] font-bold tracking-widest leading-none text-blue-600 dark:text-blue-400">KBV</div>
                    <div className="text-[10px] font-bold leading-none text-blue-500 dark:text-blue-300">LYON</div>
                    <div className="text-[8px] leading-none mt-[1px] text-gray-500 dark:text-gray-400">FP</div>
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900 dark:text-white text-sm">KBV Lyon</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gestion orateurs</p>
                  </div>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="s25-touch-zone p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Fermer le menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.path}>
                      <button
                        onClick={() => {
                          navigate(item.path);
                          setIsSidebarOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center rounded-lg transition-colors duration-200 px-4 py-3",
                          location.pathname === item.path 
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" 
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50"
                        )}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="my-2 border-t border-gray-100 dark:border-gray-700 mx-2"></div>
                
                {/* Action Buttons removed */}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Mode sombre</span>
                  <button
                    onClick={toggleTheme}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                      isDarkMode ? 'bg-primary-600' : 'bg-gray-200'
                    )}
                    title={isDarkMode ? "Désactiver le mode sombre" : "Activer le mode sombre"}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Contenu principal */}
        <main className={cn(
          "flex-1 overflow-y-auto",
          isLandscape && isPhoneS25Ultra ? "pt-0" : "pt-4",
          !isLandscape && "pb-[83px]"
        )}>
          <div className={cn(
            "h-full",
            isLandscape && isPhoneS25Ultra ? "s25-landscape" : "px-4"
          )}>
            <Outlet />
          </div>
        </main>

        {/* Tab bar iOS - seulement en mode portrait et si sidebar fermée */}
        {!isLandscape && !isSidebarOpen && <IOSTabBar />}
        
      </div>
    );
  }

  // Layout mobile standard (non-S25 Ultra)
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <main className="flex-1 overflow-y-auto px-4 pb-[83px] pt-4">
        <div className="max-w-7xl mx-auto py-4">
          <Outlet />
        </div>
      </main>
      <IOSTabBar />
    </div>
  );
};
