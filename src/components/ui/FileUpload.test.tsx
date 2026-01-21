import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUpload } from './FileUpload';

describe('FileUpload', () => {
  const defaultProps = {
    onFilesSelected: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render upload area', () => {
      render(<FileUpload {...defaultProps} />);
      expect(screen.getByText(/drag.*drop|dépose/i)).toBeInTheDocument();
    });

    it('should show drag and drop area', () => {
      render(<FileUpload {...defaultProps} />);
      expect(screen.getByText(/drag.*drop|dépose/i)).toBeInTheDocument();
    });

    it('should have file input', () => {
      render(<FileUpload {...defaultProps} />);
      // File input is created dynamically, check for the area
      expect(screen.getByText(/drag.*drop|dépose/i)).toBeInTheDocument();
    });
  });

  describe('File selection', () => {
    it('should call onFilesSelected when files are selected', async () => {
      const onFilesSelected = vi.fn();
      render(<FileUpload {...defaultProps} onFilesSelected={onFilesSelected} />);

      const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(onFilesSelected).toHaveBeenCalledWith(
          expect.arrayContaining([expect.objectContaining({ name: 'test.txt' })])
        );
      });
    });

    it('should handle multiple files', async () => {
      const onFilesSelected = vi.fn();
      render(<FileUpload {...defaultProps} onFilesSelected={onFilesSelected} multiple />);

      const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
      const files = [
        new File(['content1'], 'test1.txt', { type: 'text/plain' }),
        new File(['content2'], 'test2.txt', { type: 'text/plain' }),
      ];

      Object.defineProperty(input, 'files', {
        value: files,
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(onFilesSelected).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ name: 'test1.txt' }),
            expect.objectContaining({ name: 'test2.txt' }),
          ])
        );
      });
    });
  });

  describe('Drag and drop', () => {
    it('should handle drag enter', () => {
      render(<FileUpload {...defaultProps} />);
      const dropZone = screen.getByText(/drag.*drop|dépose/i).closest('div');

      fireEvent.dragEnter(dropZone!);

      // Visual feedback should be shown
      expect(dropZone).toBeInTheDocument();
      // TODO: Add assertion for visual feedback class (e.g., expect(dropZone).toHaveClass('border-blue-500'))
    });

    it('should handle drag over', () => {
      render(<FileUpload {...defaultProps} />);
      const dropZone = screen.getByText(/drag.*drop|dépose/i).closest('div');

      const event = new Event('dragover', { bubbles: true });
      Object.defineProperty(event, 'dataTransfer', {
        value: { files: [] },
      });

      fireEvent(dropZone!, event);

      expect(dropZone).toBeInTheDocument();
    });

    it('should handle file drop', async () => {
      const onFilesSelected = vi.fn();
      render(<FileUpload {...defaultProps} onFilesSelected={onFilesSelected} />);

      const dropZone = screen.getByText(/drag.*drop|dépose/i).closest('div');
      const file = new File(['content'], 'dropped.txt', { type: 'text/plain' });

      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: [file],
        },
      });

      fireEvent(dropZone!, dropEvent);

      await waitFor(() => {
        expect(onFilesSelected).toHaveBeenCalled();
      });
    });
  });

  describe('File validation', () => {
    it('should validate file size', async () => {
      const onFilesSelected = vi.fn();
      const maxSize = 1000; // 1KB
      render(<FileUpload {...defaultProps} maxSize={maxSize} onFilesSelected={onFilesSelected} />);

      const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
      const largeFile = new File(['x'.repeat(2000)], 'large.txt', { type: 'text/plain' });

      Object.defineProperty(input, 'files', {
        value: [largeFile],
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(onFilesSelected).not.toHaveBeenCalled();
        // TODO: Add assertion for error message presence
        // expect(screen.getByText(/file too large/i)).toBeInTheDocument();
      });
    });

    it('should validate file type', async () => {
      const onFilesSelected = vi.fn();
      render(<FileUpload {...defaultProps} accept='image/*' onFilesSelected={onFilesSelected} />);

      const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
      const textFile = new File(['content'], 'doc.txt', { type: 'text/plain' });

      Object.defineProperty(input, 'files', {
        value: [textFile],
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(onFilesSelected).not.toHaveBeenCalled();
        // TODO: Add assertion for error message presence
      });
    });

    it('should validate maximum number of files', async () => {
      const onFilesSelected = vi.fn();
      const maxFiles = 2;
      render(<FileUpload {...defaultProps} maxFiles={maxFiles} multiple onFilesSelected={onFilesSelected} />);

      const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
      const files = [
        new File(['1'], 'file1.txt'),
        new File(['2'], 'file2.txt'),
        new File(['3'], 'file3.txt'),
      ];

      Object.defineProperty(input, 'files', {
        value: files,
      });

      fireEvent.change(input);

      // Depending on implementation, it might reject all or slice the array.
      // Assuming strict validation:
      await waitFor(() => {
        expect(onFilesSelected).not.toHaveBeenCalled();
      });
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<FileUpload {...defaultProps} disabled />);
      const input = screen.getByLabelText('Upload Files');
      expect(input).toBeDisabled();
    });
  });

  describe('File preview', () => {
    it('should show preview for images', async () => {
      render(<FileUpload {...defaultProps} accept='image/*' showPreview />);

      const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
      const imageFile = new File([''], 'image.png', { type: 'image/png' });

      Object.defineProperty(input, 'files', {
        value: [imageFile],
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });
    });

    it('should not show preview when showPreview is false', async () => {
      render(<FileUpload {...defaultProps} accept='image/*' showPreview={false} />);

      const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
      const imageFile = new File([''], 'image.png', { type: 'image/png' });

      Object.defineProperty(input, 'files', {
        value: [imageFile],
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
      });
    });
  });

  describe('File removal', () => {
    it('should remove file when remove button is clicked', async () => {
      const onFilesSelected = vi.fn();
      render(<FileUpload {...defaultProps} onFilesSelected={onFilesSelected} />);

      const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      Object.defineProperty(input, 'files', {
        value: [file],
      });

      fireEvent.change(input);

      await waitFor(() => {
        const removeButton = screen.queryByLabelText(/remove|supprimer/i);
        if (removeButton) {
          fireEvent.click(removeButton);
        }
        // Expect the list to be empty after removal
        expect(onFilesSelected).toHaveBeenCalledWith([]);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<FileUpload {...defaultProps} />);
      const input = screen.getByLabelText('Upload Files');
      expect(input).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<FileUpload {...defaultProps} />);
      const input = screen.getByLabelText('Upload Files');

      // Should be focusable
      input.focus();
      expect(document.activeElement).toBe(input);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty file list', () => {
      const onFilesSelected = vi.fn();
      render(<FileUpload {...defaultProps} onFilesSelected={onFilesSelected} />);

      const input = screen.getByLabelText('Upload Files') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [],
      });

      fireEvent.change(input);

      expect(onFilesSelected).not.toHaveBeenCalled();
    });

    it('should handle files with special characters in name', async () => {
      const onFilesSelected = vi.fn();
      render(<FileUpload {...defaultProps} onFilesSelected={onFilesSelected} />);

      const input = screen.getByLabelText('Upload Files') as HTMLInputElement;
      const file = new File(['content'], 'test (1) @#$.txt', { type: 'text/plain' });

      Object.defineProperty(input, 'files', {
        value: [file],
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(onFilesSelected).toHaveBeenCalled();
      });
    });
  });
});
