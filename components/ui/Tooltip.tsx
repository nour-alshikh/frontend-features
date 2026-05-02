"use client";

import {
  useState, useEffect, useLayoutEffect, useRef, useCallback, ReactNode, CSSProperties,
} from "react";
import { createPortal } from "react-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: ReactNode;
  side?: TooltipSide;
  delay?: number;
  className?: string;
  children: ReactNode;
}

// ─── Positioning ──────────────────────────────────────────────────────────────

const GAP = 8;

function opposite(s: TooltipSide): TooltipSide {
  return s === "top" ? "bottom" : s === "bottom" ? "top" : s === "left" ? "right" : "left";
}

function computePos(
  trigger: DOMRect,
  tooltip: DOMRect,
  s: TooltipSide,
): { top: number; left: number } {
  switch (s) {
    case "top":
      return { top: trigger.top - tooltip.height - GAP, left: trigger.left + trigger.width / 2 - tooltip.width / 2 };
    case "bottom":
      return { top: trigger.bottom + GAP, left: trigger.left + trigger.width / 2 - tooltip.width / 2 };
    case "left":
      return { top: trigger.top + trigger.height / 2 - tooltip.height / 2, left: trigger.left - tooltip.width - GAP };
    case "right":
      return { top: trigger.top + trigger.height / 2 - tooltip.height / 2, left: trigger.right + GAP };
  }
}

function getBestPos(
  trigger: DOMRect,
  tooltip: DOMRect,
  preferred: TooltipSide,
): { top: number; left: number; side: TooltipSide } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const order: TooltipSide[] = [preferred, opposite(preferred), "top", "bottom", "left", "right"];
  for (const s of order) {
    const p = computePos(trigger, tooltip, s);
    if (p.top >= 4 && p.left >= 4 && p.top + tooltip.height <= vh - 4 && p.left + tooltip.width <= vw - 4) {
      return { ...p, side: s };
    }
  }
  return { ...computePos(trigger, tooltip, preferred), side: preferred };
}

// ─── Arrow styles ─────────────────────────────────────────────────────────────

const ARROW_BASE: CSSProperties = { position: "absolute", width: 0, height: 0 };

function arrowStyle(side: TooltipSide): CSSProperties {
  const fg = "var(--color-foreground)";
  const tr = "transparent";
  switch (side) {
    case "top":
      return { ...ARROW_BASE, bottom: -4, left: "50%", transform: "translateX(-50%)", borderLeft: `4px solid ${tr}`, borderRight: `4px solid ${tr}`, borderTop: `4px solid ${fg}` };
    case "bottom":
      return { ...ARROW_BASE, top: -4, left: "50%", transform: "translateX(-50%)", borderLeft: `4px solid ${tr}`, borderRight: `4px solid ${tr}`, borderBottom: `4px solid ${fg}` };
    case "left":
      return { ...ARROW_BASE, right: -4, top: "50%", transform: "translateY(-50%)", borderTop: `4px solid ${tr}`, borderBottom: `4px solid ${tr}`, borderLeft: `4px solid ${fg}` };
    case "right":
      return { ...ARROW_BASE, left: -4, top: "50%", transform: "translateY(-50%)", borderTop: `4px solid ${tr}`, borderBottom: `4px solid ${tr}`, borderRight: `4px solid ${fg}` };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Tooltip({ content, side = "top", delay = 300, className, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; side: TooltipSide } | null>(null);
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const show = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setPos(null);
  }, []);

  // Calculate position after every render where tooltip is visible.
  // useLayoutEffect fires before paint → no flicker.
  useLayoutEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;
    const tr = triggerRef.current.getBoundingClientRect();
    const tt = tooltipRef.current.getBoundingClientRect();
    setPos(getBestPos(tr, tt, side));
  });

  const currentSide = pos?.side ?? side;

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>

      {mounted && visible && createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: "fixed",
            top:  pos ? pos.top  : -9999,
            left: pos ? pos.left : -9999,
            zIndex: 9999,
          }}
          className={[
            "pointer-events-none px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap",
            "bg-foreground text-background shadow-md max-w-[220px]",
            pos ? "animate-[fade-in_0.12s_ease-out]" : "",
            className,
          ].filter(Boolean).join(" ")}
        >
          {content}
          <span style={arrowStyle(currentSide)} />
        </div>,
        document.body,
      )}
    </>
  );
}
