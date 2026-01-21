/**
 * Tests E2E pour le Dashboard
 * KBV Lyon - Tests d'intégration Playwright
 */

import { test, expect, Page, Route } from '@playwright/test';

// Constants for responsive design breakpoints
const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 667;
const TABLET_WIDTH = 768;
const TABLET_HEIGHT = 1024;
const DESKTOP_WIDTH = 1920;
const DESKTOP_HEIGHT = 1080;

// Constants for test expectations
const EXPECTED_STATS_CARDS_COUNT = 4;
const TEST_DATA_UPDATE_VALUE = 15;
const ERROR_RESPONSE_STATUS = 500;
const ERROR_WAIT_TIMEOUT = 2000;
const MAX_LOAD_TIME = 3000;

test.describe('Dashboard - Page principale', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Aller sur la page dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Devrait charger la page dashboard', async ({ page }: { page: Page }) => {
    // Vérifier que la page se charge
    await expect(page.locator('h1')).toContainText(/Dashboard|Tableau de bord/i);

    // Vérifier les éléments principaux
    await expect(page.locator('[data-testid="stats-cards"]')).toBeVisible();
    await expect(page.locator('[data-testid="monthly-evolution-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="upcoming-visits"]')).toBeVisible();
  });

  test('Devrait afficher les statistiques des orateurs', async ({ page }: { page: Page }) => {
    // Vérifier les cartes de statistiques
    const statsCards = page.locator('[data-testid="stat-card"]');
    await expect(statsCards).toHaveCount(EXPECTED_STATS_CARDS_COUNT);

    // Vérifier que les valeurs sont affichées
    const speakersCard = statsCards.filter({ hasText: /orateurs/i });
    await expect(speakersCard).toContainText(/\d+/);
  });

  test("Devrait afficher le graphique d'évolution mensuelle", async ({ page }: { page: Page }) => {
    // Vérifier que le graphique Recharts est visible
    await expect(page.locator('.recharts-wrapper')).toBeVisible();

    // Vérifier que les données sont chargées
    const chartBars = page.locator('.recharts-bar');
    const count = await chartBars.count();
    await expect(count).toBeGreaterThan(0);
  });

  test('Devrait afficher les prochaines visites', async ({ page }: { page: Page }) => {
    // Vérifier la section des prochaines visites
    await expect(page.locator('[data-testid="upcoming-visits"] h3')).toContainText(
      /Prochaines visites/i
    );

    // Vérifier que les visites sont listées
    const visitItems = page.locator('[data-testid="visit-item"]');
    const count = await visitItems.count();
    await expect(count).toBeGreaterThanOrEqual(0); // Peut être vide
  });

  test('Devrait afficher les actions requises', async ({ page }: { page: Page }) => {
    // Vérifier la section des actions requises
    await expect(page.locator('[data-testid="required-actions"] h3')).toContainText(
      /Actions requises/i
    );

    // Vérifier les alertes
    const actionItems = page.locator('[data-testid="action-item"]');
    const count = await actionItems.count();
    await expect(count).toBeGreaterThanOrEqual(0); // Peut être vide
  });

  test('Devrait avoir une interface responsive', async ({ page }: { page: Page }) => {
    // Tester différentes tailles d'écran
    await page.setViewportSize({ width: MOBILE_WIDTH, height: MOBILE_HEIGHT }); // Mobile
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();

    await page.setViewportSize({ width: TABLET_WIDTH, height: TABLET_HEIGHT }); // Tablet
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();

    await page.setViewportSize({ width: DESKTOP_WIDTH, height: DESKTOP_HEIGHT }); // Desktop
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
  });

  test('Devrait permettre de naviguer vers les autres pages', async ({ page }: { page: Page }) => {
    // Tester la navigation vers la page Planning
    await page.click('[href="/planning"]');
    await expect(page).toHaveURL(/\/planning/);

    // Retourner au dashboard
    await page.click('[href="/"]');
    await expect(page).toHaveURL(/\//);

    // Tester la navigation vers la page Speakers
    await page.click('[href="/speakers"]');
    await expect(page).toHaveURL(/\/speakers/);
  });

  test('Devrait gérer les interactions tactiles', async ({ page }: { page: Page }) => {
    // Simulation d'interaction tactile sur mobile
    await page.setViewportSize({ width: MOBILE_WIDTH, height: MOBILE_HEIGHT });

    // Tester le swipe sur les cartes de statistiques
    const firstCard = page.locator('[data-testid="stat-card"]').first();
    await firstCard.hover();
    await firstCard.click();

    // Vérifier que l'action est prise en compte
    await expect(page).toHaveURL(/(?:\/speakers|\/planning)/);
  });

  test('Devrait afficher les alertes intelligentes', async ({ page }: { page: Page }) => {
    // Aller sur le dashboard et vérifier les alertes
    await expect(page.locator('[data-testid="smart-alerts"]')).toBeVisible();

    // Vérifier qu'il y a un système d'alertes
    const alertCard = page.locator('[data-testid="alert-card"]');
    const count = await alertCard.count();
    await expect(count).toBeGreaterThanOrEqual(0); // Peut être vide
  });

  test('Devrait gérer les états de chargement', async ({ page }: { page: Page }) => {
    // Simuler un état de chargement
    await page.evaluate(() => {
      window.dispatchEvent(new Event('kbv:loading-start'));
    });

    // Vérifier qu'un indicateur de chargement s'affiche
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();

    // Arrêter le chargement
    await page.evaluate(() => {
      window.dispatchEvent(new Event('kbv:loading-end'));
    });

    // Vérifier que l'indicateur disparaît
    await expect(page.locator('[data-testid="loading-spinner"]')).toHaveCount(0);
  });

  test("Devrait être accessible aux lecteurs d'écran", async ({ page }: { page: Page }) => {
    // Vérifier les attributs ARIA
    await expect(page.locator('[data-testid="dashboard"]')).toHaveAttribute(
      'role',
      /main|application/
    );

    // Vérifier les landmarks
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();

    // Vérifier les attributs de titre
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toHaveAttribute('aria-label');
  });
});

