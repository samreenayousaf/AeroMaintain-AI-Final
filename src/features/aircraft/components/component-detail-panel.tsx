import { Activity, AlertTriangle, Calendar, Gauge, Search, Wrench } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import type { ComponentHealth } from "@/features/aircraft/data";

interface SelectedComponentPanelProps {
  component: ComponentHealth | null;
  className?: string;
}

const riskBadge = {
  low: "success" as const,
  medium: "warning" as const,
  high: "destructive" as const,
  critical: "destructive" as const,
};

const statusVariant = {
  operational: "success" as const,
  degraded: "warning" as const,
  failed: "destructive" as const,
};

export function SelectedComponentPanel({ component, className }: SelectedComponentPanelProps) {
  if (!component) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-sm font-semibold">Component Detail</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Gauge className="mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              Click a system on the digital twin above to view its details.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-sm font-semibold">{component.name}</CardTitle>
          </div>
          <Badge variant={statusVariant[component.status]} className="text-[10px]">
            {component.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health ring */}
        <div className="flex items-center gap-4">
          <ProgressRing value={component.health} size={72} strokeWidth={6} />
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-foreground">{component.system}</p>
            <p className="text-[11px] text-muted-foreground">
              {component.health >= 80 ? "Operating normally" : component.health >= 50 ? "Showing degradation" : "Requires immediate attention"}
            </p>
          </div>
        </div>

        {/* Risk + Failure Probability */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-muted/30 p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Risk Level</p>
            <Badge variant={riskBadge[component.riskLevel]} className="mt-1 text-[10px]">
              {component.riskLevel.toUpperCase()}
            </Badge>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Failure Probability
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <AlertTriangle className={cn(
                "h-3.5 w-3.5",
                component.failureProbability > 50 ? "text-destructive" : "text-warning",
              )} />
              <span className="text-sm font-bold text-foreground">{component.failureProbability}%</span>
            </div>
          </div>
        </div>

        {/* Last Inspection + Remaining Life */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-muted/30 p-2.5">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span className="text-[10px] font-medium">Last Inspection</span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-foreground">{formatDate(component.lastInspection)}</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Wrench className="h-3 w-3" />
              <span className="text-[10px] font-medium">Remaining Life</span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-foreground">{component.predictedRemainingLife}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}