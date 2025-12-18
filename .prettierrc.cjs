/**
 * Configuration Prettier pour KBV Lyon
 * Formatage automatique cohérent du code
 */

module.exports = {
  // Configuration de base
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // Configuration TypeScript/React
  parser: 'typescript',
  plugins: ['@typescript-eslint/eslint-plugin'],

  // Configuration des quotes
  quoteProps: 'as-needed',
  jsxSingleQuote: true,

  // Configuration des crochets
  bracketSpacing: true,
  bracketSameLine: false,

  // Configuration des flèches
  arrowParens: 'always',

  // Configuration des retours à la ligne
  endOfLine: 'lf',
  proseWrap: 'preserve',

  // Configuration HTML
  htmlWhitespaceSensitivity: 'css',

  // Configuration embedded
  embeddedLanguageFormatting: 'auto',

  // Règles spécifiques pour différents types de fichiers
  overrides: [
    {
      files: '*.{json,md,yml,yaml}',
      options: {
        printWidth: 80,
      },
    },
    {
      files: '*.css',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.{ts,tsx}',
      options: {
        printWidth: 100,
      },
    },
    {
      files: '*.{js,jsx}',
      options: {
        printWidth: 100,
      },
    },
  ],

  // Règles de formatage spécifiques
  singleAttributePerLine: false,
  quoteProps: 'as-needed',

  // Règles pour les imports
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^\\./(.*)$', '^\\.\\./(.*)$'],
  importOrderTypeScriptVersion: '5.0.0',
};
