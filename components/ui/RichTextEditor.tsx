"use client";

import {
  useRef, useEffect, useCallback, ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// ─── Toolbar button config ────────────────────────────────────────────────────

type Command =
  | { type: "format"; cmd: string; arg?: string; icon: ReactNode; title: string }
  | { type: "separator" };

const TOOLBAR: Command[] = [
  { type: "format", cmd: "bold",          icon: <BIcon />,         title: "Bold (Ctrl+B)" },
  { type: "format", cmd: "italic",        icon: <IIcon />,         title: "Italic (Ctrl+I)" },
  { type: "format", cmd: "underline",     icon: <UIcon />,         title: "Underline (Ctrl+U)" },
  { type: "format", cmd: "strikeThrough", icon: <SIcon />,         title: "Strikethrough" },
  { type: "separator" },
  { type: "format", cmd: "insertUnorderedList", icon: <ULIcon />,  title: "Bullet list" },
  { type: "format", cmd: "insertOrderedList",   icon: <OLIcon />,  title: "Numbered list" },
  { type: "separator" },
  { type: "format", cmd: "formatBlock", arg: "h2", icon: <H2Icon />, title: "Heading 2" },
  { type: "format", cmd: "formatBlock", arg: "h3", icon: <H3Icon />, title: "Heading 3" },
  { type: "format", cmd: "formatBlock", arg: "p",  icon: <PIcon />,  title: "Paragraph" },
  { type: "separator" },
  { type: "format", cmd: "justifyLeft",   icon: <AlignLIcon />,    title: "Align left" },
  { type: "format", cmd: "justifyCenter", icon: <AlignCIcon />,    title: "Align center" },
  { type: "format", cmd: "justifyRight",  icon: <AlignRIcon />,    title: "Align right" },
  { type: "separator" },
  { type: "format", cmd: "undo",          icon: <UndoIcon />,      title: "Undo (Ctrl+Z)" },
  { type: "format", cmd: "redo",          icon: <RedoIcon />,      title: "Redo (Ctrl+Y)" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing…",
  disabled = false,
  className,
}: RichTextEditorProps) {
  const editorRef  = useRef<HTMLDivElement>(null);
  const skipSync   = useRef(false); // prevent cursor-jump while user types

  // Initialise content once
  useEffect(() => {
    const el = editorRef.current;
    if (!el || el.innerHTML === value) return;
    skipSync.current = true;
    el.innerHTML = value ?? "";
    skipSync.current = false;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external value changes (e.g. programmatic reset)
  useEffect(() => {
    const el = editorRef.current;
    if (!el || skipSync.current) return;
    if (el.innerHTML !== value) {
      skipSync.current = true;
      el.innerHTML = value ?? "";
      skipSync.current = false;
    }
  }, [value]);

  const exec = useCallback((cmd: string, arg?: string) => {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [disabled, onChange]);

  const isActive = (cmd: string, arg?: string) => {
    try {
      if (arg) return document.queryCommandValue(cmd) === arg;
      return document.queryCommandState(cmd);
    } catch { return false; }
  };

  const handleInput = () => {
    skipSync.current = true;
    if (editorRef.current) onChange(editorRef.current.innerHTML);
    skipSync.current = false;
  };

  return (
    <div className={["rounded-xl border border-border overflow-hidden bg-background", className].filter(Boolean).join(" ")}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-surface">
        {TOOLBAR.map((item, i) => {
          if (item.type === "separator") {
            return <span key={`sep-${i}`} className="w-px h-5 bg-border mx-1" />;
          }
          const active = isActive(item.cmd, item.arg);
          return (
            <button
              key={item.cmd + (item.arg ?? "")}
              type="button"
              title={item.title}
              disabled={disabled}
              onMouseDown={(e) => {
                e.preventDefault(); // don't blur editor
                exec(item.cmd, item.arg);
              }}
              className={[
                "w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                disabled ? "opacity-40 cursor-not-allowed" : "",
              ].filter(Boolean).join(" ")}
            >
              {item.icon}
            </button>
          );
        })}
      </div>

      {/* Editable area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder={placeholder}
          className={[
            "min-h-[160px] px-4 py-3 text-sm text-foreground outline-none",
            "prose prose-sm max-w-none",
            "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-3",
            "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:mt-2",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1",
            "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1",
            "[&_li]:my-0.5",
            "[&_b]:font-bold [&_strong]:font-bold",
            "[&_i]:italic [&_em]:italic",
            "[&_u]:underline",
            "[&_s]:line-through [&_strike]:line-through",
            disabled ? "opacity-50 cursor-not-allowed" : "",
            "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none",
          ].filter(Boolean).join(" ")}
        />
      </div>
    </div>
  );
}

// ─── Toolbar icons ────────────────────────────────────────────────────────────

function BIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>; }
function IIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>; }
function UIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>; }
function SIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/></svg>; }
function ULIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" x2="20" y1="6" y2="6"/><line x1="9" x2="20" y1="12" y2="12"/><line x1="9" x2="20" y1="18" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>; }
function OLIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>; }
function H2Icon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h8"/><path d="M4 6v12"/><path d="M12 6v12"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>; }
function H3Icon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h8"/><path d="M4 6v12"/><path d="M12 6v12"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>; }
function PIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16"/><path d="M7 4h8a4 4 0 0 1 0 8H7V4z"/></svg>; }
function AlignLIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>; }
function AlignCIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="17" x2="7" y1="12" y2="12"/><line x1="19" x2="5" y1="18" y2="18"/></svg>; }
function AlignRIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/></svg>; }
function UndoIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>; }
function RedoIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>; }
