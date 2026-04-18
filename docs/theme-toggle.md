# ThemeToggle Component

**Path:** `components/ui/ThemeToggle.tsx`
**Depends on:** `next-themes` (installed), `ThemeProvider` in `app/layout.tsx`

## Usage

```tsx
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Icon only
<ThemeToggle />

// With label
<ThemeToggle showLabel />
```

## Props

| Prop        | Type      | Default | Description                          |
|-------------|-----------|---------|--------------------------------------|
| `showLabel` | `boolean` | `false` | Show "Light mode" / "Dark mode" text |
| `className` | `string`  | —       | Extra classes on the button          |

## Behaviour

- Uses `resolvedTheme` from `next-themes` to always get `"light"` or `"dark"` (never `"system"`)
- Toggles between light and dark on click
- Renders an empty placeholder (`size-9`) before mount to avoid hydration mismatch
- Shows **MoonIcon** in light mode, **SunIcon** in dark mode

## Setup

`ThemeProvider` must wrap the app in `app/layout.tsx`:

```tsx
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

`suppressHydrationWarning` is required on the `<html>` element.

## CSS Color Tokens

Defined in `globals.css` — all tokens update automatically when `.dark` is toggled.
Use them as Tailwind utilities (`bg-accent`, `text-muted-foreground`, etc.) or via `var(--token)`.

| Token                    | Light           | Dark      |
|--------------------------|-----------------|-----------|
| `--background`           | `#ffffff`       | `#09090b` |
| `--foreground`           | `#171717`       | `#fafafa` |
| `--surface`              | `#f4f4f5`       | `#18181b` |
| `--surface-foreground`   | `#3f3f46`       | `#a1a1aa` |
| `--border`               | `#e4e4e7`       | `#27272a` |
| `--primary`              | `#18181b`       | `#fafafa` |
| `--primary-foreground`   | `#fafafa`       | `#18181b` |
| `--muted`                | `#f4f4f5`       | `#27272a` |
| `--muted-foreground`     | `#71717a`       | `#a1a1aa` |
| `--accent`               | `#6366f1`       | `#818cf8` |
| `--accent-foreground`    | `#ffffff`       | `#ffffff` |
| `--destructive`          | `#ef4444`       | `#f87171` |
| `--success`              | `#22c55e`       | `#4ade80` |
