"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function ProgressBarDemo() {
  const [value, setValue] = useState(40);

  // Auto-running demo
  const [autoValue, setAutoValue] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setAutoValue((v) => {
        if (v >= 100) {
          setRunning(false);
          return 100;
        }
        return v + 2;
      });
    }, 60);
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const resetAuto = () => {
    setRunning(false);
    setAutoValue(0);
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-10">ProgressBar</h1>

      <div className="max-w-lg flex flex-col gap-12">

        {/* Live preview */}
        <Section label="Live preview">
          <ProgressBar value={value} showLabel size="md" />
          <div className="flex items-center gap-4 mt-4">
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="flex-1 accent-[var(--color-accent)]"
            />
            <span className="text-sm font-mono w-10 text-right text-muted-foreground">
              {value}%
            </span>
          </div>
        </Section>

        {/* Colors */}
        <Section label="Colors">
          <div className="flex flex-col gap-4">
            {(["accent", "primary", "success", "destructive"] as const).map((color) => (
              <div key={color} className="flex items-center gap-4">
                <span className="w-24 text-xs text-muted-foreground">{color}</span>
                <ProgressBar value={65} color={color} className="flex-1" />
              </div>
            ))}
          </div>
        </Section>

        {/* Sizes */}
        <Section label="Sizes">
          <div className="flex flex-col gap-4">
            {(["sm", "md", "lg"] as const).map((size) => (
              <div key={size} className="flex items-center gap-4">
                <span className="w-24 text-xs text-muted-foreground">{size}</span>
                <ProgressBar value={72} size={size} className="flex-1" />
              </div>
            ))}
          </div>
        </Section>

        {/* Indeterminate */}
        <Section label="Indeterminate">
          <ProgressBar indeterminate color="accent" />
          <ProgressBar indeterminate color="success" size="sm" className="mt-3" />
        </Section>

        {/* Animated fill */}
        <Section label="Animated fill">
          <ProgressBar value={autoValue} showLabel color="success" size="lg" />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => { setAutoValue(0); setRunning(true); }}
              disabled={running}
              className="rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-1.5 hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              Run
            </button>
            <button
              onClick={resetAuto}
              className="rounded-lg border border-border text-sm font-medium px-4 py-1.5 hover:bg-surface transition-colors"
            >
              Reset
            </button>
          </div>
        </Section>

      </div>
    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">{label}</p>
      {children}
    </div>
  );
}
