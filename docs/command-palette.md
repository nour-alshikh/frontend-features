# CommandPalette Component

**Path:** `components/ui/CommandPalette.tsx`

## Usage

```tsx
import { CommandPalette } from "@/components/ui/CommandPalette";
import type { CommandGroup } from "@/components/ui/CommandPalette";

const groups: CommandGroup[] = [
  {
    label: "Navigation",
    items: [
      { id: "home", label: "Go to Home", icon: <HomeIcon />, onSelect: () => router.push("/") },
    ],
  },
];

// Uncontrolled — manages own state via ⌘K / Ctrl+K
<CommandPalette groups={groups} />

// Controlled
<CommandPalette groups={groups} open={open} onOpenChange={setOpen} />
```

## Props

| Prop           | Type                        | Default            | Description                                      |
|----------------|-----------------------------|--------------------|--------------------------------------------------|
| `groups`       | `CommandGroup[]`            | —                  | Grouped list of commands                         |
| `placeholder`  | `string`                    | `"Search commands…"` | Input placeholder                              |
| `open`         | `boolean`                   | —                  | Controlled open state (omit for uncontrolled)    |
| `onOpenChange` | `(open: boolean) => void`   | —                  | Called when open state changes                   |

## CommandGroup / CommandItem types

```ts
interface CommandGroup {
  label: string;
  items: CommandItem[];
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  onSelect: () => void;
}
```

## Behaviour

- Renders via `createPortal` into `document.body`
- Global shortcut ⌘K / Ctrl+K toggles open (uncontrolled mode)
- Filters by `label` and `description` (case-insensitive)
- Match text is highlighted in results
- Keyboard: ↑ ↓ navigate, Enter selects, Esc closes
- Active item scrolls into view
- Backdrop click closes the palette
- Supports controlled and uncontrolled modes

## Accessibility

- Backdrop and panel use `onMouseDown` to prevent focus loss before click
- Input is focused on open via `setTimeout(..., 0)`
- Active item highlighted via `bg-accent/10`
