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
      {/* Premium Sidebar Desktop */}
      <aside className='hidden md:flex flex-col w-72 bg-slate-900 border-r border-slate-800 shadow-2xl relative overflow-hidden'>
        {/* Ambient Background Effects */}
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0'>
          <div className='absolute top-[-10%] left-[-20%] w-[80%] h-[30%] bg-blue-500/10 blur-[80px] rounded-full'></div>
          <div className='absolute bottom-[-10%] right-[-20%] w-[80%] h-[30%] bg-indigo-500/10 blur-[80px] rounded-full'></div>
        </div>

        <div className='relative z-10 flex items-center justify-center h-28 border-b border-white/5 py-8 mb-4'>
          <div className='flex flex-col items-center gap-1.5'>
            <div className='text-[11px] font-black tracking-[0.4em] uppercase text-slate-400'>
              GROUPE DE
            </div>
            <div className='text-4xl font-black tracking-tighter leading-none text-white drop-shadow-lg transform scale-y-90'>
              LYON
            </div>
            <div className='w-12 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mt-3 shadow-lg shadow-blue-500/20'></div>
          </div>
        </div>

        <nav className='relative z-10 flex-1 overflow-y-auto py-2 px-3 space-y-1 custom-scrollbar'>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                  group flex items-center px-4 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/50 translate-x-1'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                  }
                `}
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`
                      p-2 rounded-xl mr-4 transition-all duration-300
                      ${isActive ? 'bg-white/20 backdrop-blur-md' : 'bg-slate-800 group-hover:bg-slate-700'}
                    `}
                  >
                    <item.icon
                      className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                    />
                  </div>
                  <span className={`font-bold tracking-wide ${isActive ? 'text-base' : 'text-sm'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className='absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full blur-[1px]'></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className='relative z-10 p-5 mt-auto space-y-4 bg-gradient-to-t from-slate-900 to-transparent'>
          {/* Quick Actions & Reports Buttons */}
          <div className='grid grid-cols-2 gap-3 pb-6 border-b border-white/5'>
            <button
              onClick={() => setIsQuickActionsOpen(true)}
              className='flex flex-col items-center justify-center gap-2 p-3 bg-slate-800/50 hover:bg-slate-700 hover:-translate-y-0.5 border border-white/5 rounded-2xl transition-all duration-300 group'
            >
              <div className='p-2 bg-amber-500/10 rounded-full group-hover:scale-110 transition-transform'>
                <Zap className='w-5 h-5 text-amber-500' />
              </div>
              <span className='text-[10px] font-bold uppercase tracking-wider text-slate-300'>
                Actions
              </span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className='flex flex-col items-center justify-center gap-2 p-3 bg-slate-800/50 hover:bg-slate-700 hover:-translate-y-0.5 border border-white/5 rounded-2xl transition-all duration-300 group'
            >
              <div className='p-2 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform'>
                <FileText className='w-5 h-5 text-blue-500' />
              </div>
              <span className='text-[10px] font-bold uppercase tracking-wider text-slate-300'>
                Rapports
              </span>
            </button>
          </div>

          <div className='flex items-center justify-between px-2 pt-2'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
              <span className='text-[10px] font-medium text-slate-500 uppercase tracking-widest'>
                Système OK
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className={`
                p-2 rounded-xl transition-all duration-300
                ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-800 text-slate-400 hover:text-white'}
              `}
            >
              {isDarkMode ? (
                <span className='text-xs'>🌙</span>
              ) : (
                <span className='text-xs'>☀️</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
        {/* Mobile Header */}
        <header className='md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0 sticky top-0 z-50'>
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
              navigate('/planning', { state: { openSchedule: true } });
              break;
            case 'add-speaker':
              navigate('/speakers', { state: { activeTab: 'speakers', openForm: true } });
              break;
            case 'add-host':
              navigate('/speakers', { state: { activeTab: 'hosts', openForm: true } });
              break;
            case 'send-message':
              navigate('/messages');
              break;
            case 'generate-report':
              setIsReportModalOpen(true);
              break;
            case 'check-conflicts':
              navigate('/planning', { state: { openConflicts: true } });
              break;
            case 'backup-data':
              navigate('/settings', { state: { activeTab: 'data' } });
              break;
            case 'import-data':
              navigate('/settings', { state: { activeTab: 'data' } });
              break;
            case 'sync-sheets':
              navigate('/settings', { state: { activeTab: 'data' } });
              break;
            case 'export-all-data':
              navigate('/settings', { state: { activeTab: 'data' } });
              break;
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
