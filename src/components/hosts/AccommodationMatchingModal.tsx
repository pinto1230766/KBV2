import React, { useState, useMemo } from 'react';
import { Home, User, CheckCircle, XCircle, AlertTriangle, Star, MapPin } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Visit, Host, Speaker } from '@/types';
import { useData } from '@/contexts/DataContext';

interface AccommodationMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit;
  speaker?: Speaker;
  onSelectHost: (_host: Host) => void;
}

interface HostMatch {
  host: Host;
  score: number;
  compatibility: CompatibilityFactor[];
  warnings: string[];
}

interface CompatibilityFactor {
  factor: string;
  score: number;
  positive: boolean;
}

// Constants for scoring
/* eslint-disable no-magic-numbers */
const SCORE_WEIGHTS = {
  AVAILABILITY: 40,
  GENDER_COUPLE_COUPLE: 20,
  GENDER_SAME: 15,
  GENDER_PARTIAL: 10,
  CAPACITY_GOOD: 15,
  CAPACITY_LIMITED: 5,
  EQUIPMENT_PARKING: 10,
  EQUIPMENT_ELEVATOR: 5,
  PREFERENCE_PENALTY: 10,
  EXPERIENCE_PER_HOST: 5,
  MAX_EXPERIENCE: 20,
  RECENT_HOST_PENALTY: 10,
  LONG_TIME_AVAILABLE: 10,
  DAYS_RECENT: 30,
  DAYS_LONG_TIME: 180,
  DAYS_IN_MS: 86400000, // 24 * 60 * 60 * 1000
  SCORE_EXCELLENT: 80,
  SCORE_GOOD: 60,
  SCORE_ACCEPTABLE: 40,
  CAPACITY_MATCH: 40,
  PREVIOUS_HOST: 20,
  DISTANCE: 15,
  PETS: 10,
  EXPERIENCE: 5,
  MIN_CAPACITY: 2,
  HOST_CATEGORY: {
    GOLD: 80,
    SILVER: 60,
    BRONZE: 40,
  },
  UI: {
    MIN_HEIGHT: 60,
    MAX_HEIGHT: 180,
    AVATAR_SIZE: 30,
    ITEM_SPACING: 10,
  },
};
/* eslint-enable no-magic-numbers */

