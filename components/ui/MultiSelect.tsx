"use client";

import {
  useState, useRef, useEffect, KeyboardEvent, ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  disabled = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter(
    (o) => o.label.toLowerCase().includes(query.toLowerCase()) && !value.includes(o.value),
  );

  const toggle = (val: string) => {
    onChange(value.includes(val) ? value.filter((v) => v !== val) : [...value, val]);
  };

  const removeAt = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reset active index on filter change
  useEffect(() => { setActiveIdx(0); }, [query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && filtered[activeIdx]) { e.preventDefault(); toggle(filtered[activeIdx].value); setQuery(""); }
    else if (e.key === "Escape") { setOpen(false); }
    else if (e.key === "Backspace" && !query && value.length > 0) { onChange(value.slice(0, -1)); }
  };

  const selectedLabels = value.map((v) => options.find((o) => o.value === v)?.label ?? v);

  return (
    <div ref={containerRef} className={["relative", className].filter(Boolean).join(" ")}>
      {/* Input row */}
      <div
        onClick={() => { if (!disabled) { setOpen(true); inputRef.current?.focus(); } }}
        className={[
          "min-h-[42px] flex flex-wrap gap-1.5 items-center px-3 py-2 rounded-xl border transition-colors cursor-text",
          open ? "border-accent ring-2 ring-accent/20" : "border-border",
          disabled ? "opacity-50 cursor-not-allowed bg-muted" : "bg-background",
        ].join(" ")}
      >
        {/* Chips */}
        {value.map((v, i) => (
          <span
            key={v}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-accent/15 text-accent text-xs font-medium"
          >
            {selectedLabels[i]}
            {!disabled && (
              <button
                type="button"
                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); removeAt(i); }}
                aria-label={`Remove ${selectedLabels[i]}`}
                className="hover:opacity-70 transition-opacity"
              >
                <XIcon />
              </button>
            )}
          </span>
        ))}

        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[80px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />

        {/* Chevron */}
        <ChevronIcon open={open} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-background border border-border rounded-xl shadow-xl max-h-56 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              {query ? `No results for "${query}"` : "All options selected"}
            </p>
          ) : (
            filtered.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); toggle(opt.value); setQuery(""); }}
                onMouseEnter={() => setActiveIdx(i)}
                className={[
                  "w-full text-left px-4 py-2.5 text-sm transition-colors",
                  i === activeIdx ? "bg-accent/10 text-accent" : "text-foreground hover:bg-surface",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={["shrink-0 text-muted-foreground transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
