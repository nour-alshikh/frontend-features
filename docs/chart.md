# Chart Components

**Path:** `components/ui/Chart.tsx`
**Exports:** `BarChart`, `LineChart`, `PieChart`

## BarChart

```tsx
import { BarChart } from "@/components/ui/Chart";

<BarChart
  labels={["Jan", "Feb", "Mar"]}
  datasets={[
    { label: "Revenue", data: [42000, 55000, 49000] },
    { label: "Expenses", data: [31000, 33000, 29000] },
  ]}
  height={240}
/>
```

## LineChart

```tsx
import { LineChart } from "@/components/ui/Chart";

<LineChart
  labels={["Jan", "Feb", "Mar"]}
  datasets={[{ label: "Users", data: [120, 180, 145] }]}
/>
```

## PieChart / Donut

```tsx
import { PieChart } from "@/components/ui/Chart";

// Pie
<PieChart labels={["A", "B", "C"]} data={[40, 35, 25]} />

// Donut (pass inner radius ratio 0–1)
<PieChart labels={["A", "B", "C"]} data={[40, 35, 25]} donut={0.55} />
```

## Shared Props (Bar & Line)

| Prop         | Type              | Default | Description                    |
|--------------|-------------------|---------|--------------------------------|
| `labels`     | `string[]`        | —       | X-axis category labels         |
| `datasets`   | `ChartDataset[]`  | —       | One entry per series           |
| `height`     | `number`          | `240`   | SVG height in px               |
| `showLegend` | `boolean`         | `true`  | Render colour legend below     |
| `className`  | `string`          | —       | Wrapper class                  |

## ChartDataset

```ts
interface ChartDataset {
  label: string;
  data: number[];
  color?: string; // overrides palette
}
```

## PieChart Props

| Prop         | Type       | Default | Description                          |
|--------------|------------|---------|--------------------------------------|
| `labels`     | `string[]` | —       | Slice labels                         |
| `data`       | `number[]` | —       | Slice values                         |
| `colors`     | `string[]` | —       | Per-slice colors (overrides palette) |
| `donut`      | `number`   | `0`     | Inner radius ratio 0–1 (0 = pie)     |
| `size`       | `number`   | `200`   | SVG width & height in px             |
| `showLegend` | `boolean`  | `true`  | Render legend below                  |

## Behaviour

- All charts are pure SVG — no canvas, no external libraries
- SVG uses `width="100%"` — adapts to container width
- Hover tooltips on all chart types
- Pie slices animate outward on hover
- Donut shows total in center
- Shared colour palette: accent CSS var, then fixed colours
