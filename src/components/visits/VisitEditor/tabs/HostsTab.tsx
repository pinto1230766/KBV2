import React, { useMemo, useState } from 'react';
import { useVisitEditor } from '../VisitEditorContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { generateUUID } from '@/utils/uuid';
import { X, User, Plus, Users } from 'lucide-react';
import { Companion, HostAssignment } from '@/types';

const ROLE_OPTIONS = [
  { value: 'accommodation', label: 'Hébergement' },
  { value: 'hotel', label: 'Hôtel' },
  { value: 'pickup', label: 'Ramassage' },
  { value: 'meals', label: 'Repas' },
  { value: 'transport', label: 'Transport' },
  { value: 'other', label: 'Autre' },
] as const;

export const HostsTab: React.FC = () => {
  const { formData, setFormData } = useVisitEditor();
  const { hosts } = useData();
  const [selectedHost, setSelectedHost] = useState('');
  const [selectedRole, setSelectedRole] = useState<typeof ROLE_OPTIONS[number]['value']>('accommodation');
  const [hotelName, setHotelName] = useState('');

  const availableHosts = useMemo(() => hosts.map((h) => h.nom).sort(), [hosts]);

  const isHotelRole = selectedRole === 'hotel';

  const addAssignment = () => {
    if (isHotelRole) {
      if (!hotelName.trim()) return;
      const newAssignment = {
        id: generateUUID(),
        hostId: hotelName.trim(),
        hostName: hotelName.trim(),
        role: selectedRole,
        createdAt: new Date().toISOString(),
      } as any;
      setFormData((prev) => ({
        ...prev,
        hostAssignments: [...(prev.hostAssignments || []), newAssignment],
      }));
      setHotelName('');
    } else {
      if (!selectedHost) return;
      const newAssignment = {
        id: generateUUID(),
        hostId: selectedHost,
        hostName: selectedHost,
        role: selectedRole,
        createdAt: new Date().toISOString(),
      } as any;
      setFormData((prev) => ({
        ...prev,
        hostAssignments: [...(prev.hostAssignments || []), newAssignment],
      }));
      setSelectedHost('');
    }
  };

  const removeAssignment = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      hostAssignments: (prev.hostAssignments || []).filter((assignment) => assignment.id !== id),
    }));
  };

  // Accompagnants - masqués pour streaming/zoom et orateurs Lyon
  const showCompanions = formData.locationType !== 'zoom' && formData.locationType !== 'streaming' && !formData.congregation?.includes('Lyon');
  const addCompanion = () => {
    const newCompanion: Companion = {
      id: generateUUID(),
      name: '',
      type: 'other',
      hostAssignments: [],
    };
    setFormData((prev) => ({
      ...prev,
      companions: [...(prev.companions || []), newCompanion],
    }));
  };

  const updateCompanion = (index: number, updates: Partial<Companion>) => {
    setFormData((prev) => {
      const newCompanions = [...(prev.companions || [])];
      newCompanions[index] = { ...newCompanions[index], ...updates };
      return { ...prev, companions: newCompanions };
    });
  };

  const removeCompanion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      companions: (prev.companions || []).filter((_, i) => i !== index),
    }));
  };

  const addCompanionHostAssignment = (companionIndex: number, hostName: string, role: string = 'accommodation') => {
    if (!hostName) return;
    const newAssignment: HostAssignment = {
      id: generateUUID(),
      hostId: hostName,
      hostName: hostName,
      role: role as any,
      createdAt: new Date().toISOString(),
    };
    setFormData((prev) => {
      const newCompanions = [...(prev.companions || [])];
      const companion = newCompanions[companionIndex];
      newCompanions[companionIndex] = {
        ...companion,
        hostAssignments: [...(companion.hostAssignments || []), newAssignment],
      };
      return { ...prev, companions: newCompanions };
    });
  };

  const updateCompanionAssignmentRole = (companionIndex: number, assignmentIndex: number, role: string) => {
    setFormData((prev) => {
      const newCompanions = [...(prev.companions || [])];
      const companion = newCompanions[companionIndex];
      const newAssignments = [...(companion.hostAssignments || [])];
      newAssignments[assignmentIndex] = { ...newAssignments[assignmentIndex], role: role as any };
      newCompanions[companionIndex] = { ...companion, hostAssignments: newAssignments };
      return { ...prev, companions: newCompanions };
    });
  };

  const removeCompanionAssignment = (companionIndex: number, assignmentIndex: number) => {
    setFormData((prev) => {
      const newCompanions = [...(prev.companions || [])];
      const companion = newCompanions[companionIndex];
      newCompanions[companionIndex] = {
        ...companion,
        hostAssignments: (companion.hostAssignments || []).filter((_, i) => i !== assignmentIndex),
      };
      return { ...prev, companions: newCompanions };
    });
  };

  return (
    <div className='space-y-8 max-w-3xl'>
      {/* Section Orateur */}
      <div>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
          <User className='w-5 h-5' />
          Assignations pour l'orateur
        </h3>
        {(formData.hostAssignments || []).length === 0 ? (
          <p className='text-sm text-gray-500 mt-2'>Aucun hôte n'a encore été assigné.</p>
        ) : (
          <div className='mt-4 space-y-3'>
            {(formData.hostAssignments || []).map((assignment) => (
              <div
                key={assignment.id}
                className='flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold'>
                    <User className='w-4 h-4' />
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900 dark:text-white'>{assignment.hostName}</p>
                    <Badge variant='default'>{ROLE_OPTIONS.find((r) => r.value === assignment.role)?.label ?? assignment.role}</Badge>
                    {assignment.notes && (
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>{assignment.notes}</p>
                    )}
                  </div>
                </div>
                <button
                  className='text-red-500 hover:text-red-600'
                  onClick={() => removeAssignment(assignment.id)}
                  aria-label="Supprimer l'hôte"
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ajouter hôte pour orateur */}
      <div className='border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-4'>
        <h4 className='text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3'>
          {isHotelRole ? "Ajouter un hôtel" : "Ajouter un hôte pour l'orateur"}
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1'>
              {isHotelRole ? "Nom de l'hôtel" : 'Hôte'}
            </label>
            {isHotelRole ? (
              <input
                type='text'
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder="Nom de l'hôtel"
                className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
              />
            ) : (
              <select
                value={selectedHost}
                onChange={(e) => setSelectedHost(e.target.value)}
                className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                aria-label='Sélectionner un hôte'
              >
                <option value=''>Choisir un hôte…</option>
                {availableHosts.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className='block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1'>Rôle</label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value as typeof selectedRole);
                setSelectedHost('');
                setHotelName('');
              }}
              className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
              aria-label='Sélectionner un rôle'
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button
          className='mt-4'
          onClick={addAssignment}
          disabled={isHotelRole ? !hotelName.trim() : !selectedHost}
        >
          {isHotelRole ? "Ajouter l'hôtel" : "Ajouter l'hôte"}
        </Button>
      </div>

      {/* Section Accompagnants - masquée pour streaming/zoom et Lyon */}
      {showCompanions && (
        <div className='border-t border-gray-200 dark:border-gray-800 pt-8'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
              <Users className='w-5 h-5' />
              Accompagnants
            </h3>
            <Button
              variant='secondary'
              size='sm'
              onClick={addCompanion}
              leftIcon={<Plus className='w-4 h-4' />}
            >
              Ajouter un accompagnant
            </Button>
          </div>

          {(formData.companions || []).length === 0 ? (
            <p className='text-sm text-gray-500'>Aucun accompagnant n'a été ajouté.</p>
          ) : (
            <div className='space-y-6'>
              {(formData.companions || []).map((companion, cIndex) => (
                <div
                  key={companion.id}
                  className='p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1'>
                          Nom
                        </label>
                        <input
                          type='text'
                          value={companion.name}
                          onChange={(e) => updateCompanion(cIndex, { name: e.target.value })}
                          placeholder="Nom de l'accompagnant"
                          className='w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1'>
                          Type
                        </label>
                        <select
                          value={companion.type}
                          onChange={(e) => updateCompanion(cIndex, { type: e.target.value as any })}
                          className='w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                          title="Type d'accompagnant"
                        >
                          <option value='couple'>Couple</option>
                          <option value='brother'>Frère</option>
                          <option value='sister'>Sœur</option>
                          <option value='other'>Autre</option>
                        </select>
                      </div>
                    </div>
                    <button
                      className='ml-4 text-red-500 hover:text-red-600'
                      onClick={() => removeCompanion(cIndex)}
                      aria-label="Supprimer l'accompagnant"
                    >
                      <X className='w-5 h-5' />
                    </button>
                  </div>

                  {/* Host assignments pour cet accompagnant */}
                  <div className='space-y-3'>
                    <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Assignations d'hôtes
                    </h4>
                    {(companion.hostAssignments || []).length === 0 ? (
                      <p className='text-xs text-gray-500'>Aucun hôte assigné.</p>
                    ) : (
                      <div className='space-y-2'>
                        {(companion.hostAssignments || []).map((assignment, aIndex) => (
                          <div
                            key={assignment.id}
                            className='flex items-center justify-between p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                          >
                            <div className='flex items-center gap-3'>
                              <div className='w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center'>
                                <User className='w-3 h-3' />
                              </div>
                              <div>
                                <p className='font-medium text-gray-900 dark:text-white text-sm'>{assignment.hostName}</p>
                                <select
                                  value={assignment.role}
                                  onChange={(e) => updateCompanionAssignmentRole(cIndex, aIndex, e.target.value)}
                                  className='text-xs border-none bg-transparent p-0 text-gray-500 focus:ring-0'
                                  title="Rôle de l'hôte"
                                >
                                  {ROLE_OPTIONS.map((role) => (
                                    <option key={role.value} value={role.value}>
                                      {role.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <button
                              className='text-red-500 hover:text-red-600'
                              onClick={() => removeCompanionAssignment(cIndex, aIndex)}
                              aria-label="Supprimer l'assignation"
                            >
                              <X className='w-4 h-4' />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Ajouter hôte pour accompagnant */}
                    <div className='space-y-2'>
                      <div className='flex gap-2'>
                        <select
                          id={`companion-role-${companion.id}`}
                          className='px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm'
                          defaultValue='accommodation'
                          title="Sélectionner un rôle"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type='text'
                          id={`companion-host-${companion.id}`}
                          placeholder="Nom de l'hôte ou hôtel"
                          className='flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm'
                        />
                        <Button
                          size='sm'
                          onClick={() => {
                            const roleSelect = document.getElementById(`companion-role-${companion.id}`) as HTMLSelectElement;
                            const hostInput = document.getElementById(`companion-host-${companion.id}`) as HTMLInputElement;
                            const role = roleSelect?.value || 'accommodation';
                            const value = hostInput?.value?.trim();
                            if (value) {
                              addCompanionHostAssignment(cIndex, value, role);
                              hostInput.value = '';
                            }
                          }}
                        >
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Notes pour l'accompagnant */}
                  <div className='mt-4'>
                    <input
                      type='text'
                      value={companion.notes || ''}
                      onChange={(e) => updateCompanion(cIndex, { notes: e.target.value })}
                      placeholder='Notes (allergies, préférences, etc.)'
                      className='w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm'
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
