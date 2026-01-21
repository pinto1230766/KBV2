# Development Guidelines - KBV Lyon

## Code Quality Standards

### File Organization
- **Imports Order**: External libraries → React/framework → Internal contexts → Components → Utils → Types → Styles
- **Export Pattern**: Named exports for components, default export for utilities
- **File Naming**: PascalCase for components (Messages.tsx), camelCase for utilities (validation.ts)
- **Type Definitions**: Inline interfaces for local types, separate type files for shared types

### Code Formatting
- **Indentation**: 2 spaces (consistent across TypeScript, TSX, CSS)
- **Line Length**: Soft limit at 100 characters, hard limit at 120
- **Quotes**: Single quotes for strings, double quotes in JSX attributes
- **Semicolons**: Required at statement ends
- **Trailing Commas**: Always in multiline objects/arrays

### Naming Conventions
- **Components**: PascalCase (MessageThread, KPICard, Button)
- **Functions/Variables**: camelCase (handleMessageAction, filteredConversations, isTablet)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for configuration objects
- **Boolean Variables**: Prefix with is/has/should (isLoading, hasError, shouldValidate)
- **Event Handlers**: Prefix with handle (handleClick, handleSubmit, handleMessageAction)
- **Custom Hooks**: Prefix with use (useData, usePlatform, useTranslation)

### TypeScript Standards
- **Type Annotations**: Explicit for function parameters and return types
- **Interface vs Type**: Prefer interface for object shapes, type for unions/intersections
- **Null Handling**: Use optional chaining (?.) and nullish coalescing (??)
- **Type Inference**: Let TypeScript infer when obvious, annotate when clarity needed
- **Generic Types**: Use descriptive names (TData, TError) not single letters

## Semantic Patterns

### React Component Patterns

#### Functional Components with Hooks
```typescript
export const ComponentName: React.FC = () => {
  // 1. Context hooks first
  const { data, updateData } = useData();
  const { deviceType } = usePlatformContext();
  
  // 2. State hooks
  const [localState, setLocalState] = useState<Type>(initialValue);
  
  // 3. Derived state with useMemo
  const computedValue = useMemo(() => {
    return expensiveComputation(data);
  }, [data]);
  
  // 4. Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // 5. Event handlers
  const handleAction = (param: Type) => {
    // Handler logic
  };
  
  // 6. Render
  return <div>...</div>;
};
```

#### State Management Pattern
- **Local State**: useState for component-specific state
- **Global State**: Context API for shared application state
- **Optimized State**: Zustand with Immer for complex state with immutability
- **Server State**: React Query/SWR for cached API data

### Data Management Patterns

#### Context Provider Pattern
```typescript
// 1. Define types
interface ContextType {
  state: StateType;
  actions: ActionsType;
}

// 2. Create context with undefined default
const Context = createContext<ContextType | undefined>(undefined);

// 3. Provider with useReducer
export function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Memoized actions
  const actions = useMemo(() => ({
    action1: (param) => dispatch({ type: 'ACTION1', payload: param }),
  }), []);
  
  return <Context.Provider value={{ state, ...actions }}>{children}</Context.Provider>;
}

// 4. Custom hook with error handling
export function useContext() {
  const context = useContext(Context);
  if (!context) throw new Error('useContext must be used within Provider');
  return context;
}
```

#### Zustand Store Pattern
```typescript
// Use Immer middleware for immutable updates
export const useStore = create<StoreType>()(
  subscribeWithSelector(
    persist(
      immer((set) => ({
        // State
        data: initialData,
        
        // Actions with Immer draft state
        updateData: (newData) => set((state) => {
          state.data = newData; // Direct mutation with Immer
        }),
      })),
      { name: 'store-name', partialize: (state) => ({ data: state.data }) }
    )
  )
);

// Optimized selectors to prevent re-renders
export const useStoreSelector = {
  data: () => useStore((state) => state.data),
  specificField: () => useStore((state) => state.data.field),
};
```

### Validation Patterns

#### Zod Schema Validation
```typescript
// 1. Define schema with detailed error messages
export const Schema = z.object({
  field: z.string()
    .min(1, 'Field is required')
    .max(100, 'Field cannot exceed 100 characters')
    .trim(),
  email: z.string().email('Invalid email format'),
  optional: z.string().optional().or(z.literal('')),
});

// 2. Validation function with error handling
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown) {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) errors[path] = [];
        errors[path].push(err.message);
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: ['Unknown validation error'] } };
  }
}

// 3. Input sanitization
export function sanitizeInput(input: string | null | undefined): string {
  if (input == null) return '';
  return String(input)
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}
```

### UI Component Patterns

#### Conditional Styling with cn Utility
```typescript
import { cn } from '@/utils/cn';

// Combine conditional classes
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'primary' && 'primary-classes',
  className // Allow prop override
)} />
```

