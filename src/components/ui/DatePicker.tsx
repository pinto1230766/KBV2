import React from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Sélectionner une date',
  className = '',
  required = false,
  disabled = false,
  min,
  max
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};
