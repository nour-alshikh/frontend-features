"use client";

import { useState } from "react";
import Link from "next/link";
import { Skeleton, SkeletonCard, SkeletonRow } from "@/components/ui/Skeleton";

export default function SkeletonDemo() {
  const [show, setShow] = useState(true);

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Skeleton</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Composable loading placeholders — line, block, and circle variants with multi-line and composite helpers.
      </p>

      <div className="flex flex-col gap-10 max-w-xl">

        <Section label="Toggle loaded state">
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="mb-6 px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors"
          >
            {show ? "Show real content" : "Show skeleton"}
          </button>

          <div className="flex flex-col gap-4">
            {show ? (
              <SkeletonCard />
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold shrink-0">
                  A
                </div>
                <div className="pt-0.5">
                  <p className="text-sm font-medium">Alice Martin</p>
                  <p className="text-xs text-muted-foreground">alice@example.com</p>
                </div>
              </div>
            )}
          </div>
        </Section>

        <Section label="Line — single">
          <div className="flex flex-col gap-3">
            <Skeleton width="100%" />
            <Skeleton width="75%" />
            <Skeleton width="50%" />
          </div>
        </Section>

        <Section label="Line — multi-line paragraph">
          <Skeleton lines={4} />
        </Section>

        <Section label="Block">
          <div className="flex flex-col gap-3">
            <Skeleton variant="block" height={48} />
            <Skeleton variant="block" height={120} />
          </div>
        </Section>

        <Section label="Circle">
          <div className="flex gap-4 items-end">
            {[24, 32, 40, 56, 72].map((size) => (
              <Skeleton key={size} variant="circle" width={size} />
            ))}
          </div>
        </Section>

        <Section label="SkeletonCard helper">
          <div className="flex flex-col gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </Section>

        <Section label="SkeletonRow helper (table rows)">
          <div className="flex flex-col gap-3">
            <SkeletonRow cols={4} />
            <SkeletonRow cols={4} />
            <SkeletonRow cols={4} />
          </div>
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
