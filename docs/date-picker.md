# DatePicker Component

**Path:** `components/ui/DatePicker.tsx`
**Exports:** `DatePicker`, `DateRangePicker`, `DateRange`

## Usage

```tsx
import { DatePicker, DateRangePicker } from "@/components/ui/DatePicker";
import type { DateRange } from "@/components/ui/DatePicker";

// Single
const [date, setDate] = useState<Date | null>(null);
<DatePicker value={date} onChange={setDate} />

// Range
const [range, setRange] = useState<DateRange>({ from: null, to: null });
<DateRangePicker value={range} onChange={setRange} />
```

## DatePicker Props

| Prop          | Type                         | Default          | Description                     |
|---------------|------------------------------|------------------|---------------------------------|
| `value`       | `Date \| null`               | —                | Selected date                   |
| `onChange`    | `(date: Date \| null) => void` | —              | Called on selection or clear    |
| `placeholder` | `string`                     | `"Pick a date…"` | Trigger button placeholder      |
| `disabled`    | `boolean`                    | `false`          | Disables the trigger            |
| `min`         | `Date`                       | —                | Earliest selectable date        |
| `max`         | `Date`                       | —                | Latest selectable date          |
| `className`   | `string`                     | —                | Extra classes on wrapper        |

## DateRangePicker Props

Same as `DatePicker` except:

| Prop       | Type                              | Default              |
|------------|-----------------------------------|----------------------|
| `value`    | `DateRange`                       | —                    |
| `onChange` | `(range: DateRange) => void`      | —                    |
| `placeholder` | `string`                       | `"Pick a range…"`    |

## DateRange type

```ts
interface DateRange {
  from: Date | null;
  to:   Date | null;
}
```

## Behaviour

- Renders via `createPortal` into `document.body`
- Position computed with `useLayoutEffect` before paint — no flicker
- Flips above trigger when insufficient space below
- Today is ringed with the accent color
- Dates outside `min`/`max` are dimmed and unclickable
- **Range mode**: first click sets `from`; second click sets `to` (auto-swaps if `to < from`); hover previews the range
- Clear button resets value to `null` / `{ from: null, to: null }`

## Keyboard navigation

| Key | Action |
|-----|--------|
| Arrow keys | Move focus by day |
| Page Up / Page Down | Previous / next month |
| Enter or Space | Select focused date |
| Escape | Close calendar |
