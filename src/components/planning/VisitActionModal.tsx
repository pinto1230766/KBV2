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
          <div className='p-4 grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {/* Colonne gauche : Infos visite */}
            <div className='space-y-3'>
              {/* Date, Heure, Type sur une ligne */}
              <div className='grid grid-cols-3 gap-2'>
                <div>
                  <label className='text-[10px] font-bold text-gray-500 uppercase pl-1'>Date</label>
                  <input
                    type='date'
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    className='w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500'
                    aria-label='Date de visite'
                  />
                </div>
                <div>
                  <label className='text-[10px] font-bold text-gray-500 uppercase pl-1'>Heure</label>
                  <input
                    type='time'
                    value={formData.visitTime}
                    onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                    className='w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500'
                    aria-label='Heure de visite'
                  />
                </div>
                <div>
                  <label className='text-[10px] font-bold text-gray-500 uppercase pl-1'>Type</label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => setFormData({ ...formData, locationType: e.target.value as any })}
                    className='w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500'
                    aria-label='Type de lieu'
                  >
                    <option value='physical'>Présentiel</option>
                    <option value='zoom'>Zoom</option>
                    <option value='streaming'>Streaming</option>
                  </select>
                </div>
              </div>

              {/* Discours */}
              <div className='grid grid-cols-[80px,1fr] gap-2'>
                <div>
                  <label className='text-[10px] font-bold text-gray-500 uppercase pl-1'>N°</label>
                  <input
                    placeholder='N°'
                    value={formData.talkNoOrType || ''}
                    onChange={(e) => setFormData({ ...formData, talkNoOrType: e.target.value })}
                    className='w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500'
                  />
                </div>
                <div>
                  <label className='text-[10px] font-bold text-gray-500 uppercase pl-1'>Thème</label>
                  <input
                    placeholder='Thème du discours...'
                    value={formData.talkTheme || ''}
                    onChange={(e) => setFormData({ ...formData, talkTheme: e.target.value })}
                    className='w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500'
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className='text-[10px] font-bold text-gray-500 uppercase pl-1'>Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder='Notes générales...'
                  className='w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 resize-none'
                  rows={2}
                />
              </div>

              {/* Accompagnants - Compact */}
              <div className='p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-1'>
                    <Users className='w-3 h-3 text-indigo-500' />
                    <span className='text-xs font-bold text-gray-700 dark:text-gray-300'>Accompagnants</span>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      const newCompanion: Companion = { id: generateUUID(), name: '', type: 'couple', hostAssignments: [] };
                      setFormData({ ...formData, companions: [...(formData.companions || []), newCompanion] });
                    }}
                    className='text-indigo-600 text-[10px] px-2 py-1 h-auto'
                    leftIcon={<Plus className='w-3 h-3' />}
                  >
                    Ajouter
                  </Button>
                </div>
                {(formData.companions || []).length === 0 ? (
                  <p className='text-[10px] text-gray-400 italic'>Aucun accompagnant</p>
                ) : (
                  <div className='space-y-2'>
                    {(formData.companions || []).map((companion, index) => (
                      <div key={companion.id} className='flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg'>
                        <input
                          type='text'
                          value={companion.name}
                          onChange={(e) => {
                            const newCompanions = [...(formData.companions || [])];
                            newCompanions[index] = { ...newCompanions[index], name: e.target.value };
                            setFormData({ ...formData, companions: newCompanions });
                          }}
                          placeholder='Nom...'
                          className='flex-1 px-2 py-1 bg-transparent border-none text-xs focus:ring-0'
                        />
                        <select
                          value={companion.type}
                          onChange={(e) => {
                            const newCompanions = [...(formData.companions || [])];
                            newCompanions[index] = { ...newCompanions[index], type: e.target.value as CompanionType };
                            setFormData({ ...formData, companions: newCompanions });
                          }}
                          className='px-2 py-1 bg-gray-100 dark:bg-gray-600 border-none rounded text-[10px]'
                          title="Type d'accompagnant"
                          aria-label="Type d'accompagnant"
                        >
                          <option value='couple'>Couple</option>
                          <option value='brother'>Frère</option>
                          <option value='sister'>Sœur</option>
                          <option value='other'>Autre</option>
                        </select>
                        <button
                          onClick={() => {
                            const newCompanions = (formData.companions || []).filter((_, i) => i !== index);
                            setFormData({ ...formData, companions: newCompanions });
                          }}
                          className='text-red-500 hover:text-red-700 p-1'
                          title="Supprimer l'accompagnant"
                          aria-label="Supprimer l'accompagnant"
                        >
                          <X className='w-3 h-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Colonne droite : Hôtes */}
            {formData.locationType === 'physical' && !formData.congregation?.includes('Lyon') && (
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Home className='w-4 h-4 text-teal-500' />
                  <span className='text-xs font-bold text-gray-700 dark:text-gray-300 uppercase'>Hôtes assignés</span>
                </div>

                {/* Liste des hôtes assignés - compact */}
                <div className='space-y-2 max-h-[200px] overflow-y-auto'>
                  {(formData.hostAssignments || []).map((assignment, index) => (
                    <div key={assignment.id} className='flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                      <span className='text-xs font-medium flex-1 truncate'>{assignment.hostName}</span>
                      <Badge variant='default' className='text-[9px] px-1.5 py-0 bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'>
                        {assignment.role === 'accommodation' && '🏠'}
                        {assignment.role === 'pickup' && '🚗'}
                        {assignment.role === 'meals' && '🍽️'}
                        {assignment.role === 'transport' && '🚌'}
                        {assignment.role === 'other' && '📋'}
                      </Badge>
                      <button
                        onClick={() => {
                          const newAssignments = (formData.hostAssignments || []).filter((_, i) => i !== index);
                          setFormData({ ...formData, hostAssignments: newAssignments });
                        }}
                        className='text-red-500 hover:text-red-700 p-0.5'
                        title="Supprimer l'hôte"
                        aria-label="Supprimer l'hôte"
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </div>
                  ))}
                  {formData.host && !formData.hostAssignments?.length && (
                    <div className='p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs'>
                      <span className='text-yellow-700'>Ancien: {formData.host}</span>
                      <button
                        onClick={() => {
                          if (formData.host) {
                            setFormData((p) => ({
                              ...p,
                              hostAssignments: [{ id: generateUUID(), hostId: formData.host!, hostName: formData.host!, role: 'accommodation' as const, createdAt: new Date().toISOString() }],
                            }));
                          }
                        }}
                        className='ml-2 text-yellow-600 underline'
                      >
                        Migrer
                      </button>
                    </div>
                  )}
                </div>

                {/* Ajouter un hôte - compact */}
                <div className='p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl space-y-2'>
                  <select
                    className='w-full px-2 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-teal-500'
                    aria-label="Sélectionner un hôte"
                    onChange={(e) => {
                      const hostId = e.target.value;
                      if (hostId) {
                        const host = hosts.find(h => h.nom === hostId);
                        if (host) {
                          setFormData((p) => ({
                            ...p,
                            hostAssignments: [...(p.hostAssignments || []), { id: generateUUID(), hostId: host.nom, hostName: host.nom, role: 'accommodation' as const, createdAt: new Date().toISOString() }],
                            host: p.host || host.nom,
                          }));
                        }
                      }
                      e.target.value = '';
                    }}
                  >
                    <option value=''>+ Ajouter un hôte...</option>
                    {hosts.map((h) => (
                      <option key={h.nom} value={h.nom}>{h.nom}</option>
                    ))}
                  </select>
                  <div className='grid grid-cols-2 gap-2'>
                    <select
                      className='px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-[10px]'
                      aria-label='Rôle'
                      onChange={(e) => {
                        const role = e.target.value as any;
                        if (role && formData.hostAssignments && formData.hostAssignments.length > 0) {
                          const updatedAssignments = [...formData.hostAssignments];
                          updatedAssignments[updatedAssignments.length - 1] = { ...updatedAssignments[updatedAssignments.length - 1], role };
                          setFormData((p) => ({ ...p, hostAssignments: updatedAssignments }));
                        }
                        e.target.value = '';
                      }}
                    >
                      <option value=''>Rôle...</option>
                      <option value='accommodation'>🏠 Hébergement</option>
                      <option value='pickup'>🚗 Ramassage</option>
                      <option value='meals'>🍽️ Repas</option>
                      <option value='transport'>🚌 Transport</option>
                      <option value='other'>📋 Autre</option>
                    </select>
                    <input
                      type='text'
                      placeholder='Notes...'
                      className='px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-[10px]'
                      onChange={(e) => {
                        const notes = e.target.value;
                        if (formData.hostAssignments && formData.hostAssignments.length > 0) {
                          const updatedAssignments = [...formData.hostAssignments];
                          updatedAssignments[updatedAssignments.length - 1] = { ...updatedAssignments[updatedAssignments.length - 1], notes: notes || undefined };
                          setFormData((p) => ({ ...p, hostAssignments: updatedAssignments }));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Hôtes pour accompagnants */}
                {(formData.companions || []).length > 0 && (
                  <div className='p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl'>
                    <span className='text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase'>Hôtes accompagnants</span>
                    <div className='mt-2 space-y-2'>
                      {(formData.companions || []).map((companion, cIndex) => (
                        <div key={companion.id} className='flex items-center gap-2'>
                          <span className='text-xs text-gray-600 dark:text-gray-400 w-20 truncate'>{companion.name || 'Sans nom'}</span>
                          <select
                            className='flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-[10px]'
                            title="Assigner un hôte à l'accompagnant"
                            aria-label="Assigner un hôte à l'accompagnant"
                            onChange={(e) => {
                              const hostName = e.target.value;
                              if (hostName) {
                                const newAssignments = [...(companion.hostAssignments || []), { id: generateUUID(), hostId: hostName, hostName, role: 'accommodation' as const, createdAt: new Date().toISOString() }];
                                const newCompanions = [...(formData.companions || [])];
                                newCompanions[cIndex] = { ...companion, hostAssignments: newAssignments };
                                setFormData({ ...formData, companions: newCompanions });
                              }
                              e.target.value = '';
                            }}
                          >
                            <option value=''>Assigner hôte...</option>
                            {hosts.map(h => <option key={h.nom} value={h.nom}>{h.nom}</option>)}
                          </select>
                          {(companion.hostAssignments || []).length > 0 && (
                            <Badge variant='success' className='text-[9px]'>
                              {companion.hostAssignments![0].hostName}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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

      case 'message': {
        const messageCategories = [
          {
            title: '📱 Messages Orateur',
            description: 'Communication directe avec l\'orateur',
            messages: [
              { 
                type: 'confirmation', 
                label: 'Confirmation', 
                icon: CheckCircle, 
                description: 'Confirmer la visite et envoyer les détails',
                sent: visit.communicationStatus?.confirmation?.speaker,
                color: 'text-green-600'
              },
              { 
                type: 'preparation', 
                label: 'Préparation', 
                icon: FileText, 
                description: 'Informations logistiques et programme',
                sent: visit.communicationStatus?.preparation?.speaker,
                color: 'text-blue-600'
              },
              { 
                type: 'reminder-7', 
                label: 'Rappel J-7', 
                icon: Clock, 
                description: 'Rappel une semaine avant',
                sent: visit.communicationStatus?.reminder?.speaker,
                color: 'text-orange-600'
              },
              { 
                type: 'reminder-2', 
                label: 'Rappel J-2', 
                icon: Clock, 
                description: 'Dernier rappel avant la visite',
                sent: visit.communicationStatus?.reminder?.speaker,
                color: 'text-red-600'
              },
              { 
                type: 'speaker_thanks', 
                label: 'Remerciements', 
                icon: Star, 
                description: 'Remercier après la visite',
                sent: visit.communicationStatus?.thanks?.speaker,
                color: 'text-yellow-600'
              },
            ]
          },
          {
            title: '🏠 Messages Hôtes',
            description: 'Communication avec les hôtes et groupe',
            messages: [
              { 
                type: 'host_request_message', 
                label: 'Demande Accueil', 
                icon: Home, 
                description: 'Rechercher des volontaires pour l\'accueil',
                isGroup: true,
                sent: visit.communicationStatus?.host_request?.group,
                color: 'text-purple-600'
              },
              { 
                type: 'visit_recap', 
                label: 'Récapitulatif', 
                icon: FileText, 
                description: 'Envoyer le planning complet au groupe',
                isGroup: true,
                sent: visit.communicationStatus?.visit_recap?.group,
                color: 'text-indigo-600'
              },
              { 
                type: 'host_thanks', 
                label: 'Remerciements Hôtes', 
                icon: Star, 
                description: 'Remercier les hôtes après la visite',
                sent: visit.communicationStatus?.thanks?.host,
                color: 'text-pink-600'
              },
            ]
          }
        ];

        return (
          <div className='p-6 space-y-6 max-h-[600px] overflow-y-auto'>
            {messageCategories.map((category, idx) => (
              <div key={idx} className='space-y-3'>
                <div className='flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700'>
                  <h3 className='text-sm font-bold text-gray-900 dark:text-white'>
                    {category.title}
                  </h3>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    {category.description}
                  </span>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  {category.messages.map((msg) => (
                    <button
                      key={msg.type}
                      onClick={() => {
                        onOpenMessageModal?.({
                          type: msg.type === 'speaker_thanks' ? 'thanks' : msg.type as MessageType,
                          isGroup: msg.isGroup,
                          channel: msg.isGroup ? 'whatsapp_group' : 'whatsapp',
                          visit: visit
                        });
                      }}
                      className={cn(
                        'relative flex flex-col items-start gap-2 p-4 rounded-xl transition-all border-2',
                        'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700',
                        msg.sent 
                          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                      )}
                    >
                      {msg.sent && (
                        <div className='absolute top-2 right-2'>
                          <CheckCircle className='w-4 h-4 text-green-600 dark:text-green-400' />
                        </div>
                      )}
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', msg.color, 'bg-current bg-opacity-10')}>
                        <msg.icon className={cn('w-4 h-4', msg.color)} />
                      </div>
                      <div className='text-left'>
                        <div className='font-bold text-sm text-gray-900 dark:text-white'>
                          {msg.label}
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                          {msg.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                <CheckCircle className='w-4 h-4 text-green-600' />
                <span>Les messages avec une coche verte ont déjà été envoyés</span>
              </div>
            </div>
          </div>
        );
      }

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
