import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/contexts/ConfirmContext';
import { Visit, Expense, MessageType } from '@/types';
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
} from 'lucide-react';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { LogisticsManager } from '@/components/logistics/LogisticsManager';
import { RoadmapView } from '@/components/reports/RoadmapView';
import { MessageGeneratorModal } from '@/components/messages/MessageGeneratorModal';
import { FeedbackFormModal } from '@/components/feedback/FeedbackFormModal';
import { generateUUID } from '@/utils/uuid';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { useVisitNotifications } from '@/hooks/useVisitNotifications';

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
  action,
}) => {
  const { updateVisit, deleteVisit, completeVisit, speakers, hosts } = useData();
  const { addToast } = useToast();
  const { confirm } = useConfirm();
  const { scheduleVisitReminder, cancelVisitReminder } = useVisitNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Visit>>({});
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [generatorParams, setGeneratorParams] = useState<{ isOpen: boolean; type: MessageType }>({
    isOpen: false,
    type: 'confirmation',
  });

  useEffect(() => {
    if (visit) setFormData(visit);
  }, [visit]);

  if (!visit) return null;

  const handleSave = async () => {
    if (!formData) return;
    setIsLoading(true);
    try {
      await cancelVisitReminder(visit.visitId);
      await updateVisit({ ...visit, ...formData });
      await scheduleVisitReminder({ ...visit, ...formData });
      addToast('Visite mise à jour', 'success');
      onClose();
    } catch (_error) {
      addToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      await confirm({
        title: 'Supprimer la visite',
        message: 'Voulez-vous vraiment supprimer cette visite ?',
        confirmText: 'Supprimer',
        confirmVariant: 'danger',
      })
    ) {
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
                  className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-indigo-500'
                >
                  <option value='physical'>Présentiel</option>
                  <option value='zoom'>Zoom</option>
                  <option value='streaming'>Streaming</option>
                </select>
              </div>

              {formData.locationType === 'physical' && !formData.congregation?.includes('Lyon') && (
                <div className='space-y-1'>
                  <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                    Hôte
                  </label>
                  <select
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-indigo-500'
                  >
                    <option value=''>-- Sélectionner --</option>
                    <option value='Hôtel'>Hôtel</option>
                    <option value='Pas besoin'>Pas besoin</option>
                    {hosts.map((h) => (
                      <option key={h.nom} value={h.nom}>
                        {h.nom}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className='space-y-1'>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 min-h-[100px]'
                placeholder='Notes privées...'
              />
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
                Annuler
              </Button>
              <Button variant='danger' onClick={handleDelete} isLoading={isLoading}>
                Oui, Supprimer
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
              { type: 'thanks', label: 'Remerciements', icon: Star },
              { type: 'host_request', label: 'Demande Accueil', icon: Home },
            ].map((msg) => (
              <button
                key={msg.type}
                onClick={() => setGeneratorParams({ isOpen: true, type: msg.type as MessageType })}
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
        size={['logistics', 'message'].includes(action) ? 'xl' : 'md'}
        padding='none'
        hideCloseButton={true}
        className='overflow-hidden'
      >
        <div className='max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 flex flex-col'>
          {renderHeader()}

          <div className='flex-1'>{getModalContent()}</div>

          {(action === 'edit' || action === 'logistics') && (
            <div className='p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 shrink-0'>
              <Button variant='ghost' onClick={onClose} disabled={isLoading}>
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                isLoading={isLoading}
                className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-lg shadow-blue-200 dark:shadow-none'
              >
                Enregistrer
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

      {generatorParams.isOpen && (
        <MessageGeneratorModal
          isOpen={generatorParams.isOpen}
          onClose={() => setGeneratorParams({ ...generatorParams, isOpen: false })}
          speaker={speakers.find((s) => s.id === visit.id)!}
          visit={visit}
          initialType={generatorParams.type}
        />
      )}
    </>
  );
};
