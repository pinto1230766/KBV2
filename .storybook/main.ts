import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)', '../src/**/*.mdx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config: any) => {
    // Merge custom configuration into the default config
    // const { mergeConfig } = await import('vite');
    //
    // return mergeConfig(config, {
    //   // Add dependencies to pre-optimization
    //   optimizeDeps: {
    //     include: ['@storybook/react']
    //   }
    // });

    return config;
  },
};

export default config;
