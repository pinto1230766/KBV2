# Import des Données Google Sheet dans l'APK

## 🎯 Méthode Simple (Recommandée)

### Étape 1 : Exporter depuis Google Sheets

1. Ouvrez votre Google Sheet : https://docs.google.com/spreadsheets/d/1drIzPPi6AohCroSyUkF1UmMFxuEtMACBF4XATDjBOcg/edit

2. Pour chaque onglet (Orateurs, Visites, Contacts) :
   - Cliquez sur l'onglet
   - **Fichier > Télécharger > Valeurs séparées par des virgules (.csv)**
   - Sauvegardez les 3 fichiers

### Étape 2 : Utiliser l'application web

1. Ouvrez l'application dans Chrome : `npm run dev`
2. Allez dans **Paramètres > Import/Export**
3. Cliquez sur **"Importer depuis Google Sheets"**
4. Entrez l'ID du Sheet : `1drIzPPi6AohCroSyUkF1UmMFxuEtMACBF4XATDjBOcg`
5. Entrez la clé API : `AIzaSyC2llqldfKnDeZ9Y1SwRXC8QE0f8Ds6lNI`
6. Cliquez sur **"Synchroniser"**

### Étape 3 : Exporter les données

1. Une fois les données synchronisées
2. Allez dans **Paramètres > Import/Export**
3. Cliquez sur **"Exporter les données"**
4. Un fichier JSON sera téléchargé

### Étape 4 : Inclure dans l'APK

```bash
# Copiez le fichier exporté
copy "C:\Users\FP123\Downloads\kbv-data-export-*.json" "C:\Users\FP123\Downloads\KBV2\src\data\initialData.json"

# Rebuild l'application
npm run build
npx cap sync android
```

---

## 🚀 Méthode Alternative : Export Manuel

Si la synchronisation ne fonctionne pas, suivez ces étapes :

### 1. Ouvrez l'application web

```bash
npm run dev
```

### 2. Ouvrez la console du navigateur (F12)

### 3. Collez ce code dans la console :

```javascript
// Récupérer toutes les données de localStorage
const data = localStorage.getItem('kbv-data');
if (data) {
  // Créer un fichier téléchargeable
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kbv-initial-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log('✅ Fichier téléchargé !');
} else {
  console.log('❌ Aucune donnée trouvée. Synchronisez d\'abord avec Google Sheets.');
}
```

### 4. Le fichier sera téléchargé automatiquement

### 5. Copiez-le dans le projet

```bash
copy "C:\Users\FP123\Downloads\kbv-initial-data.json" "C:\Users\FP123\Downloads\KBV2\src\data\initialData.json"
```

---

## 📝 Modifier le Code pour Charger les Données Initiales

Une fois le fichier `src/data/initialData.json` créé, je vais modifier le code pour :

1. Charger ces données au premier lancement
2. Les sauvegarder dans IndexedDB
3. Permettre la synchronisation ultérieure

**Dites-moi quand vous avez le fichier JSON et je modifierai le code !**

---

## ⚡ Résumé Rapide

1. **Synchronisez** avec Google Sheets dans l'app web
2. **Exportez** les données (bouton dans Paramètres)
3. **Copiez** le fichier JSON dans `src/data/initialData.json`
4. **Rebuild** : `npm run build && npx cap sync android`
5. **Testez** sur la tablette

Les données seront incluses dans l'APK ! 🎉
