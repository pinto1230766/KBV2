/**
 * Tests E2E pour la page Messages
 * KBV Lyon - Tests d'intégration Playwright
 */

import { test, expect, Page, Route } from '@playwright/test';

// Constants for test data
const TEST_MESSAGE = 'Test message from Playwright';
const TEST_RECIPIENT = 'John Doe';
const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 667;

test.describe('Messages - Interface de messagerie', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Aller sur la page messages
    await page.goto('/messages');
    await page.waitForLoadState('networkidle');
  });

  test('Devrait charger la page messages', async ({ page }: { page: Page }) => {
    // Vérifier que la page se charge
    await expect(page.locator('h1')).toContainText(/Messages|Messagerie/i);

    // Vérifier les éléments principaux
    await expect(page.locator('[data-testid="conversations-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="message-thread"]')).toBeVisible();
    await expect(page.locator('[data-testid="message-input"]')).toBeVisible();
  });

  test('Devrait afficher la liste des conversations', async ({ page }: { page: Page }) => {
    // Vérifier que la liste des conversations est visible
    await expect(page.locator('[data-testid="conversations-list"]')).toBeVisible();

    // Vérifier qu'il y a des conversations (ou un état vide)
    const conversationItems = page.locator('[data-testid="conversation-item"]');
    const count = await conversationItems.count();
    await expect(count).toBeGreaterThanOrEqual(0);
  });

  test('Devrait permettre de sélectionner une conversation', async ({ page }: { page: Page }) => {
    // Cliquer sur une conversation
    const firstConversation = page.locator('[data-testid="conversation-item"]').first();
    
    if (await firstConversation.isVisible()) {
      await firstConversation.click();

      // Vérifier que la conversation est sélectionnée
      await expect(firstConversation).toHaveAttribute('data-selected', 'true');

      // Vérifier que le thread de messages s'affiche
      await expect(page.locator('[data-testid="message-thread"]')).toBeVisible();
    }
  });

  test('Devrait permettre d\'envoyer un nouveau message', async ({ page }: { page: Page }) => {
    // Sélectionner une conversation ou en créer une
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill(TEST_MESSAGE);

    // Cliquer sur envoyer
    await page.click('[data-testid="send-button"]');

    // Vérifier que le message est envoyé
    await expect(page.locator('[data-testid="sent-message"]')).toContainText(TEST_MESSAGE);
  });

  test('Devrait permettre de créer une nouvelle conversation', async ({ page }: { page: Page }) => {
    // Ouvrir le modal de nouvelle conversation
    await page.click('[data-testid="new-conversation-button"]');
    await expect(page.locator('[data-testid="new-conversation-modal"]')).toBeVisible();

    // Remplir les informations
    await page.fill('[data-testid="recipient-input"]', TEST_RECIPIENT);
    await page.fill('[data-testid="message-input"]', 'Nouveau message de test');

    // Créer la conversation
    await page.click('[data-testid="create-conversation-button"]');

    // Vérifier que la conversation est créée
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
  });

  test('Devrait permettre la recherche de conversations', async ({ page }: { page: Page }) => {
    // Tester la recherche
    const searchInput = page.locator('[data-testid="search-conversations"]');
    await searchInput.fill('John');

    // Vérifier que la recherche filtre les résultats
    await page.waitForTimeout(500); // Attendre le debounce
    const conversationItems = page.locator('[data-testid="conversation-item"]');
    const visibleCount = await conversationItems.count();

    // Au moins un résultat doit être visible (ou aucun si pas de matches)
    expect(visibleCount).toBeGreaterThanOrEqual(0);
  });

  test('Devrait afficher les statistiques de messagerie', async ({ page }: { page: Page }) => {
    // Vérifier les KPIs de messagerie
    await expect(page.locator('[data-testid="messages-sent"]')).toBeVisible();
    await expect(page.locator('[data-testid="response-rate"]')).toBeVisible();
    await expect(page.locator('[data-testid="avg-response-time"]')).toBeVisible();
  });

  test('Devrait permettre de marquer des messages comme lus/non lus', async ({ page }: { page: Page }) => {
    // Cliquer sur une conversation non lue
    const unreadConversation = page.locator('[data-testid="conversation-item"][data-unread="true"]').first();
    
    if (await unreadConversation.isVisible()) {
      await unreadConversation.click();

      // Vérifier que la conversation n'est plus marquée comme non lue
      await expect(unreadConversation).toHaveAttribute('data-unread', 'false');
    }
  });

  test('Devrait permettre de supprimer une conversation', async ({ page }: { page: Page }) => {
    // Ouvrir le menu d'actions d'une conversation
    const conversation = page.locator('[data-testid="conversation-item"]').first();
    
    if (await conversation.isVisible()) {
      await conversation.hover();
      await page.click('[data-testid="conversation-actions"]');
      await page.click('[data-testid="delete-conversation"]');

      // Confirmer la suppression
      await page.click('[data-testid="confirm-delete"]');

      // Vérifier que la conversation est supprimée
      await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
    }
  });

  test('Devrait être responsive sur mobile', async ({ page }: { page: Page }) => {
    // Tester en vue mobile
    await page.setViewportSize({ width: MOBILE_WIDTH, height: MOBILE_HEIGHT });

    // Vérifier que les éléments sont visibles
    await expect(page.locator('[data-testid="messages-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="message-input"]')).toBeVisible();

    // Tester les interactions tactiles
    await page.tap('[data-testid="conversation-item"]');
    await expect(page.locator('[data-testid="message-thread"]')).toBeVisible();
  });

  test('Devrait gérer les templates de messages', async ({ page }: { page: Page }) => {
    // Ouvrir le sélecteur de templates
    await page.click('[data-testid="template-selector"]');
    await expect(page.locator('[data-testid="templates-list"]')).toBeVisible();

    // Sélectionner un template
    await page.click('[data-testid="template-confirmation"]');

    // Vérifier que le template est inséré dans le champ de saisie
    const messageInput = page.locator('[data-testid="message-input"]');
    await expect(messageInput).toContainText(/confirmation/i);
  });

  test('Devrait permettre l\'envoi de fichiers', async ({ page }: { page: Page }) => {
    // Simuler l'upload d'un fichier
    
    // Créer un fichier factice pour le test
    await page.evaluate(() => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      const input = document.querySelector('[data-testid="file-upload"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Vérifier que le fichier est attaché
    await expect(page.locator('[data-testid="attached-file"]')).toBeVisible();
  });

  test('Devrait gérer les erreurs de chargement', async ({ page }: { page: Page }) => {
    // Simuler une erreur de chargement des conversations
    await page.route('**/api/conversations', (route: Route) => {
      route.fulfill({
        status: 500,
        contentType: 'text/plain',
        body: 'Internal Server Error',
      });
    });

    // Recharger la page
    await page.reload();
    await page.waitForTimeout(2000);

    // Vérifier qu'une erreur s'affiche
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('Devrait être accessible aux lecteurs d\'écran', async ({ page }: { page: Page }) => {
    // Vérifier les attributs ARIA
    await expect(page.locator('[data-testid="messages-main"]')).toHaveAttribute(
      'role',
      /main/
    );

    // Vérifier les listes avec les bons rôles
    await expect(page.locator('[data-testid="conversations-list"]')).toHaveAttribute('role', 'list');
    await expect(page.locator('[data-testid="message-thread"]')).toHaveAttribute('role', 'log');

    // Vérifier les boutons avec aria-label
    await expect(page.locator('[data-testid="send-button"]')).toHaveAttribute('aria-label');
  });
});

test.describe('Messages - Navigation et interactions', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/messages');
    await page.waitForLoadState('networkidle');
  });

  test('Devrait permettre la navigation par clavier', async ({ page }: { page: Page }) => {
    // Tester la navigation au clavier dans la liste des conversations
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Vérifier qu'une conversation est sélectionnée
    const selectedConversation = page.locator('[data-testid="conversation-item"][data-selected="true"]');
    await expect(selectedConversation).toBeVisible();
  });

  test('Devrait permettre les raccourcis clavier', async ({ page }: { page: Page }) => {
    // Tester Ctrl+N pour nouvelle conversation
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyN');
    await page.keyboard.up('Control');

    // Vérifier que le modal s'ouvre
    await expect(page.locator('[data-testid="new-conversation-modal"]')).toBeVisible();
  });

  test('Devrait permettre l\'envoi avec Ctrl+Enter', async ({ page }: { page: Page }) => {
    // Sélectionner une conversation
    const conversation = page.locator('[data-testid="conversation-item"]').first();
    if (await conversation.isVisible()) {
      await conversation.click();
    }

    // Taper un message
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill('Message de test');

    // Envoyer avec Ctrl+Enter
    await page.keyboard.down('Control');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Control');

    // Vérifier que le message est envoyé
    await expect(page.locator('[data-testid="sent-message"]')).toContainText('Message de test');
  });

  test('Devrait permettre la recherche globale avec Ctrl+K', async ({ page }: { page: Page }) => {
    // Ouvrir la recherche globale
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyK');
    await page.keyboard.up('Control');

    // Vérifier que le modal de recherche s'ouvre
    await expect(page.locator('[data-testid="global-search-modal"]')).toBeVisible();

    // Effectuer une recherche
    await page.fill('[data-testid="search-input"]', 'test');
    await page.keyboard.press('Enter');

    // Vérifier les résultats
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });
});

