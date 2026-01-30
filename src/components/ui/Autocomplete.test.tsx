import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete } from './Autocomplete';

const OPTIONS = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

describe('Autocomplete', () => {
  const defaultProps = {
    options: OPTIONS,
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders input with placeholder', () => {
    render(<Autocomplete {...defaultProps} placeholder='Chercher...' />);
    expect(screen.getByPlaceholderText('Chercher...')).toBeInTheDocument();
  });

  it('shows options on focus and allows selection', async () => {
    const onChange = vi.fn();
    render(<Autocomplete {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    expect(await screen.findByText('Option 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Option 2'));
    expect(onChange).toHaveBeenCalledWith('2');
  });

  it('filters options based on search term', async () => {
    const user = userEvent.setup();
    render(<Autocomplete {...defaultProps} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    await user.type(input, '3');

    expect(await screen.findByText('Option 3')).toBeInTheDocument();
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('clears selection when clear button clicked', () => {
    const onChange = vi.fn();
    render(<Autocomplete {...defaultProps} value='1' onChange={onChange} />);

    const clearBtn = screen.getByLabelText('Effacer la sélection');
    fireEvent.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('closes dropdown on escape', async () => {
    render(<Autocomplete {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    expect(await screen.findByText('Option 1')).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('shows empty state messages', async () => {
    const user = userEvent.setup();
    render(<Autocomplete {...defaultProps} options={[]} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    expect(await screen.findByText('Tapez pour rechercher...')).toBeInTheDocument();

    render(<Autocomplete {...defaultProps} />);
    const populatedInput = screen.getByRole('textbox');
    fireEvent.focus(populatedInput);
    await user.type(populatedInput, 'zzz');
    expect(await screen.findByText('Aucun résultat trouvé')).toBeInTheDocument();
  });

  it('respects disabled prop', () => {
    render(<Autocomplete {...defaultProps} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('handles keyboard selection', () => {
    const onChange = vi.fn();
    render(<Autocomplete {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('1');
  });
});
