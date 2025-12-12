/**
 * Composants de statistiques avancées pour le Dashboard KBV Lyon
 * Graphiques de tendance, KPIs personnalisables, alertes intelligentes
 */

import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ReferenceLine, Brush
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight,
  Bell, AlertTriangle, CheckCircle, Info, Eye, EyeOff,
  Calendar, Users, MapPin, Clock, Activity
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import styles from './AdvancedStats.module.css';
import { Visit, Speaker, Host } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface KPIConfig {
  id: string;
  label: string;
  value: number;
  previousValue?: number;
  target?: number;
  format?: 'number' | 'percentage' | 'currency' | 'time';
  icon?: React.ElementType;
  color?: string;
  visible?: boolean;
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

export interface AlertConfig {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================================
// UTILITAIRES DE CALCUL
// ============================================================================

export const calculateTrend = (current: number, previous: number): {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
} => {
  if (previous === 0) {
    return { direction: current > 0 ? 'up' : 'stable', percentage: 100 };
  }
  const diff = current - previous;
  const percentage = Math.round((diff / previous) * 100);
  
  if (percentage > 5) return { direction: 'up', percentage };
  if (percentage < -5) return { direction: 'down', percentage: Math.abs(percentage) };
  return { direction: 'stable', percentage: Math.abs(percentage) };
};

export const formatKPIValue = (value: number, format: KPIConfig['format'] = 'number'): string => {
  switch (format) {
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'currency':
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
    case 'time':
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    default:
      return new Intl.NumberFormat('fr-FR').format(value);
  }
};

// ============================================================================
// COMPOSANT KPI CARD
// ============================================================================

interface KPICardProps {
  kpi: KPIConfig;
  onToggleVisibility?: (id: string) => void;
  compact?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi, onToggleVisibility, compact = false }) => {
  const trend = useMemo(() => {
    if (kpi.previousValue === undefined) return null;
    return calculateTrend(kpi.value, kpi.previousValue);
  }, [kpi.value, kpi.previousValue]);

  const progress = useMemo(() => {
    if (!kpi.target) return null;
    return Math.min(100, (kpi.value / kpi.target) * 100);
  }, [kpi.value, kpi.target]);

  const Icon = kpi.icon || Activity;
  const colorClass = kpi.color || 'text-primary-600';
  const bgClass = kpi.color?.replace('text-', 'bg-').replace('-600', '-100') || 'bg-primary-100';

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className={cn("p-2 rounded-lg", bgClass, "dark:bg-opacity-20")}>
          <Icon className={cn("w-4 h-4", colorClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{kpi.label}</p>
          <p className="font-bold text-gray-900 dark:text-white">
            {formatKPIValue(kpi.value, kpi.format)}
          </p>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend.direction === 'up' ? 'text-green-600' : 
            trend.direction === 'down' ? 'text-red-600' : 'text-gray-500'
          )}>
            {trend.direction === 'up' && <ArrowUpRight className="w-3 h-3" />}
            {trend.direction === 'down' && <ArrowDownRight className="w-3 h-3" />}
            {trend.direction === 'stable' && <Minus className="w-3 h-3" />}
            {trend.percentage}%
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {onToggleVisibility && (
        <button
          onClick={() => onToggleVisibility(kpi.id)}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {kpi.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )}
      <CardBody className="p-4">
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-xl", bgClass, "dark:bg-opacity-20")}>
            <Icon className={cn("w-6 h-6", colorClass)} />
          </div>
          <div className={styles.chartContainer}>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {kpi.label}
            </p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatKPIValue(kpi.value, kpi.format)}
              </span>
              {trend && (
                <span className={cn(
                  "flex items-center gap-0.5 text-sm font-medium pb-0.5",
                  trend.direction === 'up' ? 'text-green-600' : 
                  trend.direction === 'down' ? 'text-red-600' : 'text-gray-500'
                )}>
                  {trend.direction === 'up' && <TrendingUp className="w-4 h-4" />}
                  {trend.direction === 'down' && <TrendingDown className="w-4 h-4" />}
                  {trend.direction === 'stable' && <Minus className="w-4 h-4" />}
                  {trend.percentage}%
                </span>
              )}
            </div>
            {progress !== null && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Objectif: {formatKPIValue(kpi.target!, kpi.format)}</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={styles.progressBar}>
                    <div 
                      className={cn(
                        styles.progressBarFill,
                        `progressBarFillWidth${Math.round(Math.min(100, progress) / 10) * 10}`,
                        progress >= 100 ? styles.complete : 
                        progress >= 75 ? styles.high : 
                        progress >= 50 ? styles.medium : styles.low
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// ============================================================================
// COMPOSANT TREND CHART
// ============================================================================

interface TrendChartProps {
  data: TrendData[];
  title: string;
  color?: string;
  showArea?: boolean;
  showBrush?: boolean;
  height?: number;
  target?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  title,
  color = '#4F46E5',
  showArea = false,
  showBrush = false,
  target
}) => {
  const ChartType = showArea ? AreaChart : LineChart;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          {title}
        </h3>
      </CardHeader>
      <CardBody>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <ChartType data={data} className={styles.trendChart}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip 
                contentStyle={{
                  borderRadius: '8px', 
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ fontWeight: 600 }}
              />
              {showArea ? (
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color}
                  fillOpacity={1} 
                  fill="url(#colorValue)"
                  dot={false}
                />
              ) : (
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              )}
              {target && (
                <ReferenceLine 
                  y={target} 
                  stroke="#EF4444" 
                  strokeDasharray="5 5"
                  label={{
                    value: 'Objectif',
                    position: 'right',
                    style: { 
                      fontSize: 11,
                      fill: '#EF4444'
                    }
                  }}
                />
              )}
              {showBrush && <Brush dataKey="date" height={20} stroke={color} />}
            </ChartType>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};

// ============================================================================
// COMPOSANT MULTI-TREND CHART
// ============================================================================

interface MultiTrendData {
  date: string;
  [key: string]: number | string;
}

interface MultiTrendChartProps {
  data: MultiTrendData[];
  title: string;
  series: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  height?: number;
}

export const MultiTrendChart: React.FC<MultiTrendChartProps> = ({
  data,
  title,
  series,
}) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-4 h-4" />
          {title}
        </h3>
      </CardHeader>
      <CardBody>
        <div className={styles.responsiveHeight}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} className={styles.multiTrendChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6B7280" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              {series.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={{ fill: s.color, r: 3 }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};

// ============================================================================
// COMPOSANT SMART ALERTS
// ============================================================================

interface SmartAlertsProps {
  alerts: AlertConfig[];
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  maxVisible?: number;
}

export const SmartAlerts: React.FC<SmartAlertsProps> = ({
  alerts,
  onDismiss,
  onMarkAsRead,
  maxVisible = 5
}) => {
  const [showAll, setShowAll] = useState(false);
  
  const visibleAlerts = showAll ? alerts : alerts.slice(0, maxVisible);
  const unreadCount = alerts.filter(a => !a.read).length;

  const getAlertIcon = (type: AlertConfig['type']) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'danger': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const getAlertColors = (type: AlertConfig['type']) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/10';
      case 'danger': return 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10';
      case 'success': return 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/10';
      default: return 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/10';
    }
  };

  const getIconColors = (type: AlertConfig['type']) => {
    switch (type) {
      case 'warning': return 'text-yellow-500';
      case 'danger': return 'text-red-500';
      case 'success': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alertes intelligentes
          </h3>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="font-medium">Aucune alerte</p>
            <p className="text-sm">Tout fonctionne parfaitement !</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Alertes intelligentes
          {unreadCount > 0 && (
            <Badge variant="danger" className="text-xs ml-2">
              {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
            </Badge>
          )}
        </h3>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {visibleAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={cn(
                  "p-4 border-l-4 transition-colors",
                  getAlertColors(alert.type),
                  !alert.read && "bg-opacity-100"
                )}
                onClick={() => onMarkAsRead?.(alert.id)}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", getIconColors(alert.type))} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn(
                        "font-medium text-gray-900 dark:text-white",
                        !alert.read && "font-semibold"
                      )}>
                        {alert.title}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(alert.timestamp).toLocaleDateString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {alert.message}
                    </p>
                    {alert.action && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert.action!.onClick();
                        }}
                      >
                        {alert.action.label}
                      </Button>
                    )}
                  </div>
                  {onDismiss && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismiss(alert.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {alerts.length > maxVisible && (
          <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Voir moins' : `Voir ${alerts.length - maxVisible} de plus`}
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

// ============================================================================
// HOOK POUR GÉNÉRER LES ALERTES INTELLIGENTES
// ============================================================================

export const useSmartAlerts = (
  visits: Visit[],
  speakers: Speaker[],
  hosts: Host[]
): AlertConfig[] => {
  return useMemo(() => {
    const alerts: AlertConfig[] = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Alertes pour les visites en attente
    const pendingVisits = visits.filter(v => v.status === 'pending');
    if (pendingVisits.length > 3) {
      alerts.push({
        id: 'pending-visits',
        type: 'warning',
        title: 'Visites en attente',
        message: `${pendingVisits.length} visites attendent une confirmation`,
        timestamp: now,
        action: {
          label: 'Voir les visites',
          onClick: () => window.location.href = '/planning'
        }
      });
    }

    // Alertes pour les visites cette semaine sans hôte
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    
    const upcomingWithoutHost = visits.filter(v => {
      const visitDate = new Date(v.visitDate);
      return visitDate >= today && 
             visitDate <= weekFromNow && 
             v.status === 'confirmed' &&
             !v.host;
    });

    if (upcomingWithoutHost.length > 0) {
      alerts.push({
        id: 'no-host',
        type: 'danger',
        title: 'Hôtes manquants',
        message: `${upcomingWithoutHost.length} visite(s) cette semaine sans hôte assigné`,
        timestamp: now,
        action: {
          label: 'Assigner des hôtes',
          onClick: () => window.location.href = '/planning'
        }
      });
    }

    // Alertes pour les visites passées non marquées comme terminées
    const overdueVisits = visits.filter(v => {
      const visitDate = new Date(v.visitDate);
      return visitDate < today && v.status === 'confirmed';
    });

    if (overdueVisits.length > 0) {
      alerts.push({
        id: 'overdue-visits',
        type: 'warning',
        title: 'Visites à mettre à jour',
        message: `${overdueVisits.length} visite(s) passée(s) encore marquée(s) comme confirmée(s)`,
        timestamp: now,
        action: {
          label: 'Mettre à jour',
          onClick: () => window.location.href = '/planning'
        }
      });
    }

    // Info sur les statistiques positives
    const thisMonthVisits = visits.filter(v => {
      const visitDate = new Date(v.visitDate);
      return visitDate.getMonth() === now.getMonth() && 
             visitDate.getFullYear() === now.getFullYear() &&
             v.status === 'completed';
    });

    if (thisMonthVisits.length >= 4) {
      alerts.push({
        id: 'good-month',
        type: 'success',
        title: 'Excellent mois !',
        message: `${thisMonthVisits.length} visites complétées ce mois. Continuez ainsi !`,
        timestamp: now,
        read: true
      });
    }

    return alerts;
  }, [visits, speakers, hosts]);
};

// ============================================================================
// HOOK POUR CALCULER LES KPIs
// ============================================================================

export const useKPIs = (
  visits: Visit[],
  speakers: Speaker[],
  hosts: Host[]
): KPIConfig[] => {
  return useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    // Visites ce mois
    const thisMonthVisits = visits.filter(v => {
      const d = new Date(v.visitDate);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });

    // Visites mois dernier
    const lastMonthVisits = visits.filter(v => {
      const d = new Date(v.visitDate);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });

    // Taux de confirmation
    const confirmedVisits = thisMonthVisits.filter(v => v.status === 'confirmed' || v.status === 'completed');
    const confirmationRate = thisMonthVisits.length > 0 
      ? (confirmedVisits.length / thisMonthVisits.length) * 100 
      : 0;

    const lastMonthConfirmed = lastMonthVisits.filter(v => v.status === 'confirmed' || v.status === 'completed');
    const lastMonthConfirmationRate = lastMonthVisits.length > 0
      ? (lastMonthConfirmed.length / lastMonthVisits.length) * 100
      : 0;

    return [
      {
        id: 'total-visits',
        label: 'Visites ce mois',
        value: thisMonthVisits.length,
        previousValue: lastMonthVisits.length,
        target: 8,
        icon: Calendar,
        color: 'text-blue-600'
      },
      {
        id: 'confirmation-rate',
        label: 'Taux de confirmation',
        value: confirmationRate,
        previousValue: lastMonthConfirmationRate,
        format: 'percentage',
        icon: CheckCircle,
        color: 'text-green-600'
      },
      {
        id: 'active-speakers',
        label: 'Orateurs actifs',
        value: speakers.length,
        icon: Users,
        color: 'text-purple-600'
      },
      {
        id: 'active-hosts',
        label: 'Hôtes disponibles',
        value: hosts.length,
        icon: MapPin,
        color: 'text-orange-600'
      },
      {
        id: 'pending-actions',
        label: 'Actions en attente',
        value: visits.filter(v => v.status === 'pending').length,
        target: 0,
        icon: Clock,
        color: 'text-red-600'
      }
    ];
  }, [visits, speakers, hosts]);
};

// ============================================================================
// HOOK POUR LES DONNÉES DE TENDANCE
// ============================================================================

export const useTrendData = (visits: Visit[]): TrendData[] => {
  return useMemo(() => {
    const data: TrendData[] = [];
    const now = new Date();

    // 12 derniers mois
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthVisits = visits.filter(v => {
        const visitDate = new Date(v.visitDate);
        return visitDate.getMonth() === date.getMonth() && 
               visitDate.getFullYear() === date.getFullYear();
      });

      data.push({
        date: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        value: monthVisits.length,
        label: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      });
    }

    return data;
  }, [visits]);
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  KPICard,
  TrendChart,
  MultiTrendChart,
  SmartAlerts,
  useSmartAlerts,
  useKPIs,
  useTrendData,
  calculateTrend,
  formatKPIValue
};
