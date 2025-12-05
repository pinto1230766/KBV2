import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Users, 
  BookOpen, 
  Settings, 
  Menu,
  X
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const NAV_ITEMS = [
  { path: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/planning', label: 'Planning', icon: Calendar },
  { path: '/messages', label: 'Messagerie', icon: MessageSquare },
  { path: '/speakers', label: 'Orateurs', icon: Users },
  { path: '/talks', label: 'Discours', icon: BookOpen },
  { path: '/settings', label: 'Paramètres', icon: Settings },
];

export const MainLayout: React.FC = () => {
  const { settings, setTheme } = useSettings();
  const isDarkMode = settings.theme === 'dark';
  const toggleTheme = () => setTheme(settings.theme === 'dark' ? 'light' : 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  // Fermer le menu mobile lors du changement de route
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">KBV Lyon</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Mode sombre</span>
            <button
              onClick={toggleTheme}
              title="Changer le thème"
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                ${isDarkMode ? 'bg-primary-600' : 'bg-gray-200'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400">KBV Lyon</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-gray-800/50 backdrop-blur-sm top-16" onClick={() => setIsMobileMenuOpen(false)}>
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
              <ul className="py-2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center px-4 py-3 border-l-4 transition-colors duration-200
                        ${isActive 
                          ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                          : 'border-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Nav (Optional - can be removed if Header Menu is preferred) */}
        <nav className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe-bottom">
          <div className="flex justify-around items-center h-16">
            {NAV_ITEMS.slice(0, 4).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center w-full h-full space-y-1
                  ${isActive 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            ))}
            <NavLink
              to="/menu" // Route spéciale pour le menu complet sur mobile si besoin
              className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 dark:text-gray-400"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(true);
              }}
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px] font-medium">Menu</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
};
