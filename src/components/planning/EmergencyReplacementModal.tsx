import React, { useState, useMemo } from 'react';
import { AlertCircle, User, Phone, MapPin, Calendar, Send, Search, Filter } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Visit, Speaker } from '@/types';
import { useData } from '@/contexts/DataContext';

interface EmergencyReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit;
  onSelectReplacement: (speaker: Speaker, sendNotification: boolean) => void;
}

interface SpeakerMatch {
  speaker: Speaker;
  score: number;
  reasons: string[];
  availableTalks: string[];
  distance?: number;
  lastVisit?: string;
}

export const EmergencyReplacementModal: React.FC<EmergencyReplacementModalProps> = ({
  isOpen,
  onClose,
  visit,
  onSelectReplacement,
}) => {
  const { speakers, visits } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByDistance, setFilterByDistance] = useState(false);
  const [filterByAvailability, setFilterByAvailability] = useState(true);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [sendNotification, setSendNotification] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Algorithme de matching intelligent
  const matchedSpeakers = useMemo(() => {
    const matches: SpeakerMatch[] = [];

    speakers.forEach((speaker) => {
      // Ne pas suggérer l'orateur original
      if (speaker.id === visit.id) return;

      let score = 0;
      const reasons: string[] = [];
      const availableTalks: string[] = [];

      // 1. Vérifier les discours disponibles
      const speakerTalks = speaker.talkHistory.map((t) => t.talkNo.toString());
      if (visit.talkNoOrType && speakerTalks.includes(visit.talkNoOrType)) {
        score += 50;
        reasons.push('Possède le même discours');
        availableTalks.push(visit.talkNoOrType);
      } else {
        // Ajouter tous les discours disponibles
        speakerTalks.forEach((talk) => availableTalks.push(talk));
      }

      // 2. Vérifier la disponibilité (pas de visite le même jour)
      const hasConflict = visits.some(
        (v) => v.id === speaker.id && v.visitDate === visit.visitDate && v.status !== 'cancelled'
      );

      if (!hasConflict) {
        score += 30;
        reasons.push('Disponible à cette date');
      } else {
        if (filterByAvailability) return; // Exclure si filtre activé
        reasons.push('⚠️ Déjà programmé ce jour');
      }

      // 3. Vérifier la proximité géographique
      if (speaker.congregation === visit.congregation) {
        score += 20;
        reasons.push('Même congrégation');
      }

      // 4. Vérifier l'historique récent
      const recentVisits = visits.filter(
        (v) =>
          v.id === speaker.id &&
          v.status === 'completed' &&
          new Date(v.visitDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      );

      if (recentVisits.length === 0) {
        score += 15;
        reasons.push('Pas de visite récente');
      }

      // 5. Vérifier si véhiculé
      if (speaker.isVehiculed) {
        score += 10;
        reasons.push('Véhiculé');
      }

      // 6. Vérifier les contacts disponibles
      if (speaker.telephone) {
        score += 5;
        reasons.push('Téléphone disponible');
      }

      // Calculer la dernière visite
      const lastVisit = visits
        .filter((v) => v.id === speaker.id && v.status === 'completed')
        .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())[0];

      matches.push({
        speaker,
        score,
        reasons,
        availableTalks,
        lastVisit: lastVisit?.visitDate,
      });
    });

    // Trier par score décroissant
    return matches
      .sort((a, b) => b.score - a.score)
      .filter((m) => {
        if (searchTerm) {
          return (
            m.speaker.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.speaker.congregation.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return true;
      });
  }, [speakers, visits, visit, searchTerm, filterByAvailability]);

  const handleSelectSpeaker = () => {
    if (selectedSpeaker) {
      onSelectReplacement(selectedSpeaker, sendNotification);
      onClose();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score >= 50) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    if (score >= 30) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent match';
    if (score >= 50) return 'Bon match';
    if (score >= 30) return 'Match acceptable';
    return 'Match faible';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trouver un remplaçant d'urgence" size='xl'>
      <div className='space-y-6'>
        {/* Alerte urgence */}
        <div className='flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
          <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
          <div>
            <h4 className='font-semibold text-red-900 dark:text-red-200'>
              Remplacement d'urgence requis
            </h4>
            <p className='text-sm text-red-800 dark:text-red-300 mt-1'>
              Visite de <strong>{visit.nom}</strong> le{' '}
              <strong>{new Date(visit.visitDate).toLocaleDateString('fr-FR')}</strong> à{' '}
              <strong>{visit.visitTime}</strong>
            </p>
            {visit.talkNoOrType && (
              <p className='text-sm text-red-800 dark:text-red-300'>
                Discours : <strong>{visit.talkNoOrType}</strong> - {visit.talkTheme}
              </p>
            )}
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className='space-y-3'>
          <div className='flex gap-3'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Rechercher un orateur...'
                className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>
            <Button variant='outline' onClick={() => setShowFilters(!showFilters)}>
              <Filter className='w-4 h-4 mr-2' />
              Filtres
            </Button>
          </div>

          {showFilters && (
            <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={filterByAvailability}
                  onChange={(e) => setFilterByAvailability(e.target.checked)}
                  className='w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  Uniquement disponibles
                </span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={filterByDistance}
                  onChange={(e) => setFilterByDistance(e.target.checked)}
                  className='w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  Proximité géographique
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className='grid grid-cols-3 gap-4'>
          <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-blue-600'>{matchedSpeakers.length}</div>
            <div className='text-sm text-blue-800 dark:text-blue-300'>Orateurs trouvés</div>
          </div>
          <div className='p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-green-600'>
              {matchedSpeakers.filter((m) => m.score >= 50).length}
            </div>
            <div className='text-sm text-green-800 dark:text-green-300'>Bons matchs</div>
          </div>
          <div className='p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-purple-600'>
              {
                matchedSpeakers.filter((m) => m.availableTalks.includes(visit.talkNoOrType || ''))
                  .length
              }
            </div>
            <div className='text-sm text-purple-800 dark:text-purple-300'>Même discours</div>
          </div>
        </div>

        {/* Liste des orateurs */}
        <div className='space-y-3 max-h-96 overflow-y-auto'>
          {matchedSpeakers.length === 0 ? (
            <div className='text-center py-12'>
              <AlertCircle className='w-16 h-16 mx-auto mb-4 text-gray-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Aucun orateur trouvé
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          ) : (
            matchedSpeakers.map((match) => (
              <Card
                key={match.speaker.id}
                hoverable
                className={`cursor-pointer transition-all ${
                  selectedSpeaker?.id === match.speaker.id
                    ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : ''
                }`}
                onClick={() => setSelectedSpeaker(match.speaker)}
              >
                <CardBody>
                  <div className='flex items-start justify-between gap-4'>
                    {/* Informations orateur */}
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <div className='w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-lg'>
                          {match.speaker.nom.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className='font-semibold text-gray-900 dark:text-white'>
                            {match.speaker.nom}
                          </h4>
                          <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                            <MapPin className='w-3 h-3' />
                            {match.speaker.congregation}
                          </div>
                        </div>
                      </div>

                      {/* Raisons du match */}
                      <div className='flex flex-wrap gap-2 mb-3'>
                        {match.reasons.map((reason, idx) => (
                          <Badge key={idx} variant='default' className='text-xs'>
                            {reason}
                          </Badge>
                        ))}
                      </div>

                      {/* Discours disponibles */}
                      {match.availableTalks.length > 0 && (
                        <div className='text-sm'>
                          <span className='text-gray-600 dark:text-gray-400'>Discours : </span>
                          <span className='text-gray-900 dark:text-white'>
                            {match.availableTalks.slice(0, 5).join(', ')}
                            {match.availableTalks.length > 5 &&
                              ` +${match.availableTalks.length - 5}`}
                          </span>
                        </div>
                      )}

                      {/* Contact */}
                      {match.speaker.telephone && (
                        <div className='flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400'>
                          <Phone className='w-3 h-3' />
                          {match.speaker.telephone}
                        </div>
                      )}

                      {/* Dernière visite */}
                      {match.lastVisit && (
                        <div className='flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-500'>
                          <Calendar className='w-3 h-3' />
                          Dernière visite : {new Date(match.lastVisit).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>

                    {/* Score */}
                    <div className='text-right'>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getScoreColor(match.score)}`}
                      >
                        <span className='text-lg font-bold'>{match.score}</span>
                      </div>
                      <div className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                        {getScoreLabel(match.score)}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Option de notification */}
        {selectedSpeaker && (
          <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
            <label className='flex items-start gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className='mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
              />
              <div>
                <div className='flex items-center gap-2'>
                  <Send className='w-4 h-4 text-blue-600' />
                  <span className='font-medium text-blue-900 dark:text-blue-200'>
                    Envoyer une notification immédiate
                  </span>
                </div>
                <p className='text-sm text-blue-800 dark:text-blue-300 mt-1'>
                  Un message sera envoyé à {selectedSpeaker.nom} pour l'informer du remplacement
                  d'urgence
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Actions */}
        <div className='flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Button variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button variant='primary' onClick={handleSelectSpeaker} disabled={!selectedSpeaker}>
            <User className='w-4 h-4 mr-2' />
            Sélectionner ce remplaçant
          </Button>
        </div>
      </div>
    </Modal>
  );
};
