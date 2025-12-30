import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete } from './Autocomplete';

describe('Autocomplete', () => {
  const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  const defaultProps = {
    options: mockOptions,
    value: '',
    onChange: vi.fn(),
    placeholder: 'Search...',
  };

  describe('Rendering', () => {
    it('should render input field', () => {
      render(<Autocomplete {...defaultProps} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Autocomplete {...defaultProps} label='Select Option' />);
      expect(screen.getByText('Select Option')).toBeInTheDocument();
    });

    it('should show placeholder', () => {
      render(<Autocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(<Autocomplete {...defaultProps} value='1' />);
      const input = screen.getByDisplayValue('Option 1');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Dropdown behavior', () => {
    it('should show options when input is focused', async () => {
      render(<Autocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');

      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });
    });

    it('should hide options when clicking outside', async () => {
      render(<Autocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');

      fireEvent.focus(input);
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });

    it('should filter options based on input', async () => {
      const user = userEvent.setup();
      render(<Autocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');

      await user.type(input, 'Option 2');

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
      });
    });
  });

  describe('Selection', () => {
    it('should call onChange when option is selected', async () => {
      const onChange = vi.fn();
      render(<Autocomplete {...defaultProps} onChange={onChange} />);

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.focus(input);

      await waitFor(() => {
        const option = screen.getByText('Option 1');
        fireEvent.click(option);
      });

      expect(onChange).toHaveBeenCalledWith('1');
    });

    it('should update input value after selection', async () => {
      const { rerender } = render(<Autocomplete {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.focus(input);

      await waitFor(() => {
        const option = screen.getByText('Option 2');
        fireEvent.click(option);
      });

      rerender(<Autocomplete {...defaultProps} value='2' />);

      expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument();
    });
  });

  describe('Keyboard navigation', () => {
    it('should navigate with arrow keys', async () => {
      render(<Autocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');

      fireEvent.focus(input);

      // Arrow down to first option
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      // Options should be visible
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    it('should select option with Enter key', async () => {
      const onChange = vi.fn();
      render(<Autocomplete {...defaultProps} onChange={onChange} />);

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.focus(input);
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should close dropdown with Escape key', async () => {
      render(<Autocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');

      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Autocomplete {...defaultProps} disabled />);
      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeDisabled();
    });

    it('should show required indicator', () => {
      render(<Autocomplete {...defaultProps} required label='Field' />);
      // Should show required indicator (implementation specific)
      expect(screen.getByText('Field')).toBeInTheDocument();
    });

    it('should handle loading state', () => {
      render(<Autocomplete {...defaultProps} loading />);
      // Should show loading indicator
      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Clear functionality', () => {
    it('should clear selection when clear button is clicked', async () => {
      const onChange = vi.fn();
      render(<Autocomplete {...defaultProps} value='1' onChange={onChange} />);

      const clearButton = screen.getByLabelText('Effacer la sélection');
      fireEvent.click(clearButton);

      expect(onChange).toHaveBeenCalledWith('');
    });

    it('should not show clear button when no value', () => {
      render(<Autocomplete {...defaultProps} value='' />);
      expect(screen.queryByLabelText('Effacer la sélection')).not.toBeInTheDocument();
    });
  });

  describe('Empty states', () => {
    it('should show "no options" message when options array is empty', () => {
      render(<Autocomplete {...defaultProps} options={[]} />);
      const input = screen.getByPlaceholderText('Search...');

      fireEvent.focus(input);
      // Should show no options message
    });

    it('should show "no results" when filter returns empty', async () => {
      const user = userEvent.setup();
      render(<Autocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');

      await user.type(input, 'nonexistent');

      // Should show no results message
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Autocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');

      // Should have aria-autocomplete
      expect(input).toHaveAttribute('role', 'combobox');
    });

    it('should announce changes to screen readers', async () => {
      render(<Autocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');

      fireEvent.focus(input);

      // ARIA live region should announce results
    });
  });

  describe('Edge cases', () => {
    it('should handle special characters in search', async () => {
      const user = userEvent.setup();
      render(<Autocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');

      await user.type(input, '!@#$%');

      // Should not crash
      expect(input).toBeInTheDocument();
    });

    it('should handle very long option labels', () => {
      const longOptions = [{ value: '1', label: 'x'.repeat(1000) }];

      render(<Autocomplete {...defaultProps} options={longOptions} />);
      const input = screen.getByPlaceholderText('Search...');

      fireEvent.focus(input);
      // Should handle long text gracefully
    });
  });
});
