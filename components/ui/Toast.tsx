"use client";

import { createContext, useCallback, useContext, useState, useSyncExternalStore, ReactNode } from "react";
import { createPortal } from "react-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-right" | "top-left" | "top-center"
  | "bottom-right" | "bottom-left" | "bottom-center";

export interface ToastOptions {
  type?: ToastType;
  /** Auto-dismiss delay in ms. 0 = persistent (manual dismiss only). Default: 4000 */
  duration?: number;
}

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  exiting: boolean;
}

type ToastFn = (message: string, options?: ToastOptions) => void;

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastFn>(() => {});

// ─── Position map ─────────────────────────────────────────────────────────────

const positionClasses: Record<ToastPosition, string> = {
  "top-right":     "top-4 right-4 items-end",
  "top-left":      "top-4 left-4 items-start",
  "top-center":    "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right":  "bottom-4 right-4 items-end",
  "bottom-left":   "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({
  children,
  position = "top-right",
}: {
  children: ReactNode;
  position?: ToastPosition;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 260);
  }, []);

  const toast = useCallback<ToastFn>((message, options) => {
    const id = Math.random().toString(36).slice(2);
    const duration = options?.duration ?? 4000;
    setToasts((prev) => [...prev, {
      id,
      message,
      type: options?.type ?? "info",
      duration,
      exiting: false,
    }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {mounted && createPortal(
        <div
          className={`fixed z-50 flex flex-col gap-2 pointer-events-none ${positionClasses[position]}`}
          aria-live="polite"
          aria-label="Notifications"
        >
          {toasts.map((t) => (
            <ToastCard key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastFn {
  return useContext(ToastContext);
}

// ─── Toast card ───────────────────────────────────────────────────────────────

const typeConfig: Record<ToastType, { icon: ReactNode; iconClass: string; barClass: string }> = {
  success: { icon: <CheckCircleIcon />, iconClass: "text-success",     barClass: "bg-success" },
  error:   { icon: <XCircleIcon />,     iconClass: "text-destructive", barClass: "bg-destructive" },
  warning: { icon: <AlertIcon />,       iconClass: "text-warning",     barClass: "bg-warning" },
  info:    { icon: <InfoIcon />,        iconClass: "text-accent",      barClass: "bg-accent" },
};

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const { icon, iconClass, barClass } = typeConfig[item.type];

  return (
    <div
      role="alert"
      className={[
        "pointer-events-auto w-80 rounded-xl border border-border bg-background shadow-lg overflow-hidden",
        item.exiting
          ? "animate-[toast-out_0.25s_ease_forwards]"
          : "animate-[toast-in_0.25s_ease_forwards]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3 p-4">
        <span className={`shrink-0 mt-0.5 ${iconClass}`}>{icon}</span>
        <p className="flex-1 text-sm text-foreground leading-relaxed">{item.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <XIcon />
        </button>
      </div>
      {/* Progress bar — drains over duration, hidden for persistent toasts */}
      <div className="h-1 bg-muted overflow-hidden">
        {item.duration > 0 && (
          <div
            className={`h-full w-full ${barClass}`}
            style={{ animation: `toast-progress ${item.duration}ms linear forwards` }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
