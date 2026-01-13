import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { Visit, Expense, MessageType, Companion, CompanionType } from '@/types';
import {
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  CreditCard,
  Truck,
  Home,
  AlertOctagon,
  Calendar,
  Clock,
  Send,
  FileText,
  X,
  Users,
  Plus,
} from 'lucide-react';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { LogisticsManager } from '@/components/logistics/LogisticsManager';
import { RoadmapView } from '@/components/reports/RoadmapView';
import { FeedbackFormModal } from '@/components/feedback/FeedbackFormModal';
import { generateUUID } from '@/utils/uuid';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { useVisitNotifications } from '@/hooks/useVisitNotifications';

interface VisitActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit | null;
  action:
    | 'edit'
    | 'delete'
    | 'status'
    | 'message'
    | 'feedback'
    | 'expenses'
    | 'logistics'
    | 'cancel'
    | 'replace'
    | 'conflict';
  onOpenMessageModal?: (params: { type: any; isGroup?: boolean; channel?: any; visit: Visit }) => void;
}

export const VisitActionModal: React.FC<VisitActionModalProps> = ({
  isOpen,
  onClose,
  visit,
  action,
  onOpenMessageModal,
}) => {
  const { updateVisit, deleteVisit, completeVisit, speakers, hosts } = useData();
  const { addToast } = useToast();
  const { scheduleVisitReminder, cancelVisitReminder } = useVisitNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Visit>>({});
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>('');

  useEffect(() => {
    if (visit) {
      setFormData(visit);
      // Reset selectedSpeakerId quand on change de visite
      if (action === 'replace') {
        setSelectedSpeakerId('');
      }
    }
  }, [visit, action]);

  if (!visit) return null;

  const handleSave = async () => {
    if (!formData) return;
    setIsLoading(true);
    try {
      if (action === 'replace') {
        // Pour le remplacement d'orateur
        if (!selectedSpeakerId) {
          addToast('Veuillez sélectionner un nouvel orateur', 'error');
          setIsLoading(false);
          return;
        }

        const newSpeaker = speakers.find((s) => s.id === selectedSpeakerId);
        console.log('Found new speaker:', newSpeaker);
        if (!newSpeaker) {
          addToast('Orateur non trouvé', 'error');
          setIsLoading(false);
          return;
        }

        await cancelVisitReminder(visit.visitId);

        // Créer la visite mise à jour avec le nouvel orateur
        const updatedVisit = {
          ...visit,
          id: newSpeaker.id,
          nom: newSpeaker.nom,
          congregation: newSpeaker.congregation,
          telephone: newSpeaker.telephone,
          photoUrl: newSpeaker.photoUrl,
        };

        console.log('Updated visit object:', updatedVisit);
        await updateVisit(updatedVisit);
        console.log('updateVisit called successfully');
        await scheduleVisitReminder(updatedVisit);
        console.log('scheduleVisitReminder called successfully');

        addToast('Orateur remplacé avec succès', 'success');

        // Ouvrir la modale de message pour le nouvel orateur APRÈS un petit délai
        setTimeout(() => {
          console.log('Opening message modal for new speaker');
          onOpenMessageModal?.({ type: 'confirmation', visit: updatedVisit });
        }, 500);

        // Fermer la modale principale immédiatement après la mise à jour
        setIsLoading(false);
        onClose();
        return;
      } else {
        // Pour les autres actions (edit, logistics)
        await cancelVisitReminder(visit.visitId);
        const updatedVisit = { ...visit, ...formData };
        await updateVisit(updatedVisit);
        await scheduleVisitReminder(updatedVisit);

        addToast('Visite mise à jour', 'success');
        onClose();
      }
    } catch (_error) {
      console.error('Erreur lors de la sauvegarde:', _error);
      addToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await cancelVisitReminder(visit.visitId);
      await deleteVisit(visit.visitId);
      addToast('Visite supprimée', 'success');
      onClose();
    } catch (_error) {
      addToast('Erreur lors de la suppression', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      if (newStatus === 'completed') {
        await completeVisit(visit);
        addToast('Visite terminée et archivée', 'success');
      } else {
        await updateVisit({ ...visit, status: newStatus as any });
        addToast('Statut mis à jour', 'success');
      }
      onClose();
    } catch (_error) {
      addToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Render Helpers
  const renderHeader = () => {
    let title = 'Détails de la visite';
    const subtitle = `Programmé pour le ${new Date(visit.visitDate).toLocaleDateString()}`;
    let Icon = Calendar;
    let colorClass = 'from-blue-600 to-indigo-600';

    switch (action) {
      case 'edit':
        title = 'Modifier la visite';
        Icon = Edit2;
        break;
      case 'delete':
        title = 'Supprimer la visite';
        Icon = Trash2;
        colorClass = 'from-red-600 to-red-500';
        break;
      case 'status':
        title = 'Changer le statut';
        Icon = CheckCircle;
        colorClass = 'from-green-600 to-emerald-600';
        break;
      case 'message':
        title = 'Envoyer un message';
        Icon = Send;
        colorClass = 'from-violet-600 to-purple-600';
        break;
      case 'logistics':
        title = 'Logistique';
        Icon = Truck;
        colorClass = 'from-blue-600 to-cyan-600';
        break;
      case 'expenses':
        title = 'Dépenses';
        Icon = CreditCard;
        colorClass = 'from-emerald-600 to-teal-600';
        break;
    }

    return (
      <div
        className={cn(
          'bg-gradient-to-r p-6 text-white relative overflow-hidden shrink-0',
          colorClass
        )}
      >
        <Icon className='absolute right-[-10px] top-[-10px] w-32 h-32 opacity-10 rotate-12' />
        <div className='relative z-10'>
          <h2 className='text-2xl font-black tracking-tighter mb-1'>{title}</h2>
          <p className='opacity-90 text-sm font-medium'>{subtitle}</p>

          <div className='mt-4 flex items-center gap-3'>
            <div className='flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg'>
              <span className='text-xs font-bold uppercase tracking-wider opacity-80'>Orateur</span>
              <span className='font-bold text-sm'>{visit.nom}</span>
            </div>
            <Badge className='bg-white/20 text-white border-none backdrop-blur-md'>
              {visit.congregation}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  const getModalContent = () => {
    switch (action) {
      case 'edit':
        return (
          <div className='space-y-6 p-6'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                  Date
                </label>
                <input
                  type='date'
                  value={formData.visitDate}
                  onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                  className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-indigo-500'
                  aria-label='Date de visite'
                  placeholder='JJ/MM/AAAA'
                />
              </div>
              <div className='space-y-1'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                  Heure
                </label>
                <input
                  type='time'
                  value={formData.visitTime}
                  onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                  className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-indigo-500'
                  aria-label='Heure de visite'
                  placeholder='HH:MM'
                />
              </div>
            </div>

            <div className='space-y-1'>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                Discours
              </label>
              <div className='grid grid-cols-[1fr,2fr] gap-4'>
                <input
                  placeholder='N°'
                  value={formData.talkNoOrType || ''}
                  onChange={(e) => setFormData({ ...formData, talkNoOrType: e.target.value })}
                  className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-indigo-500'
                />
                <input
                  placeholder='Thème...'
                  value={formData.talkTheme || ''}
                  onChange={(e) => setFormData({ ...formData, talkTheme: e.target.value })}
                  className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-indigo-500'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                  Type
                </label>
                <select
                  value={formData.locationType}
                  onChange={(e) =>
                    setFormData({ ...formData, locationType: e.target.value as any })
                  }
                  className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 appearance-none'
                  aria-label='Type de lieu'
                  title='Choisir le type de lieu'
                >
                  <option value='physical'>Présentiel</option>
                  <option value='zoom'>Zoom</option>
                  <option value='streaming'>Streaming</option>
                </select>
              </div>

              {formData.locationType === 'physical' && !formData.congregation?.includes('Lyon') && (
                <div className='space-y-4'>
                  <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                    Hôtes
                  </label>

                  {/* Existing host assignments */}
                  <div className='space-y-3'>
                    {(formData.hostAssignments || []).map((assignment, index) => (
                      <div
                        key={assignment.id}
                        className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl'
                      >
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm font-medium text-gray-900 dark:text-white'>
                              {assignment.hostName}
                            </span>
                            <Badge
                              variant='default'
                              className='text-[10px] px-2 py-0.5 bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                            >
                              {assignment.role === 'accommodation' && '🏠 Hébergement'}
                              {assignment.role === 'pickup' && '🚗 Ramassage'}
                              {assignment.role === 'meals' && '🍽️ Repas'}
                              {assignment.role === 'transport' && '🚌 Transport'}
                              {assignment.role === 'other' && '📋 Autre'}
                            </Badge>
                          </div>
                          {/* Notes modifiables pour chaque rôle */}
                          <div className='mt-2'>
                            <input
                              type='text'
                              value={assignment.notes || ''}
                              onChange={(e) => {
                                const newNotes = e.target.value;
                                const updatedAssignments = [...(formData.hostAssignments || [])];
                                updatedAssignments[index] = {
                                  ...updatedAssignments[index],
                                  notes: newNotes || undefined,
                                };
                                setFormData({ ...formData, hostAssignments: updatedAssignments });
                              }}
                              placeholder='Notes spécifiques pour ce rôle...'
                              className='w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-500'
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const newAssignments = (formData.hostAssignments || []).filter(
                              (_, i) => i !== index
                            );
                            setFormData({ ...formData, hostAssignments: newAssignments });
                          }}
                          className='text-red-500 hover:text-red-700 p-1'
                          aria-label="Supprimer l'assignation"
                          title="Supprimer cette assignation"
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    ))}

                    {/* Legacy host field for backward compatibility */}
                    {formData.host && !formData.hostAssignments?.length && (
                      <div className='p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <span className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                              Hôte (ancien système): {formData.host}
                            </span>
                            <p className='text-xs text-yellow-600 dark:text-yellow-300 mt-1'>
                              Cliquez pour migrer vers le nouveau système d'assignation multiple
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (formData.host) {
                                const legacyAssignment = {
                                  id: generateUUID(),
                                  hostId: formData.host,
                                  hostName: formData.host,
                                  role: 'accommodation' as const,
                                  createdAt: new Date().toISOString(),
                                };
                                setFormData((p) => ({
                                  ...p,
                                  hostAssignments: [...(p.hostAssignments || []), legacyAssignment],
                                }));
                              }
                            }}
                            className='px-3 py-1 text-xs bg-yellow-600 text-white rounded-lg hover:bg-yellow-700'
                          >
                            Migrer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add new assignment form */}
                  <div className='p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl'>
                    <div className='space-y-3'>
                      {/* Sélection de l'hôte - pleine largeur */}
                      <div>
                        <select
                          className='w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-500'
                          aria-label="Sélectionner un hôte"
                          title="Choisir l'hôte pour cette assignation"
                          onChange={(e) => {
                            const hostId = e.target.value;
                            if (hostId) {
                              const host = hosts.find(h => h.nom === hostId);
                              if (host) {
                                const newAssignment = {
                                  id: generateUUID(),
                                  hostId: host.nom,
                                  hostName: host.nom,
                                  role: 'accommodation' as const,
                                  createdAt: new Date().toISOString(),
                                };
                                setFormData((p) => ({
                                  ...p,
                                  hostAssignments: [...(p.hostAssignments || []), newAssignment],
                                  host: p.host || host.nom,
                                }));
                              }
                            }
                            e.target.value = '';
                          }}
                        >
                          <option value=''>Sélectionner un hôte...</option>
                          {hosts.map((h) => {
                            const isAlreadyAssigned = (formData.hostAssignments || []).some(a => a.hostId === h.nom);
                            const assignedRoles = (formData.hostAssignments || [])
                              .filter(a => a.hostId === h.nom)
                              .map(a => {
                                switch (a.role) {
                                  case 'accommodation': return '🏠';
                                  case 'pickup': return '🚗';
                                  case 'meals': return '🍽️';
                                  case 'transport': return '🚌';
                                  case 'other': return '📋';
                                  default: return '❓';
                                }
                              })
                              .join(' ');

                            return (
                              <option key={h.nom} value={h.nom}>
                                {h.nom} {isAlreadyAssigned ? `(${assignedRoles})` : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Rôle et Notes sur la même ligne */}
                      <div className='grid grid-cols-2 gap-3'>
                        <select
                          className='w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-500'
                          aria-label='Sélectionner un rôle'
                          title='Choisir le rôle de l&apos;hôte'
                          onChange={(e) => {
                            const role = e.target.value as any;
                            if (role && formData.hostAssignments && formData.hostAssignments.length > 0) {
                              const lastIndex = formData.hostAssignments.length - 1;
                              const updatedAssignments = [...formData.hostAssignments];
                              updatedAssignments[lastIndex] = {
                                ...updatedAssignments[lastIndex],
                                role,
                              };
                              setFormData((p) => ({
                                ...p,
                                hostAssignments: updatedAssignments,
                              }));
                            }
                            e.target.value = '';
                          }}
                        >
                          <option value=''>Rôle...</option>
                          <option value='accommodation'>Hébergement</option>
                          <option value='pickup'>Ramassage gare</option>
                          <option value='meals'>Repas</option>
                          <option value='transport'>Transport</option>
                          <option value='other'>Autre</option>
                        </select>

                        <input
                          type='text'
                          placeholder='Notes (optionnel)'
                          className='w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-500'
                          onChange={(e) => {
                            const notes = e.target.value;
                            if (formData.hostAssignments && formData.hostAssignments.length > 0) {
                              const lastIndex = formData.hostAssignments.length - 1;
                              const updatedAssignments = [...formData.hostAssignments];
                              updatedAssignments[lastIndex] = {
                                ...updatedAssignments[lastIndex],
                                notes: notes || undefined,
                              };
                              setFormData((p) => ({
                                ...p,
                                hostAssignments: updatedAssignments,
                              }));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notes générales pour la visite */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                Notes générales (optionnel)
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder='Ajouter des notes générales pour cette visite...'
                className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 resize-none'
                rows={3}
              />
            </div>

            {/* Section Accompagnants */}
            <div className='space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Users className='w-4 h-4 text-indigo-500' />
                  <h4 className='text-sm font-bold text-gray-900 dark:text-white'>Accompagnants</h4>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    const newCompanion: Companion = {
                      id: generateUUID(),
                      name: '',
                      type: 'other',
                      hostAssignments: [],
                    };
                    setFormData({
                      ...formData,
                      companions: [...(formData.companions || []), newCompanion],
                    });
                  }}
                  className='text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-xs'
                  leftIcon={<Plus className='w-3 h-3' />}
                >
                  Ajouter
                </Button>
              </div>

              <div className='space-y-4'>
                {(formData.companions || []).length === 0 ? (
                  <p className='text-xs text-gray-500 italic text-center py-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl'>
                    Aucun accompagnant ajouté
                  </p>
                ) : (
                  (formData.companions || []).map((companion, index) => (
                    <div
                      key={companion.id}
                      className='p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 relative group'
                    >
                      <button
                        onClick={() => {
                          const newCompanions = (formData.companions || []).filter(
                            (_, i) => i !== index
                          );
                          setFormData({ ...formData, companions: newCompanions });
                        }}
                        className='absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-200'
                        title="Supprimer l'accompagnant"
                      >
                        <X className='w-3 h-3' />
                      </button>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-1'>
                          <label className='text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1'>
                            Nom de l'accompagnant
                          </label>
                          <input
                            type='text'
                            value={companion.name}
                            onChange={(e) => {
                              const newCompanions = [...(formData.companions || [])];
                              newCompanions[index] = { ...newCompanions[index], name: e.target.value };
                              setFormData({ ...formData, companions: newCompanions });
                            }}
                            placeholder='Nom complet...'
                            className='w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500'
                          />
                        </div>
                        <div className='space-y-1'>
                          <label className='text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1'>
                            Type / Relation
                          </label>
                          <select
                            title="Relation de l'accompagnant"
                            value={companion.type}
                            onChange={(e) => {
                              const newCompanions = [...(formData.companions || [])];
                              newCompanions[index] = {
                                ...newCompanions[index],
                                type: e.target.value as CompanionType,
                              };
                              setFormData({ ...formData, companions: newCompanions });
                            }}
                            className='w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500'
                          >
                            <option value='couple'>Couple</option>
                            <option value='brother'>Frère</option>
                            <option value='sister'>Sœur</option>
                            <option value='other'>Autre personne de la congré.</option>
                          </select>
                        </div>
                      </div>

                      {/* Système d'hôtes pour l'accompagnant (Aligné sur l'orateur) */}
                      <div className='mt-6 space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                        <div className='flex items-center gap-2'>
                          <Home className='w-3.5 h-3.5 text-teal-500' />
                          <h5 className='text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider'>Assignation de l'hôte</h5>
                        </div>

                        {/* Assignations existantes pour cet accompagnant */}
                        <div className='space-y-2'>
                          {(companion.hostAssignments || []).map((assignment, aIndex) => (
                            <div
                              key={assignment.id}
                              className='flex items-center gap-3 p-2 bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600'
                            >
                              <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2'>
                                  <span className='text-xs font-bold text-gray-900 dark:text-white truncate'>
                                    {assignment.hostName}
                                  </span>
                                  <Badge
                                    variant='default'
                                    className='text-[9px] px-1.5 py-0 bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800'
                                  >
                                    {assignment.role === 'accommodation' && '🏠 Hébergement'}
                                    {assignment.role === 'pickup' && '🚗 Ramassage'}
                                    {assignment.role === 'meals' && '🍽️ Repas'}
                                    {assignment.role === 'transport' && '🚌 Transport'}
                                    {assignment.role === 'other' && '📋 Autre'}
                                  </Badge>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  const newAssignments = (companion.hostAssignments || []).filter((_, i) => i !== aIndex);
                                  const newCompanions = [...(formData.companions || [])];
                                  newCompanions[index] = { ...companion, hostAssignments: newAssignments };
                                  setFormData({ ...formData, companions: newCompanions });
                                }}
                                className='text-red-500 hover:text-red-700 p-1'
                                title="Supprimer cette assignation"
                              >
                                <X className='w-3 h-3' />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Formulaire d'ajout d'assignation pour cet accompagnant */}
                        <div className='p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl space-y-3'>
                          <select
                            className='w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-teal-500'
                            title="Choisir un hôte"
                            onChange={(e) => {
                              const hostName = e.target.value;
                              if (hostName) {
                                const newAssignments = [...(companion.hostAssignments || []), {
                                  id: generateUUID(),
                                  hostId: hostName,
                                  hostName: hostName,
                                  role: 'accommodation' as const,
                                  createdAt: new Date().toISOString()
                                }];
                                const newCompanions = [...(formData.companions || [])];
                                newCompanions[index] = { ...companion, hostAssignments: newAssignments };
                                setFormData({ ...formData, companions: newCompanions });
                              }
                              e.target.value = '';
                            }}
                          >
                            <option value=''>Sélectionner un hôte...</option>
                            {hosts.map(h => (
                              <option key={h.nom} value={h.nom}>{h.nom}</option>
                            ))}
                          </select>

                          {(companion.hostAssignments || []).length > 0 && (
                            <div className='flex gap-2'>
                              <select
                                className='flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-teal-500'
                                title="Changer le rôle de la dernière assignation"
                                onChange={(e) => {
                                  const role = e.target.value as any;
                                  if (role) {
                                    const newAssignments = [...(companion.hostAssignments || [])];
                                    newAssignments[newAssignments.length - 1].role = role;
                                    const newCompanions = [...(formData.companions || [])];
                                    newCompanions[index] = { ...companion, hostAssignments: newAssignments };
                                    setFormData({ ...formData, companions: newCompanions });
                                  }
                                  e.target.value = '';
                                }}
                              >
                                <option value=''>Changer rôle...</option>
                                <option value='accommodation'>🏠 Hébergement</option>
                                <option value='pickup'>🚗 Ramassage</option>
                                <option value='meals'>🍽️ Repas</option>
                                <option value='transport'>🚌 Transport</option>
                                <option value='other'>📋 Autre</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='mt-4'>
                        <input
                          type='text'
                          value={companion.notes || ''}
                          onChange={(e) => {
                            const newCompanions = [...(formData.companions || [])];
                            newCompanions[index] = { ...newCompanions[index], notes: e.target.value };
                            setFormData({ ...formData, companions: newCompanions });
                          }}
                          placeholder='Notes sur les horaires ou l&apos;organisation...'
                          className='w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500'
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'status':
        return (
          <div className='p-6 space-y-4'>
            <div className='grid grid-cols-1 gap-3'>
              {[
                {
                  id: 'pending',
                  label: 'En attente',
                  icon: Clock,
                  color: 'text-orange-500',
                  bg: 'bg-orange-50 hover:bg-orange-100',
                  border: 'border-orange-200',
                },
                {
                  id: 'confirmed',
                  label: 'Confirmé',
                  icon: CheckCircle,
                  color: 'text-green-500',
                  bg: 'bg-green-50 hover:bg-green-100',
                  border: 'border-green-200',
                },
                {
                  id: 'completed',
                  label: 'Terminé',
                  icon: CheckCircle,
                  color: 'text-blue-500',
                  bg: 'bg-blue-50 hover:bg-blue-100',
                  border: 'border-blue-200',
                },
                {
                  id: 'cancelled',
                  label: 'Annulé',
                  icon: XCircle,
                  color: 'text-red-500',
                  bg: 'bg-red-50 hover:bg-red-100',
                  border: 'border-red-200',
                },
              ].map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleStatusChange(status.id)}
                  className={cn(
                    'flex items-center p-4 rounded-xl border text-left transition-all',
                    status.bg,
                    status.border,
                    visit.status === status.id ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                  )}
                >
                  <div className={cn('p-2 rounded-full bg-white mr-4', status.color)}>
                    <status.icon className='w-5 h-5' />
                  </div>
                  <div>
                    <div
                      className={cn('font-bold text-sm', status.color.replace('text-', 'text-'))}
                    >
                      {status.label}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {visit.status === status.id ? 'Statut actuel' : 'Cliquez pour changer'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'delete':
        return (
          <div className='p-8 text-center'>
            <div className='w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300'>
              <AlertOctagon className='w-10 h-10' />
            </div>
            <h3 className='text-xl font-black text-gray-900 dark:text-white mb-2'>
              Êtes-vous sûr ?
            </h3>
            <p className='text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto'>
              Cette action supprimera définitivement la visite de <strong>{visit.nom}</strong> du{' '}
              {new Date(visit.visitDate).toLocaleDateString()}.
            </p>
            <div className='flex gap-4 justify-center'>
              <Button variant='ghost' onClick={onClose}>
                Conserver
              </Button>
              <Button variant='danger' onClick={handleDelete} isLoading={isLoading}>
                Confirmer la suppression
              </Button>
            </div>
          </div>
        );

      case 'message':
        return (
          <div className='p-6 grid grid-cols-2 gap-4'>
            {[
              { type: 'confirmation', label: 'Confirmation', icon: CheckCircle },
              { type: 'preparation', label: 'Préparation', icon: FileText },
              { type: 'reminder-7', label: 'Rappel J-7', icon: Clock },
              { type: 'reminder-2', label: 'Rappel J-2', icon: Clock },
              { type: 'speaker_thanks', label: 'Remerciements (orateur)', icon: Star },
              { type: 'host_thanks', label: 'Remerciements (hôte)', icon: Star },
              { type: 'host_request_message', label: 'Demande Accueil', icon: Home, isGroup: true },
              { type: 'visit_recap', label: 'Récapitulatif Visite', icon: FileText, isGroup: true },
            ].map((msg) => (
              <button
                key={msg.type}
                onClick={() => {
                  onOpenMessageModal?.({
                    type: msg.type === 'speaker_thanks' ? 'thanks' : msg.type as MessageType,
                    isGroup: msg.isGroup,
                    channel: msg.isGroup ? 'whatsapp_group' : 'whatsapp',
                    visit: visit
                  });
                  // Keep VisitActionModal open behind MessageGeneratorModal
                }}
                className='flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-transparent hover:border-gray-200'
              >
                <div className='w-10 h-10 rounded-full bg-white dark:bg-gray-700 text-indigo-500 flex items-center justify-center shadow-sm'>
                  <msg.icon className='w-5 h-5' />
                </div>
                <span className='font-bold text-sm text-gray-700 dark:text-gray-300'>
                  {msg.label}
                </span>
              </button>
            ))}
          </div>
        );

      case 'logistics': {
        if (visit.congregation?.includes('Lyon')) {
          return (
            <div className='p-8 text-center'>
              <div className='w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6'>
                <Home className='w-10 h-10' />
              </div>
              <h3 className='text-lg font-bold'>Orateur Local</h3>
              <p className='text-gray-500 mt-2'>Aucune logistique nécessaire.</p>
            </div>
          );
        }
        return (
          <div className='p-6'>
            <LogisticsManager
              logistics={formData.logistics || {}}
              onUpdate={(l) => setFormData({ ...formData, logistics: l })}
              readOnly={isLoading}
              hosts={hosts}
            />
            <div className='mt-6 border-t pt-6 bg-gray-50 dark:bg-gray-800/50 -mx-6 -mb-6 p-6'>
              <h4 className='text-xs font-bold uppercase text-gray-500 mb-4'>Feuille de route</h4>
              <RoadmapView
                visit={{ ...visit, ...formData }}
                speaker={speakers.find((s) => s.id === visit.id)}
                host={hosts.find((h) => h.nom === formData.host)}
              />
            </div>
          </div>
        );
      }

      case 'expenses':
        return (
          <div className='p-6'>
            {isAddingExpense || editingExpense ? (
              <ExpenseForm
                initialData={editingExpense}
                onSubmit={async (data) => {
                  // Simplified Logic for Demo
                  setIsLoading(true);
                  const newExpenses = [
                    ...(formData.expenses || []),
                    { ...data, id: generateUUID() },
                  ];
                  await updateVisit({ ...visit, expenses: newExpenses as any });
                  setFormData({ ...formData, expenses: newExpenses as any });
                  setIsAddingExpense(false);
                  setEditingExpense(undefined);
                  setIsLoading(false);
                }}
                onCancel={() => {
                  setIsAddingExpense(false);
                  setEditingExpense(undefined);
                }}
              />
            ) : (
              <ExpenseList
                expenses={formData.expenses || []}
                onAdd={() => setIsAddingExpense(true)}
                onEdit={setEditingExpense}
                onDelete={() => {}}
                readOnly={isLoading}
              />
            )}
          </div>
        );

      case 'replace':
        return (
          <div className='p-6 space-y-6'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Users className='w-8 h-8' />
              </div>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
                Remplacer l'orateur
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                Sélectionnez un nouvel orateur pour cette visite. Un message de confirmation sera automatiquement envoyé au nouvel orateur.
              </p>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Orateur actuel
                </label>
                <div className='p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <span className='font-medium text-gray-900 dark:text-white'>{visit.nom}</span>
                  <span className='text-sm text-gray-500 ml-2'>({visit.congregation})</span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Nouveau orateur
                </label>
                <select
                  value={selectedSpeakerId}
                  onChange={(e) => {
                    console.log('🔄 SELECT CHANGE: New value:', e.target.value);
                    setSelectedSpeakerId(e.target.value);
                  }}
                  className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl font-medium focus:ring-2 focus:ring-blue-500'
                  aria-label='Sélectionner le nouvel orateur'
                >
                  <option value=''>🔽 CHOISISSEZ un orateur dans la liste...</option>
                  {speakers
                    .filter((s) => {
                      const shouldInclude = s.id !== visit.id;
                      console.log('🔄 FILTERING SPEAKER:', s.nom, 'id:', s.id, 'visit.id:', visit.id, 'include:', shouldInclude);
                      return shouldInclude;
                    })
                    .map((speaker) => (
                      <option key={speaker.id} value={speaker.id}>
                        {speaker.nom} ({speaker.congregation})
                      </option>
                    ))}
                </select>
                {!selectedSpeakerId && (
                  <p className='text-xs text-red-500 mt-1 font-medium'>
                    ⚠️ Sélectionnez d'abord un orateur pour activer le bouton
                  </p>
                )}
              </div>

              {selectedSpeakerId && (
                <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                  <div className='flex items-start gap-3'>
                    <CheckCircle className='w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0' />
                    <div>
                      <h4 className='font-medium text-blue-900 dark:text-blue-100 mb-1'>
                        Orateur sélectionné
                      </h4>
                      {(() => {
                        const speaker = speakers.find((s) => s.id === selectedSpeakerId);
                        return speaker ? (
                          <p className='text-sm text-blue-800 dark:text-blue-200'>
                            <strong>{speaker.nom}</strong> ({speaker.congregation})
                          </p>
                        ) : null;
                      })()}
                      <p className='text-xs text-blue-600 dark:text-blue-300 mt-2'>
                        Après validation, un message de confirmation sera automatiquement envoyé à ce nouvel orateur.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (action === 'feedback') {
    return (
      <FeedbackFormModal isOpen={isOpen} onClose={onClose} visit={visit} onSubmit={() => {}} />
    );
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title=''
        size={['logistics', 'message', 'edit'].includes(action) ? 'xl' : 'md'}
        padding='none'
        hideCloseButton={true}
        className={`overflow-hidden ${action === 'edit' ? 'max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw]' : ''}`}
      >
        <div className='max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 flex flex-col'>
          {renderHeader()}

          <div className='flex-1'>{getModalContent()}</div>

          {(action === 'edit' || action === 'logistics' || action === 'replace') && (
            <div className='p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 shrink-0'>
              <Button variant='ghost' onClick={onClose} disabled={isLoading}>
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                isLoading={isLoading}
                disabled={
                  isLoading ||
                  (action === 'replace' ? !selectedSpeakerId : false)
                }
                className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-lg shadow-blue-200 dark:shadow-none'
              >
                {action === 'replace' ? 'Remplacer et envoyer message' : 'Enregistrer'}
              </Button>
            </div>
          )}

          {action === 'message' && (
            <div className='p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-end shrink-0'>
              <Button variant='ghost' onClick={onClose}>
                Fermer
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
