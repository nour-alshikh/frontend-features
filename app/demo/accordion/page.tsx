"use client";

import Link from "next/link";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";

const FAQ = [
  {
    id: "q1",
    title: "What is a component library?",
    body: "A component library is a collection of reusable UI elements — buttons, inputs, modals — built to a consistent visual language. It speeds up development by providing ready-made, accessible building blocks.",
  },
  {
    id: "q2",
    title: "Why build without heavy dependencies?",
    body: "Fewer dependencies mean smaller bundles, fewer breaking changes, and full control over behaviour. Native browser APIs (Drag & Drop, View Transitions, ResizeObserver) are surprisingly powerful.",
  },
  {
    id: "q3",
    title: "How does the accordion animate?",
    body: "It uses a max-height transition from 0 to the panel's scrollHeight. The chevron rotates 180° with a CSS transform. No JS animation libraries required.",
  },
  {
    id: "q4",
    title: "Can I have multiple panels open?",
    body: "Yes — pass the `multiple` prop to the Accordion component. By default only one panel can be open at a time (single-open mode).",
  },
];

export default function AccordionDemo() {
  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Accordion</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Animated expand / collapse panels with single-open and multi-open modes.
      </p>

      <div className="flex flex-col gap-10 max-w-xl">

        <Section label="Single-open (default)">
          <p className="text-xs text-muted-foreground mb-4">
            Opening a new panel closes the current one.
          </p>
          <Accordion defaultOpen={["q1"]}>
            {FAQ.map((item) => (
              <AccordionItem key={item.id} id={item.id} title={item.title}>
                {item.body}
              </AccordionItem>
            ))}
          </Accordion>
        </Section>

        <Section label="Multi-open">
          <p className="text-xs text-muted-foreground mb-4">
            Pass <code className="bg-surface px-1 rounded">multiple</code> to allow several panels open at once.
          </p>
          <Accordion multiple defaultOpen={["q1", "q3"]}>
            {FAQ.map((item) => (
              <AccordionItem key={item.id} id={item.id} title={item.title}>
                {item.body}
              </AccordionItem>
            ))}
          </Accordion>
        </Section>

        <Section label="Custom title content">
          <Accordion>
            <AccordionItem title={<span className="flex items-center gap-2"><span className="text-accent">✦</span> Rich title with icon</span>}>
              The title accepts any ReactNode — icons, badges, or anything else.
            </AccordionItem>
            <AccordionItem title={<span className="flex items-center justify-between w-full pr-2"><span>Status</span><span className="text-xs px-2 py-0.5 rounded-full bg-success/15 text-success font-medium">Active</span></span>}>
              You can embed badges or secondary info directly in the header.
            </AccordionItem>
          </Accordion>
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Single-open and multi-open modes via <code className="bg-surface px-1 rounded">multiple</code></li>
            <li>Animated with <code className="bg-surface px-1 rounded">max-height</code> transition — no layout shift</li>
            <li>Chevron rotates 180° when open</li>
            <li>Keyboard accessible — full ARIA <code className="bg-surface px-1 rounded">aria-expanded</code> / <code className="bg-surface px-1 rounded">aria-controls</code></li>
            <li><code className="bg-surface px-1 rounded">defaultOpen</code> accepts an array of item ids</li>
            <li>Title accepts any ReactNode</li>
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
