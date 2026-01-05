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
