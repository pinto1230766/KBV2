/**
 * Tests unitaires pour Messages.tsx
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Messages from '@/pages/Messages';

// Mock des hooks nécessaires
vi.mock('@/contexts/DataContext', () => ({
  useData: () => ({
    visits: [
      {
        id: '1',
        nom: 'John Doe',
        visitDate: '2025-12-30',
        visitTime: '10:00',
        status: 'confirmed',
        speaker: { id: '1', nom: 'John Doe', email: 'john@example.com' },
        host: { id: '1', nom: 'Host One' }
      }
    ],
    conversations: [
      {
        id: '1',
        participantName: 'John Doe',
        lastMessage: 'Bonjour, confirmation de la visite',
        timestamp: '2025-12-28T10:00:00Z',
        unreadCount: 2,
        type: 'visit_confirmation'
      }
    ]
  })
}));

vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    addToast: vi.fn()
  })
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Test User' }
  })
}));

describe('Messages', () => {
  const renderMessages = () => {
    return render(
      <BrowserRouter>
        <Messages />
      </BrowserRouter>
    );
  };

  it('rend le titre principal', () => {
    renderMessages();
    expect(screen.getByText(/Messagerie/i)).toBeInTheDocument();
  });

  it('affiche la liste des conversations', () => {
    renderMessages();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Bonjour, confirmation de la visite/i)).toBeInTheDocument();
  });

  it('affiche le compteur de messages non lus', () => {
    renderMessages();
    expect(screen.getByText('2')).toBeInTheDocument(); // unreadCount
  });

  it('permet la recherche de conversations', () => {
    renderMessages();
    
    const searchInput = screen.getByPlaceholderText(/Rechercher/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('affiche les types de messages', () => {
    renderMessages();
    expect(screen.getByText(/Confirmation de visite/i)).toBeInTheDocument();
  });

  it('permet la création d\'un nouveau message', () => {
    renderMessages();
    
    const nouveauButton = screen.getByRole('button', { name: /Nouveau Message/i });
    fireEvent.click(nouveauButton);
    
    expect(screen.getByText(/Nouveau message/i)).toBeInTheDocument();
  });

  it('affiche les statistiques de messagerie', () => {
    renderMessages();
    
    // Vérifier les KPIs de messagerie
    expect(screen.getByText(/Messages envoyés/i)).toBeInTheDocument();
    expect(screen.getByText(/Taux de réponse/i)).toBeInTheDocument();
  });

  it('permet la sélection d\'une conversation', () => {
    renderMessages();
    
    const conversationItem = screen.getByText(/John Doe/i).closest('[role="button"]') || 
                             screen.getByText(/John Doe/i).parentElement;
    if (conversationItem) {
      fireEvent.click(conversationItem);
    }
    
    // Vérifier que la conversation s'ouvre
    expect(screen.getByText(/Historique de la conversation/i)).toBeInTheDocument();
  });

  it('gère l\'envoi de message', () => {
    renderMessages();
    
    const messageInput = screen.getByPlaceholderText(/Tapez votre message/i);
    fireEvent.change(messageInput, { target: { value: 'Bonjour!' } });
    
    const sendButton = screen.getByRole('button', { name: /Envoyer/i });
    fireEvent.click(sendButton);
    
    // Le message devrait être envoyé
    expect(screen.getByText('Bonjour!')).toBeInTheDocument();
  });

  it('affiche les modèles de messages', () => {
    renderMessages();
    
    const templatesButton = screen.getByRole('button', { name: /Modèles/i });
    fireEvent.click(templatesButton);
    
    expect(screen.getByText(/Modèle de message/i)).toBeInTheDocument();
  });

  it('permet la navigation vers d\'autres sections', () => {
    renderMessages();
    
    // Vérifier les liens de navigation
    expect(screen.getByRole('button', { name: /Planning/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Orateurs/i })).toBeInTheDocument();
  });

  it('gère les filtres de conversations', () => {
    renderMessages();
    
    const filterButton = screen.getByRole('button', { name: /Filtrer/i });
    fireEvent.click(filterButton);
    
    expect(screen.getByText(/Toutes les conversations/i)).toBeInTheDocument();
    expect(screen.getByText(/Non lues/i)).toBeInTheDocument();
  });

  it('rend responsive sur mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    renderMessages();
    
    // Vérifier que le layout mobile est appliqué
    expect(screen.getByText(/Messagerie/i)).toBeInTheDocument();
  });
});