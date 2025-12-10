# 🏗️ Architecture des Données - KBV Lyon

## ✅ État Actuel

L'application utilise **Context API** (`DataContext`) pour la gestion globale des données, ce qui est excellent.

### Structure Actuelle

```typescript
Visit {
  id: string;              // ✅ Référence à Speaker.id
  visitId: string;         // ✅ ID unique de la visite
  nom: string;             // ⚠️ Dupliqué depuis Speaker
  congregation: string;    // ⚠️ Dupliqué depuis Speaker
  telephone: string;       // ⚠️ Dupliqué depuis Speaker
  photoUrl: string;        // ⚠️ Dupliqué depuis Speaker
  // ... autres champs
}
```

## ⚠️ Risques Identifiés

### 1. Duplication des Données Orateur
**Problème** : Les informations de l'orateur sont copiées dans chaque visite.

**Risque** : Si un orateur change de nom, téléphone ou congrégation, les visites passées gardent les anciennes valeurs.

**Impact** :
- ✅ **Positif** : Performance (pas de jointure nécessaire)
- ✅ **Positif** : Historique préservé (on sait quel était le nom à l'époque)
- ⚠️ **Négatif** : Incohérence si on veut mettre à jour rétroactivement

### 2. Référence Hôte par Nom
**Problème** : `Visit.host` stocke le **nom** de l'hôte, pas un ID.

```typescript
Visit {
  host: string;  // ⚠️ "Jean-Paul Batista" au lieu d'un ID
}
```

**Risque** : Si un hôte change de nom, toutes les visites deviennent orphelines.

## ✅ Recommandations

### Option 1 : Garder l'Architecture Actuelle (Recommandé)
**Avantages** :
- ✅ Performance optimale
- ✅ Historique préservé
- ✅ Pas de refactoring nécessaire
- ✅ Fonctionne hors ligne

**À implémenter** :
```typescript
// Fonction utilitaire pour synchroniser les données
function syncVisitWithSpeaker(visit: Visit, speaker: Speaker): Visit {
  return {
    ...visit,
    nom: speaker.nom,
    congregation: speaker.congregation,
    telephone: speaker.telephone,
    photoUrl: speaker.photoUrl
  };
}

// À appeler lors de la mise à jour d'un orateur
function updateSpeaker(speaker: Speaker) {
  // 1. Mettre à jour l'orateur
  setSpeakers(prev => prev.map(s => s.id === speaker.id ? speaker : s));
  
  // 2. Mettre à jour toutes les visites futures de cet orateur
  setVisits(prev => prev.map(v => 
    v.id === speaker.id && new Date(v.visitDate) >= new Date()
      ? syncVisitWithSpeaker(v, speaker)
      : v
  ));
}
```

### Option 2 : Normalisation Complète (Non Recommandé)
**Structure** :
```typescript
Visit {
  speakerId: string;  // Référence uniquement
  hostId: string;     // Référence uniquement
  // Pas de duplication
}

// Affichage nécessite une jointure
const visitWithDetails = {
  ...visit,
  speaker: speakers.find(s => s.id === visit.speakerId),
  host: hosts.find(h => h.id === visit.hostId)
};
```

**Inconvénients** :
- ❌ Jointures nécessaires partout
- ❌ Performance dégradée
- ❌ Complexité accrue
- ❌ Refactoring massif

### Option 3 : Hybride (Compromis)
**Pour les visites futures** : Synchronisation automatique
**Pour les visites passées** : Données figées (historique)

```typescript
function updateSpeaker(speaker: Speaker) {
  const today = new Date();
  
  setVisits(prev => prev.map(visit => {
    if (visit.id !== speaker.id) return visit;
    
    const visitDate = new Date(visit.visitDate);
    
    // Synchroniser uniquement les visites futures
    if (visitDate >= today) {
      return syncVisitWithSpeaker(visit, speaker);
    }
    
    // Garder l'historique pour les visites passées
    return visit;
  }));
}
```

## 🔧 Implémentation Recommandée

### 1. Ajouter une Fonction de Synchronisation

**Fichier** : `src/contexts/DataContext.tsx`

```typescript
// Ajouter dans DataContext
const syncVisitsWithSpeaker = useCallback((speakerId: string) => {
  const speaker = speakers.find(s => s.id === speakerId);
  if (!speaker) return;
  
  setData(prev => ({
    ...prev,
    visits: prev.visits.map(visit => {
      if (visit.id !== speakerId) return visit;
      
      // Synchroniser uniquement les visites futures
      const isFuture = new Date(visit.visitDate) >= new Date();
      if (!isFuture) return visit;
      
      return {
        ...visit,
        nom: speaker.nom,
        congregation: speaker.congregation,
        telephone: speaker.telephone,
        photoUrl: speaker.photoUrl
      };
    })
  }));
}, [speakers]);

// Modifier updateSpeaker pour appeler la sync
const updateSpeaker = (speaker: Speaker) => {
  setData((d) => ({
    ...d,
    speakers: d.speakers.map((s) => (s.id === speaker.id ? speaker : s)),
  }));
  addToSyncQueue('UPDATE_SPEAKER', speaker);
  
  // Synchroniser les visites futures
  syncVisitsWithSpeaker(speaker.id);
};
```

### 2. Ajouter des IDs aux Hôtes

**Fichier** : `src/types.ts`

```typescript
export interface Host {
  id: string;              // ✅ Ajouter un ID unique
  nom: string;
  // ... autres champs
}
```

**Migration** :
```typescript
// Générer des IDs pour les hôtes existants
const migrateHosts = (hosts: Host[]): Host[] => {
  return hosts.map(host => ({
    ...host,
    id: host.id || generateUUID()
  }));
};
```

### 3. Afficher un Avertissement

Quand un orateur est modifié, afficher :

```
⚠️ Mise à jour de l'orateur
Les visites futures seront automatiquement mises à jour.
Les visites passées conserveront les informations historiques.

[ ] Mettre à jour aussi les visites passées
```

## 📊 Résumé

| Aspect | État Actuel | Recommandation |
|--------|-------------|----------------|
| **Architecture** | ✅ Context API | ✅ Garder |
| **Référence Orateur** | ✅ Par ID | ✅ Garder |
| **Duplication Données** | ⚠️ Oui | ✅ Ajouter sync auto |
| **Référence Hôte** | ⚠️ Par nom | ⚠️ Migrer vers ID |
| **Performance** | ✅ Excellente | ✅ Maintenir |

## 🎯 Actions Prioritaires

1. ✅ **Immédiat** : Ajouter fonction de synchronisation automatique
2. ⚠️ **Court terme** : Ajouter IDs aux hôtes
3. 📝 **Moyen terme** : Documenter le comportement pour l'équipe
4. 🔄 **Long terme** : Envisager un système de versioning des données

## 💡 Conclusion

L'architecture actuelle est **solide et performante**. La duplication des données est un **choix de design valide** pour :
- ✅ Préserver l'historique
- ✅ Optimiser les performances
- ✅ Fonctionner hors ligne

Il suffit d'ajouter une **synchronisation automatique** pour les visites futures lors de la modification d'un orateur.