export const AccommodationMatchingModal: React.FC<AccommodationMatchingModalProps> = ({
  isOpen,
  onClose,
  visit,
  speaker,
  onSelectHost
}) => {
  const { hosts, visits } = useData();
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);

  // Algorithme de matching intelligent
  const matchedHosts = useMemo(() => {
    const matches: HostMatch[] = [];

    hosts.forEach(host => {
      let score = 0;
      const compatibility: CompatibilityFactor[] = [];
      const warnings: string[] = [];
      
      // Utilisation des constantes de score
      const { AVAILABILITY } = SCORE_WEIGHTS;

      // 1. Vérifier la disponibilité
      const isAvailable = !host.unavailableDates?.includes(visit.visitDate);
      if (isAvailable) {
        score += AVAILABILITY; // Utilisation de la constante
        compatibility.push({
          factor: 'Disponible à cette date',
          score: AVAILABILITY,
          positive: true
        });
      } else {
        warnings.push('Indisponible à cette date');
        if (showOnlyAvailable) return; // Exclure si filtre activé
      }

      // 2. Vérifier le genre (compatibilité)
      if (speaker) {
        if (speaker.gender === 'couple' && host.gender === 'couple') {
          score += SCORE_WEIGHTS.GENDER_COUPLE_COUPLE;
          compatibility.push({
            factor: 'Couple accueille couple',
            score: SCORE_WEIGHTS.GENDER_COUPLE_COUPLE,
            positive: true
          });
        } else if (speaker.gender === host.gender) {
          score += SCORE_WEIGHTS.GENDER_SAME;
          compatibility.push({
            factor: 'Genre compatible',
            score: SCORE_WEIGHTS.GENDER_SAME,
            positive: true
          });
        } else if (speaker.gender === 'couple' || host.gender === 'couple') {
          score += SCORE_WEIGHTS.GENDER_PARTIAL;
          compatibility.push({
            factor: 'Genre partiellement compatible',
            score: SCORE_WEIGHTS.GENDER_PARTIAL,
            positive: true
          });
        }
      }

      // 3. Capacité d'accueil
      if (host.capacity) {
        if (host.capacity >= SCORE_WEIGHTS.MIN_CAPACITY) {
          score += SCORE_WEIGHTS.CAPACITY_GOOD;
          compatibility.push({
            factor: `Capacité: ${host.capacity} personne(s)`,
            score: SCORE_WEIGHTS.CAPACITY_GOOD,
            positive: true
          });
        } else {
          compatibility.push({
            factor: 'Capacité limitée (1 personne)',
            score: SCORE_WEIGHTS.CAPACITY_LIMITED,
            positive: false
          });
        }
      }

      // 4. Équipements
      if (host.hasParking) {
        score += SCORE_WEIGHTS.EQUIPMENT_PARKING;
        compatibility.push({
          factor: 'Parking disponible',
          score: SCORE_WEIGHTS.EQUIPMENT_PARKING,
          positive: true
        });
      }

      if (host.hasElevator) {
        score += SCORE_WEIGHTS.EQUIPMENT_ELEVATOR;
        compatibility.push({
          factor: 'Ascenseur disponible',
          score: SCORE_WEIGHTS.EQUIPMENT_ELEVATOR,
          positive: true
        });
      }

      // 5. Préférences spéciales
      if (speaker?.isVehiculed && !host.hasParking) {
        warnings.push('Orateur véhiculé mais pas de parking');
        score -= SCORE_WEIGHTS.PREFERENCE_PENALTY;
      }

      // 6. Animaux
      if (host.hasPets) {
        compatibility.push({
          factor: 'Animaux de compagnie',
          score: 0,
          positive: false
        });
        warnings.push('Présence d\'animaux');
      }


      // 8. Historique d'accueil
      const previousAccommodations = visits.filter(v =>
        v.host === host.nom &&
        v.status === 'completed'
      );

      if (previousAccommodations.length > 0) {
        const experienceScore = Math.min(previousAccommodations.length * SCORE_WEIGHTS.EXPERIENCE_PER_HOST, SCORE_WEIGHTS.MAX_EXPERIENCE);
        score += experienceScore;
        compatibility.push({
          factor: `${previousAccommodations.length} accueil(s) réussi(s)`,
          score: experienceScore,
          positive: true
        });
      }

      // 9. Dernière fois qu'il a accueilli
      const lastAccommodation = previousAccommodations
        .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())[0];

      if (lastAccommodation) {
        const daysSince = Math.floor(
          (new Date(visit.visitDate).getTime() - new Date(lastAccommodation.visitDate).getTime()) /
          SCORE_WEIGHTS.DAYS_IN_MS
        );

        if (daysSince < SCORE_WEIGHTS.DAYS_RECENT) {
          warnings.push('A accueilli récemment');
          score -= SCORE_WEIGHTS.RECENT_HOST_PENALTY;
        } else if (daysSince > SCORE_WEIGHTS.DAYS_LONG_TIME) {
          score += SCORE_WEIGHTS.LONG_TIME_AVAILABLE;
          compatibility.push({
            factor: 'Disponible depuis longtemps',
            score: SCORE_WEIGHTS.LONG_TIME_AVAILABLE,
            positive: true
          });
        }
      }

      matches.push({
        host,
        score: Math.max(0, score),
        compatibility,
        warnings
      });
    });

    return matches.sort((a, b) => b.score - a.score);
  }, [hosts, visits, visit, speaker, showOnlyAvailable]);

  const handleSelectHost = () => {
    if (selectedHost) {
      onSelectHost(selectedHost);
      onClose();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= SCORE_WEIGHTS.SCORE_EXCELLENT) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score >= SCORE_WEIGHTS.SCORE_GOOD) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    if (score >= SCORE_WEIGHTS.SCORE_ACCEPTABLE) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const getScoreLabel = (score: number) => {
    if (score >= SCORE_WEIGHTS.SCORE_EXCELLENT) return 'Excellent match';
    if (score >= SCORE_WEIGHTS.SCORE_GOOD) return 'Bon match';
    if (score >= SCORE_WEIGHTS.SCORE_ACCEPTABLE) return 'Match acceptable';
    return 'Match faible';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Matching intelligent hôte/orateur"
      size="xl"
    >
      <div className="space-y-6">
        {/* Informations de la visite */}
        <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-primary-600" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {visit.nom}
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </p>
          {speaker && (
            <div className="mt-2 flex gap-2">
              <Badge variant="default">{speaker.gender === 'male' ? 'Homme' : speaker.gender === 'female' ? 'Femme' : 'Couple'}</Badge>
              {speaker.isVehiculed && <Badge variant="default">Véhiculé</Badge>}
            </div>
          )}
        </div>

        {/* Filtre */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={(e) => setShowOnlyAvailable(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Afficher uniquement les hôtes disponibles
            </span>
          </label>
          <Badge variant="default">
            {matchedHosts.length} hôte(s) trouvé(s)
          </Badge>
        </div>

        {/* Liste des hôtes */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {matchedHosts.length === 0 ? (
            <div className="text-center py-12">
              <Home className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Aucun hôte trouvé
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Essayez de désactiver le filtre de disponibilité
              </p>
            </div>
          ) : (
            matchedHosts.map((match) => (
              <Card
                key={match.host.nom}
                hoverable
                className={`cursor-pointer transition-all ${
                  selectedHost?.nom === match.host.nom
                    ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : ''
                }`}
                onClick={() => setSelectedHost(match.host)}
              >
                <CardBody>
                  <div className="space-y-3">
                    {/* En-tête */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-lg">
                          {match.host.nom.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {match.host.nom}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            {match.host.address && (
                              <>
                                <MapPin className="w-3 h-3" />
                                {match.host.address}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getScoreColor(match.score)}`}>
                          <Star className="w-4 h-4" />
                          <span className="text-lg font-bold">{match.score}</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {getScoreLabel(match.score)}
                        </div>
                      </div>
                    </div>

                    {/* Facteurs de compatibilité */}
                    <div className="flex flex-wrap gap-2">
                      {match.compatibility.map((factor, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                            factor.positive
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
                          }`}
                        >
                          {factor.positive ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {factor.factor}
                        </div>
                      ))}
                    </div>

                    {/* Avertissements */}
                    {match.warnings.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {match.warnings.map((warning, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                          >
                            <XCircle className="w-3 h-3" />
                            {warning}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Informations supplémentaires */}
                    {match.host.notes && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                        "{match.host.notes}"
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Informations sur l'hôte sélectionné */}
        {selectedHost && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Hôte sélectionné :</strong> {selectedHost.nom}
                {selectedHost.telephone && (
                  <div className="mt-1">Téléphone : {selectedHost.telephone}</div>
                )}
                {selectedHost.email && (
                  <div className="mt-1">Email : {selectedHost.email}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSelectHost}
            disabled={!selectedHost}
          >
            <Home className="w-4 h-4 mr-2" />
            Sélectionner cet hôte
          </Button>
        </div>
      </div>
    </Modal>
  );
};
