# 🔍 DIAGNOSTIC - Accueillants Manquants

## ❌ Problème
Les accueillants ne sont pas visibles dans l'APK sur la tablette.

## 🔧 Solution Appliquée

### Fix 1 : Stockage Persistant
- ✅ Utilisation de Capacitor Preferences au lieu d'IndexedDB
- ✅ Migration automatique des données

### Fix 2 : Chargement des Hôtes par Défaut
- ✅ Force le chargement des 12 hôtes par défaut si manquants
- ✅ Sauvegarde immédiate dans le stockage

## 📋 Liste des 12 Accueillants par Défaut

1. **Jean-Paul Batista** - 182 Avenue Felix Faure, 69003
2. **Suzy** - 14 bis Montée des Roches, 69009
3. **Alexis** - 13 Avenue Debrousse, 69005
4. **Andréa** - 25c Rue Georges Courteline, Villeurbanne
5. **Dara & Lia** - 16 Rue Imbert Colomes, 69001
6. **José Freitas** - 27 Av Maréchal Foch, 69110
7. **Paulo Martins** - 18 Rue des Soeurs Bouviers, 69005
8. **Fátima** - 9 Chemin de la Vire, Caluire
9. **Sanches** - 132 Av. L'Aqueduc de Beaunant, 69110 Ste Foy
10. **Torres** - 15 Cours Rouget de l'Isle, Rillieux
11. **Nathalie** - 86 Rue Pierre Delore, 69008
12. **Francisco Pinto** - 20 Rue Professeur Patel, 69009

## 🧪 Test sur la Tablette

### Étape 1 : Vérifier la Version
1. Ouvrir l'app
2. Aller dans **Paramètres**
3. Vérifier : **Version 1.20.1** ou supérieure

### Étape 2 : Vérifier les Accueillants
1. Aller dans **Paramètres**
2. Chercher l'onglet ou section **"Accueillants"** ou **"Hôtes"**
3. Compter le nombre d'accueillants

**Résultat attendu** : 12 accueillants

### Étape 3 : Si Toujours Vide

#### Option A : Vider le Cache
```
Paramètres Android > Apps > KBV Lyon > Stockage > Vider le cache
```
Puis rouvrir l'app.

#### Option B : Réinstallation Complète
1. Désinstaller complètement l'app
2. Installer la nouvelle APK (v1.20.1)
3. Ouvrir l'app
4. Les 12 accueillants devraient apparaître

#### Option C : Forcer le Rechargement
Dans l'app :
1. Aller dans **Paramètres**
2. Chercher **"Réinitialiser les données"** ou **"Charger les données par défaut"**
3. Confirmer

## 🔍 Diagnostic Technique (Chrome DevTools)

### Via USB Debugging

1. Connecter la tablette en USB
2. Activer le débogage USB
3. Ouvrir Chrome sur PC
4. Aller sur `chrome://inspect`
5. Sélectionner l'app KBV
6. Ouvrir la console
7. Exécuter :

```javascript
// Vérifier les données stockées
Capacitor.Plugins.Preferences.get({ key: 'kbv-app-data' })
  .then(result => {
    const data = JSON.parse(result.value);
    console.log('Nombre d\'accueillants:', data.hosts?.length || 0);
    console.log('Accueillants:', data.hosts);
  });

// Forcer le rechargement des hôtes par défaut
const defaultHosts = [
  { "nom": "Jean-Paul Batista", "telephone": "", "gender": "male", "address": "182 Avenue Felix Faure, 69003", "notes": "Logement en centre-ville, idéal pour orateur sans voiture. Pas d'animaux.", "unavailableDates": [], "tags": ["centre-ville", "sans-animaux"] },
  { "nom": "Suzy", "telephone": "", "gender": "female", "address": "14 bis Montée des Roches, 69009", "unavailableDates": [], "tags": ["calme"] },
  { "nom": "Alexis", "telephone": "", "gender": "male", "address": "13 Avenue Debrousse, 69005", "unavailableDates": [] },
  { "nom": "Andréa", "telephone": "", "gender": "female", "address": "25c Rue Georges Courteline, Villeurbanne", "unavailableDates": [] },
  { "nom": "Dara & Lia", "telephone": "", "gender": "couple", "address": "16 Rue Imbert Colomes, 69001", "unavailableDates": [], "tags": ["proche salle", "escaliers"] },
  { "nom": "José Freitas", "telephone": "", "gender": "male", "address": "27 Av Maréchal Foch, 69110", "notes": "Possède un chat. Idéal pour un orateur seul.", "unavailableDates": [], "tags": ["animaux", "chat"] },
  { "nom": "Paulo Martins", "telephone": "", "gender": "male", "address": "18 Rue des Soeurs Bouviers, 69005", "unavailableDates": [], "tags": ["escaliers"] },
  { "nom": "Fátima", "telephone": "", "gender": "female", "address": "9 Chemin de la Vire, Caluire", "unavailableDates": [] },
  { "nom": "Sanches", "telephone": "", "gender": "male", "address": "132 Av. L'Aqueduc de Beaunant, 69110 Ste Foy", "unavailableDates": [], "tags": ["sans escaliers"] },
  { "nom": "Torres", "telephone": "", "gender": "male", "address": "15 Cours Rouget de l'Isle, Rillieux", "notes": "Famille avec jeunes enfants, très accueillants.", "unavailableDates": [], "tags": ["enfants"] },
  { "nom": "Nathalie", "telephone": "", "gender": "female", "address": "86 Rue Pierre Delore, 69008", "unavailableDates": [] },
  { "nom": "Francisco Pinto", "telephone": "", "gender": "male", "address": "20 Rue Professeur Patel, 69009", "unavailableDates": [] }
];

// Récupérer les données actuelles
Capacitor.Plugins.Preferences.get({ key: 'kbv-app-data' })
  .then(result => {
    const data = JSON.parse(result.value);
    data.hosts = defaultHosts;
    return Capacitor.Plugins.Preferences.set({
      key: 'kbv-app-data',
      value: JSON.stringify(data)
    });
  })
  .then(() => {
    console.log('✅ Hôtes restaurés ! Rechargez l\'app.');
    location.reload();
  });
```

## 📝 Checklist de Vérification

- [ ] Version de l'APK : 1.20.1+
- [ ] Cache vidé
- [ ] App réinstallée
- [ ] Paramètres > Accueillants accessible
- [ ] Nombre d'accueillants : 12
- [ ] Données persistent après fermeture de l'app

## 🚀 Rebuild Complet

Si rien ne fonctionne, rebuild complet :

```bash
# 1. Clean
npm run build

# 2. Sync
npx cap sync android

# 3. Android Studio
npx cap open android

# 4. Clean Project
Build > Clean Project

# 5. Rebuild
Build > Rebuild Project

# 6. Build APK
Build > Build APK(s)

# 7. Installer sur tablette
```

## 📊 Fichiers Modifiés

1. **src/utils/storage.ts** - Stockage hybride
2. **src/contexts/DataContext.tsx** - Force chargement des hôtes
3. **src/data/constants.ts** - 12 hôtes par défaut

## ✅ Résultat Attendu

Après installation de la nouvelle APK :
- ✅ 12 accueillants visibles dans Paramètres
- ✅ Données persistent après fermeture
- ✅ Données persistent après réinstallation

---

**Si le problème persiste, utilisez le script de diagnostic dans Chrome DevTools !**
