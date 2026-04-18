# Drag & Drop

**Paths:**
- `components/ui/Dropzone.tsx` — file upload drop zone
- `components/ui/DraggableList.tsx` — sortable list

No external libraries — native HTML5 Drag and Drop API only.

---

## Dropzone

```tsx
import { Dropzone } from "@/components/ui/Dropzone";

<Dropzone
  multiple
  accept="image/*, .pdf"
  maxSize={5 * 1024 * 1024}
  onFiles={(files) => console.log(files)}
/>
```

### Props

| Prop       | Type                    | Default | Description                         |
|------------|-------------------------|---------|-------------------------------------|
| `accept`   | `string`                | —       | MIME types / extensions to accept   |
| `multiple` | `boolean`               | `true`  | Allow multiple files                |
| `maxSize`  | `number`                | —       | Max bytes per file; shows error if exceeded |
| `onFiles`  | `(files: File[]) => void` | —     | Called with valid (non-errored) files |
| `className`| `string`                | —       | Extra classes on the wrapper        |

### Behaviour
- Drag over → highlighted border + tinted background
- Click → opens file picker
- Files appear as a list with name, size, and a remove button
- Files exceeding `maxSize` show an error row and are excluded from `onFiles`

---

## DraggableList

```tsx
import { DraggableList } from "@/components/ui/DraggableList";

<DraggableList
  items={items}
  onChange={setItems}
  getKey={(item) => item.id}
  renderItem={(item) => <div>{item.title}</div>}
/>
```

### Props

| Prop         | Type                                      | Description                    |
|--------------|-------------------------------------------|--------------------------------|
| `items`      | `T[]`                                     | Ordered list of items          |
| `onChange`   | `(items: T[]) => void`                    | Called with reordered array    |
| `getKey`     | `(item: T) => string \| number`           | Stable key per item            |
| `renderItem` | `(item: T, index: number) => ReactNode`   | Renders each item's content    |
| `className`  | `string`                                  | Extra classes on the wrapper   |

### Behaviour
- Grip handle (⠿) appears on hover; cursor becomes `grab`
- Dragged item fades to 40% opacity
- A blue line indicates the drop target (above or below)
- On drop, calls `onChange` with the new order
- Fully generic — works with any item type `T`
