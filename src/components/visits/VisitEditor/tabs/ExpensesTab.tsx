import React, { useState } from 'react';
import { useVisitEditor } from '../VisitEditorContext';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { generateUUID } from '@/utils/uuid';

export const ExpensesTab: React.FC = () => {
  const { formData, setFormData } = useVisitEditor();
  const [isAdding, setIsAdding] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const handleAddExpense = async (expense: any) => {
    const expenses = [...(formData.expenses || []), { ...expense, id: generateUUID() }];
    setFormData((prev) => ({ ...prev, expenses }));
    setIsAdding(false);
    setEditingExpense(null);
  };

  return (
    <div className='space-y-4'>
      {isAdding || editingExpense ? (
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={handleAddExpense}
          onCancel={() => {
            setIsAdding(false);
            setEditingExpense(null);
          }}
        />
      ) : (
        <ExpenseList
          expenses={formData.expenses || []}
          onAdd={() => setIsAdding(true)}
          onEdit={setEditingExpense}
          onDelete={(expenseId) =>
            setFormData((prev) => ({
              ...prev,
              expenses: (prev.expenses || []).filter((expense) => expense.id !== expenseId),
            }))
          }
          readOnly={false}
        />
      )}
    </div>
  );
};
