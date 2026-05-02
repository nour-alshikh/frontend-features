"use client";

import Link from "next/link";
import { BarChart, LineChart, PieChart } from "@/components/ui/Chart";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const REVENUE: import("@/components/ui/Chart").ChartDataset[] = [
  { label: "Revenue",  data: [42000, 55000, 49000, 63000, 71000, 80000] },
  { label: "Expenses", data: [31000, 33000, 29000, 38000, 42000, 45000] },
];

const USERS: import("@/components/ui/Chart").ChartDataset[] = [
  { label: "New users",    data: [120, 180, 145, 230, 310, 280] },
  { label: "Returning",    data: [340, 390, 420, 460, 510, 570] },
];

const TRAFFIC_LABELS = ["Organic", "Direct", "Social", "Referral", "Email"];
const TRAFFIC_DATA   = [42, 25, 15, 12, 6];

export default function ChartDemo() {
  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Charts</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Bar, line, and pie/donut charts built with pure SVG — no external chart libraries.
        Hover any data point for a tooltip.
      </p>

      <div className="flex flex-col gap-12 max-w-3xl">

        <Section label="Bar chart — multi-dataset">
          <div className="p-6 rounded-xl border border-border bg-surface">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Revenue vs Expenses (USD)</p>
            <BarChart labels={MONTHS} datasets={REVENUE} height={240} />
          </div>
        </Section>

        <Section label="Line chart — area fill">
          <div className="p-6 rounded-xl border border-border bg-surface">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">User Growth</p>
            <LineChart labels={MONTHS} datasets={USERS} height={240} />
          </div>
        </Section>

        <Section label="Pie chart">
          <div className="p-6 rounded-xl border border-border bg-surface flex justify-center">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 text-center">Traffic sources</p>
              <PieChart labels={TRAFFIC_LABELS} data={TRAFFIC_DATA} size={220} />
            </div>
          </div>
        </Section>

        <Section label="Donut chart (inner radius)">
          <div className="p-6 rounded-xl border border-border bg-surface flex justify-center">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 text-center">Traffic sources</p>
              <PieChart
                labels={TRAFFIC_LABELS}
                data={TRAFFIC_DATA}
                donut={0.55}
                size={220}
              />
            </div>
          </div>
        </Section>

        <Section label="Responsive bar — single dataset">
          <div className="p-6 rounded-xl border border-border bg-surface">
            <BarChart
              labels={MONTHS}
              datasets={[{ label: "Sessions", data: [1200, 1850, 1640, 2200, 2900, 3100] }]}
              height={180}
            />
          </div>
        </Section>

        <Section label="Features">
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Bar chart — grouped multi-dataset bars, auto-scaled y-axis</li>
            <li>Line chart — area gradient fill, hover circles, smooth corners</li>
            <li>Pie / donut — hover offset animation, percentage labels, center total for donut</li>
            <li>Hover tooltips on all chart types</li>
            <li>Shared colour palette using CSS tokens where available</li>
            <li>SVG width adapts to container via <code className="bg-surface px-1 rounded">width="100%"</code></li>
          </ul>
        </Section>

      </div>
    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-4">{label}</p>
      {children}
    </div>
  );
}
