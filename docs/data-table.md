# DataTable Component

**Path:** `components/ui/DataTable.tsx`

## Usage

```tsx
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";

type User = { id: number; name: string; email: string; status: string };

const columns: Column<User>[] = [
  { key: "id",     label: "ID",     sortable: true },
  { key: "name",   label: "Name",   sortable: true },
  { key: "email",  label: "Email",  sortable: true },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value) => <Badge>{String(value)}</Badge>,
  },
];

<DataTable data={users} columns={columns} pageSize={10} selectable />
```

## Props

| Prop           | Type              | Default | Description                                    |
|----------------|-------------------|---------|------------------------------------------------|
| `data`         | `T[]`             | —       | Row data (any `Record<string, unknown>`)        |
| `columns`      | `Column<T>[]`     | —       | Column definitions                             |
| `pageSize`     | `number`          | `10`    | Rows per page                                  |
| `selectable`   | `boolean`         | `false` | Show row checkboxes                            |
| `loading`      | `boolean`         | `false` | Show skeleton rows instead of data             |
| `skeletonRows` | `number`          | `5`     | Number of skeleton rows when `loading`         |
| `className`    | `string`          | —       | Extra classes on the wrapper                   |

## Column type

```ts
interface Column<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
}
```

## Behaviour

- Clicking a sortable header sorts asc; clicking again sorts desc
- Sort uses `localeCompare` with `{ numeric: true }` — numbers sort correctly
- Pagination: first / prev / next / last buttons; page resets on sort
- Row selection: per-row checkbox + header indeterminate checkbox for current page
- Loading skeleton: deterministic widths per cell (no SSR/client mismatch)
- `render` prop overrides the default `String(value)` cell content
