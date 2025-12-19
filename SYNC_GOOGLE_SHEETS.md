# Synchronisation avec Google Sheets pour la Gestion des Visites

## Vue d'ensemble

Ce document explique comment fonctionne la synchronisation entre l'application de gestion des visites et Google Sheets. Cette fonctionnalité permet d'importer automatiquement les visites programmées depuis un Google Sheet vers l'application.

## Configuration requise

1. Un Google Sheet avec les autorisations appropriées
2. L'ID du Google Sheet (ex: `1drIzPPi6AohCroSyUkF1UmMFxuEtMACBF4XATDjBOcg`)
3. Les identifiants (GID) des onglets à synchroniser

## Format du Google Sheet

Le Google Sheet doit contenir les colonnes suivantes (l'ordre n'a pas d'importance, mais les en-têtes doivent être clairs) :

| Colonne (peut varier) | Description | Format |
|----------------------|-------------|---------|
| Date | Date de la visite | JJ/MM/AAAA ou format date Excel |
| Orador | Nom de l'orateur | Texte |
| Kongregason | Nom de la congrégation | Texte |
| N° | Numéro du discours (optionnel) | Numérique |
| Tema | Thème du discours (optionnel) | Texte |

## Fonctionnement de la synchronisation

### 1. Connexion au Google Sheet

L'application se connecte au Google Sheet via l'API Google Sheets en utilisant l'ID du document et les identifiants des onglets (GID).

### 2. Traitement des données

1. **Récupération des données** :
   - L'application lit les données brutes du Google Sheet
   - Les en-têtes sont normalisés (minuscules, suppression des accents et caractères spéciaux)

2. **Traitement des dates** :
   - Les dates sont converties au format ISO (YYYY-MM-DD)
   - Les formats de date différents sont gérés automatiquement

3. **Gestion des orateurs** :
   - Si l'orateur n'existe pas, il est automatiquement créé
   - Les informations existantes sont mises à jour si nécessaire

4. **Création des visites** :
   - Une nouvelle visite est créée pour chaque ligne valide
   - Les visites existantes sont mises à jour si des modifications sont détectées
   - Le type de visite (présentiel/Zoom/streaming) est déterminé automatiquement

### 3. Mise à jour de l'application

- Les nouvelles visites sont ajoutées au calendrier
- Les visites existantes sont mises à jour avec les nouvelles informations
- Les conflits potentiels sont gérés de manière intelligente

## Scénarios de synchronisation

1. **Nouvelle visite** :
   - Si une ligne correspond à une date future sans visite existante, une nouvelle visite est créée

2. **Mise à jour de visite** :
   - Si une visite existe déjà pour cette date, ses informations sont mises à jour
   - Les champs modifiés sont détectés et mis à jour individuellement

3. **Visites annulées** :
   - Si une visite est supprimée du Google Sheet, elle reste dans l'application mais peut être marquée comme annulée

## Bonnes pratiques

1. **Format des données** :
   - Utilisez des formats de date cohérents
   - Évitez les caractères spéciaux dans les noms des orateurs
   - Vérifiez l'orthographe des noms de congrégation

2. **Fréquence de synchronisation** :
   - La synchronisation peut être effectuée manuellement depuis les paramètres
   - Il est recommandé de synchroniser régulièrement pour maintenir les données à jour

3. **Gestion des erreurs** :
   - Les erreurs de synchronisation sont enregistrées dans la console
   - Un message d'erreur détaillé est affiché à l'utilisateur en cas de problème

## Gestion des doublons

### Détection des doublons

L'application utilise un système avancé de détection des doublons qui s'applique à plusieurs types de données :

#### 1. Orateurs (Speakers)
- **Critères de détection** :
  - Noms similaires (algorithme de similarité > 85%)
  - Numéros de téléphone identiques
  - Combinaison de similarité du nom et de même congrégation

#### 2. Hôtes (Hosts)
- **Critères de détection** :
  - Noms identiques (avec normalisation)
  - Numéros de téléphone identiques
  - Adresses identiques

#### 3. Visites
- **Critères de détection** :
  - Même orateur à la même date
  - Même numéro de discours ou thème similaire
  - Heures de visite identiques ou très proches

### Traitement des doublons

#### Options de fusion

1. **Conserver le plus récent** :
   - Garde l'entrée la plus récente basée sur la date de création/mise à jour
   - Parfait pour les mises à jour de données

2. **Conserver le premier** :
   - Garde la première entrée détectée
   - Utile pour préserver les données originales

3. **Suppression des doublons** :
   - Supprime simplement les entrées en double sans fusion
   - À utiliser avec précaution car peut entraîner une perte de données

#### Processus de fusion

1. **Pour les orateurs** :
   - Toutes les visites associées aux doublons sont réassignées à l'orateur conservé
   - Les informations sont fusionnées de manière intelligente (téléphone, photo, etc.)

2. **Pour les hôtes** :
   - Les visites utilisant les hôtes en double sont mises à jour
   - Les informations redondantes sont supprimées

3. **Pour les visites** :
   - Les doublons exacts sont supprimés
   - Les conflits de données sont signalés pour résolution manuelle si nécessaire

### Bonnes pratiques

1. **Avant la synchronisation** :
   - Vérifiez les doublons potentiels dans votre Google Sheet
   - Normalisez les noms et les numéros de téléphone
   - Utilisez des formats de date cohérents

2. **Après la synchronisation** :
   - Passez en revue les doublons détectés
   - Validez les fusions proposées
   - Sauvegardez vos données avant les opérations de masse

3. **Maintenance régulière** :
   - Planifiez des vérifications périodiques des doublons
   - Utilisez l'outil de détection intégré régulièrement
   - Documentez les fusions effectuées pour référence future

## Dépannage

1. **Problèmes de connexion** :
   - Vérifiez que l'ID du Google Sheet est correct
   - Assurez-vous que le Google Sheet est partagé avec les bonnes permissions

2. **Données manquantes** :
   - Vérifiez que les en-têtes de colonnes sont correctement orthographiés
   - Assurez-vous que les dates sont dans un format valide

3. **Synchronisation partielle** :
   - Certains onglets peuvent échouer à se synchroniser tout en permettant à d'autres de fonctionner
   - Vérifiez les journaux pour identifier les problèmes spécifiques

## Sécurité

- Les informations d'identification sensibles ne sont pas stockées en clair
- Seules les données nécessaires sont synchronisées
- Les connexions au Google Sheet sont sécurisées (HTTPS)
