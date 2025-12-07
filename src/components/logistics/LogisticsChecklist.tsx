import React, { useState } from 'react';
import { ChecklistItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckSquare, Square, Trash2, Plus, Info } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface LogisticsChecklistProps {
  items: ChecklistItem[];
  onUpdate: (items: ChecklistItem[]) => void;
  readOnly?: boolean;
}

export const LogisticsChecklist: React.FC<LogisticsChecklistProps> = ({ 
  items = [], 
  onUpdate,
  readOnly = false 
}) => {
  const [newItemLabel, setNewItemLabel] = useState('');

  const handleToggle = (id: string) => {
    if (readOnly) return;
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    onUpdate(updatedItems);
  };

  const handleAdd = () => {
    if (!newItemLabel.trim() || readOnly) return;
    const newItem: ChecklistItem = {
      id: uuidv4(),
      label: newItemLabel.trim(),
      isCompleted: false
    };
    onUpdate([...items, newItem]);
    setNewItemLabel('');
  };

  const handleDelete = (id: string) => {
    if (readOnly) return;
    onUpdate(items.filter(item => item.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const defaultItems = [
    "Billets de transport",
    "Costume / Tenue",
    "Contact Orateur local",
    "Matériel (Tablette, etc.)"
  ];

  const addDefaultItems = () => {
    const newItems = defaultItems
      .filter(label => !items.some(i => i.label === label))
      .map(label => ({
        id: uuidv4(),
        label,
        isCompleted: false
      }));
    if (newItems.length > 0) {
      onUpdate([...items, ...newItems]);
    }
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && !readOnly && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
           <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
           <div className="flex-1">
             <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
               La liste est vide. Vous pouvez ajouter des éléments manuellement ou utiliser notre liste suggérée.
             </p>
             <Button size="sm" variant="secondary" onClick={addDefaultItems}>
               Ajouter les suggestions par défaut
             </Button>
           </div>
        </div>
      )}

      {!readOnly && (
        <div className="flex gap-2">
          <Input 
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ajouter une tâche..."
            className="flex-1"
            title="Nouvelle tâche"
            rightIcon={
              <button 
                type="button"
                onClick={handleAdd}
                disabled={!newItemLabel.trim()}
                title="Ajouter"
                className="hover:text-green-600 transition-colors"
              >
                <Plus className="w-4 h-4 text-green-600" />
              </button>
            }
          />
        </div>
      )}

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {items.map(item => (
          <div 
            key={item.id} 
            className={`
              flex items-center justify-between p-3 rounded-lg border transition-colors
              ${item.isCompleted 
                ? 'bg-gray-50 border-gray-100 dark:bg-gray-800/50 dark:border-gray-700' 
                : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }
            `}
          >
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer" 
              onClick={() => handleToggle(item.id)}
            >
              {item.isCompleted ? (
                <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              )}
              <span className={`text-sm ${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                {item.label}
              </span>
            </div>
            
            {!readOnly && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDelete(item.id)}
                className="text-gray-400 hover:text-red-500"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
