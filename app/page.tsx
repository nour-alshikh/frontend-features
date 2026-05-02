import Link from "next/link";

const features = [
  {
    title: "Star Rating",
    description: "Interactive and read-only star rating with size variants.",
    href: "/demo/star-rating",
  },
  {
    title: "Modal",
    description: "Accessible modal with focus trap, Esc key, backdrop close, and enter animation.",
    href: "/demo/modal",
  },
  {
    title: "Theme Toggle",
    description: "Light/dark mode toggle using next-themes with SSR-safe rendering.",
    href: "/demo/theme-toggle",
  },
  {
    title: "Countdown Timer",
    description: "SVG ring timer with start/pause/reset and onComplete callback.",
    href: "/demo/countdown-timer",
  },
  {
    title: "Search + Debounce",
    description: "Debounced search input tested against the GitHub repositories API.",
    href: "/demo/search-debounce",
  },
  {
    title: "Progress Bar",
    description: "Progress bar with colors, sizes, indeterminate mode, and live slider preview.",
    href: "/demo/progress-bar",
  },
  {
    title: "Form Builder",
    description: "Drag-free form builder with 7 field types, inline editor, and live preview.",
    href: "/demo/form-builder",
  },
  {
    title: "Drag & Drop",
    description: "File dropzone and sortable list using native HTML5 drag API.",
    href: "/demo/drag-drop",
  },
  {
    title: "Toast Notifications",
    description: "Auto-dismissing toasts with four types, six positions, and stack support.",
    href: "/demo/toast",
  },
  {
    title: "Transitions",
    description: "Context-coordinated show/hide animations, tab groups, step wizards, and page transitions.",
    href: "/demo/transition",
  },
  {
    title: "Command Palette",
    description: "Keyboard-driven command launcher with fuzzy search, match highlighting, and grouped results.",
    href: "/demo/command-palette",
  },
  {
    title: "Data Table",
    description: "Sortable, paginated table with row selection, custom cell renderers, and loading skeleton.",
    href: "/demo/data-table",
  },
  {
    title: "Tooltip",
    description: "Portal-based tooltips with auto-flip, configurable delay, and keyboard accessibility.",
    href: "/demo/tooltip",
  },
  {
    title: "Skeleton",
    description: "Composable loading placeholders — line, block, circle variants and card/row helpers.",
    href: "/demo/skeleton",
  },
  {
    title: "Accordion",
    description: "Animated expand/collapse panels with single-open and multi-open modes.",
    href: "/demo/accordion",
  },
  {
    title: "Confirm Dialog",
    description: "Modal-based confirmation prompt with default and destructive variants.",
    href: "/demo/confirm-dialog",
  },
  {
    title: "Banner / Alert",
    description: "Inline feedback banners with four types, dismiss button, and title support.",
    href: "/demo/banner",
  },
  {
    title: "OTP Input",
    description: "4–6 digit pin fields with auto-advance, backspace nav, paste support, and secure mode.",
    href: "/demo/otp-input",
  },
  {
    title: "Breadcrumbs",
    description: "Navigation trail that collapses middle items on overflow.",
    href: "/demo/breadcrumbs",
  },
  {
    title: "Popover",
    description: "Click-triggered floating panel with four sides, three alignments, and viewport clamping.",
    href: "/demo/popover",
  },
  {
    title: "Timeline",
    description: "Vertical event list with connector lines, optional icons, and color-coded dots.",
    href: "/demo/timeline",
  },
  {
    title: "MultiSelect",
    description: "Searchable tag input with chips, keyboard navigation, and backspace-to-remove.",
    href: "/demo/multi-select",
  },
  {
    title: "Date Picker",
    description: "Calendar popup for single dates and ranges — keyboard nav, min/max, range hover preview.",
    href: "/demo/date-picker",
  },
  {
    title: "Color Picker",
    description: "Hue/saturation canvas with hue slider and hex/rgb/hsl input — no dependencies.",
    href: "/demo/color-picker",
  },
  {
    title: "Rich Text Editor",
    description: "Bold, italic, lists, headings, and alignment via contenteditable — no dependencies.",
    href: "/demo/rich-text-editor",
  },
  {
    title: "Charts",
    description: "Bar, line, and pie/donut charts in pure SVG with hover tooltips — no chart libraries.",
    href: "/demo/chart",
  },
  {
    title: "Virtual List",
    description: "Renders only visible rows for large datasets — smooth at 100,000+ items.",
    href: "/demo/virtual-list",
  },
  {
    title: "Resizable Panels",
    description: "Drag-to-resize split layout — horizontal and vertical, nestable for multi-panel UIs.",
    href: "/demo/resizable-panels",
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-8 py-12">
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
        Component Library
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-10">
        Click a component to see it in action.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {f.title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {f.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
