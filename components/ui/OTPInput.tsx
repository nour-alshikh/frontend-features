"use client";

import { useRef, KeyboardEvent, ClipboardEvent } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OTPInputProps {
  length?: 4 | 5 | 6;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Show dots instead of characters */
  secure?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  secure = false,
  className,
}: OTPInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(length, "").slice(0, length).split("");

  const focus = (idx: number) => inputs.current[idx]?.focus();

  const set = (idx: number, char: string) => {
    const next = digits.slice();
    next[idx] = char.replace(/\D/g, "").slice(-1);
    onChange(next.join(""));
    if (char && idx < length - 1) focus(idx + 1);
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[idx]) {
        set(idx, "");
      } else if (idx > 0) {
        const next = digits.slice();
        next[idx - 1] = "";
        onChange(next.join(""));
        focus(idx - 1);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      focus(idx - 1);
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      e.preventDefault();
      focus(idx + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted.padEnd(length, "").slice(0, length));
    focus(Math.min(pasted.length, length - 1));
  };

  return (
    <div
      className={["flex gap-2", className].filter(Boolean).join(" ")}
      aria-label="One-time password input"
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type={secure ? "password" : "text"}
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={d}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          onChange={(e) => set(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          onPaste={i === 0 ? handlePaste : undefined}
          className={[
            "w-11 h-13 text-center text-xl font-semibold rounded-xl border outline-none transition-colors",
            "bg-surface text-foreground",
            "border-border focus:border-accent focus:ring-2 focus:ring-accent/30",
            disabled ? "opacity-50 cursor-not-allowed" : "",
          ].filter(Boolean).join(" ")}
        />
      ))}
    </div>
  );
}
