import React, { useState, useMemo, memo, useCallback, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { PlanningCardsView } from '@/components/planning/PlanningCardsView';
import { PlanningListView } from '@/components/planning/PlanningListView';
import { PlanningCalendarView } from '@/components/planning/PlanningCalendarView';
import { ScheduleVisitModal } from '@/components/planning/ScheduleVisitModal';
import { VisitActionModal } from '@/components/planning/VisitActionModal';
import { MessageGeneratorModal } from '@/components/messages/MessageGeneratorModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  LayoutGrid,
  List,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Download,
  Filter,
  X,
  Eye,
  BarChart,
  PieChart,
  Clock,
  Archive,
  MessageSquare,
  Star,
  CalendarDays,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { LocationType, VisitStatus, Visit, Speaker } from '@/types';
import { PlanningWorkloadView } from '@/components/planning/PlanningWorkloadView';
import { PlanningTimelineView } from '@/components/planning/PlanningTimelineView';
import { FinancialDashboard } from '@/components/expenses/FinancialDashboard';

import { PlanningFilterModal } from '@/components/planning/PlanningFilterModal';
import {
  ConflictDetectionModal,
  CancellationModal,
  EmergencyReplacementModal,
} from '@/components/modals';
import { cn } from '@/utils/cn';
import { exportService } from '@/utils/ExportService';
import { useToast } from '@/contexts/ToastContext';
import { generateMessage, generateWhatsAppUrl } from '@/utils/messageGenerator';
import { getPrimaryHostName } from '@/utils/hostUtils';

type ViewType = 'cards' | 'list' | 'calendar' | 'timeline' | 'workload' | 'finance' | 'archives';

// Premium Stat Card
const StatCard = memo(
  ({
    icon: Icon,
    value,
    label,
    colorClasses,
  }: {
    icon: any;
    value: number;
    label: string;
    colorClasses: { bg: string; text: string; iconBg: string };
  }) => (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] shadow-sm',
        colorClasses.bg,
        'border-white/20 dark:border-gray-700/50'
      )}
    >
      <div className='relative z-10 flex items-center justify-between'>
        <div>
          <p
            className={cn(
              'text-xs font-bold uppercase tracking-widest mb-1',
              colorClasses.text,
              'opacity-70'
            )}
          >
            {label}
          </p>
          <h3 className={cn('text-3xl font-black tracking-tighter', colorClasses.text)}>{value}</h3>
        </div>
        <div className={cn('p-3 rounded-xl', colorClasses.iconBg)}>
          <Icon className={cn('w-6 h-6', colorClasses.text)} />
        </div>
      </div>
      <div
        className={cn(
          'absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10',
          colorClasses.text,
          'bg-current blur-2xl'
        )}
      />
    </div>
  )
);

