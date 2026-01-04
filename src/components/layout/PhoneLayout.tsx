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
  Zap,
  FileText,
  Bell,
} from 'lucide-react';
import { IOSTabBar } from '@/components/navigation/IOSTabBar';
import { usePlatformContext } from '@/contexts/PlatformContext';
import { cn } from '@/utils/cn';
import { QuickActionsModal } from '@/components/ui/QuickActionsModal';
import { ReportGeneratorModal } from '@/components/reports/ReportGeneratorModal';
import { useToast } from '@/contexts/ToastContext';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';

const NAV_ITEMS = [
  { path: '/', label: 'Accueil', icon: LayoutDashboard },
  { path: '/planning', label: 'Planning', icon: Calendar },
  { path: '/messages', label: 'Messages', icon: MessageSquare },
  { path: '/speakers', label: 'Orateurs', icon: Users },
  { path: '/settings', label: 'Paramètres', icon: Settings },
];

export const PhoneLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { deviceType, orientation, isPhoneS25Ultra } = usePlatformContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { visits } = useData();
  const { addToast } = useToast();
  const { settings, setTheme } = useSettings();
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const isPhone = deviceType === 'phone';
  const isLandscape = orientation === 'landscape';
  const isDarkMode = settings.theme === 'dark';
  const toggleTheme = () => setTheme(settings.theme === 'dark' ? 'light' : 'dark');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

  if (!isPhone) {
    // Fallback vers le layout tablette si ce n'est pas un téléphone
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

  // Layout optimisé pour Samsung S25 Ultra
  if (isPhoneS25Ultra) {
    return (
      <div
        className={cn(
          'flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden',
          's25-ultra-optimized'
        )}
      >
        {/* Header avec hamburger menu */}
        <header className='flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50'>
          <button
            onClick={toggleSidebar}
            className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            title={isSidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isSidebarOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>

          <div className='flex flex-col items-center'>
            <div className='text-[18px] font-bold tracking-widest leading-none text-blue-600 dark:text-blue-400'>
              KBV
            </div>
            <div className='text-[9px] font-bold leading-none text-blue-500 dark:text-blue-300'>
              LYON
            </div>
          </div>

          <button
            className='s25-touch-zone p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            title='Notifications'
          >
            <Bell className='w-6 h-6' />
          </button>
        </header>

        {/* Sidebar overlay */}
        {/* Premium Sidebar overlay */}
        {isSidebarOpen && (
          <div className='fixed inset-0 z-50 flex'>
            <div
              className='fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity'
              onClick={toggleSidebar}
            />
            <aside className='relative flex-shrink-0 w-[85vw] max-w-[320px] bg-slate-900 shadow-2xl overflow-hidden flex flex-col'>
              {/* Ambient Background */}
              <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0'>
                <div className='absolute top-[-10%] left-[-20%] w-[80%] h-[30%] bg-blue-500/10 blur-[80px] rounded-full'></div>
                <div className='absolute bottom-[-10%] right-[-20%] w-[80%] h-[30%] bg-indigo-500/10 blur-[80px] rounded-full'></div>
              </div>

              {/* Premium Header */}
              <div className='relative z-10 flex items-center justify-between h-24 px-6 border-b border-white/5 pt-4'>
                <div className='flex flex-col gap-1'>
                  <div className='text-[10px] font-black tracking-[0.3em] uppercase text-slate-500'>
                    GROUPE DE
                  </div>
                  <div className='text-3xl font-black tracking-tighter leading-none text-white drop-shadow-lg transform scale-y-90'>
                    LYON
                  </div>
                </div>
                <button
                  onClick={toggleSidebar}
                  className='s25-touch-zone p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors'
                  title='Fermer le menu'
                >
                  <X className='w-6 h-6' />
                </button>
              </div>

              {/* Navigation */}
              <nav className='relative z-10 flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar'>
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center p-4 rounded-xl transition-all duration-200 group relative overflow-hidden',
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/40'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'w-6 h-6 mr-4 transition-colors',
                        location.pathname === item.path
                          ? 'text-white'
                          : 'text-slate-500 group-hover:text-white'
                      )}
                    />
                    <span className='font-bold text-lg tracking-wide'>{item.label}</span>
                    {location.pathname === item.path && (
                      <div className='absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full blur-[1px]'></div>
                    )}
                  </button>
                ))}

                <div className='my-6 border-t border-white/5 mx-2'></div>

                {/* Quick Actions Buttons */}
                <div className='space-y-3'>
                  <button
                    onClick={() => {
                      setIsQuickActionsOpen(true);
                      setIsSidebarOpen(false);
                    }}
                    className='w-full flex items-center p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all border border-white/5 group'
                  >
                    <div className='p-2 bg-amber-500/10 rounded-lg mr-4 group-hover:scale-110 transition-transform'>
                      <Zap className='w-6 h-6 text-amber-500' />
                    </div>
                    <span className='font-bold text-slate-300 group-hover:text-white'>
                      Actions rapides
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsReportModalOpen(true);
                      setIsSidebarOpen(false);
                    }}
                    className='w-full flex items-center p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all border border-white/5 group'
                  >
                    <div className='p-2 bg-blue-500/10 rounded-lg mr-4 group-hover:scale-110 transition-transform'>
                      <FileText className='w-6 h-6 text-blue-500' />
                    </div>
                    <span className='font-bold text-slate-300 group-hover:text-white'>
                      Rapports
                    </span>
                  </button>
                </div>
              </nav>

              {/* Footer */}
              <div className='relative z-10 p-6 border-t border-white/5 bg-slate-900'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-slate-500 uppercase tracking-widest'>
                    Mode sombre
                  </span>
                  <button
                    onClick={toggleTheme}
                    title={isDarkMode ? 'Désactiver le mode clair' : 'Activer le mode sombre'}
                    className={cn(
                      'relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
                      isDarkMode ? 'bg-blue-600' : 'bg-slate-700'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
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
        <main
          className={cn(
            'flex-1 overflow-y-auto',
            isLandscape && isPhoneS25Ultra ? 'pt-0' : 'pt-4',
            !isLandscape && 'pb-[83px]'
          )}
        >
          <div className={cn('h-full', isLandscape && isPhoneS25Ultra ? 's25-landscape' : 'px-4')}>
            <Outlet />
          </div>
        </main>

        {/* Tab bar iOS - seulement en mode portrait et si sidebar fermée */}
        {!isLandscape && !isSidebarOpen && <IOSTabBar />}

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
  }

  // Layout mobile standard (non-S25 Ultra)
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
};