#### Responsive Design Pattern
```typescript
// 1. Platform detection
const { deviceType } = usePlatformContext();
const isTablet = deviceType === 'tablet';
const isSamsungTablet = isTablet && window.innerWidth >= 1200;

// 2. Conditional rendering
{deviceType === 'phone' && <MobileView />}
{isTablet && <TabletView />}

// 3. Responsive classes
<div className={cn(
  'base-classes',
  'md:tablet-classes',
  'lg:desktop-classes',
  isSamsungTablet && 'samsung-specific-classes'
)} />
```

#### Data Filtering Pattern
```typescript
// Use useMemo for expensive computations
const filteredData = useMemo(() => {
  return data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
    return matchesSearch && matchesFilter;
  });
}, [data, searchTerm, activeFilter]);
```

### Performance Optimization Patterns

#### Memoization
```typescript
// Memoize expensive computations
const expensiveValue = useMemo(() => computeExpensive(data), [data]);

// Memoize callbacks to prevent child re-renders
const handleClick = useCallback((id: string) => {
  updateItem(id);
}, [updateItem]);

// Memoize components
export const Component = React.memo(({ prop }) => {
  return <div>{prop}</div>;
});
```

#### List Virtualization
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>{items[index]}</div>
  )}
</FixedSizeList>
```

### Error Handling Patterns

#### Try-Catch with User Feedback
```typescript
const handleAction = async () => {
  try {
    setLoading(true);
    const result = await apiCall();
    showSuccess('Operation completed successfully');
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    setError(message);
    showError(`Failed: ${message}`);
  } finally {
    setLoading(false);
  }
};
```

#### Error Boundaries
```typescript
// Wrap components with ErrorBoundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

## Internal API Usage

### Data Context API
```typescript
// Access global data and actions
const { 
  visits, speakers, hosts,
  updateVisit, addSpeaker, deleteSpeaker,
  refreshData 
} = useData();

// Update pattern
updateVisit({ 
  ...visit, 
  status: 'confirmed', 
  updatedAt: new Date().toISOString() 
});
```

### Platform Context API
```typescript
// Detect platform and device
const { platform, deviceType, isNative } = usePlatformContext();

// Conditional logic
if (isNative) {
  // Use Capacitor APIs
  await Filesystem.writeFile({ ... });
} else {
  // Use web APIs
  downloadFile(data);
}
```

### Translation Hook
```typescript
const { t, currentLanguage, changeLanguage } = useTranslation();

// Usage
<h1>{t('dashboard.title')}</h1>
<button onClick={() => changeLanguage('pt')}>Português</button>
```

### Toast Notifications
```typescript
const { showToast } = useToast();

showToast({
  type: 'success',
  message: 'Operation completed',
  duration: 3000
});
```

## Code Idioms

### Array Operations
```typescript
// Filter and map chain
const processed = items
  .filter(item => item.active)
  .map(item => ({ ...item, processed: true }));

// Find with fallback
const item = items.find(i => i.id === id) ?? defaultItem;

// Sort immutably
const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
```

### Object Operations
```typescript
// Spread for immutable updates
const updated = { ...original, field: newValue };

// Conditional properties
const obj = {
  required: value,
  ...(condition && { optional: value }),
};

// Object destructuring with rename
const { longPropertyName: short } = object;
```

### Async Patterns
```typescript
// Async/await with error handling
const fetchData = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Promise.all for parallel operations
const [data1, data2] = await Promise.all([
  fetchData1(),
  fetchData2()
]);
```

## Common Annotations

### JSDoc Comments
```typescript
/**
 * Validates data against a Zod schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with data or errors
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown) {
  // Implementation
}
```

### Type Annotations
```typescript
// Function signatures
const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
  event.preventDefault();
};

// Component props
interface Props {
  /** Speaker data object */
  speaker: Speaker;
  /** Callback when action is triggered */
  onAction: (action: string, visit?: Visit) => void;
  /** Optional CSS class name */
  className?: string;
}
```

### TODO Comments
```typescript
// TODO: Implement pagination for large datasets
// FIXME: Handle edge case when date is invalid
// NOTE: This is a temporary workaround for Samsung devices
```

## Best Practices Summary

1. **Always validate user input** with Zod schemas before processing
2. **Use TypeScript strictly** - avoid `any`, prefer explicit types
3. **Memoize expensive computations** with useMemo/useCallback
4. **Handle errors gracefully** with try-catch and user feedback
5. **Keep components small** - extract logic into custom hooks
6. **Use semantic HTML** - proper tags for accessibility
7. **Optimize re-renders** - use React.memo and proper dependencies
8. **Test critical paths** - unit tests for utilities, E2E for user flows
9. **Document complex logic** - JSDoc for public APIs
10. **Follow mobile-first** - responsive design from smallest screen up
