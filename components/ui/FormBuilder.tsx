"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio" | "file" | "repeater";

type SubFieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio";

const SUB_FIELD_TYPES: SubFieldType[] = ["text", "email", "number", "textarea", "select", "checkbox", "radio"];

interface SubField {
  id: string;
  label: string;
  type: SubFieldType;
  placeholder: string;
  required: boolean;
  options: string[];
}

type RepeaterRow = Record<string, string | boolean>;

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  helpText: string;
  options: string[];
  multiple: boolean;
  subFields: SubField[];
}

type FieldValue = string | boolean | File[] | RepeaterRow[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FIELD_TYPES: { type: FieldType; label: string }[] = [
  { type: "text",     label: "Text" },
  { type: "email",    label: "Email" },
  { type: "number",   label: "Number" },
  { type: "textarea", label: "Textarea" },
  { type: "select",   label: "Select" },
  { type: "checkbox", label: "Checkbox" },
  { type: "radio",    label: "Radio" },
  { type: "file",     label: "File" },
  { type: "repeater", label: "Repeater" },
];

function makeField(type: FieldType): FormField {
  return {
    id: Math.random().toString(36).slice(2),
    type,
    label: `${type[0].toUpperCase()}${type.slice(1)} field`,
    placeholder: "",
    required: false,
    helpText: "",
    options: type === "select" || type === "radio" ? ["Option 1", "Option 2"] : [],
    multiple: false,
    subFields: type === "repeater"
      ? [makeSubField("text", "Name")]
      : [],
  };
}

function makeSubField(type: SubFieldType, label?: string): SubField {
  return {
    id: Math.random().toString(36).slice(2),
    label: label ?? `${type[0].toUpperCase()}${type.slice(1)} field`,
    type,
    placeholder: "",
    required: false,
    options: type === "select" || type === "radio" ? ["Option 1", "Option 2"] : [],
  };
}

const inputCls =
  "w-full rounded-lg border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted-foreground";

// ─── FormBuilder ──────────────────────────────────────────────────────────────

export function FormBuilder() {
  const [title, setTitle] = useState("My Form");
  const [fields, setFields] = useState<FormField[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addField = (type: FieldType) => {
    const f = makeField(type);
    setFields((p) => [...p, f]);
    setEditingId(f.id);
  };

  const updateField = (id: string, changes: Partial<FormField>) =>
    setFields((p) => p.map((f) => (f.id === id ? { ...f, ...changes } : f)));

  const removeField = (id: string) => {
    setFields((p) => p.filter((f) => f.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const moveField = (id: string, dir: "up" | "down") => {
    setFields((p) => {
      const i = p.findIndex((f) => f.id === id);
      if (dir === "up" && i === 0) return p;
      if (dir === "down" && i === p.length - 1) return p;
      const next = [...p];
      const j = dir === "up" ? i - 1 : i + 1;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

      {/* ── Builder panel ── */}
      <div className="flex flex-col gap-5">

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Form title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Add field */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Add field
          </p>
          <div className="flex flex-wrap gap-2">
            {FIELD_TYPES.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => addField(type)}
                className="rounded-lg border border-border bg-surface text-surface-foreground text-xs font-medium px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
              >
                + {label}
              </button>
            ))}
          </div>
        </div>

        {/* Field list */}
        {fields.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            No fields yet — add one above
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {fields.map((field, idx) => (
              <FieldCard
                key={field.id}
                field={field}
                isFirst={idx === 0}
                isLast={idx === fields.length - 1}
                isEditing={editingId === field.id}
                onToggleEdit={() =>
                  setEditingId(editingId === field.id ? null : field.id)
                }
                onDelete={() => removeField(field.id)}
                onMove={(dir) => moveField(field.id, dir)}
                onUpdate={(changes) => updateField(field.id, changes)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Preview panel ── */}
      <div className="lg:sticky lg:top-8">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Live preview
        </p>
        <FormPreview title={title} fields={fields} />
      </div>
    </div>
  );
}

// ─── FieldCard ────────────────────────────────────────────────────────────────

interface FieldCardProps {
  field: FormField;
  isFirst: boolean;
  isLast: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
  onDelete: () => void;
  onMove: (dir: "up" | "down") => void;
  onUpdate: (changes: Partial<FormField>) => void;
}

function FieldCard({
  field,
  isFirst,
  isLast,
  isEditing,
  onToggleEdit,
  onDelete,
  onMove,
  onUpdate,
}: FieldCardProps) {
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const hasOptions  = field.type === "select"   || field.type === "radio";
  const isRepeater  = field.type === "repeater";

  const updateSub = (id: string, changes: Partial<SubField>) =>
    onUpdate({ subFields: field.subFields.map((sf) => sf.id === id ? { ...sf, ...changes } : sf) });
  const removeSub = (id: string) =>
    onUpdate({ subFields: field.subFields.filter((sf) => sf.id !== id) });

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {/* Row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="shrink-0 text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded">
          {field.type}
        </span>
        <span className="flex-1 text-sm text-foreground truncate">{field.label}</span>
        {field.required && (
          <span className="shrink-0 text-xs text-destructive">required</span>
        )}
        <div className="flex items-center gap-0.5">
          <IconBtn onClick={() => onMove("up")} disabled={isFirst} title="Move up">↑</IconBtn>
          <IconBtn onClick={() => onMove("down")} disabled={isLast} title="Move down">↓</IconBtn>
          <IconBtn onClick={onToggleEdit} title="Edit" active={isEditing}>✎</IconBtn>
          <IconBtn onClick={onDelete} title="Delete" danger>✕</IconBtn>
        </div>
      </div>

      {/* Inline editor */}
      {isEditing && (
        <div className="border-t border-border bg-background px-4 py-4 flex flex-col gap-3">
          <EditorField label="Label">
            <input
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className={inputCls}
            />
          </EditorField>

          {field.type !== "checkbox" && field.type !== "file" && (
            <EditorField label="Placeholder">
              <input
                value={field.placeholder}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Optional"
                className={inputCls}
              />
            </EditorField>
          )}

          <EditorField label="Help text">
            <input
              value={field.helpText}
              onChange={(e) => onUpdate({ helpText: e.target.value })}
              placeholder="Optional"
              className={inputCls}
            />
          </EditorField>

          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className="accent-[var(--color-accent)]"
            />
            Required
          </label>

          {field.type === "file" && (
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={field.multiple}
                onChange={(e) => onUpdate({ multiple: e.target.checked })}
                className="accent-[var(--color-accent)]"
              />
              Allow multiple files
            </label>
          )}

          {isRepeater && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">Sub-fields</span>

              {field.subFields.length === 0 && (
                <p className="text-xs text-muted-foreground italic py-2">No sub-fields — add one below.</p>
              )}

              {field.subFields.map((sf) => {
                const isOpen = editingSubId === sf.id;
                const sfHasOptions = sf.type === "select" || sf.type === "radio";
                return (
                  <div key={sf.id} className="rounded-lg border border-border overflow-hidden">
                    {/* Sub-field header */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50">
                      <span className="text-xs font-mono bg-background text-muted-foreground px-1.5 py-0.5 rounded shrink-0">
                        {sf.type}
                      </span>
                      <span className="flex-1 text-sm text-foreground truncate">{sf.label}</span>
                      <button
                        onClick={() => setEditingSubId(isOpen ? null : sf.id)}
                        className={`text-xs px-2 py-0.5 rounded transition-colors ${isOpen ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        {isOpen ? "Done" : "Edit"}
                      </button>
                      <button
                        onClick={() => { removeSub(sf.id); if (isOpen) setEditingSubId(null); }}
                        className="text-muted-foreground hover:text-destructive transition-colors text-sm"
                      >✕</button>
                    </div>

                    {/* Sub-field settings */}
                    {isOpen && (
                      <div className="px-3 py-3 bg-background flex flex-col gap-2.5 border-t border-border">
                        <div className="grid grid-cols-2 gap-2">
                          <EditorField label="Label">
                            <input value={sf.label} onChange={(e) => updateSub(sf.id, { label: e.target.value })} className={inputCls} />
                          </EditorField>
                          <EditorField label="Type">
                            <select
                              value={sf.type}
                              onChange={(e) => updateSub(sf.id, {
                                type: e.target.value as SubFieldType,
                                options: (e.target.value === "select" || e.target.value === "radio") ? ["Option 1", "Option 2"] : [],
                              })}
                              className={inputCls}
                            >
                              {SUB_FIELD_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </EditorField>
                        </div>

                        {sf.type !== "checkbox" && sf.type !== "select" && sf.type !== "radio" && (
                          <EditorField label="Placeholder">
                            <input value={sf.placeholder} onChange={(e) => updateSub(sf.id, { placeholder: e.target.value })} placeholder="Optional" className={inputCls} />
                          </EditorField>
                        )}

                        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                          <input type="checkbox" checked={sf.required} onChange={(e) => updateSub(sf.id, { required: e.target.checked })} className="accent-[var(--color-accent)]" />
                          Required
                        </label>

                        {sfHasOptions && (
                          <EditorField label="Options">
                            <div className="flex flex-col gap-1.5">
                              {sf.options.map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-2">
                                  <input
                                    value={opt}
                                    onChange={(e) => { const next = [...sf.options]; next[oi] = e.target.value; updateSub(sf.id, { options: next }); }}
                                    className={inputCls}
                                  />
                                  <button onClick={() => updateSub(sf.id, { options: sf.options.filter((_, j) => j !== oi) })} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">✕</button>
                                </div>
                              ))}
                              <button onClick={() => updateSub(sf.id, { options: [...sf.options, `Option ${sf.options.length + 1}`] })} className="text-xs text-accent hover:underline text-left">+ Add option</button>
                            </div>
                          </EditorField>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add sub-field */}
              <div className="flex items-center gap-2 pt-1">
                <select
                  id="new-sub-type"
                  defaultValue="text"
                  className="rounded-lg border border-border bg-background text-foreground text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {SUB_FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <button
                  onClick={() => {
                    const sel = (document.getElementById("new-sub-type") as HTMLSelectElement).value as SubFieldType;
                    const sf = makeSubField(sel);
                    onUpdate({ subFields: [...field.subFields, sf] });
                    setEditingSubId(sf.id);
                  }}
                  className="text-xs text-accent border border-accent/40 rounded-lg px-3 py-1.5 hover:bg-accent/10 transition-colors"
                >
                  + Add sub-field
                </button>
              </div>
            </div>
          )}

          {hasOptions && (
            <EditorField label="Options">
              <div className="flex flex-col gap-1.5">
                {field.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={opt}
                      onChange={(e) => {
                        const next = [...field.options];
                        next[i] = e.target.value;
                        onUpdate({ options: next });
                      }}
                      className={inputCls}
                    />
                    <button
                      onClick={() =>
                        onUpdate({ options: field.options.filter((_, j) => j !== i) })
                      }
                      className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    onUpdate({
                      options: [...field.options, `Option ${field.options.length + 1}`],
                    })
                  }
                  className="text-xs text-accent hover:underline text-left"
                >
                  + Add option
                </button>
              </div>
            </EditorField>
          )}
        </div>
      )}
    </div>
  );
}

// ─── FormPreview ──────────────────────────────────────────────────────────────

function FormPreview({ title, fields }: { title: string; fields: FormField[] }) {
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (id: string, val: FieldValue) =>
    setValues((p) => ({ ...p, [id]: val }));

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="font-semibold text-foreground mb-4">Submitted ✓</p>
        <div className="flex flex-col gap-2">
          {fields.map((f) => (
            <div key={f.id} className="flex gap-3 text-sm">
              <span className="text-muted-foreground w-32 shrink-0 truncate">{f.label}</span>
              <span className="text-foreground break-all">
                {Array.isArray(values[f.id]) && (values[f.id] as unknown[])[0] instanceof File
                  ? (values[f.id] as File[]).map((fi) => fi.name).join(", ") || "—"
                  : Array.isArray(values[f.id])
                  ? `${(values[f.id] as RepeaterRow[]).length} row(s)`
                  : String(values[f.id] ?? "—")}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() => { setValues({}); setSubmitted(false); }}
          className="mt-5 text-xs text-accent hover:underline"
        >
          ← Back to form
        </button>
      </div>
    );
  }

  return (
    <form
      className="rounded-2xl border border-border bg-surface p-6 flex flex-col gap-5"
      onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
    >
      <h2 className="text-lg font-semibold text-foreground">{title || "Untitled form"}</h2>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">Add fields to see a preview.</p>
      )}

      {fields.map((f) => (
        <PreviewField
          key={f.id}
          field={f}
          value={values[f.id]}
          onChange={(val) => set(f.id, val)}
        />
      ))}

      {fields.length > 0 && (
        <button
          type="submit"
          className="mt-1 rounded-lg bg-primary text-primary-foreground text-sm font-medium py-2.5 hover:opacity-80 transition-opacity"
        >
          Submit
        </button>
      )}
    </form>
  );
}

// ─── PreviewField ─────────────────────────────────────────────────────────────

function PreviewField({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: FieldValue | undefined;
  onChange: (val: FieldValue) => void;
}) {
  const id = `preview-${field.id}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {field.label}
        {field.required && <span className="text-destructive ml-0.5">*</span>}
      </label>

      {(field.type === "text" || field.type === "email" || field.type === "number") && (
        <input
          id={id}
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}

      {field.type === "textarea" && (
        <textarea
          id={id}
          placeholder={field.placeholder}
          required={field.required}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={inputCls}
        />
      )}

      {field.type === "select" && (
        <select
          id={id}
          required={field.required}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        >
          <option value="">Select…</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {field.type === "checkbox" && (
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
          <input
            id={id}
            type="checkbox"
            checked={(value as boolean) ?? false}
            onChange={(e) => onChange(e.target.checked)}
            className="accent-[var(--color-accent)]"
          />
          {field.placeholder || field.label}
        </label>
      )}

      {field.type === "radio" && (
        <div className="flex flex-col gap-1.5">
          {field.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
              <input
                type="radio"
                name={id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="accent-[var(--color-accent)]"
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {field.type === "file" && (
        <FilePreviewInput
          id={id}
          required={field.required}
          multiple={field.multiple}
          value={(value as File[]) ?? []}
          onChange={(files) => onChange(files)}
        />
      )}

      {field.type === "repeater" && (
        <RepeaterInput
          subFields={field.subFields}
          value={(value as RepeaterRow[]) ?? []}
          onChange={(rows) => onChange(rows)}
        />
      )}

      {field.helpText && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}
    </div>
  );
}

// ─── RepeaterInput ────────────────────────────────────────────────────────────

function RepeaterInput({
  subFields,
  value,
  onChange,
}: {
  subFields: SubField[];
  value: RepeaterRow[];
  onChange: (rows: RepeaterRow[]) => void;
}) {
  const emptyRow = (): RepeaterRow =>
    Object.fromEntries(
      subFields.map((sf) => [sf.id, sf.type === "checkbox" ? false : ""])
    );

  const updateCell = (rowIdx: number, sfId: string, val: string | boolean) =>
    onChange(value.map((row, i) => i === rowIdx ? { ...row, [sfId]: val } : row));

  const addRow = () => onChange([...value, emptyRow()]);
  const removeRow = (i: number) => onChange(value.filter((_, j) => j !== i));

  if (subFields.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border py-8 text-center">
        <p className="text-sm font-medium text-foreground mb-1">No sub-fields configured</p>
        <p className="text-xs text-muted-foreground">Open the field editor (✎) and add sub-fields.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {value.length === 0 ? "No entries" : `${value.length} entr${value.length === 1 ? "y" : "ies"}`}
          </span>
          <span className="text-xs text-muted-foreground/50">·</span>
          <span className="text-xs text-muted-foreground">{subFields.length} field{subFields.length !== 1 ? "s" : ""}</span>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent border border-accent/30 rounded-lg px-3 py-1.5 hover:bg-accent/10 transition-colors"
        >
          + Add row
        </button>
      </div>

      {/* Empty state */}
      {value.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-border py-10 flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <RepeaterIcon />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No entries yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">Click "Add row" to create the first entry.</p>
          </div>
          <button
            type="button"
            onClick={addRow}
            className="text-sm font-medium text-accent hover:underline"
          >
            + Add first row
          </button>
        </div>
      )}

      {/* Rows */}
      {value.length > 0 && (
        <div className="flex flex-col gap-2">
          {value.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="rounded-xl border border-border bg-surface overflow-hidden"
            >
              {/* Row header */}
              <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/40 border-b border-border">
                <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center shrink-0">
                  {rowIdx + 1}
                </span>
                <span className="flex-1 text-xs font-medium text-muted-foreground">
                  Entry {rowIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeRow(rowIdx)}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  ✕ Remove
                </button>
              </div>

              {/* Row fields */}
              <div className="p-4 grid gap-3"
                style={{ gridTemplateColumns: subFields.some(sf => sf.type === "textarea") ? "1fr" : "repeat(auto-fill, minmax(180px, 1fr))" }}
              >
                {subFields.map((sf) => (
                  <SubFieldCell
                    key={sf.id}
                    sf={sf}
                    value={row[sf.id]}
                    onChange={(val) => updateCell(rowIdx, sf.id, val)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SubFieldCell({
  sf,
  value,
  onChange,
}: {
  sf: SubField;
  value: string | boolean | undefined;
  onChange: (val: string | boolean) => void;
}) {
  const id = `sf-${sf.id}-${Math.random()}`;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">
        {sf.label}
        {sf.required && <span className="text-destructive ml-0.5">*</span>}
      </label>

      {(sf.type === "text" || sf.type === "email" || sf.type === "number") && (
        <input
          type={sf.type}
          value={(value as string) ?? ""}
          placeholder={sf.placeholder}
          required={sf.required}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}

      {sf.type === "textarea" && (
        <textarea
          value={(value as string) ?? ""}
          placeholder={sf.placeholder}
          required={sf.required}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className={inputCls}
        />
      )}

      {sf.type === "select" && (
        <select
          value={(value as string) ?? ""}
          required={sf.required}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        >
          <option value="">Select…</option>
          {sf.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}

      {sf.type === "checkbox" && (
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none mt-1">
          <input
            type="checkbox"
            checked={(value as boolean) ?? false}
            onChange={(e) => onChange(e.target.checked)}
            className="accent-[var(--color-accent)]"
          />
          {sf.placeholder || sf.label}
        </label>
      )}

      {sf.type === "radio" && (
        <div className="flex flex-col gap-1 mt-1">
          {sf.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
              <input
                type="radio"
                name={id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="accent-[var(--color-accent)]"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function RepeaterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="5" rx="1" />
      <rect x="3" y="10" width="18" height="5" rx="1" />
      <rect x="3" y="17" width="18" height="5" rx="1" />
    </svg>
  );
}

// ─── FilePreviewInput ─────────────────────────────────────────────────────────

function FilePreviewInput({
  id,
  required,
  multiple,
  value,
  onChange,
}: {
  id: string;
  required: boolean;
  multiple: boolean;
  value: File[];
  onChange: (files: File[]) => void;
}) {
  const removeFile = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = multiple ? [...value, ...Array.from(incoming)] : [incoming[0]];
    onChange(next);
  };

  const showPicker = value.length === 0 || multiple;

  return (
    <div className="flex flex-col gap-2">
      {/* File previews */}
      {value.length > 0 && (
        <div className="flex flex-col gap-2">
          {value.map((file, i) => {
            const isImage = file.type.startsWith("image/");
            const url = isImage ? URL.createObjectURL(file) : null;
            return (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2">
                {url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={url}
                    alt={file.name}
                    className="w-12 h-12 rounded object-cover shrink-0"
                    onLoad={() => URL.revokeObjectURL(url)}
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center shrink-0">
                    <FileIcon />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload trigger */}
      {showPicker && (
        <label
          htmlFor={id}
          className="inline-flex items-center justify-center gap-2 cursor-pointer rounded-lg border border-dashed border-border bg-surface px-4 py-3 text-sm text-muted-foreground hover:border-accent hover:text-accent transition-colors"
        >
          <UploadIcon />
          {value.length === 0 ? "Choose file" : "Add more"}
          <input
            id={id}
            type="file"
            accept="image/*"
            required={required && value.length === 0}
            multiple={multiple}
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </label>
      )}
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function EditorField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function IconBtn({
  onClick,
  children,
  disabled,
  title,
  danger,
  active,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
  danger?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "w-7 h-7 flex items-center justify-center rounded text-sm transition-colors",
        "disabled:opacity-30 disabled:cursor-not-allowed",
        danger ? "hover:text-destructive hover:bg-destructive/10"
        : active ? "text-accent bg-accent/10"
        : "text-muted-foreground hover:text-foreground hover:bg-muted",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
