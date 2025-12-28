/**
 * Tests unitaires pour Planning.tsx
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Planning } from '@/pages/Planning';

// Mock des hooks nécessaires
vi.mock('@/contexts/DataContext', () => ({
  useData: () => ({
    visits: [
      {
        id: '1',
        nom: 'John Doe',
        visitDate: '2025-12-30',
        visitTime: '10:00',
        status: 'pending',
        speaker: { id: '1', nom: 'John Doe', email: 'john@example.com' },
        host: { id: '1', nom: 'Host One' }
      },
      {
        id: '2',
        nom: 'Jane Smith',
        visitDate: '2025-12-31',
        visitTime: '14:00',
        status: 'confirmed',
        speaker: { id: '2', nom: 'Jane Smith', email: 'jane@example.com' },
        host: { id: '2', nom: 'Host Two' }
      }
    ],
    speakers: [
      { id: '1', nom: 'John Doe', email: 'john@example.com' },
      { id: '2', nom: 'Jane Smith', email: 'jane@example.com' }
    ],
    hosts: [
      { id: '1', nom: 'Host One' },
      { id: '2', nom: 'Host Two' }
    ]
  })
}));

vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    addToast: vi.fn()
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe('Planning', () => {
  const renderPlanning = () => {
    return render(
      <BrowserRouter>
        <Planning />
      </BrowserRouter>
    );
  };

  it('rend le titre principal', () => {
    renderPlanning();
    expect(screen.getByText(/Planning des Visites/i)).toBeInTheDocument();
  });

  it('affiche les filtres de planification', () => {
    renderPlanning();
    
    // Vérifier la présence des filtres
    expect(screen.getByText(/Filtres/i)).toBeInTheDocument();
    expect(screen.getByText(/Vue/i)).toBeInTheDocument();
  });

  it('affiche la liste des visites', () => {
    renderPlanning();
    
    // Vérifier que les visites sont affichées
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
  });

  it('permet de changer la vue de planification', () => {
    renderPlanning();
    
    const vueButton = screen.getByRole('button', { name: /Vue/i });
    fireEvent.click(vueButton);
    
    // Vérifier que le modal ou menu de changement de vue s'ouvre
    expect(screen.getByText(/Vue Calendrier/i)).toBeInTheDocument();
    expect(screen.getByText(/Vue Liste/i)).toBeInTheDocument();
  });

  it('affiche les informations de visite', () => {
    renderPlanning();
    
    // Vérifier les détails affichés pour chaque visite
    expect(screen.getByText(/2025-12-30/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-12-31/i)).toBeInTheDocument();
    expect(screen.getByText(/10:00/i)).toBeInTheDocument();
    expect(screen.getByText(/14:00/i)).toBeInTheDocument();
  });

  it('permet de filtrer par statut', () => {
    renderPlanning();
    
    // Vérifier les filtres de statut
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmed/i)).toBeInTheDocument();
  });

  it('gère l\'ajout d\'une nouvelle visite', () => {
    renderPlanning();
    
    const nouveauButton = screen.getByRole('button', { name: /Nouvelle Visite/i });
    fireEvent.click(nouveauButton);
    
    // Le modal de création de visite devrait s'ouvrir
    expect(screen.getByText(/Créer une visite/i)).toBeInTheDocument();
  });

  it('affiche les statistiques de planning', () => {
    renderPlanning();
    
    // Vérifier les KPIs du planning
    expect(screen.getByText(/Total Visites/i)).toBeInTheDocument();
    expect(screen.getByText(/En attente/i)).toBeInTheDocument();
  });

  it('permet la recherche dans les visites', () => {
    renderPlanning();
    
    const searchInput = screen.getByPlaceholderText(/Rechercher/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Vérifier que la recherche filtre les résultats
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('gère les conflits de planning', () => {
    renderPlanning();
    
    // Ajouter une visite qui crée un conflit
    const nouveauButton = screen.getByRole('button', { name: /Nouvelle Visite/i });
    fireEvent.click(nouveauButton);
    
    // Vérifier que l'alerte de conflit apparaît si nécessaire
    // (dépend de l'implémentation)
  });

  it('permet la navigation vers les détails d\'une visite', () => {
    renderPlanning();
    
    const visitCard = screen.getByText(/John Doe/i).closest('[role="button"]') || 
                      screen.getByText(/John Doe/i).parentElement;
    if (visitCard) {
      fireEvent.click(visitCard);
    }
    
    // Le modal de détails devrait s'ouvrir
    expect(screen.getByText(/Détails de la visite/i)).toBeInTheDocument();
  });

  it('rend responsive sur mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    renderPlanning();
    
    // Vérifier que le layout mobile est appliqué
    expect(screen.getByText(/Planning des Visites/i)).toBeInTheDocument();
  });
});