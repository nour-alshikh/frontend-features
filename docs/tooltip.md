# Tooltip Component

**Path:** `components/ui/Tooltip.tsx`

## Usage

```tsx
import { Tooltip } from "@/components/ui/Tooltip";

<Tooltip content="Save your changes" side="top">
  <button>Save</button>
</Tooltip>

// Rich content
<Tooltip content={<span className="flex gap-1"><Icon /> Copy link</span>}>
  <button>Copy</button>
</Tooltip>
```

## Props

| Prop        | Type           | Default | Description                                      |
|-------------|----------------|---------|--------------------------------------------------|
| `content`   | `ReactNode`    | —       | Tooltip content (text or JSX)                    |
| `side`      | `TooltipSide`  | `"top"` | Preferred side                                   |
| `delay`     | `number`       | `300`   | Show delay in ms                                 |
| `className` | `string`       | —       | Extra classes on the tooltip panel               |
| `children`  | `ReactNode`    | —       | The trigger element                              |

## TooltipSide

`"top"` · `"bottom"` · `"left"` · `"right"`

## Behaviour

- Renders via `createPortal` into `document.body` — no z-index stacking issues
- Position computed with `useLayoutEffect` to avoid flicker
- Auto-flips through all four sides to stay within the viewport (4 px margin)
- Shows after `delay` ms on `mouseenter` / `focus`; hides immediately on `mouseleave` / `blur`
- CSS directional arrow adapts to the final computed side
- Wraps `children` in an `inline-flex` `<span>` for consistent positioning

## Accessibility

- Tooltip element has `role="tooltip"`
- Shows on keyboard focus, hides on blur
