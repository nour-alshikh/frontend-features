"use client";

import { useEffect, useRef, ReactNode } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** True during the first search — hides results and shows skeletons */
  loading?: boolean;
  /** True while fetching the next page — keeps results visible, adds bottom spinner */
  loadingMore?: boolean;
  /** Whether more pages exist */
  hasMore?: boolean;
  /** Called when the scroll sentinel enters the viewport */
  onLoadMore?: () => void;
  /** Number of skeleton cards to show while loading */
  skeletonCount?: number;
  /** Rendered results */
  children?: ReactNode;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  skeletonCount = 6,
  children,
  className,
}: SearchInputProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Attach IntersectionObserver to the scroll sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loadingMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMore?.(); },
      { rootMargin: "120px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);

  const showSkeletons = loading && value.trim().length > 0;
  const showResults   = !loading && !!children;

  return (
    <div className={className}>
      {/* ── Input ── */}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-muted-foreground pointer-events-none">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent transition-shadow"
        />
        <span className="absolute right-3 text-muted-foreground">
          {loading
            ? <Spinner />
            : value
            ? (
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Clear search"
                className="hover:text-foreground transition-colors"
              >
                <XIcon />
              </button>
            )
            : null}
        </span>
      </div>

      {/* ── Skeleton grid ── */}
      {showSkeletons && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ── Results + infinite scroll ── */}
      {showResults && (
        <div className="mt-5">
          {children}

          {/* Sentinel for IntersectionObserver */}
          <div ref={sentinelRef} className="h-10 mt-4 flex items-center justify-center">
            {loadingMore && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner /> Loading more…
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-muted shrink-0" />
        <div className="h-2.5 w-24 rounded-full bg-muted" />
      </div>
      <div className="h-3.5 w-3/4 rounded-full bg-muted" />
      <div className="flex flex-col gap-1.5">
        <div className="h-2.5 w-full rounded-full bg-muted" />
        <div className="h-2.5 w-4/5 rounded-full bg-muted" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="h-2.5 w-16 rounded-full bg-muted" />
        <div className="h-2.5 w-10 rounded-full bg-muted" />
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
