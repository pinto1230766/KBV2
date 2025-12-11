/**
 * Configuration Playwright pour les tests E2E
 * KBV Lyon - Tests d'intégration
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Dossier des tests
  testDir: './e2e',
  
  // Timeout par défaut pour les tests
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  
  // Retries
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  // Configuration des navigateurs
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  
  // Configuration des navigateurs à tester
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    },
    {
      name: 'Samsung Galaxy S21',
      use: { ...devices['Galaxy S II'] }
    }
  ],
  
  // Serveur de développement local pour les tests
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI
  },
  
  // Dossiers de tests
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',
  
  // Configuration des fichiers de test
  testMatch: /e2e\/.*\.spec\.ts/,
  
  // Ignore les fichiers non testés
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.git/**'
  ]
});
