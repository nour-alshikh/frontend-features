"use client";

import { useState } from "react";
import Link from "next/link";
import { CommandPalette } from "@/components/ui/CommandPalette";
import type { CommandGroup } from "@/components/ui/CommandPalette";

const GROUPS: CommandGroup[] = [
  {
    label: "Navigation",
    items: [
      { id: "home",       label: "Go to Home",       description: "Return to the dashboard",          icon: <HouseIcon />,   onSelect: () => alert("→ Home") },
      { id: "settings",   label: "Open Settings",    description: "Manage preferences and account",   icon: <GearIcon />,    onSelect: () => alert("→ Settings") },
      { id: "profile",    label: "View Profile",     description: "See your public profile",           icon: <PersonIcon />,  onSelect: () => alert("→ Profile") },
    ],
  },
  {
    label: "Actions",
    items: [
      { id: "new-doc",    label: "New Document",     description: "Create a blank document",           icon: <DocIcon />,     onSelect: () => alert("New document created") },
      { id: "new-proj",   label: "New Project",      description: "Start a fresh project",             icon: <FolderIcon />,  onSelect: () => alert("New project created") },
      { id: "invite",     label: "Invite Team Member",description: "Send an invite via email",          icon: <MailIcon />,    onSelect: () => alert("Invite modal opened") },
    ],
  },
  {
    label: "Theme",
    items: [
      { id: "light",      label: "Switch to Light Mode", icon: <SunIcon />,  onSelect: () => alert("Light mode") },
      { id: "dark",       label: "Switch to Dark Mode",  icon: <MoonIcon />, onSelect: () => alert("Dark mode") },
    ],
  },
];

export default function CommandPaletteDemo() {
  const [controlled, setControlled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const groupsWithCallback: CommandGroup[] = GROUPS.map((g) => ({
    ...g,
    items: g.items.map((item) => ({
      ...item,
      onSelect: () => setLastAction(item.label),
    })),
  }));

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Command Palette</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Keyboard-driven command launcher. Press <Kbd>⌘K</Kbd> / <Kbd>Ctrl K</Kbd> anywhere on the page.
      </p>

      <div className="flex flex-col gap-10 max-w-xl">

        <Section label="Uncontrolled (default)">
          <p className="text-xs text-muted-foreground mb-4">
            The palette manages its own open state. Use the global shortcut or the button below.
          </p>
          <button
            type="button"
            onClick={() => {
              const ev = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true });
              window.dispatchEvent(ev);
            }}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors"
          >
            Open palette (simulates Ctrl+K)
          </button>
          <CommandPalette groups={groupsWithCallback} />
        </Section>

        <Section label="Controlled open state">
          <p className="text-xs text-muted-foreground mb-4">
            Pass <code className="bg-surface px-1 rounded">open</code> and{" "}
            <code className="bg-surface px-1 rounded">onOpenChange</code> to control it externally.
          </p>
          <button
            type="button"
            onClick={() => { setControlled(true); setOpen(true); }}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors"
          >
            Open controlled palette
          </button>
          {controlled && (
            <CommandPalette
              groups={groupsWithCallback}
              open={open}
              onOpenChange={setOpen}
            />
          )}
        </Section>

        {lastAction && (
          <Section label="Last selected action">
            <p className="text-sm text-foreground font-medium">
              {lastAction}
            </p>
          </Section>
        )}

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Fuzzy search across label and description</li>
            <li>Match highlighting in results</li>
            <li>Keyboard navigation ↑ ↓ Enter Esc</li>
            <li>Grouped results with section headers</li>
            <li>Backdrop click to close</li>
            <li>Supports controlled and uncontrolled modes</li>
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

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="px-1.5 py-0.5 rounded border border-border bg-surface text-xs font-mono">
      {children}
    </kbd>
  );
}

function HouseIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function GearIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>; }
function PersonIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function DocIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function FolderIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>; }
function MailIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>; }
function SunIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>; }
function MoonIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>; }
