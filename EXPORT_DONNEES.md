# Guide d'Export des Données Google Sheet vers l'APK

## 🎯 Objectif
Inclure les données actuelles de votre Google Sheet directement dans l'APK pour qu'elles soient disponibles au premier lancement.

## 📋 Méthode 1 : Via l'Application Web (Recommandé)

### Étape 1 : Exporter depuis l'application
1. Ouvrez l'application dans Chrome : `http://localhost:5173`
2. Allez dans **Paramètres** (⚙️)
3. Section **Import/Export**
4. Cliquez sur **"Exporter les données"**
5. Un fichier `kbv-data-export-YYYY-MM-DD.json` sera téléchargé

### Étape 2 : Copier le fichier dans le projet
```bash
# Copiez le fichier téléchargé dans le projet
copy "C:\Users\FP123\Downloads\kbv-data-export-*.json" "C:\Users\FP123\Downloads\KBV2\src\data\initialData.json"
```

### Étape 3 : Rebuild l'application
```bash
npm run build
npx cap sync android
```

## 📋 Méthode 2 : Export Manuel depuis Google Sheets

### Étape 1 : Ouvrir Google Sheets
1. Ouvrez votre Google Sheet KBV
2. Allez dans **Fichier > Télécharger > CSV**
3. Téléchargez chaque onglet (Orateurs, Visites, Contacts)

### Étape 2 : Convertir en JSON
Je vais créer un script pour vous qui convertit les CSV en JSON.

## 📋 Méthode 3 : Export Direct (Plus Rapide)

### Utilisez la fonction d'export intégrée

1. Dans l'application web, ouvrez la console (F12)
2. Collez ce code :

```javascript
// Exporter toutes les données
const exportData = () => {
  const data = localStorage.getItem('kbv-data');
  if (data) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kbv-initial-data.json';
    a.click();
  }
};
exportData();
```

3. Le fichier sera téléchargé automatiquement

## 🔧 Intégration dans le Code

Une fois le fichier `initialData.json` créé, je vais modifier le code pour :
1. Charger ces données au premier lancement
2. Les sauvegarder dans IndexedDB
3. Permettre la synchronisation ultérieure

## ⚡ Quelle méthode préférez-vous ?

**Option A** : Vous exportez depuis l'app web et me donnez le fichier JSON
**Option B** : Vous me donnez l'URL de votre Google Sheet et je crée un script d'export
**Option C** : Vous copiez-collez les données ici et je crée le fichier JSON

Dites-moi quelle option vous convient !
