"use client";

import { useState, useEffect, useRef } from "react";

type Size = "sm" | "md" | "lg";

const sizes = {
  sm: { radius: 36, stroke: 4, time: "text-xl",  btn: "text-xs px-3 py-1" },
  md: { radius: 54, stroke: 5, time: "text-3xl", btn: "text-sm px-4 py-1.5" },
  lg: { radius: 72, stroke: 6, time: "text-5xl", btn: "text-base px-5 py-2" },
};

interface CountdownTimerProps {
  duration: number; // seconds
  autoStart?: boolean;
  size?: Size;
  onComplete?: () => void;
  className?: string;
}

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function CountdownTimer({
  duration,
  autoStart = false,
  size = "md",
  onComplete,
  className,
}: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const reset = () => {
    setIsRunning(false);
    setRemaining(duration);
  };

  const { radius, stroke, time, btn } = sizes[size];
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - remaining / duration);
  const svgSize = (radius + stroke) * 2 + 4;
  const center = svgSize / 2;
  const done = remaining === 0;

  return (
    <div className={["flex flex-col items-center gap-6", className].filter(Boolean).join(" ")}>
      {/* Ring */}
      <div className="relative">
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="currentColor" strokeWidth={stroke}
            className="text-muted"
          />
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="currentColor" strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={done ? "text-destructive" : "text-accent"}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${time} font-mono font-semibold tabular-nums text-foreground`}>
            {formatTime(remaining)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsRunning((r) => !r)}
          disabled={done}
          className={`rounded-lg bg-primary text-primary-foreground font-medium transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed ${btn}`}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className={`rounded-lg border border-border text-foreground font-medium transition-colors hover:bg-surface ${btn}`}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
