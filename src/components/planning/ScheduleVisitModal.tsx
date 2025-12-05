import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { Visit } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { AlertTriangle } from 'lucide-react';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  isOpen,
  onClose,
  initialDate
}) => {
  const { speakers, hosts, addVisit, publicTalks, visits } = useData();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState<string>('');
  const [dateConflict, setDateConflict] = useState<{has: boolean; speakerName?: string}>({ has: false });

  // Form state
  const [formData, setFormData] = useState<Partial<Visit>>({
    visitDate: initialDate ? initialDate.toISOString().split('T')[0] : '',
    visitTime: '13:30',
    locationType: 'physical',
    status: 'pending',
    talkNoOrType: '',
    talkTheme: '',
    nom: '', // Speaker name
    id: '', // Speaker ID
    host: '',
    congregation: '',
  });

  // Validate date when it changes
  useEffect(() => {
    if (formData.visitDate) {
      validateDate(formData.visitDate);
      checkDateConflict(formData.visitDate);
    }
  }, [formData.visitDate]);

  const validateDate = (dateStr: string) => {
    const visitDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (visitDate < today) {
      setDateError('La date doit être dans le futur');
      return false;
    }
    setDateError('');
    return true;
  };

  const checkDateConflict = (date: string) => {
    const conflict = visits.find(v => v.visitDate === date);
    
    if (conflict) {
      setDateConflict({
        has: true,
        speakerName: conflict.nom
      });
    } else {
      setDateConflict({ has: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submit
    if (!validateDate(formData.visitDate || '')) {
      addToast('Veuillez sélectionner une date valide dans le futur', 'error');
      return;
    }
    
    setIsLoading(true);

    try {
      if (!formData.id || !formData.visitDate) {
        throw new Error('Veuillez remplir les champs obligatoires');
      }

      const newVisit: Visit = {
        ...formData as Visit,
        visitId: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addVisit(newVisit);
      addToast('Visite programmée avec succès', 'success');
      onClose();
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Erreur lors de la création', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakerChange = (speakerId: string) => {
    const speaker = speakers.find(s => s.id === speakerId);
    if (speaker) {
      setFormData(prev => ({
        ...prev,
        id: speaker.id,
        nom: speaker.nom,
        congregation: speaker.congregation
      }));
    }
  };

  const handleTalkChange = (talkNumber: string) => {
    const talk = publicTalks.find(t => t.number.toString() === talkNumber);
    if (talk) {
      setFormData(prev => ({
        ...prev,
        talkNoOrType: talk.number.toString(),
        talkTheme: talk.theme
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Programmer une visite"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Enregistrer
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orateur */}
          <div className="col-span-2">
            <Select
              label="Orateur"
              options={[
                { value: '', label: 'Sélectionner un orateur' },
                ...speakers.map(s => ({ value: s.id, label: `${s.nom} (${s.congregation})` }))
              ]}
              value={formData.id}
              onChange={(e) => handleSpeakerChange(e.target.value)}
              required
            />
          </div>

          {/* Date et Heure */}
          <Input
            type="date"
            label="Date"
            value={formData.visitDate}
            onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
            required
            error={dateError}
          />
          
          {/* Date conflict warning */}
          {dateConflict.has && !dateError && (
            <div className="col-span-2 -mt-4">
              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium">Une visite est déjà programmée ce jour</p>
                  <p className="text-xs mt-1">Orateur prévu : {dateConflict.speakerName}</p>
                </div>
              </div>
            </div>
          )}
          
          <Input
            type="time"
            label="Heure"
            value={formData.visitTime}
            onChange={(e) => setFormData(prev => ({ ...prev, visitTime: e.target.value }))}
            required
          />

          {/* Discours */}
          <div className="col-span-2">
            <Select
              label="Discours"
              options={[
                { value: '', label: 'Sélectionner un discours' },
                ...publicTalks.map(t => ({ value: t.number.toString(), label: `N°${t.number} - ${t.theme}` }))
              ]}
              value={formData.talkNoOrType || ''}
              onChange={(e) => handleTalkChange(e.target.value)}
            />
          </div>

          {/* Lieu et Hôte */}
          <Select
            label="Type de lieu"
            options={[
              { value: 'physical', label: 'Salle du Royaume' },
              { value: 'zoom', label: 'Visioconférence' },
              { value: 'streaming', label: 'Streaming' }
            ]}
            value={formData.locationType}
            onChange={(e) => setFormData(prev => ({ ...prev, locationType: e.target.value as any }))}
          />

          <Select
            label="Contact d'accueil"
            options={[
              { value: '', label: 'Aucun' },
              ...hosts.map(h => ({ value: h.nom, label: h.nom }))
            ]}
            value={formData.host || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
          />
        </div>
      </form>
    </Modal>
  );
};
