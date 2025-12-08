# KBV Lyon - Gestion des Orateurs Visiteurs

Application complète de gestion des orateurs visiteurs pour la congrégation KBV DV Lyon.

## 🔗 Dépôt GitHub

**Repository** : [https://github.com/pinto1230766/KBV2](https://github.com/pinto1230766/KBV2)

```bash
# Cloner le projet
git clone https://github.com/pinto1230766/KBV2.git
cd KBV2
```

## 🚀 Fonctionnalités

- 📊 **Dashboard** : Vue d'ensemble avec statistiques et graphiques
- 📅 **Planning** : 5 vues différentes (Cartes, Liste, Semaine, Calendrier, Chronologie)
- 💬 **Messagerie** : Centre de communication multilingue (FR, CV, EN, ES)
- 🤖 **IA** : Génération de messages avec Google Gemini
- 📱 **Mobile** : Applications Android et iOS via Capacitor
- 🔒 **Sécurité** : Chiffrement AES-GCM des données sensibles
- 🔄 **Synchronisation** : Import/Export et Google Sheets
- 🌓 **Dark Mode** : Thème clair/sombre automatique

## 📦 Installation

```bash
npm install
```

## 🛠️ Développement

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📱 Build Mobile

### Android

```bash
npm run build
npx cap sync android
npx cap open android
```

### iOS

```bash
npm run build
npx cap sync ios
npx cap open ios
```

## 🔑 Configuration

Créer un fichier `.env` à la racine :

```env
VITE_GEMINI_API_KEY=votre_cle_api_google_gemini
```

## 📚 Documentation Supplémentaire

### Optimisation Samsung Tab S10 Ultra
- 📱 [Guide d'Optimisation Samsung](GUIDE_OPTIMISATION_SAMSUNG.md) - Fonctionnalités et optimisations
- 🚀 [Quick Start](QUICK_START.md) - Déploiement en 3 commandes
- 🔧 [Guide Build & Deploy](GUIDE_BUILD_DEPLOY.md) - Instructions détaillées
- 🔧 [Troubleshooting](TROUBLESHOOTING.md) - Résolution des problèmes
- ✅ [Template Rapport Test](TEMPLATE_RAPPORT_TEST.md) - Checklist de validation
- 🔍 [Vérification Implémentation](VERIFICATION_IMPLEMENTATION.md) - État du code

### Fonctionnalités Tablette
- ✅ Sidebar de navigation intelligente (320px)
- ✅ Layout adaptatif portrait/paysage
- ✅ Dashboard optimisé 2 colonnes
- ✅ Support S Pen et gestures Android
- ✅ Détection automatique Samsung Tab S10 Ultra

## 📄 License

Copyright © 2025 KBV DV Lyon
