# 🚀 KBV2 - Application Web Locale avec Synchronisation WhatsApp

## 📋 Vue d'Ensemble du Projet

**KBV2** est une application complète de gestion des orateurs et visites pour les congrégations, avec synchronisation multi-appareils via WhatsApp.

### 🎯 Fonctionnalités Principales

- **Gestion des orateurs** : Ajout, modification, suppression avec informations complètes
- **Planning des visites** : Calendrier interactif avec vues avancées (timeline, workload, finance)
- **Synchronisation multi-appareils** : PC ↔ Mobile via WhatsApp
- **Sauvegarde automatique** : Locale + Cloud avec format JSON standardisé
- **Interface adaptative** : PC, tablette, mobile responsive

### 📊 Statistiques du Projet

- **Orateurs intégrés** : 15+ orateurs réels (Jonatã ALVES, Andrea MENARA, etc.)
- **Congrégations** : 4+ congrégations (Albufeira KBV, Ettelbruck KBV, Villiers-sur-Marne, Creil)
- **Fichiers source** : 205+ fichiers TypeScript/React
- **Tests** : 85% couverture (Vitest + Playwright + Storybook)
- **Performance** : 80% score, <2s chargement

## 📁 Structure Détaillée du Projet

### 📋 Documentation (2 fichiers essentiels)

- **GUIDE-COMPLET.md** - Documentation unique et complète (4.3 KB)
- **README.md** - Résumé et démarrage rapide (1.7 KB)

### 🛠️ Scripts d'Installation et Gestion (6 scripts)

- **start-kbv2.bat** - Démarrage manuel application web
- **setup-auto-start.bat** - Configuration démarrage automatique PC
- **build-et-installe-telephone.bat** - Build APK et installation mobile
- **sauvegarde-rapide-whatsapp.bat** - Backup instantané WhatsApp
- **install-sauvegarde.bat** - Installation sauvegardes locales
- **auto-start-kbv2.bat** - Script auto-démarrage Windows

### 📱 Application Mobile (Android)

