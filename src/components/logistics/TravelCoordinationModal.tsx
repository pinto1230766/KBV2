import React, { useState, useMemo } from 'react';
import { Car, Train, Plane, MapPin, Clock, Users, DollarSign, Share2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Visit } from '@/types';
import { useData } from '@/contexts/DataContext';

interface TravelCoordinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit;
  onSave: (travelPlan: TravelPlan) => void;
}

export interface TravelPlan {
  visitId: string;
  transportMode: 'car' | 'train' | 'plane' | 'carpool' | 'other';
  departureTime?: string;
  arrivalTime?: string;
  departureLocation?: string;
  arrivalLocation?: string;
  distance?: number;
  duration?: string;
  estimatedCost?: number;
  carpoolPartners?: string[]; // IDs des autres orateurs
  notes?: string;
  mapLink?: string;
  bookingReference?: string;
}

const TRANSPORT_MODES = [
  { value: 'car' as const, label: 'Voiture personnelle', icon: Car, color: 'blue' },
  { value: 'carpool' as const, label: 'Covoiturage', icon: Users, color: 'green' },
  { value: 'train' as const, label: 'Train', icon: Train, color: 'purple' },
  { value: 'plane' as const, label: 'Avion', icon: Plane, color: 'orange' },
  { value: 'other' as const, label: 'Autre', icon: MapPin, color: 'gray' },
];

export const TravelCoordinationModal: React.FC<TravelCoordinationModalProps> = ({
  isOpen,
  onClose,
  visit,
  onSave
}) => {
  const { visits } = useData();
  const [transportMode, setTransportMode] = useState<TravelPlan['transportMode']>('car');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureLocation, setDepartureLocation] = useState('');
  const [arrivalLocation, setArrivalLocation] = useState('');
  const [distance, setDistance] = useState<number | undefined>();
  const [duration, setDuration] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number | undefined>();
  const [selectedCarpoolPartners, setSelectedCarpoolPartners] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [bookingReference, setBookingReference] = useState('');

  // Trouver les orateurs potentiels pour le covoiturage (même date, même région)
  const potentialCarpoolPartners = useMemo(() => {
    return visits
      .filter(v => 
        v.visitDate === visit.visitDate &&
        v.visitId !== visit.visitId &&
        v.status !== 'cancelled'
      )
      .map(v => ({
        visitId: v.visitId,
        speakerId: v.id,
        speakerName: v.nom,
        congregation: v.congregation,
        time: v.visitTime
      }));
  }, [visits, visit]);

  const toggleCarpoolPartner = (visitId: string) => {
    setSelectedCarpoolPartners(prev =>
      prev.includes(visitId)
        ? prev.filter(id => id !== visitId)
        : [...prev, visitId]
    );
  };

  const calculateCostPerPerson = () => {
    if (!estimatedCost) return 0;
    const totalPeople = 1 + selectedCarpoolPartners.length;
    return (estimatedCost / totalPeople).toFixed(2);
  };

  const handleSave = () => {
    const travelPlan: TravelPlan = {
      visitId: visit.visitId,
      transportMode,
      departureTime: departureTime || undefined,
      arrivalTime: arrivalTime || undefined,
      departureLocation: departureLocation || undefined,
      arrivalLocation: arrivalLocation || undefined,
      distance: distance || undefined,
      duration: duration || undefined,
      estimatedCost: estimatedCost || undefined,
      carpoolPartners: transportMode === 'carpool' ? selectedCarpoolPartners : undefined,
      notes: notes || undefined,
      mapLink: mapLink || undefined,
      bookingReference: bookingReference || undefined
    };

    onSave(travelPlan);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Coordination du voyage"
      size="lg"
    >
      <div className="space-y-6">
        {/* Informations de la visite */}
        <div className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {visit.nom}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })} à {visit.visitTime}
          </p>
        </div>

        {/* Mode de transport */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Mode de transport
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TRANSPORT_MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setTransportMode(mode.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  transportMode === mode.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <mode.icon className={`w-6 h-6 mx-auto mb-2 ${
                  transportMode === mode.value ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {mode.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Horaires */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Heure de départ
            </label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              aria-label="Heure de départ"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Heure d'arrivée
            </label>
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              aria-label="Heure d'arrivée"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lieux */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Lieu de départ
            </label>
            <input
              type="text"
              value={departureLocation}
              onChange={(e) => setDepartureLocation(e.target.value)}
              placeholder="Adresse de départ"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Lieu d'arrivée
            </label>
            <input
              type="text"
              value={arrivalLocation}
              onChange={(e) => setArrivalLocation(e.target.value)}
              placeholder="Adresse d'arrivée"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Distance et durée */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Distance (km)
            </label>
            <input
              type="number"
              value={distance || ''}
              onChange={(e) => setDistance(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="150"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Durée estimée
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="2h 30min"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Coût */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Coût estimé (€)
          </label>
          <input
            type="number"
            value={estimatedCost || ''}
            onChange={(e) => setEstimatedCost(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="50"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Covoiturage */}
        {transportMode === 'carpool' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <Share2 className="w-4 h-4 inline mr-1" />
                Partenaires de covoiturage
              </label>
              {selectedCarpoolPartners.length > 0 && estimatedCost && (
                <Badge variant="success">
                  {calculateCostPerPerson()}€ / personne
                </Badge>
              )}
            </div>

            {potentialCarpoolPartners.length === 0 ? (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center text-sm text-gray-600 dark:text-gray-400">
                Aucun orateur disponible pour le covoiturage ce jour-là
              </div>
            ) : (
              <div className="space-y-2">
                {potentialCarpoolPartners.map((partner) => (
                  <label
                    key={partner.visitId}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCarpoolPartners.includes(partner.visitId)}
                      onChange={() => toggleCarpoolPartner(partner.visitId)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {partner.speakerName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {partner.congregation} • {partner.time}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lien carte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lien Google Maps (optionnel)
          </label>
          <input
            type="url"
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
            placeholder="https://maps.google.com/..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Référence de réservation */}
        {(transportMode === 'train' || transportMode === 'plane') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Référence de réservation
            </label>
            <input
              type="text"
              value={bookingReference}
              onChange={(e) => setBookingReference(e.target.value)}
              placeholder="ABC123456"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes supplémentaires
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Informations complémentaires sur le voyage..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Résumé */}
        {(distance || duration || estimatedCost) && (
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardBody>
              <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                Résumé du voyage
              </h4>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                {distance && <p>• Distance : {distance} km</p>}
                {duration && <p>• Durée : {duration}</p>}
                {estimatedCost && (
                  <p>
                    • Coût : {estimatedCost}€
                    {transportMode === 'carpool' && selectedCarpoolPartners.length > 0 && (
                      <span> ({calculateCostPerPerson()}€ / personne)</span>
                    )}
                  </p>
                )}
                {transportMode === 'carpool' && selectedCarpoolPartners.length > 0 && (
                  <p>• {selectedCarpoolPartners.length + 1} personne(s) dans le covoiturage</p>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Car className="w-4 h-4 mr-2" />
            Enregistrer le plan de voyage
          </Button>
        </div>
      </div>
    </Modal>
  );
};
