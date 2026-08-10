/* ════════════════════════════════════════════════════════════
   Bar Chart Card — Reusable wrapper around Recharts BarChart
   ════════════════════════════════════════════════════════════ */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

interface BarItem {
  dataKey: string;
  color: string;
  name?: string;
  radius?: [number, number, number, number];
}

interface BarChartCardProps {
  data: Record<string, unknown>[];
  bars: BarItem[];
  xKey: string;
  height?: number;
  horizontal?: boolean;
  stacked?: boolean;
  showGrid?: boolean;
  className?: string;
}

export function TrendBarChart({
  data,
  bars,
  xKey,
  height = 220,
  horizontal = false,
  stacked = false,
  showGrid = false,
  className,
}: BarChartCardProps) {
  const ChartComponent = BarChart;

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ top: 4, right: 4, left: horizontal ? 80 : -12, bottom: 0 }}
          barCategoryGap="20%"
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1E293B"
              vertical={!horizontal}
              horizontal={horizontal}
            />
          )}
          {horizontal ? (
            <>
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis dataKey={xKey} type="category" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={80} />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} dy={6} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} dx={-4} width={36} />
            </>
          )}
          <Tooltip
            contentStyle={{
              background: "#101B2D",
              border: "1px solid #1E293B",
              borderRadius: 8,
              fontSize: 12,
              color: "#E2E8F0",
            }}
            labelStyle={{ color: "#94A3B8", marginBottom: 4 }}
          />
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={bar.color}
              name={bar.name ?? bar.dataKey}
              radius={bar.radius ?? [3, 3, 0, 0]}
              stackId={stacked ? "stack" : undefined}
              maxBarSize={horizontal ? 20 : 32}
            />
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}