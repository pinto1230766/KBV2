# 📍 OÙ TROUVER LES NOUVELLES MODALES DANS L'APK

## 🎯 Guide Visuel - Localisation des 13 Modales

---

## 📱 1. DASHBOARD (2 modales)

### ⚡ QuickActionsModal
**Comment y accéder :**
1. Ouvrir l'application
2. Aller sur le **Dashboard** (page d'accueil)
3. Chercher le bouton **"Actions rapides (Ctrl+K)"**
4. OU appuyer sur **Ctrl+K** (raccourci clavier)

**Ce que vous verrez :**
- Panneau de recherche d'actions
- 8 actions rapides disponibles
- 4 catégories (Planning, Orateurs, Hôtes, Paramètres)

### 📊 ReportGeneratorModal
**Comment y accéder :**
1. Dashboard
2. Bouton **"Générer un rapport"**

**Ce que vous verrez :**
- Sélection du type de rapport
- Choix de la période
- Options d'export (PDF/Excel/CSV)

---

## ⚙️ 2. SETTINGS (4 modales)

### 💾 BackupManagerModal
**Comment y accéder :**
1. Aller dans **Paramètres** (icône engrenage)
2. Onglet **"Données"**
3. Bouton **"Sauvegardes"**

**Ce que vous verrez :**
- Liste des sauvegardes
- Bouton "Créer une sauvegarde"
- Options de restauration

### 📥 ImportWizardModal
**Comment y accéder :**
1. Paramètres
2. Onglet **"Données"**
3. Bouton **"Importer des données"**

**Ce que vous verrez :**
- Assistant en 5 étapes
- Upload de fichier CSV
- Mapping des colonnes

### 📦 ArchiveManagerModal
**Comment y accéder :**
1. Paramètres
2. Onglet **"Données"**
3. Bouton **"Archives"**

**Ce que vous verrez :**
- Liste des visites archivées
- Filtres par année/statut
- Actions groupées

### 🔍 DuplicateDetectionModal
**Comment y accéder :**
1. Paramètres
2. Onglet **"Doublons"**
3. Bouton **"Lancer l'analyse"**

**Ce que vous verrez :**
- Détection automatique des doublons
- Liste des doublons trouvés
- Options de fusion

---

## 📅 3. PLANNING (3 modales)

### ⚠️ ConflictDetectionModal
**Comment y accéder :**
1. Aller dans **Planning**
2. Cliquer sur une visite
3. La modale s'ouvre automatiquement si conflit détecté

**Ce que vous verrez :**
- Liste des conflits détectés
- Suggestions d'alternatives
- Boutons de résolution

### ❌ CancellationModal
**Comment y accéder :**
1. Planning
2. Cliquer sur une visite
3. Dans le menu d'actions, chercher **"Annuler"**

**Ce que vous verrez :**
- Raisons d'annulation prédéfinies
- Zone de commentaire
- Options de notification

### 🚨 EmergencyReplacementModal
**Comment y accéder :**
1. Planning
2. Cliquer sur une visite
3. Chercher **"Remplaçant d'urgence"**

**Ce que vous verrez :**
- Liste d'orateurs disponibles
- Score de compatibilité
- Filtres de recherche

---

## 👥 4. ORATEURS (1 modale)

### ⭐ FeedbackFormModal
**Comment y accéder :**
1. Aller dans **Orateurs**
2. Cliquer sur un orateur
3. Chercher **"Évaluation"** ou **"Feedback"**

**Ce que vous verrez :**
- Notation par étoiles (1-5)
- 5 catégories d'évaluation
- Zone de commentaires

---

## 🏠 5. DÉTAILS D'UNE VISITE (3 modales)

### 🚗 TravelCoordinationModal
**Comment y accéder :**
1. Planning
2. Cliquer sur une visite
3. Onglet **"Logistique"**
4. Bouton **"Voyage"**

**Ce que vous verrez :**
- Modes de transport
- Gestion du covoiturage
- Calcul des coûts

### 🍽️ MealPlanningModal
**Comment y accéder :**
1. Planning > Visite
2. Onglet **"Logistique"**
3. Bouton **"Repas"**

**Ce que vous verrez :**
- Planification des repas
- Restrictions alimentaires
- Allergies

### 🏡 AccommodationMatchingModal
**Comment y accéder :**
1. Planning > Visite
2. Onglet **"Logistique"**
3. Bouton **"Hébergement"**

**Ce que vous verrez :**
- Liste des hôtes disponibles
- Score de compatibilité
- Historique d'accueil

---

## 🔍 CHECKLIST DE VÉRIFICATION

Après avoir installé la nouvelle APK, vérifiez :

### Dashboard
- [ ] Bouton "Actions rapides (Ctrl+K)" visible
- [ ] Bouton "Générer un rapport" visible

### Paramètres
- [ ] Onglet "Données" présent
- [ ] Bouton "Sauvegardes" dans l'onglet Données
- [ ] Bouton "Importer des données" dans l'onglet Données
- [ ] Bouton "Archives" dans l'onglet Données
- [ ] Onglet "Doublons" présent
- [ ] Bouton "Lancer l'analyse" dans l'onglet Doublons

### Planning
- [ ] Cliquer sur une visite ouvre les détails
- [ ] Onglet "Logistique" visible dans les détails
- [ ] Boutons "Voyage", "Repas", "Hébergement" dans Logistique

### Orateurs
- [ ] Option "Évaluation" ou "Feedback" disponible

---

## ❓ SI VOUS NE VOYEZ PAS LES MODALES

### Vérification 1 : Version de l'APK
```
Paramètres > À propos
Version doit être : 1.20.1 ou supérieure
```

### Vérification 2 : Cache
1. Fermer complètement l'application
2. Vider le cache de l'app (Paramètres Android > Apps > KBV Lyon > Stockage > Vider le cache)
3. Rouvrir l'application

### Vérification 3 : Réinstallation
1. Désinstaller l'ancienne version
2. Installer la nouvelle APK
3. Rouvrir l'application

### Vérification 4 : Build
Assurez-vous d'avoir exécuté :
```bash
npm run build
npx cap sync android
npx cap open android
# Puis générer l'APK dans Android Studio
```

---

## 🎨 APPARENCE DES BOUTONS

### Dashboard
```
┌─────────────────────────────────┐
│  📊 Dashboard                   │
├─────────────────────────────────┤
│                                 │
│  [⚡ Actions rapides (Ctrl+K)] │
│  [📊 Générer un rapport]       │
│                                 │
└─────────────────────────────────┘
```

### Paramètres > Données
```
┌─────────────────────────────────┐
│  ⚙️ Paramètres                  │
├─────────────────────────────────┤
│  [Profil] [Données] [Doublons] │
├─────────────────────────────────┤
│                                 │
│  [💾 Sauvegardes]              │
│  [📥 Importer des données]     │
│  [📦 Archives]                 │
│                                 │
└─────────────────────────────────┘
```

### Planning > Visite > Logistique
```
┌─────────────────────────────────┐
│  📅 Détails de la visite        │
├─────────────────────────────────┤
│  [Infos] [Logistique] [Notes]  │
├─────────────────────────────────┤
│                                 │
│  [🚗 Voyage]                   │
│  [🍽️ Repas]                    │
│  [🏡 Hébergement]              │
│                                 │
└─────────────────────────────────┘
```

---

## 📞 BESOIN D'AIDE ?

Si vous ne trouvez toujours pas les modales :

1. **Vérifiez la version** : Doit être 1.20.1+
2. **Rebuild complet** :
   ```bash
   npm run build
   npx cap sync android
   ```
3. **Générez une nouvelle APK** dans Android Studio
4. **Réinstallez** l'APK sur l'appareil

---

**Les modales sont là, il faut juste savoir où chercher ! 🎯**
