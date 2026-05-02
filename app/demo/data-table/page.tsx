"use client";

import { useState } from "react";
import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";

// ─── Sample data ──────────────────────────────────────────────────────────────

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  joined: string;
};

const USERS: User[] = [
  { id: 1,  name: "Alice Martin",    email: "alice@example.com",   role: "Admin",     status: "active",   joined: "2023-01-12" },
  { id: 2,  name: "Bob Chen",        email: "bob@example.com",     role: "Editor",    status: "active",   joined: "2023-03-08" },
  { id: 3,  name: "Clara Diaz",      email: "clara@example.com",   role: "Viewer",    status: "inactive", joined: "2022-11-20" },
  { id: 4,  name: "Dan Park",        email: "dan@example.com",     role: "Editor",    status: "active",   joined: "2023-06-14" },
  { id: 5,  name: "Eva Rossi",       email: "eva@example.com",     role: "Admin",     status: "pending",  joined: "2024-02-01" },
  { id: 6,  name: "Frank Webb",      email: "frank@example.com",   role: "Viewer",    status: "active",   joined: "2023-09-30" },
  { id: 7,  name: "Grace Lee",       email: "grace@example.com",   role: "Editor",    status: "active",   joined: "2024-01-05" },
  { id: 8,  name: "Hiro Tanaka",     email: "hiro@example.com",    role: "Viewer",    status: "inactive", joined: "2022-07-19" },
  { id: 9,  name: "Isla Novak",      email: "isla@example.com",    role: "Editor",    status: "pending",  joined: "2024-03-22" },
  { id: 10, name: "James Osei",      email: "james@example.com",   role: "Admin",     status: "active",   joined: "2023-05-17" },
  { id: 11, name: "Kim Soren",       email: "kim@example.com",     role: "Viewer",    status: "active",   joined: "2023-08-11" },
  { id: 12, name: "Liam Walsh",      email: "liam@example.com",    role: "Editor",    status: "active",   joined: "2023-12-03" },
  { id: 13, name: "Mia Ferreira",    email: "mia@example.com",     role: "Viewer",    status: "inactive", joined: "2022-10-28" },
  { id: 14, name: "Noah König",      email: "noah@example.com",    role: "Admin",     status: "active",   joined: "2024-04-10" },
  { id: 15, name: "Olivia Santos",   email: "olivia@example.com",  role: "Editor",    status: "pending",  joined: "2024-05-01" },
];

const STATUS_STYLES: Record<User["status"], string> = {
  active:   "bg-success/15 text-success",
  inactive: "bg-muted text-muted-foreground",
  pending:  "bg-accent/15 text-accent",
};

const COLUMNS: Column<User>[] = [
  { key: "id",     label: "ID",     sortable: true },
  { key: "name",   label: "Name",   sortable: true },
  { key: "email",  label: "Email",  sortable: true },
  { key: "role",   label: "Role",   sortable: true },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[value as User["status"]]}`}>
        {String(value)}
      </span>
    ),
  },
  { key: "joined", label: "Joined", sortable: true },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DataTableDemo() {
  const [selectable, setSelectable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Data Table</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Sortable, paginated table with row selection, custom cell renderers, and loading skeleton.
      </p>

      <div className="flex flex-col gap-10 max-w-4xl">

        <Section label="Controls">
          <div className="flex flex-wrap gap-6 items-center">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectable}
                onChange={(e) => setSelectable(e.target.checked)}
                className="w-4 h-4 accent-accent"
              />
              Row selection
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={loading}
                onChange={(e) => setLoading(e.target.checked)}
                className="w-4 h-4 accent-accent"
              />
              Loading skeleton
            </label>

            <label className="flex items-center gap-2 text-sm">
              Page size
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 rounded-lg border border-border bg-surface text-sm text-foreground outline-none focus:border-accent"
              >
                {[3, 5, 10].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
        </Section>

        <Section label="Table">
          <DataTable
            data={USERS}
            columns={COLUMNS}
            pageSize={pageSize}
            selectable={selectable}
            loading={loading}
          />
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Click any sortable column header to sort asc / desc</li>
            <li>Pagination with first / prev / next / last</li>
            <li>Optional row selection with indeterminate header checkbox</li>
            <li>Custom cell renderer — status badge uses design tokens</li>
            <li>Loading skeleton with deterministic widths (no hydration mismatch)</li>
            <li>Fully generic — works with any <code className="bg-surface px-1 rounded">Record&lt;string, unknown&gt;</code></li>
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
