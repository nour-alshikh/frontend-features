"use client";

import { ReactNode, useRef, useEffect, useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  /** Collapse middle items when they overflow. Default: true */
  collapse?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Breadcrumbs({
  items,
  separator = <ChevronIcon />,
  collapse = true,
  className,
}: BreadcrumbsProps) {
  const [collapsed, setCollapsed] = useState(true);

  // Always show first + last; collapse middle when collapse=true and >3 items
  const shouldCollapse = collapse && collapsed && items.length > 3;

  const visible: (BreadcrumbItem | "ellipsis")[] = shouldCollapse
    ? [items[0], "ellipsis", items[items.length - 1]]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {visible.map((item, i) => {
          if (item === "ellipsis") {
            return (
              <li key="ellipsis" className="flex items-center gap-1">
                <span className="text-muted-foreground">{separator}</span>
                <button
                  type="button"
                  onClick={() => setCollapsed(false)}
                  aria-label="Show all breadcrumbs"
                  className="px-1.5 py-0.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                >
                  …
                </button>
              </li>
            );
          }

          const isLast = i === visible.length - 1;

          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-muted-foreground">{separator}</span>}
              {isLast || !item.href ? (
                <span
                  className={isLast ? "font-medium text-foreground" : "text-muted-foreground"}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─── Icon ─────────────────────────────────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
