# StarRating Component

**Path:** `components/ui/StarRating.tsx`

## Usage

```tsx
import { StarRating } from "@/components/ui/StarRating";

// Interactive
const [rating, setRating] = useState(0);
<StarRating value={rating} onChange={setRating} />

// Read-only
<StarRating value={4} readOnly />
```

## Props

| Prop        | Type                        | Default | Description                        |
|-------------|-----------------------------|---------|------------------------------------|
| `value`     | `number`                    | `0`     | Current rating (1–max)             |
| `max`       | `number`                    | `5`     | Total number of stars              |
| `onChange`  | `(rating: number) => void`  | —       | Called when a star is clicked      |
| `readOnly`  | `boolean`                   | `false` | Disables interaction               |
| `size`      | `"sm" \| "md" \| "lg"`     | `"md"`  | Star size                          |
| `className` | `string`                    | —       | Extra classes on the wrapper       |

## Sizes

| Size  | Dimensions |
|-------|------------|
| `sm`  | 16×16px    |
| `md`  | 24×24px    |
| `lg`  | 32×32px    |

## Accessibility

- Wrapper uses `role="group"` (interactive) or `role="img"` (read-only)
- Each star has an `aria-label` describing its value
- Focus ring visible on keyboard navigation
