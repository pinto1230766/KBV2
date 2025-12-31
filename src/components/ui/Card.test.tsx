/**
 * Tests unitaires pour Card.tsx
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { Card, CardBody } from './Card';

describe('Card', () => {
  it('rend le composant Card', () => {
    render(
      <Card>
        <CardBody>Test content</CardBody>
      </Card>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applique les classes CSS de base', () => {
    const { container } = render(
      <Card>
        <CardBody>Test</CardBody>
      </Card>
    );

    expect(container.firstChild).toHaveClass('bg-white', 'rounded-lg', 'shadow');
  });

  it('accepte les classes CSS personnalisées', () => {
    const { container } = render(
      <Card className='custom-class'>
        <CardBody>Test</CardBody>
      </Card>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('rend le CardBody avec les bonnes classes', () => {
    const { container } = render(
      <Card>
        <CardBody>Test content</CardBody>
      </Card>
    );

    const cardBody = container.querySelector('.p-6');
    expect(cardBody).toBeInTheDocument();
    expect(cardBody).toHaveTextContent('Test content');
  });

  it('accepte les props CardBody', () => {
    render(
      <Card>
        <CardBody className='custom-body'>Custom body</CardBody>
      </Card>
    );

    expect(screen.getByText('Custom body')).toBeInTheDocument();
  });

  it('gère le onClick event', () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick}>
        <CardBody>Clickable card</CardBody>
      </Card>
    );

    const card = screen.getByText('Clickable card').closest('div');
    if (card) {
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('applique les classes dark mode', () => {
    const { container } = render(
      <Card>
        <CardBody>Dark mode test</CardBody>
      </Card>
    );

    expect(container.firstChild).toHaveClass('dark:bg-gray-800');
  });

  it('rend avec hover effect', () => {
    const { container } = render(
      <Card hoverable>
        <CardBody>Hoverable card</CardBody>
      </Card>
    );

    expect(container.firstChild).toHaveClass('hover:shadow-lg', 'transition-shadow');
  });
});

