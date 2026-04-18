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
