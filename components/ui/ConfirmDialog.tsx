"use client";

import { ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: ReactNode;
  /** Danger mode — makes the confirm button destructive red. Default: false */
  destructive?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  destructive = false,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      {description && (
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
      )}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:border-accent transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className={[
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            destructive
              ? "bg-destructive text-white hover:opacity-90"
              : "bg-accent text-accent-foreground hover:opacity-90",
          ].join(" ")}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