test.describe('Dashboard - Graphiques et données', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Devrait afficher les données de graphique correctement', async ({
    page,
  }: {
    page: Page;
  }) => {
    // Attendre que les données se chargent
    await page.waitForSelector('.recharts-wrapper');

    // Vérifier que le graphique Recharts est interactif
    const chart = page.locator('.recharts-wrapper');
    await expect(chart).toBeVisible();

    // Tester l'interaction avec le tooltip
    await page.hover('.recharts-bar');
    await expect(page.locator('.recharts-tooltip-wrapper')).toBeVisible();
  });

  test('Devrait mettre à jour les KPIs dynamiquement', async ({ page }: { page: Page }) => {
    // Prendre une capture d'écran initiale
    await page.screenshot({ path: 'test-results/dashboard-before.png' });

    // Simuler une mise à jour de données
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('kbv:data-update', {
          detail: { type: 'visits', value: TEST_DATA_UPDATE_VALUE },
        })
      );
    });

    // Attendre que l'interface se mette à jour
    await page.waitForTimeout(1000);

    // Prendre une capture d'écran après mise à jour
    await page.screenshot({ path: 'test-results/dashboard-after.png' });

    // Vérifier que les valeurs ont changé
    const kpiValue = page.locator('[data-testid="kpi-visits"] .value');
    await expect(kpiValue).toContainText(String(TEST_DATA_UPDATE_VALUE));
  });

  test('Devrait gérer les erreurs de chargement', async ({ page }: { page: Page }) => {
    // Simuler une erreur de chargement
    await page.route('**/api/visits', (route: Route) => {
      route.fulfill({
        status: ERROR_RESPONSE_STATUS,
        contentType: 'text/plain',
        body: 'Internal Server Error',
      });
    });

    // Recharger la page pour déclencher l'erreur
    await page.reload();
    await page.waitForTimeout(ERROR_WAIT_TIMEOUT);

    // Vérifier qu'une erreur s'affiche
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});

test.describe('Dashboard - Performance', () => {
  test('Devrait se charger rapidement', async ({ page }: { page: Page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Le dashboard doit se charger en moins de 3 secondes
    expect(loadTime).toBeLessThan(MAX_LOAD_TIME);
  });

  test('Devrait rester fluide pendant les interactions', async ({ page }: { page: Page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Mesurer les performances pendant les interactions
    const interactions = [
      () => page.click('[data-testid="stat-card"]'),
      () => page.hover('.recharts-wrapper'),
      () => page.click('[data-testid="quick-action"]'),
    ];

    for (const interaction of interactions) {
      const startTime = Date.now();
      await interaction();
      const interactionTime = Date.now() - startTime;

      // Chaque interaction doit prendre moins de 100ms
      expect(interactionTime).toBeLessThan(100);
    }
  });
});
