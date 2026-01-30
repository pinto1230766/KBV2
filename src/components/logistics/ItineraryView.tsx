import React from 'react';
import { Itinerary } from '@/types';
import { Car, MapPin, Navigation, Plane, Train, Clock, Map as MapIcon } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ItineraryViewProps {
  itinerary: Itinerary;
  onUpdate: (itinerary: Itinerary) => void;
  readOnly?: boolean;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  onUpdate,
  readOnly = false,
}) => {
  const handleChange = (field: keyof Itinerary, value: any) => {
    onUpdate({ ...itinerary, [field]: value });
  };

  const openApp = (app: 'waze' | 'google') => {
    const query = encodeURIComponent(itinerary.meetingPoint || '');
    if (!query) return;

    const url =
      app === 'waze'
        ? `https://waze.com/ul?q=${query}&navigate=yes`
        : `https://www.google.com/maps/search/?api=1&query=${query}`;

    window.open(url, '_blank');
  };

  return (
    <div className='space-y-6'>
      <div className='flex gap-4'>
        {[
          { mode: 'car', icon: Car, label: 'Voiture' },
          { mode: 'train', icon: Train, label: 'Train' },
          { mode: 'plane', icon: Plane, label: 'Avion' },
        ].map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            type='button'
            onClick={() => handleChange('transportMode', mode)}
            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
              itinerary.transportMode === mode
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500'
            }`}
            disabled={readOnly}
          >
            <Icon className='w-6 h-6 mb-2' />
            <span className='text-sm font-medium'>{label}</span>
          </button>
        ))}
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Input
          label='Distance (km)'
          type='number'
          value={itinerary.distance?.toString() || ''}
          onChange={(e) =>
            handleChange('distance', e.target.value ? parseFloat(e.target.value) : undefined)
          }
          disabled={readOnly}
          leftIcon={<Navigation className='w-4 h-4' />}
        />
        <Input
          label='Durée estimée'
          placeholder='ex: 1h 30m'
          value={itinerary.duration?.toString() || ''}
          onChange={(e) => handleChange('duration', e.target.value)}
          disabled={readOnly}
          leftIcon={<Clock className='w-4 h-4' />}
        />
      </div>

      <div className='space-y-4'>
        <Input
          label='Point de rendez-vous / Adresse'
          value={itinerary.meetingPoint || ''}
          onChange={(e) => handleChange('meetingPoint', e.target.value)}
          disabled={readOnly}
          leftIcon={<MapPin className='w-4 h-4' />}
        />

        {itinerary.meetingPoint && (
          <div className='flex gap-2'>
            <Button
              variant='outline'
              className='flex-1'
              onClick={() => openApp('google')}
              leftIcon={<MapIcon className='w-4 h-4' />}
            >
              Google Maps
            </Button>
            <Button
              variant='outline'
              className='flex-1'
              onClick={() => openApp('waze')}
              leftIcon={<Navigation className='w-4 h-4' />}
            >
              Waze
            </Button>
          </div>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
          Notes de voyage
        </label>
        <textarea
          value={itinerary.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          disabled={readOnly}
          className='w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-primary focus:border-primary p-3 min-h-[100px]'
          placeholder='Informations supplémentaires...'
        />
      </div>

      {/* Section Transport des Accompagnants */}
      <div className='border-t border-gray-200 dark:border-gray-700 pt-6 mt-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
          <Car className='w-5 h-5' />
          Transport des accompagnants
        </h3>

        <div className='flex gap-4 mb-4'>
          {[
            { mode: 'same_as_speaker', icon: Car, label: 'Même que l\'orateur' },
            { mode: 'car', icon: Car, label: 'Voiture' },
            { mode: 'train', icon: Train, label: 'Train' },
            { mode: 'plane', icon: Plane, label: 'Avion' },
            { mode: 'other', icon: MapIcon, label: 'Autre' },
          ].map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              type='button'
              onClick={() => handleChange('companionsTransportMode', mode)}
              className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                itinerary.companionsTransportMode === mode
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500'
              }`}
              disabled={readOnly}
            >
              <Icon className='w-6 h-6 mb-2' />
              <span className='text-sm font-medium'>{label}</span>
            </button>
          ))}
        </div>

        <div className='space-y-4'>
          <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <input
              type='checkbox'
              id='companionsHaveCar'
              checked={itinerary.companionsHaveCar || false}
              onChange={(e) => handleChange('companionsHaveCar', e.target.checked)}
              disabled={readOnly}
              className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary'
            />
            <label htmlFor='companionsHaveCar' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Les accompagnants viennent avec leur propre voiture
            </label>
          </div>

          {itinerary.companionsHaveCar && (
            <Input
              label='Détails du véhicule (plaque, modèle, couleur...)'
              value={itinerary.companionsCarDetails || ''}
              onChange={(e) => handleChange('companionsCarDetails', e.target.value)}
              disabled={readOnly}
              placeholder='ex: AB-123-CD, Renault Clio bleue'
            />
          )}

          <Input
            label='Point de rendez-vous des accompagnants (si différent)'
            value={itinerary.companionsMeetingPoint || ''}
            onChange={(e) => handleChange('companionsMeetingPoint', e.target.value)}
            disabled={readOnly}
            leftIcon={<MapPin className='w-4 h-4' />}
          />

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Notes sur le transport des accompagnants
            </label>
            <textarea
              value={itinerary.companionsNotes || ''}
              onChange={(e) => handleChange('companionsNotes', e.target.value)}
              disabled={readOnly}
              className='w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-primary focus:border-primary p-3 min-h-[80px]'
              placeholder='Informations sur le transport des accompagnants...'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
