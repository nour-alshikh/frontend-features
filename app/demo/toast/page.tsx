"use client";

import { useState } from "react";
import Link from "next/link";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import type { ToastType, ToastPosition } from "@/components/ui/Toast";

export default function ToastDemo() {
  const [position, setPosition] = useState<ToastPosition>("top-right");
  return (
    <ToastProvider position={position}>
      <DemoContent position={position} setPosition={setPosition} />
    </ToastProvider>
  );
}

function DemoContent({
  position,
  setPosition,
}: {
  position: ToastPosition;
  setPosition: (p: ToastPosition) => void;
}) {
  const toast = useToast();
  const [duration, setDuration] = useState(4000);

  const types: { type: ToastType; label: string; message: string }[] = [
    { type: "success", label: "Success",  message: "Changes saved successfully." },
    { type: "error",   label: "Error",    message: "Something went wrong. Please try again." },
    { type: "warning", label: "Warning",  message: "Your session is about to expire." },
    { type: "info",    label: "Info",     message: "A new version is available." },
  ];

  const positions: ToastPosition[] = [
    "top-right", "top-left", "top-center",
    "bottom-right", "bottom-left", "bottom-center",
  ];

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Toast Notifications</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Lightweight, auto-dismissing notifications with four types and six positions.
      </p>

      <div className="flex flex-col gap-10 max-w-xl">

        {/* Type buttons */}
        <Section label="Toast types">
          <div className="flex flex-wrap gap-3">
            {types.map(({ type, label, message }) => (
              <button
                key={type}
                type="button"
                onClick={() => toast(message, { type, duration })}
                className={typeButtonClass(type)}
              >
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* Persistent toast */}
        <Section label="Persistent (no auto-dismiss)">
          <button
            type="button"
            onClick={() => toast("This won't go away on its own.", { type: "info", duration: 0 })}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors"
          >
            Trigger persistent toast
          </button>
        </Section>

        {/* Duration slider */}
        <Section label={`Auto-dismiss duration — ${duration === 0 ? "persistent" : `${duration / 1000}s`}`}>
          <input
            type="range"
            min={0}
            max={10000}
            step={500}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Persistent</span><span>10 s</span>
          </div>
        </Section>

        {/* Position picker */}
        <Section label="Position">
          <p className="text-xs text-muted-foreground mb-3">
            Pass <code className="bg-surface px-1 rounded">position</code> to{" "}
            <code className="bg-surface px-1 rounded">ToastProvider</code>.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {positions.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPosition(p)}
                className={[
                  "px-3 py-1.5 rounded-lg border text-xs transition-colors",
                  p === position
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-surface text-foreground hover:border-accent",
                ].join(" ")}
              >
                {p}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Currently: <span className="text-foreground font-medium">{position}</span>
          </p>
        </Section>

        {/* Stack test */}
        <Section label="Stack multiple toasts">
          <button
            type="button"
            onClick={() => {
              types.forEach(({ type, message }, i) => {
                setTimeout(() => toast(message, { type, duration }), i * 150);
              });
            }}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors"
          >
            Fire all 4 at once
          </button>
        </Section>

      </div>
    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-4">{label}</p>
      {children}
    </div>
  );
}

function typeButtonClass(type: ToastType) {
  const base = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
  const map: Record<ToastType, string> = {
    success: `${base} bg-success text-success-foreground hover:opacity-90`,
    error:   `${base} bg-destructive text-destructive-foreground hover:opacity-90`,
    warning: `${base} bg-warning text-warning-foreground hover:opacity-90`,
    info:    `${base} bg-accent text-accent-foreground hover:opacity-90`,
  };
  return map[type];
}
