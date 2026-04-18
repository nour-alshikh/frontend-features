# ProgressBar Component

**Path:** `components/ui/ProgressBar.tsx`

## Usage

```tsx
import { ProgressBar } from "@/components/ui/ProgressBar";

<ProgressBar value={60} />
<ProgressBar value={80} color="success" size="lg" showLabel />
<ProgressBar indeterminate />
```

## Props

| Prop            | Type                                             | Default    | Description                        |
|-----------------|--------------------------------------------------|------------|------------------------------------|
| `value`         | `number`                                         | `0`        | Progress 0–100                     |
| `size`          | `"sm" \| "md" \| "lg"`                          | `"md"`     | Track height                       |
| `color`         | `"accent" \| "success" \| "destructive" \| "primary"` | `"accent"` | Fill color token        |
| `showLabel`     | `boolean`                                        | `false`    | Shows "Progress / N%" above bar    |
| `indeterminate` | `boolean`                                        | `false`    | Looping animation for unknown progress |
| `className`     | `string`                                         | —          | Extra classes on the wrapper       |

## Sizes

| Size | Height  |
|------|---------|
| `sm` | 4px     |
| `md` | 10px    |
| `lg` | 16px    |

## Behaviour

- Value is clamped to 0–100
- Fill transitions with `duration-500 ease-out` for smooth updates
- Indeterminate uses `progress-indeterminate` keyframe (defined in `globals.css`)
- Accessible via `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`
