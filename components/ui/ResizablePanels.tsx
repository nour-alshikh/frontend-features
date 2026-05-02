"use client";

import {
  useState, useRef, useCallback, useEffect, ReactNode, CSSProperties,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ResizableDirection = "horizontal" | "vertical";

export interface ResizablePanelsProps {
  direction?: ResizableDirection;
  /** Initial size of the first panel as a percentage (0–100). Default: 50 */
  defaultSplit?: number;
  /** Minimum size of each panel as a percentage. Default: 10 */
  minSize?: number;
  children: [ReactNode, ReactNode];
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ResizablePanels({
  direction = "horizontal",
  defaultSplit = 50,
  minSize = 10,
  children,
  className,
}: ResizablePanelsProps) {
  const [split, setSplit] = useState(defaultSplit);
  const containerRef      = useRef<HTMLDivElement>(null);
  const dragging          = useRef(false);

  const isHoriz = direction === "horizontal";

  const startDrag = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect   = containerRef.current.getBoundingClientRect();
    const offset = isHoriz ? e.clientX - rect.left : e.clientY - rect.top;
    const total  = isHoriz ? rect.width            : rect.height;
    const pct    = Math.max(minSize, Math.min(100 - minSize, (offset / total) * 100));
    setSplit(pct);
  }, [isHoriz, minSize]);

  const stopDrag = useCallback(() => { dragging.current = false; }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup",   stopDrag);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup",   stopDrag);
    };
  }, [onPointerMove, stopDrag]);

  // Panel size styles
  const panel1Style: CSSProperties = isHoriz
    ? { width: `${split}%`,       minWidth: 0 }
    : { height: `${split}%`,      minHeight: 0 };
  const panel2Style: CSSProperties = isHoriz
    ? { width: `${100 - split}%`, minWidth: 0 }
    : { height: `${100 - split}%`, minHeight: 0 };

  // Handle styles
  const handleBase: CSSProperties = {
    flexShrink: 0,
    background: "var(--color-border)",
    transition: "background 0.15s",
  };
  const handleStyle: CSSProperties = isHoriz
    ? { ...handleBase, width: 4,  cursor: "col-resize", alignSelf: "stretch" }
    : { ...handleBase, height: 4, cursor: "row-resize", alignSelf: "stretch" };

  return (
    <div
      ref={containerRef}
      className={[
        "flex overflow-hidden",
        isHoriz ? "flex-row" : "flex-col",
        className,
      ].filter(Boolean).join(" ")}
    >
      {/* Panel 1 */}
      <div style={panel1Style} className="overflow-auto">
        {children[0]}
      </div>

      {/* Drag handle */}
      <div
        style={handleStyle}
        onPointerDown={startDrag}
        aria-hidden="true"
        className={[
          "hover:bg-accent active:bg-accent transition-colors",
          isHoriz ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize",
        ].join(" ")}
      >
        {/* Grip dots */}
        <div
          className={[
            "flex items-center justify-center h-full",
            isHoriz ? "flex-col gap-0.5" : "flex-row gap-0.5",
          ].join(" ")}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          ))}
        </div>
      </div>

      {/* Panel 2 */}
      <div style={panel2Style} className="overflow-auto">
        {children[1]}
      </div>
    </div>
  );
}
