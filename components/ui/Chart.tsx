"use client";

import { useState, useRef, useLayoutEffect, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
}

interface BaseChartProps {
  labels: string[];
  datasets: ChartDataset[];
  height?: number;
  showLegend?: boolean;
  className?: string;
}

// Default palette — maps to CSS vars where possible, falls back to fixed colours
const PALETTE = [
  "var(--color-accent)",
  "#22c55e",
  "#f97316",
  "#ec4899",
  "#06b6d4",
  "#a855f7",
  "#eab308",
  "#ef4444",
];

function color(dataset: ChartDataset, idx: number) {
  return dataset.color ?? PALETTE[idx % PALETTE.length];
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

interface TooltipState {
  x: number;
  y: number;
  label: string;
  items: { name: string; value: number; color: string }[];
}

function ChartTooltip({ tip }: { tip: TooltipState }) {
  return (
    <div
      style={{ position: "absolute", top: tip.y, left: tip.x, pointerEvents: "none", zIndex: 10 }}
      className="bg-background border border-border rounded-xl shadow-xl px-3 py-2 text-xs whitespace-nowrap translate-x-2 -translate-y-1/2"
    >
      <p className="font-semibold text-foreground mb-1">{tip.label}</p>
      {tip.items.map((it) => (
        <div key={it.name} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: it.color }} />
          <span>{it.name}:</span>
          <span className="font-medium text-foreground">{it.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Legend ──────────────────────────────────────────────────────────────────

function Legend({ datasets }: { datasets: ChartDataset[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-3">
      {datasets.map((d, i) => (
        <div key={d.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: color(d, i) }} />
          {d.label}
        </div>
      ))}
    </div>
  );
}

// ─── BarChart ─────────────────────────────────────────────────────────────────

export function BarChart({
  labels,
  datasets,
  height = 240,
  showLegend = true,
  className,
}: BaseChartProps) {
  const [tip, setTip] = useState<TooltipState | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const PAD = { top: 16, right: 16, bottom: 32, left: 40 };
  const allValues = datasets.flatMap((d) => d.data);
  const maxVal = Math.max(...allValues, 1);
  const yTicks = 5;

  const [width, setWidth] = useState(400);
  useLayoutEffect(() => {
    if (svgRef.current) setWidth(svgRef.current.getBoundingClientRect().width || 400);
  }, []);

  const innerW = width - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;

  const groupW  = innerW / labels.length;
  const barW    = (groupW * 0.7) / datasets.length;
  const groupGap = groupW * 0.15;

  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      <svg ref={svgRef} width="100%" height={height} className="overflow-visible">
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Y-axis grid + labels */}
          {Array.from({ length: yTicks + 1 }, (_, i) => {
            const val = Math.round((maxVal * i) / yTicks);
            const y   = innerH - (val / maxVal) * innerH;
            return (
              <g key={i}>
                <line x1={0} y1={y} x2={innerW} y2={y} stroke="var(--color-border)" strokeDasharray="4 4" />
                <text x={-6} y={y + 4} textAnchor="end" fontSize={10} fill="var(--color-muted-foreground)">{val}</text>
              </g>
            );
          })}

          {/* Bars */}
          {labels.map((label, li) => {
            const groupX = li * groupW + groupGap;
            return datasets.map((ds, di) => {
              const val  = ds.data[li] ?? 0;
              const barH = (val / maxVal) * innerH;
              const x    = groupX + di * barW;
              const y    = innerH - barH;
              const c    = color(ds, di);
              return (
                <rect
                  key={`${li}-${di}`}
                  x={x} y={y} width={barW - 1} height={barH}
                  rx={3}
                  fill={c}
                  className="transition-opacity"
                  onMouseEnter={(e) => {
                    const rect = svgRef.current!.getBoundingClientRect();
                    setTip({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                      label,
                      items: datasets.map((d, i) => ({ name: d.label, value: d.data[li] ?? 0, color: color(d, i) })),
                    });
                  }}
                  onMouseLeave={() => setTip(null)}
                  style={{ cursor: "crosshair" }}
                />
              );
            });
          })}

          {/* X-axis labels */}
          {labels.map((label, li) => (
            <text
              key={label}
              x={li * groupW + groupW / 2}
              y={innerH + 18}
              textAnchor="middle"
              fontSize={11}
              fill="var(--color-muted-foreground)"
            >
              {label}
            </text>
          ))}

          {/* X axis line */}
          <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="var(--color-border)" />
        </g>
      </svg>
      {tip && <ChartTooltip tip={tip} />}
      {showLegend && <Legend datasets={datasets} />}
    </div>
  );
}

// ─── LineChart ────────────────────────────────────────────────────────────────

export function LineChart({
  labels,
  datasets,
  height = 240,
  showLegend = true,
  className,
}: BaseChartProps) {
  const [tip, setTip] = useState<TooltipState | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const PAD = { top: 16, right: 16, bottom: 32, left: 40 };
  const allValues = datasets.flatMap((d) => d.data);
  const maxVal = Math.max(...allValues, 1);
  const yTicks = 5;

  const [width, setWidth] = useState(400);
  useLayoutEffect(() => {
    if (svgRef.current) setWidth(svgRef.current.getBoundingClientRect().width || 400);
  }, []);

  const innerW = width - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const stepX  = labels.length > 1 ? innerW / (labels.length - 1) : innerW;

  const pointsFor = (data: number[]) =>
    data.map((v, i) => ({ x: i * stepX, y: innerH - (v / maxVal) * innerH }));

  const polyline = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x},${p.y}`).join(" ");

  const area = (pts: { x: number; y: number }[]) =>
    `M${pts[0].x},${innerH} ` +
    pts.map((p) => `L${p.x},${p.y}`).join(" ") +
    ` L${pts[pts.length - 1].x},${innerH} Z`;

  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      <svg ref={svgRef} width="100%" height={height} className="overflow-visible">
        <defs>
          {datasets.map((ds, di) => (
            <linearGradient key={di} id={`area-${di}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color(ds, di)} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color(ds, di)} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Grid */}
          {Array.from({ length: yTicks + 1 }, (_, i) => {
            const val = Math.round((maxVal * i) / yTicks);
            const y   = innerH - (val / maxVal) * innerH;
            return (
              <g key={i}>
                <line x1={0} y1={y} x2={innerW} y2={y} stroke="var(--color-border)" strokeDasharray="4 4" />
                <text x={-6} y={y + 4} textAnchor="end" fontSize={10} fill="var(--color-muted-foreground)">{val}</text>
              </g>
            );
          })}

          {/* Area + line per dataset */}
          {datasets.map((ds, di) => {
            const pts = pointsFor(ds.data);
            const c   = color(ds, di);
            return (
              <g key={di}>
                <path d={area(pts)} fill={`url(#area-${di})`} />
                <polyline points={polyline(pts)} fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" />
                {pts.map((p, li) => (
                  <circle
                    key={li}
                    cx={p.x} cy={p.y} r={4}
                    fill={c} stroke="var(--color-background)" strokeWidth={2}
                    style={{ cursor: "crosshair" }}
                    onMouseEnter={(e) => {
                      const rect = svgRef.current!.getBoundingClientRect();
                      setTip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        label: labels[li],
                        items: datasets.map((d, i) => ({ name: d.label, value: d.data[li] ?? 0, color: color(d, i) })),
                      });
                    }}
                    onMouseLeave={() => setTip(null)}
                  />
                ))}
              </g>
            );
          })}

          {/* X labels */}
          {labels.map((label, li) => (
            <text key={label} x={li * stepX} y={innerH + 18} textAnchor="middle" fontSize={11} fill="var(--color-muted-foreground)">
              {label}
            </text>
          ))}

          <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="var(--color-border)" />
        </g>
      </svg>
      {tip && <ChartTooltip tip={tip} />}
      {showLegend && <Legend datasets={datasets} />}
    </div>
  );
}

