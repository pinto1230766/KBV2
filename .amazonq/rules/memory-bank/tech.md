# Technology Stack - KBV Lyon

## Programming Languages
- **TypeScript 5.0+**: Primary language for type-safe development
- **JavaScript (ES2020+)**: Configuration files and build scripts
- **CSS3**: Styling with TailwindCSS utility classes
- **HTML5**: Semantic markup

## Core Framework & Libraries

### Frontend Framework
- **React 18.2**: UI library with concurrent features
- **React DOM 18.2**: DOM rendering
- **React Router DOM 7.10**: Client-side routing

### Build System
- **Vite 7.2.7**: Fast build tool and dev server
- **@vitejs/plugin-react 4.0**: React Fast Refresh support
- **TypeScript Compiler**: Type checking and transpilation

### Styling
- **TailwindCSS 3.3**: Utility-first CSS framework
- **PostCSS 8.4**: CSS processing
- **Autoprefixer 10.4**: Vendor prefix automation
- **clsx 2.1**: Conditional className utility
- **tailwind-merge 3.4**: TailwindCSS class merging

### State Management
- **Zustand 5.0.9**: Lightweight state management
- **Immer 11.1.3**: Immutable state updates
- **@tanstack/react-query 5.90**: Server state management and caching
- **SWR 2.3.7**: Data fetching and caching

### UI Components & Icons
- **Lucide React 0.294**: Icon library
- **Recharts 2.10**: Chart and data visualization
- **react-window 2.2.3**: List virtualization
- **react-window-infinite-loader 2.0**: Infinite scrolling

### Mobile & Native
- **@capacitor/core 5.0**: Native bridge
- **@capacitor/android 5.0**: Android platform
- **@capacitor/ios 5.0**: iOS platform
- **@capacitor/filesystem 5.2**: File system access
- **@capacitor/preferences 5.0**: Native storage
- **@capacitor/local-notifications 5.0**: Push notifications
- **@capacitor/share 5.0**: Native sharing
- **@capacitor/splash-screen 5.0.8**: Splash screen management

### Data & Storage
- **idb 7.1.1**: IndexedDB wrapper for offline storage
- **uuid 9.0.1**: UUID generation

### Date & Time
- **date-fns 4.1.0**: Date manipulation and formatting

### Validation & Security
- **Zod 4.1.13**: Schema validation
- **Custom crypto utilities**: AES-GCM encryption
- **JWT**: JSON Web Token authentication

### Gestures & Interactions
- **@use-gesture/react 10.3.1**: Touch gesture handling
- **react-hotkeys-hook 5.2.1**: Keyboard shortcuts

### Accessibility
- **@react-aria/focus 3.21.2**: Focus management
- **@react-aria/live-announcer 3.4.4**: Screen reader announcements

### Monitoring & Analytics
- **@sentry/react 10.29**: Error tracking and monitoring
- **web-vitals 5.1**: Performance metrics

### Utilities
- **react-to-print 3.2**: Print functionality

## Development Tools

### Testing
- **Vitest 4.0.15**: Unit testing framework
- **@vitest/ui 4.0.15**: Test UI interface
- **@vitest/coverage-v8 4.0.15**: Code coverage
- **@testing-library/react 14.0**: React component testing
- **@testing-library/jest-dom 6.1**: DOM matchers
- **@testing-library/user-event 14.4.3**: User interaction simulation
- **jsdom 23.0**: DOM implementation for testing
- **@playwright/test 1.40**: End-to-end testing

### Documentation
- **@storybook/react 10.1.7**: Component documentation
- **@storybook/react-vite 10.1.7**: Storybook Vite integration

### Code Quality
- **ESLint 8.50**: JavaScript/TypeScript linting
- **@typescript-eslint/eslint-plugin 8.50.1**: TypeScript ESLint rules
- **@typescript-eslint/parser 8.50.1**: TypeScript parser for ESLint
- **eslint-plugin-react-hooks 4.6.2**: React Hooks linting
- **eslint-plugin-react-refresh 0.4.7**: React Fast Refresh linting
- **Prettier 3.7.4**: Code formatting

### Type Definitions
- **@types/react 18.2**: React type definitions
- **@types/react-dom 18.2**: React DOM type definitions
- **@types/react-window 1.8.8**: react-window type definitions
- **@types/uuid 9.0.7**: UUID type definitions

## Development Commands

### Development Server
```bash
npm run dev              # Start Vite dev server (localhost:5173)
npm run dev:full         # Start dev server + Storybook concurrently
```

### Building
```bash
npm run build            # Production build
npm run build:prod       # Production build with NODE_ENV=production
npm run build:analyze    # Build with bundle analyzer
npm run build:stats      # Build with stats visualization
npm run preview          # Preview production build
```

### Testing
```bash
npm test                 # Run unit tests in watch mode
npm run test:run         # Run unit tests once
npm run test:ui          # Open Vitest UI
npm run test:coverage    # Run tests with coverage report
npm run test:update      # Update test snapshots
npm run test:e2e         # Run Playwright E2E tests
npm run test:e2e:ui      # Run E2E tests with UI
npm run test:e2e:debug   # Debug E2E tests
```

### Code Quality
```bash
npm run lint             # Run ESLint (max 0 warnings)
npm run lint:fix         # Fix ESLint issues automatically
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # TypeScript type checking
```

### Documentation
```bash
npm run storybook        # Start Storybook dev server (port 6006)
npm run build-storybook  # Build static Storybook
```

### Mobile Development
```bash
npx cap open android     # Open Android Studio
npx cap sync             # Sync web assets to native platforms
npx cap copy             # Copy web assets only
```

### CI/CD
```bash
npm run ci               # Run full CI pipeline (lint + type-check + test + build)
```

## Environment Configuration

### Environment Variables
```env
VITE_API_URL             # Backend API URL
VITE_WS_URL              # WebSocket URL
VITE_VAPID_PUBLIC_KEY    # Push notification public key
```

### Platform Detection
- Automatic detection of web/Android/iOS platforms
- Device-specific optimizations (Samsung Tab S10 Ultra)
- Responsive breakpoints for mobile/tablet/desktop

## Build Output
- **dist/**: Production build output
- **storybook-static/**: Built Storybook documentation
- **android/app/build/**: Android APK/AAB output
- **coverage/**: Test coverage reports

## Version Information
- **Application Version**: 1.20.1
- **Node.js**: 18+ required
- **Package Manager**: npm (package-lock.json present)
