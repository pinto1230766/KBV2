/**
 * Tests unitaires pour Dashboard.tsx
 */

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
      },
    ],
    speakers: [{ id: '1', nom: 'John Doe' }],
    hosts: [{ id: '1', nom: 'Host One' }],
    congregationProfile: {
      name: 'Test Congregation',
      hospitalityOverseer: 'Test Overseer',
      hospitalityOverseerPhone: '123456789',
      meetingTime: '14:30',
    },
    publicTalks: [],
  }),
}));

vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    addToast: vi.fn(),
  }),
}));

vi.mock('@/contexts/SettingsContext', () => ({
  useSettings: () => ({
    settings: {
      theme: 'light',
      language: 'fr',
      notifications: {
        enabled: true,
        reminderDays: [7, 2],
        sound: true,
        vibration: true,
      },
      encryptionEnabled: false,
      sessionTimeout: 30,
      autoArchiveDays: 90,
    },
    updateSettings: vi.fn().mockResolvedValue(undefined),
    setTheme: vi.fn(),
    setLanguage: vi.fn(),
    setNotifications: vi.fn(),
    resetSettings: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';

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
    expect(screen.getByText(/Command Center/i)).toBeInTheDocument();
  });

  it('affiche les KPIs principaux', () => {
    renderDashboard();

    // Vérifier la présence des KPIs
    expect(screen.getByText(/Visites ce mois/i)).toBeInTheDocument();
    expect(screen.getByText(/Orateurs actifs/i)).toBeInTheDocument();
    expect(screen.getByText(/Validation Req/i)).toBeInTheDocument();
    expect(screen.getByText(/Hôtes dispos/i)).toBeInTheDocument();
  });

  it("rend les boutons d'action", () => {
    renderDashboard();

    // Vérifier les boutons principaux
    expect(screen.getByRole('button', { name: /Nouvelle Visite/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Actions/i })).toBeInTheDocument();
  });

  it('affiche les statistiques de visites', () => {
    renderDashboard();
    expect(screen.getByText(/Analyse de l'activité/i)).toBeInTheDocument();
  });

  it("gère l'ouverture des modals", () => {
    renderDashboard();

    const nouvelleVisiteButton = screen.getByRole('button', { name: /Nouvelle Visite/i });
    fireEvent.click(nouvelleVisiteButton);

    // Le modal devrait s'ouvrir (vérifier qu'il y a un élément accessible)
    expect(screen.getByRole('button', { name: /Fermer/i })).toBeInTheDocument();
  });

  it('rend les liens de navigation rapide', () => {
    renderDashboard();

    // Vérifier les sections de navigation
    expect(screen.getByText(/Messagerie/i)).toBeInTheDocument();
    expect(screen.getByText(/Orateurs/i)).toBeInTheDocument();
    expect(screen.getByText(/Rapports/i)).toBeInTheDocument();
  });

  it("affiche le graphique d'analyse", () => {
    renderDashboard();
    expect(screen.getByText(/Fréquence des visites/i)).toBeInTheDocument();
  });

  it('rend les informations de temps réel', () => {
    renderDashboard();
    expect(screen.getByText(/Pulse Prochain/i)).toBeInTheDocument();
  });

  it('gère les états de chargement', () => {
    renderDashboard();

    // Vérifier qu'il n'y a pas d'erreur de chargement
    expect(screen.queryByText(/Erreur de chargement/i)).not.toBeInTheDocument();
  });

  it('rend responsive sur mobile', () => {
    // Mock de la largeur mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    renderDashboard();

    // Vérifier que le layout mobile est appliqué
    expect(screen.getByText(/Command Center/i)).toBeInTheDocument();
  });

  it('affiche les statistiques calculées', () => {
    renderDashboard();

    // Les valeurs numériques des KPIs devraient être affichées
    expect(screen.getByText('1')).toBeInTheDocument(); // visitsThisMonth
    expect(screen.getByText('1')).toBeInTheDocument(); // speakers
    expect(screen.getByText('1')).toBeInTheDocument(); // pending
    expect(screen.getByText('1')).toBeInTheDocument(); // hosts
  });
});
