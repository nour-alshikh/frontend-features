"use client";

import { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  title: string;
  description?: ReactNode;
  date?: string;
  icon?: ReactNode;
  /** Color token class for the connector dot. Default: "bg-accent" */
  color?: string;
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Timeline({ events, className }: TimelineProps) {
  return (
    <ol className={["relative", className].filter(Boolean).join(" ")} aria-label="Timeline">
      {events.map((event, i) => {
        const isLast = i === events.length - 1;
        return (
          <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Connector line */}
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute left-[15px] top-8 bottom-0 w-px bg-border"
              />
            )}

            {/* Dot / icon */}
            <span className="relative z-10 shrink-0 mt-0.5">
              {event.icon ? (
                <span className={["w-8 h-8 flex items-center justify-center rounded-full border-2 border-background", event.color ?? "bg-accent text-accent-foreground"].join(" ")}>
                  {event.icon}
                </span>
              ) : (
                <span className={["w-8 h-8 flex items-center justify-center rounded-full border-2 border-background", event.color ?? "bg-accent"].join(" ")} />
              )}
            </span>

            {/* Content */}
            <div className="flex-1 pt-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <p className="text-sm font-semibold text-foreground">{event.title}</p>
                {event.date && (
                  <time className="text-xs text-muted-foreground">{event.date}</time>
                )}
              </div>
              {event.description && (
                <div className="text-sm text-muted-foreground">{event.description}</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
