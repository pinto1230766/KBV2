import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUpload } from './FileUpload';

const createMockFile = (name = 'file.txt', type = 'text/plain', size = 10) =>
  new File([new Array(size).fill('a').join('')], name, { type });

const triggerInputChange = (file: File | File[], input: HTMLInputElement) => {
  const files = Array.isArray(file) ? file : [file];
  Object.defineProperty(input, 'files', {
    value: (globalThis as any).createFileList(...files),
  });
  fireEvent.change(input);
};

describe('FileUpload', () => {
  const defaultProps = {
    onFilesSelected: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders drop zone', () => {
    render(<FileUpload {...defaultProps} />);
    expect(screen.getByText(/glisser-déposez/i)).toBeInTheDocument();
  });

  it('calls onFilesSelected on input change', async () => {
    const onFilesSelected = vi.fn();
    render(<FileUpload {...defaultProps} onFilesSelected={onFilesSelected} />);

    const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
    const file = createMockFile('test.txt');

    triggerInputChange(file, input);

    await waitFor(() => {
      expect(onFilesSelected).toHaveBeenCalledWith([expect.objectContaining({ name: 'test.txt' })]);
    });
  });

  it('supports multiple files when enabled', async () => {
    const onFilesSelected = vi.fn();
    render(<FileUpload {...defaultProps} onFilesSelected={onFilesSelected} multiple />);

    const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
    const files = [createMockFile('a.txt'), createMockFile('b.txt')];

    triggerInputChange(files, input);

    await waitFor(() => {
      expect(onFilesSelected).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'a.txt' }),
        expect.objectContaining({ name: 'b.txt' }),
      ]));
    });
  });

  it('rejects files exceeding max size', async () => {
    const onFilesSelected = vi.fn();
    render(<FileUpload {...defaultProps} maxSize={5} onFilesSelected={onFilesSelected} />);

    const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
    triggerInputChange(createMockFile('large.txt', 'text/plain', 20), input);

    await waitFor(() => {
      expect(onFilesSelected).not.toHaveBeenCalled();
    });
  });

  it('respects maxFiles prop', async () => {
    const onFilesSelected = vi.fn();
    render(<FileUpload {...defaultProps} maxFiles={1} multiple onFilesSelected={onFilesSelected} />);

    const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
    triggerInputChange([createMockFile('a.txt'), createMockFile('b.txt')], input);

    await waitFor(() => {
      expect(onFilesSelected).not.toHaveBeenCalled();
    });
  });

  it('handles drag & drop', async () => {
    const onFilesSelected = vi.fn();
    render(<FileUpload {...defaultProps} onFilesSelected={onFilesSelected} />);

    const dropZone = screen.getByText(/glisser-déposez/i).closest('div')!;
    const dataTransfer = new (window as any).MockDataTransfer();
    dataTransfer.files = (globalThis as any).createFileList(createMockFile('drop.txt'));

    fireEvent.drop(dropZone, { dataTransfer });

    await waitFor(() => {
      expect(onFilesSelected).toHaveBeenCalledWith([expect.objectContaining({ name: 'drop.txt' })]);
    });
  });

  it('disables input when disabled prop is true', () => {
    render(<FileUpload {...defaultProps} disabled />);
    expect(screen.getByLabelText('Upload Files')).toBeDisabled();
  });

  it('renders previews when showPreview is true and file is image', async () => {
    render(<FileUpload {...defaultProps} showPreview accept='image/*' />);
    const input = screen.getByLabelText('Upload Files') as HTMLInputElement;

    triggerInputChange(createMockFile('a.png', 'image/png'), input);

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  it('removes file when clicking Supprimer button', async () => {
    const onFilesSelected = vi.fn();
    render(<FileUpload {...defaultProps} showPreview onFilesSelected={onFilesSelected} />);

    const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
    triggerInputChange(createMockFile('keep.png', 'image/png'), input);

    const removeButton = await screen.findByRole('button', { name: /supprimer/i });
    fireEvent.click(removeButton);

    expect(onFilesSelected).toHaveBeenCalledWith([]);
  });

  it('is accessible (input focusable)', () => {
    render(<FileUpload {...defaultProps} />);
    const input = screen.getByLabelText('Upload Files');
    input.focus();
    expect(document.activeElement).toBe(input);
  });
});
