"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const SHORT = [
  { label: "Home", href: "/" },
  { label: "Settings", href: "/settings" },
  { label: "Profile" },
];

const LONG = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Acme Corp", href: "/projects/acme" },
  { label: "Frontend", href: "/projects/acme/frontend" },
  { label: "Components", href: "/projects/acme/frontend/components" },
  { label: "Breadcrumbs" },
];

export default function BreadcrumbsDemo() {
  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Breadcrumbs</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Navigation trail that collapses middle items on overflow, with a custom separator option.
      </p>

      <div className="flex flex-col gap-10 max-w-xl">

        <Section label="Short (3 items — no collapse)">
          <div className="p-4 rounded-xl border border-border bg-surface">
            <Breadcrumbs items={SHORT} />
          </div>
        </Section>

        <Section label="Long (6 items — collapses middle)">
          <p className="text-xs text-muted-foreground mb-3">
            Click <strong>…</strong> to expand all items.
          </p>
          <div className="p-4 rounded-xl border border-border bg-surface">
            <Breadcrumbs items={LONG} />
          </div>
        </Section>

        <Section label="No collapse">
          <div className="p-4 rounded-xl border border-border bg-surface">
            <Breadcrumbs items={LONG} collapse={false} />
          </div>
        </Section>

        <Section label="Custom separator">
          <div className="p-4 rounded-xl border border-border bg-surface">
            <Breadcrumbs items={SHORT} separator={<span className="text-muted-foreground">/</span>} />
          </div>
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Always shows first and last item</li>
            <li>Collapses middle items when more than 3 (click … to expand)</li>
            <li>Last item rendered as current page (not a link)</li>
            <li>Custom separator via <code className="bg-surface px-1 rounded">separator</code> prop</li>
            <li>Accessible with <code className="bg-surface px-1 rounded">aria-label</code> and <code className="bg-surface px-1 rounded">aria-current="page"</code></li>
          </ul>
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
