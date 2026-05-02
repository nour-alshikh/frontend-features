"use client";

import {
  useState, useRef, useEffect, useCallback, ReactNode, CSSProperties,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  /** Visible area height in px */
  height: number;
  renderItem: (item: T, index: number) => ReactNode;
  /** Extra rows to render above and below the visible window. Default: 3 */
  overscan?: number;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VirtualList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  overscan = 3,
  className,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;

  // Visible window
  const startIdx = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIdx   = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + height) / itemHeight) + overscan,
  );

  const visibleItems = items.slice(startIdx, endIdx + 1);

  const onScroll = useCallback(() => {
    if (containerRef.current) setScrollTop(containerRef.current.scrollTop);
  }, []);

  // Scroll to top when items list changes identity
  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
    setScrollTop(0);
  }, [items]);

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{ height, overflowY: "auto" }}
      className={["relative", className].filter(Boolean).join(" ")}
    >
      {/* Spacer that gives the scrollbar the correct total height */}
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item, relIdx) => {
          const absIdx = startIdx + relIdx;
          return (
            <div
              key={absIdx}
              style={{
                position: "absolute",
                top: absIdx * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
            >
              {renderItem(item, absIdx)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
