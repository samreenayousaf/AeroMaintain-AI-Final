import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { DefectsTrendPoint } from "@/features/dashboard/data";

interface DefectsDetectedChartProps {
  data: DefectsTrendPoint[];
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
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function DefectsDetectedChart({ data }: DefectsDetectedChartProps) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-base font-semibold">Defects Detected</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barCategoryGap="30%">
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
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(30,41,59,0.4)" }} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#94A3B8" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="detected"
                name="Total"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="critical"
                name="Critical"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}