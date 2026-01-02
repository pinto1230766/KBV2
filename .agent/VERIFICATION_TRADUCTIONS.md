# Vérification et Corrections des Traductions

## Référence : jw.org/kea et jw.org/pt

Date de vérification : 2026-01-02

---

## ✅ CAPVERDIEN (Kabuverdianu - KEA)

### Corrections à apporter dans `messageTemplates.ts`

| Ligne | Texte actuel | Correction | Raison |
| :--- | :--- | :--- | :--- |
| 151 | `kongregas on` | `kongregason` | Orthographe standard jw.org/kea |
| 185 | `Kongregas on` | `Kongregason` | Orthographe standard jw.org/kea |
| 465 | `Ma Jeova` | `Ma Jeová` | Accent manquant (référence jw.org) |
| 197 | `familia@ezemplu.com` | `família@ezemplu.com` | Accent manquant |

### Corrections à apporter dans `useTranslation.ts`

| Ligne | Texte actuel | Correction | Raison |
| :--- | :--- | :--- | :--- |
| 210 | `Kumésheru` | `Kumeradu` | Forme plus standard |
| 214 | `Asembria` | `Asembleia` | Orthographe standard |
| 216 | `Asembria` | `Asembleia` | Orthographe standard |
| 223 | `Es un mensagem` | `Es é un mensajen` | Grammaire correcte |
| 234 | Mélange PT/CV | À vérifier | Certaines phrases semblent être en portugais |

### ✅ Termes vérifiés et CORRECTS

- ✓ `Bon dia` - Bonjour
- ✓ `Mon` - Frère (forme courte de Irmon)
- ✓ `Mana` - Sœur
- ✓ `runion` - réunion
- ✓ `vizita` - visite
- ✓ `Bíblia` - Bible
- ✓ `Tistimunhas di Jeová` - Témoins de Jéhovah
- ✓ `kongregason` - congrégation
- ✓ `diskursu` - discours
- ✓ `orador` - orateur

---

## ✅ PORTUGAIS (Português - PT)

### Corrections mineures à apporter

| Fichier | Ligne | Texte actuel | Correction | Raison |
| :--- | :--- | :--- | :--- | :--- |
| messageTemplates.ts | 356 | `discurso encorajador` | `discurso edificante` | Terme plus utilisé dans contexte JW |
| useTranslation.ts | 387 | `calorosamente` | `cordialmente` | Alternative plus formelle |

### ✅ Termes vérifiés et CORRECTS (PT)

- ✓ `Olá` - Bonjour
- ✓ `Irmão/Irmã` - Frère/Sœur
- ✓ `congregação` - congrégation
- ✓ `reunião` - réunion
- ✓ `visita` - visite
- ✓ `Bíblia` - Bible
- ✓ `Testemunhas de Jeová` - Témoins de Jéhovah
- ✓ `discurso` - discours
- ✓ `orador/oradora` - orateur/oratrice
- ✓ `Fraternalmente` - Fraternellement
- ✓ `hospitalidade` - hospitalité

---

## 🔍 PROBLÈMES DÉTECTÉS

### 1. Mélange de langues dans la section Capverdien (useTranslation.ts)

**Lignes 228-262** : Certaines traductions semblent être en portugais au lieu de capverdien :

```typescript
// ACTUEL (ligne 234) - SEMBLE ÊTRE DU PORTUGAIS
'Veuillez saisir un nom pour le modèle et un message':
  'Por favor introduza um nome para o modelo e uma mênsagem',

// DEVRAIT ÊTRE EN CAPVERDIEN
'Veuillez saisir un nom pour le modèle et un message':
  'Favor intruduz un nomi pa mudelu i un mensajen',
```

**Lignes à corriger (mélange PT/CV) :**
- 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245-262

### 2. Incohérences orthographiques

**Dans messageTemplates.ts :**

```typescript
// Ligne 151 - INCORRECT
'di kongregas on di' 

// DEVRAIT ÊTRE
'di kongregason di'

// Ligne 465 - ACCENT MANQUANT
'Ma Jeova abensoa-bu!'

// DEVRAIT ÊTRE
'Ma Jeová abensoa-bu!'
```

---

## 📋 PLAN D'ACTION

### Étape 1 : Corrections dans `messageTemplates.ts`

- [ ] Corriger `kongregas on` → `kongregason` (lignes 151, 185)
- [ ] Ajouter accent `Jeova` → `Jeová` (ligne 465)
- [ ] Vérifier tous les accents manquants

### Étape 2 : Corrections dans `useTranslation.ts`

- [ ] Remplacer les traductions portugaises par du capverdien authentique (lignes 228-262)
- [ ] Corriger `Asembria` → `Asembleia`
- [ ] Vérifier la cohérence des termes

### Étape 3 : Vérification globale

- [ ] Rechercher tous les fichiers contenant des messages en CV/PT
- [ ] Vérifier la cohérence terminologique
- [ ] Tester l'affichage dans l'application

---

## 📚 RESSOURCES DE RÉFÉRENCE

### Sites officiels JW.ORG

- **Capverdien** : [jw.org/kea](https://www.jw.org/kea/)
- **Portugais** : [jw.org/pt](https://www.jw.org/pt/)

### Termes clés vérifiés

1. **Réunion** : `runion` (kea) / `reunião` (pt)
2. **Visite** : `vizita` (kea) / `visita` (pt)
3. **Congrégation** : `kongregason` (kea) / `congregação` (pt)
4. **Frère** : `Mon` ou `Irmon` (kea) / `Irmão` (pt)
5. **Sœur** : `Mana` ou `Irman` (kea) / `Irmã` (pt)
6. **Discours** : `diskursu` (kea) / `discurso` (pt)
7. **Orateur** : `orador` (kea/pt)
8. **Hospitalité** : `ospitalidadi` (kea) / `hospitalidade` (pt)

---

## ⚠️ NOTES IMPORTANTES

1. Le capverdien (Kabuverdianu) a plusieurs variantes dialectales. La version utilisée sur jw.org/kea semble être le **Kabuverdianu de Santiago**.

2. Certains mots portugais sont compréhensibles en capverdien et vice-versa, mais il est important de maintenir la cohérence linguistique.

3. Les accents sont importants en capverdien pour la prononciation correcte.

4. Le portugais utilisé devrait être le **Português Europeu** (Portugal) plutôt que le Brésilien, sauf indication contraire.
