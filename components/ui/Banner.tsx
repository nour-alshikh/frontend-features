"use client";

import { useState, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BannerType = "info" | "success" | "warning" | "error";

export interface BannerProps {
  type?: BannerType;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES: Record<BannerType, { wrap: string; icon: ReactNode }> = {
  info: {
    wrap: "bg-accent/10 border-accent/30 text-accent",
    icon: <InfoIcon />,
  },
  success: {
    wrap: "bg-success/10 border-success/30 text-success",
    icon: <CheckIcon />,
  },
  warning: {
    wrap: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    icon: <WarnIcon />,
  },
  error: {
    wrap: "bg-destructive/10 border-destructive/30 text-destructive",
    icon: <ErrorIcon />,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Banner({
  type = "info",
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}: BannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const { wrap, icon } = STYLES[type];

  const dismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={["flex gap-3 rounded-xl border px-4 py-3.5", wrap, className].filter(Boolean).join(" ")}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>

      <div className="flex-1 text-sm">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="text-foreground/80">{children}</div>
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
