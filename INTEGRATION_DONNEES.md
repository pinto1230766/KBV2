# 📋 Intégration des Données KBV2

## 🎯 Objectif
Intégrer les données réelles de la congrégation dans le projet pour initialisation et démonstration.

## 📁 Fichiers de Données

### Données Utilisateur
- **Sauvegarde réelle** : `Downloads/kbv-backup-2026-01-04.json`
- **Orateurs identifiés** : Jonatã ALVES, Andrea MENARA, Ailton DIAS, etc.
- **Congrégations** : Albufeira KBV, Ettelbruck KBV, Villiers-sur-Marne, Creil

### Données Démo
- **Fichier démo** : `src/data/demo-data.json`
- **Structure vide** : Prêt pour initialisation
- **Configuration par défaut** : KBV Lyon, heures de réunion configurées

## 🔧 Intégration dans l'Application

### Option 1: Initialisation automatique
```typescript
// Dans DataContext.ts
const initializeDemoData = async () => {
  try {
    const response = await fetch('/data/demo-data.json');
    const demoData = await response.json();
    
    if (speakers.length === 0 && visits.length === 0) {
      // Première utilisation - charger les données démo
      setSpeakers(demoData.speakers);
      setVisits(demoData.visits);
      setHosts(demoData.hosts);
      setCongregationProfile(demoData.congregationProfile);
    }
  } catch (error) {
    console.error('Erreur chargement données démo:', error);
  }
};
```

### Option 2: Import manuelle
- **Paramètres** > **Importation** > **Sélectionner fichier démo**
- **Restauration** : 1-clic depuis l'interface

## 📊 Statistiques des Données Réelles

### Orateurs (Backup du 04/01/2026)
- **Total** : ~15 orateurs
- **Congrégations** : 4+ congrégations représentées
- **Téléphones** : Plusieurs contacts disponibles
- **Tags** : Zoom, expérimenté, etc.

### Types de données
- **Orateurs** : Noms, congrégations, téléphones, historique
- **Visites** : Planning, dates, statuts
- **Hôtes** : Coordonnées, disponibilités
- **Messages** : Templates, communications

## 🎯 Prochaines Étapes

1. **Analyser la structure** des données réelles
2. **Créer un script d'import** automatique
3. **Ajouter une option** "Charger données démo" dans Paramètres
4. **Documenter le processus** pour les utilisateurs

## 🔄 Utilisation

### Pour les nouveaux utilisateurs
1. **Installer l'application** normalement
2. **Premier démarrage** : Données démo chargées automatiquement
3. **Personnaliser** : Remplacer avec vos propres données
4. **Sauvegarder** : Créer votre première sauvegarde

### Pour les utilisateurs existants
1. **Importer vos données** via Paramètres > Importation
2. **Utiliser les démos** comme référence
3. **Adapter** selon vos besoins spécifiques

---

**📋 Vos données réelles sont prêtes à être intégrées dans le projet !**
