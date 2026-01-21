/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  corePlugins: {
    transform: false,
  },
  theme: {
    extend: {
      colors: {
        // Couleurs système iOS
        'ios-blue': '#007AFF',
        'ios-green': '#34C759',
        'ios-indigo': '#5856D6',
        'ios-orange': '#FF9500',
        'ios-pink': '#FF2D55',
        'ios-purple': '#AF52DE',
        'ios-red': '#FF3B30',
        'ios-teal': '#5AC8FA',
        'ios-yellow': '#FFCC00',

        // Design tokens Bento / Soft UI
        bento: {
          primary: '#4F46E5',
          secondary: '#6366F1',
          accent: '#A5B4FC',
          slate: '#0F172A',
          muted: '#94A3B8',
          surface: 'rgba(255, 255, 255, 0.85)',
          'surface-dark': 'rgba(15, 23, 42, 0.75)',
          glass: 'rgba(79, 70, 229, 0.08)',
          'glass-dark': 'rgba(15, 23, 42, 0.65)',
        },

        // Garder les couleurs existantes pour compatibilité
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#007AFF', // iOS Blue
          600: '#0051D5',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#34C759', // iOS Green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FF9500', // iOS Orange
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#FF3B30', // iOS Red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        // Tailles iOS
        'ios-large-title': '34px',
        'ios-title-1': '28px',
        'ios-title-2': '22px',
        'ios-title-3': '20px',
        'ios-headline': '17px',
        'ios-body': '17px',
        'ios-callout': '16px',
        'ios-subheadline': '15px',
        'ios-footnote': '13px',
        'ios-caption-1': '12px',
        'ios-caption-2': '11px',
      },
      borderRadius: {
        // Bento UI
        'bento-sm': '12px',
        'bento-md': '18px',
        'bento-lg': '28px',
        'bento-xl': '36px',
        'bento-2xl': '45px',

        // Border radius iOS
        'ios-sm': '8px',
        'ios-md': '10px',
        'ios-lg': '12px',
        'ios-xl': '16px',
        'ios-2xl': '20px',
      },
      boxShadow: {
        // Soft UI shadows
        'bento-sm': '0 2px 8px rgba(15, 23, 42, 0.08)',
        'bento-md': '0 8px 24px rgba(15, 23, 42, 0.12)',
        'bento-lg': '0 18px 35px rgba(15, 23, 42, 0.16)',
        'bento-accent': '0 12px 40px rgba(79, 70, 229, 0.25)',

        // Ombres iOS
        'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'ios-md': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'ios-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'ios-xl': '0 8px 24px rgba(0, 0, 0, 0.15)',
        // Garder pour compatibilité
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      backdropBlur: {
        bento: '30px',
      },
      animation: {
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'spin-slow': 'spin 3s linear infinite',
        'bento-press': 'bentoPress 0.18s ease',
        'bento-float': 'bentoFloat 4s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bentoPress: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.96)' },
        },
        bentoFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      spacing: {
        18: '4.5rem',
        26: '6.5rem',
        88: '22rem',
        112: '28rem',
      },
    },
  },
  plugins: [],
};
