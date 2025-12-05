import React, { useState, useMemo, memo, useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { PlanningCardsView } from '@/components/planning/PlanningCardsView';
import { PlanningListView } from '@/components/planning/PlanningListView';
import { PlanningWeekView } from '@/components/planning/PlanningWeekView';
import { PlanningCalendarView } from '@/components/planning/PlanningCalendarView';
import { ScheduleVisitModal } from '@/components/planning/ScheduleVisitModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  LayoutGrid,
  List,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Search,
  Download,
  Filter,
  Eye
} from 'lucide-react';
import { LocationType, VisitStatus } from '@/types';

type ViewType = 'cards' | 'list' | 'week' | 'calendar' | 'timeline';

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

  // Memoized event handlers to prevent unnecessary re-renders
  const handleSetView = useCallback((newView: ViewType) => setView(newView), []);
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => 
    setSearchTerm(e.target.value), []);
  const handleStatusFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => 
    setStatusFilter(e.target.value as VisitStatus | 'all'), []);
  const handleTypeFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => 
    setTypeFilter(e.target.value as LocationType | 'all'), []);
  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  // Optimized filtered and sorted visits with proper dependencies
  const filteredVisits = useMemo(() => {
    return visits
      .filter(visit => {
        const matchesSearch =
          visit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.congregation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.talkNoOrType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.notes?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || visit.status === statusFilter;
        const matchesType = typeFilter === 'all' || visit.locationType === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime());
  }, [visits, searchTerm, statusFilter, typeFilter]);

  // Optimized statistics calculation
  const stats = useMemo(() => {
    const total = filteredVisits.length;
    const confirmed = filteredVisits.filter(v => v.status === 'confirmed').length;
    const pending = filteredVisits.filter(v => v.status === 'pending').length;
    const completed = filteredVisits.filter(v => v.status === 'completed').length;
    const upcoming = filteredVisits.filter(v => {
      const visitDate = new Date(v.visitDate);
      const today = new Date();
      return visitDate >= today && v.status === 'confirmed';
    }).length;

    return { total, confirmed, pending, completed, upcoming };
  }, [filteredVisits]);

  const viewOptions = useMemo(() => [
    { id: 'cards', label: 'Cartes', icon: LayoutGrid, description: 'Vue visuelle des visites' },
    { id: 'list', label: 'Liste', icon: List, description: 'Tableau détaillé' },
    { id: 'week', label: 'Semaine', icon: Clock, description: 'Vue hebdomadaire' },
    { id: 'calendar', label: 'Calendrier', icon: CalendarIcon, description: 'Calendrier mensuel' },
    { id: 'timeline', label: 'Chronologie', icon: Eye, description: 'Timeline verticale' }
  ], []);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Planning des visites</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stats.total} visite{stats.total > 1 ? 's' : ''} • {stats.upcoming} à venir • {stats.pending} en attente
          </p>
        </div>
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
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full lg:w-auto">
          <div className="flex-1 min-w-0 md:min-w-64">
            <Input
              placeholder="Rechercher une visite..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="min-w-36"
              options={[
                { value: 'all', label: 'Tous statuts' },
                { value: 'pending', label: 'En attente' },
                { value: 'confirmed', label: 'Confirmé' },
                { value: 'completed', label: 'Terminé' },
                { value: 'cancelled', label: 'Annulé' }
              ]}
            />

            <Select
              value={typeFilter}
              onChange={handleTypeFilterChange}
              className="min-w-36"
              options={[
                { value: 'all', label: 'Tous types' },
                { value: 'physical', label: 'Physique' },
                { value: 'zoom', label: 'Zoom' },
                { value: 'streaming', label: 'Streaming' }
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
          {/* View Toggle - Touch Optimized */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            {viewOptions.map((viewOption) => (
              <ViewOption
                key={viewOption.id}
                viewOption={viewOption}
                currentView={view}
                onViewChange={handleSetView}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Exporter
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
              Filtres
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px] md:min-h-[600px]">
        {view === 'cards' && (
          <PlanningCardsView visits={filteredVisits} />
        )}

        {view === 'list' && (
          <PlanningListView visits={filteredVisits} />
        )}

        {view === 'week' && (
          <PlanningWeekView visits={filteredVisits} />
        )}

        {view === 'calendar' && (
          <PlanningCalendarView visits={filteredVisits} />
        )}

        {view === 'timeline' && (
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-center py-8 md:py-12">
              <Eye className="w-12 h-12 md:w-16 md:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Vue Chronologie
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Timeline verticale des visites
              </p>
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">En développement</span>
            </div>
          </div>
        )}
      </div>

      {/* Past Visits Alert */}
      {visits.filter(v => v.status === 'confirmed' && new Date(v.visitDate) < new Date()).length > 0 && (
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
                  {visits.filter(v => v.status === 'confirmed' && new Date(v.visitDate) < new Date()).length} visite(s) passée(s) nécessite(nt) une action
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
    </div>
  );
};
