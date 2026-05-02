"use client";

import { useState } from "react";
import Link from "next/link";
import { MultiSelect } from "@/components/ui/MultiSelect";
import type { SelectOption } from "@/components/ui/MultiSelect";

const FRAMEWORKS: SelectOption[] = [
  { value: "next",    label: "Next.js" },
  { value: "remix",   label: "Remix" },
  { value: "astro",   label: "Astro" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt",    label: "Nuxt" },
  { value: "angular", label: "Angular" },
  { value: "gatsby",  label: "Gatsby" },
];

const TAGS: SelectOption[] = [
  { value: "design",     label: "Design" },
  { value: "eng",        label: "Engineering" },
  { value: "product",    label: "Product" },
  { value: "marketing",  label: "Marketing" },
  { value: "ops",        label: "Operations" },
  { value: "finance",    label: "Finance" },
  { value: "legal",      label: "Legal" },
  { value: "hr",         label: "HR" },
];

export default function MultiSelectDemo() {
  const [frameworks, setFrameworks] = useState<string[]>(["next"]);
  const [tags, setTags] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">MultiSelect</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Searchable tag input with chips, keyboard navigation, and backspace-to-remove.
      </p>

      <div className="flex flex-col gap-10 max-w-xl">

        <Section label="Framework picker">
          <MultiSelect
            options={FRAMEWORKS}
            value={frameworks}
            onChange={setFrameworks}
            placeholder="Pick frameworks…"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Selected: {frameworks.length > 0 ? frameworks.join(", ") : "none"}
          </p>
        </Section>

        <Section label="Team tags">
          <MultiSelect
            options={TAGS}
            value={tags}
            onChange={setTags}
            placeholder="Add tags…"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Selected: {tags.length > 0 ? tags.join(", ") : "none"}
          </p>
        </Section>

        <Section label="Disabled">
          <MultiSelect
            options={FRAMEWORKS}
            value={["next", "remix"]}
            onChange={() => {}}
            disabled
          />
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Type to filter options (already-selected items are hidden)</li>
            <li>Click or Enter to add; × chip button to remove</li>
            <li>Backspace on empty input removes the last chip</li>
            <li>↑ ↓ arrow keys navigate the dropdown</li>
            <li>Escape closes the dropdown</li>
            <li>Outside click closes the dropdown</li>
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
