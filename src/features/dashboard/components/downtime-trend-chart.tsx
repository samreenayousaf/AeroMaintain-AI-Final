import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { DowntimeTrendPoint } from "@/features/dashboard/data";

interface DowntimeTrendChartProps {
  data: DowntimeTrendPoint[];
}

interface TooltipPayloadEntry {
  value: number;
  name: string;
  color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card/90 px-3 py-2 text-sm shadow-lg backdrop-blur-md">
      <p className="text-muted-foreground text-xs">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-medium text-foreground" style={{ color: p.color }}>
          {p.name}: {p.value}h
        </p>
      ))}
    </div>
  );
}

export function DowntimeTrendChart({ data }: DowntimeTrendChartProps) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-base font-semibold">Downtime Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={{ stroke: "#1E293B" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3B82F6", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#94A3B8" }}
                iconType="line"
                iconSize={12}
              />
              <Line
                type="monotone"
                dataKey="scheduled"
                name="Scheduled"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#3B82F6" }}
              />
              <Line
                type="monotone"
                dataKey="unscheduled"
                name="Unscheduled"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                activeDot={{ r: 4, fill: "#F59E0B" }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                name="Total"
                stroke="#06B6D4"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#06B6D4", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#06B6D4" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}