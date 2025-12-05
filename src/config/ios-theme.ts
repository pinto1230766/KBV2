/**
 * iOS Design System - Couleurs et Configuration
 * Basé sur les Human Interface Guidelines d'Apple
 */

export const iosColors = {
  // Couleurs système iOS
  blue: '#007AFF',
  green: '#34C759',
  indigo: '#5856D6',
  orange: '#FF9500',
  pink: '#FF2D55',
  purple: '#AF52DE',
  red: '#FF3B30',
  teal: '#5AC8FA',
  yellow: '#FFCC00',
  
  // Grays
  gray: '#8E8E93',
  gray2: '#AEAEB2',
  gray3: '#C7C7CC',
  gray4: '#D1D1D6',
  gray5: '#E5E5EA',
  gray6: '#F2F2F7',
  
  // Labels (Light Mode)
  label: '#000000',
  secondaryLabel: 'rgba(60, 60, 67, 0.6)',
  tertiaryLabel: 'rgba(60, 60, 67, 0.3)',
  quaternaryLabel: 'rgba(60, 60, 67, 0.18)',
  
  // Backgrounds (Light Mode)
  systemBackground: '#FFFFFF',
  secondarySystemBackground: '#F2F2F7',
  tertiarySystemBackground: '#FFFFFF',
  
  // Grouped Backgrounds (Light Mode)
  systemGroupedBackground: '#F2F2F7',
  secondarySystemGroupedBackground: '#FFFFFF',
  tertiarySystemGroupedBackground: '#F2F2F7',
  
  // Fills (Light Mode)
  systemFill: 'rgba(120, 120, 128, 0.2)',
  secondarySystemFill: 'rgba(120, 120, 128, 0.16)',
  tertiarySystemFill: 'rgba(118, 118, 128, 0.12)',
  quaternarySystemFill: 'rgba(116, 116, 128, 0.08)',
  
  // Separators (Light Mode)
  separator: 'rgba(60, 60, 67, 0.29)',
  opaqueSeparator: '#C6C6C8',
} as const;

export const iosColorsDark = {
  // Labels (Dark Mode)
  label: '#FFFFFF',
  secondaryLabel: 'rgba(235, 235, 245, 0.6)',
  tertiaryLabel: 'rgba(235, 235, 245, 0.3)',
  quaternaryLabel: 'rgba(235, 235, 245, 0.18)',
  
  // Backgrounds (Dark Mode)
  systemBackground: '#000000',
  secondarySystemBackground: '#1C1C1E',
  tertiarySystemBackground: '#2C2C2E',
  
  // Grouped Backgrounds (Dark Mode)
  systemGroupedBackground: '#000000',
  secondarySystemGroupedBackground: '#1C1C1E',
  tertiarySystemGroupedBackground: '#2C2C2E',
  
  // Fills (Dark Mode)
  systemFill: 'rgba(120, 120, 128, 0.36)',
  secondarySystemFill: 'rgba(120, 120, 128, 0.32)',
  tertiarySystemFill: 'rgba(118, 118, 128, 0.24)',
  quaternarySystemFill: 'rgba(118, 118, 128, 0.18)',
  
  // Separators (Dark Mode)
  separator: 'rgba(84, 84, 88, 0.65)',
  opaqueSeparator: '#38383A',
} as const;

/**
 * Typographie iOS
 * Basé sur SF Pro (remplacé par Inter pour le web)
 */
export const iosTypography = {
  // Font Stack
  fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", sans-serif',
  
  // Font Sizes (iOS standard)
  largeTitle: '34px',      // 34pt
  title1: '28px',          // 28pt
  title2: '22px',          // 22pt
  title3: '20px',          // 20pt
  headline: '17px',        // 17pt (semibold)
  body: '17px',            // 17pt (regular)
  callout: '16px',         // 16pt
  subheadline: '15px',     // 15pt
  footnote: '13px',        // 13pt
  caption1: '12px',        // 12pt
  caption2: '11px',        // 11pt
  
  // Font Weights
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  
  // Line Heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,
} as const;

/**
 * Espacements iOS
 * Basé sur le 8pt grid system
 */
export const iosSpacing = {
  xs: '4px',      // 0.5 units
  sm: '8px',      // 1 unit
  md: '12px',     // 1.5 units
  lg: '16px',     // 2 units
  xl: '20px',     // 2.5 units
  '2xl': '24px',  // 3 units
  '3xl': '32px',  // 4 units
  '4xl': '40px',  // 5 units
  '5xl': '48px',  // 6 units
} as const;

/**
 * Border Radius iOS
 */
export const iosBorderRadius = {
  sm: '8px',      // Small elements
  md: '10px',     // Buttons
  lg: '12px',     // Cards
  xl: '16px',     // Large cards
  '2xl': '20px',  // Modals
  full: '9999px', // Pills
} as const;

/**
 * Shadows iOS
 * Ombres subtiles caractéristiques d'iOS
 */
export const iosShadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
  md: '0 2px 8px rgba(0, 0, 0, 0.08)',
  lg: '0 4px 16px rgba(0, 0, 0, 0.12)',
  xl: '0 8px 24px rgba(0, 0, 0, 0.15)',
} as const;

/**
 * Animations iOS
 * Courbes de Bézier pour animations fluides
 */
export const iosAnimations = {
  // Durées
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  
  // Timing functions
  easeOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
  easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  // Transitions complètes
  transition: 'all 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  transitionFast: 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
} as const;

/**
 * Safe Area Insets
 * Pour gérer les encoches et barres d'accueil
 */
export const iosSafeArea = {
  top: 'env(safe-area-inset-top, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
  left: 'env(safe-area-inset-left, 0px)',
  
  // Heights
  statusBar: '44px',
  navBar: '44px',
  navBarLarge: '96px',
  tabBar: '49px',
  tabBarWithSafeArea: '83px', // 49px + 34px safe area
} as const;

/**
 * Blur Effects iOS
 */
export const iosBlur = {
  light: 'rgba(255, 255, 255, 0.8)',
  dark: 'rgba(28, 28, 30, 0.8)',
  backdropFilter: 'blur(20px)',
} as const;

export const iosTheme = {
  colors: iosColors,
  colorsDark: iosColorsDark,
  typography: iosTypography,
  spacing: iosSpacing,
  borderRadius: iosBorderRadius,
  shadows: iosShadows,
  animations: iosAnimations,
  safeArea: iosSafeArea,
  blur: iosBlur,
} as const;

export type IOSTheme = typeof iosTheme;
