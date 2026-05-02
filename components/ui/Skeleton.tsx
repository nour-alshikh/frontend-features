"use client";

import { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SkeletonVariant = "line" | "block" | "circle";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Skeleton({
  variant = "line",
  width,
  height,
  lines = 1,
  className,
}: SkeletonProps) {
  if (variant === "circle") {
    const size = width ?? height ?? 40;
    return (
      <span
        className={["block rounded-full bg-muted animate-pulse shrink-0", className].filter(Boolean).join(" ")}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  if (variant === "block") {
    return (
      <span
        className={["block rounded-lg bg-muted animate-pulse", className].filter(Boolean).join(" ")}
        style={{ width: width ?? "100%", height: height ?? 96 }}
        aria-hidden="true"
      />
    );
  }

  // line (default) — supports multi-line via `lines` prop
  if (lines > 1) {
    return (
      <span className={["flex flex-col gap-2", className].filter(Boolean).join(" ")} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className="block h-4 rounded bg-muted animate-pulse"
            style={{
              width: i === lines - 1 ? "60%" : width ?? "100%",
            }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className={["block h-4 rounded bg-muted animate-pulse", className].filter(Boolean).join(" ")}
      style={{ width: width ?? "100%", height: height }}
      aria-hidden="true"
    />
  );
}

// ─── Composite helpers ────────────────────────────────────────────────────────

/** Pre-built card skeleton: avatar + two lines of text */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={["flex items-start gap-3", className].filter(Boolean).join(" ")} aria-hidden="true">
      <Skeleton variant="circle" width={40} />
      <div className="flex-1 flex flex-col gap-2 pt-0.5">
        <Skeleton width="55%" />
        <Skeleton width="80%" />
      </div>
    </div>
  );
}

/** Row skeleton: matches a single table row */
export function SkeletonRow({ cols = 4, className }: { cols?: number; className?: string }) {
  const WIDTHS = ["45%", "60%", "55%", "70%", "40%", "65%", "50%"];
  return (
    <div className={["flex gap-4 items-center", className].filter(Boolean).join(" ")} aria-hidden="true">
      {Array.from({ length: cols }, (_, i) => (
        <Skeleton key={i} width={WIDTHS[i % WIDTHS.length]} className="flex-1" />
      ))}
    </div>
  );
}
