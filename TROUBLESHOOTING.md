# 🔧 Troubleshooting - KBV Lyon

## ❌ Erreur : "The file name must end with .xml"

### Cause
Fichier XML Android mal placé ou dupliqué dans les ressources.

### Solutions Appliquées ✅

**Problème 1 :** Dossier `playstore/` dans `res/`
```bash
# Supprimer le dossier playstore (non autorisé dans res/)
rmdir /s /q android\app\src\main\res\playstore
```

**Problème 2 :** Couleur `ic_launcher_background` manquante
```bash
# Créer android/app/src/main/res/values/colors.xml
```
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#3B82F6</color>
</resources>
```

### Rebuild
```bash
cd android
.\gradlew clean
.\gradlew assembleDebug
```

**Résultat :** ✅ BUILD SUCCESSFUL

---

## ❌ Appareil non détecté (adb devices vide)

### Solutions
1. **Vérifier le câble USB** - Utiliser un câble data (pas charge seule)
2. **Autoriser le débogage** - Popup sur la tablette à accepter
3. **Redémarrer ADB**
   ```bash
   adb kill-server
   adb start-server
   adb devices
   ```
4. **Vérifier les drivers** - Installer Samsung USB drivers

---

## ❌ Erreur Gradle Build

### Solution 1 : Clean Build
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Solution 2 : Supprimer les caches
```bash
cd android
rmdir /s /q .gradle
rmdir /s /q build
rmdir /s /q app\build
./gradlew assembleDebug
```

### Solution 3 : Invalider les caches Android Studio
**File** → **Invalidate Caches / Restart**

---

## ❌ App ne se lance pas

### Vérifier les logs
```bash
adb logcat | findstr /i "kbv"
```

### Désinstaller et réinstaller
```bash
adb uninstall com.kbvlyon.app
cd android
./gradlew installDebug
```

---

## ❌ Sidebar ne s'affiche pas en paysage

### Vérification
La sidebar nécessite `window.innerWidth >= 1848px` pour Samsung Tab S10 Ultra.

### Test manuel
Ouvrir DevTools dans l'app et vérifier :
```javascript
console.log(window.innerWidth); // Doit être >= 1848 en paysage
```

### Solution temporaire
Modifier `src/components/layout/TabletLayout.tsx` ligne ~40 :
```typescript
// Réduire le seuil si nécessaire
const isSamsungTablet = isTablet && window.innerWidth >= 1024;
```

---

## ❌ Icônes ne s'affichent pas

### Vérifier les fichiers
```bash
dir /s /b android\app\src\main\res\mipmap-*\ic_launcher.png
```

### Régénérer les icônes
```bash
python generate_android_icons.py
npx cap sync android
```

---

## ❌ Performance lente

### Optimisations
1. **Activer le mode développeur** sur la tablette
2. **Désactiver les animations** : Paramètres → Options développeur
3. **Build en mode Release** au lieu de Debug
4. **Vérifier la mémoire** : Fermer les apps en arrière-plan

---

## ❌ Erreur "INSTALL_FAILED_UPDATE_INCOMPATIBLE"

### Solution
```bash
# Désinstaller complètement l'ancienne version
adb uninstall com.kbvlyon.app

# Réinstaller
cd android
./gradlew installDebug
```

---

## ❌ Capacitor Sync échoue

### Solution
```bash
# Nettoyer et resynchroniser
npm run build
npx cap sync android --force
```

---

## ❌ TypeScript Errors

### Solution
```bash
# Vérifier les erreurs
npm run type-check

# Rebuild
npm run build
```

---

## 📞 Support Supplémentaire

Si le problème persiste :

1. **Vérifier les logs complets**
   ```bash
   adb logcat > logs.txt
   ```

2. **Vérifier la version Android**
   - Minimum requis : Android 7.0 (API 24)
   - Recommandé : Android 12+ pour Samsung Tab S10 Ultra

3. **Consulter les guides**
   - `GUIDE_BUILD_DEPLOY.md` - Instructions détaillées
   - `QUICK_START.md` - Démarrage rapide
   - `VERIFICATION_IMPLEMENTATION.md` - État du code

---

## ✅ Checklist de Diagnostic

Avant de demander de l'aide, vérifier :

- [ ] Node.js installé (`node --version`)
- [ ] Android Studio installé
- [ ] Mode développeur activé sur tablette
- [ ] Débogage USB activé
- [ ] Appareil détecté (`adb devices`)
- [ ] Build réussi (`npm run build`)
- [ ] Sync réussi (`npx cap sync android`)
- [ ] Gradle sync terminé (Android Studio)

---

**Dernière mise à jour :** ${new Date().toLocaleDateString('fr-FR')}
