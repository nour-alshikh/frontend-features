"use client";

import { useState } from "react";
import Link from "next/link";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

const STARTER = `<h2>Welcome to the editor</h2><p>This is a <strong>rich text</strong> editor built on <em>contenteditable</em> — no heavy dependencies.</p><ul><li>Bold, italic, underline, strikethrough</li><li>Bullet and numbered lists</li><li>Headings (H2, H3) and paragraph blocks</li><li>Left, center, and right alignment</li><li>Undo / redo</li></ul>`;

export default function RichTextEditorDemo() {
  const [html, setHtml]       = useState(STARTER);
  const [preview, setPreview] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Rich Text Editor</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Bold, italic, lists, headings, and alignment via <code className="bg-surface px-1 rounded">contenteditable</code> — no external dependencies.
      </p>

      <div className="flex flex-col gap-10 max-w-2xl">

        <Section label="Editor">
          <RichTextEditor value={html} onChange={setHtml} />
        </Section>

        <Section label="Output">
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setPreview(false)}
              className={[
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                !preview ? "bg-accent text-accent-foreground" : "bg-surface text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              HTML source
            </button>
            <button
              type="button"
              onClick={() => setPreview(true)}
              className={[
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                preview ? "bg-accent text-accent-foreground" : "bg-surface text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              Rendered preview
            </button>
          </div>

          {preview ? (
            <div
              className={[
                "p-4 rounded-xl border border-border text-sm text-foreground",
                "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-3",
                "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:mt-2",
                "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1",
                "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1",
                "[&_li]:my-0.5",
                "[&_b]:font-bold [&_strong]:font-bold",
                "[&_i]:italic [&_em]:italic",
                "[&_u]:underline",
                "[&_s]:line-through",
              ].join(" ")}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre className="p-4 rounded-xl border border-border bg-surface text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap break-all">
              {html || "(empty)"}
            </pre>
          )}
        </Section>

        <Section label="Disabled state">
          <RichTextEditor
            value="<p>This editor is <strong>read-only</strong>. All toolbar buttons are disabled.</p>"
            onChange={() => {}}
            disabled
          />
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Toolbar buttons use <code className="bg-surface px-1 rounded">onMouseDown + preventDefault</code> to avoid blurring the editor</li>
            <li>Active state detected via <code className="bg-surface px-1 rounded">document.queryCommandState</code></li>
            <li>External value sync with skip-flag to prevent cursor jump</li>
            <li>Placeholder via CSS <code className="bg-surface px-1 rounded">:empty::before</code></li>
            <li>All formatting commands use the browser's built-in <code className="bg-surface px-1 rounded">execCommand</code> API</li>
            <li>Keyboard shortcuts (Ctrl+B/I/U/Z/Y) work natively</li>
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
