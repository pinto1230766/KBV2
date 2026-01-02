# Guide de Configuration - KBV Manager

## 📋 Vue d'ensemble

Ce guide vous permet de configurer l'application KBV Manager pour votre propre groupe ou congrégation. L'application est entièrement multilingue (Français, Portugais, Capverdien) et peut être personnalisée selon vos besoins.

---

## 🌍 Configuration Multilingue

### Langues Disponibles
- **Français (FR)** - Langue par défaut
- **Portugais (PT)** - Traduction complète
- **Capverdien (CV/KEA)** - Traduction complète

### Changer la Langue
1. Ouvrez l'application
2. Allez dans **Paramètres** (⚙️)
3. Section **Préférences**
4. Sélectionnez votre langue dans le menu déroulant
5. L'interface se met à jour automatiquement

---

## ⚙️ Configuration Initiale

### 1. Informations de la Congrégation

Allez dans **Paramètres** → **Profil de la Congrégation** et modifiez :

```
Nom de la congrégation : [Votre nom]
Ville : [Votre ville]
Responsable de l'accueil : [Nom du responsable]
Téléphone du responsable : [Numéro de téléphone]
Jour de réunion : [Samedi/Dimanche]
Heure de réunion : [14:30 par exemple]
```

**Exemple pour un autre groupe :**
```
Nom : Groupe Capverdien de Paris
Ville : Paris
Responsable : João Silva
Téléphone : +33 6 12 34 56 78
Jour : Dimanche
Heure : 15:00
```

### 2. Réinitialiser les Données

Pour commencer avec vos propres données :

1. **Paramètres** → **Gestion des Données**
2. Cliquez sur **Exporter les données** (pour sauvegarder si nécessaire)
3. Cliquez sur **Réinitialiser les données**
4. Confirmez l'action

⚠️ **Attention** : Cette action supprime toutes les données existantes (orateurs, visites, hôtes).

---

## 👥 Ajouter Vos Orateurs

### Méthode 1 : Ajout Manuel

1. Allez dans **Orateurs**
2. Cliquez sur **+ Nouvel Orateur**
3. Remplissez les informations :
   - Nom complet
   - Congrégation
   - Téléphone
   - Genre (Homme/Femme)
   - Photo (optionnel)
   - Notes (allergies, préférences, etc.)

### Méthode 2 : Import depuis Google Sheets

1. Créez une feuille Google Sheets avec ces colonnes :
   ```
   Data | Orador | Kongregason | Nº | Tema
   ```

2. Dans **Paramètres** → **Synchronisation**
3. Configurez l'ID de votre Google Sheet
4. Cliquez sur **Synchroniser avec Google Sheets**

**Format de la feuille :**
```
Data          | Orador           | Kongregason    | Nº  | Tema
2026-01-15    | João Silva       | Paris KBV      | 1   | Bu konxe Deus dretu?
2026-01-22    | Maria Santos     | Lyon KBV       | 5   | Kuzê ki ta djuda bu família ser filís?
```

---

## 🏠 Ajouter Vos Hôtes

1. Allez dans **Paramètres** → **Gestion des Hôtes**
2. Cliquez sur **+ Nouveau Foyer**
3. Remplissez :
   - Nom du foyer
   - Type (Couple/Frère/Sœur)
   - Adresse complète
   - Téléphone
   - Email
   - Capacité d'accueil (nombre de personnes)
   - Particularités (animaux, escaliers, allergies, etc.)

**Exemple :**
```
Nom : Famille Silva
Type : Couple
Adresse : 12 rue de la Paix, 75001 Paris
Téléphone : +33 6 12 34 56 78
Email : silva@example.com
Capacité : 2 personnes
Notes : Pas d'animaux, ascenseur disponible
```

---

## 📅 Planifier des Visites

### Créer une Visite

1. Allez dans **Planning**
2. Cliquez sur **+ Planifier une visite**
3. Sélectionnez :
   - Orateur (depuis votre liste)
   - Date de la visite
   - Heure (par défaut : heure de réunion)
   - Type de visite :
     - **Physique** : L'orateur vient sur place
     - **Zoom** : Visioconférence
     - **Streaming** : Diffusion en direct
   - Numéro de discours (optionnel)
   - Thème du discours (optionnel)

### Assigner un Hôte

1. Dans la liste des visites, cliquez sur une visite
2. Cliquez sur **Assigner un hôte**
3. L'application propose automatiquement les meilleurs matchs selon :
   - Disponibilité à la date
   - Compatibilité (couple/célibataire)
   - Capacité d'accueil
   - Préférences (animaux, parking, etc.)
4. Sélectionnez l'hôte approprié

---

## 💬 Messages et Communication

### Types de Messages Disponibles

L'application génère automatiquement des messages dans les 3 langues :

