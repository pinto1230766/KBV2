# Quick Test - 3 Commandes pour Tester

## 🚀 Méthode Rapide

### Option 1 : Script Automatique (Recommandé)
```bash
# Double-cliquer sur le fichier ou exécuter :
build-and-test.bat
```

### Option 2 : Commandes Manuelles
```bash
# 1. Build
npm run build

# 2. Sync Android
npx cap sync android

# 3. Ouvrir Android Studio
npx cap open android
```

---

## 📱 Dans Android Studio

1. **Connecter la tablette**
   - USB branché
   - Mode développeur activé
   - Débogage USB activé

2. **Lancer l'app**
   - Cliquer sur ▶️ (Run)
   - Sélectionner "Samsung SM-X926"
   - Attendre l'installation

3. **Tester rapidement**
   - ✅ Icône visible dans launcher
   - ✅ Rotation portrait/paysage
   - ✅ Sidebar en paysage
   - ✅ TabBar en portrait

---

## ✅ Checklist Minimale

### Portrait
- [ ] TabBar visible en bas
- [ ] 5 onglets fonctionnels
- [ ] Navigation fluide

### Paysage
- [ ] Sidebar visible à gauche (320px)
- [ ] 6 items de navigation
- [ ] Dashboard en 2 colonnes

### Rotation
- [ ] Transition fluide
- [ ] Pas de lag
- [ ] Pas de perte de données

---

## 🐛 Si Problème

### App ne s'installe pas
```bash
# Nettoyer et rebuild
npm run build
npx cap sync android --force
```

### Sidebar ne s'affiche pas
- Vérifier la largeur d'écran : doit être ≥ 1848px
- Vérifier l'orientation : doit être "landscape"
- Regarder le debug info en haut à gauche

### Performance lente
- Activer le mode production dans Android Studio
- Vérifier la mémoire disponible
- Redémarrer la tablette

---

## 📊 Résultat Attendu

**Mode Portrait :**
```
┌─────────────────────┐
│   KBV LYON FP       │ ← NavBar
├─────────────────────┤
│                     │
│   Dashboard         │
│   (1 colonne)       │
│                     │
├─────────────────────┤
│ 🏠 📅 💬 👥 ⚙️    │ ← TabBar
└─────────────────────┘
```

**Mode Paysage :**
```
┌────┬──────────────────────────────┐
│    │   KBV LYON FP                │ ← NavBar
│ S  ├──────────────────────────────┤
│ I  │                              │
│ D  │   Dashboard (2 colonnes)     │
│ E  │   ┌──────────┬──────────┐    │
│ B  │   │ Gauche   │ Droite   │    │
│ A  │   │ (8/12)   │ (4/12)   │    │
│ R  │   └──────────┴──────────┘    │
│    │                              │
└────┴──────────────────────────────┘
```

---

**Temps total : ~5 minutes** ⏱️
