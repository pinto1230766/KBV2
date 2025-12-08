# Fix Build - Solution Rapide

## ❌ Erreur Rencontrée

```
PS C:\Users\FP123\Downloads\KBV2\android> npx cap add android
[error] The Capacitor CLI needs to run at the root of an npm package
```

## ✅ Solution

**Vous êtes dans le mauvais dossier !**

### Étape 1 : Retourner à la racine
```powershell
# Vous êtes ici (MAUVAIS) :
PS C:\Users\FP123\Downloads\KBV2\android>

# Retournez à la racine :
cd ..

# Vous devez être ici (BON) :
PS C:\Users\FP123\Downloads\KBV2>
```

### Étape 2 : Build et Test
```powershell
# 1. Build le projet
npm run build

# 2. Synchroniser avec Android (pas "add", le dossier existe déjà)
npx cap sync android

# 3. Ouvrir Android Studio
npx cap open android
```

## 🔍 Explication

- ❌ `npx cap add android` → Crée un nouveau projet Android (déjà fait)
- ✅ `npx cap sync android` → Synchronise le code existant

Le dossier `android/` existe déjà, vous n'avez pas besoin de le recréer !

## 🚀 Commandes Complètes

```powershell
# Depuis C:\Users\FP123\Downloads\KBV2\android>
cd ..

# Maintenant depuis C:\Users\FP123\Downloads\KBV2>
npm run build
npx cap sync android
npx cap open android
```

## ⚡ Ou Utilisez le Script

```powershell
# Double-cliquer ou exécuter :
.\build-and-test.bat
```

Le script fait tout automatiquement depuis la racine du projet.
