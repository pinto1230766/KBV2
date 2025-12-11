/**
 * Configuration Vite optimisée pour KBV Lyon
 * Phase 8.2 - Bundle et Performance
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => ({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge', 'date-fns'],
          'data-vendor': ['zustand', 'immer', '@tanstack/react-query', 'swr'],
          'charts-vendor': ['recharts'],
          'utils-vendor': ['zod', 'uuid', 'idb'],
          'mobile-vendor': ['@capacitor/core', '@capacitor/android', '@capacitor/ios']
        }
      }
    },
    
    assetsInlineLimit: 4096,
    sourcemap: mode !== 'production',
    minify: mode === 'production',
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    cssMinify: mode === 'production'
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'immer',
      '@tanstack/react-query',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'date-fns'
    ]
  },
  
  define: {
    __DEV__: mode === 'development',
    __PROD__: mode === 'production',
    __VERSION__: JSON.stringify(process.env.npm_package_version)
  }
}));
