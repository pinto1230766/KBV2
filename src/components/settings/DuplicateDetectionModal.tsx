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
  onMerge: (
    _duplicates: DuplicateGroup[],
    _action: 'merge' | 'delete',
    _strategy?: 'keep-first' | 'keep-recent' | 'manual'
  ) => void;
}

interface DuplicateGroup {
  type: 'speaker' | 'host' | 'visit' | 'message' | 'archivedVisit';
  items: any[];
  similarity: number;
  reason: string[];
}

export const DuplicateDetectionModal: React.FC<DuplicateDetectionModalProps> = ({
  isOpen,
  onClose: _onClose,
  onMerge: _onMerge,
}) => {
  const { speakers, hosts, visits, speakerMessages, archivedVisits, mergeDuplicates } = useData();
  const [selectedGroups, setSelectedGroups] = useState<Set<number>>(new Set());
  const [mergeStrategy, setMergeStrategy] = useState<'keep-first' | 'keep-recent' | 'manual'>(
    'keep-recent'
  );
  const [includeArchives, setIncludeArchives] = useState(false);

  // Seuils de similarité pour la détection des doublons
  const SIMILARITY_THRESHOLD_HIGH = 95;
  const SIMILARITY_THRESHOLD_MEDIUM = 90;

  // Algorithme de détection de doublons
  const duplicateGroups = useMemo(() => {
    const groups: DuplicateGroup[] = [];

    // 1. Détection de doublons d'orateurs
    const speakerGroups = new Map<string, Speaker[]>();
    speakers.forEach((speaker) => {
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
        const phones = group.map((s) => s.telephone).filter(Boolean);
        if (phones.length > 1 && new Set(phones).size < phones.length) {
          reasons.push('Téléphone identique');
        }

        // Vérifier congrégation identique
        const congregations = group.map((s) => s.congregation);
        if (new Set(congregations).size === 1) {
          reasons.push('Même congrégation');
        }

        const similarity = SIMILARITY_THRESHOLD_HIGH;
        groups.push({
          type: 'speaker',
          items: group,
          similarity,
          reason: reasons,
        });
      }
    });

    // 2. Détection de doublons d'hôtes
    const hostGroups = new Map<string, Host[]>();
    hosts.forEach((host) => {
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

        const phones = group.map((h) => h.telephone).filter(Boolean);
        if (phones.length > 1 && new Set(phones).size < phones.length) {
          reasons.push('Téléphone identique');
        }

        const addresses = group.map((h) => h.address).filter(Boolean);
        if (addresses.length > 1 && new Set(addresses).size < addresses.length) {
          reasons.push('Adresse identique');
        }

        const similarity = SIMILARITY_THRESHOLD_HIGH;
        groups.push({
          type: 'host',
          items: group,
          similarity,
          reason: reasons,
        });
      }
    });

    // 3. Détection de visites en double
    const visitGroups = new Map<string, Visit[]>();
    visits.forEach((visit) => {
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
          reason: ['Même orateur, date et heure'],
        });
      }
    });

    // 4. Détection de doublons dans les archives (si activé)
    if (includeArchives && archivedVisits) {
      // Vérifier les doublons entre archives uniquement
      const archivedVisitGroups = new Map<string, any[]>();
      archivedVisits.forEach((visit) => {
        const key = `${visit.id}-${visit.visitDate}-${visit.visitTime}`;

        if (!archivedVisitGroups.has(key)) {
          archivedVisitGroups.set(key, []);
        }
        archivedVisitGroups.get(key)!.push(visit);
      });

      archivedVisitGroups.forEach((group) => {
        if (group.length > 1) {
          groups.push({
            type: 'archivedVisit',
            items: group,
            similarity: 100,
            reason: ['Doublon dans les archives - Même orateur, date et heure'],
          });
        }
      });

      // Vérifier les doublons entre visites actuelles et archives
      const crossVisitGroups = new Map<string, any[]>();
      visits.forEach((currentVisit) => {
        const key = `${currentVisit.id}-${currentVisit.visitDate}-${currentVisit.visitTime}`;

        if (!crossVisitGroups.has(key)) {
          crossVisitGroups.set(key, []);
        }
        crossVisitGroups.get(key)!.push({ ...currentVisit, _source: 'current' });

        // Ajouter les visites archivées correspondantes
        const matchingArchived = archivedVisits.filter(
          (av) =>
            av.id === currentVisit.id &&
            av.visitDate === currentVisit.visitDate &&
            av.visitTime === currentVisit.visitTime
        );

        matchingArchived.forEach((archived) => {
          crossVisitGroups.get(key)!.push({ ...archived, _source: 'archived' });
        });
      });

      crossVisitGroups.forEach((group) => {
        if (group.length > 1) {
          groups.push({
            type: 'archivedVisit',
            items: group,
            similarity: 100,
            reason: ['Doublon entre visites actuelles et archivées'],
          });
        }
      });
    }

    // 5. Détection de messages en double
    const messageGroups = new Map<string, any[]>();
    if (speakerMessages && speakerMessages.length > 0) {
      speakerMessages.forEach((msg) => {
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
          reason: ['Contenu et date identiques'],
        });
      }
    });

    return groups;
  }, [speakers, hosts, visits, speakerMessages, archivedVisits, includeArchives]);

  const toggleGroup = (index: number) => {
    setSelectedGroups((prev) => {
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
    const selectedGroupsArray = Array.from(selectedGroups);

    selectedGroupsArray.forEach((groupIndex) => {
      const group = duplicateGroups[groupIndex];
      if (!group || group.items.length < 2) return;

      // Trier les éléments par date pour déterminer lequel garder
      const sortedItems = [...group.items].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.receivedAt || 0);
        const dateB = new Date(b.createdAt || b.receivedAt || 0);
        return dateA.getTime() - dateB.getTime(); // Plus ancien d'abord
      });

      let keepItem;
      let duplicateIds: string[] = [];

      if (mergeStrategy === 'keep-recent') {
        // Garder le plus récent, supprimer les autres
        keepItem = sortedItems[sortedItems.length - 1];
        duplicateIds = sortedItems.slice(0, -1).map(item =>
          group.type === 'speaker' ? item.id :
          group.type === 'host' ? item.nom :
          group.type === 'visit' ? item.visitId :
          group.type === 'message' ? item.id :
          group.type === 'archivedVisit' ? item.visitId : item.id
        );
      } else if (mergeStrategy === 'keep-first') {
        // Garder le plus ancien, supprimer les autres
        keepItem = sortedItems[0];
        duplicateIds = sortedItems.slice(1).map(item =>
          group.type === 'speaker' ? item.id :
          group.type === 'host' ? item.nom :
          group.type === 'visit' ? item.visitId :
          group.type === 'message' ? item.id :
          group.type === 'archivedVisit' ? item.visitId : item.id
        );
      }

      if (keepItem && duplicateIds.length > 0) {
        const keepId = group.type === 'speaker' ? keepItem.id :
                      group.type === 'host' ? keepItem.nom :
                      group.type === 'visit' ? keepItem.visitId :
                      group.type === 'message' ? keepItem.id :
                      group.type === 'archivedVisit' ? keepItem.visitId : keepItem.id;

        mergeDuplicates(group.type, keepId, duplicateIds);
      }
    });

    setSelectedGroups(new Set());
  };

  const handleDelete = () => {
    // Supprimer les doublons (keep one?) No, modal says "Delete Duplicates" which usually calls onMerge(..., delete).
    // The previous implementation used _onMerge with 'delete'.
    const selectedDuplicates = Array.from(selectedGroups).map((idx) => duplicateGroups[idx]);
    _onMerge(selectedDuplicates, 'delete', mergeStrategy);
    setSelectedGroups(new Set());
  };

  const getTypeLabel = (type: DuplicateGroup['type']) => {
    switch (type) {
      case 'speaker':
        return 'Orateur';
      case 'host':
        return 'Hôte';
      case 'visit':
        return 'Visite';
      case 'archivedVisit':
        return 'Visite archivée';
      case 'message':
        return 'Message';
      default:
        return 'Inconnu';
    }
  };

  const getTypeColor = (type: DuplicateGroup['type']) => {
    switch (type) {
      case 'speaker':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'host':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'visit':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'archivedVisit':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      case 'message':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={_onClose} title='Détection de doublons' size='xl' className='max-h-[90vh] overflow-hidden'>
      <div className='space-y-6 max-h-[calc(90vh-8rem)] overflow-y-auto'>
        {/* Statistiques */}
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
          <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-blue-600'>
              {duplicateGroups.filter((g) => g.type === 'speaker').length}
            </div>
            <div className='text-sm text-blue-800 dark:text-blue-300'>Orateurs</div>
          </div>
          <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-green-600'>
              {duplicateGroups.filter((g) => g.type === 'host').length}
            </div>
            <div className='text-sm text-green-800 dark:text-green-300'>Hôtes</div>
          </div>
          <div className='p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-purple-600'>
              {duplicateGroups.filter((g) => g.type === 'visit').length}
            </div>
            <div className='text-sm text-purple-800 dark:text-purple-300'>Visites</div>
          </div>
          <div className='p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-orange-600'>
              {duplicateGroups.filter((g) => g.type === 'archivedVisit').length}
            </div>
            <div className='text-sm text-orange-800 dark:text-orange-300'>Archives</div>
          </div>
          <div className='p-4 bg-red-50 dark:bg-red-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-red-600'>
              {duplicateGroups.filter((g) => g.type === 'message').length}
            </div>
            <div className='text-sm text-red-800 dark:text-red-300'>Messages</div>
          </div>
        </div>

        {/* Option pour inclure les archives */}
        <div className='flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <input
            type='checkbox'
            id='include-archives'
            checked={includeArchives}
            onChange={(e) => setIncludeArchives(e.target.checked)}
            className='w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
          />
          <label htmlFor='include-archives' className='cursor-pointer'>
            <div className='font-medium text-gray-900 dark:text-white'>
              Inclure les archives dans l'analyse
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              Détecte les doublons dans les visites archivées et entre visites actuelles/archivées
            </div>
          </label>
        </div>

        {/* Stratégie de fusion */}
        {selectedGroups.size > 0 && (
          <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
              Stratégie de fusion
            </label>
            <div className='space-y-2'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='radio'
                  value='keep-recent'
                  checked={mergeStrategy === 'keep-recent'}
                  onChange={(e) => setMergeStrategy(e.target.value as any)}
                  className='w-4 h-4 text-primary-600'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  Conserver l'entrée la plus récente
                </span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='radio'
                  value='keep-first'
                  checked={mergeStrategy === 'keep-first'}
                  onChange={(e) => setMergeStrategy(e.target.value as any)}
                  className='w-4 h-4 text-primary-600'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  Conserver la première entrée
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Liste des doublons */}
        <div className='space-y-4 max-h-96 overflow-y-auto'>
          {duplicateGroups.length === 0 ? (
            <div className='text-center py-12'>
              <CheckCircle className='w-16 h-16 mx-auto mb-4 text-green-500' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Aucun doublon détecté
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Vos données sont propres et sans doublons
              </p>
            </div>
          ) : (
            <>
              <div className='flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 sticky top-0 z-10'>
                <input
                  type='checkbox'
                  aria-label='Tout sélectionner'
                  checked={
                    duplicateGroups.length > 0 && selectedGroups.size === duplicateGroups.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedGroups(new Set(duplicateGroups.map((_, i) => i)));
                    } else {
                      setSelectedGroups(new Set());
                    }
                  }}
                  className='w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
                />
                <span className='font-medium text-gray-700 dark:text-gray-300'>
                  Tout sélectionner ({duplicateGroups.length})
                </span>
                {selectedGroups.size > 0 && (
                  <span className='text-sm text-gray-500 ml-auto'>
                    {selectedGroups.size} sélectionné(s)
                  </span>
                )}
              </div>
              {duplicateGroups.map((group, index) => (
                <Card
                  key={index}
                  className={`${
                    group.similarity >= SIMILARITY_THRESHOLD_MEDIUM
                      ? 'border-l-4 border-l-red-600'
                      : 'border-l-4 border-l-orange-500'
                  } ${selectedGroups.has(index) ? 'ring-2 ring-primary-500' : ''}`}
                >
                  <CardBody>
                    <div className='space-y-4'>
                      {/* En-tête */}
                      <div className='flex items-start justify-between'>
                        <div className='flex items-center gap-3'>
                          <input
                            type='checkbox'
                            checked={selectedGroups.has(index)}
                            onChange={() => toggleGroup(index)}
                            aria-label={`Sélectionner ce groupe de doublons ${getTypeLabel(group.type)}`}
                            className='w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
                          />
                          <div>
                            <div className='flex items-center gap-2 mb-1'>
                              <Badge className={getTypeColor(group.type)}>
                                {getTypeLabel(group.type)}
                              </Badge>
                              <Badge variant='warning'>{group.similarity}% similaire</Badge>
                            </div>
                            <div className='flex flex-wrap gap-1'>
                              {group.reason.map((reason, idx) => (
                                <span
                                  key={idx}
                                  className='text-xs text-gray-600 dark:text-gray-400'
                                >
                                  • {reason}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Copy className='w-5 h-5 text-gray-400' />
                      </div>

                      {/* Items en double */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        {(() => {
                          // Pré-calculer lequel sera conservé pour ce groupe
                          let itemToKeep = null;
                          if (selectedGroups.has(index)) {
                            if (mergeStrategy === 'keep-first') {
                              itemToKeep = group.items[0]; // Premier élément
                            } else if (mergeStrategy === 'keep-recent') {
                              // Pour archivedVisit, prioriser les visites actuelles sur les archivées
                              if (group.type === 'archivedVisit') {
                                // Chercher d'abord une visite actuelle (sans _source ou _source='current')
                                const currentVisit = group.items.find(item =>
                                  !item._source || item._source === 'current'
                                );
                                if (currentVisit) {
                                  itemToKeep = currentVisit;
                                } else {
                                  // Si pas de visite actuelle, prendre la plus récente des archives
                                  const archivedOnly = group.items.filter(item => item._source === 'archived');
                                  if (archivedOnly.length > 0) {
                                    const sortedByDate = archivedOnly.sort((a, b) => {
                                      const dateA = new Date(a.createdAt || a.updatedAt || 0);
                                      const dateB = new Date(b.createdAt || b.updatedAt || 0);
                                      return dateB.getTime() - dateA.getTime(); // Plus récent d'abord
                                    });
                                    itemToKeep = sortedByDate[0];
                                  } else {
                                    itemToKeep = group.items[0]; // Fallback
                                  }
                                }
                              } else {
                                // Pour les autres types, trier par date
                                const hasDates = group.items.some(i => i.createdAt || i.receivedAt);
                                if (hasDates) {
                                  const sortedByDate = [...group.items].sort((a, b) => {
                                    const dateA = new Date(a.createdAt || a.receivedAt || 0);
                                    const dateB = new Date(b.createdAt || b.receivedAt || 0);
                                    return dateB.getTime() - dateA.getTime(); // Plus récent d'abord
                                  });
                                  itemToKeep = sortedByDate[0];
                                } else {
                                  itemToKeep = group.items[group.items.length - 1]; // Dernier élément si pas de dates
                                }
                              }
                            }
                          }

                          return group.items.map((item: any, itemIdx) => {
                            const willBeKept = item === itemToKeep;

                            return (
                              <div
                                key={itemIdx}
                                className={`p-3 rounded-lg relative ${
                                  willBeKept
                                    ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
                                    : 'bg-gray-50 dark:bg-gray-800'
                                }`}
                              >
                                {willBeKept && (
                                  <div className='absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold'>
                                    ✓ Conservé
                                  </div>
                                )}
                                <div className='font-medium text-gray-900 dark:text-white mb-2'>
                                  {group.type === 'message'
                                    ? item.subject || 'Message sans sujet'
                                    : item.nom || `Visite ${itemIdx + 1}`}
                                </div>
                                <div className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                                  {group.type === 'speaker' && (
                                    <>
                                      <div>Congrégation : {item.congregation}</div>
                                      {item.telephone && <div>Tél : {item.telephone}</div>}
                                      {item.email && <div>Email : {item.email}</div>}
                                      <div>
                                        Visites : {visits.filter((v) => v.id === item.id).length}
                                      </div>
                                      <div>
                                        Messages :{' '}
                                        {
                                          visits.filter(
                                            (v) => v.id === item.id && v.communicationStatus
                                          ).length
                                        }
                                      </div>
                                      {item.createdAt && (
                                        <div className='text-xs'>
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
                                        <div className='text-xs'>
                                          Créé : {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {group.type === 'visit' && (
                                    <>
                                      <div>
                                        Date : {new Date(item.visitDate).toLocaleDateString('fr-FR')}
                                      </div>
                                      <div>Heure : {item.visitTime}</div>
                                      <div>Statut : {item.status}</div>
                                    </>
                                  )}
                                  {group.type === 'archivedVisit' && (
                                    <>
                                      <div>
                                        Date : {new Date(item.visitDate).toLocaleDateString('fr-FR')}
                                      </div>
                                      <div>Heure : {item.visitTime || 'N/A'}</div>
                                      <div>Statut : {item.status}</div>
                                      {item._source && (
                                        <div className='mt-1'>
                                          <Badge
                                            variant={
                                              item._source === 'archived' ? 'warning' : 'success'
                                            }
                                            className='text-xs'
                                          >
                                            {item._source === 'archived' ? 'Archivée' : 'Actuelle'}
                                          </Badge>
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {group.type === 'message' && (
                                    <>
                                      <div>Orateur : {item.speakerName}</div>
                                      <div>
                                        Date : {new Date(item.receivedAt).toLocaleDateString('fr-FR')}{' '}
                                        {new Date(item.receivedAt).toLocaleTimeString('fr-FR')}
                                      </div>
                                      <div className='line-clamp-2'>Contenu : {item.message}</div>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* Avertissement */}
        {selectedGroups.size > 0 && (
          <div className='flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg'>
            <AlertTriangle className='w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5' />
            <div className='text-sm text-orange-800 dark:text-orange-300'>
              <strong>Attention :</strong> La fusion des doublons est irréversible. Assurez-vous de
              vérifier les données avant de continuer.
            </div>
          </div>
        )}

        {/* Actions */}
        <div className='flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Button variant='secondary' onClick={_onClose}>
            Fermer
          </Button>
          {selectedGroups.size > 0 && (
            <>
              <Button variant='danger' onClick={handleDelete}>
                <Trash2 className='w-4 h-4 mr-2' />
                Supprimer les doublons ({selectedGroups.size})
              </Button>
              <Button variant='primary' onClick={handleMerge}>
                <Merge className='w-4 h-4 mr-2' />
                Fusionner ({selectedGroups.size})
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
