/**
 * Tests unitaires pour Dashboard.tsx
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';

describe('Dashboard', () => {
  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  it('rend le titre principal', () => {
    renderDashboard();
    expect(screen.getByText(/Tableau de bord/i)).toBeInTheDocument();
  });

  it('affiche les KPIs principaux', () => {
    renderDashboard();

    // Vérifier la présence des KPIs
    expect(screen.getByText(/Total Visites/i)).toBeInTheDocument();
    expect(screen.getByText(/Taux de Succès/i)).toBeInTheDocument();
    expect(screen.getByText(/Visites ce Mois/i)).toBeInTheDocument();
  });

  it('rend les composants de navigation', () => {
    renderDashboard();

    // Vérifier les boutons de navigation
    expect(screen.getByRole('button', { name: /Planning/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Messages/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Orateurs/i })).toBeInTheDocument();
  });

  it('permet la navigation vers Planning', () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    renderDashboard();

    const planningButton = screen.getByRole('button', { name: /Planning/i });
    fireEvent.click(planningButton);

    expect(mockNavigate).toHaveBeenCalledWith('/planning');
  });

  it('affiche les statistiques avancées', () => {
    renderDashboard();
    expect(screen.getByText(/Statistiques Avancées/i)).toBeInTheDocument();
  });

  it('gère les états de chargement', () => {
    renderDashboard();

    // Vérifier qu'il n'y a pas d'erreur de chargement
    expect(screen.queryByText(/Erreur de chargement/i)).not.toBeInTheDocument();
  });

  it('rend responsive sur mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    renderDashboard();

    // Vérifier les classes CSS mobile
    const dashboardElement = screen.getByText(/Tableau de bord/i).closest('div');
    expect(dashboardElement).toHaveClass('mobile-layout');
  });
});

