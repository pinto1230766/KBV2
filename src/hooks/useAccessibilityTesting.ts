import { useState, useEffect, useCallback } from 'react';

// Types pour les tests d'accessibilité
interface AccessibilityTestResult {
  passed: boolean;
  message: string;
  element?: string;
  severity: 'error' | 'warning' | 'info';
}

interface AccessibilityTestSuite {
  name: string;
  tests: AccessibilityTest[];
}

interface AccessibilityTest {
  id: string;
  description: string;
  run: () => AccessibilityTestResult[];
  category: 'navigation' | 'aria' | 'keyboard' | 'screen-reader';
}

// Suite de tests d'accessibilité
export const accessibilityTestSuite: AccessibilityTestSuite[] = [
  {
    name: 'Navigation au Clavier',
    tests: [
      {
        id: 'keyboard-tab-order',
        description: 'Vérifie que tous les éléments interactifs sont accessibles via Tab',
        category: 'keyboard',
        run: () => {
          const interactiveElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          const results: AccessibilityTestResult[] = [];
          
          interactiveElements.forEach((element, index) => {
            const tabIndex = element.getAttribute('tabindex');
            
            if (tabIndex && parseInt(tabIndex) < 0) {
              results.push({
                passed: false,
                message: `Élément avec tabindex négatif trouvé à l'index ${index}`,
                element: element.tagName,
                severity: 'error'
              });
            }
          });
          
          if (results.length === 0) {
            results.push({
              passed: true,
              message: `Navigation au clavier OK - ${interactiveElements.length} éléments focusables`,
              severity: 'info'
            });
          }
          
          return results;
        }
      },
      {
        id: 'keyboard-focus-visible',
        description: 'Vérifie que le focus est visible',
        category: 'keyboard',
        run: () => {
          const style = window.getComputedStyle(document.activeElement || document.body);
          const {outline} = style;
          const {boxShadow} = style;
          
          if (!outline && !boxShadow) {
            return [{
              passed: false,
              message: 'Le focus n\'est pas visible (pas d\'outline ni de box-shadow)',
              element: document.activeElement?.tagName || 'body',
              severity: 'warning'
            }];
          }
          
          return [{
            passed: true,
            message: 'Focus visible détecté',
            severity: 'info'
          }];
        }
      }
    ]
  },
  {
    name: 'ARIA et Labels',
    tests: [
      {
        id: 'aria-labels',
        description: 'Vérifie la présence des labels ARIA',
        category: 'aria',
        run: () => {
          const results: AccessibilityTestResult[] = [];
          
          // Vérifier les icônes sans texte
          const icons = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
          icons.forEach((icon, index) => {
            const parent = icon.parentElement;
            if (parent && !parent.textContent?.trim()) {
              results.push({
                passed: false,
                message: `Icône sans aria-label trouvée (index ${index})`,
                element: 'svg',
                severity: 'error'
              });
            }
          });
          
          // Vérifier les boutons sans texte
          const buttonsWithoutText = document.querySelectorAll(
            'button:not([aria-label]):not([aria-labelledby]):empty'
          );
          buttonsWithoutText.forEach((_button, index) => {
            results.push({
              passed: false,
              message: `Bouton vide sans aria-label (index ${index})`,
              element: 'button',
              severity: 'error'
            });
          });
          
          if (results.length === 0) {
            results.push({
              passed: true,
              message: 'Tous les éléments ont des labels appropriés',
              severity: 'info'
            });
          }
          
          return results;
        }
      },
      {
        id: 'role-attributes',
        description: 'Vérifie les rôles ARIA appropriés',
        category: 'aria',
        run: () => {
          const results: AccessibilityTestResult[] = [];
          
          // Vérifier les listes
          const lists = document.querySelectorAll('ul, ol');
          lists.forEach((list, index) => {
            if (!list.getAttribute('role') && !list.querySelector('li')) {
              results.push({
                passed: false,
                message: `Liste sans items li trouvée (index ${index})`,
                element: list.tagName,
                severity: 'warning'
              });
            }
          });
          
          if (results.length === 0) {
            results.push({
              passed: true,
              message: 'Structure des listes appropriée',
              severity: 'info'
            });
          }
          
          return results;
        }
      }
    ]
  },
  {
    name: 'Navigation Screen Reader',
    tests: [
      {
        id: 'headings-structure',
        description: 'Vérifie la structure des titres',
        category: 'screen-reader',
        run: () => {
          const results: AccessibilityTestResult[] = [];
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          
          if (headings.length === 0) {
            results.push({
              passed: false,
              message: 'Aucun titre (h1-h6) trouvé sur la page',
              severity: 'error'
            });
            return results;
          }
          
          // Vérifier qu'il y a un h1
          const h1Count = document.querySelectorAll('h1').length;
          if (h1Count === 0) {
            results.push({
              passed: false,
              message: 'Aucun h1 trouvé - doit y avoir exactement un h1 par page',
              severity: 'error'
            });
          } else if (h1Count > 1) {
            results.push({
              passed: false,
              message: `${h1Count} h1 trouvés - doit y avoir exactement un h1 par page`,
              severity: 'warning'
            });
          }
          
          // Vérifier la hiérarchie des titres
          let previousLevel = 0;
          headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            if (index > 0 && level > previousLevel + 1) {
              results.push({
                passed: false,
                message: `Saut de niveau de titre détecté: h${previousLevel} vers h${level}`,
                element: heading.tagName,
                severity: 'warning'
              });
            }
            previousLevel = level;
          });
          
          if (results.length === 0) {
            results.push({
              passed: true,
              message: `Structure des titres OK - ${headings.length} titres trouvés`,
              severity: 'info'
            });
          }
          
          return results;
        }
      },
      {
        id: 'alt-text-images',
        description: 'Vérifie la présence de texte alternatif pour les images',
        category: 'screen-reader',
        run: () => {
          const results: AccessibilityTestResult[] = [];
          const images = document.querySelectorAll('img');
          
          if (images.length === 0) {
            results.push({
              passed: true,
              message: 'Aucune image trouvée sur la page',
              severity: 'info'
            });
            return results;
          }
          
          images.forEach((img, index) => {
            const alt = img.getAttribute('alt');
            const isDecorative = img.getAttribute('role') === 'presentation' || alt === '';
            
            if (!alt && !isDecorative) {
              results.push({
                passed: false,
                message: `Image sans texte alternatif (index ${index})`,
                element: 'img',
                severity: 'error'
              });
            } else if (alt && alt.length < 3) {
              results.push({
                passed: false,
                message: `Texte alternatif trop court: "${alt}"`,
                element: 'img',
                severity: 'warning'
              });
            }
          });
          
          if (results.length === 0) {
            results.push({
              passed: true,
              message: `Toutes les images ont un texte alternatif approprié`,
              severity: 'info'
            });
          }
          
          return results;
        }
      }
    ]
  }
];

