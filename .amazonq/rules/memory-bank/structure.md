# Project Structure - KBV Lyon

## Directory Organization

### Root Structure
```
KBV2/
├── src/                    # Source code
├── android/                # Capacitor Android platform
├── public/                 # Static assets
├── e2e/                    # End-to-end tests (Playwright)
├── .storybook/             # Storybook configuration
├── storybook-static/       # Built Storybook documentation
└── assets/                 # App icons and splash screens
```

### Source Code Architecture (`src/`)

#### Components (`src/components/`)
Organized by feature domain with reusable React components:
- **ui/**: Base UI components (Button, Card, Modal, Input, Badge, Spinner, Toast)
- **dashboard/**: Dashboard-specific components (KPICard, TrendChart, analytics)
- **planning/**: Visit planning and calendar components
- **speakers/**: Speaker management components
- **hosts/**: Host management components
- **messages/**: Communication and messaging components
- **settings/**: Application settings components
- **navigation/**: Navigation and layout components
- **logistics/**: Logistics management components
- **expenses/**: Expense tracking components
- **reports/**: Report generation components
- **workload/**: Workload analysis components
- **feedback/**: User feedback components
- **spen/**: Samsung S-Pen integration components

#### Contexts (`src/contexts/` and `src/context/`)
React Context providers for global state:
- **AuthContext**: Authentication and user session management
- **DataContext**: Application data management and CRUD operations
- **SettingsContext**: User preferences and application settings
- **PlatformContext**: Platform detection (web/Android/iOS)
- **ToastContext**: Toast notification system
- **ConfirmContext**: Confirmation dialog system
- **GlobalSearchContext**: Global search functionality

#### Hooks (`src/hooks/`)
Custom React hooks for reusable logic:
- **useTranslation**: Multi-language support (FR/PT/KEA)
- **usePlatform**: Platform detection and capabilities
- **useOfflineMode**: Offline functionality with sync queue
- **useDataCache**: Intelligent caching with React Query
- **useGlobalHotkeys**: Keyboard shortcuts
- **useSwipeGesture**: Touch gesture handling
- **useLongPress**: Long press interactions
- **usePullToRefresh**: Pull-to-refresh functionality
- **useSPen**: Samsung S-Pen integration
- **useVisitNotifications**: Visit-related notifications
- **useAccessibilityTesting**: Accessibility validation

#### Pages (`src/pages/`)
Top-level page components:
- **Dashboard.tsx**: Main dashboard with KPIs and analytics
- **Speakers.tsx**: Speaker management page
- **Planning.tsx**: Visit planning and calendar
- **Messages.tsx**: Communication center
- **Settings.tsx**: Application settings
- **Talks.tsx**: Talk/discourse management

#### Utilities (`src/utils/`)
Helper functions and services:
- **auth.ts**: JWT authentication and session management
- **crypto.ts**: AES-GCM encryption for sensitive data
- **validation.ts**: Zod schema validation
- **storage.ts**: LocalStorage and IndexedDB wrappers
- **FileSystemService.ts**: Capacitor Filesystem integration
- **ExportService.ts**: Data export/import functionality
- **websocket.ts**: WebSocket communication
- **pushNotifications.ts**: Push notification handling
- **messageGenerator.ts**: Message template generation
- **reportGenerator.ts**: Report creation
- **formatters.ts**: Data formatting utilities
- **statistics.ts**: Statistical calculations
- **cacheManager.ts**: Cache management
- **securityHeaders.ts**: Security header configuration

#### Stores (`src/stores/`)
Zustand state management:
- **optimizedStores.ts**: Optimized stores with Immer for immutable updates
- **layoutStore.ts**: Layout and UI state management

#### Data (`src/data/`)
Static data and constants:
- **completeData.ts**: Initial application data
- **constants.ts**: Application constants
- **commonConstants.ts**: Shared constants
- **messageTemplates.ts**: Message templates for communication
- **talkTitles.ts**: Predefined talk titles

#### Styles (`src/styles/`)
Global CSS and design system:
- **ios-design-system.css**: iOS-inspired design tokens
- **samsung-optimizations.css**: Samsung device optimizations
- **GestureComponents.css**: Touch gesture styles
- **VirtualizedList.css**: List virtualization styles
- **print.css**: Print-specific styles

### Configuration Files

#### Build & Development
- **vite.config.ts**: Vite build configuration with bundle splitting
- **tsconfig.json**: TypeScript compiler configuration
- **tailwind.config.js**: TailwindCSS customization
- **postcss.config.js**: PostCSS configuration
- **capacitor.config.ts**: Capacitor mobile platform configuration

#### Testing
- **vitest.config.ts**: Vitest unit test configuration
- **playwright.config.ts**: Playwright E2E test configuration
- **.storybook/main.ts**: Storybook documentation configuration

#### Code Quality
- **.eslintrc.cjs**: ESLint linting rules
- **.prettierrc.cjs**: Prettier formatting rules
- **sonar-project.properties**: SonarQube analysis configuration

### Android Platform (`android/`)
Capacitor Android project structure:
- **app/**: Android application module
- **app/src/main/AndroidManifest.xml**: Android permissions and configuration
- **build.gradle**: Gradle build configuration
- **capacitor-cordova-android-plugins/**: Capacitor plugin integration

## Architectural Patterns

### Component Architecture
- **Atomic Design**: UI components organized from atoms to organisms
- **Feature-Based**: Components grouped by business domain
- **Composition**: Small, reusable components composed into complex UIs

### State Management
- **Context API**: Global state for auth, data, settings
- **Zustand**: Optimized stores with Immer for complex state
- **React Query**: Server state caching and synchronization
- **Local State**: Component-level state with useState/useReducer

### Data Flow
1. **User Action** → Component
2. **Component** → Context/Store/Hook
3. **Service Layer** → API/Storage
4. **Response** → Cache/Store Update
5. **UI Update** → React re-render

### Mobile Integration
- **Capacitor**: Native bridge for Android/iOS
- **Progressive Enhancement**: Web-first with native enhancements
- **Offline-First**: IndexedDB with background sync