#### Pour les Orateurs :
- **Invitation** : Inviter un orateur
- **Confirmation** : Confirmer une visite
- **Rappel (J-7)** : Rappel 7 jours avant
- **Rappel (J-2)** : Rappel 2 jours avant
- **Remerciements** : Après la visite

#### Pour les Hôtes :
- **Demande d'accueil** : Demander d'héberger
- **Confirmation** : Confirmer l'hébergement
- **Préparation** : Informations avant la visite
- **Rappel (J-7)** : Rappel 7 jours avant
- **Rappel (J-2)** : Rappel 2 jours avant
- **Remerciements** : Après l'accueil

### Envoyer un Message

1. Allez dans **Messages**
2. Sélectionnez le destinataire (orateur ou hôte)
3. Choisissez le type de message
4. Sélectionnez la langue (FR/PT/CV)
5. Le message est généré automatiquement
6. Modifiez si nécessaire
7. Envoyez via :
   - **WhatsApp** (recommandé)
   - **Email**
   - **SMS**
   - **Copier** (pour coller ailleurs)

---

## 📊 Utiliser le Dashboard

Le tableau de bord affiche :

### KPIs en Temps Réel
- Nombre total d'orateurs
- Visites planifiées
- Taux de confirmation
- Hôtes disponibles

### Graphiques
- **Tendances** : Évolution des visites dans le temps
- **Répartition** : Visites par congrégation
- **Statuts** : Visites confirmées/en attente/annulées

### Alertes
- Visites sans hôte assigné
- Conflits de dates
- Rappels à envoyer

---

## 🔄 Synchronisation et Sauvegarde

### Exporter Vos Données

1. **Paramètres** → **Gestion des Données**
2. Cliquez sur **Exporter les données**
3. Un fichier JSON est téléchargé
4. Conservez-le en lieu sûr

**Utilisation :**
- Sauvegarde de sécurité
- Transfert vers un autre appareil
- Partage avec d'autres responsables

### Importer des Données

1. **Paramètres** → **Gestion des Données**
2. Cliquez sur **Importer des données**
3. Sélectionnez votre fichier JSON
4. Les données sont restaurées

### Synchronisation Google Sheets

Pour synchroniser automatiquement avec Google Sheets :

1. Créez une feuille Google Sheets publique
2. Notez l'ID de la feuille (dans l'URL)
3. **Paramètres** → **Synchronisation**
4. Collez l'ID
5. Cliquez sur **Synchroniser**

---

## 📱 Installation sur Tablette/Mobile

### Android (Samsung Tab S10 Ultra)

1. Téléchargez le fichier APK
2. Activez "Sources inconnues" dans les paramètres
3. Installez l'application
4. Ouvrez et configurez

### iOS (iPad/iPhone)

1. Téléchargez depuis l'App Store (si publié)
2. Ou utilisez la version web : [URL de votre application]

### Version Web

Accédez simplement à l'URL de l'application dans votre navigateur.

---

## 🎨 Personnalisation

### Thème et Apparence

1. **Paramètres** → **Préférences**
2. Choisissez :
   - **Thème** : Clair/Sombre/Auto
   - **Langue** : FR/PT/CV
   - **Format de date** : JJ/MM/AAAA ou MM/JJ/AAAA

### Modèles de Messages Personnalisés

1. **Messages** → **Modèles**
2. Créez vos propres modèles
3. Utilisez des variables :
   - `{nom}` : Nom de l'orateur/hôte
   - `{date}` : Date de la visite
   - `{heure}` : Heure de la visite
   - `{congregation}` : Congrégation
   - `{theme}` : Thème du discours

**Exemple de modèle personnalisé :**
```
Bonjour {nom},

Nous sommes heureux de vous accueillir le {date} à {heure}.
Votre discours sur le thème "{theme}" sera très apprécié.

Cordialement,
{responsable}
```

---

## 🔒 Sécurité et Confidentialité

### Données Locales
- Toutes les données sont stockées localement sur votre appareil
- Aucune donnée n'est envoyée à des serveurs externes
- Chiffrement AES-GCM pour les données sensibles

### Sauvegarde Recommandée
- Exportez vos données régulièrement
- Conservez les sauvegardes dans un lieu sûr
- Utilisez Google Sheets comme sauvegarde automatique

### Permissions Requises
- **Stockage** : Pour sauvegarder les données
- **Internet** : Pour la synchronisation Google Sheets (optionnel)
- **Notifications** : Pour les rappels (optionnel)

---

## 🆘 Dépannage

### L'application ne charge pas les données

1. Vérifiez que vous avez bien importé ou créé des données
2. Allez dans **Paramètres** → **Gestion des Données**
3. Cliquez sur **Rafraîchir les données**

### Les messages ne s'affichent pas dans la bonne langue

1. **Paramètres** → **Préférences**
2. Vérifiez la langue sélectionnée
3. Redémarrez l'application si nécessaire

