"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabel = false, className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  // Returns false on server, true on client — no effect needed
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  if (!mounted) return <div className="size-9" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={[
        "inline-flex items-center gap-2 rounded-lg p-2",
        "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
        "hover:bg-zinc-100 dark:hover:bg-zinc-800",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      {showLabel && (
        <span className="text-sm font-medium">
          {isDark ? "Light mode" : "Dark mode"}
        </span>
      )}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
