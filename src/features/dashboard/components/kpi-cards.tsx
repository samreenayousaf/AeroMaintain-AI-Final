import { Activity, Plane, AlertTriangle, ClipboardCheck } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import type { DashboardKpi } from "@/features/dashboard/data";

const ICON_MAP = {
  health: Activity,
  fleet: Plane,
  alerts: AlertTriangle,
  inspections: ClipboardCheck,
} as const;

const ACCENT_MAP: Record<string, "cyan" | "green" | "amber" | "red" | "blue"> = {
  health: "cyan",
  fleet: "blue",
  alerts: "red",
  inspections: "green",
};

interface KpiCardsProps {
  kpis: DashboardKpi[];
}

export function KpiCards({ kpis }: KpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = ICON_MAP[kpi.icon];
        return (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            delta={kpi.delta}
            subtext={kpi.subtext}
            trend={kpi.trend}
            icon={<Icon className="h-4 w-4" />}
            iconAccent={ACCENT_MAP[kpi.icon]}
          />
        );
      })}
    </div>
  );
}