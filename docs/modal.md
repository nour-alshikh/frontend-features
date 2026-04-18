# Modal Component

**Path:** `components/ui/Modal.tsx`

## Usage

```tsx
import { Modal } from "@/components/ui/Modal";

const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Open</button>

<Modal open={open} onClose={() => setOpen(false)} title="My Modal">
  <p>Content goes here.</p>
</Modal>
```

## Props

| Prop              | Type                      | Default  | Description                              |
|-------------------|---------------------------|----------|------------------------------------------|
| `open`            | `boolean`                 | —        | Controls visibility                      |
| `onClose`         | `() => void`              | —        | Called on Esc, X button, or backdrop     |
| `title`           | `string`                  | —        | Header title (omit for no title)         |
| `size`            | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Max width of the panel             |
| `closeOnBackdrop` | `boolean`                 | `true`   | Whether clicking the backdrop closes it  |
| `children`        | `ReactNode`               | —        | Modal body content                       |

## Sizes

| Size | Max width |
|------|-----------|
| `sm` | 384px     |
| `md` | 448px     |
| `lg` | 512px     |
| `xl` | 576px     |

## Behaviour

- Renders via `createPortal` into `document.body` (avoids z-index issues)
- Locks body scroll while open
- Closes on `Escape` key
- Closes on backdrop click (unless `closeOnBackdrop={false}`)
- Traps focus within the panel (Tab / Shift+Tab cycle)
- Enter animation via `modal-in` keyframe defined in `globals.css`

## Accessibility

- `role="dialog"` + `aria-modal="true"` on the panel
- `aria-labelledby` wired to the title when provided
- Focus moves to first focusable element on open
