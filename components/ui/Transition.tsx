"use client";

import { useState, useEffect, CSSProperties, ReactNode } from "react";

export type TransitionPreset =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale";

const presets: Record<TransitionPreset, { enter: CSSProperties; exit: CSSProperties }> = {
  "fade":        { enter: { opacity: 1, transform: "none" },            exit: { opacity: 0, transform: "none" } },
  "slide-up":    { enter: { opacity: 1, transform: "translateY(0)" },   exit: { opacity: 0, transform: "translateY(14px)" } },
  "slide-down":  { enter: { opacity: 1, transform: "translateY(0)" },   exit: { opacity: 0, transform: "translateY(-14px)" } },
  "slide-left":  { enter: { opacity: 1, transform: "translateX(0)" },   exit: { opacity: 0, transform: "translateX(14px)" } },
  "slide-right": { enter: { opacity: 1, transform: "translateX(0)" },   exit: { opacity: 0, transform: "translateX(-14px)" } },
  "scale":       { enter: { opacity: 1, transform: "scale(1)" },        exit: { opacity: 0, transform: "scale(0.94)" } },
};

interface TransitionProps {
  show: boolean;
  preset?: TransitionPreset;
  duration?: number;
  className?: string;
  children: ReactNode;
}

export function Transition({
  show,
  preset = "fade",
  duration = 250,
  className,
  children,
}: TransitionProps) {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setMounted(true);
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), duration);
      return () => clearTimeout(t);
    }
  }, [show, duration]);

  if (!mounted) return null;

  const { enter, exit } = presets[preset];

  return (
    <div
      className={className}
      style={{
        ...(visible ? enter : exit),
        transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
      }}
    >
      {children}
    </div>
  );
}
