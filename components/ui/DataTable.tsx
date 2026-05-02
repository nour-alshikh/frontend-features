"use client";

import { useState, useMemo, useRef, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Column<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  /** Custom cell renderer. Falls back to String(value). */
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  selectable?: boolean;
  loading?: boolean;
  skeletonRows?: number;
  className?: string;
}

type SortDir = "asc" | "desc";

// Fixed widths for skeleton cells — deterministic so SSR/client never mismatch.
const SKEL_WIDTHS = ["45%", "60%", "55%", "70%", "40%", "65%", "50%", "75%", "35%", "80%"];

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 10,
  selectable = false,
  loading = false,
  skeletonRows = 5,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<(keyof T & string) | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(0);

  // ── Sort ────────────────────────────────────────────────────────────────────

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = String(a[sortKey] ?? "");
      const bv = String(b[sortKey] ?? "");
      const cmp = av.localeCompare(bv, undefined, { numeric: true, sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  // ── Pagination ──────────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const clampedPage = Math.min(page, totalPages - 1);
  const pageRows = sorted.slice(clampedPage * pageSize, (clampedPage + 1) * pageSize);
  const pageIndices = pageRows.map((_, i) => clampedPage * pageSize + i);

  // ── Selection ───────────────────────────────────────────────────────────────

  const allSelected  = pageIndices.length > 0 && pageIndices.every((i) => selected.has(i));
  const someSelected = !allSelected && pageIndices.some((i) => selected.has(i));

  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      allSelected ? pageIndices.forEach((i) => next.delete(i)) : pageIndices.forEach((i) => next.add(i));
      return next;
    });

  const toggleRow = (idx: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });

  // ── Sort handler ────────────────────────────────────────────────────────────

  const handleSort = (key: keyof T & string) => {
    setSortKey((prev) => {
      if (prev === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      else { setSortDir("asc"); }
      return key;
    });
    setPage(0);
  };

  const colCount = columns.length + (selectable ? 1 : 0);

  return (
    <div className={["flex flex-col gap-4", className].filter(Boolean).join(" ")}>
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* Head */}
            <thead>
              <tr className="bg-surface border-b border-border">
                {selectable && (
                  <th className="w-10 px-4 py-3">
                    <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={[
                      "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap",
                      col.sortable ? "cursor-pointer select-none hover:text-foreground transition-colors" : "",
                    ].join(" ")}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && <SortIcon active={sortKey === col.key} dir={sortDir} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: skeletonRows }, (_, ri) => (
                  <tr key={ri}>
                    {selectable && (
                      <td className="px-4 py-3.5">
                        <div className="w-4 h-4 rounded bg-muted animate-pulse" />
                      </td>
                    )}
                    {columns.map((col, ci) => (
                      <td key={col.key} className="px-4 py-3.5">
                        <div
                          className="h-4 rounded bg-muted animate-pulse"
                          style={{ width: SKEL_WIDTHS[(ri * columns.length + ci) % SKEL_WIDTHS.length] }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="text-center py-14 text-sm text-muted-foreground">
                    No data
                  </td>
                </tr>
              ) : (
                pageRows.map((row, ri) => {
                  const globalIdx = clampedPage * pageSize + ri;
                  const isSelected = selected.has(globalIdx);
                  return (
                    <tr
                      key={globalIdx}
                      className={["transition-colors", isSelected ? "bg-accent/5" : "hover:bg-surface"].join(" ")}
                    >
                      {selectable && (
                        <td className="px-4 py-3.5">
                          <Checkbox checked={isSelected} onChange={() => toggleRow(globalIdx)} />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3.5 text-foreground">
                          {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="text-xs">
            {selectable && selected.size > 0
              ? `${selected.size} of ${data.length} selected`
              : `${data.length} row${data.length !== 1 ? "s" : ""}`}
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <PageBtn onClick={() => setPage(0)} disabled={clampedPage === 0}>«</PageBtn>
              <PageBtn onClick={() => setPage((p) => p - 1)} disabled={clampedPage === 0}>‹</PageBtn>
              <span className="px-3 py-1.5 text-xs text-foreground font-medium tabular-nums">
                {clampedPage + 1} / {totalPages}
              </span>
              <PageBtn onClick={() => setPage((p) => p + 1)} disabled={clampedPage >= totalPages - 1}>›</PageBtn>
              <PageBtn onClick={() => setPage(totalPages - 1)} disabled={clampedPage >= totalPages - 1}>»</PageBtn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className={["text-[10px] leading-none transition-colors", active ? "text-accent" : "opacity-30"].join(" ")}>
      {active && dir === "desc" ? "▼" : "▲"}
    </span>
  );
}

function PageBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-surface text-sm hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function Checkbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      ref={(el) => { if (el) el.indeterminate = indeterminate ?? false; }}
      onChange={onChange}
      className="w-4 h-4 rounded accent-accent cursor-pointer"
    />
  );
}