// ─── PieChart ─────────────────────────────────────────────────────────────────

export interface PieChartProps {
  labels: string[];
  data: number[];
  colors?: string[];
  /** Inner radius ratio (0 = pie, >0 = donut). Default: 0 */
  donut?: number;
  size?: number;
  showLegend?: boolean;
  className?: string;
}

export function PieChart({
  labels,
  data,
  colors,
  donut = 0,
  size = 200,
  showLegend = true,
  className,
}: PieChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [tip, setTip]         = useState<TooltipState | null>(null);

  const total = data.reduce((s, v) => s + v, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const R  = size / 2 - 6;
  const r  = R * donut;

  // Build slices
  let angle = -Math.PI / 2;
  const slices = data.map((val, i) => {
    const fraction = val / total;
    const start    = angle;
    angle += fraction * 2 * Math.PI;
    return { i, val, fraction, start, end: angle };
  });

  const arc = (start: number, end: number, large: boolean) => {
    const x1 = cx + R * Math.cos(start);
    const y1 = cy + R * Math.sin(start);
    const x2 = cx + R * Math.cos(end);
    const y2 = cy + R * Math.sin(end);
    const xi1 = cx + r * Math.cos(end);
    const yi1 = cy + r * Math.sin(end);
    const xi2 = cx + r * Math.cos(start);
    const yi2 = cy + r * Math.sin(start);
    const f   = large ? 1 : 0;
    if (donut > 0) {
      return `M${x1},${y1} A${R},${R} 0 ${f} 1 ${x2},${y2} L${xi1},${yi1} A${r},${r} 0 ${f} 0 ${xi2},${yi2} Z`;
    }
    return `M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${f} 1 ${x2},${y2} Z`;
  };

  const pieColors = colors ?? PALETTE;

  return (
    <div className={["relative flex flex-col items-center", className].filter(Boolean).join(" ")}>
      <svg width={size} height={size} className="overflow-visible">
        {slices.map(({ i, val, fraction, start, end }) => {
          const large = fraction > 0.5;
          const c     = pieColors[i % pieColors.length];
          const isHov = hovered === i;
          const midA  = (start + end) / 2;
          const offset = isHov ? 6 : 0;
          return (
            <path
              key={i}
              d={arc(start, end, large)}
              fill={c}
              transform={`translate(${offset * Math.cos(midA)}, ${offset * Math.sin(midA)})`}
              className="transition-transform duration-150"
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => {
                setHovered(i);
                const rect = (e.target as SVGPathElement).closest("svg")!.getBoundingClientRect();
                setTip({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                  label: labels[i],
                  items: [{ name: labels[i], value: val, color: c }],
                });
              }}
              onMouseLeave={() => { setHovered(null); setTip(null); }}
            />
          );
        })}
        {donut > 0 && (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight="600" fill="var(--color-foreground)">
            {total}
          </text>
        )}
      </svg>
      {tip && (
        <div
          style={{ position: "absolute", top: tip.y, left: tip.x, pointerEvents: "none", zIndex: 10 }}
          className="bg-background border border-border rounded-xl shadow-xl px-3 py-2 text-xs whitespace-nowrap translate-x-2 -translate-y-1/2"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: tip.items[0].color }} />
            <span className="text-muted-foreground">{tip.items[0].name}:</span>
            <span className="font-medium text-foreground">{tip.items[0].value}</span>
            <span className="text-muted-foreground">({((tip.items[0].value / total) * 100).toFixed(1)}%)</span>
          </div>
        </div>
      )}
      {showLegend && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-3">
          {labels.map((label, i) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: pieColors[i % pieColors.length] }} />
              {label} ({((data[i] / total) * 100).toFixed(0)}%)
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
