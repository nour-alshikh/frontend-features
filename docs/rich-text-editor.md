# RichTextEditor Component

**Path:** `components/ui/RichTextEditor.tsx`

## Usage

```tsx
import { RichTextEditor } from "@/components/ui/RichTextEditor";

const [html, setHtml] = useState("<p>Hello</p>");

<RichTextEditor value={html} onChange={setHtml} />
```

## Props

| Prop          | Type                      | Default           | Description                        |
|---------------|---------------------------|-------------------|------------------------------------|
| `value`       | `string`                  | —                 | HTML string (controlled)           |
| `onChange`    | `(html: string) => void`  | —                 | Called on every edit               |
| `placeholder` | `string`                  | `"Start typing…"` | Shown when editor is empty         |
| `disabled`    | `boolean`                 | `false`           | Makes editor non-editable, dims toolbar |
| `className`   | `string`                  | —                 | Extra classes on the wrapper       |

## Toolbar commands

| Button | Command | Shortcut |
|--------|---------|----------|
| B | Bold | Ctrl+B |
| I | Italic | Ctrl+I |
| U | Underline | Ctrl+U |
| S | Strikethrough | — |
| • | Unordered list | — |
| 1. | Ordered list | — |
| H2 | Heading 2 | — |
| H3 | Heading 3 | — |
| P | Paragraph | — |
| ≡ | Align left / center / right | — |
| ↩ / ↪ | Undo / Redo | Ctrl+Z / Ctrl+Y |

## Behaviour

- Built on `contenteditable` — no external dependencies
- Toolbar buttons use `onMouseDown + preventDefault` to avoid blurring the editor before the command fires
- Active state shown via `document.queryCommandState` (bold, italic, etc.)
- External `value` changes are synced via `innerHTML` with a skip-flag to prevent cursor reset while typing
- Placeholder shown via CSS `content: attr(data-placeholder)` on `:empty::before`
- Native keyboard shortcuts (Ctrl+B/I/U/Z/Y) work without extra code

## Output

The `value` and `onChange` payload is raw HTML (e.g. `<p>Hello <strong>world</strong></p>`). Render it with `dangerouslySetInnerHTML` in read-only contexts.
