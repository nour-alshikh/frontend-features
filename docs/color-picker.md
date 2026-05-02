# ColorPicker Component

**Path:** `components/ui/ColorPicker.tsx`

## Usage

```tsx
import { ColorPicker } from "@/components/ui/ColorPicker";

const [color, setColor] = useState("#6366f1");

<ColorPicker value={color} onChange={setColor} />

// RGB output
<ColorPicker value={color} onChange={setColor} format="rgb" />

// HSL output
<ColorPicker value={color} onChange={setColor} format="hsl" />
```

## Props

| Prop       | Type          | Default   | Description                                    |
|------------|---------------|-----------|------------------------------------------------|
| `value`    | `string`      | —         | Current color (hex, `rgb(…)`, or `hsl(…)`)    |
| `onChange` | `(v: string) => void` | — | Called with the color in the chosen format  |
| `format`   | `ColorFormat` | `"hex"`   | Output format for `onChange`                  |
| `className`| `string`      | —         | Extra classes on the wrapper                   |

## ColorFormat

`"hex"` · `"rgb"` · `"hsl"`

Output shapes:
- `hex` → `"#rrggbb"`
- `rgb` → `"rgb(r, g, b)"`
- `hsl` → `"hsl(h, s%, l%)"`

## Behaviour

- **SV canvas** — click or drag to pick saturation (x-axis) and value/brightness (y-axis)
- **Hue slider** — drag to sweep through the color wheel
- **Preview swatch** — live colored dot between thumb and hue rail
- **Format tabs** — switch between HEX, RGB, and HSL views; HEX input validates on 6-char entry
- **Pointer capture** — drag remains accurate even when cursor leaves the canvas
- All color math is pure functions (HSV ↔ RGB ↔ HEX ↔ HSL); no Canvas API, no dependencies
