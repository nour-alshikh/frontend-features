# Frontend Features

28 React UI components built from scratch, with no UI or component libraries. Each one has its own live demo page.

**Live demo:** https://nour-ui.vercel.app

The only runtime dependencies are `next`, `react`, `react-dom` and `next-themes`. Everything else (positioning, keyboard handling, virtualization, drag and drop, focus management) is written by hand.

<!-- Add a GIF or screenshots of 3–4 components here (command palette, data table, drag & drop, date picker). -->

## Components

| Overlays and feedback | Inputs and forms | Data and layout | Motion and misc |
|---|---|---|---|
| Modal | Date picker | Data table | Transition |
| Confirm dialog | Color picker | Virtual list | Skeleton |
| Popover | Multi-select | Chart | Progress bar |
| Tooltip | OTP input | Timeline | Countdown timer |
| Toast | Star rating | Accordion | Theme toggle |
| Banner | Rich text editor | Breadcrumbs | |
| Command palette | Form builder | Resizable panels | |
| | Search with debounce | Drag & drop | |

Notes on how several of them work are in [`docs/`](docs).

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · next-themes

## Project structure

```
app/demo/<component>/   demo page for each component
components/ui/          the components
hooks/                  shared hooks (e.g. useDebounce)
docs/                   implementation notes
```

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
