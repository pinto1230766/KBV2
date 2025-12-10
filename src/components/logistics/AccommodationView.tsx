import React from 'react';
import { Accommodation } from '@/types';
import { Home, Building, MapPin, Link } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AccommodationViewProps {
  accommodation: Accommodation;
  onUpdate: (accommodation: Accommodation) => void;
  readOnly?: boolean;
  hosts?: Array<{ nom: string; address?: string; }>;
}

// Helper to format ISO date for datetime-local input
const formatDateForInput = (isoString?: string) => {
  if (!isoString) return '';
  return isoString.slice(0, 16); // "YYYY-MM-DDThh:mm"
};

export const AccommodationView: React.FC<AccommodationViewProps> = ({ accommodation, onUpdate, readOnly = false, hosts = [] }) => {
  const handleChange = (field: keyof Accommodation, value: any) => {
    onUpdate({ ...accommodation, [field]: value });
  };

  const openMap = () => {
    const query = encodeURIComponent(accommodation.address || accommodation.name || '');
    if (!query) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {[
          { type: 'host', icon: Home, label: 'Chez l\'habitant' },
          { type: 'hotel', icon: Building, label: 'Hôtel' },
        ].map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => !readOnly && handleChange('type', type)}
            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
              accommodation.type === type
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

      <div className="space-y-4">
        {accommodation.type === 'hotel' ? (
          <Input
            label="Nom de l'hôtel"
            value={accommodation.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={readOnly}
            placeholder="Ex: Hôtel de la Gare"
          />
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom de l'hôte
            </label>
            <select
              value={accommodation.name || ''}
              onChange={(e) => {
                const selectedHost = hosts.find(h => h.nom === e.target.value);
                onUpdate({
                  ...accommodation,
                  name: e.target.value,
                  address: selectedHost?.address || accommodation.address || ''
                });
              }}
              disabled={readOnly}
              title="Sélectionner un hôte"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Sélectionner un hôte...</option>
              {hosts.map(host => (
                <option key={host.nom} value={host.nom}>{host.nom}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              label="Adresse"
              value={accommodation.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={readOnly}
              leftIcon={<MapPin className="w-4 h-4" />}
            />
          </div>
          {accommodation.address && (
            <Button
              variant="outline"
              className="mb-[2px]"
              onClick={openMap}
              leftIcon={<MapPin className="w-4 h-4" />}
            >
              Voir
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Arrivée (Check-in)"
            type="datetime-local"
            value={formatDateForInput(accommodation.checkIn)}
            onChange={(e) => handleChange('checkIn', e.target.value)}
            disabled={readOnly}
          />
          <Input
            label="Départ (Check-out)"
            type="datetime-local"
            value={formatDateForInput(accommodation.checkOut)}
            onChange={(e) => handleChange('checkOut', e.target.value)}
            disabled={readOnly}
          />
        </div>

        {accommodation.type === 'hotel' && (
          <Input
            label="Référence réservation"
            value={accommodation.bookingReference || ''}
            onChange={(e) => handleChange('bookingReference', e.target.value)}
            disabled={readOnly}
            leftIcon={<Link className="w-4 h-4" />}
          />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes / Instructions
          </label>
          <textarea
            value={accommodation.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            disabled={readOnly}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-primary focus:border-primary p-3 min-h-[100px]"
            placeholder="Codes d'accès, petit-déjeuner, etc."
          />
        </div>
      </div>
    </div>
  );
};
