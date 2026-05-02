"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface CommandGroup {
  label: string;
  items: CommandItem[];
}

interface CommandPaletteProps {
  groups: CommandGroup[];
  placeholder?: string;
  /** Controlled open state. When omitted the palette manages its own state via ⌘K / Ctrl+K. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// ─── Highlight match ──────────────────────────────────────────────────────────

function highlight(text: string, query: string): ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase().trim());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/20 text-accent font-semibold not-italic rounded-[2px] px-px">
        {text.slice(idx, idx + query.trim().length)}
      </mark>
      {text.slice(idx + query.trim().length)}
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CommandPalette({
  groups,
  placeholder = "Search commands…",
  open: controlledOpen,
  onOpenChange,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery]               = useState("");
  const [activeIdx, setActiveIdx]       = useState(0);
  const [mounted, setMounted]           = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen       = isControlled ? controlledOpen : internalOpen;

  const openPalette  = () => { if (!isControlled) setInternalOpen(true);  onOpenChange?.(true);  };
  const closePalette = () => { if (!isControlled) setInternalOpen(false); onOpenChange?.(false); };

  useEffect(() => { setMounted(true); }, []);

  // Global shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? closePalette() : openPalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Reset active index when query changes
  useEffect(() => { setActiveIdx(0); }, [query]);

  // Filter groups
  const filtered = groups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()),
      ),
    }))
    .filter((g) => g.items.length > 0);

  const flatItems = filtered.flatMap((g) => g.items);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      flatItems[activeIdx]?.onSelect();
      closePalette();
    } else if (e.key === "Escape") {
      closePalette();
    }
  };

  if (!mounted || !isOpen) return null;

  let globalIdx = 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) closePalette(); }}
    >
      <div
        className="w-full max-w-lg mx-4 bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-[scale-in_0.15s_cubic-bezier(0.4,0,0.2,1)]"
        onKeyDown={onKeyDown}
      >
        {/* Search row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <XIcon />
            </button>
          )}
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            filtered.map((group) => (
              <div key={group.label}>
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {group.label}
                </p>
                {group.items.map((item) => {
                  const idx     = globalIdx++;
                  const isActive = activeIdx === idx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-idx={idx}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => { item.onSelect(); closePalette(); }}
                      className={[
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        isActive ? "bg-accent/10" : "hover:bg-surface",
                      ].join(" ")}
                    >
                      {item.icon && (
                        <span className="shrink-0 text-muted-foreground w-4 h-4 flex items-center justify-center">
                          {item.icon}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {highlight(item.label, query)}
                        </p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {highlight(item.description, query)}
                          </p>
                        )}
                      </div>
                      {isActive && <EnterIcon />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-t border-border bg-surface">
          <span className="flex items-center gap-1.5">
            <Kbd>↑↓</Kbd>
            <span className="text-xs text-muted-foreground">navigate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            <span className="text-xs text-muted-foreground">select</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>Esc</Kbd>
            <span className="text-xs text-muted-foreground">close</span>
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Icons & helpers ──────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function EnterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0">
      <polyline points="9 10 4 15 9 20" />
      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
    </svg>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-[10px] text-muted-foreground font-mono leading-none">
      {children}
    </kbd>
  );
}
