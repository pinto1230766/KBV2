import type { Preview } from '@storybook/react';
import '../src/index.css';

// Configuration globale pour tous les stories
const preview: Preview = {
  parameters: {
    // Layout par défaut
    layout: 'centered',
    
    // Configuration des contrôles
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    
    // Configuration de la documentation
    docs: {
      theme: {
        base: 'light',
        brandTitle: 'KBV Lyon - Documentation des composants',
        brandUrl: 'https://github.com/pinto1230766/KBV2',
        brandImage: '/logo.svg'
      }
    },
    
    // Actions configurées
    actions: { argTypesRegex: '^on[A-Z].*' },
    
    // Backgrounds pour les stories
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'gray',
          value: '#f3f4f6',
        },
        {
          name: 'dark',
          value: '#1f2937',
        },
      ],
    },
    
    // Configuration de la viewport
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1024px',
            height: '768px',
          },
        },
      },
    },
  },
  
  // Décorateurs globaux pour appliquer le style Tailwind
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default preview;
