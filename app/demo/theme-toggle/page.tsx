"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const swatches = [
  { label: "background", bg: "bg-background", text: "text-foreground" },
  { label: "surface", bg: "bg-surface", text: "text-surface-foreground" },
  { label: "primary", bg: "bg-primary", text: "text-primary-foreground" },
  { label: "accent", bg: "bg-accent", text: "text-accent-foreground" },
  { label: "muted", bg: "bg-muted", text: "text-muted-foreground" },
  { label: "destructive", bg: "bg-destructive", text: "text-destructive-foreground" },
  { label: "success", bg: "bg-success", text: "text-success-foreground" },
];

export default function ThemeToggleDemo() {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12 transition-colors duration-300">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>

      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-semibold">ThemeToggle</h1>
        <ThemeToggle showLabel />
      </div>

      {/* Current theme badge — only rendered after mount to avoid hydration mismatch */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-sm text-muted-foreground">Active theme:</span>
        <span className="text-sm font-mono px-2.5 py-1 rounded-md bg-surface text-surface-foreground border border-border">
          {mounted ? resolvedTheme : "—"}
        </span>
      </div>

      {/* Color swatches */}
      <section className="mb-12">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Color tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {swatches.map(({ label, bg, text }) => (
            <div
              key={label}
              className={`${bg} border border-border rounded-xl px-4 py-5 flex flex-col gap-1`}
            >
              <span className={`text-sm font-medium ${text}`}>{label}</span>
              <span className={`text-xs font-mono ${text} opacity-70`}>
                --color-{label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* UI preview */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          UI preview
        </h2>
        <div className="max-w-sm rounded-2xl border border-border bg-surface p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Profile</span>
            <ThemeToggle />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every color here is a CSS variable. Flip the toggle — all tokens update instantly.
          </p>
          <div className="flex gap-2 pt-1">
            <button className="flex-1 rounded-lg bg-primary text-primary-foreground py-2 text-sm font-medium hover:opacity-80 transition-opacity">
              Save
            </button>
            <button className="flex-1 rounded-lg bg-muted text-muted-foreground py-2 text-sm font-medium hover:opacity-80 transition-opacity">
              Cancel
            </button>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 rounded-lg bg-accent text-accent-foreground py-2 text-sm font-medium hover:opacity-80 transition-opacity">
              Accent
            </button>
            <button className="flex-1 rounded-lg bg-destructive text-destructive-foreground py-2 text-sm font-medium hover:opacity-80 transition-opacity">
              Delete
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
