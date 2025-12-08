# 🚀 Quick Start - Déploiement Samsung Tab S10 Ultra

## En 3 Commandes

```bash
# 1. Build
npm run build && npx cap sync android

# 2. Ouvrir Android Studio
npx cap open android

# 3. Cliquer sur Run ▶️
```

---

## 📋 Checklist Rapide

### Avant de commencer
- [ ] Mode développeur activé sur la tablette
- [ ] Débogage USB activé
- [ ] Tablette connectée via USB
- [ ] Android Studio installé

### Build et Installation
- [ ] `npm install` terminé
- [ ] `npm run build` réussi
- [ ] `npx cap sync android` réussi
- [ ] Android Studio ouvert
- [ ] Gradle sync terminé
- [ ] App installée sur tablette

### Tests Essentiels
- [ ] Icône visible dans launcher
- [ ] App se lance
- [ ] Mode portrait : Tab bar visible
- [ ] Mode paysage : Sidebar visible
- [ ] Navigation fonctionne
- [ ] Dashboard affiche les données

---

## ⚡ Commandes Utiles

```bash
# Voir les appareils connectés
adb devices

# Logs en temps réel
adb logcat | grep -i "kbv"

# Réinstaller rapidement
cd android && ./gradlew installDebug

# Nettoyer et rebuild
cd android && ./gradlew clean assembleDebug
```

---

## 🆘 Problèmes Courants

### Appareil non détecté
→ Vérifier câble USB + autoriser débogage sur tablette

### Erreur Gradle
→ `cd android && ./gradlew clean`

### App ne se lance pas
→ Désinstaller et réinstaller

---

## 📞 Support

Voir les guides détaillés :
- `GUIDE_BUILD_DEPLOY.md` - Guide complet
- `TEMPLATE_RAPPORT_TEST.md` - Tests à effectuer
- `VERIFICATION_IMPLEMENTATION.md` - État du code

---

**Temps estimé : 10-15 minutes** ⏱️
