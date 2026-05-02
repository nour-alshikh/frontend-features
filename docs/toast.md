# Toast Notifications

**Path:** `components/ui/Toast.tsx`

## Setup

Wrap your app (or a subtree) with `ToastProvider`:

```tsx
import { ToastProvider } from "@/components/ui/Toast";

<ToastProvider>
  {children}
</ToastProvider>
```

## Usage

```tsx
import { useToast } from "@/components/ui/Toast";

const toast = useToast();

toast("Saved successfully!", { type: "success" });
toast("Something went wrong", { type: "error", duration: 6000 });
toast("Session expiring soon", { type: "warning" });
toast("Update available",      { type: "info" });
toast("Stays until closed",    { type: "info", duration: 0 });
```

## ToastProvider Props

| Prop       | Type           | Default       | Description              |
|------------|----------------|---------------|--------------------------|
| `position` | `ToastPosition`| `"top-right"` | Where toasts appear      |
| `children` | `ReactNode`    | —             | App content              |

## ToastOptions

| Option     | Type        | Default | Description                              |
|------------|-------------|---------|------------------------------------------|
| `type`     | `ToastType` | `"info"`| Visual style                             |
| `duration` | `number`    | `4000`  | Auto-dismiss ms. `0` = never auto-dismiss |

## Types

| Value       | Color       |
|-------------|-------------|
| `"success"` | Green       |
| `"error"`   | Red         |
| `"warning"` | Amber       |
| `"info"`    | Accent (indigo) |

## Positions

`"top-right"` · `"top-left"` · `"top-center"` · `"bottom-right"` · `"bottom-left"` · `"bottom-center"`

## Behaviour

- Renders toasts via `createPortal` into `document.body`
- Multiple toasts stack vertically within the chosen corner
- Each toast auto-dismisses after `duration` ms (unless `duration: 0`)
- Click the × button to dismiss immediately
- Enter / exit animations via `toast-in` / `toast-out` keyframes in `globals.css`
- `aria-live="polite"` container + `role="alert"` per toast for screen readers
