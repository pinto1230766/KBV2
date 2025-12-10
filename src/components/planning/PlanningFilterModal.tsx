import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DatePicker';
import { format, parseISO } from 'date-fns';
import { LocationType, VisitStatus } from '@/types';

interface PlanningFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: { start: Date | null; end: Date | null };
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
  statusFilter: VisitStatus | 'all';
  setStatusFilter: (status: VisitStatus | 'all') => void;
  typeFilter: LocationType | 'all';
  setTypeFilter: (type: LocationType | 'all') => void;
}

// Helper to convert Date to string for input
const dateToString = (date: Date | null): string => {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
};

// Helper to convert string to Date
const stringToDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  return parseISO(dateStr);
};

export const PlanningFilterModal: React.FC<PlanningFilterModalProps> = ({
  isOpen,
  onClose,
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}) => {
  const [localDateRange, setLocalDateRange] = useState(dateRange);
  const [localStatusFilter, setLocalStatusFilter] = useState(statusFilter);
  const [localTypeFilter, setLocalTypeFilter] = useState(typeFilter);

  useEffect(() => {
    if (isOpen) {
      setLocalDateRange(dateRange);
      setLocalStatusFilter(statusFilter);
      setLocalTypeFilter(typeFilter);
    }
  }, [isOpen, dateRange, statusFilter, typeFilter]);

  const handleApply = () => {
    setDateRange(localDateRange);
    setStatusFilter(localStatusFilter);
    setTypeFilter(localTypeFilter);
    onClose();
  };
  
  const handleCancel = () => {
    onClose();
  };

  const handleClear = () => {
    setLocalDateRange({ start: null, end: null });
    setLocalStatusFilter('all');
    setLocalTypeFilter('all');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filtres avancés">
      <div className="space-y-6">
        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Statut
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'pending', label: 'En attente' },
              { value: 'confirmed', label: 'Confirmé' },
              { value: 'completed', label: 'Terminé' },
              { value: 'cancelled', label: 'Annulé' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setLocalStatusFilter(option.value as VisitStatus | 'all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  localStatusFilter === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Type de visite
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'physical', label: 'Physique' },
              { value: 'zoom', label: 'Zoom' },
              { value: 'streaming', label: 'Streaming' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setLocalTypeFilter(option.value as LocationType | 'all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  localTypeFilter === option.value
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plage de dates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Plage de dates
          </label>
          <div className="flex items-center space-x-2">
            <DatePicker
              value={dateToString(localDateRange.start)}
              onChange={(dateStr) => setLocalDateRange(prev => ({...prev, start: stringToDate(dateStr)}))}
              placeholder="Date de début"
            />
            <span className="text-gray-500">-</span>
            <DatePicker
              value={dateToString(localDateRange.end)}
              onChange={(dateStr) => setLocalDateRange(prev => ({...prev, end: stringToDate(dateStr)}))}
              placeholder="Date de fin"
              min={dateToString(localDateRange.start)}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <Button variant="ghost" onClick={handleClear}>Réinitialiser</Button>
        <Button variant="ghost" onClick={handleCancel}>Annuler</Button>
        <Button onClick={handleApply}>Appliquer les filtres</Button>
      </div>
    </Modal>
  );
};
