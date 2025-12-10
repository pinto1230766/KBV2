# ✅ Test Modale Planning - Menu 3 Points

## 📋 Checklist de Test

### 1. ✏️ **Modifier la visite**
- [ ] Ouvrir le menu 3 points sur une visite
- [ ] Cliquer sur "Modifier"
- [ ] Modifier la date
- [ ] Modifier l'heure
- [ ] Modifier le N° Discours
- [ ] Modifier le Contact d'accueil
- [ ] Modifier le Titre du discours
- [ ] Modifier le Logement
- [ ] Modifier les Repas
- [ ] Modifier les Notes
- [ ] Cliquer sur "Enregistrer"
- [ ] ✅ Vérifier que les modifications sont sauvegardées
- [ ] ✅ Vérifier le toast de confirmation

### 2. 🗑️ **Supprimer la visite**
- [ ] Ouvrir le menu 3 points sur une visite
- [ ] Cliquer sur "Supprimer"
- [ ] Lire le message de confirmation
- [ ] Confirmer la suppression
- [ ] ✅ Vérifier que la visite est supprimée
- [ ] ✅ Vérifier le toast de confirmation

### 3. 🔄 **Changer le statut**
- [ ] Ouvrir le menu 3 points sur une visite
- [ ] Cliquer sur "Statut"
- [ ] Tester "Marquer en attente"
- [ ] ✅ Vérifier que le statut change en "pending"
- [ ] Tester "Confirmer"
- [ ] ✅ Vérifier que le statut change en "confirmed"
- [ ] Tester "Marquer comme terminé"
- [ ] ✅ Vérifier que le statut change en "completed"
- [ ] Tester "Annuler"
- [ ] ✅ Vérifier que le statut change en "cancelled"
- [ ] ✅ Vérifier le toast de confirmation pour chaque changement

### 4. 💬 **Envoyer un message**
- [ ] Ouvrir le menu 3 points sur une visite
- [ ] Cliquer sur "Message"
- [ ] Tester "Message de confirmation"
- [ ] ✅ Vérifier que le message est enregistré
- [ ] Tester "Message de préparation"
- [ ] Tester "Rappel J-7"
- [ ] Tester "Rappel J-2"
- [ ] Tester "Message de remerciement"
- [ ] ✅ Vérifier le toast de confirmation pour chaque message

### 5. ⭐ **Bilan de la visite**
- [ ] Ouvrir le menu 3 points sur une visite
- [ ] Cliquer sur "Bilan"
- [ ] Remplir la note globale (1-5 étoiles)
- [ ] Remplir les 5 catégories d'évaluation
- [ ] Cocher des axes d'amélioration
- [ ] Ajouter un commentaire
- [ ] Cliquer sur "Enregistrer le bilan"
- [ ] ✅ Vérifier que le bilan est sauvegardé
- [ ] ✅ Vérifier le toast de confirmation

### 6. 💰 **Gestion des coûts**
- [ ] Ouvrir le menu 3 points sur une visite
- [ ] Cliquer sur "Coûts"
- [ ] Cliquer sur "Ajouter une dépense"
- [ ] Remplir le type de dépense
- [ ] Remplir le montant
- [ ] Remplir la description
- [ ] Cliquer sur "Enregistrer"
- [ ] ✅ Vérifier que la dépense apparaît dans la liste
- [ ] Tester "Modifier" une dépense
- [ ] ✅ Vérifier que la modification est sauvegardée
- [ ] Tester "Supprimer" une dépense
- [ ] ✅ Vérifier que la dépense est supprimée
- [ ] ✅ Vérifier le toast de confirmation pour chaque action

### 7. 🚗 **Logistique - Voyage**
- [ ] Ouvrir le menu 3 points sur une visite
- [ ] Cliquer sur "Logistique"
- [ ] Cliquer sur le bouton "Voyage" (icône voiture)
- [ ] ✅ Vérifier que la modale TravelCoordinationModal s'ouvre
- [ ] Sélectionner un mode de transport (Voiture, Train, Avion, Covoiturage, Autre)
- [ ] Remplir l'heure de départ
- [ ] Remplir l'heure d'arrivée
- [ ] Remplir le lieu de départ
- [ ] Remplir le lieu d'arrivée
- [ ] Remplir la distance (km)
- [ ] Remplir la durée estimée
- [ ] Remplir le coût estimé (€)
- [ ] Si Covoiturage : sélectionner des partenaires
- [ ] Ajouter un lien Google Maps (optionnel)
- [ ] Si Train/Avion : ajouter une référence de réservation
- [ ] Ajouter des notes supplémentaires
- [ ] Cliquer sur "Enregistrer le plan de voyage"
- [ ] ✅ Vérifier que les informations sont ajoutées dans le champ "Notes" de la visite
- [ ] ✅ Vérifier le format : "🚗 Voyage: [Mode] de [Départ] vers [Arrivée] à [Heure] ([Coût]€)"
- [ ] ✅ Vérifier le toast "Voyage enregistré"

