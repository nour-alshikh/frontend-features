"use client";

import { TransitionLink } from "@/components/ui/TransitionLink";

export default function StepPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <TransitionLink
        href="/demo/transition"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </TransitionLink>
      <h1 className="text-2xl font-semibold mb-4">Step page</h1>
      <p className="text-sm text-muted-foreground">
        This page was reached via{" "}
        <code className="bg-surface px-1 rounded">TransitionLink</code> — the navigation used
        the View Transitions API (in Chrome/Edge) for a smooth page animation.
      </p>
    </main>
  );
}
