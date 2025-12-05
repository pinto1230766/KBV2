# KBV Lyon - Gestion des Orateurs Visiteurs

Application complète de gestion des orateurs visiteurs pour la congrégation KBV DV Lyon.

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

## 📄 License

Copyright © 2025 KBV DV Lyon