### 8. 🍽️ **Logistique - Repas**
- [ ] Ouvrir le menu 3 points sur une visite
- [ ] Cliquer sur "Logistique"
- [ ] Cliquer sur le bouton "Repas" (icône fourchette/couteau)
- [ ] ✅ Vérifier que la modale MealPlanningModal s'ouvre
- [ ] Sélectionner des restrictions alimentaires (Végétarien, Sans gluten, etc.)
- [ ] Ajouter une restriction personnalisée
- [ ] Sélectionner des allergies (Arachides, Lait, etc.)
- [ ] Ajouter une allergie personnalisée
- [ ] Cliquer sur l'icône 🌅 pour ajouter un Petit-déjeuner
- [ ] Remplir l'heure du repas
- [ ] Remplir le nombre de personnes
- [ ] Remplir le lieu
- [ ] Remplir l'hôte/responsable
- [ ] Remplir le menu (optionnel)
- [ ] Remplir le coût estimé
- [ ] Ajouter d'autres repas (🍽️ Déjeuner, 🌙 Dîner, ☕ Collation)
- [ ] Ajouter des notes supplémentaires
- [ ] Cliquer sur "Enregistrer le plan de repas"
- [ ] ✅ Vérifier que les informations sont ajoutées dans le champ "Repas" de la visite
- [ ] ✅ Vérifier le format : "Petit-déj (08:00 - Lieu), Déjeuner (12:30 - Lieu) | Restrictions: Végétarien | ⚠️ Allergies: Arachides"
- [ ] ✅ Vérifier le toast "Repas enregistrés"

### 9. 🏠 **Logistique - Hébergement**
- [ ] Ouvrir le menu 3 points sur une visite
- [ ] Cliquer sur "Logistique"
- [ ] Cliquer sur le bouton "Hébergement" (icône maison)
- [ ] ✅ Vérifier que la modale AccommodationMatchingModal s'ouvre
- [ ] ✅ Vérifier que la liste des hôtes s'affiche avec des scores de compatibilité
- [ ] ✅ Vérifier que les hôtes sont triés par score (du plus élevé au plus bas)
- [ ] Cocher/décocher "Afficher uniquement les hôtes disponibles"
- [ ] ✅ Vérifier que la liste se met à jour
- [ ] Cliquer sur un hôte pour le sélectionner
- [ ] ✅ Vérifier que la carte de l'hôte est mise en surbrillance
- [ ] ✅ Vérifier que les informations de l'hôte s'affichent en bas (téléphone, email)
- [ ] Cliquer sur "Sélectionner cet hôte"
- [ ] ✅ Vérifier que le nom de l'hôte est ajouté dans le champ "Contact d'accueil" de la visite
- [ ] ✅ Vérifier le toast "Hôte: [Nom de l'hôte]"

### 10. 📄 **Documents - Feuille de route**
- [ ] Ouvrir le menu 3 points sur une visite
- [ ] Cliquer sur "Logistique"
- [ ] Faire défiler jusqu'à la section "Documents"
- [ ] ✅ Vérifier que la feuille de route s'affiche
- [ ] ✅ Vérifier les informations de l'orateur
- [ ] ✅ Vérifier les informations de la visite
- [ ] ✅ Vérifier les informations de l'hôte

## 🎯 Résultats Attendus

### Voyage (TravelCoordinationModal)
**Avant :** Notes = "Rendez-vous à 9h"
**Action :** Ajouter voyage en Voiture de Lyon vers Paris à 08:00 pour 50€
**Après :** Notes = "Rendez-vous à 9h\n🚗 Voyage: Voiture de Lyon vers Paris à 08:00 (50€)"

### Repas (MealPlanningModal)
**Avant :** Repas = ""
**Action :** Ajouter Déjeuner (12:30 - Restaurant) + Restriction Végétarien + Allergie Arachides
**Après :** Repas = "Déjeuner (12:30 - Restaurant) | Restrictions: Végétarien | ⚠️ Allergies: Arachides"

### Hébergement (AccommodationMatchingModal)
**Avant :** Contact d'accueil = ""
**Action :** Sélectionner l'hôte "Jean Dupont" (score 85)
**Après :** Contact d'accueil = "Jean Dupont"

## 🐛 Bugs Connus (À Vérifier)

- [ ] Les modales s'ouvrent-elles correctement ?
- [ ] Les données sont-elles sauvegardées dans la base de données ?
- [ ] Les toasts de confirmation s'affichent-ils ?
- [ ] Les modales se ferment-elles après sauvegarde ?
- [ ] Les données sont-elles visibles après rechargement de la page ?
- [ ] Y a-t-il des erreurs dans la console ?

## 📝 Notes de Test

**Date du test :** _______________
**Testeur :** _______________
**Version :** 1.20.1

### Bugs trouvés :
1. 
2. 
3. 

### Améliorations suggérées :
1. 
2. 
3. 

## ✅ Validation Finale

- [ ] Toutes les modales s'ouvrent correctement
- [ ] Toutes les données sont sauvegardées
- [ ] Tous les toasts s'affichent
- [ ] Aucune erreur dans la console
- [ ] Les données persistent après rechargement
- [ ] L'expérience utilisateur est fluide

**Statut global :** ⬜ PASS | ⬜ FAIL

**Signature :** _______________
