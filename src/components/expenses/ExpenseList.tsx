import React, { useMemo, memo } from 'react';
import { Expense } from '@/types';
import { Button } from '@/components/ui/Button';
import { Plus, Edit2, Trash2, Tag, Calendar, Euro } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ExpenseListProps {
  expenses: Expense[];
  onAdd: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  currency?: string;
  readOnly?: boolean;
}

const ExpenseListInner: React.FC<ExpenseListProps> = ({
  expenses = [],
  onAdd,
  onEdit,
  onDelete,
  currency = '€',
  readOnly = false,
}) => {
  const totalAmount = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  if (expenses.length === 0 && readOnly) {
    return (
      <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
        Aucune dépense enregistrée.
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Header with Total */}
      <div className='flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
        <div>
          <p className='text-sm text-gray-500 dark:text-gray-400'>Total des dépenses</p>
          <p className='text-2xl font-bold text-gray-900 dark:text-white'>
            {totalAmount.toFixed(2)} {currency}
          </p>
        </div>
        {!readOnly && (
          <Button onClick={onAdd} variant='primary' leftIcon={<Plus className='w-4 h-4' />}>
            Ajouter une dépense
          </Button>
        )}
      </div>

      {/* Expenses List */}
      <div className='space-y-2'>
        {expenses.length === 0 ? (
          <div className='text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700'>
            <Euro className='w-10 h-10 mx-auto text-gray-400 mb-2' />
            <p className='text-gray-500 dark:text-gray-400'>Aucune dépense pour le moment</p>
            {!readOnly && (
              <Button onClick={onAdd} variant='ghost' className='mt-2 text-primary-600'>
                Commencer à ajouter
              </Button>
            )}
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className='flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow'
            >
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='font-medium text-gray-900 dark:text-white truncate'>
                    {expense.description}
                  </span>
                  {expense.category && (
                    <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'>
                      <Tag className='w-3 h-3 mr-1' />
                      {expense.category}
                    </span>
                  )}
                </div>
                <div className='flex items-center text-xs text-gray-500 dark:text-gray-400'>
                  <Calendar className='w-3 h-3 mr-1' />
                  {format(new Date(expense.date), 'dd MMMM yyyy', { locale: fr })}
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <span className='font-semibold text-gray-900 dark:text-white'>
                  {expense.amount.toFixed(2)} {currency}
                </span>
                {!readOnly && (
                  <div className='flex items-center gap-1'>
                    <button
                      onClick={() => onEdit(expense)}
                      className='p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors'
                      title='Modifier'
                    >
                      <Edit2 className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className='p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors'
                      title='Supprimer'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Memoization for performance optimization
export const ExpenseList = memo(ExpenseListInner);
ExpenseList.displayName = 'ExpenseList';
