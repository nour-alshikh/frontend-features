"use client";

import Link from "next/link";
import { Popover } from "@/components/ui/Popover";
import type { PopoverSide, PopoverAlign } from "@/components/ui/Popover";

const SIDES: PopoverSide[]  = ["bottom", "top", "left", "right"];
const ALIGNS: PopoverAlign[] = ["start", "center", "end"];

export default function PopoverDemo() {
  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Popover</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Click-triggered floating panel. Portals to <code className="bg-surface px-1 rounded">document.body</code>,
        clamps to viewport, closes on outside click or Escape.
      </p>

      <div className="flex flex-col gap-12 max-w-2xl">

        <Section label="Four sides">
          <div className="flex flex-wrap gap-4">
            {SIDES.map((side) => (
              <Popover
                key={side}
                side={side}
                trigger={
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors capitalize"
                  >
                    {side}
                  </button>
                }
              >
                <div className="p-3 text-sm text-foreground">
                  Popover on the <strong>{side}</strong>
                </div>
              </Popover>
            ))}
          </div>
        </Section>

        <Section label="Alignment (bottom side)">
          <div className="flex flex-wrap gap-4">
            {ALIGNS.map((align) => (
              <Popover
                key={align}
                side="bottom"
                align={align}
                trigger={
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors capitalize"
                  >
                    {align}
                  </button>
                }
              >
                <div className="p-3 text-sm text-foreground whitespace-nowrap">
                  Aligned to <strong>{align}</strong>
                </div>
              </Popover>
            ))}
          </div>
        </Section>

        <Section label="Rich content — user card">
          <Popover
            trigger={
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold">A</div>
                Alice Martin
              </button>
            }
          >
            <div className="w-56 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">A</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Alice Martin</p>
                  <p className="text-xs text-muted-foreground">alice@example.com</p>
                </div>
              </div>
              <div className="border-t border-border pt-3 flex flex-col gap-1">
                <button type="button" className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-foreground hover:bg-surface transition-colors">View profile</button>
                <button type="button" className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-foreground hover:bg-surface transition-colors">Settings</button>
                <button type="button" className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">Sign out</button>
              </div>
            </div>
          </Popover>
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Portals to <code className="bg-surface px-1 rounded">document.body</code> — no z-index issues</li>
            <li>Position computed with <code className="bg-surface px-1 rounded">useLayoutEffect</code> — no flicker</li>
            <li>Clamped to viewport (4 px margin on all sides)</li>
            <li>Closes on outside mousedown or Escape key</li>
            <li>Four sides × three alignments = 12 placement options</li>
            <li>Accepts any ReactNode as content</li>
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
