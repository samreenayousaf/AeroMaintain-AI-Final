import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plane, Radar } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime, timeAgo } from "@/lib/format";
import { DigitalTwin } from "@/features/aircraft/components/digital-twin";
import { AircraftInfoSidebar } from "@/features/aircraft/components/aircraft-info-sidebar";
import { ComponentHealthPanel } from "@/features/aircraft/components/component-health-panel";
import { SelectedComponentPanel } from "@/features/aircraft/components/component-detail-panel";
import { FaultPanel } from "@/features/aircraft/components/fault-panel";
import { MaintenanceHistory } from "@/features/aircraft/components/maintenance-history";
import {
  getAircraftDashboardData,
  type AircraftDetail,
  type ComponentHealth,
  type CurrentFault,
  type MaintenanceRecord,
} from "@/features/aircraft/data";

const statusBadge = {
  active: "success" as const,
  maintenance: "info" as const,
  grounded: "destructive" as const,
};

const statusLabel: Record<string, string> = {
  active: "Active",
  maintenance: "In Maintenance",
  grounded: "Grounded",
};

export function AircraftDetailPage() {
  const navigate = useNavigate();

  const [aircraft, setAircraft] = useState<AircraftDetail | null>(null);
  const [components, setComponents] = useState<ComponentHealth[]>([]);
  const [fault, setFault] = useState<CurrentFault | null>(null);
  const [history, setHistory] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>("comp-hydraulic");

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAircraftDashboardData();
    setAircraft(data.detail);
    setComponents(data.components);
    setFault(data.fault);
    setHistory(data.history);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* Selected component (defaults to the hydraulic fault) */
  const selectedComponent = useMemo(
    () => components.find((c) => c.id === selectedId) ?? null,
    [components, selectedId],
  );

  const handleSelect = useCallback((component: ComponentHealth) => {
    setSelectedId(component.id);
  }, []);

  /* Health rings (6 core systems) mapped to twin components */
  const rings = useMemo(() => {
    if (components.length === 0) return [];
    const find = (svgId: string) => components.find((c) => c.svgId === svgId);
    const engineAvg = Math.round(
      ((find("left-engine")?.health ?? 0) + (find("right-engine")?.health ?? 0)) / 2,
    );
    const items: Array<{ label: string; health: number; svgId: string }> = [
      { label: "Engine", health: engineAvg, svgId: "left-engine" },
      { label: "Hydraulics", health: find("hydraulic-system")?.health ?? 0, svgId: "hydraulic-system" },
      { label: "Landing Gear", health: find("landing-gear")?.health ?? 0, svgId: "landing-gear" },
      { label: "Fuel", health: find("fuel-system")?.health ?? 0, svgId: "fuel-system" },
      { label: "Electrical", health: find("electrical-system")?.health ?? 0, svgId: "electrical-system" },
      { label: "Cabin Pressure", health: find("cabin-pressure")?.health ?? 0, svgId: "cabin-pressure" },
    ];
    return items.map((item) => ({
      ...item,
      onClick: () => {
        const c = find(item.svgId);
        if (c) handleSelect(c);
      },
    }));
  }, [components, handleSelect]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-white/[0.05]" />
          <Skeleton className="h-4 w-72 bg-white/[0.05]" />
        </div>
        <div className="grid gap-4 lg:grid-cols-12">
          <Skeleton className="h-96 lg:col-span-3 rounded-xl glass-card" />
          <Skeleton className="h-96 lg:col-span-6 rounded-xl glass-card" />
          <Skeleton className="h-96 lg:col-span-3 rounded-xl glass-card" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl glass-card" />
      </div>
    );
  }

  if (!aircraft) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Plane className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">Aircraft not found</p>
        <p className="mt-1 text-xs text-muted-foreground">
          We couldn't load this aircraft. Head back to the fleet to try again.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/fleet")}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Fleet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <PageHeader
        title="Aircraft Details"
        description="Central health monitoring interface with AI Digital Twin"
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/fleet")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Fleet
          </Button>
        }
      />

      {/* Aircraft identity strip */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary glow-cyan">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground">{aircraft.tailNumber}</h2>
                <Badge variant={statusBadge[aircraft.status]} className="text-[10px] uppercase">
                  {statusLabel[aircraft.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {aircraft.model} · {aircraft.engineType}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Health Score
              </p>
              <p className="text-lg font-bold text-success">{aircraft.healthScore}%</p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Last Updated
              </p>
              <p className="text-sm font-medium text-foreground">
                {formatDateTime(aircraft.lastUpdated)} · {timeAgo(aircraft.lastUpdated)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left sidebar */}
        <div className="lg:col-span-3">
          <AircraftInfoSidebar aircraft={aircraft} className="h-full" />
        </div>

        {/* Center: digital twin + health rings */}
        <div className="space-y-4 lg:col-span-6">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Radar className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">AI Digital Twin</h3>
              <span className="text-[10px] text-muted-foreground">
                Select a system to inspect
              </span>
            </div>
            <DigitalTwin
              components={components}
              selectedId={selectedComponent?.svgId ?? null}
              onSelect={handleSelect}
            />
          </div>

          <div className="glass-card rounded-xl p-4">
            <ComponentHealthPanel rings={rings} selectedSvgId={selectedComponent?.svgId ?? null} />
          </div>
        </div>

        {/* Right: selected component + current fault */}
        <div className="space-y-4 lg:col-span-3">
          <SelectedComponentPanel component={selectedComponent} />
          {fault && <FaultPanel fault={fault} />}
        </div>
      </div>

      {/* ── Maintenance history ── */}
      <MaintenanceHistory records={history} />
    </div>
  );
}