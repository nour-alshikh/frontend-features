# VirtualList Component

**Path:** `components/ui/VirtualList.tsx`

## Usage

```tsx
import { VirtualList } from "@/components/ui/VirtualList";

<VirtualList
  items={rows}
  itemHeight={48}
  height={400}
  renderItem={(row, index) => (
    <div className="flex items-center h-full px-4 border-b border-border">
      {row.name}
    </div>
  )}
/>
```

## Props

| Prop         | Type                                    | Default | Description                                        |
|--------------|-----------------------------------------|---------|----------------------------------------------------|
| `items`      | `T[]`                                   | —       | Full dataset                                       |
| `itemHeight` | `number`                                | —       | Fixed row height in px (all rows must be equal)    |
| `height`     | `number`                                | —       | Visible container height in px                     |
| `renderItem` | `(item: T, index: number) => ReactNode` | —       | Renders a single row                               |
| `overscan`   | `number`                                | `3`     | Extra rows above and below the visible window      |
| `className`  | `string`                                | —       | Extra classes on the scroll container              |

## Behaviour

- Only mounts rows within the visible scroll window ± `overscan` rows
- A full-height spacer div gives the scrollbar the correct total scrollable height
- Each row is absolutely positioned at `index * itemHeight`
- Scroll position resets to top when the `items` array identity changes
- Fully generic — works with any item type `T`

## Limitations

- All rows must have the same fixed height (no dynamic row heights)
- For variable-height rows, a measurement pass (ResizeObserver per row) would be needed
