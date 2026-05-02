# ResizablePanels Component

**Path:** `components/ui/ResizablePanels.tsx`

## Usage

```tsx
import { ResizablePanels } from "@/components/ui/ResizablePanels";

// Horizontal split (side-by-side)
<ResizablePanels direction="horizontal" className="h-64">
  <aside>Sidebar</aside>
  <main>Content</main>
</ResizablePanels>

// Vertical split (top/bottom)
<ResizablePanels direction="vertical" defaultSplit={40} className="h-96">
  <div>Top panel</div>
  <div>Bottom panel</div>
</ResizablePanels>
```

## Props

| Prop           | Type                         | Default          | Description                                 |
|----------------|------------------------------|------------------|---------------------------------------------|
| `direction`    | `"horizontal" \| "vertical"` | `"horizontal"`   | Split orientation                           |
| `defaultSplit` | `number`                     | `50`             | Initial first-panel size as a % (0–100)     |
| `minSize`      | `number`                     | `10`             | Minimum size of each panel as a %           |
| `children`     | `[ReactNode, ReactNode]`     | —                | Exactly two panel contents                  |
| `className`    | `string`                     | —                | Applied to the outer container              |

## Behaviour

- Drag handle uses pointer capture — stays accurate even when cursor moves quickly outside
- `minSize` prevents either panel from collapsing below the threshold
- Handle turns accent-coloured on hover and while dragging
- Grip dots on the handle provide a visual affordance
- Nestable: place a `ResizablePanels` inside a panel of another to create three-panel layouts
- Each panel has `overflow-auto` for scrollable content
