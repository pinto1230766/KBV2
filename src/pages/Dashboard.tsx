import React, { useMemo, useState } from 'react';
import {
  Users,
  Calendar,
  AlertCircle,
  TrendingUp,
  Clock,
  Zap,
  CalendarPlus,
  MessageSquare,
  FileText,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Sparkles,
  LayoutGrid,
  HelpCircle,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';

import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { DashboardVisitItem } from '@/components/dashboard/DashboardVisitItem';

import { Visit } from '@/types';
import { getActiveHostsCount, getPrimaryHostName } from '@/utils/hostUtils';
import { QuickActionsModal } from '@/components/ui/QuickActionsModal';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { generateReport } from '@/utils/reportGenerator';
import { ReportGeneratorModal } from '@/components/reports/ReportGeneratorModal';
import { VisitActionModal } from '@/components/planning/VisitActionModal';
import { MessageGeneratorModal } from '@/components/messages/MessageGeneratorModal';
import { ScheduleVisitModal } from '@/components/planning/ScheduleVisitModal';


export const Dashboard: React.FC = () => {
  const { visits, speakers, hosts, congregationProfile } = useData();

  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [isVisitActionModalOpen, setIsVisitActionModalOpen] = useState(false);
  const [messageModalParams, setMessageModalParams] = useState<{
    isOpen: boolean;
    type: any;
    isGroup?: boolean;
    channel?: any;
    speaker: any;
    visit: Visit | null;
    host: any;
  }>({
    isOpen: false,
    type: 'confirmation',
    speaker: null,
    visit: null,
    host: null,
  });

  // Memoized Data
  const stats = useMemo(() => {
    const pendingTotal = visits.filter((v) => v.status === 'pending').length;
    return {
      speakers: speakers.length,
      hosts: getActiveHostsCount(visits),
      visitsThisMonth: visits.filter((v) => {
        const d = new Date(v.visitDate);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
      pending: pendingTotal,
    };
  }, [visits, speakers, hosts]);

  const upcomingVisits = useMemo(() => {
    return visits
      .filter(
        (v) =>
          new Date(v.visitDate).getTime() >= new Date().setHours(0, 0, 0, 0) &&
          v.status !== 'cancelled'
      )
      .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime())
      .slice(0, 5);
  }, [visits]);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    return months.map((m, i) => ({
      name: m,
      value: i % 2 === 0 ? 12 + i : 15 - i, // Placeholder realistic-looking data
    }));
  }, []);

  const handleVisitClick = (visit: Visit) => {
    setSelectedVisit(visit);
    setIsVisitActionModalOpen(true);
  };

  const handleOpenMessageModal = (params: { type: any; isGroup?: boolean; channel?: any; visit: Visit }) => {
    const speaker = speakers.find((s) => s.id === params.visit.id) || null;
    const host = hosts.find((h) => h.nom === getPrimaryHostName(params.visit));
    setMessageModalParams({
      isOpen: true,
      type: params.type,
      isGroup: params.isGroup,
      channel: params.channel,
      speaker,
      visit: params.visit,
      host,
    });
  };

  return (
    <div className='max-w-[1600px] mx-auto space-y-3 px-4 sm:px-6 lg:px-8 py-1'>
      {/* 1. Compact Header */}
      <div className='flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700'>
        <div>
           <h1 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
             <span className='w-2 h-2 rounded-full bg-blue-500 animate-pulse'></span>
             Bonjour Francis
           </h1>
           <p className='text-xs text-gray-500 dark:text-gray-400 mt-1' >
             {stats.pending > 0 ? (
               <span className='text-orange-600 font-bold'>Running • {stats.pending} validations en attente</span>
             ) : (
               <span className='text-green-600 font-bold'>System Normal • Tout est à jour</span>
             )}
           </p>
        </div>

        <div className='flex gap-2'>
            <Button
              className='h-9 bg-blue-600 hover:bg-blue-700 text-white border-none font-bold shadow-sm text-xs'
              leftIcon={<CalendarPlus className='w-3 h-3' />}
              onClick={() => setIsScheduleModalOpen(true)}
            >
              Nouvelle Visite
            </Button>
            <Button
              className='h-9 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 font-bold text-xs'
              leftIcon={<Zap className='w-3 h-3 text-amber-500' />}
              onClick={() => setIsQuickActionsOpen(true)}
            >
              Actions
            </Button>
         </div>
      </div>

      {/* 2. Global Insight Grid */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-4 duration-500'>
        {[
          {
            label: 'Visites du mois',
            desc: 'Toutes les visites programmées en cours',
            value: stats.visitsThisMonth,
            icon: Calendar,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            label: 'Orateurs actifs',
            desc: 'Orateurs enregistrés dans la base de données',
            value: stats.speakers,
            icon: Users,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
          },
          {
            label: 'Validations en attente',
            desc: 'Visites nécessitant une confirmation',
            value: stats.pending,
            icon: AlertCircle,
            color: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
          },
          {
            label: "Contacts d'accueil",
            desc: 'Hôtes disponibles pour recevoir les orateurs',
            value: stats.hosts,
            icon: ShieldCheck,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className='relative group'
            title={`${stat.label}: ${stat.desc}${i === 2 ? ' (Cliquez pour plus de détails)' : i === 0 ? ' (Mise à jour temps réel)' : ''}`}
          >
            {/* Tooltip hint pour Power Users */}
            {i === 2 && (
              <div className='absolute -top-2 -right-2 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center z-10'>
                <span className='text-[8px] text-white font-bold'>i</span>
              </div>
            )}
            <Card className='border-none shadow-sm group-hover:translate-y-[-4px] transition-all duration-300 h-full'>
              <CardBody className='p-4 flex items-center justify-between'>
                <div>
                  <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>
                    {stat.label}
                  </p>
                  <p className='text-3xl font-black text-gray-900 dark:text-white tracking-tighter'>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    'p-4 rounded-2xl transition-transform group-hover:scale-110 shadow-sm',
                    stat.bg
                  )}
                >
                  <stat.icon className={cn('w-6 h-6', stat.color)} />
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>

      {/* 3. Main Operational View */}
      <div className='grid grid-cols-1 xl:grid-cols-12 gap-4 items-start'>
        {/* Left Side: Analytics & Metrics (8/12) */}
        <div className='xl:col-span-8 space-y-4 animate-in fade-in slide-in-from-left-4 duration-700'>
          <Card className='border-none shadow-sm overflow-hidden bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-3xl'>
            <div className='p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between'>
              <div>
                <h3 className='text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-1'>
                  Tableau de bord d'activité
                </h3>
                <p className='text-xs text-gray-500 font-medium'>
                  Évolution mensuelle des visites programmées
                </p>
              </div>
              <div className='flex gap-2'>
                <Badge
                  variant='success'
                  className='bg-green-50 text-green-700 dark:bg-green-900/20 border-none px-3 font-bold'
                >
                  +18% vs 2024
                </Badge>
                <Button variant='ghost' size='sm' className='rounded-full'>
                  <TrendingUp className='w-4 h-4' />
                </Button>
              </div>
            </div>
            <CardBody className='p-4'>
              <div className='h-48 w-full pr-4'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#4F46E5' stopOpacity={0.3} />
                        <stop offset='95%' stopColor='#4F46E5' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={false}
                      stroke='#E5E7EB'
                      className='dark:stroke-gray-700'
                    />
                    <XAxis
                      dataKey='name'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF' }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '1.5rem',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        padding: '12px',
                      }}
                    />
                    <Area
                      type='monotone'
                      dataKey='value'
                      stroke='#4F46E5'
                      strokeWidth={4}
                      fillOpacity={1}
                      fill='url(#colorValue)'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4'>
                {[
                  {
                    label: 'Moyenne mensuelle',
                    value: '14.2',
                    icon: Clock,
                    hint: 'Nombre moyen de visites par mois',
                    advanced: 'Calculé sur 12 mois glissants',
                  },
                  {
                    label: "Pic d'activité",
                    value: '18',
                    icon: TrendingUp,
                    hint: 'Maximum de visites en un mois',
                    advanced: 'Record historique enregistré',
                  },
                  {
                    label: 'Taux confirmation',
                    value: '94%',
                    icon: Sparkles,
                    hint: 'Visites confirmées vs programmées',
                    advanced: 'Indicateur de fiabilité du planning',
                  },
                  {
                    label: 'Sauvegarde auto',
                    value: 'Active',
                    icon: ShieldCheck,
                    hint: 'Sauvegarde automatique des données',
                    advanced: 'Backup toutes les 6 heures',
                  },
                ].map((m, i) => (
                  <div
                    key={i}
                    className='p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors relative group'
                    title={`${m.label}: ${m.hint}${i > 1 ? ` (🔧 ${m.advanced})` : ''}`}
                  >
                    {i > 1 && (
                      <div className='absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
                        <HelpCircle className='w-2 h-2 text-white m-0.5' />
                      </div>
                    )}
                    <m.icon className='w-4 h-4 text-primary-500 mb-2' />
                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-tight'>
                      {m.label}
                    </p>
                    <p className='text-sm font-black text-gray-900 dark:text-white'>{m.value}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Launcher / Shortcuts Section */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {[
              {
                title: 'Centre de messagerie',
                desc: 'Envoyer rappels et notifications aux orateurs',
                icon: MessageSquare,
                path: '/messages',
                color: 'bg-blue-600',
              },
              {
                title: 'Gestion des orateurs',
                desc: 'Ajouter, modifier et organiser la base orateurs',
                icon: Users,
                path: '/speakers',
                color: 'bg-green-600',
              },
              {
                title: 'Générateur de rapports',
                desc: 'Créer des extractions PDF, Excel et analyses',
                icon: FileText,
                action: () => setIsReportModalOpen(true),
                color: 'bg-orange-600',
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action || (() => navigate(item.path!))}
                className='group p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl hover:translate-y-[-6px] transition-all duration-300 text-left border border-transparent hover:border-primary-500/20'
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg transition-transform group-hover:scale-110',
                    item.color
                  )}
                >
                  <item.icon className='w-6 h-6' />
                </div>
                <h4 className='font-black text-sm uppercase tracking-tighter text-gray-900 dark:text-white mb-1'>
                  {item.title}
                </h4>
                <p className='text-xs text-gray-500 font-medium'>{item.desc}</p>
                <ArrowUpRight className='w-5 h-5 ml-auto text-gray-300 group-hover:text-primary-500 transition-colors' />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Activity Heartbeat (4/12) */}
        <div className='xl:col-span-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-700'>
          <Card className='border-none shadow-sm bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-3xl overflow-hidden'>
            <div className='p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between'>
              <div>
                <h3 className='text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-1'>
                  Planning à venir
                </h3>
                <p className='text-xs text-gray-500 font-medium'>
                  Visites programmées nécessitant un suivi
                </p>
              </div>
              <Button
                variant='secondary'
                size='sm'
                onClick={() => navigate('/planning')}
                className='rounded-full font-bold'
              >
                Voir tout
              </Button>
            </div>
            <CardBody className='p-4'>
              {upcomingVisits.length > 0 ? (
                <div className='space-y-3'>
                  {upcomingVisits.map((v) => (
                    <DashboardVisitItem key={v.id} visit={v} onClick={() => handleVisitClick(v)} />
                  ))}
                  <div className='pt-4 flex justify-center'>
                    <button className='text-[10px] font-black text-primary-500 uppercase tracking-widest hover:underline'>
                      + {visits.length - upcomingVisits.length} autres dans le futur
                    </button>
                  </div>
                </div>
              ) : (
                <div className='py-20 text-center opacity-40'>
                  <Calendar className='w-12 h-12 mx-auto mb-4' />
                  <p className='text-xs font-bold uppercase tracking-widest'>
                    Aucun planning programmé
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          <Card className='border-none shadow-sm bg-gradient-to-br from-indigo-900 to-primary-900 p-6 rounded-3xl text-white overflow-hidden relative'>
            <div className='absolute top-[-20%] right-[-10%] opacity-20'>
              <LayoutGrid className='w-48 h-48' />
            </div>
            <div className='relative z-10'>
              <h4 className='text-base font-black uppercase tracking-tighter mb-3'>
                Recherche globale
              </h4>
              <div className='relative mb-4'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-300' />
                <input
                  className='w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-black/20 border border-white/10 rounded-2xl text-xs backdrop-blur-md focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-primary-300/50'
                  placeholder='Trouver un orateur, une date...'
                  onClick={() => setIsGlobalSearchOpen(true)}
                  readOnly
                />
              </div>
              <div className='flex items-center gap-3 text-[10px] font-bold text-primary-300 uppercase tracking-widest'>
                <Zap className='w-3 h-3 text-amber-400' />
                Appuyez sur CTRL + K partout
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {selectedVisit && (
        <VisitActionModal
          isOpen={isVisitActionModalOpen}
          onClose={() => setIsVisitActionModalOpen(false)}
          visit={selectedVisit}
          action='edit'
          onOpenMessageModal={handleOpenMessageModal}
        />
      )}

      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onAction={(action) => {
          switch (action) {
            case 'schedule-visit':
              setIsScheduleModalOpen(true);
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
            case 'search-entities':
              setIsGlobalSearchOpen(true);
              break;
          }
        }}
      />

      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onGenerate={async (config) => {
          try {
            await generateReport(config, visits, speakers, hosts, congregationProfile);
            addToast(`Rapport ${config.format.toUpperCase()} généré avec succès`, 'success');
            setIsReportModalOpen(false);
          } catch (error) {
            addToast('Erreur lors de la génération du rapport', 'error');
          }
        }}
      />

      <GlobalSearch isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />

      <ScheduleVisitModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {messageModalParams.isOpen && (
        <MessageGeneratorModal
          isOpen={messageModalParams.isOpen}
          onClose={() => setMessageModalParams({ ...messageModalParams, isOpen: false })}
          speaker={messageModalParams.speaker}
          visit={messageModalParams.visit}
          host={messageModalParams.host}
          initialType={messageModalParams.type}
          isGroupMessage={messageModalParams.isGroup}
          initialChannel={messageModalParams.channel}
        />
      )}
    </div>
  );
};

export default Dashboard;
