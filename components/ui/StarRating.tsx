"use client";

import { useState } from "react";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
};

interface StarRatingProps {
  value?: number;
  max?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: Size;
  className?: string;
}

export function StarRating({
  value = 0,
  max = 5,
  onChange,
  readOnly = false,
  size = "md",
  className,
}: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div
      className={["flex items-center gap-0.5", className].filter(Boolean).join(" ")}
      role={readOnly ? "img" : "group"}
      aria-label={`${value} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            aria-label={`Rate ${star} out of ${max}`}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            className={[
              sizes[size],
              "transition-all duration-100",
              readOnly
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-sm",
              star <= active
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-600",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <StarIcon />
          </button>
        );
      })}
    </div>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
