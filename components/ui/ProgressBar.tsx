type Size = "sm" | "md" | "lg";
type Color = "accent" | "success" | "destructive" | "primary";

const heights: Record<Size, string> = {
  sm: "h-1",
  md: "h-2.5",
  lg: "h-4",
};

const colors: Record<Color, string> = {
  accent:      "bg-accent",
  success:     "bg-success",
  destructive: "bg-destructive",
  primary:     "bg-primary",
};

interface ProgressBarProps {
  value?: number; // 0–100
  size?: Size;
  color?: Color;
  showLabel?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export function ProgressBar({
  value = 0,
  size = "md",
  color = "accent",
  showLabel = false,
  indeterminate = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={["w-full flex flex-col gap-1.5", className].filter(Boolean).join(" ")}>
      {showLabel && !indeterminate && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}

      {/* Track */}
      <div
        className={`w-full ${heights[size]} rounded-full bg-muted overflow-hidden`}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={indeterminate ? "Loading…" : `${clamped}%`}
      >
        {/* Bar */}
        <div
          className={`h-full rounded-full ${colors[color]} ${indeterminate ? "w-1/3" : "transition-all duration-500 ease-out"}`}
          style={
            indeterminate
              ? { animation: "progress-indeterminate 1.4s ease-in-out infinite" }
              : { width: `${clamped}%` }
          }
        />
      </div>
    </div>
  );
}
