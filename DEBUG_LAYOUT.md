# Debug Layout - Samsung Tab S10 Ultra

## Test à faire sur la tablette

1. Ouvrez l'application
2. Allez dans le Dashboard
3. Mettez en mode paysage
4. Appuyez longuement sur l'écran et faites "Inspecter" (si disponible)

## Questions de diagnostic

1. **La sidebar apparaît-elle en mode paysage ?**
   - Oui → TabletLayout fonctionne
   - Non → IOSMainLayout est utilisé (problème de détection)

2. **Quelle est la largeur de la sidebar ?**
   - 320px → Correct
   - Autre → Problème CSS

3. **Y a-t-il un espace blanc entre la sidebar et le contenu ?**
   - Oui → Problème de padding/margin
   - Non → Le contenu a un max-width

4. **Le contenu a-t-il des marges sur les côtés ?**
   - Oui, 4cm → max-width appliqué quelque part
   - Non → Bon

## Solution temporaire : Forcer le mode debug

Ajoutez temporairement dans Dashboard.tsx au début du return :

```typescript
<div style={{
  position: 'fixed',
  top: 0,
  right: 0,
  background: 'red',
  color: 'white',
  padding: '10px',
  zIndex: 9999
}}>
  Width: {window.innerWidth}px<br/>
  Device: {deviceType}<br/>
  Orientation: {orientation}<br/>
  Samsung: {isSamsungTablet ? 'YES' : 'NO'}
</div>
```

Cela affichera les informations de détection en haut à droite.
