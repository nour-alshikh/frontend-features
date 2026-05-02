"use client";

import { useState, useRef, ReactNode, createContext, useContext, useId } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

interface AccordionCtx {
  open: Set<string>;
  toggle: (id: string) => void;
}

const Ctx = createContext<AccordionCtx | null>(null);

function useAccordion() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("AccordionItem must be inside Accordion");
  return ctx;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccordionProps {
  /** Allow multiple panels open at once. Default: false (single). */
  multiple?: boolean;
  /** Initially open item ids */
  defaultOpen?: string[];
  className?: string;
  children: ReactNode;
}

interface AccordionItemProps {
  id?: string;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

// ─── Accordion ────────────────────────────────────────────────────────────────

export function Accordion({ multiple = false, defaultOpen = [], className, children }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ open, toggle }}>
      <div className={["divide-y divide-border rounded-xl border border-border overflow-hidden", className].filter(Boolean).join(" ")}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

// ─── AccordionItem ────────────────────────────────────────────────────────────

export function AccordionItem({ id: externalId, title, children, className }: AccordionItemProps) {
  const uid = useId();
  const id = externalId ?? uid;
  const { open, toggle } = useAccordion();
  const isOpen = open.has(id);

  const contentRef = useRef<HTMLDivElement>(null);

  const panelId  = `${id}-panel`;
  const headerId = `${id}-header`;

  return (
    <div className={className}>
      <button
        id={headerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground bg-surface hover:bg-muted transition-colors"
      >
        <span>{title}</span>
        <ChevronIcon open={isOpen} />
      </button>

      {/* Animated panel — height 0 → auto via max-height trick */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? (contentRef.current?.scrollHeight ?? 9999) : 0 }}
      >
        <div ref={contentRef} className="px-5 py-4 text-sm text-muted-foreground bg-background">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Icon ─────────────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={["shrink-0 text-muted-foreground transition-transform duration-300", open ? "rotate-180" : ""].join(" ")}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
