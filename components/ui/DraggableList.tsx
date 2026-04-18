"use client";

import { useState, ReactNode } from "react";

interface DraggableListProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T) => string | number;
  className?: string;
}

export function DraggableList<T>({
  items,
  onChange,
  renderItem,
  getKey,
  className,
}: DraggableListProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    setDragIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (index !== dragIndex) setOverIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    onChange(next);
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className={className}>
      {items.map((item, index) => {
        const isDragging = dragIndex === index;
        const isOver = overIndex === index && !isDragging;
        const insertBefore = overIndex !== null && dragIndex !== null && overIndex <= dragIndex;

        return (
          <div
            key={getKey(item)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={[
              isDragging ? "opacity-40" : "opacity-100",
              isOver && insertBefore  ? "border-t-2 border-accent" : "",
              isOver && !insertBefore ? "border-b-2 border-accent" : "",
            ].filter(Boolean).join(" ")}
          >
            <div className="flex items-center gap-3 group">
              <div
                className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                title="Drag to reorder"
              >
                <GripIcon />
              </div>
              <div className="flex-1 min-w-0">{renderItem(item, index)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9"  cy="5"  r="1" fill="currentColor" stroke="none" />
      <circle cx="9"  cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="9"  cy="19" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="5"  r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
