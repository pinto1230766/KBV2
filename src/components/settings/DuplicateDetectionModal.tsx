import React, { useState, useMemo } from 'react';
import { Copy, Trash2, AlertTriangle, Merge, CheckCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Speaker, Host, Visit } from '@/types';
import { useData } from '@/contexts/DataContext';

interface DuplicateDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMerge: (duplicates: DuplicateGroup[], action: 'merge' | 'delete') => void;
}

interface DuplicateGroup {
  type: 'speaker' | 'host' | 'visit' | 'message';
  items: any[];
  similarity: number;
  reason: string[];
}

export const DuplicateDetectionModal: React.FC<DuplicateDetectionModalProps> = ({
  isOpen,
  onClose,
  onMerge
}) => {
  const { speakers, hosts, visits, speakerMessages } = useData();
  const [selectedGroups, setSelectedGroups] = useState<Set<number>>(new Set());
  const [mergeStrategy, setMergeStrategy] = useState<'keep-first' | 'keep-recent' | 'manual'>('keep-recent');

  // Algorithme de détection de doublons
  const duplicateGroups = useMemo(() => {
    const groups: DuplicateGroup[] = [];

    // 1. Détection de doublons d'orateurs
    const speakerGroups = new Map<string, Speaker[]>();
    speakers.forEach(speaker => {
      const normalizedName = speaker.nom.toLowerCase().trim().replace(/\s+/g, ' ');
      const key = normalizedName;
      
      if (!speakerGroups.has(key)) {
        speakerGroups.set(key, []);
      }
      speakerGroups.get(key)!.push(speaker);
    });

    speakerGroups.forEach((group) => {
      if (group.length > 1) {
        const reasons: string[] = ['Nom identique'];
        
        // Vérifier téléphone identique
        const phones = group.map(s => s.telephone).filter(Boolean);
        if (phones.length > 1 && new Set(phones).size < phones.length) {
          reasons.push('Téléphone identique');
        }

        // Vérifier congrégation identique
        const congregations = group.map(s => s.congregation);
        if (new Set(congregations).size === 1) {
          reasons.push('Même congrégation');
        }

        groups.push({
          type: 'speaker',
          items: group,
          similarity: 95,
          reason: reasons
        });
      }
    });

    // 2. Détection de doublons d'hôtes
    const hostGroups = new Map<string, Host[]>();
    hosts.forEach(host => {
      const normalizedName = host.nom.toLowerCase().trim().replace(/\s+/g, ' ');
      const key = normalizedName;
      
      if (!hostGroups.has(key)) {
        hostGroups.set(key, []);
      }
      hostGroups.get(key)!.push(host);
    });

    hostGroups.forEach((group) => {
      if (group.length > 1) {
        const reasons: string[] = ['Nom identique'];
        
        const phones = group.map(h => h.telephone).filter(Boolean);
        if (phones.length > 1 && new Set(phones).size < phones.length) {
          reasons.push('Téléphone identique');
        }

        const addresses = group.map(h => h.address).filter(Boolean);
        if (addresses.length > 1 && new Set(addresses).size < addresses.length) {
          reasons.push('Adresse identique');
        }

        groups.push({
          type: 'host',
          items: group,
          similarity: 95,
          reason: reasons
        });
      }
    });

    // 3. Détection de visites en double
    const visitGroups = new Map<string, Visit[]>();
    visits.forEach(visit => {
      const key = `${visit.id}-${visit.visitDate}-${visit.visitTime}`;
      
      if (!visitGroups.has(key)) {
        visitGroups.set(key, []);
      }
      visitGroups.get(key)!.push(visit);
    });

    visitGroups.forEach((group) => {
      if (group.length > 1) {
        groups.push({
          type: 'visit',
          items: group,
          similarity: 100,
          reason: ['Même orateur, date et heure']
        });
      }
    });

    // 4. Détection de messages en double
    const messageGroups = new Map<string, any[]>();
    if (speakerMessages && speakerMessages.length > 0) {
      speakerMessages.forEach(msg => {
        // Clé combinant l'ID de l'orateur, le contenu et la date de réception
        const normalizedContent = msg.message?.trim().toLowerCase() || '';
        const dateKey = msg.receivedAt ? new Date(msg.receivedAt).toISOString() : 'no-date';
        // On considère un doublon si même orateur, même message, même date (à la seconde près)
        const key = `${msg.speakerId}-${normalizedContent}-${dateKey}`;
        
        if (!messageGroups.has(key)) {
          messageGroups.set(key, []);
        }
        messageGroups.get(key)!.push(msg);
      });
    }

    messageGroups.forEach((group) => {
      if (group.length > 1) {
        groups.push({
          type: 'message',
          items: group,
          similarity: 100,
          reason: ['Contenu et date identiques']
        });
      }
    });

    return groups;
  }, [speakers, hosts, visits, speakerMessages]);

  const toggleGroup = (index: number) => {
    setSelectedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleMerge = () => {
    const selectedDuplicates = Array.from(selectedGroups).map(idx => duplicateGroups[idx]);
    onMerge(selectedDuplicates, 'merge');
    onClose();
  };

  const handleDelete = () => {
    const selectedDuplicates = Array.from(selectedGroups).map(idx => duplicateGroups[idx]);
    onMerge(selectedDuplicates, 'delete');
    onClose();
  };

  const getTypeLabel = (type: DuplicateGroup['type']) => {
    switch (type) {
      case 'speaker': return 'Orateur';
      case 'host': return 'Hôte';
      case 'visit': return 'Visite';
      case 'message': return 'Message';
    }
  };

  const getTypeColor = (type: DuplicateGroup['type']) => {
    switch (type) {
      case 'speaker': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'host': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'visit': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'message': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Détection de doublons"
      size="xl"
    >
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {duplicateGroups.filter(g => g.type === 'speaker').length}
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-300">Orateurs</div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {duplicateGroups.filter(g => g.type === 'host').length}
            </div>
            <div className="text-sm text-green-800 dark:text-green-300">Hôtes</div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {duplicateGroups.filter(g => g.type === 'visit').length}
            </div>
            <div className="text-sm text-purple-800 dark:text-purple-300">Visites</div>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {duplicateGroups.filter(g => g.type === 'message').length}
            </div>
            <div className="text-sm text-red-800 dark:text-red-300">Messages</div>
          </div>
        </div>

        {/* Stratégie de fusion */}
        {selectedGroups.size > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Stratégie de fusion
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="keep-recent"
                  checked={mergeStrategy === 'keep-recent'}
                  onChange={(e) => setMergeStrategy(e.target.value as any)}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Conserver l'entrée la plus récente
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="keep-first"
                  checked={mergeStrategy === 'keep-first'}
                  onChange={(e) => setMergeStrategy(e.target.value as any)}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Conserver la première entrée
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Liste des doublons */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {duplicateGroups.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Aucun doublon détecté
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vos données sont propres et sans doublons
              </p>
            </div>
          ) : (
            duplicateGroups.map((group, index) => (
              <Card
                key={index}
                className={`${
                  group.similarity >= 90 ? 'border-l-4 border-l-red-600' : 'border-l-4 border-l-orange-500'
                } ${
                  selectedGroups.has(index) ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <CardBody>
                  <div className="space-y-4">
                    {/* En-tête */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedGroups.has(index)}
                          onChange={() => toggleGroup(index)}
                          aria-label={`Sélectionner ce groupe de doublons ${getTypeLabel(group.type)}`}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getTypeColor(group.type)}>
                              {getTypeLabel(group.type)}
                            </Badge>
                            <Badge variant="warning">
                              {group.similarity}% similaire
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {group.reason.map((reason, idx) => (
                              <span key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                                • {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Copy className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Items en double */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {group.items.map((item: any, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="font-medium text-gray-900 dark:text-white mb-2">
                            {group.type === 'message' ? (item.subject || 'Message sans sujet') : (item.nom || `Visite ${itemIdx + 1}`)}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            {group.type === 'speaker' && (
                              <>
                                <div>Congrégation : {item.congregation}</div>
                                {item.telephone && <div>Tél : {item.telephone}</div>}
                                {item.email && <div>Email : {item.email}</div>}
                                <div>Visites : {visits.filter(v => v.id === item.id).length}</div>
                                <div>Messages : {visits.filter(v => v.id === item.id && v.communicationStatus).length}</div>
                                {item.createdAt && (
                                  <div className="text-xs">
                                    Créé : {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                                  </div>
                                )}
                              </>
                            )}
                            {group.type === 'host' && (
                              <>
                                {item.telephone && <div>Tél : {item.telephone}</div>}
                                {item.address && <div>Adresse : {item.address}</div>}
                                {item.createdAt && (
                                  <div className="text-xs">
                                    Créé : {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                                  </div>
                                )}
                              </>
                            )}
                            {group.type === 'visit' && (
                              <>
                                <div>Date : {new Date(item.visitDate).toLocaleDateString('fr-FR')}</div>
                                <div>Heure : {item.visitTime}</div>
                                <div>Statut : {item.status}</div>
                              </>
                            )}
                            {group.type === 'message' && (
                              <>
                                <div>Orateur : {item.speakerName}</div>
                                <div>Date : {new Date(item.receivedAt).toLocaleDateString('fr-FR')} {new Date(item.receivedAt).toLocaleTimeString('fr-FR')}</div>
                                <div className="line-clamp-2">Contenu : {item.message}</div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Avertissement */}
        {selectedGroups.size > 0 && (
          <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800 dark:text-orange-300">
              <strong>Attention :</strong> La fusion des doublons est irréversible. Assurez-vous de vérifier les données avant de continuer.
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
          {selectedGroups.size > 0 && (
            <>
              <Button variant="danger" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer les doublons ({selectedGroups.size})
              </Button>
              <Button variant="primary" onClick={handleMerge}>
                <Merge className="w-4 h-4 mr-2" />
                Fusionner ({selectedGroups.size})
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
