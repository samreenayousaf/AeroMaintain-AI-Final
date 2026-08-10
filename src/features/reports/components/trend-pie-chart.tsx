/* ════════════════════════════════════════════════════════════
   Pie Chart Card — Reusable wrapper around Recharts PieChart
   ════════════════════════════════════════════════════════════ */

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { cn } from "@/lib/utils";

interface PieSlice {
  name: string;
  value: number;
  color: string;
}

interface PieChartCardProps {
  data: PieSlice[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  className?: string;
}

const RADIAN = Math.PI / 180;

function renderLabel(props: PieLabelRenderProps) {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
  const radius = (innerRadius as number) + ((outerRadius as number) - (innerRadius as number)) * 1.4;
  const x = (cx as number) + radius * Math.cos(-(midAngle as number) * RADIAN);
  const y = (cy as number) + radius * Math.sin(-(midAngle as number) * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#94A3B8"
      textAnchor={x > (cx as number) ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
    >
      {`${(percent as number * 100).toFixed(0)}%`}
    </text>
  );
}

export function TrendPieChart({
  data,
  height = 220,
  innerRadius = 55,
  outerRadius = 85,
  showLegend = true,
  className,
}: PieChartCardProps) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            nameKey="name"
            paddingAngle={2}
            label={renderLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
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
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: 11, color: "#94A3B8" }}
              iconType="circle"
              iconSize={8}
              verticalAlign="bottom"
              height={28}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}