"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";

export default function ModalDemo() {
  const [basic, setBasic] = useState(false);
  const [noTitle, setNoTitle] = useState(false);
  const [small, setSmall] = useState(false);
  const [large, setLarge] = useState(false);
  const [noBackdrop, setNoBackdrop] = useState(false);
  const [form, setForm] = useState(false);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-10">
        Modal
      </h1>

      <div className="flex flex-wrap gap-3">
        <TriggerButton onClick={() => setBasic(true)}>Basic modal</TriggerButton>
        <TriggerButton onClick={() => setNoTitle(true)}>No title</TriggerButton>
        <TriggerButton onClick={() => setSmall(true)}>Size sm</TriggerButton>
        <TriggerButton onClick={() => setLarge(true)}>Size lg</TriggerButton>
        <TriggerButton onClick={() => setNoBackdrop(true)}>
          No backdrop close
        </TriggerButton>
        <TriggerButton onClick={() => setForm(true)}>With form</TriggerButton>
      </div>

      {/* Basic */}
      <Modal open={basic} onClose={() => setBasic(false)} title="Basic Modal">
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          This is a basic modal. Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">Esc</kbd> or click the backdrop to close.
        </p>
      </Modal>

      {/* No title */}
      <Modal open={noTitle} onClose={() => setNoTitle(false)}>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          This modal has no title prop — only the close button is shown in the header.
        </p>
      </Modal>

      {/* Small */}
      <Modal open={small} onClose={() => setSmall(false)} title="Small Modal" size="sm">
        <p className="text-zinc-600 dark:text-zinc-400">Size sm — max-w-sm.</p>
      </Modal>

      {/* Large */}
      <Modal open={large} onClose={() => setLarge(false)} title="Large Modal" size="lg">
        <p className="text-zinc-600 dark:text-zinc-400">Size lg — max-w-lg.</p>
      </Modal>

      {/* No backdrop close */}
      <Modal
        open={noBackdrop}
        onClose={() => setNoBackdrop(false)}
        title="Backdrop disabled"
        closeOnBackdrop={false}
      >
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Clicking the backdrop does nothing. Use the button or Esc.
        </p>
        <button
          onClick={() => setNoBackdrop(false)}
          className="rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          Close
        </button>
      </Modal>

      {/* With form */}
      <Modal open={form} onClose={() => setForm(false)} title="Edit profile" size="md">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setForm(false);
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setForm(false)}
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}

function TriggerButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
    >
      {children}
    </button>
  );
}
