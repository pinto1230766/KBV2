import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DatePicker';
import { format, parseISO } from 'date-fns';

interface PlanningFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: { start: Date | null; end: Date | null };
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
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
}) => {
  const [localDateRange, setLocalDateRange] = useState(dateRange);

  useEffect(() => {
    // Reset local state when modal opens with new props
    if (isOpen) {
      setLocalDateRange(dateRange);
    }
  }, [isOpen, dateRange]);

  const handleApply = () => {
    setDateRange(localDateRange);
    onClose();
  };
  
  const handleCancel = () => {
    onClose(); // No need to reset state here, useEffect handles it
  };

  const handleClear = () => {
    setLocalDateRange({ start: null, end: null });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filtres avancés">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
