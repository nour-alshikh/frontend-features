"use client";

import Link from "next/link";
import { Timeline } from "@/components/ui/Timeline";
import type { TimelineEvent } from "@/components/ui/Timeline";

const EVENTS: TimelineEvent[] = [
  {
    id: "e1",
    title: "Project created",
    date: "Jan 12, 2024",
    description: "Repository initialised and base dependencies installed.",
    color: "bg-accent",
  },
  {
    id: "e2",
    title: "Design system set up",
    date: "Jan 19, 2024",
    description: "CSS tokens, Tailwind config, and ThemeToggle component added.",
    color: "bg-accent",
  },
  {
    id: "e3",
    title: "Core components shipped",
    date: "Feb 5, 2024",
    description: "Modal, StarRating, CountdownTimer, and ProgressBar completed.",
    color: "bg-accent",
  },
  {
    id: "e4",
    title: "Build failed",
    date: "Feb 14, 2024",
    description: "TypeScript strict errors in FormBuilder — fixed same day.",
    color: "bg-destructive",
  },
  {
    id: "e5",
    title: "v1.0 released",
    date: "Mar 1, 2024",
    description: "First stable release with 10 components and full docs.",
    color: "bg-success",
  },
];

const WITH_ICONS: TimelineEvent[] = [
  {
    id: "i1",
    title: "Order placed",
    date: "Today, 09:41",
    description: "Your order #4821 has been received.",
    icon: <CartIcon />,
  },
  {
    id: "i2",
    title: "Payment confirmed",
    date: "Today, 09:42",
    description: "Card ending 4242 charged successfully.",
    icon: <CardIcon />,
    color: "bg-success text-white",
  },
  {
    id: "i3",
    title: "Preparing shipment",
    date: "Today, 14:00",
    description: "Items are being packed at the warehouse.",
    icon: <BoxIcon />,
  },
  {
    id: "i4",
    title: "Out for delivery",
    date: "Tomorrow",
    description: "Estimated arrival between 10:00 and 14:00.",
    icon: <TruckIcon />,
    color: "bg-muted text-muted-foreground",
  },
];

export default function TimelineDemo() {
  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Timeline</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Vertical event list with connector lines, optional icons, and color-coded dots.
      </p>

      <div className="flex flex-col gap-12 max-w-xl">

        <Section label="Colored dots">
          <Timeline events={EVENTS} />
        </Section>

        <Section label="With icons (order tracking)">
          <Timeline events={WITH_ICONS} />
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Connector line drawn between items via absolute positioning</li>
            <li>Last item has no trailing line</li>
            <li>Icon slot accepts any ReactNode</li>
            <li><code className="bg-surface px-1 rounded">color</code> applies to the dot background</li>
            <li>Date displayed as secondary text next to title</li>
            <li>Description accepts any ReactNode (links, badges, etc.)</li>
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

function CartIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>; }
function CardIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>; }
function BoxIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>; }
function TruckIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect width="7" height="7" x="14" y="10" rx="1"/><circle cx="17.5" cy="17.5" r="2.5"/><circle cx="7.5" cy="17.5" r="2.5"/></svg>; }