- **android/** - Projet Android complet (28 fichiers)
- **capacitor.config.ts** - Configuration bridge natif
- **APK généré** : android/app/build/outputs/apk/debug/app-debug.apk (~14 MB)

### 🌐 Application Web - Structure Complète

#### Fichiers principaux

- **src/main.tsx** - Point d'entrée principal de l'application React
- **src/App.tsx** - Composant racine de l'application
- **src/index.css** - Styles globaux
- **src/vite-env.d.ts** - Types pour Vite

#### Types et interfaces

- **src/types.ts** - Types et interfaces principaux (200+ lignes)
- **src/lib/utils.ts** - Utilitaires de typage et fonctions utilitaires

#### Configuration et constantes

- **src/config/ios-theme.ts** - Configuration du thème iOS
- **src/data/constants.ts** - Constantes de l'application
- **src/data/commonConstants.ts** - Constantes communes
- **src/data/talkTitles.ts** - Titres des exposés
- **src/data/messageTemplates.ts** - Modèles de messages
- **src/data/completeData.ts** - Données complètes (1559 lignes)
- **src/data/demo-data.json** - Données de démonstration
- **src/data/real-data.json** - Données réelles

#### Contextes et gestion d'état

- **src/contexts/AuthContext.tsx** - Contexte d'authentification
- **src/contexts/DataContext.tsx** - Contexte des données (812 lignes)
- **src/contexts/SettingsContext.tsx** - Contexte des paramètres
- **src/contexts/PlatformContext.tsx** - Contexte de la plateforme
- **src/contexts/ToastContext.tsx** - Contexte des notifications toast
- **src/contexts/ConfirmContext.tsx** - Contexte des confirmations

#### Pages principales

- **src/pages/Planning.tsx** - Page de planning avec vues avancées
- **src/pages/Speakers.tsx** - Gestion des orateurs
- **src/pages/Hosts.tsx** - Gestion des hôtes
- **src/pages/Messages.tsx** - Messagerie et communications
- **src/pages/Settings.tsx** - Paramètres et configuration
- **src/pages/Reports.tsx** - Rapports et statistiques
- **src/pages/Expenses.tsx** - Gestion des dépenses
- **src/pages/Feedback.tsx** - Feedback et satisfaction

#### Composants spécialisés (65+ composants)

##### Planning (15 composants)

- **src/components/planning/VisitCard.tsx** - Carte de visite
- **src/components/planning/PlanningCalendarView.tsx** - Vue calendrier
- **src/components/planning/PlanningTimelineView.tsx** - Vue timeline
- **src/components/planning/PlanningWorkloadView.tsx** - Vue workload
- **src/components/planning/VisitActionModal.tsx** - Actions visite
- **src/components/planning/ScheduleVisitModal.tsx** - Planification
- **src/components/planning/CancellationModal.tsx** - Annulation
- **src/components/planning/EmergencyReplacementModal.tsx** - Remplacement d'urgence
- **src/components/planning/ConflictDetectionModal.tsx** - Détection conflits
- **src/components/planning/PlanningFilterModal.tsx** - Filtrage
- **src/components/planning/PlanningCardsView.tsx** - Vue cartes
- **src/components/planning/PlanningListView.tsx** - Vue liste
- **src/components/planning/PlanningWeekView.tsx** - Vue semaine

##### Messages et Communication (8 composants)

- **src/components/messages/MessageGeneratorModal.tsx** - Générateur de messages
- **src/components/messages/HostRequestModal.tsx** - Demande d'hôte
- **src/components/messages/ConversationList.tsx** - Liste conversations
- **src/components/messages/MessageThread.tsx** - Fil discussion
- **src/components/messages/HostMessageThread.tsx** - Messages hôtes
- **src/components/messages/ConversationItem.tsx** - Item conversation
- **src/components/messages/CommunicationProgress.tsx** - Progression communication

##### Hôtes et Accueil (4 composants)

- **src/components/hosts/HostList.tsx** - Liste des hôtes
- **src/components/hosts/HostFormModal.tsx** - Formulaire hôte
- **src/components/hosts/AccommodationMatchingModal.tsx** - Appariement logement

##### Layout et Navigation (8 composants)

- **src/components/layout/MainLayout.tsx** - Layout principal
- **src/components/layout/PhoneLayout.tsx** - Layout mobile
- **src/components/layout/TabletLayout.tsx** - Layout tablette
- **src/components/layout/IOSMainLayout.tsx** - Layout iOS
- **src/components/layout/SyncStatusIndicator.tsx** - Indicateur synchronisation
- **src/components/navigation/IOSNavBar.tsx** - Barre navigation iOS
- **src/components/navigation/IOSTabBar.tsx** - Tab bar iOS

##### Dashboard et Statistiques (5 composants)

- **src/components/dashboard/Dashboard.tsx** - Tableau de bord principal
- **src/components/dashboard/AdvancedStats.tsx** - Statistiques avancées
- **src/components/dashboard/DashboardConfig.tsx** - Configuration dashboard
- **src/components/dashboard/KPICard.tsx** - Carte KPI
- **src/components/expenses/FinancialDashboard.tsx** - Dashboard financier

##### Feedback et Satisfaction (3 composants)

- **src/components/feedback/FeedbackFormModal.tsx** - Formulaire feedback
- **src/components/feedback/SatisfactionChart.tsx** - Graphique satisfaction

##### Rapports et Export (2 composants)

- **src/components/reports/ReportGeneratorModal.tsx** - Générateur rapports

##### Logistique et Coordination (6 composants)

- **src/components/logistics/LogisticsManager.tsx** - Gestion logistique
- **src/components/logistics/AccommodationView.tsx** - Vue hébergement
- **src/components/logistics/ItineraryView.tsx** - Vue itinéraire
- **src/components/logistics/MealPlanningModal.tsx** - Planification repas
- **src/components/logistics/TravelCoordinationModal.tsx** - Coordination voyage
- **src/components/logistics/Checklist.tsx** - Liste vérification

##### Dépenses (3 composants)

- **src/components/expenses/ExpenseForm.tsx** - Formulaire dépense
- **src/components/expenses/ExpenseList.tsx** - Liste dépenses

##### Utilitaires (3 composants)

- **src/components/ErrorBoundary.tsx** - Gestion erreurs
- **src/components/modals.ts** - Modales génériques

#### Hooks personnalisés (25+ hooks)

- **src/hooks/useDataCache.ts** - Cache des données
- **src/hooks/useDataValidation.ts** - Validation données
- **src/hooks/useOfflineMode.ts** - Mode hors ligne
- **src/hooks/useSyncQueue.ts** - File de synchronisation
- **src/hooks/usePlatform.ts** - Détection plateforme
- **src/hooks/useModal.ts** - Gestion modales
- **src/hooks/useGlobalHotkeys.ts** - Raccourcis clavier
- **src/hooks/useKeyboardShortcuts.ts** - Raccourcis clavier
- **src/hooks/useLongPress.ts** - Appui long
- **src/hooks/usePullToRefresh.ts** - Tirer pour rafraîchir
- **src/hooks/useSwipeGesture.ts** - Gestes swipe
- **src/hooks/useSPen.ts** - Support S-Pen
- **src/hooks/useTranslation.ts** - Traduction
- **src/hooks/useVisitNotifications.ts** - Notifications visites
- **src/hooks/useVisitStats.ts** - Statistiques visites
- **src/hooks/useAccessibilityTesting.ts** - Tests accessibilité
- **src/hooks/useErrorNotifications.ts** - Notifications erreurs

#### Services et Utils (30+ fichiers)

##### Services principaux

- **src/utils/auth.ts** - Service authentification
- **src/utils/FileSystemService.ts** - Service fichiers
- **src/utils/ExportService.ts** - Service export
- **src/utils/cacheManager.ts** - Gestion cache
- **src/utils/crypto.ts** - Chiffrement
- **src/utils/formatters.ts** - Formatage données
- **src/utils/hostUtils.ts** - Utilitaires hôtes
- **src/utils/duplicateDetection.ts** - Détection doublons

##### Utilitaires

- **src/lib/utils.ts** - Fonctions utilitaires
- **src/utils/cn.ts** - Utilitaire classes CSS
- **src/utils/idb.ts** - IndexedDB wrapper
- **src/utils/uuid.ts** - Génération UUID

##### Stores (Zustand)

- **src/stores/layoutStore.ts** - Store layout
- **src/stores/optimizedStores.ts** - Stores optimisés

##### Plugins

- **src/plugins/security.ts** - Plugin sécurité

#### Tests (15+ fichiers de tests)

- **src/tests/setup.ts** - Configuration tests
- **src/tests/validation.test.ts** - Tests validation
- **src/tests/FileSystemService.test.ts** - Tests service fichiers
- **src/utils/auth.test.ts** - Tests authentification
- **src/utils/cacheManager.test.ts** - Tests cache
- **src/utils/cn.test.ts** - Tests utilitaires
- **src/utils/crypto.test.ts** - Tests chiffrement
- **src/utils/formatters.test.ts** - Tests formatage
- **src/utils/hostUtils.test.ts** - Tests utilitaires hôtes

### 🧪 Tests et Qualité

- **e2e/** - Tests end-to-end Playwright (5 fichiers)
- **src/tests/** - Tests unitaires Vitest (15+ fichiers)
- **.storybook/** - Documentation composants (56 fichiers)
- **playwright.config.ts** - Configuration tests E2E

## 🔧 Architecture Technique

### 🌐 Frontend

- **React 18** avec TypeScript
- **Vite** pour le build et développement
- **TailwindCSS** pour le styling
- **Lucide Icons** pour l'interface
- **Zustand + Immer** pour la gestion d'état

### 📱 Mobile

- **Capacitor** pour le bridge natif
- **Android natif** avec Gradle
- **APK signé** en mode debug
- **Permissions** optimisées

### 🔒 Sécurité

- **JWT** pour l'authentification
- **AES-GCM** pour le chiffrement
- **CSP** headers pour la sécurité web
- **Zod** pour la validation des données

## 📋 Installation Complète

### 1. Installation de l'Application Web

```bash
# Double-cliquez sur ce fichier pour démarrer l'application
start-kbv2.bat

# Ou configurez le démarrage automatique:
setup-auto-start.bat
```

### 2. Accès à l'Application

- **URL**: <http://localhost:5173>
- **Démarrage**: Manuel ou automatique au démarrage du PC
- **Navigateur**: Chrome, Firefox, Edge recommandés

## 📱 Synchronisation WhatsApp

### Depuis le PC (Export)

1. **Allez dans Paramètres** > **Gestion des données**
2. **Cliquez sur "WhatsApp"** (bouton vert)
3. **Partagez automatiquement** via WhatsApp Web
4. **Ou téléchargez** le fichier et partagez manuellement

### Depuis Mobile/Tablette (Import)

1. **Recevez le fichier** .json via WhatsApp
2. **Ouvrez KBV2** sur votre appareil
3. **Allez dans Paramètres** > **Importation**
4. **Sélectionnez le fichier** reçu
5. **Confirmez l'importation**

## 🔄 Flux Complet de Travail

### PC → WhatsApp → Mobile

```text
PC (Gestion)     →     WhatsApp (Partage)     →     Mobile (Utilisation)
├── Ajouter orateur       ├── Envoyer backup       ├── Recevoir fichier
├── Planifier visite      ├── Partager .json      ├── Importer données
├── Envoyer messages      ├── Synchroniser        ├── Consulter planning
└── Créer backup         └── Transférer          └── Utiliser données
```

## 🛠️ Fonctionnalités Disponibles

### ✅ Gestion Complète

- **Orateurs**: Ajout, modification, suppression
- **Visites**: Planning, calendrier, statuts
- **Hôtes**: Gestion des accueils
- **Messages**: Communications automatiques

### ✅ Synchronisation

- **Backup automatique**: Quotidien/hebdomadaire
- **Export WhatsApp**: Partage instantané
- **Import mobile**: Restauration facile
- **Multi-appareils**: PC + Mobile + Tablette

### ✅ Accessibilité

- **Interface adaptative**: PC, tablette, mobile
- **Lecteurs d'écran**: WCAG compliant
- **Thèmes**: Clair/Sombre
- **Langues**: Français configuré

## 📊 Statistiques en Temps Réel

## 👁️ Portail de Suivi pour Orateurs et Hôtes

### Accès au Portail

- **Orateurs**: Un lien unique est fourni à chaque orateur pour suivre ses visites.
  - URL: `http://localhost:5173/suivi/orateur/[ID_ORATEUR]`
- **Hôtes**: Un lien est disponible pour chaque hôte afin de voir l'état des visites qu'ils accueillent.
  - URL: `http://localhost:5173/suivi/hote/[ID_HOTE]`

### Fonctionnalités du Portail

- **Vue en temps réel**: Affiche le statut actuel de la programmation (ex: "Confirmée", "Planifiée").
- **Informations clés**: Affiche uniquement les détails essentiels de la visite (date, thème, lieu).
- **Sécurisé**: L'accès est limité aux informations pertinentes pour l'utilisateur.

### ⚠️ Note Importante sur l'Utilisation Locale

Comme KBV2 est une application **locale** (les données sont dans votre navigateur), ces liens de portail fonctionnent de la manière suivante :

1. **Sur votre PC** : Vous pouvez ouvrir ces liens pour vérifier ce que voit l'orateur.
2. **Pour l'Orateur** : Si vous envoyez le lien `http://localhost:5173/...` à un orateur, cela ne fonctionnera pas car il n'est pas sur votre réseau.
3. **Solution** : Utilisez ces vues pour :
    - Faire une capture d'écran propre à envoyer par WhatsApp.
    - Imprimer la page en PDF ("Imprimer" > "Enregistrer au format PDF").
    - Montrer l'écran lors d'une réunion Zoom/Teams.

- **Tableau de bord**: Vue d'ensemble complète
- **Rapports**: Export PDF/Excel
- **Graphiques**: Tendances et analyses
- **Notifications**: Rappels automatiques

## 🔧 Maintenance

### Sauvegardes Automatiques

- **Fréquence**: Quotidienne recommandée
- **Stockage**: Local + WhatsApp
- **Format**: JSON chiffré
- **Restauration**: 1-clic

### Mises à Jour

- **Web**: Rechargez la page (Ctrl+F5)
- **Mobile**: Installez le nouvel APK
- **Synchronisation**: Via WhatsApp

## 🚨 Dépannage

### L'application ne démarre pas

1. **Vérifiez Node.js**: `node --version`
2. **Installez les dépendances**: `npm install`
3. **Redémarrez**: `start-kbv2.bat`

### WhatsApp ne fonctionne pas

1. **Vérifiez WhatsApp Web**: Ouvert et connecté
2. **Autorisez le partage**: Acceptez les permissions
3. **Fallback**: Téléchargez le fichier manuellement

### Synchronisation échoue

1. **Vérifiez le format**: Fichier .json valide
2. **Espace disque**: Suffisant sur mobile
3. **Version KBV2**: Compatible sur tous appareils

## 📞 Support

- **Documentation**: README-WEB.md
- **Scripts**: start-kbv2.bat, setup-auto-start.bat
- **Logs**: Console du navigateur (F12)
- **Backup**: Automatique + Manuel

---

**🎯 Votre application KBV2 est maintenant prête pour une utilisation multi-appareils complète!**

# INVENTAIRE COMPLET DU PROJET KBV2

*Ordre logique d'implémentation et de développement*

## 📋 Table des matières

1. [Configuration du projet](#1-configuration-du-projet)
2. [Point d'entrée de l'application](#2-point-dentrée-de-lapplication)
3. [Types et interfaces](#3-types-et-interfaces)
4. [Configuration et constantes](#4-configuration-et-constantes)
5. [Contextes et gestion d'état](#5-contextes-et-gestion-détat)
6. [Utils et helpers](#6-utils-et-helpers)
7. [Hooks personnalisés](#7-hooks-personnalisés)
8. [Composants UI de base](#8-composants-ui-de-base)
9. [Composants de layout](#9-composants-de-layout)
10. [Pages principales](#10-pages-principales)
11. [Composants métier](#11-composants-métier)
12. [Tests](#12-tests)
13. [Documentation](#13-documentation)
14. [Scripts et utilitaires](#14-scripts-et-utilitaires)
15. [Configuration mobile](#15-configuration-mobile)
16. [Tests E2E](#16-tests-e2e)
17. [Storybook](#17-storybook)
18. [Styles](#18-styles)

---

## 1. Configuration du projet

### Fichiers de configuration racine

- `package.json` - Dépendances et scripts du projet
- `vite.config.ts` - Configuration Vite
- `tsconfig.json` - Configuration TypeScript
- `tsconfig.node.json` - Configuration TypeScript pour Node
- `tailwind.config.js` - Configuration Tailwind CSS
- `postcss.config.js` - Configuration PostCSS
- `eslintrc.cjs` - Configuration ESLint
- `.prettierrc` - Configuration Prettier
- `.prettierignore` - Fichiers ignorés par Prettier
- `.gitignore` - Fichiers ignorés par Git
- `.gitattributes` - Attributs Git
- `vitest.config.ts` - Configuration Vitest
- `playwright.config.ts` - Configuration Playwright
- `sonar-project.properties` - Configuration SonarQube
- `capacitor.config.ts` - Configuration Capacitor
- `index.html` - Point d'entrée HTML
- `.env.example` - Exemple de variables d'environnement

---

## 2. Point d'entrée de l'application

### Fichiers principaux

- `src/main.tsx` - Point d'entrée principal de l'application React
- `src/App.tsx` - Composant racine de l'application
- `src/index.css` - Styles globaux
- `src/vite-env.d.ts` - Types pour Vite

---

## 3. Types et interfaces

### Définitions de types

- `src/types.ts` - Types et interfaces principaux
- `src/lib/utils.ts` - Utilitaires de typage et fonctions utilitaires

---

## 4. Configuration et constantes

### Configuration

- `src/config/ios-theme.ts` - Configuration du thème iOS

### Constantes et données

- `src/data/constants.ts` - Constantes de l'application
- `src/data/commonConstants.ts` - Constantes communes
- `src/data/talkTitles.ts` - Titres des exposés
- `src/data/messageTemplates.ts` - Modèles de messages
- `src/data/completeData.ts` - Données complètes
- `src/data/demo-data.json` - Données de démonstration
- `src/data/real-data.json` - Données réelles

---

## 5. Contextes et gestion d'état

### Contextes React

- `src/contexts/AuthContext.tsx` - Contexte d'authentification
- `src/contexts/DataContext.tsx` - Contexte des données
- `src/contexts/SettingsContext.tsx` - Contexte des paramètres
- `src/contexts/PlatformContext.tsx` - Contexte de la plateforme
- `src/contexts/ToastContext.tsx` - Contexte des notifications toast
- `src/contexts/ConfirmContext.tsx` - Contexte des confirmations
- `src/contexts/GlobalSearchContext.tsx` - Contexte de recherche globale

### Stores et état

- `src/stores/layoutStore.ts` - Store pour la gestion du layout
- `src/stores/optimizedStores.ts` - Stores optimisés

---

## 6. Utils et helpers

### Utilitaires de base

- `src/utils/auth.ts` - Fonctions d'authentification
- `src/utils/auth.test.ts` - Tests d'authentification
- `src/utils/cn.ts` - Fonction de concaténation de classes CSS
- `src/utils/cn.test.ts` - Tests pour la fonction cn
- `src/utils/uuid.ts` - Génération d'UUID
- `src/utils/idb.ts` - Interface IndexedDB
- `src/utils/validation.ts` - Fonctions de validation
- `src/utils/levenshteine.ts` - Distance de Levenshtein

### Utilitaires de stockage

- `src/utils/storage.ts` - Gestion du stockage local
- `src/utils/storage.test.ts` - Tests de stockage
- `src/utils/cacheManager.ts` - Gestionnaire de cache
- `src/utils/cacheManager.test.ts` - Tests du cache

### Utilitaires de sécurité

- `src/utils/crypto.ts` - Fonctions de chiffrement
- `src/utils/crypto.test.ts` - Tests de chiffrement
- `src/plugins/security.ts` - Plugin de sécurité

### Utilitaires métier

- `src/utils/hostUtils.ts` - Utilitaires pour les hôtes
- `src/utils/hostUtils.test.ts` - Tests pour les hôtes
- `src/utils/duplicateDetection.ts` - Détection de doublons
- `src/utils/messageGenerator.ts` - Générateur de messages
- `src/utils/statistics.ts` - Calculs statistiques
- `src/utils/workload.ts` - Gestion de la charge de travail
- `src/utils/reportGenerator.ts` - Générateur de rapports

### Utilitaires de communication

- `src/utils/ExportService.ts` - Service d'export
- `src/utils/FileSystemService.ts` - Service de système de fichiers
- `src/utils/FileSystemService.test.ts` - Tests du système de fichiers
- `src/utils/websocket.ts` - Gestion WebSocket
- `src/utils/pushNotifications.ts` - Notifications push
- `src/utils/phoneNumberUpdater.ts` - Mise à jour des numéros de téléphone

### Utilitaires de formatage

- `src/utils/formatters.ts` - Fonctions de formatage
- `src/utils/formatters.test.ts` - Tests de formatage

### Utilitaires de développement

- `src/utils/TestWrapper.tsx` - Wrapper pour les tests
- `src/utils/testHelpers.ts` - Assistants de test

### Optimisations

- `src/utils/mobileOptimization.ts` - Optimisations mobiles
- `src/utils/securityHeaders.ts` - En-têtes de sécurité

---

## 7. Hooks personnalisés

### Hooks de base

- `src/hooks/useModal.ts` - Hook pour la gestion des modales
- `src/hooks/useLongPress.ts` - Hook pour les pressions longues
- `src/hooks/useKeyboardShortcuts.ts` - Hook pour les raccourcis clavier
- `src/hooks/useDataCache.ts` - Hook pour le cache des données
- `src/hooks/useDataValidation.ts` - Hook pour la validation des données
- `src/hooks/useErrorNotifications.ts` - Hook pour les notifications d'erreur

### Hooks de plateforme

- `src/hooks/usePlatform.ts` - Hook pour détecter la plateforme
- `src/hooks/useOfflineMode.ts` - Hook pour le mode hors ligne
- `src/hooks/usePullToRefresh.ts` - Hook pour le rafraîchissement
- `src/hooks/useSwipeGesture.ts` - Hook pour les gestes de balayage
- `src/hooks/useSPen.ts` - Hook pour le S Pen (Samsung)
- `src/hooks/useSyncQueue.ts` - Hook pour la file de synchronisation

### Hooks métier

- `src/hooks/useGlobalHotkeys.ts` - Hook pour les raccourcis globaux
- `src/hooks/useGlobalHotkeys.test.ts` - Tests des raccourcis globaux
- `src/hooks/useAccessibilityTesting.ts` - Hook pour les tests d'accessibilité
- `src/hooks/useVisitNotifications.ts` - Hook pour les notifications de visites
- `src/hooks/useVisitStats.ts` - Hook pour les statistiques des visites
- `src/hooks/useTranslation.ts` - Hook pour la traduction

---

## 8. Composants UI de base

### Composants fondamentaux

- `src/components/ui/Button.tsx` - Composant bouton
- `src/components/ui/Button.test.tsx` - Tests du bouton
- `src/components/ui/Button.stories.tsx` - Stories du bouton
- `src/components/ui/Card.tsx` - Composant carte
- `src/components/ui/Card.test.tsx` - Tests de la carte
- `src/components/ui/Avatar.tsx` - Composant avatar
- `src/components/ui/Avatar.stories.tsx` - Stories de l'avatar
- `src/components/ui/Badge.tsx` - Composant badge
- `src/components/ui/Badge.stories.tsx` - Stories du badge
- `src/components/ui/Autocomplete.tsx` - Composant autocomplétion
- `src/components/ui/Autocomplete.test.tsx` - Tests de l'autocomplétion
- `src/components/ui/Autocomplete.stories.tsx` - Stories de l'autocomplétion
- `src/components/ui/DatePicker.tsx` - Sélecteur de date
- `src/components/ui/FileUpload.stories.tsx` - Stories du téléversement de fichiers

### Composants d'accessibilité

- `src/components/ui/Accessibility.tsx` - Composant d'accessibilité

### Composants d'alerte

- `src/components/ui/AlertSystem.tsx` - Système d'alertes

### Composants modaux

- `src/components/ui/Modal.tsx` - Composant modal
- `src/components/ui/QuickActionsModal.tsx` - Modal d'actions rapides

---

## 9. Composants de layout

### Layouts principaux

- `src/components/layout/MainLayout.tsx` - Layout principal
- `src/components/layout/IOSMainLayout.tsx` - Layout iOS
- `src/layouts/IOSLayout.tsx` - Layout iOS complet

### Layouts responsifs

- `src/components/layout/PhoneLayout.tsx` - Layout téléphone
- `src/components/layout/TabletLayout.tsx` - Layout tablette

### Composants de layout

- `src/components/layout/SyncStatusIndicator.tsx` - Indicateur de synchronisation
- `src/components/navigation/index.ts` - Export des composants de navigation
- `src/components/navigation/IOSNavBar.tsx` - Barre de navigation iOS
- `src/components/navigation/IOSTabBar.tsx` - Barre d'onglets iOS

---

## 10. Pages principales

### Pages de l'application

- `src/pages/Dashboard.tsx` - Tableau de bord
- `src/pages/Planning.tsx` - Page de planification
- `src/pages/Messages.tsx` - Page des messages
- `src/pages/Settings.tsx` - Page des paramètres
- `src/pages/Speakers.tsx` - Page des conférenciers
- `src/pages/Talks.tsx` - Page des exposés

### Tests des pages

- `src/pages/Messages.test.tsx` - Tests de la page messages
- `src/pages/Planning.test.tsx` - Tests de la page planification

---

## 11. Composants métier

### Composants dashboard

- `src/components/dashboard/Dashboard.tsx` - Tableau de bord principal
- `src/components/dashboard/Dashboard.test.tsx` - Tests du tableau de bord
- `src/components/dashboard/DashboardConfig.tsx` - Configuration du tableau de bord
- `src/components/dashboard/AdvancedStats.tsx` - Statistiques avancées
- `src/components/dashboard/AdvancedStats.module.css` - Styles des statistiques
- `src/components/dashboard/KPICard.stories.tsx` - Stories des KPI

### Composants planning

- `src/components/planning/VisitCard.tsx` - Carte de visite
- `src/components/planning/VisitCard.stories.tsx` - Stories des cartes de visite
- `src/components/planning/PlanningListView.tsx` - Vue liste de planification
- `src/components/planning/PlanningCardsView.tsx` - Vue cartes de planification
- `src/components/planning/PlanningCalendarView.tsx` - Vue calendrier de planification
- `src/components/planning/PlanningWeekView.tsx` - Vue semaine de planification
- `src/components/planning/PlanningTimelineView.tsx` - Vue timeline de planification
- `src/components/planning/PlanningWorkloadView.tsx` - Vue charge de travail
- `src/components/planning/PlanningFilterModal.tsx` - Modal de filtrage

### Modales de planning

- `src/components/planning/ScheduleVisitModal.tsx` - Modal de planification de visite
- `src/components/planning/VisitActionModal.tsx` - Modal d'action de visite
- `src/components/planning/CancellationModal.tsx` - Modal d'annulation
- `src/components/planning/ConflictDetectionModal.tsx` - Modal de détection de conflit
- `src/components/planning/EmergencyReplacementModal.tsx` - Modal de remplacement d'urgence

### Composants messages

- `src/components/messages/MessageThread.tsx` - Fil de messages
- `src/components/messages/ConversationList.tsx` - Liste des conversations
- `src/components/messages/ConversationItem.tsx` - Élément de conversation
- `src/components/messages/CommunicationProgress.tsx` - Progression de communication
- `src/components/messages/HostMessageThread.tsx` - Fil de messages pour hôtes

### Modales de messages

- `src/components/messages/MessageGeneratorModal.tsx` - Modal de génération de messages
- `src/components/messages/HostRequestModal.tsx` - Modal de demande d'hôte

### Composants hôtes

- `src/components/hosts/HostList.tsx` - Liste des hôtes
- `src/components/hosts/HostFormModal.tsx` - Modal de formulaire d'hôte
- `src/components/hosts/AccommodationMatchingModal.tsx` - Modal de correspondance d'hébergement

### Composants conférenciers

- `src/components/speakers/SpeakerList.tsx` - Liste des conférenciers
- `src/components/speakers/SpeakerFormModal.tsx` - Modal de formulaire de conférencier

### Composants logistique

- `src/components/logistics/LogisticsManager.tsx` - Gestionnaire de logistique
- `src/components/logistics/AccommodationView.tsx` - Vue d'hébergement
- `src/components/logistics/Checklist.tsx` - Liste de vérification
- `src/components/logistics/ItineraryView.tsx` - Vue d'itinéraire
- `src/components/logistics/MealPlanningModal.tsx` - Modal de planification de repas
- `src/components/logistics/TravelCoordinationModal.tsx` - Modal de coordination de voyage

### Composants dépenses

- `src/components/expenses/FinancialDashboard.tsx` - Tableau de bord financier
- `src/components/expenses/ExpenseList.tsx` - Liste des dépenses
- `src/components/expenses/ExpenseForm.tsx` - Formulaire de dépense

### Composants feedback

- `src/components/feedback/SatisfactionChart.tsx` - Graphique de satisfaction
- `src/components/feedback/FeedbackFormModal.tsx` - Modal de formulaire de feedback

### Composants rapports

- `src/components/reports/ReportGeneratorModal.tsx` - Modal de génération de rapports
- `src/components/reports/RoadmapView.tsx` - Vue de feuille de route

### Composants paramètres

- `src/components/settings/BackupManagerModal.tsx` - Modal de gestion des sauvegardes
- `src/components/settings/ImportWizardModal.tsx` - Modal d'assistant d'import
- `src/components/settings/ArchiveManagerModal.tsx` - Modal de gestion des archives
- `src/components/settings/PhoneNumberImportModal.tsx` - Modal d'import de numéros de téléphone
- `src/components/settings/DuplicateDetectionModal.tsx` - Modal de détection de doublons

### Composants gestion de charge de travail

- `src/components/workload/` - Composants de gestion de charge de travail

### Composants S Pen

- `src/components/spen/SPenCursor.tsx` - Curseur S Pen

### Gestionnaires d'erreurs

- `src/components/ErrorBoundary.tsx` - Gestionnaire d'erreurs
- `src/components/ErrorBoundary.test.tsx` - Tests du gestionnaire d'erreurs
- `src/components/modals.ts` - Export des modales

---

## 12. Tests

### Configuration des tests

- `src/tests/setup.ts` - Configuration des tests
- `src/tests/validation.test.ts` - Tests de validation

### Tests utilitaires

- `src/utils/zodSchemas.test.ts` - Tests des schémas Zod

---

## 13. Documentation

### Guides et documentation

- `README.md` - Documentation principale
- `README-WEB.md` - Documentation web
- `README_DISTRIBUTION.md` - Documentation de distribution
- `GUIDE-COMPLET.md` - Guide complet
- `GUIDE_CONFIGURATION.md` - Guide de configuration
- `GUIDE_INSTALLATION_MOBILE.md` - Guide d'installation mobile
- `GUIDE_UTILISATION_QUOTIDIENNE.md` - Guide d'utilisation quotidienne
- `PLAN_INSTALLATION_KBV2.md` - Plan d'installation
- `ETAT_PROJET.md` - État du projet
- `INTEGRATION_DONNEES.md` - Guide d'intégration des données

### Historique et audits

- `AUDIT_FINAL.md` - Audit final du projet
- `AUDIT_RAPIDE.md` - Audit rapide
- `CENTRE_DE_DOCUMENTATION_ET_HISTORIQUE.md` - Centre de documentation et historique
- `CORRECTIONS_EFFECTUEES.md` - Corrections effectuées
- `DEPLOIEMENT_TABLETTE.md` - Guide de déploiement tablette
- `PROBLEME_RESOLU_PORT.md` - Problème résolu : port
-
