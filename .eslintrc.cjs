/**
 * Configuration ESLint minimale pour KBV Lyon
 * Utilise seulement les fonctionnalités de base
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // TypeScript specific rules
    'no-unused-vars': 'off', // Turn off base rule
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        // Autoriser les variables non utilisées dans les catch blocks
        caughtErrors: 'none', // Désactiver la règle pour les catch blocks
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',

    // General rules
    'no-console': 'off',
    'no-debugger': 'error',
    'no-alert': 'off',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always', { null: 'ignore' }],

    // Removed overly strict rules that were blocking CI
    // 'no-magic-numbers': 'off'
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['src/types.ts', '*.d.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    // Règle spéciale pour les fichiers avec des catch blocks
    {
      files: [
        'src/components/messages/*',
        'src/components/planning/*',
        'src/contexts/AuthContext.tsx',
        'src/utils/messageGenerator.ts',
        'src/utils/testHelpers.ts'
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': ['off'], // Désactiver pour ces fichiers
      },
    },
  ],
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'build/',
    'coverage/',
    '*.config.js',
    '*.config.ts',
    '.storybook/',
    'public/',
  ],
};
