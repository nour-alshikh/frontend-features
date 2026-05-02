"use client";

import { useState } from "react";
import Link from "next/link";

import { Transition }                                from "@/components/ui/Transition";
import { TransitionGroup, TransitionItem, useTransitionGroup } from "@/components/ui/TransitionGroup";
import { DrillGroup, DrillItem, useDrill }           from "@/components/ui/DrillTransition";
import { TransitionLink }                            from "@/components/ui/TransitionLink";
import { ContinuityProvider, ContinuityElement, useContinuity } from "@/components/ui/ContinuityTransition";

import type { TransitionPreset } from "@/components/ui/Transition";

const presets: TransitionPreset[] = [
  "fade", "slide-up", "slide-down", "slide-left", "slide-right", "scale",
];

export default function TransitionDemo() {
  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Transitions</h1>
      <p className="text-sm text-muted-foreground mb-12">
        Four focused transition primitives — each in its own file.
      </p>

      <div className="flex flex-col gap-16 max-w-2xl">

        <Section label="Transition — show / hide">
          <p className="text-xs text-muted-foreground mb-6">
            Six presets. Element unmounts after the exit animation completes.
          </p>
          <PresetShowcase />
        </Section>

        <Section label="TransitionGroup — tab switching">
          <p className="text-xs text-muted-foreground mb-6">
            Context-coordinated items share a preset and duration.
          </p>
          <TabExample />
        </Section>

        <Section label="TransitionGroup — step wizard">
          <StepWizard />
        </Section>

        <Section label="DrillTransition — drill-down navigation">
          <p className="text-xs text-muted-foreground mb-6">
            History stack tracks direction. Forward slides in from right; back slides in from left.
          </p>
          <DrillDemo />
        </Section>

        <Section label="ContinuityTransition — shared-element FLIP">
          <p className="text-xs text-muted-foreground mb-6">
            Call <code className="bg-surface px-1 rounded">snapshot(name)</code> before a state
            change. The matching <code className="bg-surface px-1 rounded">ContinuityElement</code>{" "}
            FLIP-animates from its old rect to its new one — across components.
          </p>
          <ContinuityProvider>
            <ContinuityDemo />
          </ContinuityProvider>
        </Section>

        <Section label="TransitionLink — page navigation">
          <p className="text-xs text-muted-foreground mb-4">
            Uses the View Transitions API (Chrome/Edge); falls back to{" "}
            <code className="bg-surface px-1 rounded">router.push()</code>.
          </p>
          <div className="flex gap-3">
            <TransitionLink
              href="/"
              className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm hover:opacity-90 transition-opacity"
            >
              → Dashboard
            </TransitionLink>
            <TransitionLink
              href="/demo/transition/step"
              className="px-4 py-2 rounded-lg border border-border bg-surface text-sm hover:border-accent transition-colors"
            >
              → Step page
            </TransitionLink>
          </div>
        </Section>

      </div>
    </main>
  );
}

// ── Preset showcase ───────────────────────────────────────────────────────────

function PresetShowcase() {
  const [active, setActive] = useState<TransitionPreset | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setActive(active === p ? null : p)}
            className={[
              "px-3 py-1.5 rounded-lg border text-sm transition-colors",
              active === p
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-surface text-foreground hover:border-accent",
            ].join(" ")}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="min-h-[64px] flex items-start">
        {presets.map((p) => (
          <Transition key={p} show={active === p} preset={p} duration={280}>
            <div className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium">
              {p}
            </div>
          </Transition>
        ))}
        {!active && (
          <p className="text-sm text-muted-foreground self-center">Pick a preset above.</p>
        )}
      </div>
    </div>
  );
}

// ── Tab example ───────────────────────────────────────────────────────────────

const tabs = [
  { id: "overview", label: "Overview", body: "Overview: first tab. Fades in when selected." },
  { id: "details",  label: "Details",  body: "Details: more specific info. Switch to see the transition." },
  { id: "settings", label: "Settings", body: "Settings: configure options. Transition keeps it fluid." },
];

function TabExample() {
  return (
    <TransitionGroup defaultKey="overview" preset="fade" duration={220}>
      <TabNav />
      <div className="mt-4 min-h-[48px]">
        {tabs.map((t) => (
          <TransitionItem key={t.id} id={t.id}>
            <p className="text-sm text-foreground leading-relaxed">{t.body}</p>
          </TransitionItem>
        ))}
      </div>
    </TransitionGroup>
  );
}

