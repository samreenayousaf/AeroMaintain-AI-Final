/* ════════════════════════════════════════════════════════════
   Trend Area Chart — Reusable wrapper around Recharts AreaChart
   ════════════════════════════════════════════════════════════ */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

interface LineConfig {
  dataKey: string;
  color: string;
  name?: string;
}

interface TrendAreaChartProps {
  data: readonly Record<string, unknown>[];
  lines: LineConfig[];
  xKey: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function TrendAreaChart({
  data,
  lines,
  xKey,
  height = 220,
  showGrid = false,
  showTooltip = true,
  className,
}: TrendAreaChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          )}
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            dy={6}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            dx={-4}
            width={40}
          />
          {showTooltip && (
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
          )}
          {lines.map((line) => (
            <Area
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              fill={line.color}
              fillOpacity={0.08}
              strokeWidth={2}
              name={line.name ?? line.dataKey}
              dot={false}
              activeDot={{ r: 4, fill: line.color, stroke: "#101B2D", strokeWidth: 2 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}