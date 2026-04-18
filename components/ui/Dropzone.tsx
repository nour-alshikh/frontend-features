"use client";

import { useState, useRef } from "react";

interface FileItem {
  id: string;
  file: File;
  error?: string;
}

interface DropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  onFiles?: (files: File[]) => void;
  className?: string;
}

export function Dropzone({
  accept,
  multiple = true,
  maxSize,
  onFiles,
  className,
}: DropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const process = (incoming: FileList | File[]) => {
    const items: FileItem[] = Array.from(incoming).map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      error:
        maxSize && file.size > maxSize
          ? `Too large — max ${formatBytes(maxSize)}`
          : undefined,
    }));
    setFiles((prev) => {
      const next = multiple ? [...prev, ...items] : items;
      onFiles?.(next.filter((f) => !f.error).map((f) => f.file));
      return next;
    });
  };

  const remove = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className={className}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setDragging(false); process(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={[
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors py-10 px-6 text-center select-none",
          dragging
            ? "border-accent bg-accent/5 text-accent"
            : "border-border hover:border-accent/60 hover:bg-surface text-muted-foreground",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && process(e.target.files)}
        />
        <UploadIcon />
        <div>
          <p className="text-sm font-medium text-foreground">
            {dragging ? "Drop to upload" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            or click to browse
            {accept ? ` · ${accept}` : ""}
            {maxSize ? ` · max ${formatBytes(maxSize)}` : ""}
          </p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map(({ id, file, error }) => (
            <li
              key={id}
              className={[
                "flex items-center gap-3 rounded-lg border px-4 py-3",
                error ? "border-destructive/40 bg-destructive/5" : "border-border bg-surface",
              ].join(" ")}
            >
              <FileTypeIcon mime={file.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{file.name}</p>
                <p className={`text-xs ${error ? "text-destructive" : "text-muted-foreground"}`}>
                  {error ?? formatBytes(file.size)}
                </p>
              </div>
              <button
                onClick={() => remove(id)}
                aria-label="Remove"
                className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              >
                <XIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function FileTypeIcon({ mime }: { mime: string }) {
  const color = mime.startsWith("image/") ? "text-accent"
    : mime === "application/pdf" ? "text-destructive"
    : "text-muted-foreground";
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${color}`}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
