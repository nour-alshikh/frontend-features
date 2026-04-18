# Search + Debounce

**Paths:**
- `hooks/useDebounce.ts` — generic debounce hook
- `components/ui/SearchInput.tsx` — search input UI component

## useDebounce

```tsx
import { useDebounce } from "@/hooks/useDebounce";

const debounced = useDebounce(query, 400); // fires 400ms after last change
```

| Param   | Type     | Description                      |
|---------|----------|----------------------------------|
| `value` | `T`      | Value to debounce                |
| `delay` | `number` | Milliseconds to wait             |

Returns the debounced value of any type `T`.

## SearchInput

```tsx
import { SearchInput } from "@/components/ui/SearchInput";

<SearchInput
  value={query}
  onChange={setQuery}
  placeholder="Search…"
  loading={isFetching}
/>
```

| Prop          | Type                      | Default      | Description                  |
|---------------|---------------------------|--------------|------------------------------|
| `value`       | `string`                  | —            | Controlled input value       |
| `onChange`    | `(value: string) => void` | —            | Called on every keystroke    |
| `placeholder` | `string`                  | `"Search…"`  | Input placeholder            |
| `loading`     | `boolean`                 | `false`      | Shows spinner in right slot  |
| `className`   | `string`                  | —            | Extra classes on wrapper     |

Slots: search icon (left), spinner or clear-button (right).

## Fetch pattern

```tsx
const debounced = useDebounce(query.trim(), 400);

useEffect(() => {
  if (!debounced) return;
  let cancelled = false;

  fetch(`/api/search?q=${encodeURIComponent(debounced)}`)
    .then(r => r.json())
    .then(data => { if (!cancelled) setResults(data); });

  return () => { cancelled = true; }; // cancel stale requests
}, [debounced]);
```

The `cancelled` flag prevents stale responses from overwriting newer results.