### La synchronisation Google Sheets échoue

1. Vérifiez que la feuille est publique
2. Vérifiez l'ID de la feuille
3. Assurez-vous que les colonnes sont correctement nommées
4. Vérifiez votre connexion Internet

### Les hôtes ne s'affichent pas

1. **Paramètres** → **Gestion des Hôtes**
2. Vérifiez que vous avez ajouté des hôtes
3. Cliquez sur **+ Nouveau Foyer** pour en ajouter

---

## 📞 Support et Contact

### Documentation Complète
Consultez le fichier `README.md` pour plus de détails techniques.

### Développeur
- **Nom** : Pinto Francisco
- **Email** : [Votre email]
- **Téléphone** : +33 7 77 38 89 14

### Communauté
Partagez vos retours et suggestions pour améliorer l'application !

---

## ✅ Checklist de Configuration

Avant de commencer à utiliser l'application :

- [ ] Langue configurée (FR/PT/CV)
- [ ] Profil de la congrégation rempli
- [ ] Au moins 5 orateurs ajoutés
- [ ] Au moins 3 hôtes ajoutés
- [ ] Première visite planifiée
- [ ] Test d'envoi de message
- [ ] Sauvegarde des données exportée
- [ ] Google Sheets configuré (optionnel)

---

## 🎯 Cas d'Usage Typiques

### Scénario 1 : Planifier une Visite Complète

1. **Planning** → **+ Planifier une visite**
2. Sélectionnez l'orateur : "João Silva"
3. Date : 15/01/2026
4. Heure : 14:30
5. Type : Physique
6. Discours : N° 1 - "Bu konxe Deus dretu?"
7. **Assigner un hôte** → Sélectionnez "Famille Martin"
8. **Messages** → Envoyer confirmation à l'orateur (PT)
9. **Messages** → Envoyer demande d'accueil à l'hôte (FR)
10. 7 jours avant : Envoyer rappel J-7
11. 2 jours avant : Envoyer rappel J-2
12. Après la visite : Envoyer remerciements

### Scénario 2 : Gérer un Remplacement d'Urgence

1. **Planning** → Sélectionnez la visite concernée
2. Cliquez sur **Actions** → **Remplacement d'urgence**
3. Sélectionnez un nouvel orateur disponible
4. L'application envoie automatiquement :
   - Annulation à l'ancien orateur
   - Invitation au nouvel orateur
   - Mise à jour à l'hôte
5. Mettez à jour le discours si nécessaire

### Scénario 3 : Rapport Mensuel

1. **Rapports** → **Générer un rapport**
2. Sélectionnez la période : Janvier 2026
3. Choisissez le type : Rapport mensuel
4. Format : PDF
5. Le rapport inclut :
   - Liste des visites
   - Statistiques
   - Orateurs les plus actifs
   - Taux de confirmation
6. Exportez et partagez avec les anciens

---

## 🌟 Fonctionnalités Avancées

### Mode Hors Ligne
- L'application fonctionne sans Internet
- Les données sont synchronisées automatiquement quand la connexion revient
- Idéal pour les zones avec connexion instable

### Détection de Conflits
- L'application détecte automatiquement :
  - Deux visites le même jour
  - Orateur déjà programmé à une date proche
  - Hôte indisponible
  - Salle occupée

### Matching Intelligent Hôte/Orateur
L'algorithme prend en compte :
- Disponibilité de l'hôte
- Compatibilité couple/célibataire
- Capacité d'accueil
- Préférences (animaux, parking, escaliers)
- Historique d'accueil
- Distance de la salle

### Statistiques Avancées
- Tendances sur 12 mois
- Orateurs les plus actifs
- Congrégations les plus représentées
- Taux de confirmation par période
- Charge de travail des hôtes

---

## 📝 Notes Importantes

### Données Initiales
L'application contient des données d'exemple pour le Groupe Capverdien de Lyon. **Vous devez les remplacer par vos propres données** en suivant ce guide.

### Mises à Jour
Vérifiez régulièrement les mises à jour de l'application pour bénéficier des nouvelles fonctionnalités et corrections de bugs.

### Confidentialité
Ne partagez jamais vos fichiers d'export contenant des données personnelles (téléphones, adresses) publiquement.

---

## 🎓 Formation Recommandée

Pour une utilisation optimale, formez au moins 2-3 personnes dans votre groupe :

1. **Responsable principal** : Configuration, planification, rapports
2. **Responsable communication** : Messages, rappels, suivi
3. **Responsable logistique** : Hôtes, hébergement, repas

---

**© 2025-2026 Pinto Francisco • Tous droits réservés**

*Ce guide est fourni pour faciliter l'utilisation de KBV Manager par d'autres groupes et congrégations. Pour toute question, contactez le développeur.*
