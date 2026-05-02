"use client";

import { useState } from "react";
import Link from "next/link";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

export default function CountdownTimerDemo() {
  const [completedMsg, setCompletedMsg] = useState("");

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-10">CountdownTimer</h1>

      <div className="flex flex-col gap-16">

        <Section label="Size sm — 30 seconds">
          <CountdownTimer duration={30} size="sm" />
        </Section>

        <Section label="Size md — 2 minutes (default)">
          <CountdownTimer duration={120} size="md" />
        </Section>

        <Section label="Size lg — 5 minutes">
          <CountdownTimer duration={30000} size="lg" />
        </Section>

        <Section label="onComplete callback — 10 seconds">
          <CountdownTimer
            duration={10}
            onComplete={() => setCompletedMsg("Timer finished!")}
          />
          {completedMsg && (
            <p className="mt-4 text-sm font-medium text-success">{completedMsg}</p>
          )}
        </Section>

        <Section label="autoStart — 15 seconds">
          <CountdownTimer duration={15} autoStart />
        </Section>

      </div>
    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-6">{label}</p>
      {children}
    </div>
  );
}
