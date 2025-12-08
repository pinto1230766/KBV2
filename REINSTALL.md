# Reinstallation Rapide

## Problemes corriges
- Icone personnalisee KBV avec degrade bleu
- Splash screen optimise (500ms au lieu de 20s)
- Toutes les tailles d'icones generees

## Reinstaller sur la tablette

### Option 1: Transfert manuel APK
1. Copiez `android/app/build/outputs/apk/debug/app-debug.apk` sur votre tablette
2. Desinstallez l'ancienne version
3. Installez le nouveau APK

### Option 2: Android Studio
```bash
npx cap open android
```
Puis cliquez sur Run

## Verification
- [ ] Icone KBV visible dans le launcher (degrade bleu)
- [ ] Splash screen rapide (< 1 seconde)
- [ ] App se lance rapidement
- [ ] Mode paysage: Sidebar visible
- [ ] Mode portrait: Tab bar visible
