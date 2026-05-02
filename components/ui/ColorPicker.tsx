"use client";

import {
  useState, useEffect, useRef, useCallback, PointerEvent as RPointerEvent,
} from "react";

// ─── Color math ───────────────────────────────────────────────────────────────

interface HSV { h: number; s: number; v: number }
interface RGB { r: number; g: number; b: number }

function hsvToRgb({ h, s, v }: HSV): RGB {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return { r: Math.round(f(5) * 255), g: Math.round(f(3) * 255), b: Math.round(f(1) * 255) };
}

function rgbToHsv({ r, g, b }: RGB): HSV {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d   = max - min;
  const s   = max === 0 ? 0 : d / max;
  const v   = max;
  let h = 0;
  if (d !== 0) {
    if      (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else                h = (r - g) / d + 4;
    h = ((h * 60) + 360) % 360;
  }
  return { h, s, v };
}

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const n = parseInt(clean, 16);
  if (isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }: RGB): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl({ r, g, b }: RGB) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l   = (max + min) / 2;
  const d   = max - min;
  if (d === 0) return { h: 0, s: 0, l: Math.round(l * 100) };
  const s   = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = ((h * 60) + 360) % 360;
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ColorFormat = "hex" | "rgb" | "hsl";

export interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  /** Output format for onChange. Default: "hex" */
  format?: ColorFormat;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ColorPicker({ value, onChange, format = "hex", className }: ColorPickerProps) {
  // Parse incoming value → HSV working state
  const parseToHsv = (v: string): HSV => {
    const rgb = hexToRgb(v) ?? { r: 99, g: 102, b: 241 }; // accent default
    return rgbToHsv(rgb);
  };

  const [hsv, setHsv] = useState<HSV>(() => parseToHsv(value));
  const [hexInput, setHexInput] = useState(() => {
    const rgb = hsvToRgb(parseToHsv(value));
    return rgbToHex(rgb).replace("#", "");
  });
  const [activeTab, setActiveTab] = useState<ColorFormat>(format);

  const svRef  = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  // Sync external value → internal (only when it actually changes)
  const rgb     = hsvToRgb(hsv);
  const hex     = rgbToHex(rgb);

  const emit = useCallback((newHsv: HSV) => {
    const r = hsvToRgb(newHsv);
    let out = "";
    if (format === "hex") out = rgbToHex(r);
    else if (format === "rgb") out = `rgb(${r.r}, ${r.g}, ${r.b})`;
    else {
      const hsl = rgbToHsl(r);
      out = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    onChange(out);
  }, [format, onChange]);

  // ── SV canvas drag ──────────────────���───────────────────────────────────────

  const draggingSV  = useRef(false);
  const draggingHue = useRef(false);

  const updateSV = useCallback((clientX: number, clientY: number) => {
    const el = svRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const s = clamp((clientX - left) / width,  0, 1);
    const v = clamp(1 - (clientY - top) / height, 0, 1);
    const next = { ...hsv, s, v };
    setHsv(next);
    setHexInput(rgbToHex(hsvToRgb(next)).replace("#", ""));
    emit(next);
  }, [hsv, emit]);

  const updateHue = useCallback((clientX: number) => {
    const el = hueRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const h = clamp(((clientX - left) / width) * 360, 0, 360);
    const next = { ...hsv, h };
    setHsv(next);
    setHexInput(rgbToHex(hsvToRgb(next)).replace("#", ""));
    emit(next);
  }, [hsv, emit]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (draggingSV.current)  updateSV(e.clientX, e.clientY);
      if (draggingHue.current) updateHue(e.clientX);
    };
    const up = () => { draggingSV.current = false; draggingHue.current = false; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [updateSV, updateHue]);

  // ── Hex input ───────────────────────────────────────────────────────────────

  const handleHexChange = (raw: string) => {
    const clean = raw.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
    setHexInput(clean);
    if (clean.length === 6) {
      const rgb = hexToRgb("#" + clean);
      if (rgb) {
        const next = rgbToHsv(rgb);
        setHsv(next);
        emit(next);
      }
    }
  };

  // ── RGB inputs ────────────────────────────────���─────────────────────────────

  const handleRgbChange = (channel: "r" | "g" | "b", raw: string) => {
    const n = clamp(parseInt(raw) || 0, 0, 255);
    const next = rgbToHsv({ ...rgb, [channel]: n });
    setHsv(next);
    setHexInput(rgbToHex(hsvToRgb(next)).replace("#", ""));
    emit(next);
  };

  // ── Derived display ───────────────────���────────────────────────���─────────────

  const hsl = rgbToHsl(rgb);
  const pureHueRgb = hsvToRgb({ h: hsv.h, s: 1, v: 1 });
  const pureHueHex = rgbToHex(pureHueRgb);

  return (
    <div className={["w-64 select-none", className].filter(Boolean).join(" ")}>

      {/* SV canvas */}
      <div
        ref={svRef}
        className="w-full h-44 rounded-xl mb-3 relative overflow-hidden cursor-crosshair"
        style={{
          background: `linear-gradient(to top, #000, transparent),
                       linear-gradient(to right, #fff, ${pureHueHex})`,
        }}
        onPointerDown={(e) => { draggingSV.current = true; e.currentTarget.setPointerCapture(e.pointerId); updateSV(e.clientX, e.clientY); }}
      >
        {/* Thumb */}
        <div
          style={{
            position: "absolute",
            left:   `${hsv.s * 100}%`,
            top:    `${(1 - hsv.v) * 100}%`,
            transform: "translate(-50%, -50%)",
            width: 14, height: 14,
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.3)",
            background: hex,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Hue slider */}
      <div className="flex items-center gap-3 mb-4">
        {/* Preview swatch */}
        <div
          className="w-8 h-8 rounded-full shrink-0 border border-border"
          style={{ background: hex }}
        />

        <div
          ref={hueRef}
          className="flex-1 h-3 rounded-full cursor-pointer relative"
          style={{
            background: "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)",
          }}
          onPointerDown={(e) => { draggingHue.current = true; e.currentTarget.setPointerCapture(e.pointerId); updateHue(e.clientX); }}
        >
          {/* Thumb */}
          <div
            style={{
              position: "absolute",
              left: `${(hsv.h / 360) * 100}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 16, height: 16,
              borderRadius: "50%",
              border: "2px solid white",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.3)",
              background: pureHueHex,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Format tabs */}
      <div className="flex gap-1 mb-3">
        {(["hex", "rgb", "hsl"] as ColorFormat[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveTab(f)}
            className={[
              "flex-1 py-1 text-xs font-medium rounded-lg transition-colors uppercase tracking-wide",
              activeTab === f
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-surface",
            ].join(" ")}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Inputs */}
      {activeTab === "hex" && (
        <div className="flex items-center border border-border rounded-xl overflow-hidden">
          <span className="px-3 py-2 text-sm text-muted-foreground bg-surface border-r border-border select-none">#</span>
          <input
            type="text"
            value={hexInput.toUpperCase()}
            onChange={(e) => handleHexChange(e.target.value)}
            maxLength={6}
            className="flex-1 px-3 py-2 text-sm text-foreground bg-background outline-none font-mono uppercase"
          />
        </div>
      )}

      {activeTab === "rgb" && (
        <div className="flex gap-2">
          {(["r", "g", "b"] as const).map((ch) => (
            <div key={ch} className="flex-1">
              <input
                type="number"
                min={0}
                max={255}
                value={rgb[ch]}
                onChange={(e) => handleRgbChange(ch, e.target.value)}
                className="w-full px-2 py-2 text-sm text-center text-foreground bg-surface border border-border rounded-xl outline-none focus:border-accent appearance-none"
              />
              <p className="text-center text-[10px] text-muted-foreground mt-1 uppercase">{ch}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "hsl" && (
        <div className="flex gap-2">
          {([
            { label: "H", value: hsl.h, suffix: "°" },
            { label: "S", value: hsl.s, suffix: "%" },
            { label: "L", value: hsl.l, suffix: "%" },
          ]).map(({ label, value: val, suffix }) => (
            <div key={label} className="flex-1">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <span className="px-2 py-2 text-sm text-foreground bg-surface font-mono">{val}</span>
                <span className="pr-2 text-xs text-muted-foreground bg-surface">{suffix}</span>
              </div>
              <p className="text-center text-[10px] text-muted-foreground mt-1 uppercase">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
