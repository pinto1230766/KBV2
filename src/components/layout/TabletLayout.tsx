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
  ChevronRight,
  Zap,
  FileText,
} from 'lucide-react';
import { IOSTabBar } from '@/components/navigation/IOSTabBar';
import { SPenCursor } from '@/components/spen/SPenCursor';
import { usePlatformContext } from '@/contexts/PlatformContext';
import { cn } from '@/utils/cn';
import { QuickActionsModal } from '@/components/ui/QuickActionsModal';
import { ReportGeneratorModal } from '@/components/reports/ReportGeneratorModal';
import { useToast } from '@/contexts/ToastContext';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';

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
  const { visits } = useData();
  const { addToast } = useToast();
  const { settings, setTheme } = useSettings();
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const isTablet = deviceType === 'tablet';
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

    // Helper pour formater la date de manière cohérente (JJ/MM/AAAA)
    const formatDate = (date: string | Date) => new Date(date).toLocaleDateString('fr-FR');

    // Helper pour échapper les caractères spéciaux CSV (virgules, guillemets, sauts de ligne)
    const escapeCsv = (value: any) => {
      const str = String(value || '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    if (config.format === 'csv') {
      let csvContent = 'Date,Orateur,Congrégation,Discours,Thème,Hôte,Statut\n';
      filteredVisits.forEach((v) => {
        csvContent += `${formatDate(v.visitDate)},${escapeCsv(v.nom)},${escapeCsv(v.congregation)},${escapeCsv(v.talkNoOrType)},${escapeCsv(v.talkTheme)},${escapeCsv(v.host)},${escapeCsv(v.status)}\n`;
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
        htmlContent += `<tr><td>${formatDate(v.visitDate)}</td><td>${v.nom}</td><td>${v.congregation}</td><td>${v.talkNoOrType || ''}</td><td>${v.talkTheme || ''}</td><td>${v.host || ''}</td><td>${v.status}</td></tr>`;
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

  const currentIndex = NAV_ITEMS.findIndex((item) => item.path === location.pathname);
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

  return (
    <SPenCursor>
      <div className='flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden samsung-optimized w-screen max-w-none'>
        {/* Sidebar - Cache en mode portrait si pliée */}
        {/* Premium Tablet Sidebar */}
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

            <div className='my-6 border-t border-white/5 mx-2'></div>

            {/* Action Buttons */}
            <div className='space-y-2'>
              <button
                onClick={() => setIsQuickActionsOpen(true)}
                className={cn(
                  'w-full flex items-center rounded-xl transition-all duration-200 group border border-transparent hover:border-white/5',
                  isSidebarOpen
                    ? 'px-4 py-3 bg-slate-800/50 hover:bg-slate-800'
                    : 'px-0 py-3 justify-center hover:bg-slate-800'
                )}
                title={!isSidebarOpen ? 'Actions rapides' : undefined}
              >
                <div
                  className={cn(
                    'bg-amber-500/10 rounded-lg group-hover:scale-110 transition-transform',
                    isSidebarOpen ? 'p-2 mr-3' : 'p-2'
                  )}
                >
                  <Zap className='w-5 h-5 text-amber-500' />
                </div>
                {isSidebarOpen && (
                  <span className='font-bold text-slate-300 group-hover:text-white'>Actions</span>
                )}
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className={cn(
                  'w-full flex items-center rounded-xl transition-all duration-200 group border border-transparent hover:border-white/5',
                  isSidebarOpen
                    ? 'px-4 py-3 bg-slate-800/50 hover:bg-slate-800'
                    : 'px-0 py-3 justify-center hover:bg-slate-800'
                )}
                title={!isSidebarOpen ? 'Rapports' : undefined}
              >
                <div
                  className={cn(
                    'bg-blue-500/10 rounded-lg group-hover:scale-110 transition-transform',
                    isSidebarOpen ? 'p-2 mr-3' : 'p-2'
                  )}
                >
                  <FileText className='w-5 h-5 text-blue-500' />
                </div>
                {isSidebarOpen && (
                  <span className='font-bold text-slate-300 group-hover:text-white'>Rapports</span>
                )}
              </button>
            </div>
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
                  {currentIndex + 1} / 5
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
          {/* Contenu principal - Pleine largeur sur tablette */}
          <main className='flex-1 overflow-hidden pt-4'>
            <div className='h-full overflow-y-auto'>
              <Outlet />
            </div>
          </main>

          {/* Tab bar iOS - seulement en mode portrait */}
          {!isLandscape && <IOSTabBar />}
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
    </SPenCursor>
  );
};