function TabNav() {
  const { activeKey, navigate } = useTransitionGroup();
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => navigate(t.id)}
          className={[
            "px-4 py-2 text-sm transition-colors border-b-2 -mb-px",
            activeKey === t.id
              ? "border-accent text-foreground font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Step wizard ───────────────────────────────────────────────────────────────

const steps = [
  { id: "s1", title: "Step 1 — Your info",   body: "Enter your name and email to get started." },
  { id: "s2", title: "Step 2 — Preferences", body: "Choose your settings and preferences." },
  { id: "s3", title: "Step 3 — Review",      body: "Review your details before submitting." },
];

function StepWizard() {
  const [stepIdx, setStepIdx] = useState(0);
  return (
    <TransitionGroup defaultKey={steps[0].id} preset="slide-left" duration={260}>
      <StepContent stepIdx={stepIdx} setStepIdx={setStepIdx} />
    </TransitionGroup>
  );
}

function StepContent({ stepIdx, setStepIdx }: { stepIdx: number; setStepIdx: (i: number) => void }) {
  const { navigate } = useTransitionGroup();
  const go = (i: number) => { setStepIdx(i); navigate(steps[i].id); };
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex gap-2 mb-6">
        {steps.map((s, i) => (
          <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= stepIdx ? "bg-accent" : "bg-muted"}`} />
        ))}
      </div>
      <div className="min-h-[60px] mb-6 overflow-hidden">
        {steps.map((s) => (
          <TransitionItem key={s.id} id={s.id}>
            <p className="text-sm font-semibold mb-1">{s.title}</p>
            <p className="text-sm text-muted-foreground">{s.body}</p>
          </TransitionItem>
        ))}
      </div>
      <div className="flex gap-2">
        {stepIdx > 0 && (
          <button type="button" onClick={() => go(stepIdx - 1)} className="px-4 py-2 rounded-lg border border-border bg-background text-sm hover:border-accent transition-colors">
            ← Back
          </button>
        )}
        {stepIdx < steps.length - 1 ? (
          <button type="button" onClick={() => go(stepIdx + 1)} className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm hover:opacity-90 ml-auto">
            Next →
          </button>
        ) : (
          <button type="button" onClick={() => go(0)} className="px-4 py-2 rounded-lg bg-success text-success-foreground text-sm hover:opacity-90 ml-auto">
            Submit ✓
          </button>
        )}
      </div>
    </div>
  );
}

// ── Drill demo ────────────────────────────────────────────────────────────────

const categories = [
  { id: "design", label: "Design", items: ["Typography", "Colors", "Spacing", "Icons"] },
  { id: "code",   label: "Code",   items: ["Components", "Hooks", "Utilities", "Types"] },
  { id: "docs",   label: "Docs",   items: ["Getting started", "API reference", "Examples", "Changelog"] },
];

function DrillDemo() {
  return (
    <DrillGroup defaultKey="root" className="h-64 rounded-xl border border-border bg-surface">
      <DrillScreen id="root" />
      {categories.map((cat) => (
        <DrillScreen key={cat.id} id={cat.id} category={cat} />
      ))}
      {categories.flatMap((cat) =>
        cat.items.map((item) => (
          <DrillScreen key={`${cat.id}/${item}`} id={`${cat.id}/${item}`} item={item} parent={cat.label} />
        ))
      )}
    </DrillGroup>
  );
}

function DrillScreen({ id, category, item, parent }: {
  id: string;
  category?: { id: string; label: string; items: string[] };
  item?: string;
  parent?: string;
}) {
  const { navigate, back, canGoBack } = useDrill();
  return (
    <DrillItem id={id}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
          {canGoBack && (
            <button type="button" onClick={back} className="text-accent text-sm hover:opacity-70">← Back</button>
          )}
          <span className="text-sm font-medium">{item ?? category?.label ?? "Settings"}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {!category && !item && categories.map((cat) => (
            <button key={cat.id} type="button" onClick={() => navigate(cat.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-muted transition-colors border-b border-border last:border-0">
              {cat.label}<ChevronRight />
            </button>
          ))}
          {category && category.items.map((it) => (
            <button key={it} type="button" onClick={() => navigate(`${category.id}/${it}`)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-muted transition-colors border-b border-border last:border-0">
              {it}<ChevronRight />
            </button>
          ))}
          {item && (
            <div className="px-4 py-6 text-sm text-muted-foreground">
              Drilled into <span className="text-foreground font-medium">{parent} → {item}</span>.
            </div>
          )}
        </div>
      </div>
    </DrillItem>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// ── Continuity demo ───────────────────────────────────────────────────────────

const cards = [
  { id: "a", label: "Analytics", bg: "bg-accent",      text: "text-accent-foreground" },
  { id: "b", label: "Users",     bg: "bg-success",     text: "text-success-foreground" },
  { id: "c", label: "Alerts",    bg: "bg-destructive", text: "text-destructive-foreground" },
  { id: "d", label: "Revenue",   bg: "bg-warning",     text: "text-warning-foreground" },
  { id: "e", label: "Reports",   bg: "bg-primary",     text: "text-primary-foreground" },
  { id: "f", label: "Archive",   bg: "bg-muted",       text: "text-foreground" },
];

function ContinuityDemo() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { snapshot } = useContinuity();

  if (expanded) {
    const card = cards.find((c) => c.id === expanded)!;
    return (
      <ContinuityElement name={`card-${expanded}`} className="rounded-xl overflow-hidden">
        <div className={`${card.bg} ${card.text} p-6 min-h-[160px] flex flex-col`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold">{card.label}</span>
            <button
              type="button"
              onClick={() => { snapshot(`card-${expanded}`); setExpanded(null); }}
              className="text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              × Close
            </button>
          </div>
          <p className="text-sm opacity-75 leading-relaxed mt-auto">
            This card grew from its grid position. Tap Close to watch it shrink back.
          </p>
        </div>
      </ContinuityElement>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card) => (
        <ContinuityElement key={card.id} name={`card-${card.id}`} className="rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => { snapshot(`card-${card.id}`); setExpanded(card.id); }}
            className={`${card.bg} ${card.text} w-full py-6 text-sm font-medium hover:opacity-90 transition-opacity`}
          >
            {card.label}
          </button>
        </ContinuityElement>
      ))}
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-4">{label}</p>
      {children}
    </div>
  );
}
