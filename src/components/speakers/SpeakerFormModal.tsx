import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Speaker, Gender } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { v4 as uuidv4 } from 'uuid';

interface SpeakerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  speaker?: Speaker; // Si présent, mode édition
}

export const SpeakerFormModal: React.FC<SpeakerFormModalProps> = ({
  isOpen,
  onClose,
  speaker
}) => {
  const { addSpeaker, updateSpeaker, speakers } = useData();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Speaker>>({
    nom: '',
    congregation: '',
    telephone: '',
    email: '',
    gender: 'male',
    notes: '',
    isVehiculed: true,
  });

  useEffect(() => {
    if (speaker) {
      setFormData(speaker);
    } else {
      setFormData({
        nom: '',
        congregation: '',
        telephone: '',
        email: '',
        gender: 'male',
        notes: '',
        isVehiculed: true,
      });
    }
  }, [speaker, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.nom || !formData.congregation) {
        throw new Error('Le nom et la congrégation sont obligatoires');
      }

      // Vérification doublon (seulement en création)
      if (!speaker && speakers.some(s => s.nom.toLowerCase() === formData.nom?.toLowerCase())) {
        throw new Error('Un orateur avec ce nom existe déjà');
      }

      const speakerData: Speaker = {
        ...formData as Speaker,
        id: speaker ? speaker.id : uuidv4(),
        talkHistory: speaker ? speaker.talkHistory : [],
        updatedAt: new Date().toISOString(),
        createdAt: speaker ? speaker.createdAt : new Date().toISOString(),
      };

      if (speaker) {
        updateSpeaker(speakerData);
        addToast('Orateur mis à jour avec succès', 'success');
      } else {
        addSpeaker(speakerData);
        addToast('Orateur ajouté avec succès', 'success');
      }
      onClose();
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Erreur lors de l'enregistrement", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={speaker ? "Modifier l'orateur" : "Ajouter un orateur"}
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo de profil */}
        <div className="flex justify-center mb-4">
          <ImageUpload
            value={formData.photoUrl}
            onChange={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))}
            label="Photo de l'orateur"
            size="lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom complet"
            value={formData.nom}
            onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
            required
            placeholder="Ex: Jean Dupont"
          />
          
          <Input
            label="Congrégation"
            value={formData.congregation}
            onChange={(e) => setFormData(prev => ({ ...prev, congregation: e.target.value }))}
            required
            placeholder="Ex: Lyon Centre"
          />

          <Input
            label="Téléphone"
            value={formData.telephone}
            onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
            placeholder="Ex: 06 12 34 56 78"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Ex: jean.dupont@email.com"
          />

          <Select
            label="Genre"
            options={[
              { value: 'male', label: 'Frère' },
              { value: 'female', label: 'Sœur' }, // Peu probable pour un orateur public, mais possible pour d'autres rôles
              { value: 'couple', label: 'Couple' },
            ]}
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as Gender }))}
          />

          <div className="flex items-center space-x-2 pt-8">
            <input
              type="checkbox"
              id="isVehiculed"
              checked={formData.isVehiculed}
              onChange={(e) => setFormData(prev => ({ ...prev, isVehiculed: e.target.checked }))}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isVehiculed" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Est véhiculé
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Notes particulières..."
          />
        </div>
      </form>
    </Modal>
  );
};
