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

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, onUpdate, readOnly = false }) => {
  const handleChange = (field: keyof Itinerary, value: any) => {
    onUpdate({ ...itinerary, [field]: value });
  };

  const openApp = (app: 'waze' | 'google') => {
    const query = encodeURIComponent(itinerary.meetingPoint || '');
    if (!query) return;
    
    const url = app === 'waze' 
      ? `https://waze.com/ul?q=${query}&navigate=yes`
      : `https://www.google.com/maps/search/?api=1&query=${query}`;
    
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {[
          { mode: 'car', icon: Car, label: 'Voiture' },
          { mode: 'train', icon: Train, label: 'Train' },
          { mode: 'plane', icon: Plane, label: 'Avion' },
        ].map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => !readOnly && handleChange('transportMode', mode)}
            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
              itinerary.transportMode === mode
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500'
            }`}
            disabled={readOnly}
          >
            <Icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Distance (km)"
          type="number"
          value={itinerary.distance || ''}
          onChange={(e) => handleChange('distance', parseFloat(e.target.value))}
          disabled={readOnly}
          leftIcon={<Navigation className="w-4 h-4" />}
        />
        <Input
          label="Durée estimée"
          placeholder="ex: 1h 30m"
          value={itinerary.duration || ''}
          onChange={(e) => handleChange('duration', e.target.value)}
          disabled={readOnly}
          leftIcon={<Clock className="w-4 h-4" />}
        />
      </div>

      <div className="space-y-4">
        <Input
          label="Point de rendez-vous / Adresse"
          value={itinerary.meetingPoint || ''}
          onChange={(e) => handleChange('meetingPoint', e.target.value)}
          disabled={readOnly}
          leftIcon={<MapPin className="w-4 h-4" />}
        />

        {itinerary.meetingPoint && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => openApp('google')}
              leftIcon={<MapIcon className="w-4 h-4" />}
            >
              Google Maps
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => openApp('waze')}
              leftIcon={<Navigation className="w-4 h-4" />}
            >
              Waze
            </Button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes de voyage
        </label>
        <textarea
          value={itinerary.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          disabled={readOnly}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary p-3 min-h-[100px]"
          placeholder="Informations supplémentaires..."
        />
      </div>
    </div>
  );
};
