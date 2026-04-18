"use client";

import { useState } from "react";
import Link from "next/link";
import { Dropzone } from "@/components/ui/Dropzone";
import { DraggableList } from "@/components/ui/DraggableList";

interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
}

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Design system tokens",   priority: "high" },
  { id: "2", title: "Build auth flow",         priority: "high" },
  { id: "3", title: "Write unit tests",        priority: "medium" },
  { id: "4", title: "Update documentation",    priority: "medium" },
  { id: "5", title: "Performance audit",       priority: "low" },
];

const priorityColors = {
  high:   "bg-destructive/10 text-destructive",
  medium: "bg-accent/10 text-accent",
  low:    "bg-muted text-muted-foreground",
};

export default function DragDropDemo() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-10">Drag & Drop</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-4xl">

        {/* Dropzone */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            File dropzone
          </h2>
          <Dropzone
            multiple
            maxSize={5 * 1024 * 1024}
            accept="image/*, .pdf, .txt"
            onFiles={(files) => console.log("files:", files)}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Accepts images, PDFs, txt · max 5 MB each
          </p>
        </section>

        {/* Sortable list */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Sortable list
          </h2>
          <DraggableList
            items={tasks}
            onChange={setTasks}
            getKey={(t) => t.id}
            className="flex flex-col gap-2"
            renderItem={(task) => (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                <span className="flex-1 text-sm text-foreground">{task.title}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
            )}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Hover a row to reveal the grip handle, then drag to reorder.
          </p>
        </section>

      </div>
    </main>
  );
}
