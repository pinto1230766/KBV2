import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { Visit } from '@/types';
// import { VisitFeedback } from '@/types'; // TODO: Réactiver quand feedback sera réintégré
import { Edit2, Trash2, MessageSquare, CheckCircle, XCircle, Star } from 'lucide-react';
// import { FeedbackFormModal } from '@/components/feedback/FeedbackFormModal'; // TODO: Réintégrer si nécessaire
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { Expense } from '@/types';
import { CreditCard, Truck } from 'lucide-react';
import { LogisticsManager } from '@/components/logistics/LogisticsManager';
import { TravelCoordinationModal, MealPlanningModal, AccommodationMatchingModal } from '@/components/modals';
import { RoadmapView } from '@/components/reports/RoadmapView';
import { MessageGeneratorModal } from '@/components/messages/MessageGeneratorModal';
import { MessageType, Accommodation } from '@/types';
import { generateUUID } from '@/utils/uuid';

interface VisitActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit | null;
  action: 'edit' | 'delete' | 'status' | 'message' | 'feedback' | 'expenses' | 'logistics';
}

export const VisitActionModal: React.FC<VisitActionModalProps> = ({
  isOpen,
  onClose,
  visit,
  action
}) => {
  const { updateVisit, deleteVisit, completeVisit, speakers, hosts } = useData();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Visit>>({});

  // Expenses Logic
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isAccommodationModalOpen, setIsAccommodationModalOpen] = useState(false);
  
  // Message Generator Logic
  const [generatorParams, setGeneratorParams] = useState<{ isOpen: boolean; type: MessageType }>({ 
    isOpen: false, 
    type: 'confirmation' 
  });

  useEffect(() => {
    if (visit) {
      setFormData(visit);
    }
  }, [visit]);

  if (!visit) return null;

  const handleSave = async () => {
    if (!formData) return;
    
    setIsLoading(true);
    try {
      await updateVisit({ ...visit, ...formData });
      addToast('Visite mise à jour', 'success');
      onClose();
    } catch (error) {
      addToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette visite ?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await deleteVisit(visit.visitId);
      addToast('Visite supprimée', 'success');
      onClose();
    } catch (error) {
      addToast('Erreur lors de la suppression', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      if (newStatus === 'completed') {
        // Utiliser completeVisit pour marquer comme terminé et archiver
        await completeVisit(visit);
        addToast('Visite terminée et archivée', 'success');
      } else {
        // Pour les autres statuts, utiliser updateVisit normalement
        await updateVisit({ ...visit, status: newStatus as any });
        addToast('Statut mis à jour', 'success');
      }
      onClose();
    } catch (error) {
      addToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Message Generator Logic


  // TODO: Réintégrer handleFeedbackSubmit quand FeedbackFormModal sera utilisé
  // const handleFeedbackSubmit = async (feedbackData: Omit<VisitFeedback, 'id' | 'visitId' | 'submittedBy' | 'submittedAt'>) => {
  //   setIsLoading(true);
  //   try {
  //     const newFeedback: VisitFeedback = {
  //       ...feedbackData,
  //       id: generateUUID(),
  //       visitId: visit.visitId,
  //       submittedBy: 'currentUser',
  //       submittedAt: new Date().toISOString()
  //     };
  //     await updateVisit({ ...visit, visitFeedback: newFeedback });
  //     addToast('Bilan enregistré avec succès', 'success');
  //     onClose();
  //   } catch (error) {
  //     addToast('Erreur lors de l\'enregistrement du bilan', 'error');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSaveExpense = async (expenseData: Omit<Expense, 'id'>) => {
    setIsLoading(true);
    try {
      const currentExpenses = visit.expenses || [];
      let newExpenses: Expense[];

      if (editingExpense) {
        newExpenses = currentExpenses.map(e => 
          e.id === editingExpense.id ? { ...expenseData, id: editingExpense.id } : e
        );
      } else {
        newExpenses = [...currentExpenses, { ...expenseData, id: generateUUID() }];
      }

      const updatedVisit = { ...visit, expenses: newExpenses };
      await updateVisit(updatedVisit);
      setFormData(updatedVisit);
      addToast(editingExpense ? 'Dépense modifiée' : 'Dépense ajoutée', 'success');
      setIsAddingExpense(false);
      setEditingExpense(undefined);
    } catch (error) {
      addToast('Erreur lors de la sauvegarde de la dépense', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!window.confirm('Supprimer cette dépense ?')) return;

    setIsLoading(true);
    try {
      const newExpenses = (visit.expenses || []).filter(e => e.id !== expenseId);
      const updatedVisit = { ...visit, expenses: newExpenses };
      await updateVisit(updatedVisit);
      setFormData(updatedVisit);
      addToast('Dépense supprimée', 'success');
    } catch (error) {
      addToast('Erreur lors de la suppression', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getModalContent = () => {
    switch (action) {
      case 'edit':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Modifier la visite
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={formData.visitDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
              />
              <Input
                label="Heure"
                type="time"
                value={formData.visitTime || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, visitTime: e.target.value }))}
              />
              <Input
                label="N° Discours"
                value={formData.talkNoOrType || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, talkNoOrType: e.target.value }))}
                placeholder="Ex: 185"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact d'accueil
                </label>
                <select
                  value={formData.host || ''}
                  onChange={(e) => {
                    const {value} = e.target;
                    const selectedHost = hosts.find(h => h.nom === value);
                    
                    setFormData(prev => {
                      const currentLogistics = prev.logistics || {};
                      const currentAccommodation = currentLogistics.accommodation || {};
                      
                      const newAccommodation = { ...currentAccommodation } as Partial<Accommodation>;
                      let newAddress = prev.accommodation;

                      if (value === 'Hôtel') {
                        newAccommodation.type = 'hotel';
                        // Keep existing booking ref etc, but maybe clear name if it was a host's name
                        if (newAccommodation.type !== 'hotel') { 
                           // If switching TO hotel, maybe clear name/address?
                           // Actually, let's just set type. User can fill details in Logistics.
                        }
                        newAddress = ''; // Clear main address field as it's likely a host address
                      } else if (selectedHost) {
                        newAccommodation.type = 'host';
                        newAccommodation.name = selectedHost.nom;
                        newAccommodation.address = selectedHost.address;
                        newAddress = selectedHost.address || '';
                      }

                      return { 
                        ...prev, 
                        host: value,
                        accommodation: newAddress,
                        logistics: {
                          ...currentLogistics,
                          accommodation: newAccommodation as Accommodation
                        }
                      };
                    });
                  }}
                  title="Sélectionner un hôte"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un hôte...</option>
                  <option value="Hôtel">Hôtel</option>
                  {hosts.map(host => (
                    <option key={host.nom} value={host.nom}>{host.nom}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input
              label="Titre du discours"
              value={formData.talkTheme || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, talkTheme: e.target.value }))}
              placeholder="Ex: Nega iluzon di mundu..."
            />

            {/* Section Statut */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Statut de la visite
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={visit.status === 'pending' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleStatusChange('pending')}
                  disabled={isLoading}
                  leftIcon={<XCircle className="w-3 h-3" />}
                >
                  En attente
                </Button>
                <Button
                  variant={visit.status === 'confirmed' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={isLoading}
                  leftIcon={<CheckCircle className="w-3 h-3" />}
                >
                  Confirmé
                </Button>
                <Button
                  variant={visit.status === 'completed' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleStatusChange('completed')}
                  disabled={isLoading}
                  leftIcon={<CheckCircle className="w-3 h-3" />}
                >
                  Terminé
                </Button>
                <Button
                  variant={visit.status === 'cancelled' ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={isLoading}
                  leftIcon={<XCircle className="w-3 h-3" />}
                >
                  Annulé
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Statut actuel: <span className="font-medium capitalize">{visit.status}</span>
              </p>
            </div>

            <Input
              label="Notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-gray-600 dark:text-gray-400">
              💡 Pour gérer le logement et les repas, utilisez l'onglet "Logistique" du menu
            </div>
          </div>
        );

      case 'delete':
        return (
          <div className="text-center py-6">
            <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Supprimer la visite
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir supprimer la visite de <strong>{visit.nom}</strong> 
              du {new Date(visit.visitDate).toLocaleDateString('fr-FR')} ?
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              Cette action est irréversible.
            </p>
          </div>
        );

      case 'status':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Changer le statut
            </h3>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                Statut actuel: <span className="font-medium">{visit.status}</span>
              </p>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange('pending')}
                  className="w-full justify-start"
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Marquer en attente
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange('confirmed')}
                  className="w-full justify-start"
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Confirmer
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange('completed')}
                  className="w-full justify-start"
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Marquer comme terminé
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleStatusChange('cancelled')}
                  className="w-full justify-start"
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        );

      case 'message':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Générer un message
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choisissez un type de message pour ouvrir l'assistant de rédaction :
            </p>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="secondary"
                onClick={() => setGeneratorParams({ isOpen: true, type: 'confirmation' })}
                className="w-full justify-start"
              >
                Message de confirmation
              </Button>
              <Button
                variant="secondary"
                onClick={() => setGeneratorParams({ isOpen: true, type: 'preparation' })}
                className="w-full justify-start"
              >
                Message de préparation
              </Button>
              <Button
                variant="secondary"
                onClick={() => setGeneratorParams({ isOpen: true, type: 'reminder-7' })}
                className="w-full justify-start"
              >
                Rappel J-7
              </Button>
              <Button
                variant="secondary"
                onClick={() => setGeneratorParams({ isOpen: true, type: 'reminder-2' })}
                className="w-full justify-start"
              >
                Rappel J-2
              </Button>
              <Button
                variant="secondary"
                onClick={() => setGeneratorParams({ isOpen: true, type: 'thanks' })}
                className="w-full justify-start"
              >
                Message de remerciement
              </Button>
              <Button
                variant="secondary"
                onClick={() => setGeneratorParams({ isOpen: true, type: 'host_request' })}
                className="w-full justify-start"
              >
                Demande d'accueil
              </Button>
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Bilan de la visite
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Utilisez la modale de feedback pour évaluer cette visite.
            </div>
          </div>
        );

      case 'expenses':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Gestion des coûts
            </h3>
            
            {isAddingExpense || editingExpense ? (
              <ExpenseForm
                initialData={editingExpense}
                onSubmit={handleSaveExpense}
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
                onDelete={handleDeleteExpense}
                readOnly={isLoading}
              />
            )}
          </div>
        );



      case 'logistics':
        const activeVisit = { ...visit, ...formData };
        const acc = (activeVisit.logistics?.accommodation || {}) as Partial<Accommodation>;
        const isHostType = (acc.type || 'host') === 'host';

        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Logistique
            </h3>
            
            <LogisticsManager
              logistics={{
                ...activeVisit.logistics,
                accommodation: {
                  ...acc,
                  type: acc.type || 'host',
                  name: isHostType ? (activeVisit.host || acc.name || '') : (acc.name || ''),
                  address: isHostType ? (activeVisit.accommodation || acc.address || '') : (acc.address || ''),
                }
              }}
              onUpdate={(updatedLogistics) => {
                setFormData(prev => ({
                  ...prev,
                  logistics: updatedLogistics,
                  // Sync back to top-level fields only if we are in host mode
                  host: (updatedLogistics.accommodation?.type === 'host') 
                    ? (updatedLogistics.accommodation?.name || prev.host)
                    : prev.host,
                  accommodation: (updatedLogistics.accommodation?.type === 'host')
                    ? (updatedLogistics.accommodation?.address || prev.accommodation)
                    : prev.accommodation
                }));
              }}
              readOnly={isLoading}
              hosts={hosts}
            />
            
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Documents</h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <RoadmapView 
                   visit={activeVisit} 
                   speaker={speakers.find(s => s.id === activeVisit.id)}
                   host={hosts.find(h => h.nom === activeVisit.host)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getFooter = () => {
    switch (action) {
      case 'edit':
      case 'logistics':
        return (
          <>
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button onClick={handleSave} isLoading={isLoading}>
              Enregistrer
            </Button>
          </>
        );
      case 'delete':
        return (
          <>
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
              Supprimer
            </Button>
          </>
        );
      case 'feedback':
      case 'expenses':
        return null;
      case 'message':
        return (
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Fermer
          </Button>
        );
      default:
        return (
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Fermer
          </Button>
        );
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={action === 'logistics' ? 'xl' : 'md'}
        footer={getFooter()}
      >
        {getModalContent()}
      </Modal>

      {generatorParams.isOpen && (
        <MessageGeneratorModal
          isOpen={generatorParams.isOpen}
          onClose={() => setGeneratorParams(prev => ({ ...prev, isOpen: false }))}
          speaker={speakers.find(s => s.id === visit.id) || { id: visit.id, nom: visit.nom, congregation: visit.congregation || '', gender: 'male', talkHistory: [] }}
          visit={visit}
          initialType={generatorParams.type}
        />
      )}

      <TravelCoordinationModal
        isOpen={isTravelModalOpen}
        onClose={() => setIsTravelModalOpen(false)}
        visit={visit}
        onSave={async (travelData) => {
          setIsLoading(true);
          try {
            const mode = travelData.transportMode === 'car' ? 'Voiture' : 
                        travelData.transportMode === 'train' ? 'Train' : 
                        travelData.transportMode === 'plane' ? 'Avion' : 
                        travelData.transportMode === 'carpool' ? 'Covoiturage' : 'Autre';
            const travelInfo = `\n🚗 Voyage: ${mode}${travelData.departureLocation ? ` de ${travelData.departureLocation}` : ''}${travelData.arrivalLocation ? ` vers ${travelData.arrivalLocation}` : ''}${travelData.departureTime ? ` à ${travelData.departureTime}` : ''}${travelData.estimatedCost ? ` (${travelData.estimatedCost}€)` : ''}`;
            await updateVisit({ 
              ...visit, 
              notes: (visit.notes || '') + travelInfo
            });
            setIsTravelModalOpen(false);
            addToast('Voyage enregistré', 'success');
          } catch (error) {
            addToast('Erreur lors de la sauvegarde', 'error');
          } finally {
            setIsLoading(false);
          }
        }}
      />

      <MealPlanningModal
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
        visit={visit}
        hosts={hosts}
        onSave={async (mealData) => {
          setIsLoading(true);
          try {
            const mealTypes = mealData.meals.map(m => {
              const type = m.type === 'breakfast' ? 'Petit-déj' : 
                          m.type === 'lunch' ? 'Déjeuner' : 
                          m.type === 'dinner' ? 'Dîner' : 'Collation';
              return `${type} (${m.time}${m.location ? ` - ${m.location}` : ''})`;
            }).join(', ');
            const restrictions = mealData.dietaryRestrictions.length > 0 ? ` | Restrictions: ${mealData.dietaryRestrictions.join(', ')}` : '';
            const allergies = mealData.allergies.length > 0 ? ` | ⚠️ Allergies: ${mealData.allergies.join(', ')}` : '';
            await updateVisit({ 
              ...visit, 
              meals: mealTypes + restrictions + allergies
            });
            setIsMealModalOpen(false);
            addToast('Repas enregistrés', 'success');
          } catch (error) {
            addToast('Erreur lors de la sauvegarde', 'error');
          } finally {
            setIsLoading(false);
          }
        }}
      />

      <AccommodationMatchingModal
        isOpen={isAccommodationModalOpen}
        onClose={() => setIsAccommodationModalOpen(false)}
        visit={visit}
        onSelectHost={async (selectedHost) => {
          setIsLoading(true);
          try {
            const hostName = typeof selectedHost === 'string' ? selectedHost : selectedHost.nom;
            await updateVisit({ ...visit, host: hostName });
            setIsAccommodationModalOpen(false);
            addToast(`Hôte: ${  hostName}`, 'success');
          } catch (error) {
            addToast('Erreur lors de la sélection', 'error');
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </>
  );
};
