"use client";

import Link from "next/link";
import { ResizablePanels } from "@/components/ui/ResizablePanels";

const CODE = `import { ResizablePanels } from "@/components/ui/ResizablePanels";

export default function App() {
  return (
    <ResizablePanels
      direction="horizontal"
      defaultSplit={40}
      minSize={15}
    >
      <aside>Sidebar</aside>
      <main>Content</main>
    </ResizablePanels>
  );
}`;

export default function ResizablePanelsDemo() {
  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Resizable Panels</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Drag the divider to resize two panels. Supports horizontal and vertical splits.
      </p>

      <div className="flex flex-col gap-10 max-w-3xl">

        <Section label="Horizontal split (drag the divider)">
          <ResizablePanels
            direction="horizontal"
            defaultSplit={35}
            minSize={15}
            className="h-64 rounded-xl border border-border overflow-hidden"
          >
            <div className="h-full bg-surface p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Sidebar</p>
              <nav className="flex flex-col gap-1">
                {["Dashboard", "Projects", "Team", "Settings", "Help"].map((item) => (
                  <button key={item} type="button" className="text-left px-3 py-1.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
                    {item}
                  </button>
                ))}
              </nav>
            </div>
            <div className="h-full bg-background p-4 overflow-auto">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Main content</p>
              <p className="text-sm text-muted-foreground">
                This panel grows and shrinks as you drag the handle. Both panels enforce a minimum width so neither can fully collapse.
              </p>
            </div>
          </ResizablePanels>
        </Section>

        <Section label="Vertical split">
          <ResizablePanels
            direction="vertical"
            defaultSplit={50}
            minSize={20}
            className="h-80 rounded-xl border border-border overflow-hidden"
          >
            <div className="h-full bg-surface p-4 overflow-auto">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Top panel</p>
              <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">{CODE}</pre>
            </div>
            <div className="h-full bg-background p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Bottom panel</p>
              <p className="text-sm text-muted-foreground">Output / preview area</p>
            </div>
          </ResizablePanels>
        </Section>

        <Section label="Nested — three-panel layout">
          <ResizablePanels
            direction="horizontal"
            defaultSplit={25}
            minSize={15}
            className="h-56 rounded-xl border border-border overflow-hidden"
          >
            <div className="h-full bg-surface p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Files</p>
              {["index.tsx", "page.tsx", "layout.tsx"].map((f) => (
                <p key={f} className="text-xs text-foreground py-1">{f}</p>
              ))}
            </div>
            <ResizablePanels
              direction="vertical"
              defaultSplit={65}
              minSize={20}
              className="h-full"
            >
              <div className="p-3 overflow-auto">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Editor</p>
                <pre className="text-xs text-muted-foreground font-mono">{"export default function Page() {\n  return <h1>Hello</h1>;\n}"}</pre>
              </div>
              <div className="p-3 bg-surface">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Terminal</p>
                <p className="text-xs text-success font-mono">$ npm run dev</p>
                <p className="text-xs text-muted-foreground font-mono">▲ Next.js ready on :3000</p>
              </div>
            </ResizablePanels>
          </ResizablePanels>
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Pointer capture — drag stays accurate when cursor moves fast</li>
            <li>Horizontal and vertical directions</li>
            <li>Configurable <code className="bg-surface px-1 rounded">defaultSplit</code> and <code className="bg-surface px-1 rounded">minSize</code></li>
            <li>Handle highlights on hover and while dragging</li>
            <li>Nestable — compose for multi-panel layouts</li>
            <li>No external libraries — native pointer events only</li>
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
