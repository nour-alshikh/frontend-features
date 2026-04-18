"use client";

import { useState } from "react";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";

export default function StarRatingDemo() {
  const [rating, setRating] = useState(3);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-10">
        StarRating
      </h1>

      <div className="flex flex-col gap-6">
        <DemoRow label="Interactive (controlled)">
          <StarRating value={rating} onChange={setRating} />
          <span className="text-sm text-zinc-500 ml-3">{rating} / 5</span>
        </DemoRow>

        <DemoRow label="Read-only · value 4">
          <StarRating value={4} readOnly />
        </DemoRow>

        <DemoRow label="Empty">
          <StarRating value={0} readOnly />
        </DemoRow>

        <DemoRow label="Size sm">
          <StarRating value={3} size="sm" readOnly />
        </DemoRow>

        <DemoRow label="Size md (default)">
          <StarRating value={3} size="md" readOnly />
        </DemoRow>

        <DemoRow label="Size lg">
          <StarRating value={3} size="lg" readOnly />
        </DemoRow>

        <DemoRow label="Custom max (10 stars)">
          <StarRating value={7} max={10} readOnly />
        </DemoRow>
      </div>
    </main>
  );
}

function DemoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-52 shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}
