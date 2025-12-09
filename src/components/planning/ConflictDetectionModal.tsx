import React, { useMemo, useState } from 'react';
import { AlertTriangle, Calendar, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Visit, Speaker, Host } from '@/types';
import { useData } from '@/contexts/DataContext';

interface ConflictDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit;
  onResolve?: (resolution: ConflictResolution) => void;
}

interface Conflict {
  id: string;
  type: 'date' | 'speaker' | 'host' | 'talk';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  details: string;
  affectedVisit?: Visit;
  suggestions: ConflictSuggestion[];
}

interface ConflictSuggestion {
  id: string;
  type: 'reschedule' | 'change_speaker' | 'change_host' | 'cancel';
  description: string;
  newDate?: string;
  newSpeaker?: Speaker;
  newHost?: Host;
  impact: 'low' | 'medium' | 'high';
}

interface ConflictResolution {
  conflictId: string;
  suggestionId: string;
  action: 'apply' | 'ignore';
}

export const ConflictDetectionModal: React.FC<ConflictDetectionModalProps> = ({
  isOpen,
  onClose,
  visit,
  onResolve
}) => {
  const { visits, hosts } = useData();
  const [selectedResolutions, setSelectedResolutions] = useState<Map<string, string>>(new Map());

  // Détection des conflits
  const conflicts = useMemo(() => {
    const detected: Conflict[] = [];

    // 1. Conflit de date - Même orateur, même date
    const sameDateSpeaker = visits.find(v => 
      v.id === visit.id && 
      v.visitId !== visit.visitId &&
      v.visitDate === visit.visitDate &&
      v.status !== 'cancelled'
    );

    if (sameDateSpeaker) {
      detected.push({
        id: 'conflict-speaker-date',
        type: 'speaker',
        severity: 'critical',
        message: 'Orateur déjà programmé',
        details: `${visit.nom} est déjà programmé le ${new Date(visit.visitDate).toLocaleDateString('fr-FR')}`,
        affectedVisit: sameDateSpeaker,
        suggestions: [
          {
            id: 'suggest-reschedule',
            type: 'reschedule',
            description: 'Reprogrammer cette visite à une autre date',
            impact: 'medium'
          },
          {
            id: 'suggest-cancel-other',
            type: 'cancel',
            description: 'Annuler l\'autre visite',
            impact: 'high'
          }
        ]
      });
    }

    // 2. Conflit d'hôte - Hôte indisponible
    const hostData = hosts.find(h => h.nom === visit.host);
    if (hostData?.unavailableDates?.includes(visit.visitDate)) {
      const availableHosts = hosts.filter(h => 
        !h.unavailableDates?.includes(visit.visitDate) &&
        h.gender === visit.congregation // Exemple de matching
      );

      detected.push({
        id: 'conflict-host-unavailable',
        type: 'host',
        severity: 'warning',
        message: 'Hôte indisponible',
        details: `${visit.host} n'est pas disponible le ${new Date(visit.visitDate).toLocaleDateString('fr-FR')}`,
        suggestions: availableHosts.slice(0, 3).map((h, idx) => ({
          id: `suggest-host-${idx}`,
          type: 'change_host',
          description: `Assigner à ${h.nom}`,
          newHost: h,
          impact: 'low'
        }))
      });
    }

    // 3. Conflit de discours - Même discours récemment donné
    const recentSameTalk = visits.find(v => 
      v.visitId !== visit.visitId &&
      v.talkNoOrType === visit.talkNoOrType &&
      v.status === 'completed' &&
      Math.abs(new Date(v.visitDate).getTime() - new Date(visit.visitDate).getTime()) < 90 * 24 * 60 * 60 * 1000 // 90 jours
    );

    if (recentSameTalk && visit.talkNoOrType) {
      detected.push({
        id: 'conflict-talk-recent',
        type: 'talk',
        severity: 'info',
        message: 'Discours récemment donné',
        details: `Le discours ${visit.talkNoOrType} a été donné il y a moins de 3 mois`,
        affectedVisit: recentSameTalk,
        suggestions: [
          {
            id: 'suggest-different-talk',
            type: 'change_speaker',
            description: 'Choisir un autre discours',
            impact: 'low'
          },
          {
            id: 'suggest-ignore',
            type: 'reschedule',
            description: 'Continuer quand même',
            impact: 'low'
          }
        ]
      });
    }

    // 4. Conflit de charge - Trop de visites le même mois
    const sameMonthVisits = visits.filter(v => {
      const vDate = new Date(v.visitDate);
      const visitDate = new Date(visit.visitDate);
      return vDate.getMonth() === visitDate.getMonth() &&
             vDate.getFullYear() === visitDate.getFullYear() &&
             v.status !== 'cancelled';
    });

    if (sameMonthVisits.length > 5) {
      detected.push({
        id: 'conflict-overload',
        type: 'date',
        severity: 'warning',
        message: 'Charge élevée ce mois',
        details: `${sameMonthVisits.length} visites programmées ce mois`,
        suggestions: [
          {
            id: 'suggest-next-month',
            type: 'reschedule',
            description: 'Déplacer au mois suivant',
            impact: 'medium'
          }
        ]
      });
    }

    return detected;
  }, [visit, visits, hosts]);

  const getSeverityColor = (severity: Conflict['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'warning': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'info': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    }
  };

  const getSeverityIcon = (severity: Conflict['severity']) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'info': return <CheckCircle className="w-5 h-5" />;
    }
  };

  const handleSelectSuggestion = (conflictId: string, suggestionId: string) => {
    setSelectedResolutions(prev => {
      const newMap = new Map(prev);
      newMap.set(conflictId, suggestionId);
      return newMap;
    });
  };

  const handleApplyResolutions = () => {
    selectedResolutions.forEach((suggestionId, conflictId) => {
      if (onResolve) {
        onResolve({
          conflictId,
          suggestionId,
          action: 'apply'
        });
      }
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Détection de Conflits"
      size="lg"
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Calendar className="w-6 h-6 text-primary-600" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {visit.nom}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })} à {visit.visitTime}
            </p>
          </div>
        </div>

        {/* Résumé */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {conflicts.length} conflit{conflicts.length > 1 ? 's' : ''} détecté{conflicts.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex gap-2">
            <Badge variant="danger">
              {conflicts.filter(c => c.severity === 'critical').length} critique{conflicts.filter(c => c.severity === 'critical').length > 1 ? 's' : ''}
            </Badge>
            <Badge variant="warning">
              {conflicts.filter(c => c.severity === 'warning').length} avertissement{conflicts.filter(c => c.severity === 'warning').length > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {/* Liste des conflits */}
        {conflicts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Aucun conflit détecté
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Cette visite peut être programmée sans problème
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conflicts.map((conflict) => (
              <Card key={conflict.id} className={`border-l-4 ${
                conflict.severity === 'critical' ? 'border-l-red-600' : 
                conflict.severity === 'warning' ? 'border-l-orange-500' : 'border-l-blue-500'
              }`}>
                <CardBody className="space-y-4">
                  {/* En-tête du conflit */}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getSeverityColor(conflict.severity)}`}>
                      {getSeverityIcon(conflict.severity)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {conflict.message}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {conflict.details}
                      </p>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {conflict.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Solutions suggérées :
                      </p>
                      {conflict.suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSelectSuggestion(conflict.id, suggestion.id)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                            selectedResolutions.get(conflict.id) === suggestion.id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ArrowRight className="w-4 h-4 text-primary-600" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {suggestion.description}
                              </span>
                            </div>
                            <Badge variant={
                              suggestion.impact === 'high' ? 'danger' :
                              suggestion.impact === 'medium' ? 'warning' : 'default'
                            }>
                              Impact {suggestion.impact === 'high' ? 'élevé' : 
                                     suggestion.impact === 'medium' ? 'moyen' : 'faible'}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          {conflicts.length > 0 && (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  conflicts.forEach(c => {
                    if (onResolve) {
                      onResolve({
                        conflictId: c.id,
                        suggestionId: '',
                        action: 'ignore'
                      });
                    }
                  });
                  onClose();
                }}
              >
                Ignorer les conflits
              </Button>
              <Button 
                variant="primary" 
                onClick={handleApplyResolutions}
                disabled={selectedResolutions.size === 0}
              >
                Appliquer les solutions ({selectedResolutions.size})
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
