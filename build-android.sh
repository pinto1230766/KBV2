#!/bin/bash

# Script de compilation Android pour KBVFP
# Vérification de l'environnement

echo "🔧 Vérification de l'environnement Android..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si Java est installé
if ! command -v java &> /dev/null; then
    echo "❌ Java n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si ANDROID_HOME est défini
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME n'est pas défini. Veuillez configurer les variables d'environnement Android."
    exit 1
fi

# Vérifier si JAVA_HOME est défini
if [ -z "$JAVA_HOME" ]; then
    echo "❌ JAVA_HOME n'est pas défini. Veuillez configurer Java."
    exit 1
fi

echo "✅ Environnement vérifié avec succès"
echo "📦 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"
echo "📦 Java version: $(java -version 2>&1 | head -n 1)"
echo "📦 ANDROID_HOME: $ANDROID_HOME"
echo "📦 JAVA_HOME: $JAVA_HOME"

# Installation des dépendances npm si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances npm..."
    npm install
fi

# Nettoyage et reconstruction du projet
echo "🧹 Nettoyage du projet..."
rm -rf dist/
rm -rf build/

# Construction du projet web
echo "🌐 Construction du projet web..."
npm run build

# Synchronisation avec le projet Android
echo "📱 Synchronisation avec le projet Android..."
npx cap sync android

# Construction du projet Android
echo "🏗️ Construction du projet Android..."
cd android
chmod +x gradlew
./gradlew clean build

echo "✅ Compilation terminée avec succès!"
echo "📱 Le fichier APK se trouve dans: android/app/build/outputs/apk/debug/app-debug.apk"
