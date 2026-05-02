"use client";

import Link from "next/link";
import { Tooltip } from "@/components/ui/Tooltip";
import type { TooltipSide } from "@/components/ui/Tooltip";

const SIDES: TooltipSide[] = ["top", "bottom", "left", "right"];

export default function TooltipDemo() {
  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Tooltip</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Hover any element below. Tooltips portal to <code className="bg-surface px-1 rounded">document.body</code>,
        auto-flip when they would overflow the viewport, and show after a configurable delay.
      </p>

      <div className="flex flex-col gap-12 max-w-2xl">

        <Section label="Four sides">
          <div className="flex flex-wrap gap-4">
            {SIDES.map((side) => (
              <Tooltip key={side} content={`I'm on the ${side}`} side={side}>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors capitalize"
                >
                  {side}
                </button>
              </Tooltip>
            ))}
          </div>
        </Section>

        <Section label="Custom delay">
          <div className="flex flex-wrap gap-4">
            {[0, 150, 500, 1000].map((delay) => (
              <Tooltip key={delay} content={`delay: ${delay}ms`} delay={delay}>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors"
                >
                  {delay === 0 ? "Instant" : `${delay} ms`}
                </button>
              </Tooltip>
            ))}
          </div>
        </Section>

        <Section label="Rich content">
          <div className="flex flex-wrap gap-4">
            <Tooltip
              content={
                <span className="flex items-center gap-1.5">
                  <StarIcon />
                  Favourited — click to remove
                </span>
              }
            >
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                ★ Favourite
              </button>
            </Tooltip>

            <Tooltip content="Copies the link to your clipboard">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors"
              >
                Copy link
              </button>
            </Tooltip>

            <Tooltip content="This action cannot be undone">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
            </Tooltip>
          </div>
        </Section>

        <Section label="On icons (keyboard accessible)">
          <p className="text-xs text-muted-foreground mb-4">
            Tab to focus the buttons — the tooltip also shows on focus.
          </p>
          <div className="flex gap-3">
            {[
              { icon: <BellIcon />,   tip: "Notifications (3 unread)" },
              { icon: <SearchIcon />, tip: "Search (Ctrl+K)" },
              { icon: <GearIcon />,   tip: "Settings" },
              { icon: <HelpIcon />,   tip: "Help & Documentation" },
            ].map(({ icon, tip }) => (
              <Tooltip key={tip} content={tip}>
                <button
                  type="button"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {icon}
                </button>
              </Tooltip>
            ))}
          </div>
        </Section>

        <Section label="Auto-flip near edge">
          <p className="text-xs text-muted-foreground mb-4">
            The tooltip prefers <code className="bg-surface px-1 rounded">top</code> but flips to{" "}
            <code className="bg-surface px-1 rounded">bottom</code> when it would clip the viewport.
            Scroll this page to the top and hover the button — then scroll down and hover again.
          </p>
          <Tooltip content="I flip when I would overflow the viewport" side="top">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors"
            >
              Hover me (top preferred)
            </button>
          </Tooltip>
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Portals to <code className="bg-surface px-1 rounded">document.body</code> — no z-index issues</li>
            <li>Auto-flips through all four sides to stay in viewport</li>
            <li>Configurable delay (default 300 ms)</li>
            <li>Keyboard accessible — shows on focus, hides on blur</li>
            <li>CSS arrow adapts direction to final computed side</li>
            <li>Accepts any <code className="bg-surface px-1 rounded">ReactNode</code> as content</li>
          </ul>
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

function StarIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>; }
function BellIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function SearchIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>; }
function GearIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>; }
function HelpIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>; }
