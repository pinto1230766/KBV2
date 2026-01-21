import React, { useState } from 'react';
import { ChecklistItem } from '@/types';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { generateUUID } from '@/utils/uuid';

interface ChecklistProps {
  items: ChecklistItem[];
  onUpdate: (items: ChecklistItem[]) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({ items = [], onUpdate }) => {
  const [newItemLabel, setNewItemLabel] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleToggle = (id: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    onUpdate(updatedItems);
  };

  const handleDelete = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    onUpdate(updatedItems);
  };

  const handleAddItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newItemLabel.trim()) return;

    const newItem: ChecklistItem = {
      id: generateUUID(),
      label: newItemLabel.trim(),
      isCompleted: false,
    };

    onUpdate([...items, newItem]);
    setNewItemLabel('');
    setIsAdding(false);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between mb-2'>
        <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Liste des tâches ({items.filter((i) => i.isCompleted).length}/{items.length})
        </h4>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => setIsAdding(!isAdding)}
          className='text-primary hover:text-primary/80 p-0 h-auto'
        >
          <Plus className='w-4 h-4 mr-1' />
          Ajouter
        </Button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAddItem}
          className='flex gap-2 items-center mb-4 animate-in fade-in slide-in-from-top-2 duration-200'
        >
          <Input
            autoFocus
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            placeholder='Nouvelle tâche...'
            className='flex-1 h-9 text-sm'
          />
          <Button type='submit' size='sm' disabled={!newItemLabel.trim()}>
            Ajouter
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => setIsAdding(false)}
            leftIcon={<X className='w-4 h-4' />}
          />
        </form>
      )}

      <div className='space-y-2'>
        {items.length === 0 && !isAdding ? (
          <div className='text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg'>
            <p className='text-sm text-gray-500'>Aucune tâche pour le moment</p>
            <Button variant='ghost' size='sm' onClick={() => setIsAdding(true)}>
              Commencer une liste
            </Button>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center group p-2 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${item.isCompleted ? 'opacity-75' : ''}`}
            >
              <button
                onClick={() => handleToggle(item.id)}
                className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${
                  item.isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                }`}
              >
                {item.isCompleted && <Check className='w-3.5 h-3.5' />}
              </button>

              <span
                className={`flex-1 text-sm transition-all ${
                  item.isCompleted
                    ? 'text-gray-400 line-through'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                {item.label}
              </span>

              <button
                onClick={() => handleDelete(item.id)}
                className='opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity'
                title='Supprimer'
              >
                <Trash2 className='w-4 h-4' />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
