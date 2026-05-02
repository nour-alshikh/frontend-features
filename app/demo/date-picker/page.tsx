"use client";

import { useState } from "react";
import Link from "next/link";
import { DatePicker, DateRangePicker } from "@/components/ui/DatePicker";
import type { DateRange } from "@/components/ui/DatePicker";

export default function DatePickerDemo() {
  const [single, setSingle] = useState<Date | null>(null);
  const [birth,  setBirth]  = useState<Date | null>(null);
  const [range,  setRange]  = useState<DateRange>({ from: null, to: null });

  const today    = new Date();
  const minDate  = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const maxDate  = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
  const maxBirth = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Date Picker</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Calendar popup for single dates and ranges. Keyboard-navigable, portal-based, and viewport-aware.
      </p>

      <div className="flex flex-col gap-10 max-w-xl">

        <Section label="Single date">
          <DatePicker value={single} onChange={setSingle} />
          <p className="mt-2 text-xs text-muted-foreground">
            Selected: {single ? single.toDateString() : "none"}
          </p>
        </Section>

        <Section label="With min / max (today → +3 months)">
          <p className="text-xs text-muted-foreground mb-3">
            Dates outside the range are visually dimmed and unselectable.
          </p>
          <DatePicker
            value={single}
            onChange={setSingle}
            min={minDate}
            max={maxDate}
          />
        </Section>

        <Section label="Birth date (max: 18 years ago)">
          <DatePicker
            value={birth}
            onChange={setBirth}
            placeholder="Date of birth…"
            max={maxBirth}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Selected: {birth ? birth.toDateString() : "none"}
          </p>
        </Section>

        <Section label="Date range">
          <p className="text-xs text-muted-foreground mb-3">
            Click once to set start, click again to set end. Hover previews the range.
          </p>
          <DateRangePicker value={range} onChange={setRange} />
          <p className="mt-2 text-xs text-muted-foreground">
            From: {range.from ? range.from.toDateString() : "—"}&nbsp;&nbsp;
            To: {range.to ? range.to.toDateString() : "—"}
          </p>
        </Section>

        <Section label="Disabled">
          <div className="flex gap-4">
            <DatePicker value={new Date()} onChange={() => {}} disabled />
            <DateRangePicker
              value={{ from: new Date(), to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7) }}
              onChange={() => {}}
              disabled
            />
          </div>
        </Section>

        <Section label="Keyboard shortcuts">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Arrow keys — move focus by day</li>
            <li>Page Up / Page Down — previous / next month</li>
            <li>Enter or Space — select focused date</li>
            <li>Escape — close calendar</li>
          </ul>
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Portal-based — no z-index issues</li>
            <li>Position computed before paint (no flicker)</li>
            <li>Viewport-clamped — flips above trigger if no room below</li>
            <li>Range mode: hover previews the selection, click swaps if end &lt; start</li>
            <li>Today ringed with accent color</li>
            <li>Min / max support with disabled day rendering</li>
            <li>Clear button resets the value</li>
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
