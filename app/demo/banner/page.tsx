"use client";

import { useState } from "react";
import Link from "next/link";
import { Banner } from "@/components/ui/Banner";
import type { BannerType } from "@/components/ui/Banner";

const TYPES: { type: BannerType; title: string; message: string }[] = [
  { type: "info",    title: "Heads up",           message: "A new version of this app is available. Refresh to update." },
  { type: "success", title: "Changes saved",       message: "Your profile has been updated successfully." },
  { type: "warning", title: "Session expiring",    message: "You'll be logged out in 5 minutes due to inactivity." },
  { type: "error",   title: "Something went wrong",message: "We couldn't process your request. Please try again." },
];

export default function BannerDemo() {
  const [dismissed, setDismissed] = useState<Set<BannerType>>(new Set());

  const reset = () => setDismissed(new Set());

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Banner / Alert</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Inline feedback banners with four types, optional dismiss button, and title support.
      </p>

      <div className="flex flex-col gap-10 max-w-xl">

        <Section label="Four types">
          <div className="flex flex-col gap-3">
            {TYPES.map(({ type, title, message }) => (
              <Banner key={type} type={type} title={title}>{message}</Banner>
            ))}
          </div>
        </Section>

        <Section label="Dismissible">
          <div className="flex flex-col gap-3">
            {TYPES.filter((t) => !dismissed.has(t.type)).map(({ type, title, message }) => (
              <Banner
                key={type}
                type={type}
                title={title}
                dismissible
                onDismiss={() => setDismissed((s) => new Set([...s, type]))}
              >
                {message}
              </Banner>
            ))}
            {dismissed.size > 0 && (
              <button
                type="button"
                onClick={reset}
                className="self-start text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Restore dismissed banners
              </button>
            )}
          </div>
        </Section>

        <Section label="Without title (message only)">
          <div className="flex flex-col gap-3">
            {TYPES.map(({ type, message }) => (
              <Banner key={type} type={type}>{message}</Banner>
            ))}
          </div>
        </Section>

        <Section label="Rich content">
          <Banner type="info" title="Scheduled maintenance">
            This service will be unavailable on{" "}
            <strong>Sunday 20 April, 02:00–04:00 UTC</strong>.{" "}
            <a href="#" className="underline underline-offset-2 hover:opacity-80">Learn more →</a>
          </Banner>
        </Section>

      </div>
    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-4">{label}</p>
      {children}
    </div>
  );
}
