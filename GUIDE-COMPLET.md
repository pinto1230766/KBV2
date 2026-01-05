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

## 📁 Structure Complète du Projet

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

### 🌐 Application Web
- **src/** - Code source React/TypeScript (205 fichiers)
- **public/** - Assets web (5 fichiers)
- **dist/** - Build de production
- **vite.config.ts** - Configuration build web

### 🧪 Tests et Qualité
- **e2e/** - Tests end-to-end Playwright (5 fichiers)
- **src/tests/** - Tests unitaires Vitest
- **.storybook/** - Documentation composants
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
