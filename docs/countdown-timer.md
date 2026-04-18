# CountdownTimer Component

**Path:** `components/ui/CountdownTimer.tsx`

## Usage

```tsx
import { CountdownTimer } from "@/components/ui/CountdownTimer";

<CountdownTimer duration={60} />

<CountdownTimer duration={300} size="lg" autoStart onComplete={() => alert("Done!")} />
```

## Props

| Prop         | Type                     | Default  | Description                          |
|--------------|--------------------------|----------|--------------------------------------|
| `duration`   | `number`                 | —        | Total countdown in seconds           |
| `size`       | `"sm" \| "md" \| "lg"`  | `"md"`   | Ring and text size                   |
| `autoStart`  | `boolean`                | `false`  | Start the timer immediately on mount |
| `onComplete` | `() => void`             | —        | Called when the timer hits 0         |
| `className`  | `string`                 | —        | Extra classes on the wrapper         |

## Sizes

| Size | Ring diameter | Time font  |
|------|---------------|------------|
| `sm` | ~80px         | `text-xl`  |
| `md` | ~118px        | `text-3xl` |
| `lg` | ~152px        | `text-5xl` |

## Behaviour

- SVG ring shrinks from full to empty as time elapses; ring turns `--color-destructive` when done
- Start/Pause button toggles `isRunning`; disabled when timer reaches 0
- Reset restores `duration` and stops the interval
- `onComplete` ref is kept stable so it never restarts the interval
- Time displayed as `MM:SS` or `H:MM:SS` for durations ≥ 1 hour
