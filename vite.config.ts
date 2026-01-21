import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Configuration Vite optimisée pour KBV Lyon
 */
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/data': path.resolve(__dirname, './src/data'),
    },
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge', 'date-fns'],
          'data-vendor': ['zustand', 'immer', 'idb'],
          'charts-vendor': ['recharts'],
          'utils-vendor': ['zod', 'uuid'],
        },
      },
    },

    assetsInlineLimit: 4096,
    sourcemap: mode !== 'production',
    minify: mode === 'production',
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    cssMinify: mode === 'production',
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'immer',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'date-fns',
    ],
  },

  server: {
    port: 5173,
    host: true,
  },

  define: {
    __DEV__: mode === 'development',
    __PROD__: mode === 'production',
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
}));
