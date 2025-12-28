# Guide de Contribution - KBV Lyon

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Standards de code](#standards-de-code)
- [Tests](#tests)
- [Documentation](#documentation)
- [Workflow Git](#workflow-git)

## Code de conduite

En participant à ce projet, vous acceptez de maintenir un environnement respectueux et inclusif pour tous.

## Comment contribuer

### Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé
2. Créez une issue avec le template "Bug Report"
3. Incluez:
   - Description détaillée du problème
   - Étapes pour reproduire
   - Comportement attendu vs observé
   - Screenshots si applicable
   - Environnement (navigateur, OS, version)

### Proposer une fonctionnalité

1. Créez une issue avec le template "Feature Request"
2. Décrivez clairement:
   - Le besoin ou problème à résoudre
   - La solution proposée
   - Les alternatives envisagées
   - Impact sur les fonctionnalités existantes

### Soumettre une Pull Request

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Add: Amazing Feature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Standards de code

### TypeScript

- **Strict mode activé** - Tous les fichiers doivent passer en mode strict
- **Types explicites** - Évitez `any`, utilisez des types précis
- **Interfaces** - Préférez les interfaces aux types pour les objets

```typescript
// ✅ Bon
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Éviter
const user: any = { ... };
```

### React

- **Composants fonctionnels** - Utilisez des functional components avec hooks
- **Props destructuring** - Destructurez les props pour plus de clarté
- **Noms explicites** - Utilisez des noms descriptifs pour composants et variables

```typescript
// ✅ Bon
export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  onUpdate 
}) => {
  // ...
};

// ❌ Éviter
export const UP = (props) => {
  // ...
};
```

### CSS / Tailwind

- **Classes utilitaires** - Utilisez Tailwind autant que possible
- **Classes responsives** - Mobile-first approach
- **Dark mode** - Incluez toujours les variants dark:

```typescript
// ✅ Bon
<div className="p-4 bg-white dark:bg-gray-800 sm:p-6 md:p-8">

// ❌ Éviter
<div style={{ padding: '16px' }}>
```

### Conventions de nommage

- **Fichiers**:
  - Components: `PascalCase.tsx` (ex: `UserCard.tsx`)
  - Hooks: `camelCase.ts` (ex: `useAuth.ts`)
  - Utils: `camelCase.ts` (ex: `formatDate.ts`)
  - Tests: `*.test.tsx` ou `*.test.ts`
  - Stories: `*.stories.tsx`

- **Variables et fonctions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

```typescript
// ✅ Bon
const MAX_RETRY_ATTEMPTS = 3;
const fetchUserData = async () => { ... };
interface UserData { ... }

// ❌ Éviter
const max_retry = 3;
const FetchUserData = async () => { ... };
interface userData { ... }
```

## Tests

### Tests unitaires

- **Couverture minimum**: 80%
- **Chaque fonction publique** doit avoir des tests
- **Cas limites** - Testez les edge cases

```typescript
describe('formatDate', () => {
  it('should format valid date', () => {
    expect(formatDate('2025-01-15')).toBe('15/01/2025');
  });

  it('should handle invalid date', () => {
    expect(formatDate('invalid')).toBe('');
  });

  it('should handle null', () => {
    expect(formatDate(null)).toBe('');
  });
});
```

### Tests de composants

- Testez le rendu
- Testez les interactions utilisateur
- Testez les cas d'erreur

```typescript
describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Commandes de test

```bash
# Lancer les tests
npm run test

# Tests avec UI
npm run test:ui

# Coverage
npm run test:coverage

# Tests E2E
npx playwright test
```

## Documentation

### Code

- **JSDoc** pour les fonctions publiques
- **Commentaires** pour la logique complexe
- **README** pour chaque feature majeure

```typescript
/**
 * Formate une date au format français
 * @param date - Date à formater (ISO 8601)
 * @returns Date formatée (JJ/MM/AAAA) ou chaîne vide si invalide
 */
export function formatDate(date: string): string {
  // ...
}
```

### Storybook

Chaque composant UI doit avoir une story:

```typescript
const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};
```

## Workflow Git

### Branches

- `main` - Production, toujours stable
- `develop` - Développement, features en cours
- `feature/*` - Nouvelles fonctionnalités
- `fix/*` - Corrections de bugs
- `hotfix/*` - Corrections urgentes en production

### Commits

Format: `Type: Description courte`

**Types:**
- `Add:` Nouvelle fonctionnalité
- `Fix:` Correction de bug
- `Update:` Modification de fonctionnalité existante
- `Refactor:` Refactoring sans changement de comportement
- `Test:` Ajout/modification de tests
- `Docs:` Documentation uniquement
- `Style:` Formatage, pas de changement de code
- `Perf:` Amélioration de performance

```bash
# ✅ Bons exemples
Add: user authentication with JWT
Fix: button not showing on mobile
Update: improve error messages
Test: add tests for auth utils
Docs: update README with setup instructions

# ❌ À éviter
updated stuff
fix
WIP
```

### Pull Requests

**Template PR:**

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Comment tester
1. Étape 1
2. Étape 2

## Checklist
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Lint passe sans erreurs
- [ ] Tests passent
- [ ] Code reviewed
```

## Outils de développement

### Linting

```bash
# Vérifier le code
npm run lint

# Fix automatique
npm run lint --fix
```

### Formatting

```bash
# Vérifier formatage
npx prettier --check "src/**/*.{ts,tsx}"

# Formater
npx prettier --write "src/**/*.{ts,tsx}"
```

### Type checking

```bash
# Vérifier les types
npx tsc --noEmit
```

## Raccourcis clavier utiles

- `Ctrl+K` - Recherche globale
- `Ctrl+N` - Nouvelle visite
- `Shift+/` - Aide raccourcis
- `Escape` - Fermer modal
- `Ctrl+S` - Sauvegarder

## Ressources

- [Documentation React](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Testing Library](https://testing-library.com/docs/)
- [Vitest](https://vitest.dev/)

## Questions?

N'hésitez pas à:
- Ouvrir une issue
- Contacter l'équipe sur le canal Discord
- Consulter les discussions GitHub

---

Merci de contribuer à KBV Lyon! 🎉