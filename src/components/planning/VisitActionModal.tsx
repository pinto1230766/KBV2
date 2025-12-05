import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

import { Input } from '@/components/ui/Input';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { Visit } from '@/types';
import { Edit2, Trash2, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface VisitActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit | null;
  action: 'edit' | 'delete' | 'status' | 'message';
}

export const VisitActionModal: React.FC<VisitActionModalProps> = ({
  isOpen,
  onClose,
  visit,
  action
}) => {
  const { updateVisit, deleteVisit, logCommunication } = useData();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Visit>>(visit || {});

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
                label="Contact d'accueil"
                value={formData.host || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
              />
              <Input
                label="Logement"
                value={formData.accommodation || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, accommodation: e.target.value }))}
              />
            </div>
            <Input
              label="Repas"
              value={formData.meals || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, meals: e.target.value }))}
            />
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
      default:
        return (
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Fermer
          </Button>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      footer={getFooter()}
    >
      {getModalContent()}
    </Modal>
  );
};
