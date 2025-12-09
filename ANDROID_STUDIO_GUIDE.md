# 📱 Guide de Compilation APK - KBVFP v1.20

## 🎯 Configuration Terminée

### ✅ Prérequis déjà configurés

- **Package ID** : `com.kbvfp.app`
- **Nom de l'app** : `KBVFP`
- **Version** : `1.20.0`
- **Build Web** : ✅ Complété (dist/)
- **Synchronisation Capacitor** : ✅ Réussie
- **Permissions Android** : ✅ Configurées (toutes permissions ajoutées)
- **Icônes Android** : ✅ Générées (toutes résolutions)

---

## 🔧 Instructions pour Android Studio

### 1. **Ouvrir le Projet Android**

```bash
# Dans Android Studio, ouvrir le dossier :
android/
```

### 2. **Vérifier la Configuration**

#### **Fichier : `android/app/build.gradle`**

```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.kbvfp.app"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1200
        versionName "1.20.0"
        
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        aaptOptions {
            // Capacitor
            files "../capacitor.settings.gradle"
        }
    }
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.debug // Pour tests
        }
    }
}
```

#### **Fichier : `android/app/src/main/AndroidManifest.xml`**

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application 
        android:allowBackup="true" 
        android:icon="@mipmap/ic_launcher" 
        android:label="@string/app_name" 
        android:roundIcon="@mipmap/ic_launcher_round" 
        android:supportsRtl="true" 
        android:theme="@style/AppTheme">
        
        <!-- Activité principale -->
        <activity 
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode" 
            android:name=".MainActivity" 
            android:label="@string/title_activity_main" 
            android:theme="@style/AppTheme.NoActionBarLaunch" 
            android:launchMode="singleTask" 
            android:exported="true">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        <!-- FileProvider pour le partage de fichiers -->
        <provider 
            android:name="androidx.core.content.FileProvider" 
            android:authorities="${applicationId}.fileprovider" 
            android:exported="false" 
            android:grantUriPermissions="true">
            <meta-data 
                android:name="android.support.FILE_PROVIDER_PATHS" 
                android:resource="@xml/file_paths"></meta-data>
        </provider>
    </application>

    <!-- Permissions configurées -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
    <uses-permission android:name="android.permission.NFC" />
    <uses-permission android:name="android.permission.USE_FINGERPRINT" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />
</manifest>
```

---

## 🚀 Étapes de Compilation

### **Option 1 : APK de Débogage (Rapide)**

1. **Connecter un appareil Android** ou **démarrer un émulateur**
2. **Dans Android Studio** :
   - Cliquer sur **"Build"** → **"Build Bundle(s) / APK(s)"** → **"Build APK(s)"**
   - Attendre la compilation (2-5 minutes)
3. **Localiser l'APK** :
   - Fichier → **Open in → Explorer**
   - Aller dans : `android/app/build/outputs/apk/debug/app-debug.apk`

### **Option 2 : APK de Release (Optimisé)**

1. **Créer une clé de signature** :

   ```bash
   keytool -genkey -v -keystore kbvfp-release-key.keystore -alias kbvfp -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configurer le signing** dans `android/app/build.gradle` :

   ```gradle
   android {
       signingConfigs {
           release {
               if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                   storeFile file(MYAPP_RELEASE_STORE_FILE)
                   storePassword MYAPP_RELEASE_STORE_PASSWORD
                   keyAlias MYAPP_RELEASE_KEY_ALIAS
                   keyPassword MYAPP_RELEASE_KEY_PASSWORD
               }
           }
       }
       
       buildTypes {
           release {
               minifyEnabled true
               shrinkResources true
               proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
               signingConfig signingConfigs.release
           }
       }
   }
   ```

3. **Compiler l'APK release** :
   - **Build** → **Generate Signed Bundle / APK**
   - Choisir **APK**
   - Sélectionner la clé de signature
   - Choisir **release**

---

## 🔍 Vérifications Post-Compilation

### **Structure des Fichiers Générés**

```
android/app/build/outputs/apk/
├── debug/
│   └── app-debug.apk          # APK de test (non signé)
└── release/
    └── app-release.apk        # APK de production (signé)
```

### **Icônes Vérifiées**

```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png         # 48x48
├── mipmap-hdpi/ic_launcher.png         # 72x72
├── mipmap-xhdpi/ic_launcher.png        # 96x96
├── mipmap-xxhdpi/ic_launcher.png       # 144x144
├── mipmap-xxxhdpi/ic_launcher.png      # 192x192
└── playstore/ic_launcher.png           # 512x512
```

---

## 📊 Informations de l'Application

### **Détails APK**

- **Nom** : KBVFP
- **Package** : com.kbvfp.app
- **Version** : 1.20.0 (1200)
- **Taille estimée** : ~15-25 MB
- **SDK Minimum** : Android 5.1 (API 22)
- **SDK Cible** : Android 14 (API 34)

### **Permissions Incluses**

✅ Internet, Network State, WiFi State  
✅ Notifications, Vibrate, Wake Lock  
✅ Storage (Read/Write), Camera, Audio  
✅ Location (Fine/Coarse), Bluetooth  
✅ NFC, Biometric, Alarms  
✅ Foreground Service, Boot Completed  

### **Fonctionnalités Capacitor**

✅ Local Notifications  
✅ Preferences (Stockage local)  
✅ Share (Partage de fichiers)  

---

## 🐛 Dépannage Courant

### **Erreur : "SDK not found"**

```bash
# Installer Android SDK via Android Studio
# ou définir ANDROID_HOME
export ANDROID_HOME=/path/to/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### **Erreur : "Build failed"**

1. **Clean Project** : Build → Clean Project
2. **Rebuild** : Build → Rebuild Project
3. **Sync** : File → Sync Project with Gradle Files

### **Erreur : "Signing not configured"**

- Utiliser l'APK debug pour les tests
- Configurer la signature pour la release

### **Erreur : "Permission denied"**

- Vérifier les permissions dans AndroidManifest.xml
- Redemarrer l'appareil après installation

---

## 📱 Installation et Test

### **Installer sur l'Appareil**

```bash
# Via ADB
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Ou copier le fichier APK et l'installer manuellement
```

### **Vérifier l'Installation**

1. **Ouvrir l'application** KBVFP
2. **Vérifier l'icône** (KBV LYON PF en bleu)
3. **Tester les fonctionnalités** principales
4. **Vérifier les notifications** (si activées)

---

## 🎉 Félicitations

Votre application KBVFP v1.20 est maintenant prête pour Android !

### **Prochaines Étapes**

- [ ] Tester sur différents appareils Android
- [ ] Publier sur Google Play Store (si souhaité)
- [ ] Configurer les mises à jour automatiques
- [ ] Surveiller les crash reports

---

*Guide généré le 07/12/2025 à 22:20 - KBVFP v1.20*
