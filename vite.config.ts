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
  plugins: [react(), securityHeadersPlugin()],
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
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          charts: ['recharts'],
          utils: ['date-fns', 'idb'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
