"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";

type DrillDirection = "forward" | "back";
type DrillPhase = "entering" | "visible" | "exiting";

interface DrillContextValue {
  activeKey: string;
  direction: DrillDirection;
  navigate: (key: string) => void;
  back: () => void;
  canGoBack: boolean;
  duration: number;
}

const DrillContext = createContext<DrillContextValue>({
  activeKey: "",
  direction: "forward",
  navigate: () => {},
  back: () => {},
  canGoBack: false,
  duration: 320,
});

interface DrillGroupProps {
  defaultKey: string;
  duration?: number;
  className?: string;
  children: ReactNode;
}

export function DrillGroup({
  defaultKey,
  duration = 320,
  className,
  children,
}: DrillGroupProps) {
  const [activeKey, setActiveKey] = useState(defaultKey);
  const [direction, setDirection] = useState<DrillDirection>("forward");
  const history = useRef<string[]>([defaultKey]);

  const navigate = useCallback((key: string) => {
    history.current = [...history.current, key];
    setDirection("forward");
    setActiveKey(key);
  }, []);

  const back = useCallback(() => {
    if (history.current.length <= 1) return;
    const next = history.current.slice(0, -1);
    history.current = next;
    setDirection("back");
    setActiveKey(next[next.length - 1]);
  }, []);

  return (
    <DrillContext.Provider value={{
      activeKey, direction, navigate, back,
      canGoBack: history.current.length > 1,
      duration,
    }}>
      <div className={`relative overflow-hidden ${className ?? ""}`}>
        {children}
      </div>
    </DrillContext.Provider>
  );
}

interface DrillItemProps {
  id: string;
  className?: string;
  children: ReactNode;
}

export function DrillItem({ id, className, children }: DrillItemProps) {
  const { activeKey, direction, duration } = useContext(DrillContext);
  const isActive = activeKey === id;

  const [mounted, setMounted] = useState(isActive);
  const [phase, setPhase] = useState<DrillPhase>(isActive ? "visible" : "exiting");
  const dir = useRef<DrillDirection>(direction);

  useEffect(() => {
    if (isActive) {
      dir.current = direction;
      setMounted(true);
      setPhase("entering");
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setPhase("visible"))
      );
      return () => cancelAnimationFrame(raf);
    } else {
      if (!mounted) return;
      dir.current = direction;
      setPhase("exiting");
      const t = setTimeout(() => setMounted(false), duration);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  if (!mounted) return null;

  const offset = "56px";
  const transform =
    phase === "entering" ? (dir.current === "forward" ? `translateX(${offset})` : `translateX(-${offset})`) :
    phase === "exiting"  ? (dir.current === "forward" ? `translateX(-${offset})` : `translateX(${offset})`) :
    "translateX(0)";

  return (
    <div
      className={`absolute inset-0 overflow-y-auto ${className ?? ""}`}
      style={{
        opacity: phase === "visible" ? 1 : 0,
        transform,
        transition: phase === "entering"
          ? "none"
          : `opacity ${duration}ms ease, transform ${duration}ms ease`,
      }}
    >
      {children}
    </div>
  );
}

export function useDrill() {
  const { activeKey, navigate, back, canGoBack } = useContext(DrillContext);
  return { activeKey, navigate, back, canGoBack };
}
