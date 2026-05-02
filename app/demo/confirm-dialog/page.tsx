"use client";

import { useState } from "react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  const [destructiveOpen, setDestructiveOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Confirm Dialog</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Modal-based confirmation prompt with a default and destructive variant.
      </p>

      <div className="flex flex-col gap-10 max-w-xl">

        <Section label="Default confirm">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors"
          >
            Open confirm dialog
          </button>
          <ConfirmDialog
            open={open}
            onClose={() => setOpen(false)}
            onConfirm={() => setResult("Confirmed (default)")}
            title="Save changes?"
            description="Your unsaved changes will be persisted. You can undo this at any time."
          />
        </Section>

        <Section label="Destructive variant">
          <button
            type="button"
            onClick={() => setDestructiveOpen(true)}
            className="px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Delete account
          </button>
          <ConfirmDialog
            open={destructiveOpen}
            onClose={() => setDestructiveOpen(false)}
            onConfirm={() => setResult("Confirmed (destructive)")}
            title="Delete your account?"
            description="This will permanently remove all your data. This action cannot be undone."
            destructive
            confirmLabel="Delete account"
          />
        </Section>

        <Section label="Custom labels">
          <button
            type="button"
            onClick={() => setCustomOpen(true)}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors"
          >
            Publish post
          </button>
          <ConfirmDialog
            open={customOpen}
            onClose={() => setCustomOpen(false)}
            onConfirm={() => setResult("Post published")}
            title="Ready to publish?"
            description="Your post will be visible to all readers immediately."
            confirmLabel="Yes, publish"
            cancelLabel="Not yet"
          />
        </Section>

        {result && (
          <Section label="Last result">
            <p className="text-sm text-foreground font-medium">{result}</p>
          </Section>
        )}

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
