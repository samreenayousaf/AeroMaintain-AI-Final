import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { HealthTrendPoint } from "@/features/dashboard/data";

interface FleetHealthTrendProps {
  data: HealthTrendPoint[];
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
      <p className="font-bold text-foreground" style={{ color: payload[0].color }}>
        {payload[0].value}%
      </p>
    </div>
  );
}

export function FleetHealthTrend({ data }: FleetHealthTrendProps) {
  return (
    <Card className="glow-cyan/50">
      <CardHeader className="pb-1">
        <CardTitle className="text-base font-semibold">Fleet Health Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={{ stroke: "#1E293B" }}
                tickLine={false}
              />
              <YAxis
                domain={[80, 100]}
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#06B6D4", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Area
                type="monotone"
                dataKey="health"
                stroke="#06B6D4"
                strokeWidth={2.5}
                fill="url(#healthGradient)"
                dot={{ r: 3, fill: "#06B6D4", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#06B6D4", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}