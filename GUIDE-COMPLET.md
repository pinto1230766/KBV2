# 🚀 KBV2 - Application Web Locale avec Synchronisation WhatsApp

## 📋 Installation Complète

### 1. Installation de l'Application Web

```bash
# Double-cliquez sur ce fichier pour démarrer l'application
start-kbv2.bat

# Ou configurez le démarrage automatique:
setup-auto-start.bat
```

### 2. Accès à l'Application

- **URL**: <http://localhost:5173>
- **Démarrage**: Manuel ou automatique au démarrage du PC
- **Navigateur**: Chrome, Firefox, Edge recommandés

## 📱 Synchronisation WhatsApp

### Depuis le PC (Export)

1. **Allez dans Paramètres** > **Gestion des données**
2. **Cliquez sur "WhatsApp"** (bouton vert)
3. **Partagez automatiquement** via WhatsApp Web
4. **Ou téléchargez** le fichier et partagez manuellement

### Depuis Mobile/Tablette (Import)

1. **Recevez le fichier** .json via WhatsApp
2. **Ouvrez KBV2** sur votre appareil
3. **Allez dans Paramètres** > **Importation**
4. **Sélectionnez le fichier** reçu
5. **Confirmez l'importation**

## 🔄 Flux Complet de Travail

### PC → WhatsApp → Mobile

```text
PC (Gestion)     →     WhatsApp (Partage)     →     Mobile (Utilisation)
├── Ajouter orateur       ├── Envoyer backup       ├── Recevoir fichier
├── Planifier visite      ├── Partager .json      ├── Importer données
├── Envoyer messages      ├── Synchroniser        ├── Consulter planning
└── Créer backup         └── Transférer          └── Utiliser données
```

## 🛠️ Fonctionnalités Disponibles

### ✅ Gestion Complète
- **Orateurs**: Ajout, modification, suppression
- **Visites**: Planning, calendrier, statuts
- **Hôtes**: Gestion des accueils
- **Messages**: Communications automatiques

### ✅ Synchronisation
- **Backup automatique**: Quotidien/hebdomadaire
- **Export WhatsApp**: Partage instantané
- **Import mobile**: Restauration facile
- **Multi-appareils**: PC + Mobile + Tablette

### ✅ Accessibilité
- **Interface adaptative**: PC, tablette, mobile
- **Lecteurs d'écran**: WCAG compliant
- **Thèmes**: Clair/Sombre
- **Langues**: Français configuré

## 📊 Statistiques en Temps Réel

- **Tableau de bord**: Vue d'ensemble complète
- **Rapports**: Export PDF/Excel
- **Graphiques**: Tendances et analyses
- **Notifications**: Rappels automatiques

## 🔧 Maintenance

### Sauvegardes Automatiques
- **Fréquence**: Quotidienne recommandée
- **Stockage**: Local + WhatsApp
- **Format**: JSON chiffré
- **Restauration**: 1-clic

### Mises à Jour
- **Web**: Rechargez la page (Ctrl+F5)
- **Mobile**: Installez le nouvel APK
- **Synchronisation**: Via WhatsApp

## 🚨 Dépannage

### L'application ne démarre pas
1. **Vérifiez Node.js**: `node --version`
2. **Installez les dépendances**: `npm install`
3. **Redémarrez**: `start-kbv2.bat`

### WhatsApp ne fonctionne pas
1. **Vérifiez WhatsApp Web**: Ouvert et connecté
2. **Autorisez le partage**: Acceptez les permissions
3. **Fallback**: Téléchargez le fichier manuellement

### Synchronisation échoue
1. **Vérifiez le format**: Fichier .json valide
2. **Espace disque**: Suffisant sur mobile
3. **Version KBV2**: Compatible sur tous appareils

## 📞 Support

- **Documentation**: README-WEB.md
- **Scripts**: start-kbv2.bat, setup-auto-start.bat
- **Logs**: Console du navigateur (F12)
- **Backup**: Automatique + Manuel

---

**🎯 Votre application KBV2 est maintenant prête pour une utilisation multi-appareils complète!**
