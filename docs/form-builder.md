# FormBuilder Component

**Path:** `components/ui/FormBuilder.tsx`

## Usage

```tsx
import { FormBuilder } from "@/components/ui/FormBuilder";

<FormBuilder />
```

Self-contained — no props needed. Manages its own state internally.

## Field Types

| Type       | Input rendered         | Has options |
|------------|------------------------|-------------|
| `text`     | `<input type="text">`  | No          |
| `email`    | `<input type="email">` | No          |
| `number`   | `<input type="number">`| No          |
| `textarea` | `<textarea>`           | No          |
| `select`   | `<select>`             | Yes         |
| `checkbox` | `<input type="checkbox">` | No       |
| `radio`    | `<input type="radio">` | Yes         |

## Per-field settings (inline editor)

- **Label** — field label shown in the preview
- **Placeholder** — input hint text (not shown for checkbox)
- **Help text** — small text below the input
- **Required** — marks field with `*` and adds `required` to the input
- **Options** — for `select` and `radio`: add/edit/remove options inline

## Builder actions

| Action  | Description                              |
|---------|------------------------------------------|
| ↑ / ↓  | Move field up or down in the list        |
| ✎      | Toggle the inline field editor           |
| ✕      | Remove the field                         |

## Live preview

- Renders a real HTML form reflecting all current fields and settings
- On submit, shows a summary of all entered values
- Resets back to the form via "← Back to form"
