import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Host, Gender } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';

interface HostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  host?: Host; // Si présent, mode édition
}

export const HostFormModal: React.FC<HostFormModalProps> = ({
  isOpen,
  onClose,
  host
}) => {
  const { addHost, updateHost, hosts } = useData();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Host>>({
    nom: '',
    address: '',
    telephone: '',
    email: '',
    gender: 'couple',
    notes: '',
    capacity: 2,
    hasPets: false,
    isSmoker: false,
  });

  useEffect(() => {
    if (host) {
      setFormData(host);
    } else {
      setFormData({
        nom: '',
        address: '',
        telephone: '',
        email: '',
        gender: 'couple',
        notes: '',
        capacity: 2,
        hasPets: false,
        isSmoker: false,
      });
    }
  }, [host, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.nom) {
        throw new Error('Le nom est obligatoire');
      }

      // Vérification doublon (seulement en création)
      if (!host && hosts.some(h => h.nom.toLowerCase() === formData.nom?.toLowerCase())) {
        throw new Error('Un contact avec ce nom existe déjà');
      }

      const hostData: Host = {
        ...formData as Host,
        unavailableDates: host ? host.unavailableDates : [],
      };

      if (host) {
        updateHost(host.nom, hostData); // Note: updateHost utilise le nom comme clé pour l'instant
        addToast('Contact mis à jour avec succès', 'success');
      } else {
        addHost(hostData);
        addToast('Contact ajouté avec succès', 'success');
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
      title={host ? "Modifier le contact" : "Ajouter un contact"}
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
            label="Photo du contact"
            size="lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom complet"
            value={formData.nom}
            onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
            required
            placeholder="Ex: Famille Martin"
          />
          
          <Input
            label="Adresse"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Ex: 12 rue de la Paix, Lyon"
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
            placeholder="Ex: famille.martin@email.com"
          />

          <Select
            label="Type de foyer"
            options={[
              { value: 'couple', label: 'Couple' },
              { value: 'male', label: 'Frère seul' },
              { value: 'female', label: 'Sœur seule' },
            ]}
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as Gender }))}
          />

          <Input
            label="Capacité d'accueil (personnes)"
            type="number"
            min={1}
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
          />

          <div className="flex items-center space-x-4 pt-8 col-span-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasPets"
                checked={formData.hasPets}
                onChange={(e) => setFormData(prev => ({ ...prev, hasPets: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="hasPets" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Animaux de compagnie
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isSmoker"
                checked={formData.isSmoker}
                onChange={(e) => setFormData(prev => ({ ...prev, isSmoker: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isSmoker" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Fumeur
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes / Contraintes
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Allergies, régime alimentaire, escaliers..."
          />
        </div>
      </form>
    </Modal>
  );
};
