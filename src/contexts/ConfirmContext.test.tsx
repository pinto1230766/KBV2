import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfirmProvider, useConfirm } from './ConfirmContext';

const TestComponent = () => {
  const { confirm } = useConfirm();

  const handleClick = async () => {
    const result = await confirm({
      title: 'Confirmation requise',
      message: 'Êtes-vous sûr de vouloir continuer?',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
    });

    if (result) {
      console.log('Confirmed');
    }
  };

  return <button onClick={handleClick}>Test Confirm</button>;
};

describe('ConfirmContext', () => {
  describe('ConfirmProvider', () => {
    it('should render children', () => {
      render(
        <ConfirmProvider>
          <div>Test Content</div>
        </ConfirmProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should provide confirm function', () => {
      render(
        <ConfirmProvider>
          <TestComponent />
        </ConfirmProvider>
      );

      expect(screen.getByText('Test Confirm')).toBeInTheDocument();
    });
  });

  describe('Confirm dialog', () => {
    it('should show confirmation dialog when confirm is called', async () => {
      render(
        <ConfirmProvider>
          <TestComponent />
        </ConfirmProvider>
      );

      const button = screen.getByText('Test Confirm');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Confirmation requise')).toBeInTheDocument();
        expect(screen.getByText('Êtes-vous sûr de vouloir continuer?')).toBeInTheDocument();
      });
    });

    it('should show confirm and cancel buttons', async () => {
      render(
        <ConfirmProvider>
          <TestComponent />
        </ConfirmProvider>
      );

      const button = screen.getByText('Test Confirm');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Confirmer')).toBeInTheDocument();
        expect(screen.getByText('Annuler')).toBeInTheDocument();
      });
    });

    it('should resolve true when confirm button is clicked', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      render(
        <ConfirmProvider>
          <TestComponent />
        </ConfirmProvider>
      );

      const button = screen.getByText('Test Confirm');
      fireEvent.click(button);

      await waitFor(() => {
        const confirmButton = screen.getByText('Confirmer');
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Confirmed');
      });
    });

    it('should resolve false when cancel button is clicked', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      render(
        <ConfirmProvider>
          <TestComponent />
        </ConfirmProvider>
      );

      const button = screen.getByText('Test Confirm');
      fireEvent.click(button);

      await waitFor(() => {
        const cancelButton = screen.getByText('Annuler');
        fireEvent.click(cancelButton);
      });

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should close dialog after confirmation', async () => {
      render(
        <ConfirmProvider>
          <TestComponent />
        </ConfirmProvider>
      );

      const button = screen.getByText('Test Confirm');
      fireEvent.click(button);

      await waitFor(() => {
        const confirmButton = screen.getByText('Confirmer');
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('Confirmation requise')).not.toBeInTheDocument();
      });
    });

    it('should close dialog after cancellation', async () => {
      render(
        <ConfirmProvider>
          <TestComponent />
        </ConfirmProvider>
      );

      const button = screen.getByText('Test Confirm');
      fireEvent.click(button);

      await waitFor(() => {
        const cancelButton = screen.getByText('Annuler');
        fireEvent.click(cancelButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('Confirmation requise')).not.toBeInTheDocument();
      });
    });
  });

  describe('Dialog accessibility', () => {
    it('should have dialog role', async () => {
      render(
        <ConfirmProvider>
          <TestComponent />
        </ConfirmProvider>
      );

      const button = screen.getByText('Test Confirm');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should be modal', async () => {
      render(
        <ConfirmProvider>
          <TestComponent />
        </ConfirmProvider>
      );

      const button = screen.getByText('Test Confirm');
      fireEvent.click(button);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
      });
    });

    it('should have proper labeling', async () => {
      render(
        <ConfirmProvider>
          <TestComponent />
        </ConfirmProvider>
      );

      const button = screen.getByText('Test Confirm');
      fireEvent.click(button);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-labelledby');
      });
    });
  });

  describe('Multiple confirmations', () => {
    it('should handle sequential confirmations', async () => {
      const TestMultiple = () => {
        const { confirm } = useConfirm();

        const handleMultiple = async () => {
          await confirm({ title: 'First', message: 'First confirmation' });
          await confirm({ title: 'Second', message: 'Second confirmation' });
        };

        return <button onClick={handleMultiple}>Multiple</button>;
      };

      render(
        <ConfirmProvider>
          <TestMultiple />
        </ConfirmProvider>
      );

      const button = screen.getByText('Multiple');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('First')).toBeInTheDocument();
      });
    });
  });

  describe('Custom options', () => {
    it('should accept custom button text', async () => {
      const TestCustom = () => {
        const { confirm } = useConfirm();

        const handleClick = async () => {
          await confirm({
            title: 'Delete',
            message: 'Delete this item?',
            confirmText: 'Yes, delete',
            cancelText: 'No, keep it',
          });
        };

        return <button onClick={handleClick}>Custom</button>;
      };

      render(
        <ConfirmProvider>
          <TestCustom />
        </ConfirmProvider>
      );

      const button = screen.getByText('Custom');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Yes, delete')).toBeInTheDocument();
        expect(screen.getByText('No, keep it')).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty message', async () => {
      const TestEmpty = () => {
        const { confirm } = useConfirm();

        const handleClick = async () => {
          await confirm({
            title: 'Empty',
            message: '',
          });
        };

        return <button onClick={handleClick}>Empty</button>;
      };

      render(
        <ConfirmProvider>
          <TestEmpty />
        </ConfirmProvider>
      );

      const button = screen.getByText('Empty');
      fireEvent.click(button);

      const dialog = await screen.findByRole('dialog');
      expect(dialog).toBeInTheDocument();
      fireEvent.click(screen.getByText('Confirmer'));
    });

    it('should handle very long message', async () => {
      const longMessage = 'x'.repeat(1000);

      const TestLong = () => {
        const { confirm } = useConfirm();

        const handleClick = async () => {
          await confirm({
            title: 'Long',
            message: longMessage,
          });
        };

        return <button onClick={handleClick}>Long</button>;
      };

      render(
        <ConfirmProvider>
          <TestLong />
        </ConfirmProvider>
      );

      const button = screen.getByText('Long');
      fireEvent.click(button);

      const dialog = await screen.findByRole('dialog');
      expect(dialog).toBeInTheDocument();
      fireEvent.click(screen.getByText('Confirmer'));
    });
  });
});
