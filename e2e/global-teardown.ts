/**
 * Configuration globale pour les tests E2E Playwright
 * Teardown après tous les tests
 */

export default async function globalTeardown() {
  // Nettoyage global après les tests E2E
  console.log('Global teardown for E2E tests');
}
