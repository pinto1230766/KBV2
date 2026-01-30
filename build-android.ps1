#!/usr/bin/env pwsh
# Script de build automatisé pour KBV2 sur tablette Samsung
# Usage: .\build-android.ps1

param(
    [switch]$Install,
    [switch]$BuildOnly,
    [switch]$Debug
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 KBV2 - Build Android pour Samsung" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier les prérequis
Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow

# Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Node.js n'est pas installé. Installez-le depuis https://nodejs.org"
    exit 1
}
Write-Host "   ✅ Node.js : $(node --version)" -ForegroundColor Green

# Vérifier si on est dans le bon dossier
if (!(Test-Path "package.json")) {
    Write-Error "❌ Pas de package.json trouvé. Exécutez ce script depuis la racine du projet KBV2."
    exit 1
}

# Étape 1: Installation des dépendances
Write-Host ""
Write-Host "📦 Étape 1/5: Installation des dépendances npm..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Échec de l'installation npm"
    exit 1
}
Write-Host "   ✅ Dépendances installées" -ForegroundColor Green

# Étape 2: Build web
Write-Host ""
Write-Host "🔨 Étape 2/5: Build du projet web..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Échec du build web"
    exit 1
}
Write-Host "   ✅ Build web terminé" -ForegroundColor Green

# Étape 3: Synchronisation Capacitor
Write-Host ""
Write-Host "🔄 Étape 3/5: Synchronisation Capacitor..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Échec de la synchronisation Capacitor"
    exit 1
}
Write-Host "   ✅ Synchronisation terminée" -ForegroundColor Green

# Si BuildOnly, on s'arrête là
if ($BuildOnly) {
    Write-Host ""
    Write-Host "✅ Build terminé! Le projet Android est prêt dans android/" -ForegroundColor Green
    Write-Host "   Ouvrez Android Studio avec: npx cap open android" -ForegroundColor Cyan
    exit 0
}

# Étape 4: Build APK
Write-Host ""
Write-Host "📱 Étape 4/5: Build de l'APK..." -ForegroundColor Yellow

$BuildType = if ($Debug) { "Debug" } else { "Release" }
$ApkPath = if ($Debug) { 
    "android\app\build\outputs\apk\debug\app-debug.apk" 
} else { 
    "android\app\build\outputs\apk\release\app-release-unsigned.apk" 
}

# Vérifier si Gradle est disponible
if (!(Test-Path "android\gradlew.bat")) {
    Write-Error "❌ Gradle wrapper non trouvé. Exécutez d'abord: npx cap add android"
    exit 1
}

# Build avec Gradle
Push-Location android
if ($Debug) {
    .\gradlew.bat assembleDebug
} else {
    .\gradlew.bat assembleRelease
}
$gradleExit = $LASTEXITCODE
Pop-Location

if ($gradleExit -ne 0) {
    Write-Error "❌ Échec du build Gradle"
    exit 1
}

Write-Host "   ✅ APK $BuildType généré" -ForegroundColor Green

# Étape 5: Installation et lancement
if ($Install) {
    Write-Host ""
    Write-Host "📲 Étape 5/5: Installation sur l'appareil..." -ForegroundColor Yellow
    
    # Vérifier ADB
    if (!(Get-Command adb -ErrorAction SilentlyContinue)) {
        Write-Warning "⚠️  ADB non trouvé dans le PATH"
        Write-Host "   Vérifiez que Android Studio est installé et que le SDK Android est dans votre PATH"
        Write-Host "   L'APK est disponible ici: $ApkPath"
        exit 0
    }
    
    # Lister les appareils connectés
    $devices = adb devices | Select-String -Pattern "^\S+\s+device$" 
    if (!$devices) {
        Write-Warning "⚠️  Aucun appareil Android détecté"
        Write-Host "   Connectez votre tablette Samsung en USB (avec débogage USB activé)"
        Write-Host "   Ou installez manuellement l'APK: $ApkPath"
        exit 0
    }
    
    Write-Host "   Appareils trouvés:" -ForegroundColor Gray
    $devices | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
    
    # Installation
    adb install -r "$ApkPath"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Application installée!" -ForegroundColor Green
        
        # Lancement
        Write-Host ""
        Write-Host "🚀 Lancement de l'application..." -ForegroundColor Yellow
        adb shell am start -n "com.kbv2.app/.MainActivity"
        Write-Host "   ✅ KBV2 démarré sur la tablette!" -ForegroundColor Green
    } else {
        Write-Warning "⚠️  L'installation a échoué. Essayez d'installer manuellement: $ApkPath"
    }
} else {
    Write-Host ""
    Write-Host "📦 Pour installer, utilisez:" -ForegroundColor Cyan
    Write-Host "   .\build-android.ps1 -Install" -ForegroundColor White
    Write-Host "   Ou transférez l'APK manuellement: $ApkPath" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Build terminé avec succès!" -ForegroundColor Green
Write-Host ""

# Afficher la taille de l'APK
if (Test-Path $ApkPath) {
    $size = (Get-Item $ApkPath).Length / 1MB
    Write-Host "📊 Taille de l'APK: {0:N2} MB" -f $size -ForegroundColor Gray
    Write-Host "📁 Emplacement: $ApkPath" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🔧 Commandes utiles:" -ForegroundColor Cyan
Write-Host "   npx cap open android  → Ouvrir dans Android Studio" -ForegroundColor White
Write-Host "   adb logcat            → Voir les logs" -ForegroundColor White
Write-Host "   adb devices           → Lister les appareils" -ForegroundColor White
