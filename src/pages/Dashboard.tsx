import React, { useMemo, useState } from 'react';
import {
  Users,
  Calendar,
  AlertCircle,
  Zap,
  CalendarPlus,
  ShieldCheck,
  Search,
  LayoutGrid,
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';

import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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

        <Button
          className='h-9 bg-blue-600 hover:bg-blue-700 text-white border-none font-bold shadow-sm text-xs'
          leftIcon={<CalendarPlus className='w-3 h-3' />}
          onClick={() => setIsScheduleModalOpen(true)}
        >
          Nouvelle Visite
        </Button>
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
            onClick: () => navigate('/planning'),
          },
          {
            label: 'Orateurs actifs',
            desc: 'Orateurs enregistrés dans la base de données',
            value: stats.speakers,
            icon: Users,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            onClick: () => navigate('/speakers'),
          },
          {
            label: 'Validations en attente',
            desc: 'Visites nécessitant une confirmation',
            value: stats.pending,
            icon: AlertCircle,
            color: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            onClick: () => navigate('/planning', { state: { filterStatus: 'pending' } }),
          },
          {
            label: "Contacts d'accueil",
            desc: 'Hôtes disponibles pour recevoir les orateurs',
            value: stats.hosts,
            icon: ShieldCheck,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20',
            onClick: () => navigate('/speakers', { state: { activeTab: 'hosts' } }),
          },
        ].map((stat, i) => (
          <button
            key={i}
            onClick={stat.onClick}
            className='relative group text-left cursor-pointer'
            title={`${stat.label}: ${stat.desc} - Cliquez pour voir les détails`}
          >
            <Card className='border-none shadow-sm group-hover:translate-y-[-4px] group-hover:shadow-lg transition-all duration-300 h-full'>
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
          </button>
        ))}
      </div>

      {/* 3. Upcoming Visits */}
      <div className='max-w-2xl mx-auto'>
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
