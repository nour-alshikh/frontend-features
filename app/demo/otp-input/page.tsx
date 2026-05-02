"use client";

import { useState } from "react";
import Link from "next/link";
import { OTPInput } from "@/components/ui/OTPInput";

export default function OTPInputDemo() {
  const [code4, setCode4] = useState("");
  const [code6, setCode6] = useState("");
  const [secureCode, setSecureCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (code6.length === 6) setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">OTP Input</h1>
      <p className="text-sm text-muted-foreground mb-10">
        4–6 digit pin fields with auto-advance, backspace navigation, and paste support.
      </p>

      <div className="flex flex-col gap-10 max-w-xl">

        <Section label="4-digit PIN">
          <OTPInput length={4} value={code4} onChange={setCode4} />
          {code4.length === 4 && (
            <p className="mt-3 text-sm text-success">PIN entered: {code4}</p>
          )}
        </Section>

        <Section label="6-digit code">
          <OTPInput length={6} value={code6} onChange={setCode6} />
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={code6.length < 6}
              className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Verify
            </button>
            {submitted && <p className="text-sm text-success">✓ Code verified!</p>}
          </div>
        </Section>

        <Section label="Secure (dots)">
          <OTPInput length={6} value={secureCode} onChange={setSecureCode} secure />
          <p className="mt-2 text-xs text-muted-foreground">Raw value: {secureCode || "—"}</p>
        </Section>

        <Section label="Disabled">
          <OTPInput length={6} value="123456" onChange={() => {}} disabled />
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Digits only — non-numeric input is ignored</li>
            <li>Auto-advances to next field on input</li>
            <li>Backspace clears current, then moves to previous</li>
            <li>Arrow keys move focus left / right</li>
            <li>Paste on the first field fills all digits at once</li>
            <li>Secure mode shows password dots</li>
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
