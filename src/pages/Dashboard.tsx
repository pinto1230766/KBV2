import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { Users, Calendar, AlertCircle, TrendingUp, Clock, Zap, CalendarPlus, UserPlus, MessageSquare, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { usePlatformContext } from '@/contexts/PlatformContext';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { PullToRefreshIndicator } from '@/components/ui/PullToRefreshIndicator';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { useNavigate } from 'react-router-dom';
import { Visit } from '@/types';

import { isLowMemoryDevice } from '@/utils/mobileOptimization';
import { QuickActionsModal } from '@/components/ui/QuickActionsModal';
import { ReportGeneratorModal } from '@/components/reports/ReportGeneratorModal';
import { VisitActionModal } from '@/components/planning/VisitActionModal';

// Memoized components for performance
const VisitItem = memo(({ 
  visit, 
  onClick,
  showStatus = false
}: { 
  visit: Visit; 
  onClick?: () => void;
  showStatus?: boolean;
}) => {
  const getStatusBadge = () => {
    switch (visit.status) {
      case 'confirmed':
        return <Badge variant="success" className="text-xs">Confirmé</Badge>;
      case 'pending':
        return <Badge variant="warning" className="text-xs">En attente</Badge>;
      case 'completed':
        return <Badge variant="default" className="text-xs">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="danger" className="text-xs">Annulé</Badge>;
      default:
        return null;
    }
  };

  return (
    <div 
      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
          {visit.nom.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{visit.nom}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            })} à {visit.visitTime}
          </p>
          {visit.talkTheme && (
            <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">
              N°{visit.talkNoOrType} - {visit.talkTheme}
            </p>
          )}
        </div>
      </div>
      {showStatus && getStatusBadge()}
    </div>
  );
});