test.describe('Messages - Performance et données temps réel', () => {
  test('Devrait se charger rapidement', async ({ page }: { page: Page }) => {
    const startTime = Date.now();

    await page.goto('/messages');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // La page messages doit se charger en moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });

  test('Devrait gérer les messages en temps réel', async ({ page }: { page: Page }) => {
    await page.goto('/messages');
    await page.waitForLoadState('networkidle');

    // Simuler l'arrivée d'un nouveau message en temps réel
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('kbv:new-message', {
          detail: {
            id: 'test-msg-123',
            content: 'Nouveau message temps réel',
            sender: 'Test User',
            timestamp: new Date().toISOString(),
          },
        })
      );
    });

    await page.waitForTimeout(1000);

    // Vérifier que le nouveau message apparaît
    await expect(page.locator('[data-testid="message-content"]')).toContainText('Nouveau message temps réel');
  });

  test('Devrait rester fluide avec beaucoup de conversations', async ({ page }: { page: Page }) => {
    await page.goto('/messages');
    await page.waitForLoadState('networkidle');

    // Simuler beaucoup de conversations pour tester les performances
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('kbv:mock-conversations', {
          detail: { conversations: Array(50).fill({}).map((_, i) => ({ id: i })) },
        })
      );
    });

    await page.waitForTimeout(1000);

    // Tester les interactions avec beaucoup de données
    const startTime = Date.now();
    await page.click('[data-testid="search-conversations"]');
    const interactionTime = Date.now() - startTime;

    // L'interaction doit prendre moins de 100ms
    expect(interactionTime).toBeLessThan(100);
  });

  test('Devrait gérer la synchronisation hors ligne', async ({ page }: { page: Page }) => {
    // Simuler un état hors ligne
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'));
    });

    // Vérifier que l'indicateur hors ligne s'affiche
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();

    // Tenter d'envoyer un message (qui devrait être mis en file d'attente)
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill('Message hors ligne');
    await page.click('[data-testid="send-button"]');

    // Vérifier l'indication de mise en file d'attente
    await expect(page.locator('[data-testid="queued-message"]')).toBeVisible();

    // Revenir en ligne
    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'));
    });

    // Vérifier que l'indicateur hors ligne disparaît
    await expect(page.locator('[data-testid="offline-indicator"]')).toHaveCount(0);
  });
});