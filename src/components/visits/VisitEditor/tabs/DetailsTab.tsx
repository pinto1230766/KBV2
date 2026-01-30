import React, { useEffect } from 'react';
import { useVisitEditor } from '../VisitEditorContext';

const getDisplayTime = (dateStr?: string, storedTime?: string) => {
  if (!dateStr) return storedTime || '11:30';
  const visitDate = new Date(dateStr);
  const cutoffDate = new Date('2026-01-19');
  return visitDate >= cutoffDate ? '11:30' : (storedTime || '11:30');
};

export const DetailsTab: React.FC = () => {
  const { formData, setFormData } = useVisitEditor();

  // Mettre à jour l'heure quand la date change
  useEffect(() => {
    if (formData.visitDate) {
      const correctTime = getDisplayTime(formData.visitDate, formData.visitTime);
      if (correctTime !== formData.visitTime) {
        setFormData((prev) => ({ ...prev, visitTime: correctTime }));
      }
    }
  }, [formData.visitDate]);

  return (
    <div className='space-y-4 max-w-3xl'>
      <div>
        <label className='block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1'>
          Date
        </label>
        <input
          type='date'
          value={formData.visitDate ?? ''}
          onChange={(e) => {
            const newDate = e.target.value;
            setFormData((prev) => ({
              ...prev,
              visitDate: newDate,
              visitTime: getDisplayTime(newDate, prev.visitTime),
            }));
          }}
          className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
          aria-label='Date de visite'
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1'>
            Heure
          </label>
          <input
            type='time'
            value={formData.visitTime ?? ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, visitTime: e.target.value }))}
            className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
            aria-label='Heure de visite'
          />
        </div>
        <div>
          <label className='block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1'>
            Type de discours
          </label>
          <input
            value={formData.talkNoOrType ?? ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, talkNoOrType: e.target.value }))}
            className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
            aria-label='Type de discours'
          />
        </div>
      </div>
      <div>
        <label className='block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1'>
          Thème
        </label>
        <textarea
          value={formData.talkTheme ?? ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, talkTheme: e.target.value }))}
          rows={3}
          className='w-full px-4 py-3 rounded-xl border border-gray-200 dark-border-gray-700 bg-white dark:bg-gray-900'
          aria-label='Thème du discours'
        />
      </div>
      <div>
        <label className='block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1'>
          Notes générales
        </label>
        <textarea
          value={formData.notes ?? ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          rows={4}
          className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
          aria-label='Notes générales'
        />
      </div>
    </div>
  );
};
