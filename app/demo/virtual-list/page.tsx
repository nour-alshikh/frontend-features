"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { VirtualList } from "@/components/ui/VirtualList";

type Row = { id: number; name: string; email: string; role: string; status: string };

function generateRows(count: number): Row[] {
  const roles   = ["Admin", "Editor", "Viewer", "Manager"];
  const statuses = ["active", "inactive", "pending"];
  const names = [
    "Alice", "Bob", "Clara", "Dan", "Eva", "Frank", "Grace", "Hiro",
    "Isla", "James", "Kim", "Liam", "Mia", "Noah", "Olivia", "Pete",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id:     i + 1,
    name:   `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}${i > 25 ? i : ""}`,
    email:  `user${i + 1}@example.com`,
    role:   roles[i % roles.length],
    status: statuses[i % statuses.length],
  }));
}

const STATUS_CLASSES: Record<string, string> = {
  active:   "bg-success/15 text-success",
  inactive: "bg-muted text-muted-foreground",
  pending:  "bg-accent/15 text-accent",
};

export default function VirtualListDemo() {
  const [count, setCount] = useState(10_000);
  const rows = useMemo(() => generateRows(count), [count]);
  const [rendered, setRendered] = useState(0);

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Virtual List</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Only renders the rows visible in the viewport — keeps large datasets smooth.
      </p>

      <div className="flex flex-col gap-8 max-w-3xl">

        <Section label="Controls">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 text-sm">
              Row count
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="px-2 py-1 rounded-lg border border-border bg-surface text-sm text-foreground outline-none focus:border-accent"
              >
                {[100, 1_000, 10_000, 100_000].map((n) => (
                  <option key={n} value={n}>{n.toLocaleString()}</option>
                ))}
              </select>
            </label>
            <p className="text-xs text-muted-foreground">
              Rendering ~{rows.length.toLocaleString()} rows total — scroll to see only a slice is mounted
            </p>
          </div>
        </Section>

        <Section label={`${count.toLocaleString()} rows — 48px row height`}>
          {/* Header row */}
          <div className="grid grid-cols-[48px_1fr_1fr_80px_80px] gap-3 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border bg-surface rounded-t-xl">
            <span>#</span><span>Name</span><span>Email</span><span>Role</span><span>Status</span>
          </div>

          <VirtualList
            items={rows}
            itemHeight={48}
            height={400}
            overscan={5}
            className="rounded-b-xl border border-t-0 border-border"
            renderItem={(row) => (
              <div className="grid grid-cols-[48px_1fr_1fr_80px_80px] gap-3 px-4 items-center h-full border-b border-border last:border-0 hover:bg-surface transition-colors text-sm">
                <span className="text-muted-foreground font-mono">{row.id}</span>
                <span className="text-foreground font-medium truncate">{row.name}</span>
                <span className="text-muted-foreground truncate">{row.email}</span>
                <span className="text-muted-foreground">{row.role}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASSES[row.status]}`}>{row.status}</span>
              </div>
            )}
          />
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Only renders rows in the visible window ± overscan buffer</li>
            <li>Spacer div gives the scrollbar the correct total height</li>
            <li>Absolute positioning places each row at its true offset</li>
            <li>Scroll resets to top when <code className="bg-surface px-1 rounded">items</code> identity changes</li>
            <li>Fully generic — works with any item type <code className="bg-surface px-1 rounded">T</code></li>
            <li>Adjustable <code className="bg-surface px-1 rounded">overscan</code> rows for smooth fast scrolling</li>
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
