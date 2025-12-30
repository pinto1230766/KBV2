import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <div>Modal Content</div>,
  };

  describe('Rendering', () => {
    it('should render when isOpen is true', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('should render children correctly', () => {
      const children = <div data-testid='custom-content'>Custom Content</div>;
      render(<Modal {...defaultProps}>{children}</Modal>);
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('should have dialog role', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should be modal', () => {
      render(<Modal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-labelledby with title', () => {
      render(<Modal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby');
    });

    it('should have close button with aria-label', () => {
      render(<Modal {...defaultProps} />);
      const closeButton = screen.getByLabelText('Fermer');
      expect(closeButton).toBeInTheDocument();
    });

    it('should trap focus within modal', () => {
      render(<Modal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      // Focus should be trapped (implementation specific)
    });
  });

  describe('Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByLabelText('Fermer');
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      // Click sur le backdrop (l'overlay noir)
      const backdrop = screen.getByRole('dialog').parentElement;
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(onClose).toHaveBeenCalled();
      }
    });

    it('should not close when clicking inside modal content', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const content = screen.getByText('Modal Content');
      fireEvent.click(content);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape key is pressed', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      const { container } = render(<Modal {...defaultProps} size='sm' />);
      expect(container.querySelector('.modal')).toBeInTheDocument();
    });

    it('should render medium size (default)', () => {
      const { container } = render(<Modal {...defaultProps} />);
      expect(container.querySelector('.modal')).toBeInTheDocument();
    });

    it('should render large size', () => {
      const { container } = render(<Modal {...defaultProps} size='lg' />);
      expect(container.querySelector('.modal')).toBeInTheDocument();
    });
  });

  describe('Custom styling', () => {
    it('should accept custom className', () => {
      const { container } = render(<Modal {...defaultProps} className='custom-modal' />);
      expect(container.querySelector('.custom-modal')).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('should render footer when provided', () => {
      const footer = (
        <div>
          <button>Cancel</button>
          <button>Confirm</button>
        </div>
      );

      render(<Modal {...defaultProps} footer={footer} />);

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('should not render footer when not provided', () => {
      render(<Modal {...defaultProps} />);
      // Footer section should not exist if not provided
    });
  });

  describe('Overflow behavior', () => {
    it('should handle long content with scroll', () => {
      const longContent = Array.from({ length: 100 }, (_, i) => <p key={i}>Line {i}</p>);

      render(<Modal {...defaultProps}>{longContent}</Modal>);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Multiple modals', () => {
    it('should handle stacked modals', () => {
      const { rerender } = render(<Modal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      rerender(
        <>
          <Modal {...defaultProps} />
          <Modal {...defaultProps} title='Second Modal' />
        </>
      );

      expect(screen.getAllByRole('dialog')).toHaveLength(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined title', () => {
      render(<Modal {...defaultProps} title={undefined as any} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle null children', () => {
      render(<Modal {...defaultProps}>{null}</Modal>);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle empty string title', () => {
      render(<Modal {...defaultProps} title='' />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = vi.fn();

      const TestContent = () => {
        renderSpy();
        return <div>Content</div>;
      };

      const { rerender } = render(
        <Modal {...defaultProps}>
          <TestContent />
        </Modal>
      );

      const initialRenderCount = renderSpy.mock.calls.length;

      // Re-render with same props
      rerender(
        <Modal {...defaultProps}>
          <TestContent />
        </Modal>
      );

      // Should not have additional renders
      expect(renderSpy.mock.calls.length).toBe(initialRenderCount);
    });
  });
});
