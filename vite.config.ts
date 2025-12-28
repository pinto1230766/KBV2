import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Plugin pour injecter les headers de sécurité dans le HTML
function securityHeadersPlugin(): Plugin {
  return {
    name: 'security-headers',
    transformIndexHtml(html) {
      // CSP strict pour la sécurité
      const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: blob: https: http:",
        "font-src 'self' https://fonts.gstatic.com data:",
        "connect-src 'self' https://api.kbv-lyon.fr wss: https: http:",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
      ].join('; ');

      // Injecter les meta tags de sécurité
      return html.replace(
        '<head>',
        `<head>
    <meta http-equiv="Content-Security-Policy" content="${csp}">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">`
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    securityHeadersPlugin(),
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
    sourcemap: false, // Désactivé en production pour réduire la taille
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        // Optimisation du splitting des chunks
        manualChunks: {
          // Core React ecosystem
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'react-query': ['@tanstack/react-query'],
          
          // UI Libraries
          'ui-charts': ['recharts'],
          'ui-icons': ['lucide-react'],
          'ui-gestures': ['@use-gesture/react'],
          'ui-components': ['react-hotkeys-hook'],
          
          // Data & State
          'state-zustand': ['zustand'],
          'data-utils': ['idb', 'date-fns', 'uuid'],
          'data-validation': ['zod'],
          
          // Platform & Monitoring
          'platform-sentry': ['@sentry/react'],
          'platform-capacitor': [
            '@capacitor/core',
            '@capacitor/android',
            '@capacitor/ios',
            '@capacitor/local-notifications',
            '@capacitor/preferences',
            '@capacitor/share'
          ],
          
          // Testing & Development (will be tree-shaken)
          'testing': ['@testing-library/react', '@testing-library/user-event'],
        },
        // Optimisation des noms de fichiers
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Organiser les assets par type
          const name = assetInfo.name || 'asset';
          const info = name.split('.');
          const extType = info[info.length - 1];
          
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
            return `assets/images/[name]-[hash].${extType}`;
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
            return `assets/fonts/[name]-[hash].${extType}`;
          }
          
          if (/\.(css)$/i.test(name)) {
            return `assets/styles/[name]-[hash].${extType}`;
          }
          
          return `assets/[name]-[hash].${extType}`;
        },
      },
      // Optimisation de l'arbre
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      // Configuration pour réduire les warnings
      onwarn(warning, warn) {
        // Ignorer certains warnings connu
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        warn(warning);
      },
    },
    // Configuration de la performance
    chunkSizeWarningLimit: 1000, // 1MB
    assetsInlineLimit: 4096, // Inline assets < 4KB
  },
  // Optimisation du serveur de développement
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false, // Réduit les logs de développement
    },
  },
  // Optimisation du CSS
  css: {
    devSourcemap: false, // Désactivé en production
    postcss: {
      plugins: [
        // Optimisations CSS additionnelles si nécessaire
      ],
    },
  },
  // Configuration de l'optimisation des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'recharts',
      'lucide-react',
      'zustand',
      'idb',
      'date-fns',
    ],
    exclude: [
      // Exclure les packages qui causent des problèmes
    ],
  },
  // Configuration du cache
  cacheDir: 'node_modules/.vite',
});
