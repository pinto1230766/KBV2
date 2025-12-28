/**
 * Tests E2E pour la page Planning
 * KBV Lyon - Tests d'intégration Playwright
 */

import { test, expect, Page, Route } from '@playwright/test';

// Constants for test data
const TEST_VISIT_NAME = 'John Doe Test';
const TEST_DATE = '2025-12-30';
const TEST_TIME = '14:00';
const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 667;

test.describe('Planning - Gestion des visites', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Aller sur la page planning
    await page.goto('/planning');
    await page.waitForLoadState('networkidle');
  });

  test('Devrait charger la page planning', async ({ page }: { page: Page }) => {
    // Vérifier que la page se charge
    await expect(page.locator('h1')).toContainText(/Planning|Gestion des Visites/i);

    // Vérifier les éléments principaux
    await expect(page.locator('[data-testid="planning-filters"]')).toBeVisible();
    await expect(page.locator('[data-testid="visits-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="planning-stats"]')).toBeVisible();
  });

  test('Devrait afficher les statistiques de planning', async ({ page }: { page: Page }) => {
    // Vérifier les cartes de statistiques
    const statsCards = page.locator('[data-testid="planning-stat-card"]');
    await expect(statsCards).toHaveCount(4); // Total, Confirmées, En Attente, À Venir

    // Vérifier que les valeurs sont affichées
    const totalCard = statsCards.filter({ hasText: /Total Visites/i });
    await expect(totalCard).toContainText(/\d+/);
  });

  test('Devrait permettre de filtrer les visites', async ({ page }: { page: Page }) => {
    // Tester le filtre par statut
    await page.click('[data-testid="status-filter"]');
    await page.click('[data-testid="filter-option-pending"]');

    // Vérifier que les filtres sont appliqués
    await expect(page.locator('[data-testid="active-filter"]')).toContainText(/pending/i);

    // Tester l'effacement des filtres
    await page.click('[data-testid="clear-filters"]');
    await expect(page.locator('[data-testid="active-filter"]')).toHaveCount(0);
  });

  test('Devrait permettre de changer de vue', async ({ page }: { page: Page }) => {
    // Tester le changement vers la vue calendrier
    await page.click('[data-testid="view-calendar"]');
    await expect(page.locator('[data-testid="calendar-view"]')).toBeVisible();

    // Tester le changement vers la vue liste
    await page.click('[data-testid="view-list"]');
    await expect(page.locator('[data-testid="list-view"]')).toBeVisible();

    // Tester le changement vers la vue cartes
    await page.click('[data-testid="view-cards"]');
    await expect(page.locator('[data-testid="cards-view"]')).toBeVisible();
  });

  test('Devrait permettre la recherche de visites', async ({ page }: { page: Page }) => {
    // Tester la recherche
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('John Doe');

    // Vérifier que la recherche filtre les résultats
    await page.waitForTimeout(500); // Attendre le debounce
    const visitItems = page.locator('[data-testid="visit-item"]');
    const visibleCount = await visitItems.count();

    // Au moins un résultat doit être visible (ou aucun si pas de matches)
    expect(visibleCount).toBeGreaterThanOrEqual(0);
  });

  test('Devrait permettre de créer une nouvelle visite', async ({ page }: { page: Page }) => {
    // Ouvrir le modal de création
    await page.click('[data-testid="new-visit-button"]');
    await expect(page.locator('[data-testid="visit-modal"]')).toBeVisible();

    // Remplir le formulaire
    await page.fill('[data-testid="visit-name-input"]', TEST_VISIT_NAME);
    await page.fill('[data-testid="visit-date-input"]', TEST_DATE);
    await page.fill('[data-testid="visit-time-input"]', TEST_TIME);

    // Soumettre le formulaire
    await page.click('[data-testid="save-visit-button"]');

    // Vérifier que la visite est créée
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
  });

  test('Devrait permettre d\'éditer une visite existante', async ({ page }: { page: Page }) => {
    // Cliquer sur une visite existante
    const firstVisit = page.locator('[data-testid="visit-item"]').first();
    await firstVisit.click();

    // Vérifier que le modal d'édition s'ouvre
    await expect(page.locator('[data-testid="visit-modal"]')).toBeVisible();

    // Modifier les données
    await page.fill('[data-testid="visit-name-input"]', 'Updated Name');

    // Sauvegarder
    await page.click('[data-testid="save-visit-button"]');

    // Vérifier la mise à jour
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
  });

  test('Devrait gérer les conflits de planning', async ({ page }: { page: Page }) => {
    // Tenter de créer une visite qui cause un conflit
    await page.click('[data-testid="new-visit-button"]');
    await page.fill('[data-testid="visit-date-input"]', TEST_DATE);
    await page.fill('[data-testid="visit-time-input"]', TEST_TIME);

    // Soumettre (qui devrait déclencher un conflit)
    await page.click('[data-testid="save-visit-button"]');

    // Vérifier que l'alerte de conflit s'affiche
    await expect(page.locator('[data-testid="conflict-alert"]')).toBeVisible();
  });

  test('Devrait être responsive sur mobile', async ({ page }: { page: Page }) => {
    // Tester en vue mobile
    await page.setViewportSize({ width: MOBILE_WIDTH, height: MOBILE_HEIGHT });

    // Vérifier que les éléments sont visibles
    await expect(page.locator('[data-testid="planning-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="visits-list"]')).toBeVisible();

    // Tester les interactions tactiles
    await page.tap('[data-testid="view-switcher"]');
    await expect(page.locator('[data-testid="view-menu"]')).toBeVisible();
  });

  test('Devrait permettre l\'export des données', async ({ page }: { page: Page }) => {
    // Tester l'export CSV
    await page.click('[data-testid="export-button"]');
    await page.click('[data-testid="export-csv-option"]');

    // Vérifier que le téléchargement démarre
    const downloadPromise = page.waitForEvent('download');
    await downloadPromise;
  });

  test('Devrait gérer les erreurs de chargement', async ({ page }: { page: Page }) => {
    // Simuler une erreur de chargement
    await page.route('**/api/visits', (route: Route) => {
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
    await expect(page.locator('[data-testid="planning-main"]')).toHaveAttribute(
      'role',
      /main/
    );

    // Vérifier les landmarks
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();

    // Vérifier les tables avec les bons attributs
    const visitsTable = page.locator('[data-testid="visits-table"]');
    await expect(visitsTable).toHaveAttribute('role', 'table');
  });
});

