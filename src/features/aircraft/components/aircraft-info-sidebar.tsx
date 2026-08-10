import { Plane, MapPin, Calendar, Clock, Gauge, Wrench, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/utils";
import { formatDate, compactNumber } from "@/lib/format";
import type { AircraftDetail } from "@/features/aircraft/data";

interface AircraftInfoSidebarProps {
  aircraft: AircraftDetail;
  className?: string;
}

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

export function AircraftInfoSidebar({ aircraft, className }: AircraftInfoSidebarProps) {
  const rows: Array<{ label: string; value: string; icon: React.ReactNode }> = [
    { label: "Aircraft Model", value: aircraft.model, icon: <Plane className="h-3.5 w-3.5" /> },
    { label: "Tail Number", value: aircraft.tailNumber, icon: <Plane className="h-3.5 w-3.5" /> },
    { label: "Manufacturer", value: aircraft.manufacturer, icon: <BarChart3 className="h-3.5 w-3.5" /> },
    { label: "Engine Type", value: aircraft.engineType, icon: <Wrench className="h-3.5 w-3.5" /> },
    { label: "Flight Hours", value: `${compactNumber(aircraft.flightHours)} hrs`, icon: <Clock className="h-3.5 w-3.5" /> },
    { label: "Cycles", value: compactNumber(aircraft.cycles), icon: <BarChart3 className="h-3.5 w-3.5" /> },
    { label: "Current Location", value: aircraft.location, icon: <MapPin className="h-3.5 w-3.5" /> },
    { label: "Last Inspection", value: formatDate(aircraft.lastInspection), icon: <Calendar className="h-3.5 w-3.5" /> },
    { label: "Next Inspection", value: formatDate(aircraft.nextInspection), icon: <Calendar className="h-3.5 w-3.5" /> },
    { label: "Maintenance Status", value: statusLabel[aircraft.status] ?? aircraft.status, icon: <Gauge className="h-3.5 w-3.5" /> },
  ];

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <ProgressRing value={aircraft.healthScore} size={56} strokeWidth={5} />
          <div>
            <CardTitle className="text-sm font-semibold">{aircraft.tailNumber}</CardTitle>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-[11px] text-muted-foreground">{aircraft.model}</p>
              <Badge variant={statusBadge[aircraft.status]} className="text-[9px] px-1.5 py-0">
                {statusLabel[aircraft.status]}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-0">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-3 border-b border-border/30 py-2.5 last:border-0"
          >
            <span className="shrink-0 text-muted-foreground">{row.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {row.label}
              </p>
              <p className="text-xs font-medium text-foreground truncate">{row.value}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}