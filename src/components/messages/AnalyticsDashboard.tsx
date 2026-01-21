import React from 'react';
import { Visit, Speaker, Host } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/contexts/ToastContext';
import { exportService } from '@/utils/ExportService';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  MessageSquare,
  Users,
  BarChart3,
  PieChart,
  Download,
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AnalyticsDashboardProps {
  visits: Visit[];
  speakers: Speaker[];
  hosts: Host[];
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  visits,
  speakers,
  hosts,
  className,
}) => {
  const { addToast } = useToast();

  const handleExportCommunications = async (format: 'csv' | 'excel') => {
    try {
      // Set data in export service
      exportService.setData({
        visits,
        speakers,
        hosts,
        archivedVisits: [],
        congregationProfile: { name: '', hospitalityOverseer: '', hospitalityOverseerPhone: '' },
        customTemplates: {},
        customHostRequestTemplates: {},
        publicTalks: [],
        savedViews: [],
        specialDates: [],
        speakerMessages: [],
        dataVersion: '1.0.0'
      });

      const result = await exportService.export({
        type: 'communications',
        format,
        filename: `communications_${new Date().toISOString().slice(0, 10)}`,
      });

      if (result.success) {
        exportService.download(result);
        addToast(`Historique des communications exporté en ${format.toUpperCase()}`, 'success');
      } else {
        addToast(result.error || 'Erreur lors de l\'export', 'error');
      }
    } catch (error) {
      addToast('Erreur lors de l\'export des communications', 'error');
    }
  };

  // Calculate key metrics
  const analytics = React.useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);

    // Filter visits from last 30 days
    const recentVisits = visits.filter(v => new Date(v.visitDate) >= thirtyDaysAgo);

    // Communication metrics
    const visitsWithCommunication = recentVisits.filter(v => v.communicationStatus && Object.keys(v.communicationStatus).length > 0);
    const communicationRate = recentVisits.length > 0 ? Math.round((visitsWithCommunication.length / recentVisits.length) * 100) : 0;

    // Response time metrics (average time between confirmation and visit)
    const confirmationDelays = recentVisits
      .filter(v => v.communicationStatus?.confirmation?.speaker)
      .map(v => {
        if (!v.communicationStatus?.confirmation?.speaker) return 0;
        const confirmationDate = new Date(v.communicationStatus.confirmation.speaker);
        const visitDate = new Date(v.visitDate);
        return Math.max(0, Math.ceil((visitDate.getTime() - confirmationDate.getTime()) / (1000 * 60 * 60 * 24)));
      });

    const avgConfirmationDelay = confirmationDelays.length > 0
      ? Math.round(confirmationDelays.reduce((a, b) => a + b, 0) / confirmationDelays.length)
      : 0;

    // Host assignment rate
    const visitsWithHosts = recentVisits.filter(v => v.hostAssignments && v.hostAssignments.length > 0).length;
    const hostAssignmentRate = recentVisits.length > 0 ? Math.round((visitsWithHosts / recentVisits.length) * 100) : 0;

    // Messages sent per type
    const messageCounts = {
      confirmation: recentVisits.filter(v => v.communicationStatus?.confirmation?.speaker).length,
      preparation: recentVisits.filter(v => v.communicationStatus?.preparation?.speaker).length,
      'reminder-7': recentVisits.filter(v => v.communicationStatus?.['reminder-7']?.speaker).length,
      'reminder-2': recentVisits.filter(v => v.communicationStatus?.['reminder-2']?.speaker).length,
      thanks: recentVisits.filter(v => v.communicationStatus?.thanks?.speaker).length,
      host_request: recentVisits.filter(v => v.communicationStatus?.host_request?.speaker).length,
    };

    // Top performing hosts
    const hostPerformance = hosts.map(host => {
      const hostVisits = recentVisits.filter(v =>
        v.hostAssignments?.some(ha => ha.hostId === host.nom) ||
        v.host === host.nom
      ).length;

      return {
        host,
        totalVisits: hostVisits,
        successRate: hostVisits > 0 ? 100 : 0, // Simplified
      };
    }).sort((a, b) => b.totalVisits - a.totalVisits).slice(0, 5);

    // Monthly trend (last 6 months)
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const monthVisits = visits.filter(v => {
        const visitDate = new Date(v.visitDate);
        return visitDate >= monthStart && visitDate <= monthEnd;
      });

      const monthCommunications = monthVisits.filter(v => v.communicationStatus && Object.keys(v.communicationStatus).length > 0);

      return {
        month: format(date, 'MMM yy', { locale: fr }),
        visits: monthVisits.length,
        communications: monthCommunications.length,
        rate: monthVisits.length > 0 ? Math.round((monthCommunications.length / monthVisits.length) * 100) : 0,
      };
    });

    return {
      communicationRate,
      avgConfirmationDelay,
      hostAssignmentRate,
      messageCounts,
      hostPerformance,
      monthlyData,
      totalRecentVisits: recentVisits.length,
      totalCommunications: visitsWithCommunication.length,
    };
  }, [visits, speakers, hosts]);

  return (
    <div className={className}>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <BarChart3 className='w-5 h-5 text-blue-600 dark:text-blue-400' />
          </div>
          <div>
            <h3 className='font-bold text-gray-900 dark:text-white text-lg'>Tableau de Bord Analytique</h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Métriques de performance des communications (30 derniers jours)
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card className='border-none shadow-sm'>
            <CardBody className='p-4'>
              <div className='flex items-center justify-between mb-2'>
                <MessageSquare className='w-5 h-5 text-blue-500' />
                <Badge variant='info' className='text-xs'>{analytics.totalRecentVisits}</Badge>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Taux Communication</p>
              <p className='text-2xl font-black text-blue-600'>{analytics.communicationRate}%</p>
            </CardBody>
          </Card>

          <Card className='border-none shadow-sm'>
            <CardBody className='p-4'>
              <div className='flex items-center justify-between mb-2'>
                <Clock className='w-5 h-5 text-green-500' />
                <Badge variant='success' className='text-xs'>{analytics.avgConfirmationDelay}j</Badge>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Délai Confirmation</p>
              <p className='text-2xl font-black text-green-600'>{analytics.avgConfirmationDelay}</p>
              <p className='text-xs text-gray-500'>jours moyens</p>
            </CardBody>
          </Card>

          <Card className='border-none shadow-sm'>
            <CardBody className='p-4'>
              <div className='flex items-center justify-between mb-2'>
                <Users className='w-5 h-5 text-purple-500' />
                <Badge variant='info' className='text-xs'>{analytics.hostAssignmentRate}%</Badge>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Hébergement Assigné</p>
              <p className='text-2xl font-black text-purple-600'>{analytics.hostAssignmentRate}%</p>
            </CardBody>
          </Card>

          <Card className='border-none shadow-sm'>
            <CardBody className='p-4'>
              <div className='flex items-center justify-between mb-2'>
                <CheckCircle className='w-5 h-5 text-orange-500' />
                <Badge variant='warning' className='text-xs'>{analytics.totalCommunications}</Badge>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Communications</p>
              <p className='text-2xl font-black text-orange-600'>{analytics.totalCommunications}</p>
              <p className='text-xs text-gray-500'>messages envoyés</p>
            </CardBody>
          </Card>
        </div>

        {/* Message Types Breakdown */}
        <Card className='border-none shadow-sm'>
          <CardBody className='p-6'>
            <h4 className='font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
              <PieChart className='w-4 h-4' />
              Répartition des Messages
            </h4>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
              {Object.entries(analytics.messageCounts).map(([type, count]) => {
                const labels = {
                  confirmation: 'Confirmations',
                  preparation: 'Préparation',
                  'reminder-7': 'Rappel J-7',
                  'reminder-2': 'Rappel J-2',
                  thanks: 'Remerciements',
                  host_request: 'Demande hôtes',
                };

                return (
                  <div key={type} className='text-center'>
                    <div className='text-2xl font-black text-primary-600 mb-1'>{count}</div>
                    <p className='text-xs text-gray-500 uppercase tracking-wider'>
                      {labels[type as keyof typeof labels] || type}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Monthly Trend */}
        <Card className='border-none shadow-sm'>
          <CardBody className='p-6'>
            <h4 className='font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
              <TrendingUp className='w-4 h-4' />
              Évolution Mensuelle
            </h4>
            <div className='space-y-4'>
              {analytics.monthlyData.map((month, index) => (
                <div key={month.month} className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300'>
                      {index + 1}
                    </div>
                    <div>
                      <p className='font-medium text-gray-900 dark:text-white'>{month.month}</p>
                      <p className='text-sm text-gray-500'>{month.visits} visites</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-bold text-primary-600'>{month.rate}%</p>
                    <p className='text-xs text-gray-500'>communiqué</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Top Hosts */}
        <Card className='border-none shadow-sm'>
          <CardBody className='p-6'>
            <h4 className='font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
              <Users className='w-4 h-4' />
              Top Hôtes Actifs
            </h4>
            {analytics.hostPerformance.length > 0 ? (
              <div className='space-y-3'>
                {analytics.hostPerformance.map((item, index) => (
                  <div key={item.host.nom} className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-sm font-bold text-green-700 dark:text-green-300'>
                        {index + 1}
                      </div>
                      <div>
                        <p className='font-medium text-gray-900 dark:text-white'>{item.host.nom}</p>
                        <p className='text-sm text-gray-500'>{item.totalVisits} visites</p>
                      </div>
                    </div>
                    <Badge variant='success' className='text-xs'>
                      {item.successRate}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-center text-gray-500 py-8'>Aucune donnée d'hôte disponible</p>
            )}
          </CardBody>
        </Card>

        {/* Export Actions */}
        <Card className='border-none shadow-sm'>
          <CardBody className='p-6'>
            <h4 className='font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
              <Download className='w-4 h-4' />
              Export des données
            </h4>
            <p className='text-sm text-gray-500 mb-4'>
              Téléchargez l'historique complet des communications au format Excel ou CSV.
            </p>
            <div className='flex gap-3'>
              <Button
                variant='outline'
                leftIcon={<Download className='w-4 h-4' />}
                onClick={() => handleExportCommunications('excel')}
                className='flex-1'
              >
                Export Excel
              </Button>
              <Button
                variant='outline'
                leftIcon={<Download className='w-4 h-4' />}
                onClick={() => handleExportCommunications('csv')}
                className='flex-1'
              >
                Export CSV
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};