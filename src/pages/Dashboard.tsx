import React, { useMemo, useState } from 'react';
import {
  Users,
  Calendar,
  AlertCircle,
  CalendarPlus,
  ShieldCheck,
  Search,
  LayoutGrid,
  CheckCircle2,
  Home,
  Utensils,
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';

import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { UpcomingVisitCard } from '@/components/dashboard/UpcomingVisitCard';

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
      .slice(0, 3);
  }, [visits]);

  const weekendVisits = useMemo(() => {
    const now = new Date();
    const weekendStart = new Date(now);
    weekendStart.setDate(now.getDate() + (6 - now.getDay()));
    const weekendEnd = new Date(weekendStart);
    weekendEnd.setDate(weekendStart.getDate() + 1);
    
    return visits.filter(v => {
      const vDate = new Date(v.visitDate);
      return vDate >= weekendStart && vDate <= weekendEnd && v.status !== 'cancelled';
    }).length;
  }, [visits]);

  const newSpeakers = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return speakers.filter(s => s.createdAt && new Date(s.createdAt) >= thirtyDaysAgo).length;
  }, [speakers]);

  const todoTasks = useMemo(() => {
    const tasks: Array<{ text: string; visitId: string; type: string }> = [];
    
    upcomingVisits.forEach(v => {
      // Skip host-related tasks for zoom/streaming/local KBV visits
      if (v.locationType === 'streaming' || v.locationType === 'zoom') {
        return; // Skip zoom/streaming visits
      }
      
      const isLocalKbv = ['Lyon KBV', 'Lyon - KBV', 'KBV Lyon', 'Lyon', 'Lyon Centre', 'Lyon Est', 'Lyon Ouest', 'Lyon Sud'].some(lyonCong => 
        v.congregation.toLowerCase().includes(lyonCong.toLowerCase()) ||
        lyonCong.toLowerCase().includes(v.congregation.toLowerCase())
      );
      
      if (isLocalKbv) {
        return; // Skip local KBV visits
      }
      
      const hasAccommodation = v.hostAssignments?.some(h => h.role === 'accommodation');
      const hasMeals = v.hostAssignments?.some(h => h.role === 'meals');
      const hasTransport = v.hostAssignments?.some(h => h.role === 'transport' || h.role === 'pickup');
      
      const speakerName = v.prenom ? `${v.prenom} ${v.nom}` : v.nom;
      const dateStr = new Date(v.visitDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      
      if (!hasAccommodation) {
        tasks.push({ text: `Hébergement à confirmer pour ${speakerName} (${dateStr})`, visitId: v.visitId, type: 'accommodation' });
      }
      if (!hasMeals) {
        tasks.push({ text: `Repas à organiser pour ${speakerName} (${dateStr})`, visitId: v.visitId, type: 'meals' });
      }
      if (!hasTransport) {
        tasks.push({ text: `Transport à planifier pour ${speakerName} (${dateStr})`, visitId: v.visitId, type: 'transport' });
      }
    });
    
    return tasks.slice(0, 5);
  }, [upcomingVisits]);

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
            subText: weekendVisits > 0 ? `${weekendVisits} ce week-end` : 'Aucune ce week-end',
            value: stats.visitsThisMonth,
            icon: Calendar,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            onClick: () => navigate('/planning'),
          },
          {
            label: 'Orateurs actifs',
            desc: 'Orateurs enregistrés dans la base de données',
            subText: newSpeakers > 0 ? `${newSpeakers} nouveaux ce mois` : 'Base stable',
            value: stats.speakers,
            icon: Users,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            onClick: () => navigate('/speakers'),
          },
          {
            label: 'Validations en attente',
            desc: 'Visites nécessitant une confirmation',
            subText: stats.pending > 0 ? 'Action requise' : 'Tout confirmé',
            value: stats.pending,
            icon: AlertCircle,
            color: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            onClick: () => navigate('/planning', { state: { filterStatus: 'pending' } }),
          },
          {
            label: "Contacts d'accueil",
            desc: 'Hôtes disponibles pour recevoir les orateurs',
            subText: `${stats.hosts} disponibles`,
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
                <div className='flex-1'>
                  <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>
                    {stat.label}
                  </p>
                  <p className='text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-1'>
                    {stat.value}
                  </p>
                  <p className='text-[10px] text-gray-500 dark:text-gray-400 font-medium'>
                    {stat.subText}
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

      {/* 3. Main Content: Planning + To-do Panel */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {/* Planning à venir (2/3) */}
        <div className='lg:col-span-2'>
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
                    <UpcomingVisitCard key={v.visitId} visit={v} onClick={() => handleVisitClick(v)} />
                  ))}
                  {visits.length > upcomingVisits.length && (
                    <div className='pt-4 flex justify-center'>
                      <button 
                        onClick={() => navigate('/planning')}
                        className='text-[10px] font-black text-primary-500 uppercase tracking-widest hover:underline'
                      >
                        Étape 1/5 • + {visits.length - upcomingVisits.length} autres visites
                      </button>
                    </div>
                  )}
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
        </div>

        {/* To-do Panel (1/3) */}
        <div className='space-y-4'>
          <Card className='border-none shadow-sm bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-3xl overflow-hidden'>
            <div className='p-4 border-b border-gray-100 dark:border-gray-700/50'>
              <h3 className='text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-1'>
                À faire cette semaine
              </h3>
              <p className='text-xs text-gray-500 font-medium'>
                Tâches prioritaires
              </p>
            </div>
            <CardBody className='p-4'>
              {todoTasks.length > 0 ? (
                <div className='space-y-2'>
                  {todoTasks.map((task, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const visit = visits.find(v => v.visitId === task.visitId);
                        if (visit) handleVisitClick(visit);
                      }}
                      className='w-full text-left p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group border border-transparent hover:border-blue-200 dark:hover:border-blue-800'
                    >
                      <div className='flex items-start gap-2'>
                        <div className='flex-shrink-0 mt-0.5'>
                          {task.type === 'accommodation' && <Home className='w-4 h-4 text-orange-500' />}
                          {task.type === 'meals' && <Utensils className='w-4 h-4 text-orange-500' />}
                          {task.type === 'transport' && <Calendar className='w-4 h-4 text-orange-500' />}
                        </div>
                        <p className='text-xs text-gray-700 dark:text-gray-300 font-medium flex-1'>
                          {task.text}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className='py-12 text-center opacity-40'>
                  <CheckCircle2 className='w-10 h-10 mx-auto mb-3 text-green-500' />
                  <p className='text-xs font-bold uppercase tracking-widest text-gray-500'>
                    Tout est à jour !
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
              <div className='relative mb-3'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-300' />
                <input
                  className='w-full pl-10 pr-20 py-3 bg-white/10 dark:bg-black/20 border border-white/10 rounded-2xl text-xs backdrop-blur-md focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-primary-300/50'
                  placeholder='Rechercher une visite, un orateur ou une date…'
                  onClick={() => setIsGlobalSearchOpen(true)}
                  readOnly
                />
                <div className='absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-primary-200'>
                  CTRL + K
                </div>
              </div>
              <p className='text-[10px] text-primary-300/70 font-medium'>
                Accès rapide à toutes vos données
              </p>
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
