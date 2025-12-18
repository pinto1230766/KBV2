import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Users,
  BookOpen,
  Settings,
  Menu,
  X,
  Zap,
  FileText,
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/contexts/ToastContext';
import { SyncStatusIndicator } from '@/components/layout/SyncStatusIndicator';
import { QuickActionsModal } from '@/components/ui/QuickActionsModal';
import { ReportGeneratorModal } from '@/components/reports/ReportGeneratorModal';
import { useData } from '@/contexts/DataContext';

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
  const { visits } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const isDarkMode = settings.theme === 'dark';
  const toggleTheme = () => setTheme(settings.theme === 'dark' ? 'light' : 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const [isQuickActionsOpen, setIsQuickActionsOpen] = React.useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);

  // Fermer le menu mobile lors du changement de route
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleReportGenerate = (config: any) => {
    const filteredVisits = visits.filter((v) => {
      if (config.period === 'current-month') {
        const now = new Date();
        const visitDate = new Date(v.visitDate);
        return (
          visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });

    const fileName = `rapport-kbv-${new Date().toISOString().slice(0, 10)}`;

    if (config.format === 'csv') {
      let csvContent = 'Date,Orateur,Congrégation,Discours,Thème,Hôte,Statut\n';
      filteredVisits.forEach((v) => {
        csvContent += `${v.visitDate},${v.nom},${v.congregation},${v.talkNoOrType || ''},${v.talkTheme || ''},${v.host || ''},${v.status}\n`;
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('Rapport CSV généré !', 'success');
    } else if (config.format === 'excel') {
      let htmlContent = `<html><head><meta charset="utf-8"><style>table{border-collapse:collapse;width:100%;}th,td{border:1px solid black;padding:8px;text-align:left;}th{background-color:#4F46E5;color:white;}</style></head><body><h1>Rapport KBV Lyon</h1><table><tr><th>Date</th><th>Orateur</th><th>Congrégation</th><th>Discours</th><th>Thème</th><th>Hôte</th><th>Statut</th></tr>`;
      filteredVisits.forEach((v) => {
        htmlContent += `<tr><td>${v.visitDate}</td><td>${v.nom}</td><td>${v.congregation}</td><td>${v.talkNoOrType || ''}</td><td>${v.talkTheme || ''}</td><td>${v.host || ''}</td><td>${v.status}</td></tr>`;
      });
      htmlContent += '</table></body></html>';
      const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('Rapport Excel généré !', 'success');
    } else if (config.format === 'pdf') {
      let htmlContent = `<html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;margin:40px;}h1{color:#4F46E5;}table{border-collapse:collapse;width:100%;margin-top:20px;}th,td{border:1px solid #ddd;padding:12px;text-align:left;}th{background-color:#4F46E5;color:white;}</style></head><body><h1>Rapport KBV Lyon</h1><p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p><table><tr><th>Date</th><th>Orateur</th><th>Congrégation</th><th>Discours</th><th>Thème</th><th>Hôte</th><th>Statut</th></tr>`;
      filteredVisits.forEach((v) => {
        htmlContent += `<tr><td>${new Date(v.visitDate).toLocaleDateString('fr-FR')}</td><td>${v.nom}</td><td>${v.congregation}</td><td>${v.talkNoOrType || ''}</td><td>${v.talkTheme || ''}</td><td>${v.host || ''}</td><td>${v.status}</td></tr>`;
      });
      htmlContent += `</table><p style="margin-top:30px;color:#666;">Total: ${filteredVisits.length} visite(s)</p></body></html>`;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('Rapport HTML généré ! Ouvrez-le et imprimez en PDF', 'success');
    }

    setIsReportModalOpen(false);
  };

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden'>
      {/* Sidebar Desktop */}
      <aside className='hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700 py-4'>
          <div className='flex flex-col items-center gap-[2px]'>
            <div className='text-[28px] font-bold tracking-[0.1em] leading-none text-primary-600 dark:text-primary-400'>
              KBV
            </div>
            <div className='text-[14px] font-semibold leading-none text-primary-500 dark:text-primary-300'>
              LYON
            </div>
            <div className='text-[11px] leading-none mt-[2px] text-gray-500 dark:text-gray-400'>
              FP
            </div>
          </div>
        </div>

        <nav className='flex-1 overflow-y-auto py-4'>
          <ul className='space-y-1 px-2'>
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                    ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  <item.icon className='w-5 h-5 mr-3' />
                  <span className='font-medium'>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className='p-4 border-t border-gray-200 dark:border-gray-700 space-y-4'>
          {/* Quick Actions & Reports Buttons */}
          <div className='space-y-2 pb-2 border-b border-gray-100 dark:border-gray-700/50'>
            <button
              onClick={() => setIsQuickActionsOpen(true)}
              className='w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors'
            >
              <Zap className='w-4 h-4 mr-3 text-amber-500' />
              Actions rapides
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className='w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors'
            >
              <FileText className='w-4 h-4 mr-3 text-blue-500' />
              Rapports
            </button>
          </div>

          <div className='flex justify-center'>
            <SyncStatusIndicator />
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              Mode sombre
            </span>
            <button
              onClick={toggleTheme}
              title='Changer le thème'
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
      <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
        {/* Mobile Header */}
        <header className='md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0'>
          <div className='flex flex-col'>
            <span className='text-lg font-bold text-primary-600 dark:text-primary-400 tracking-wide leading-tight'>
              KBV
            </span>
            <span className='text-[10px] font-semibold text-primary-500 dark:text-primary-300 -mt-1'>
              LYON <span className='text-gray-500 dark:text-gray-400'>FP</span>
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='scale-90'>
              <SyncStatusIndicator />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              title={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className='p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            >
              {isMobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className='md:hidden fixed inset-0 z-50 bg-gray-800/50 backdrop-blur-sm top-16'
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <nav
              className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'
              onClick={(e) => e.stopPropagation()}
            >
              <ul className='py-2'>
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center px-4 py-3 border-l-4 transition-colors duration-200
                        ${
                          isActive
                            ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'border-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                        }
                      `}
                    >
                      <item.icon className='w-5 h-5 mr-3' />
                      <span className='font-medium'>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
                <li className='border-t border-gray-100 dark:border-gray-700 my-2 pt-2'>
                  <button
                    onClick={() => {
                      setIsQuickActionsOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className='w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                  >
                    <Zap className='w-5 h-5 mr-3 text-amber-500' />
                    <span className='font-medium'>Actions rapides</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsReportModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className='w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                  >
                    <FileText className='w-5 h-5 mr-3 text-blue-500' />
                    <span className='font-medium'>Rapports</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className='flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth'>
          <div className='mx-auto'>
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation - Visible uniquement sur mobile */}
        <nav className='md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe-bottom'>
          <div className='flex justify-around items-center h-16'>
            {NAV_ITEMS.slice(0, 5).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center w-full h-full space-y-1
                  ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                <item.icon className='w-5 h-5' />
                <span className='text-[10px] font-medium'>{item.label.split(' ')[0]}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Modals */}
      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onAction={(action) => {
          setIsQuickActionsOpen(false);
          switch (action) {
            case 'schedule-visit':
              navigate('/planning');
              break;
            case 'add-speaker':
              navigate('/speakers');
              break;
            case 'add-host':
              navigate('/speakers');
              break;
            case 'send-message':
              navigate('/messages');
              break;
            case 'generate-report':
              setIsReportModalOpen(true);
              break;
            case 'check-conflicts':
              navigate('/planning');
              break;
            case 'backup-data':
              navigate('/settings');
              break;
            // Add other cases as needed
          }
        }}
      />
      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onGenerate={handleReportGenerate}
      />
    </div>
  );
};
