import React, { memo, useMemo, useCallback, useState } from 'react';
import { Users, Calendar, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '@/contexts/DataContext';
import { usePlatformContext } from '@/contexts/PlatformContext';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PullToRefreshIndicator } from '@/components/ui/PullToRefreshIndicator';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { useNavigate } from 'react-router-dom';
import { Visit } from '@/types';

import { isLowMemoryDevice, getOptimalListHeight } from '@/utils/mobileOptimization';

// Memoized components for performance
const VisitItem = memo(({ 
  visit, 
  onClick,
  showStatus = false
}: { 
  visit: Visit; 
  onClick?: () => void;
  showStatus?: boolean;
}) => (
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
          })} à {visit.visitTime} • {visit.talkNoOrType}
        </p>
      </div>
    </div>
    {showStatus && (
      <Badge variant="success" className="text-xs">
        Confirmé
      </Badge>
    )}
  </div>
));

export const Dashboard: React.FC = () => {
  const { speakers, hosts, visits, refreshData } = useData();
  const { deviceType, orientation } = usePlatformContext();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const isTablet = deviceType === 'tablet';
  
  // Pull-to-refresh
  const { isRefreshing, pullDistance } = usePullToRefresh({
    onRefresh: async () => {
      if (refreshData) {
        await refreshData();
      }
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
  const optimalHeight = getOptimalListHeight();

  // Memoized calculations
  const dateCalculations = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return { today, nextWeek };
  }, []);

  const upcomingVisits = useMemo(() => {
    return visits.filter(visit => {
      const visitDate = new Date(visit.visitDate);
      return visitDate >= dateCalculations.today && 
             visitDate <= dateCalculations.nextWeek && 
             visit.status === 'confirmed';
    });
  }, [visits, dateCalculations]);

  const visitsNeedingAction = useMemo(() => {
    return visits.filter(visit =>
      visit.status === 'pending' ||
      (visit.status === 'confirmed' && new Date(visit.visitDate) < dateCalculations.today)
    );
  }, [visits, dateCalculations]);

  const currentMonthVisits = useMemo(() => {
    const now = dateCalculations.today;
    return visits.filter(v => {
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
      const monthVisits = visits.filter(visit => {
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
    { name: 'Physique', value: visits.filter(v => v.locationType === 'physical').length, color: '#3B82F6' },
    { name: 'Zoom', value: visits.filter(v => v.locationType === 'zoom').length, color: '#10B981' },
    { name: 'Streaming', value: visits.filter(v => v.locationType === 'streaming').length, color: '#F59E0B' }
  ], [visits]);

  // Memoized event handlers
  const handleNavigateToPlanning = useCallback(() => navigate('/planning'), [navigate]);

  // Auto-update timestamp (memoized to avoid re-renders)
  const lastUpdate = useMemo(() => {
    return new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  return (
    <div className={`
      ${isTablet ? 'h-full flex flex-col space-y-4 pb-4' : isMobile ? 'space-y-4' : 'space-y-6'} 
      ${isLowEndDevice ? 'optimize-rendering' : ''}
    `}>
      {/* Pull to Refresh Indicator */}
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />
      
      {/* Offline Banner */}
      <OfflineBanner isOnline={isOnline} />
      
      {/* Header - Fixed on Tablet */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de bord
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Vue d'ensemble de l'activité de la congrégation
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Dernière mise à jour: {lastUpdate}
          </span>
        </div>
      </div>

      {/* Stats Cards - Fixed height on Tablet */}
      <div className={`flex-shrink-0 grid gap-3 sm:gap-6 ${
        isMobile ? 'grid-cols-2' : 
        deviceType === 'tablet' && orientation === 'landscape' ? 'grid-cols-4' :
        deviceType === 'tablet' ? 'grid-cols-4' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      }`}>
        {stats.map((stat, index) => (
          <Card 
            key={stat.label} 
            hoverable 
            className="relative overflow-hidden cursor-pointer"
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

      {/* Main Content Area - Scrollable internal on Tablet */}
      <div className={`
        ${isTablet ? 'flex-1 min-h-0 grid gap-6 overflow-hidden' : 'grid gap-4 sm:gap-6'}
        ${isTablet && orientation === 'landscape' ? 'grid-cols-12' : isTablet ? 'grid-cols-1' : ''}
      `}>
        
        {/* Left Column (Charts) - 7/12 on Tablet Landscape */}
        <div className={`
          ${isTablet && orientation === 'landscape' ? 'col-span-7 flex flex-col gap-6 overflow-y-auto pr-1' : 'grid gap-4 sm:gap-6'}
          ${!isTablet && !isMobile ? 'grid-cols-1 lg:grid-cols-3' : (!isTablet ? 'grid-cols-1' : '')} 
        `}>
          <Card className={`${
            (isTablet && orientation === 'landscape') || (!isMobile && !isTablet) ? 'lg:col-span-2' : ''
          }`}>
            <CardHeader>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                Évolution mensuelle
              </h3>
            </CardHeader>
            <CardBody>
              <div className={`${isMobile ? 'h-64' : 'h-80'} w-full`}>
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

          <Card>
            <CardHeader>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                Répartition
              </h3>
            </CardHeader>
            <CardBody>
              <div className={`${isMobile ? 'h-48' : 'h-64'} w-full`}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 30 : 50}
                      outerRadius={isMobile ? 60 : 80}
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
              <div className="flex flex-col gap-2 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column (Lists) - 5/12 on Tablet Landscape */}
        <div className={`
          ${isTablet && orientation === 'landscape' ? 'col-span-5 flex flex-col gap-6 overflow-y-auto pr-1' : 'grid gap-4 sm:gap-6'}
          ${!isTablet && !isMobile ? 'grid-cols-1 lg:grid-cols-2' : (!isTablet ? 'grid-cols-1' : '')}
        `}>
          {/* Upcoming Visits */}
          <Card className={isTablet ? 'flex-1 flex flex-col' : ''}>
            <CardHeader className="flex items-center justify-between flex-shrink-0">
              <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                Prochaines visites
              </h3>
              <Button variant="secondary" size="sm" onClick={handleNavigateToPlanning}>
                Voir tout
              </Button>
            </CardHeader>
            <CardBody className={isTablet ? 'flex-1 overflow-auto min-h-0' : ''}>
              {upcomingVisits.length > 0 ? (
                <div className={`space-y-3 ${isTablet ? '' : isMobile ? 'max-h-64' : 'max-h-80 overflow-y-auto'}`}>
                  {upcomingVisits.slice(0, isTablet ? 10 : isMobile ? 3 : 5).map((visit) => (
                    <VisitItem key={visit.id} visit={visit} onClick={handleNavigateToPlanning} showStatus={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">Aucune visite programmée</p>
                  <p className="text-sm mt-1">dans les 7 prochains jours</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Actions Required */}
          <Card className={isTablet ? 'flex-1 flex flex-col' : ''}>
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
            <CardBody className={isTablet ? 'flex-1 overflow-auto min-h-0' : ''}>
              {visitsNeedingAction.length > 0 ? (
                <div className="space-y-3" style={!isTablet ? { maxHeight: optimalHeight, overflowY: 'auto' } : {}}>
                  {visitsNeedingAction.slice(0, isTablet ? 10 : isMobile ? 3 : 5).map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between p-3 border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={handleNavigateToPlanning}>
                        <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {visit.status === 'pending' ? 'Validation requise' : 'Visite passée'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {visit.nom} • {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/planning'); }}>
                        Traiter
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">Aucune action requise</p>
                  <p className="text-sm mt-1">Toutes les visites sont à jour</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
