import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Expense } from '@/types';
import { Save } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: (expenseData: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
  initialData?: Expense;
  currency?: string;
}

const CATEGORIES = ['Transport', 'Hébergement', 'Repas', 'Matériel', 'Autre'];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  currency = '€',
}) => {
  const [description, setDescription] = useState(initialData?.description || '');
  const [amount, setAmount] = useState<string>(initialData?.amount?.toString() || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    onSubmit({
      description,
      amount: parseFloat(amount),
      date,
      category,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'
    >
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Description *
          </label>
          <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm'
            placeholder='Ex: Billet de train...'
            required
            autoFocus
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Catégorie
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm'
            title='Catégorie de la dépense'
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Montant ({currency}) *
          </label>
          <input
            type='number'
            step='0.01'
            min='0'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm'
            required
            title='Montant de la dépense'
            placeholder='0.00'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Date *
          </label>
          <input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm'
            required
            title='Date de la dépense'
          />
        </div>
      </div>

      <div className='flex justify-end gap-2 pt-2'>
        <Button variant='ghost' onClick={onCancel} type='button'>
          Annuler
        </Button>
        <Button variant='primary' type='submit' leftIcon={<Save className='w-4 h-4' />}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
};