export const Dashboard: React.FC = () => {
  const { visits, speakers, hosts } = useData();
  const { addToast } = useToast();
  const { deviceType, orientation, isPhoneS25Ultra } = usePlatformContext();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [isVisitActionModalOpen, setIsVisitActionModalOpen] = useState(false);

  const handleVisitClick = useCallback((visit: Visit) => {
    setSelectedVisit(visit);
    setIsVisitActionModalOpen(true);
  }, []);

  const isTablet = deviceType === 'tablet';
  // Détection spécifique Samsung Tab S10 Ultra (ajusté pour le scaling Chrome: 1200px au lieu de 1848px)
  const isSamsungTablet = isTablet && window.innerWidth >= 1200;
  
  // Pull-to-refresh
  const { isRefreshing, pullDistance } = usePullToRefresh({
    onRefresh: async () => {
      // Le rafraîchissement sera géré par le contexte de données
      window.location.reload();
    },
  });
  
  // Écouter les changements de connexion
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Device detection for mobile optimizations
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isLowEndDevice = isLowMemoryDevice();

  // Memoized calculations
  const dateCalculations = useMemo(() => {
    const today = new Date();
    // Reset hours to compare just dates if needed, but keeping time is fine for "upcoming"
    today.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    
    // Fallback: If end of month is very close (e.g. last few days), maybe show next 30 days?
    // User asked "prochaines visites du mois", implying current month scope.
    // I will stick to End of Month as requested. 
    return { today, endOfMonth };
  }, []);

  const upcomingVisits = useMemo(() => {
    return visits.filter((visit: Visit) => {
      const visitDate = new Date(visit.visitDate);
      // Visits from today until end of month
      return visitDate >= dateCalculations.today && 
             visitDate <= dateCalculations.endOfMonth && 
             (visit.status === 'confirmed' || visit.status === 'pending');
    }).sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime());
  }, [visits, dateCalculations]);

  const visitsNeedingAction = useMemo(() => {
    return visits.filter((visit: Visit) =>
      visit.status === 'pending' ||
      (visit.status === 'confirmed' && new Date(visit.visitDate) < dateCalculations.today)
    );
  }, [visits, dateCalculations]);

  const currentMonthVisits = useMemo(() => {
    const now = dateCalculations.today;
    return visits.filter((v: Visit) => {
      const visitDate = new Date(v.visitDate);
      return visitDate.getMonth() === now.getMonth() && 
             visitDate.getFullYear() === now.getFullYear();
    }).length;
  }, [visits, dateCalculations]);

  const stats = useMemo(() => [
    {
      label: 'Orateurs actifs',
      value: speakers.length,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      trend: '+2 ce mois'
    },
    {
      label: "Contacts d'accueil",
      value: hosts.length,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/20',
      trend: '+1 cette semaine'
    },
    {
      label: 'Visites ce mois',
      value: currentMonthVisits,
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      trend: '+15%'
    },
    {
      label: 'Actions requises',
      value: visitsNeedingAction.length,
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      trend: visitsNeedingAction.length > 0 ? 'Urgent' : 'À jour'
    },
  ], [speakers.length, hosts.length, currentMonthVisits, visitsNeedingAction.length]);

  const monthlyData = useMemo(() => {
    const data = [];
    const now = dateCalculations.today;

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthVisits = visits.filter((visit: Visit) => {
        const visitDate = new Date(visit.visitDate);
        return visitDate.getMonth() === date.getMonth() && 
               visitDate.getFullYear() === date.getFullYear();
      }).length;

      data.push({
        name: date.toLocaleDateString('fr-FR', { month: 'short' }),
        visites: monthVisits
      });
    }

    return data;
  }, [visits, dateCalculations]);

  const pieData = useMemo(() => [
    { name: 'Physique', value: visits.filter((v: Visit) => v.locationType === 'physical').length, color: '#3B82F6' },
    { name: 'Zoom', value: visits.filter((v: Visit) => v.locationType === 'zoom').length, color: '#10B981' },
    { name: 'Streaming', value: visits.filter((v: Visit) => v.locationType === 'streaming').length, color: '#F59E0B' }
  ], [visits]);

  // Keyboard shortcut for Quick Actions (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickActionsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Memoized event handlers
  const handleNavigateToPlanning = useCallback(() => navigate('/planning'), [navigate]);

  return (
    <>
      <div className={cn(
        "h-full",
        isPhoneS25Ultra && "s25-ultra-optimized",
        isTablet ? 'flex flex-col space-y-3 pb-4' : isMobile ? 'space-y-4' : 'space-y-6',
        isTablet && orientation === 'landscape' ? 'px-4' : isTablet ? 'px-4' : 'px-4',
        isLowEndDevice && 'optimize-rendering'
      )}>
      {/* Pull to Refresh Indicator */}
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />
      
      {/* Offline Banner */}
      <OfflineBanner isOnline={isOnline} />

      {/* Stats Cards - Optimisé pour tous les appareils Samsung */}
      <div className={`flex-shrink-0 grid gap-3 sm:gap-6 ${
        isPhoneS25Ultra ? 'grid-cols-2' :
        isMobile ? 'grid-cols-2' : 
        deviceType === 'tablet' && orientation === 'landscape' ? 'grid-cols-4' :
        deviceType === 'tablet' ? 'grid-cols-4' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      }`}>
        {stats.map((stat, index) => (
          <Card 
            key={stat.label} 
            hoverable 
            className={cn(
              "relative overflow-hidden cursor-pointer",
              isPhoneS25Ultra && "s25-card"
            )}
            onClick={() => {
              if (index === 0 || index === 1) navigate('/speakers');
              else if (index === 2 || index === 3) navigate('/planning');
            }}
          >
            <CardBody className="flex items-center">
              <div className={`p-2 sm:p-3 rounded-xl ${stat.bg} mr-3 sm:mr-4`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.trend}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Main Content Area - Optimisé pour Samsung Tab S10 Ultra */}
      <div className={`
        grid gap-4 sm:gap-6
        ${isTablet && isSamsungTablet && orientation === 'landscape' ? 'grid-cols-12' : 'grid-cols-1 lg:grid-cols-12'}
      `}>
        
        {/* Row 1 - Left: Evolution Mensuelle (8/12) */}
        <div className={`
          ${isTablet && isSamsungTablet && orientation === 'landscape' ? 'col-span-8' : 'col-span-1 lg:col-span-8'}
        `}>
          <Card className="h-full">
            <CardHeader>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                Évolution mensuelle
              </h3>
            </CardHeader>
            <CardBody>
              <div className={`${isMobile ? 'h-48' : 'h-64'} w-full`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="visites" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Row 1 - Right: Prochaines Visites (4/12) */}
        <div className={`
          ${isTablet && isSamsungTablet && orientation === 'landscape' ? 'col-span-4' : 'col-span-1 lg:col-span-4'}
        `}>
          <Card className="h-full flex flex-col">
            <CardHeader className="flex items-center justify-between flex-shrink-0">
              <h3 className="text-sm md:text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Prochaines visites
              </h3>
              <Button variant="secondary" size="sm" onClick={handleNavigateToPlanning}>
                Voir tout
              </Button>
            </CardHeader>
            <CardBody className="flex-1 overflow-y-auto min-h-[200px]">
              {upcomingVisits.length > 0 ? (
                <div className="space-y-3">
                  {upcomingVisits.slice(0, 5).map((visit: Visit) => (
                    <VisitItem key={visit.id} visit={visit} onClick={() => handleVisitClick(visit)} showStatus={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="font-medium text-sm">Aucune visite</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Row 2 - Left: Répartition & Accès Rapide (4/12) */}
        <div className={`
          ${isTablet && isSamsungTablet && orientation === 'landscape' ? 'col-span-4' : 'col-span-1 lg:col-span-4'}
          flex flex-col gap-4 sm:gap-6
        `}>
          {/* Card 1: Répartition - Compacte */}
          <Card>
            <CardHeader className="py-3">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Répartition
              </h3>
            </CardHeader>
            <CardBody className="py-2">
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-3 mt-1 pb-2">
                {pieData.map((item) => {
                  const dotClass = item.name === 'Physique' ? 'bg-blue-500' : item.name === 'Zoom' ? 'bg-green-500' : 'bg-amber-500';
                  return (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Card 2: Accès Rapide */}
          <Card className="flex-1">
            <CardHeader className="py-3">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Accès Rapide
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="secondary" 
                  className="h-auto py-3 flex flex-col gap-2 items-center justify-center text-center hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 dark:hover:bg-primary-900/20"
                  onClick={() => setIsVisitActionModalOpen(true)}
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                    <CalendarPlus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">Nouvelle Visite</span>
                </Button>

                <Button 
                  variant="secondary" 
                  className="h-auto py-3 flex flex-col gap-2 items-center justify-center text-center hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 dark:hover:bg-primary-900/20"
                  onClick={() => navigate('/speakers')}
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">Nouvel Orateur</span>
                </Button>

                <Button 
                  variant="secondary" 
                  className="h-auto py-3 flex flex-col gap-2 items-center justify-center text-center hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 dark:hover:bg-primary-900/20"
                  onClick={() => navigate('/messages')}
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">Messages</span>
                </Button>

                <Button 
                  variant="secondary" 
                  className="h-auto py-3 flex flex-col gap-2 items-center justify-center text-center hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 dark:hover:bg-primary-900/20"
                  onClick={() => setIsReportModalOpen(true)}
                >
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">Rapports</span>
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Row 2 - Right: Actions Requises (8/12) - AGRANDI */}
        <div className={`
          ${isTablet && isSamsungTablet && orientation === 'landscape' ? 'col-span-8' : 'col-span-1 lg:col-span-8'}
        `}>
          <Card className="h-full flex flex-col">
            <CardHeader className="flex items-center justify-between flex-shrink-0">
              <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
                Actions requises
              </h3>
              {visitsNeedingAction.length > 0 && (
                <Badge variant="danger" className="text-xs">
                  {visitsNeedingAction.length} alerte{visitsNeedingAction.length > 1 ? 's' : ''}
                </Badge>
              )}
            </CardHeader>
            <CardBody className="flex-1 overflow-y-auto min-h-[250px]">
              <div className="space-y-3">
                {visitsNeedingAction.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {visitsNeedingAction.slice(0, 10).map((visit: Visit) => (
                      <div key={visit.id} className="flex items-center justify-between p-3 border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                        <div className="flex items-center gap-3 cursor-pointer overflow-hidden" onClick={() => handleVisitClick(visit)}>
                          <AlertCircle className="w-8 h-8 text-orange-500 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {visit.status === 'pending' ? 'Validation requise' : 'Visite passée'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {visit.nom}
                            </p>
                            <p className="text-xs text-orange-600 dark:text-orange-400">
                              {new Date(visit.visitDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                            </p>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleVisitClick(visit); }}>
                          Traiter
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-full">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="font-medium text-lg">Aucune action requise</p>
                    <p className="text-sm mt-1">Tout est à jour !</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

      </div>
      </div>

      {/* Modals */}
      {selectedVisit && (
        <VisitActionModal
          isOpen={isVisitActionModalOpen}
          onClose={() => setIsVisitActionModalOpen(false)}
          visit={selectedVisit}
          action="edit"
        />
      )}
      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onAction={(action) => {
          setIsQuickActionsOpen(false);
          // Rediriger vers la page appropriée selon l'action
          switch(action) {
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
            case 'import-data':
              navigate('/settings');
              break;
            case 'sync-sheets':
              navigate('/settings');
              addToast('Synchronisation Google Sheets lancée...', 'info');
              break;
            case 'export-all-data':
              navigate('/settings');
              addToast('Exportation de toutes les données lancée...', 'info');
              break;
            case 'search-entities':
              // Assuming a search page or integrating search into an existing page
              navigate('/planning'); // Redirect to planning for now, as it involves entities
              addToast('Redirection vers la recherche d\'entités', 'info');
              break;
            case 'show-statistics':
              // Since we are already on the dashboard, a toast for now.
              // Ideally, this would open a dedicated statistics view or enhance the current one.
              addToast('Affichage des statistiques...', 'info');
              break;
          }
        }}
      />
      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onGenerate={(config) => {
          const filteredVisits = visits.filter(v => {
            if (config.period === 'current-month') {
              const now = new Date();
              const visitDate = new Date(v.visitDate);
              return visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear();
            }
            return true;
          });
          
          const fileName = `rapport-kbv-${new Date().toISOString().slice(0, 10)}`;
          
          if (config.format === 'csv') {
            let csvContent = 'Date,Orateur,Congrégation,Discours,Thème,Hôte,Statut\n';
            filteredVisits.forEach(v => {
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
            filteredVisits.forEach(v => {
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
            filteredVisits.forEach(v => {
              htmlContent += `<tr><td>${new Date(v.visitDate).toLocaleDateString('fr-FR')}</td><td>${v.nom}</td><td>${v.congregation}</td><td>${v.talkNoOrType || ''}</td><td>${v.talkTheme || ''}</td><td>${v.host || ''}</td><td>${v.status}</td></tr>`;
            });
            htmlContent += '</table><p style="margin-top:30px;color:#666;">Total: ' + filteredVisits.length + ' visite(s)</p></body></html>';
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
        }}
      />
    </>
  );
};