export const Planning: React.FC = () => {
  const allData = useData();
  const { visits, archivedVisits, speakers: _speakers, hosts, updateVisit, congregationProfile } = allData;
  const { addToast } = useToast();
  const [view, setView] = useState<ViewType>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VisitStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<LocationType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [selectedAction, setSelectedAction] = useState<
    | 'edit'
    | 'delete'
    | 'status'
    | 'message'
    | 'feedback'
    | 'expenses'
    | 'logistics'
    | 'cancel'
    | 'replace'
    | 'conflict'
  >('edit');
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
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

  const componentRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Set data for export service
  useEffect(() => {
    exportService.setData(allData);
  }, [allData]);

  // Handle initial state from navigation (e.g. from Quick Actions)
  useEffect(() => {
    const state = location.state as { openConflicts?: boolean; openSchedule?: boolean };
    const params = new URLSearchParams(location.search);
    const visitIdParam = params.get('visitId');
    const messageTypeParam = params.get('messageType');

    if (visitIdParam) {
      const visit = visits.find(v => v.visitId === visitIdParam);
      if (visit) {
        setSelectedVisit(visit);
        if (messageTypeParam) {
          setSelectedAction('message');
        }
        setIsActionModalOpen(true);
        // Clean up URL
        navigate(location.pathname, { replace: true, state: {} });
        return;
      }
    }

    if (!state) return;

    if (state.openConflicts) {
      setIsConflictModalOpen(true);
      // Clean up state to prevent re-opening
      navigate(location.pathname, { replace: true, state: {} });
    }
    if (state.openSchedule) {
      setIsModalOpen(true);
      // Clean up state to prevent re-opening
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.search, visits, navigate, location.pathname]);

  const handleExport = async () => {
    if (view === 'archives') {
      const result = await exportService.export({
        type: 'archives',
        format: 'csv',
        filename: `visites_archivees_${new Date().toISOString().slice(0, 10)}`,
      });
      if (result.success) {
        exportService.download(result);
        addToast('Export des archives terminé', 'success');
      } else {
        addToast(`Erreur lors de l'export: ${result.error}`, 'error');
      }
    } else if (view === 'finance') {
      // Handled internally by component
    } else {
      // Export filtered visits
      const result = await exportService.export({
        type: 'visits',
        format: 'csv',
        filters: {
          status: statusFilter !== 'all' ? [statusFilter] : undefined,
          congregations: undefined, // Could add congregation filter later
          dateRange:
            dateRange.start && dateRange.end
              ? {
                  start: dateRange.start,
                  end: dateRange.end,
                }
              : undefined,
        },
        filename: `planning_visites_${new Date().toISOString().slice(0, 10)}`,
      });
      if (result.success) {
        exportService.download(result);
        addToast('Export du planning terminé', 'success');
      } else {
        addToast(`Erreur lors de l'export: ${result.error}`, 'error');
      }
    }
  };

  const handleVisitAction = useCallback(
    (
      visit: Visit,
      action:
        | 'edit'
        | 'delete'
        | 'status'
        | 'message'
        | 'feedback'
        | 'expenses'
        | 'logistics'
        | 'cancel'
        | 'replace'
        | 'conflict'
    ) => {
      setSelectedVisit(visit);
      setSelectedAction(action);

      if (action === 'cancel') {
        setIsCancellationModalOpen(true);
      } else if (action === 'replace') {
        setIsReplacementModalOpen(true);
      } else if (action === 'conflict') {
        setIsConflictModalOpen(true);
      } else {
        setIsActionModalOpen(true);
      }
    },
    []
  );

  const handleCloseActionModal = useCallback(() => {
    setIsActionModalOpen(false);
    setSelectedVisit(null);
  }, []);

  const handleOpenMessageModal = useCallback(
    (params: { type: any; isGroup?: boolean; channel?: any; visit: Visit }) => {
      const speaker = _speakers.find((s) => s.id === params.visit.id) || null;
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
    },
    [_speakers, hosts]
  );

  const handleReplacement = useCallback(
    (speaker: Speaker, sendNotification: boolean) => {
      if (!selectedVisit) return;

      const updatedVisit: Visit = {
        ...selectedVisit,
        id: speaker.id,
        nom: speaker.nom,
        congregation: speaker.congregation,
        telephone: speaker.telephone,

        photoUrl: speaker.photoUrl,
      };

      console.log('🔄 Performing replacement:', updatedVisit);
      updateVisit(updatedVisit);

      if (sendNotification) {
        if (speaker.telephone) {
          const host = hosts.find((h) => h.nom === updatedVisit.host);
          
          try {
            const message = generateMessage(
              updatedVisit,
              speaker,
              host,
              congregationProfile,
              'confirmation',
              'speaker',
              'fr' // TODO: Get from settings
            );
            
            const url = generateWhatsAppUrl(speaker.telephone, message);
            window.open(url, '_blank');
            addToast(`Remplacement effectué. WhatsApp ouvert pour notifier ${speaker.nom}`, 'success');
          } catch (e) {
            console.error('Error generating notification:', e);
            addToast(`Remplacement effectué mais erreur lors de la génération du message`, 'warning');
          }
        } else {
          addToast(`Remplacement effectué. Impossible de notifier : pas de numéro pour ${speaker.nom}`, 'warning');
        }
      } else {
        addToast(`Remplacement effectué : ${speaker.nom}`, 'success');
      }

      setIsReplacementModalOpen(false);
      setSelectedVisit(null);
    },
    [selectedVisit, updateVisit, addToast]
  );

  const handleCancellation = useCallback(
    (cancellationData: any) => {
      // Logique existante dans cancelVisit du DataContext utilisée via allData.cancelVisit
      if (!selectedVisit) return;

      console.log('🔄 Performing cancellation:', cancellationData);
      allData.cancelVisit(selectedVisit, cancellationData);

      addToast('Visite annulée avec succès', 'success');
      setIsCancellationModalOpen(false);
      setSelectedVisit(null);
    },
    [selectedVisit, allData, addToast]
  );

  const filteredVisits = useMemo(
    () =>
      visits
        .filter((visit: Visit) => {
          const matchesSearch =
            visit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.congregation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.talkNoOrType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.notes?.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesStatus = statusFilter === 'all' || visit.status === statusFilter;
          const matchesType = typeFilter === 'all' || visit.locationType === typeFilter;

          const visitDate = new Date(visit.visitDate);
          const matchesDateRange =
            (!dateRange.start || visitDate >= dateRange.start) &&
            (!dateRange.end || visitDate <= dateRange.end);

          return matchesSearch && matchesStatus && matchesType && matchesDateRange;
        })
        .sort(
          (a: Visit, b: Visit) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
        ),
    [visits, searchTerm, statusFilter, typeFilter, dateRange]
  );

  const stats = useMemo(() => {
    const total = filteredVisits.length;
    const confirmed = filteredVisits.filter((v: Visit) => v.status === 'confirmed').length;
    const pending = filteredVisits.filter((v: Visit) => v.status === 'pending').length;
    const upcoming = filteredVisits.filter((v: Visit) => {
      const visitDate = new Date(v.visitDate);
      const today = new Date();
      return visitDate >= today && v.status === 'confirmed';
    }).length;

    return { total, confirmed, pending, upcoming };
  }, [filteredVisits]);

  const SpecializedViewOption = ({ id, label, icon: Icon, desc }: any) => (
    <button
      onClick={() => {
        setView(id as ViewType);
        setIsViewMenuOpen(false);
      }}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors group',
        view === id
          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      )}
    >
      <div
        className={cn(
          'p-2 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors',
          view === id ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-800'
        )}
      >
        <Icon className='w-4 h-4' />
      </div>
      <div className='text-left'>
        <div className='font-bold text-xs uppercase tracking-tight'>{label}</div>
        <div className='text-[10px] text-gray-500 dark:text-gray-400 mt-0.5'>{desc}</div>
      </div>
    </button>
  );

  return (
    <div className='space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6'>
      {/* 1. Header & Primary Actions */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <Badge className='bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-none px-3 py-1 font-bold text-[10px] tracking-widest uppercase'>
              Planning
            </Badge>
            <span className='text-gray-400 text-xs font-medium'>{new Date().getFullYear()}</span>
          </div>
          <h1 className='text-3xl font-black text-gray-900 dark:text-white tracking-tighter'>
            Gestion des Visites
          </h1>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            variant='secondary'
            className='font-bold border-gray-200 dark:border-gray-700 shadow-sm'
            leftIcon={<Download className='w-4 h-4' />}
            onClick={handleExport}
          >
            Exporter
          </Button>
          <Button
            className='bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none font-bold px-6'
            leftIcon={<Plus className='w-5 h-5' />}
            onClick={() => setIsModalOpen(true)}
          >
            Programmer
          </Button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          icon={CalendarDays}
          value={stats.total}
          label='Total Visites'
          colorClasses={{
            bg: 'bg-blue-50 dark:bg-blue-900/10',
            text: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-white dark:bg-blue-900/30',
          }}
        />
        <StatCard
          icon={Sparkles}
          value={stats.confirmed}
          label='Confirmées'
          colorClasses={{
            bg: 'bg-green-50 dark:bg-green-900/10',
            text: 'text-green-600 dark:text-green-400',
            iconBg: 'bg-white dark:bg-green-900/30',
          }}
        />
        <StatCard
          icon={Clock}
          value={stats.pending}
          label='En Attente'
          colorClasses={{
            bg: 'bg-orange-50 dark:bg-orange-900/10',
            text: 'text-orange-600 dark:text-orange-400',
            iconBg: 'bg-white dark:bg-orange-900/30',
          }}
        />
        <StatCard
          icon={CalendarIcon}
          value={stats.upcoming}
          label='À Venir'
          colorClasses={{
            bg: 'bg-purple-50 dark:bg-purple-900/10',
            text: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-white dark:bg-purple-900/30',
          }}
        />
      </div>

      {/* 3. Modern Control Bar */}
      <div className='sticky top-20 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-2 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-2'>
        {/* Search */}
        <div className='relative flex-1 group'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors' />
          <input
            type='text'
            placeholder='Rechercher orateur, congrégation...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-gray-400'
          />
        </div>

        <div className='flex items-center gap-2 min-w-0'>
          <div className='flex-1 flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none'>
          {/* Filter Toggle */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border shrink-0',
              statusFilter !== 'all' || typeFilter !== 'all'
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
            )}
          >
            <Filter className='w-4 h-4' />
            <span>Filtres</span>
            {(statusFilter !== 'all' || typeFilter !== 'all') && (
              <span className='w-2 h-2 rounded-full bg-indigo-500 ml-1' />
            )}
          </button>

          {/* View Switcher */}
          <div className='bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center shrink-0'>
            {[
              { id: 'cards', icon: LayoutGrid },
              { id: 'list', icon: List },
              { id: 'calendar', icon: CalendarIcon },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id as ViewType)}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  view === v.id
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                )}
                aria-label={`Vue ${v.id}`}
                title={`Vue ${v.id}`}
              >
                <v.icon className='w-4 h-4' />
              </button>
            ))}
          </div>
          </div>

          {/* Specialized Views Dropdown */}
          <div className='relative shrink-0'>
            <button
              onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border shrink-0',
                ['timeline', 'workload', 'finance', 'archives'].includes(view)
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
              )}
            >
              <span>Vues Avancées</span>
              <ChevronDown className='w-3 h-3' />
            </button>

            {isViewMenuOpen && (
              <>
                <div className='fixed inset-0 z-40' onClick={() => setIsViewMenuOpen(false)} />
                <div className='absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200'>
                  <div className='p-2 space-y-1'>
                    <div className='px-3 py-2 text-[10px] uppercase font-black tracking-widest text-gray-400'>
                      Analyses
                    </div>
                    <SpecializedViewOption
                      id='timeline'
                      label='Chronologie'
                      icon={Eye}
                      desc='Vue temporelle verticale'
                    />
                    <SpecializedViewOption
                      id='workload'
                      label='Disponibilité'
                      icon={BarChart}
                      desc='Charge des orateurs'
                    />
                    <SpecializedViewOption
                      id='finance'
                      label='Finances'
                      icon={PieChart}
                      desc='Suivi des dépenses'
                    />
                    <div className='my-1 border-t border-gray-100 dark:border-gray-800' />
                    <SpecializedViewOption
                      id='archives'
                      label='Archives'
                      icon={Archive}
                      desc='Historique complet'
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. Active Filters Display */}
      {(statusFilter !== 'all' || typeFilter !== 'all') && (
        <div className='flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2'>
          {statusFilter !== 'all' && (
            <Badge variant='primary' className='pl-2 pr-1 py-1 flex items-center gap-1'>
              Statut: {statusFilter}
              <button
                onClick={() => setStatusFilter('all')}
                className='p-0.5 hover:bg-white/20 rounded-full'
                aria-label='Supprimer le filtre de statut'
                title='Supprimer le filtre de statut'
              >
                <X className='w-3 h-3' />
              </button>
            </Badge>
          )}
          {typeFilter !== 'all' && (
            <Badge
              variant='default'
              className='pl-2 pr-1 py-1 flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
            >
              Type: {typeFilter}
              <button
                onClick={() => setTypeFilter('all')}
                className='p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full'
                aria-label='Supprimer le filtre de type'
                title='Supprimer le filtre de type'
              >
                <X className='w-3 h-3' />
              </button>
            </Badge>
          )}
          <button
            onClick={() => {
              setStatusFilter('all');
              setTypeFilter('all');
            }}
            className='text-xs text-gray-500 hover:text-red-500 font-medium underline px-2'
          >
            Tout effacer
          </button>
        </div>
      )}

      {/* 5. Content Area */}
      <div className='min-h-[500px] animate-in fade-in duration-500' ref={componentRef}>
        {view === 'cards' && (
          <div className='bg-transparent'>
            <PlanningCardsView
              visits={filteredVisits}
              onVisitAction={handleVisitAction}
              onVisitClick={(visit) => handleVisitAction(visit, 'edit')}
            />
          </div>
        )}

        {view === 'list' && (
          <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
            <PlanningListView
              visits={filteredVisits}
              onVisitAction={handleVisitAction}
              onVisitClick={(visit) => handleVisitAction(visit, 'edit')}
            />
          </div>
        )}

        {view === 'calendar' && (
          <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-4'>
            <PlanningCalendarView
              visits={filteredVisits}
              onVisitClick={(visit) => handleVisitAction(visit, 'edit')}
            />
          </div>
        )}

        {view === 'timeline' && <PlanningTimelineView visits={filteredVisits} />}
        {view === 'workload' && <PlanningWorkloadView />}
        {/* Finance Dashboard handles its own layout */}
        {view === 'finance' && (
          <div className='rounded-3xl overflow-hidden'>
            <FinancialDashboard />
          </div>
        )}

        {view === 'archives' && (
          <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm'>
            <div className='flex items-center gap-4 mb-8'>
              <div className='p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl'>
                <Archive className='w-6 h-6 text-gray-600 dark:text-gray-400' />
              </div>
              <div>
                <h2 className='text-xl font-black text-gray-900 dark:text-white tracking-tight'>
                  Visites archivées
                </h2>
                <p className='text-sm text-gray-500'>
                  {archivedVisits.length} visite(s) dans l'historique
                </p>
              </div>
            </div>

            {archivedVisits.length === 0 ? (
              <div className='text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700'>
                <Archive className='w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
                <h3 className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-1'>
                  Aucune archive
                </h3>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Les visites terminées apparaîtront ici automatiquement.
                </p>
              </div>
            ) : (
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {archivedVisits
                  .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
                  .map((visit) => (
                    <div
                      key={visit.visitId}
                      className='group bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-all'
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div>
                          <h3 className='font-bold text-gray-900 dark:text-white'>{visit.nom}</h3>
                          <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mt-1'>
                            {visit.congregation}
                          </p>
                        </div>
                        <Badge variant='success' className='text-[10px] px-2 py-0.5'>
                          Terminée
                        </Badge>
                      </div>

                      <div className='space-y-2 text-sm mb-4'>
                        <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-700/50'>
                          <span className='text-gray-500 text-xs uppercase font-bold tracking-wider'>
                            Date
                          </span>
                          <span className='font-medium text-gray-900 dark:text-gray-200'>
                            {new Date(visit.visitDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-700/50'>
                          <span className='text-gray-500 text-xs uppercase font-bold tracking-wider'>
                            Numéro
                          </span>
                          <span className='font-medium'>{visit.talkNoOrType || '-'}</span>
                        </div>
                      </div>

                      <div className='mt-4 flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity'>
                        <Button
                          variant='secondary'
                          className='flex-1 text-xs h-8'
                          onClick={() => handleVisitAction(visit, 'message')}
                          leftIcon={<MessageSquare className='w-3 h-3' />}
                        >
                          Message
                        </Button>
                        <Button
                          variant='secondary'
                          className='flex-1 text-xs h-8'
                          onClick={() => handleVisitAction(visit, 'feedback')}
                          leftIcon={<Star className='w-3 h-3' />}
                        >
                          Bilan
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ScheduleVisitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <VisitActionModal
        isOpen={isActionModalOpen}
        onClose={handleCloseActionModal}
        visit={selectedVisit}
        action={selectedAction}
        onOpenMessageModal={handleOpenMessageModal}
      />

      <PlanningFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        dateRange={dateRange}
        setDateRange={setDateRange}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {selectedVisit && (
        <ConflictDetectionModal
          isOpen={isConflictModalOpen}
          onClose={() => setIsConflictModalOpen(false)}
          visit={selectedVisit}
          onResolve={(_resolution) => setIsConflictModalOpen(false)}
        />
      )}

      {selectedVisit && (
        <CancellationModal
          isOpen={isCancellationModalOpen}
          onClose={() => setIsCancellationModalOpen(false)}
          visit={selectedVisit}
          onCancel={handleCancellation}
        />
      )}

      {selectedVisit && (
        <EmergencyReplacementModal
          isOpen={isReplacementModalOpen}
          onClose={() => setIsReplacementModalOpen(false)}
          visit={selectedVisit}
          onSelectReplacement={handleReplacement}
        />
      )}

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
