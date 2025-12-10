import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { IOSTabBar } from '@/components/navigation/IOSTabBar';
import { SPenCursor } from '@/components/spen/SPenCursor';
import { usePlatformContext } from '@/contexts/PlatformContext';
import { cn } from '@/utils/cn';

// Mapping des routes vers les titres et icônes
const NAV_ITEMS = [
  { path: '/', label: 'Accueil', icon: LayoutDashboard },
  { path: '/planning', label: 'Planning', icon: Calendar },
  { path: '/messages', label: 'Messages', icon: MessageSquare },
  { path: '/speakers', label: 'Orateurs', icon: Users },
  { path: '/settings', label: 'Paramètres', icon: Settings },
];

export const TabletLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { deviceType, orientation } = usePlatformContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isTablet = deviceType === 'tablet';
  const isLandscape = orientation === 'landscape';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const currentIndex = NAV_ITEMS.findIndex(item => item.path === location.pathname);
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < NAV_ITEMS.length - 1;

  const goToPrevious = () => {
    if (canGoBack) {
      navigate(NAV_ITEMS[currentIndex - 1].path);
    }
  };

  const goToNext = () => {
    if (canGoForward) {
      navigate(NAV_ITEMS[currentIndex + 1].path);
    }
  };

  if (!isTablet) {
    // Fallback vers le layout iOS pour les appareils non-tablette
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

  return (
    <SPenCursor>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden samsung-optimized w-screen max-w-none">
        {/* Sidebar - Cache en mode portrait si pliée */}
        <aside className={cn(
          "flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
          isSidebarOpen ? "w-80" : "w-16",
          isLandscape ? "block" : (isSidebarOpen ? "block" : "hidden")
        )}>
          {/* Header de la sidebar */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
              <div className="flex flex-col items-center justify-center">
                <div className="text-[20px] font-bold tracking-widest leading-none text-blue-600 dark:text-blue-400">KBV</div>
                <div className="text-[10px] font-bold leading-none text-blue-500 dark:text-blue-300">LYON</div>
                <div className="text-[8px] leading-none mt-[1px] text-gray-500 dark:text-gray-400">FP</div>
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="font-bold text-gray-900 dark:text-white text-sm">KBV Lyon</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Gestion orateurs</p>
                </div>
              )}
            </div>
            {isLandscape && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isSidebarOpen ? "Réduire la sidebar" : "Agrandir la sidebar"}
              >
                {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full flex items-center rounded-lg transition-colors duration-200",
                      isSidebarOpen ? "px-4 py-3" : "px-2 py-3 justify-center",
                      location.pathname === item.path 
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" 
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50"
                    )}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <item.icon className={cn("w-5 h-5", isSidebarOpen && "mr-3")} />
                    {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Navigation rapide */}
          {isSidebarOpen && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <button
                  onClick={goToPrevious}
                  disabled={!canGoBack}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    canGoBack 
                      ? "hover:bg-gray-100 dark:hover:bg-gray-700" 
                      : "opacity-50 cursor-not-allowed"
                  )}
                  title="Section précédente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {currentIndex + 1}/5
                </span>
                <button
                  onClick={goToNext}
                  disabled={!canGoForward}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    canGoForward 
                      ? "hover:bg-gray-100 dark:hover:bg-gray-700" 
                      : "opacity-50 cursor-not-allowed"
                  )}
                  title="Section suivante"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Contenu principal - Pleine largeur sur tablette */}
          <main className="flex-1 overflow-hidden pt-4">
            <div className="h-full overflow-y-auto">
              <Outlet />
            </div>
          </main>

          {/* Tab bar iOS - seulement en mode portrait */}
          {!isLandscape && <IOSTabBar />}
        </div>
      </div>
    </SPenCursor>
  );
};