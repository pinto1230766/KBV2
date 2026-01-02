/**
 * Tests unitaires pour Button.tsx
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('rend le bouton avec le texte fourni', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /Click me/i })).toBeInTheDocument();
  });

  it('appelle la fonction onClick au clic', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /Click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("affiche l'icône à gauche quand leftIcon est fourni", () => {
    const TestIcon = () => <svg data-testid='test-icon' />;
    render(<Button leftIcon={<TestIcon />}>With Icon</Button>);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it("affiche l'icône à droite quand rightIcon est fourni", () => {
    const TestIcon = () => <svg data-testid='test-icon' />;
    render(<Button rightIcon={<TestIcon />}>With Icon</Button>);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applique les classes CSS de variante', () => {
    const { container } = render(<Button variant='secondary'>Secondary</Button>);

    expect(container.firstChild).toHaveClass('bg-gray-100', 'text-gray-700');
  });

  it('applique les classes CSS de taille', () => {
    const { container } = render(<Button size='sm'>Small</Button>);

    expect(container.firstChild).toHaveClass('h-8', 'px-3', 'text-sm');
  });

  it('applique la classe disabled', () => {
    const { container } = render(<Button disabled>Disabled</Button>);

    expect(container.firstChild).toBeDisabled();
    expect(container.firstChild).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('ne déclenche pas onClick quand disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button', { name: /Disabled/i });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('affiche le spinner de chargement', () => {
    render(<Button isLoading>Loading</Button>);

    expect(screen.getByRole('button')).toContainElement(
      screen.getByTestId('loading-spinner') || screen.getByText('Loading')
    );
  });

  it('applique les classes CSS personnalisées', () => {
    const { container } = render(<Button className='custom-class'>Custom</Button>);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('rend comme un élément enfant avec asChild', () => {
    const { container } = render(
      <Button asChild>
        <a href='/test'>Link Button</a>
      </Button>
    );

    expect(container.firstChild).toBeInstanceOf(HTMLAnchorElement);
    expect(container.firstChild).toHaveAttribute('href', '/test');
    expect(container.firstChild).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('gère les événements clavier', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Keyboard</Button>);

    const button = screen.getByRole('button', { name: /Keyboard/i });
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyUp(button, { key: 'Enter' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('gère les différentes variantes de bouton', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'ghost', 'link'];

    variants.forEach((variant) => {
      const { container } = render(<Button variant={variant as any}>Test</Button>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  it('gère les différentes tailles de bouton', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'];

    sizes.forEach((size) => {
      const { container } = render(<Button size={size as any}>Test</Button>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
