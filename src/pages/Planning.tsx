import React, { useState, useMemo, memo, useCallback, useRef } from 'react';
import { useData } from '@/contexts/DataContext';
import { PlanningCardsView } from '@/components/planning/PlanningCardsView';
import { PlanningListView } from '@/components/planning/PlanningListView';
import { PlanningCalendarView } from '@/components/planning/PlanningCalendarView';
import { ScheduleVisitModal } from '@/components/planning/ScheduleVisitModal';
import { VisitActionModal } from '@/components/planning/VisitActionModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
  MoreHorizontal,
  Clock
} from 'lucide-react';
import { LocationType, VisitStatus, Visit } from '@/types';
import { PlanningWorkloadView } from '@/components/planning/PlanningWorkloadView';
import { PlanningTimelineView } from '@/components/planning/PlanningTimelineView';
import { FinancialDashboard } from '@/components/expenses/FinancialDashboard';
import { useReactToPrint } from 'react-to-print';
import { PlanningFilterModal } from '@/components/planning/PlanningFilterModal';
import { ConflictDetectionModal, CancellationModal, EmergencyReplacementModal } from '@/components/modals';


type ViewType = 'cards' | 'list' | 'calendar' | 'timeline' | 'workload' | 'finance';

// Memoized statistics component for performance
const StatCard = memo(({ 
  icon: Icon, 
  value, 
  label, 
  bgColor, 
  textColor, 
  iconBg 
}: {
  icon: any;
  value: number;
  label: string;
  bgColor: string;
  textColor: string;
  iconBg: string;
}) => (
  <div className={`${bgColor} p-4 rounded-lg border`}>
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${textColor}`} />
      </div>
      <div>
        <div className={`text-lg font-semibold ${textColor.replace('text-', 'text-').replace('blue-600', 'blue-900').replace('dark:text-blue-400', 'dark:text-blue-100')}`}>
          {value}
        </div>
        <div className="text-xs text-blue-700 dark:text-blue-300">{label}</div>
      </div>
    </div>
  </div>
));

// Memoized view option component
const ViewOption = memo(({ 
  viewOption, 
  currentView, 
  onViewChange 
}: {
  viewOption: any;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}) => (
  <button
    onClick={() => onViewChange(viewOption.id as ViewType)}
    className={`p-2 rounded-md transition-all text-xs ${
      currentView === viewOption.id
        ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
    }`}
    title={viewOption.description}
  >
    <viewOption.icon className="w-4 h-4" />
  </button>
));

export const Planning: React.FC = () => {
  const { visits } = useData();
  const [view, setView] = useState<ViewType>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VisitStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<LocationType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [selectedAction, setSelectedAction] = useState<'edit' | 'delete' | 'status' | 'message' | 'feedback' | 'expenses' | 'logistics'>('edit');
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Planning-visites-${new Date().toLocaleDateString()}`,
  });


  // Memoized event handlers to prevent unnecessary re-renders
  const handleSetView = useCallback((newView: ViewType) => setView(newView), []);
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => 
    setSearchTerm(e.target.value), []);
  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);
  const handleVisitAction = useCallback((visit: Visit, action: 'edit' | 'delete' | 'status' | 'message' | 'feedback' | 'expenses' | 'logistics') => {
    setSelectedVisit(visit);
    setSelectedAction(action);
    setIsActionModalOpen(true);
  }, []);
  const handleCloseActionModal = useCallback(() => {
    setIsActionModalOpen(false);
    setSelectedVisit(null);
  }, []);

  // Optimized filtered and sorted visits with proper dependencies
  const filteredVisits = useMemo(() => {
    return visits
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
      .sort((a: Visit, b: Visit) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime());
  }, [visits, searchTerm, statusFilter, typeFilter, dateRange]);

  // Optimized statistics calculation
  const stats = useMemo(() => {
    const total = filteredVisits.length;
    const confirmed = filteredVisits.filter((v: Visit) => v.status === 'confirmed').length;
    const pending = filteredVisits.filter((v: Visit) => v.status === 'pending').length;
    const completed = filteredVisits.filter((v: Visit) => v.status === 'completed').length;
    const upcoming = filteredVisits.filter((v: Visit) => {
      const visitDate = new Date(v.visitDate);
      const today = new Date();
      return visitDate >= today && v.status === 'confirmed';
    }).length;

    return { total, confirmed, pending, completed, upcoming };
  }, [filteredVisits]);

  const mainViewOptions = useMemo(() => [
    { id: 'cards', label: 'Cartes', icon: LayoutGrid, description: 'Vue visuelle des visites' },
    { id: 'list', label: 'Liste', icon: List, description: 'Tableau détaillé' },
    { id: 'calendar', label: 'Calendrier', icon: CalendarIcon, description: 'Vue calendrier' },
  ], []);

  const specializedViews = useMemo(() => [
    { id: 'timeline', label: 'Chronologie', icon: Eye, description: 'Timeline verticale' },
    { id: 'workload', label: 'Disponibilité', icon: BarChart, description: 'Charge des orateurs' },
    { id: 'finance', label: 'Finances', icon: PieChart, description: 'Suivi des coûts' }
  ], []);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header & Stats */}
      <div className="flex justify-end">
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenModal}
          size="lg"
        >
          Programmer une visite
        </Button>
      </div>

      {/* Statistics Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon={CalendarIcon}
          value={stats.total}
          label="Total"
          bgColor="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
          textColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900"
        />
        <StatCard
          icon={() => <div className="w-2 h-2 rounded-full bg-green-500" />}
          value={stats.confirmed}
          label="Confirmées"
          bgColor="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800"
          textColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-900"
        />
        <StatCard
          icon={Clock}
          value={stats.pending}
          label="En attente"
          bgColor="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800"
          textColor="text-orange-600 dark:text-orange-400"
          iconBg="bg-orange-100 dark:bg-orange-900"
        />
        <StatCard
          icon={() => <div className="w-2 h-2 rounded-full bg-purple-500" />}
          value={stats.upcoming}
          label="À venir"
          bgColor="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800"
          textColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900"
        />
      </div>

      {/* Filters & View Toggle - Mobile Responsive */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white dark:bg-gray-800 p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-3 w-full lg:w-auto">
          <div className="flex gap-3">
            <div className="flex-1 min-w-0 md:min-w-64">
              <Input
                placeholder="Rechercher une visite..."
                leftIcon={<Search className="w-4 h-4" />}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              leftIcon={<Filter className="w-4 h-4" />} 
              onClick={() => setIsFilterModalOpen(true)}
            >
              Filtres
            </Button>
          </div>

          {/* Active Filters Chips */}
          {(statusFilter !== 'all' || typeFilter !== 'all') && (
            <div className="flex gap-2 flex-wrap items-center">
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {statusFilter === 'pending' && 'En attente'}
                  {statusFilter === 'confirmed' && 'Confirmé'}
                  {statusFilter === 'completed' && 'Terminé'}
                  {statusFilter === 'cancelled' && 'Annulé'}
                  <X className="w-3 h-3" />
                </button>
              )}
              {typeFilter !== 'all' && (
                <button
                  onClick={() => setTypeFilter('all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                >
                  {typeFilter === 'physical' && 'Physique'}
                  {typeFilter === 'zoom' && 'Zoom'}
                  {typeFilter === 'streaming' && 'Streaming'}
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
              >
                Effacer tout
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
          {/* View Toggle - 3 vues principales */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            {mainViewOptions.map((viewOption) => (
              <ViewOption
                key={viewOption.id}
                viewOption={viewOption}
                currentView={view}
                onViewChange={handleSetView}
              />
            ))}
            
            {/* Menu déroulant pour vues spécialisées */}
            <div className="relative">
              <button
                onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
                className={`p-2 rounded-md transition-all text-xs ${
                  ['timeline', 'workload', 'finance'].includes(view)
                    ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
                title="Plus de vues"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {isViewMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsViewMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                    {specializedViews.map((viewOption) => (
                      <button
                        key={viewOption.id}
                        onClick={() => {
                          handleSetView(viewOption.id as ViewType);
                          setIsViewMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          view === viewOption.id
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <viewOption.icon className="w-4 h-4" />
                        <div className="text-left">
                          <div className="font-medium">{viewOption.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{viewOption.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handlePrint}>
            Exporter
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px] md:min-h-[600px]" ref={componentRef}>
        {view === 'cards' && (
          <PlanningCardsView 
            visits={filteredVisits} 
            onVisitAction={handleVisitAction} 
            onVisitClick={(visit) => handleVisitAction(visit, 'edit')}
          />
        )}

        {view === 'list' && (
          <PlanningListView 
            visits={filteredVisits} 
            onVisitAction={handleVisitAction}
            onVisitClick={(visit) => handleVisitAction(visit, 'edit')}
          />
        )}

        {view === 'calendar' && (
          <PlanningCalendarView visits={filteredVisits} />
        )}

        {view === 'timeline' && (
          <PlanningTimelineView visits={filteredVisits} />
        )}

        {view === 'workload' && (
          <PlanningWorkloadView />
        )}

        {view === 'finance' && (
          <FinancialDashboard />
        )}
      </div>

      {/* Past Visits Alert */}
      {visits.filter((v: Visit) => v.status === 'confirmed' && new Date(v.visitDate) < new Date()).length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium text-orange-900 dark:text-orange-100">
                  Visites passées à archiver
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  {visits.filter((v: Visit) => v.status === 'confirmed' && new Date(v.visitDate) < new Date()).length} visite(s) passée(s) nécessite(nt) une action
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Voir tout
            </Button>
          </div>
        </div>
      )}

      <ScheduleVisitModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      
      <VisitActionModal
        isOpen={isActionModalOpen}
        onClose={handleCloseActionModal}
        visit={selectedVisit}
        action={selectedAction}
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
        <>
          <ConflictDetectionModal
            isOpen={isConflictModalOpen}
            onClose={() => setIsConflictModalOpen(false)}
            visit={selectedVisit}
            onResolve={(resolution) => {
              console.log('Conflict resolved:', resolution);
              setIsConflictModalOpen(false);
            }}
          />

          <CancellationModal
            isOpen={isCancellationModalOpen}
            onClose={() => setIsCancellationModalOpen(false)}
            visit={selectedVisit}
            onCancel={(data) => {
              console.log('Visit cancelled:', data);
              setIsCancellationModalOpen(false);
            }}
          />

          <EmergencyReplacementModal
            isOpen={isReplacementModalOpen}
            onClose={() => setIsReplacementModalOpen(false)}
            visit={selectedVisit}
            onSelectReplacement={(speaker) => {
              console.log('Replacement selected:', speaker);
              setIsReplacementModalOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
};
