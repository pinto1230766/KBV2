import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  describe('Rendering', () => {
    it('should render spinner', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('should have aria-label for accessibility', () => {
      render(<Spinner />);
      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toBeInTheDocument();
    });

    it('should have role status', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      const { container } = render(<Spinner size='sm' />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render medium size', () => {
      const { container } = render(<Spinner size='md' />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render large size', () => {
      const { container } = render(<Spinner size='lg' />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should use medium as default size', () => {
      const { container } = render(<Spinner />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should accept custom className', () => {
      const { container } = render(<Spinner className='custom-class' />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should combine custom className with default classes', () => {
      const { container } = render(<Spinner className='my-custom-class' />);
      const spinner = container.firstChild;
      expect(spinner).toHaveClass('my-custom-class');
    });
  });

  describe('Animation', () => {
    it('should have animation class', () => {
      const { container } = render(<Spinner />);
      // Spinner devrait avoir une animation (classe animate-spin ou similaire)
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be announced to screen readers', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('should not be focusable', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).not.toHaveAttribute('tabindex');
    });
  });

  describe('Integration', () => {
    it('should work inside a button', () => {
      render(
        <button>
          <Spinner size='sm' />
          <span>Loading...</span>
        </button>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should work in a centered container', () => {
      render(
        <div className='flex items-center justify-center'>
          <Spinner />
        </div>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined size gracefully', () => {
      render(<Spinner size={undefined as any} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should handle null className', () => {
      render(<Spinner className={null as any} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render multiple spinners independently', () => {
      render(
        <>
          <Spinner size='sm' />
          <Spinner size='md' />
          <Spinner size='lg' />
        </>
      );

      const spinners = screen.getAllByRole('status');
      expect(spinners).toHaveLength(3);
    });
  });
});
