import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface AutocompleteOption {
  value: string | number;
  label: string;
  subtitle?: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  allowCustomValue?: boolean;
  maxOptions?: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Rechercher...',
  className = '',
  required = false,
  disabled = false,
  allowCustomValue = false,
  maxOptions = 10,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Initialize selected option based on value
  useEffect(() => {
    if (value) {
      const option = options.find((opt) => opt.value === value);
      if (option) {
        setSelectedOption(option);
        setSearchTerm(option.label);
      }
    } else {
      setSelectedOption(null);
      setSearchTerm('');
    }
  }, [value, options]);

  // Filter options based on search term
  const filteredOptions = options
    .filter(
      (option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.subtitle && option.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(0, maxOptions);

  // Reset focused index when filtered options change
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(-1);
    }
  }, [filteredOptions, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);

    // If allowing custom values and no exact match, clear selection
    if (allowCustomValue) {
      const exactMatch = options.find((opt) => opt.label.toLowerCase() === newValue.toLowerCase());
      if (!exactMatch) {
        setSelectedOption(null);
        onChange?.(newValue);
      }
    }
  };

  const handleOptionSelect = (option: AutocompleteOption) => {
    setSelectedOption(option);
    setSearchTerm(option.label);
    setIsOpen(false);
    onChange?.(option.value);
  };

  const handleClear = () => {
    setSelectedOption(null);
    setSearchTerm('');
    setIsOpen(false);
    onChange?.('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
    } else if (e.key === 'ArrowDown' && !isOpen) {
      setIsOpen(true);
      setFocusedIndex(0);
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp' && isOpen) {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && isOpen && focusedIndex >= 0) {
      e.preventDefault();
      handleOptionSelect(filteredOptions[focusedIndex]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className='relative'>
        <input
          ref={inputRef}
          type='text'
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className='w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors'
          required={required}
          disabled={disabled}
        />

        {/* Clear button */}
        {(searchTerm || selectedOption) && !disabled && (
          <button
            type='button'
            onClick={handleClear}
            className='absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            aria-label='Effacer la sélection'
            title='Effacer'
          >
            <X className='w-4 h-4' aria-hidden='true' />
          </button>
        )}

        {/* Dropdown toggle */}
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          disabled={disabled}
          aria-label={isOpen ? 'Fermer la liste' : 'Ouvrir la liste'}
          title={isOpen ? 'Fermer' : 'Ouvrir'}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden='true'
          />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className='absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto'>
          {filteredOptions.length > 0 ? (
            <ul ref={listRef} className='py-1'>
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleOptionSelect(option)}
                  className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors'
                >
                  <div className='font-medium text-gray-900 dark:text-white'>{option.label}</div>
                  {option.subtitle && (
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      {option.subtitle}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className='px-3 py-4 text-center text-gray-500 dark:text-gray-400'>
              {searchTerm ? 'Aucun résultat trouvé' : 'Tapez pour rechercher...'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
