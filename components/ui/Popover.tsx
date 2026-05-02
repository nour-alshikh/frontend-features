"use client";

import {
  useState, useEffect, useLayoutEffect, useRef, useCallback, ReactNode,
} from "react";
import { createPortal } from "react-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PopoverSide = "top" | "bottom" | "left" | "right";
export type PopoverAlign = "start" | "center" | "end";

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  side?: PopoverSide;
  align?: PopoverAlign;
  /** Close when clicking outside. Default: true */
  closeOnOutside?: boolean;
  className?: string;
}

// ─── Positioning ──────────────────────────────────────────────────────────────

const GAP = 6;

function computePos(
  anchor: DOMRect,
  panel: DOMRect,
  side: PopoverSide,
  align: PopoverAlign,
): { top: number; left: number } {
  let top = 0;
  let left = 0;

  // Side
  switch (side) {
    case "top":    top  = anchor.top - panel.height - GAP; break;
    case "bottom": top  = anchor.bottom + GAP; break;
    case "left":   left = anchor.left - panel.width - GAP; top = 0; break;
    case "right":  left = anchor.right + GAP; top = 0; break;
  }

  // Align on the cross-axis
  if (side === "top" || side === "bottom") {
    switch (align) {
      case "start":  left = anchor.left; break;
      case "center": left = anchor.left + anchor.width / 2 - panel.width / 2; break;
      case "end":    left = anchor.right - panel.width; break;
    }
  } else {
    switch (align) {
      case "start":  top = anchor.top; break;
      case "center": top = anchor.top + anchor.height / 2 - panel.height / 2; break;
      case "end":    top = anchor.bottom - panel.height; break;
    }
  }

  // Clamp to viewport
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  left = Math.max(4, Math.min(left, vw - panel.width - 4));
  top  = Math.max(4, Math.min(top,  vh - panel.height - 4));

  return { top, left };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Popover({
  trigger,
  children,
  side = "bottom",
  align = "start",
  closeOnOutside = true,
  className,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLSpanElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !panelRef.current) return;
    const anchor = triggerRef.current.getBoundingClientRect();
    const panel  = panelRef.current.getBoundingClientRect();
    setPos(computePos(anchor, panel, side, align));
  });

  // Close on outside click
  useEffect(() => {
    if (!open || !closeOnOutside) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, closeOnOutside]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex"
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
      </span>

      {mounted && open && createPortal(
        <div
          ref={panelRef}
          role="dialog"
          style={{
            position: "fixed",
            top:  pos ? pos.top  : -9999,
            left: pos ? pos.left : -9999,
            zIndex: 9999,
          }}
          className={[
            "bg-background border border-border rounded-xl shadow-xl",
            pos ? "animate-[fade-in_0.12s_ease-out]" : "",
            className,
          ].filter(Boolean).join(" ")}
        >
          {children}
        </div>,
        document.body,
      )}
    </>
  );
}
