"use client";

import { useState } from "react";
import Link from "next/link";
import { ColorPicker } from "@/components/ui/ColorPicker";

const SWATCHES = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#000000", "#71717a", "#ffffff",
];

export default function ColorPickerDemo() {
  const [hex, setHex]   = useState("#6366f1");
  const [rgb, setRgb]   = useState("rgb(99, 102, 241)");
  const [hsl, setHsl]   = useState("hsl(239, 84%, 67%)");

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Color Picker</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Hue/saturation canvas with a hue slider, hex/rgb/hsl input tabs, and format-selectable output.
      </p>

      <div className="flex flex-col gap-12 max-w-2xl">

        <Section label="HEX output">
          <div className="flex gap-8 flex-wrap items-start">
            <ColorPicker value={hex} onChange={setHex} format="hex" />
            <div className="flex flex-col gap-2 pt-2">
              <div
                className="w-32 h-20 rounded-xl border border-border shadow-sm"
                style={{ background: hex }}
              />
              <p className="text-sm font-mono text-foreground">{hex}</p>
            </div>
          </div>
        </Section>

        <Section label="RGB output">
          <div className="flex gap-8 flex-wrap items-start">
            <ColorPicker value={rgb} onChange={setRgb} format="rgb" />
            <div className="flex flex-col gap-2 pt-2">
              <div
                className="w-32 h-20 rounded-xl border border-border shadow-sm"
                style={{ background: rgb }}
              />
              <p className="text-sm font-mono text-foreground">{rgb}</p>
            </div>
          </div>
        </Section>

        <Section label="HSL output">
          <div className="flex gap-8 flex-wrap items-start">
            <ColorPicker value={hsl} onChange={setHsl} format="hsl" />
            <div className="flex flex-col gap-2 pt-2">
              <div
                className="w-32 h-20 rounded-xl border border-border shadow-sm"
                style={{ background: hsl }}
              />
              <p className="text-sm font-mono text-foreground">{hsl}</p>
            </div>
          </div>
        </Section>

        <Section label="Preset swatches → feed into picker">
          <p className="text-xs text-muted-foreground mb-4">
            Click a swatch to load it into the pickers above.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {SWATCHES.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                onClick={() => { setHex(color); setRgb(color); setHsl(color); }}
                className="w-8 h-8 rounded-lg border-2 border-border hover:border-accent transition-colors"
                style={{ background: color }}
              />
            ))}
          </div>
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Saturation/value canvas — drag anywhere to pick a color</li>
            <li>Hue rail — drag to change hue</li>
            <li>Live preview swatch next to the hue slider</li>
            <li>Three tabs: HEX, RGB, HSL input</li>
            <li>HEX input validates and ignores non-hex characters</li>
            <li>All math done with pure functions — no canvas API, no deps</li>
            <li>Pointer capture on drag — stays accurate when cursor leaves</li>
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
