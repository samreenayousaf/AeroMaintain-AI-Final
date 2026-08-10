import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useAuthStore } from "@/store/auth.store";
import { KpiCards } from "@/features/dashboard/components/kpi-cards";
import { FleetHealthTrend } from "@/features/dashboard/components/fleet-health-trend";
import { DefectsDetectedChart } from "@/features/dashboard/components/defects-detected-chart";
import { DowntimeTrendChart } from "@/features/dashboard/components/downtime-trend-chart";
import { ActivityTimeline } from "@/features/dashboard/components/activity-timeline";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getDashboardKpis,
  getFleetHealthTrend,
  getDefectsDetected,
  getDowntimeTrend,
  getFleetHeatmap,
  getRecentActivity,
  getFleetComposition,
} from "@/features/dashboard/data";
import type {
  DashboardKpi,
  HealthTrendPoint,
  DefectsTrendPoint,
  DowntimeTrendPoint,
  HeatmapAircraft,
  ActivityEntry,
  FleetComposition,
} from "@/features/dashboard/data";
import { Sparkles, Radar } from "lucide-react";

const FleetHeatmap = lazy(() =>
  import("@/features/dashboard/components/fleet-heatmap").then((m) => ({
    default: m.FleetHeatmap,
  })),
);

/* ── Greeting helper ── */
function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════ */

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  /* ── Data state ── */
  const [kpis, setKpis] = useState<DashboardKpi[]>([]);
  const [healthTrend, setHealthTrend] = useState<HealthTrendPoint[]>([]);
  const [defects, setDefects] = useState<DefectsTrendPoint[]>([]);
  const [downtime, setDowntime] = useState<DowntimeTrendPoint[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapAircraft[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [composition, setComposition] = useState<FleetComposition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [
        kpisData,
        healthData,
        defectsData,
        downtimeData,
        heatmapData,
        activityData,
        compData,
      ] = await Promise.all([
        getDashboardKpis(),
        getFleetHealthTrend(),
        getDefectsDetected(),
        getDowntimeTrend(),
        getFleetHeatmap(),
        getRecentActivity(),
        getFleetComposition(),
      ]);

      if (cancelled) return;

      setKpis(kpisData);
      setHealthTrend(healthData);
      setDefects(defectsData);
      setDowntime(downtimeData);
      setHeatmap(heatmapData);
      setActivity(activityData);
      setComposition(compData);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const firstName = user?.full_name?.split(" ")[0] ?? "Admin";

  /* ── Fleet composition bars (memoised) ── */
  const compositionBars = useMemo(() => {
    if (!composition) return null;
    const total = composition.active + composition.maintenance + composition.grounded;
    const pct = (v: number) => (v / total) * 100;
    return (
      <div className="space-y-3">
        {/* Stacked bar */}
        <div className="flex h-3 overflow-hidden rounded-full bg-muted/50">
          <div
            className="bg-success transition-all duration-700"
            style={{ width: `${pct(composition.active)}%` }}
          />
          <div
            className="bg-warning transition-all duration-700"
            style={{ width: `${pct(composition.maintenance)}%` }}
          />
          <div
            className="bg-destructive transition-all duration-700"
            style={{ width: `${pct(composition.grounded)}%` }}
          />
        </div>

        {/* Legend */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
              Active
            </span>
            <span className="font-medium tabular-nums text-foreground">
              {composition.active}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-warning shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
              Maintenance
            </span>
            <span className="font-medium tabular-nums text-foreground">
              {composition.maintenance}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
              Grounded
            </span>
            <span className="font-medium tabular-nums text-foreground">
              {composition.grounded}
            </span>
          </div>
        </div>

        <div className="border-t border-border/50 pt-2 text-center">
          <span className="text-xs text-muted-foreground">
            {composition.availablePct}% fleet availability
          </span>
        </div>
      </div>
    );
  }, [composition]);

  return (
    <div className="space-y-6">
      {/* ── Welcome banner ── */}
      <div className="glass-card rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {greeting()}, {firstName}
            </h1>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your fleet today.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            <Radar className="h-3.5 w-3.5" />
            Live Monitoring Active
          </span>
          <span className="flex items-center gap-1.5 text-xs text-success bg-success/10 px-3 py-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5" />
            AI Engine Online
          </span>
        </div>
      </div>

      {/* ── Loading overlay ── */}
      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[130px] animate-pulse rounded-xl glass-card" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 h-80 animate-pulse rounded-xl glass-card" />
            <div className="h-80 animate-pulse rounded-xl glass-card" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 h-96 animate-pulse rounded-xl glass-card" />
            <div className="h-96 animate-pulse rounded-xl glass-card" />
          </div>
        </div>
      ) : (
        <>
          {/* ── Row 1: KPI Cards ── */}
          <KpiCards kpis={kpis} />

          {/* ── Row 2: Fleet Health Trend + Recent Activity ── */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <FleetHealthTrend data={healthTrend} />
            </div>
            <ActivityTimeline items={activity} />
          </div>

          {/* ── Row 3: Fleet Heatmap + Defects Detected ── */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Suspense
                fallback={
                  <div className="glass-card rounded-xl p-5">
                    <div className="mb-3 h-5 w-40 rounded bg-white/5 animate-pulse" />
                    <Skeleton className="h-[340px] w-full rounded-lg" />
                  </div>
                }
              >
                <FleetHeatmap aircraft={heatmap} />
              </Suspense>
            </div>
            <DefectsDetectedChart data={defects} />
          </div>

          {/* ── Row 4: Downtime Trend + Fleet Composition ── */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DowntimeTrendChart data={downtime} />
            </div>

            {/* Fleet composition card */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-base font-semibold text-foreground">Fleet Composition</h3>
              <p className="mb-4 text-xs text-muted-foreground">
                Current fleet status breakdown
              </p>
              {compositionBars}
            </div>
          </div>
        </>
      )}
    </div>
  );
}