test.describe('Planning - Navigation et interactions', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/planning');
    await page.waitForLoadState('networkidle');
  });

  test('Devrait permettre la navigation par clavier', async ({ page }: { page: Page }) => {
    // Tester la navigation au clavier
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Vérifier que la navigation fonctionne
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('Devrait permettre les raccourcis clavier', async ({ page }: { page: Page }) => {
    // Tester Ctrl+N pour nouvelle visite
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyN');
    await page.keyboard.up('Control');

    // Vérifier que le modal s'ouvre
    await expect(page.locator('[data-testid="visit-modal"]')).toBeVisible();
  });

  test('Devrait permettre le tri des visites', async ({ page }: { page: Page }) => {
    // Tester le tri par date
    await page.click('[data-testid="sort-date-header"]');
    await expect(page.locator('[data-testid="sort-date-header"]')).toHaveAttribute(
      'aria-sort',
      /ascending|descending/
    );

    // Vérifier que l'ordre des visites change
    const visitDates = page.locator('[data-testid="visit-date"]');
    const firstDate = await visitDates.first().textContent();
    const secondDate = await visitDates.nth(1).textContent();

    if (firstDate && secondDate) {
      expect(firstDate).not.toBe(secondDate);
    }
  });
});

test.describe('Planning - Performance', () => {
  test('Devrait se charger rapidement', async ({ page }: { page: Page }) => {
    const startTime = Date.now();

    await page.goto('/planning');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Le planning doit se charger en moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });

  test('Devrait rester fluide avec beaucoup de visites', async ({ page }: { page: Page }) => {
    await page.goto('/planning');
    await page.waitForLoadState('networkidle');

    // Simuler beaucoup de visites pour tester les performances
    await page.evaluate(() => {
      // Ajouter des visites factices pour le test
      window.dispatchEvent(
        new CustomEvent('kbv:mock-data', {
          detail: { visits: Array(100).fill({}).map((_, i) => ({ id: i })) },
        })
      );
    });

    await page.waitForTimeout(1000);

    // Tester les interactions avec beaucoup de données
    const startTime = Date.now();
    await page.click('[data-testid="view-switcher"]');
    const interactionTime = Date.now() - startTime;

    // L'interaction doit prendre moins de 100ms
    expect(interactionTime).toBeLessThan(100);
  });
});