// Hook pour exécuter les tests d'accessibilité
export function useAccessibilityTesting() {
  const [testResults, setTestResults] = useState<AccessibilityTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    const results: AccessibilityTestResult[] = [];

    try {
      // Attendre que le DOM soit stable
      await new Promise(resolve => setTimeout(resolve, 100));

      // Exécuter tous les tests
      for (const suite of accessibilityTestSuite) {
        for (const test of suite.tests) {
          try {
            const testResults = test.run();
            results.push(...testResults);
          } catch (error) {
            results.push({
              passed: false,
              message: `Erreur lors du test ${test.id}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
              severity: 'error'
            });
          }
        }
      }
    } catch (error) {
      results.push({
        passed: false,
        message: `Erreur générale lors de l'exécution des tests: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        severity: 'error'
      });
    }

    setTestResults(results);
    setLastRun(new Date());
    setIsRunning(false);

    return results;
  }, []);

  const runSpecificTest = useCallback(async (testId: string) => {
    setIsRunning(true);
    const results: AccessibilityTestResult[] = [];

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      for (const suite of accessibilityTestSuite) {
        const test = suite.tests.find(t => t.id === testId);
        if (test) {
          const testResults = test.run();
          results.push(...testResults);
          break;
        }
      }
    } catch (error) {
      results.push({
        passed: false,
        message: `Erreur lors du test ${testId}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        severity: 'error'
      });
    }

    setTestResults(results);
    setLastRun(new Date());
    setIsRunning(false);

    return results;
  }, []);

  const getSummary = useCallback(() => {
    const errors = testResults.filter(r => r.severity === 'error');
    const warnings = testResults.filter(r => r.severity === 'warning');
    const infos = testResults.filter(r => r.severity === 'info');

    return {
      total: testResults.length,
      passed: testResults.filter(r => r.passed).length,
      errors: errors.length,
      warnings: warnings.length,
      infos: infos.length,
      score: testResults.length > 0 ? Math.round((testResults.filter(r => r.passed).length / testResults.length) * 100) : 0
    };
  }, [testResults]);

  useEffect(() => {
    // Auto-run tests when component mounts
    runAllTests();
  }, [runAllTests]);

  return {
    testResults,
    isRunning,
    lastRun,
    runAllTests,
    runSpecificTest,
    getSummary,
    testSuite: accessibilityTestSuite
  };
}

export default useAccessibilityTesting;
