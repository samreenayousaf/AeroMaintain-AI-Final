import { MapPin, Box, History, Sparkles, type LucideIcon, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { formatDate, formatFlightHours } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  deriveHealthStatus,
  HEALTH_STATUS_META,
  healthBarClass,
  RISK_BADGE,
  type FleetAircraft,
} from "@/features/fleet/data";

/* ── Small building blocks ── */

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="mb-0.5 truncate text-[10px] uppercase tracking-wider text-muted-foreground/70">{label}</dt>
      <dd className="min-w-0 truncate">{children}</dd>
    </div>
  );
}

function IconAction({
  title,
  icon: Icon,
  onClick,
}: {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-transparent text-muted-foreground/60 transition-all duration-150 hover:border-primary/30 hover:bg-primary/10 hover:text-primary active:scale-95 cursor-pointer"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

/** Status chip shared between grid cards and list view. */
export function FleetStatusBadge({ aircraft }: { aircraft: Pick<FleetAircraft, "status" | "healthScore"> }) {
  const meta = HEALTH_STATUS_META[deriveHealthStatus(aircraft)];
  return <Badge variant={meta.badge}>{meta.label}</Badge>;
}

/* ── Aircraft card ── */

interface AircraftCardProps {
  aircraft: FleetAircraft;
  onViewDetails: (id: string) => void;
}

export function AircraftCard({ aircraft, onViewDetails }: AircraftCardProps) {
  const meta = HEALTH_STATUS_META[deriveHealthStatus(aircraft)];

  const handleAction = (label: string) => {
    toast(`${label} · ${aircraft.tailNumber}`, {
      description: "This flow arrives in a later phase.",
      variant: "info",
    });
  };

  return (
    <Card className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Header visual — realistic aircraft render with gradient */}
      <div className={cn("relative h-28 overflow-hidden", meta.glow)}>
        {/* Blueprint grid overlay */}
        <div
          className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:20px_20px]"
          aria-hidden="true"
        />
        
        {/* Realistic aircraft silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 200 80" className="h-24 w-48 opacity-15 group-hover:opacity-25 transition-opacity duration-500" xmlns="http://www.w3.org/2000/svg">
            <path d="M20,40 Q40,30 70,28 L140,26 Q170,26 180,35 Q190,40 180,45 Q170,54 140,54 L70,52 Q40,50 20,40 Z" fill="currentColor" className="text-foreground" />
            <path d="M80,35 L90,15 L140,12 L150,35 Z" fill="currentColor" className="text-foreground/70" />
            <path d="M80,45 L90,65 L140,68 L150,45 Z" fill="currentColor" className="text-foreground/70" />
            <path d="M35,36 L30,20 L55,18 L68,36 Z" fill="currentColor" className="text-foreground/50" />
            <path d="M35,44 L30,60 L55,62 L68,44 Z" fill="currentColor" className="text-foreground/50" />
            <ellipse cx="72" cy="32" rx="8" ry="6" fill="currentColor" className="text-foreground/30" />
            <ellipse cx="72" cy="48" rx="8" ry="6" fill="currentColor" className="text-foreground/30" />
          </svg>
        </div>
        
        {/* Status glow dots */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={cn(
            "h-1.5 w-1.5 rounded-full",
            aircraft.status === 'active' ? 'bg-success shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 
            aircraft.status === 'maintenance' ? 'bg-warning shadow-[0_0_6px_rgba(245,158,11,0.6)]' : 
            'bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.6)]'
          )} />
          <span className="text-[10px] text-muted-foreground font-medium">{aircraft.shortModel}</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-foreground drop-shadow-lg">{aircraft.tailNumber}</p>
          </div>
          <div className="shrink-0 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-sm font-bold tabular-nums text-foreground ring-1 ring-primary/20 shadow-lg">
            {aircraft.healthScore}%
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Status + location */}
        <div className="flex items-center justify-between gap-2">
          <FleetStatusBadge aircraft={aircraft} />
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {aircraft.location}
          </span>
        </div>

        {/* Key facts */}
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
          <InfoItem label="AI Risk">
            <Badge variant={RISK_BADGE[aircraft.aiRiskLevel]} className="text-[10px] capitalize px-1.5 py-0.5">
              {aircraft.aiRiskLevel}
            </Badge>
          </InfoItem>
          <InfoItem label="Flight Hours">
            <span className="font-medium text-foreground">{formatFlightHours(aircraft.flightHours)}</span>
          </InfoItem>
          <InfoItem label="Last Inspection">
            <span className="font-medium text-foreground">{formatDate(aircraft.lastInspection)}</span>
          </InfoItem>
          <InfoItem label="Next Inspection">
            <span className="font-medium text-foreground">{formatDate(aircraft.nextInspection)}</span>
          </InfoItem>
        </dl>

        {/* Health bar */}
        <div className="mt-auto pt-1">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Health Score</span>
            <span className="font-semibold tabular-nums text-foreground">{aircraft.healthScore}/100</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                healthBarClass(aircraft.healthScore),
              )}
              style={{ width: `${aircraft.healthScore}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 border-t border-border/40 pt-3">
          <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => onViewDetails(aircraft.id)}>
            <Activity className="mr-1.5 h-3.5 w-3.5" />
            View Details
          </Button>
          <IconAction title="Open Digital Twin" icon={Box} onClick={() => handleAction("Digital Twin")} />
          <IconAction title="Inspection History" icon={History} onClick={() => handleAction("Inspection History")} />
          <IconAction title="Run AI Analysis" icon={Sparkles} onClick={() => handleAction("AI Analysis")} />
        </div>
      </div>
    </Card>
  );
}