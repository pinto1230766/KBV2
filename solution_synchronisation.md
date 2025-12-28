# Solution de Synchronisation des Versions - KBV2

## 🎯 Problème Identifié
- **Version Web** : `1.20.1` (npm package.json)
- **Version Android** : `1.2` (android/app/build.gradle, versionCode: 3)
- **Décalage** : La version Android est largement en retard

## 🚀 Solutions Recommandées

### Option 1 : Synchronisation Immédiate (Recommandée)

#### Étape 1 : Mettre à jour les versions
```bash
# 1. Mettre à jour package.json à 1.20.2 (pour différencier de la web)
# 2. Mettre à jour android/app/build.gradle :
versionCode 4
versionName "1.20.2"
```

#### Étape 2 : Construire et déployer
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
```

### Option 2 : Mise à Jour Automatique (Capacitor Appflow)

#### Configuration Appflow
```typescript
// Dans capacitor.config.ts
const config: CapacitorConfig = {
  // ... autres configs
  plugins: {
    SplashScreen: {
      // ... autres configs
    },
    CapacitorUpdater: {
      autoUpdate: true,
      channel: 'production'
    }
  }
}
```

#### Installation du plugin
```bash
npm install @capacitor/app-updater
npx cap add @capacitor/app-updater
```

### Option 3 : Script de Synchronisation Automatique

#### Création du script sync-versions.js
```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Lire package.json
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Générer la nouvelle version Android
const webVersion = packageJson.version;
const [major, minor, patch] = webVersion.split('.');
const androidVersion = `${major}.${minor}`;
const versionCode = parseInt(`${major}${minor.padStart(2, '0')}${patch.padStart(2, '0')}`);

// Mettre à jour build.gradle
const buildGradlePath = path.join(__dirname, 'android', 'app', 'build.gradle');
let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

buildGradle = buildGradle.replace(
  /versionCode \d+/,
  `versionCode ${versionCode}`
);
buildGradle = buildGradle.replace(
  /versionName "[^"]*"/,
  `versionName "${androidVersion}"`
);

fs.writeFileSync(buildGradlePath, buildGradle);

console.log(`✅ Synchronisation terminée :`);
console.log(`   Web: ${webVersion}`);
console.log(`   Android: ${androidVersion} (${versionCode})`);
```

## 🛠️ Étapes d'Implémentation

### Phase 1 : Préparation (5 min)
1. ✅ Backup du projet
2. ✅ Identifier les versions actuelles
3. ✅ Choisir la solution

### Phase 2 : Synchronisation (10 min)
1. ✅ Mettre à jour les versions
2. ✅ Exécuter le script de synchronisation
3. ✅ Builder l'application Android

### Phase 3 : Test et Déploiement (15 min)
1. ✅ Tester sur l'émulateur
2. ✅ Installer sur la tablette
3. ✅ Vérifier la synchronisation

### Phase 4 : Automatisation (Optionnel)
1. ✅ Configurer Appflow
2. ✅ Mettre en place les mises à jour automatiques
3. ✅ Documenter le processus

## 📱 Commandes de Diagnostic

### Vérifier la version actuelle sur l'appareil
```bash
adb shell dumpsys package com.kbvfp.app | grep versionName
adb shell dumpsys package com.kbvfp.app | grep versionCode
```

### Forcer une mise à jour
```bash
# Installer la nouvelle version
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

## ⚡ Recommandation Immédiate

**Pour résoudre rapidement le problème :**

1. **Exécuter ce script :**
```bash
node sync-versions.js
npm run build
npx cap sync android
cd android && ./gradlew assembleRelease
```

2. **Installer sur la tablette :**
```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

3. **Vérifier la synchronisation :**
   - Ouvrir l'app sur la tablette
   - Comparer avec la version web
   - Confirmer que les versions correspondent

## 🔄 Processus de Maintenance

Pour éviter que le problème se reproduise :

1. **Script de pré-release :** Automatiser la synchronisation avant chaque release
2. **Tests de compatibilité :** Vérifier web/Android avant déploiement
3. **Monitoring :** Surveiller les versions déployées
4. **Documentation :** Maintenir cette procédure à jour
