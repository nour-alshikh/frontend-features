"use client";

import {
  createContext, useContext, useRef, useCallback,
  useLayoutEffect, ReactNode,
} from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

interface ContinuityContextValue {
  registerElement: (name: string, el: HTMLElement) => void;
  unregisterElement: (name: string) => void;
  /** Snapshot the current rect of a named element before a state change. */
  snapshot: (name: string) => void;
  /** Consume and return a stored snapshot (clears it). */
  popSnapshot: (name: string) => DOMRect | null;
  duration: number;
}

const ContinuityContext = createContext<ContinuityContextValue>({
  registerElement: () => {},
  unregisterElement: () => {},
  snapshot: () => {},
  popSnapshot: () => null,
  duration: 380,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ContinuityProvider({
  children,
  duration = 380,
}: {
  children: ReactNode;
  duration?: number;
}) {
  const elements  = useRef(new Map<string, HTMLElement>());
  const snapshots = useRef(new Map<string, DOMRect>());

  const registerElement = useCallback((name: string, el: HTMLElement) => {
    elements.current.set(name, el);
  }, []);

  const unregisterElement = useCallback((name: string) => {
    elements.current.delete(name);
  }, []);

  const snapshot = useCallback((name: string) => {
    const el = elements.current.get(name);
    if (el) snapshots.current.set(name, el.getBoundingClientRect());
  }, []);

  const popSnapshot = useCallback((name: string): DOMRect | null => {
    const rect = snapshots.current.get(name) ?? null;
    snapshots.current.delete(name);
    return rect;
  }, []);

  return (
    <ContinuityContext.Provider value={{ registerElement, unregisterElement, snapshot, popSnapshot, duration }}>
      {children}
    </ContinuityContext.Provider>
  );
}

// ─── Element ──────────────────────────────────────────────────────────────────

interface ContinuityElementProps {
  /** Unique name — matched elements animate between each other across view changes. */
  name: string;
  className?: string;
  children: ReactNode;
}

export function ContinuityElement({ name, className, children }: ContinuityElementProps) {
  const { registerElement, unregisterElement, popSnapshot, duration } = useContext(ContinuityContext);
  const ref        = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  // Register / unregister with the provider so snapshot() can find this element.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerElement(name, el);
    return () => unregisterElement(name);
  }, [name, registerElement, unregisterElement]);

  // After every commit: if a snapshot exists for this name, FLIP from it to here.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || isAnimating.current) return;

    const fromRect = popSnapshot(name);
    if (!fromRect) return;

    const toRect = el.getBoundingClientRect();
    const dx = fromRect.left - toRect.left;
    const dy = fromRect.top  - toRect.top;
    const sx = toRect.width  > 0 ? fromRect.width  / toRect.width  : 1;
    const sy = toRect.height > 0 ? fromRect.height / toRect.height : 1;

    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.02 && Math.abs(sy - 1) < 0.02) return;

    isAnimating.current = true;

    // Web Animations API — compositor-threaded, no double-rAF timing issues.
    const anim = el.animate(
      [
        { transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})`, transformOrigin: "top left", opacity: "0.6" },
        { transform: "translate(0,0) scale(1)",                        transformOrigin: "top left", opacity: "1"   },
      ],
      { duration, easing: "cubic-bezier(0.4,0,0.2,1)", fill: "none" }
    );

    anim.onfinish = () => { isAnimating.current = false; };
    anim.oncancel = () => { isAnimating.current = false; };
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Call snapshot(name) immediately before any state change that will cause
 * a ContinuityElement to move, resize, or swap between components.
 */
export function useContinuity() {
  const { snapshot } = useContext(ContinuityContext);
  return { snapshot };
}
