import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { Visit, VisitFeedback } from '@/types';
import { Edit2, Trash2, MessageSquare, CheckCircle, XCircle, Star } from 'lucide-react';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { Expense } from '@/types';
import { CreditCard, Truck, Car, Utensils, Home as HomeIcon } from 'lucide-react';
import { LogisticsManager } from '@/components/logistics/LogisticsManager';
import { TravelCoordinationModal, MealPlanningModal, AccommodationMatchingModal } from '@/components/modals';
import { RoadmapView } from '@/components/reports/RoadmapView';
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
  const { updateVisit, deleteVisit, logCommunication, speakers, hosts } = useData();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Visit>>({});

  // Expenses Logic
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isAccommodationModalOpen, setIsAccommodationModalOpen] = useState(false);

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
      await updateVisit({ ...visit, status: newStatus as any });
      addToast('Statut mis à jour', 'success');
      onClose();
    } catch (error) {
      addToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (type: string) => {
    setIsLoading(true);
    try {
      await logCommunication(visit.visitId, type as any, 'speaker');
      addToast('Message envoyé', 'success');
      onClose();
    } catch (error) {
      addToast('Erreur lors de l\'envoi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedbackData: Omit<VisitFeedback, 'id' | 'visitId' | 'submittedBy' | 'submittedAt'>) => {
    setIsLoading(true);
    try {
      const newFeedback: VisitFeedback = {
        ...feedbackData,
        id: generateUUID(),
        visitId: visit.visitId,
        submittedBy: 'currentUser', // À remplacer par l'ID réel de l'utilisateur
        submittedAt: new Date().toISOString()
      };
      
      await updateVisit({ 
        ...visit, 
        visitFeedback: newFeedback 
      });
      
      addToast('Bilan enregistré avec succès', 'success');
      onClose();
    } catch (error) {
      addToast('Erreur lors de l\'enregistrement du bilan', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveExpense = async (expenseData: Omit<Expense, 'id'>) => {
    setIsLoading(true);
    try {
      const currentExpenses = visit.expenses || [];
      let newExpenses: Expense[];

      if (editingExpense) {
        // Update existing
        newExpenses = currentExpenses.map(e => 
          e.id === editingExpense.id ? { ...expenseData, id: editingExpense.id } : e
        );
      } else {
        // Add new
        newExpenses = [...currentExpenses, { ...expenseData, id: generateUUID() }];
      }

      await updateVisit({ ...visit, expenses: newExpenses });
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
      await updateVisit({ ...visit, expenses: newExpenses });
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
              <Input
                label="Contact d'accueil"
                value={formData.host || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
              />
            </div>
            <Input
              label="Titre du discours"
              value={formData.talkTheme || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, talkTheme: e.target.value }))}
              placeholder="Ex: Nega iluzon di mundu..."
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Logement"
                value={formData.accommodation || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, accommodation: e.target.value }))}
              />
              <Input
                label="Repas"
                value={formData.meals || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, meals: e.target.value }))}
              />
            </div>
            <Input
              label="Notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
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
              Envoyer un message
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Envoyer un message à <strong>{visit.nom}</strong> pour cette visite.
            </p>
            <div className="space-y-2">
              <Button
                variant="secondary"
                onClick={() => handleSendMessage('confirmation')}
                className="w-full justify-start"
              >
                Message de confirmation
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSendMessage('preparation')}
                className="w-full justify-start"
              >
                Message de préparation
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSendMessage('reminder-7')}
                className="w-full justify-start"
              >
                Rappel J-7
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSendMessage('reminder-2')}
                className="w-full justify-start"
              >
                Rappel J-2
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSendMessage('thanks')}
                className="w-full justify-start"
              >
                Message de remerciement
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
            <FeedbackForm 
              visitId={visit.visitId}
              initialFeedback={visit.visitFeedback}
              onSubmit={handleFeedbackSubmit}
              onCancel={onClose}
            />
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
                expenses={visit.expenses || []}
                onAdd={() => setIsAddingExpense(true)}
                onEdit={setEditingExpense}
                onDelete={handleDeleteExpense}
                readOnly={isLoading}
              />
            )}
          </div>
        );

      case 'logistics':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Logistique
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsTravelModalOpen(true)}
                className="w-full justify-start"
                leftIcon={<Car className="w-4 h-4" />}
              >
                Voyage
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsMealModalOpen(true)}
                className="w-full justify-start"
                leftIcon={<Utensils className="w-4 h-4" />}
              >
                Repas
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsAccommodationModalOpen(true)}
                className="w-full justify-start"
                leftIcon={<HomeIcon className="w-4 h-4" />}
              >
                Hébergement
              </Button>
            </div>

            <LogisticsManager
              logistics={visit.logistics}
              onUpdate={(updatedLogistics) => updateVisit({ ...visit, logistics: updatedLogistics })}
              readOnly={isLoading}
            />
            
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Documents</h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <RoadmapView 
                   visit={visit} 
                   speaker={speakers.find(s => s.id === visit.id)}
                   host={hosts.find(h => h.nom === visit.host)}
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
        return null; // Le formulaire a ses propres boutons
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
        size="md"
        footer={getFooter()}
      >
        {getModalContent()}
      </Modal>

      <TravelCoordinationModal
        isOpen={isTravelModalOpen}
        onClose={() => setIsTravelModalOpen(false)}
        visit={visit}
        onSave={(travelData) => {
          console.log('Travel data saved:', travelData);
          setIsTravelModalOpen(false);
          addToast('Informations de voyage enregistrées', 'success');
        }}
      />

      <MealPlanningModal
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
        visit={visit}
        onSave={(mealData) => {
          console.log('Meal data saved:', mealData);
          setIsMealModalOpen(false);
          addToast('Informations de repas enregistrées', 'success');
        }}
      />

      <AccommodationMatchingModal
        isOpen={isAccommodationModalOpen}
        onClose={() => setIsAccommodationModalOpen(false)}
        visit={visit}
        onSelectHost={() => {
          setIsAccommodationModalOpen(false);
          addToast('Hôte sélectionné', 'success');
        }}
      />
    </>
  );
};
