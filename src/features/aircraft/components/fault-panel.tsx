import { AlertTriangle, Brain, Wrench, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { CurrentFault } from "@/features/aircraft/data";

interface FaultPanelProps {
  fault: CurrentFault;
  className?: string;
}

const severityBadge = {
  critical: "destructive" as const,
  major: "warning" as const,
  minor: "info" as const,
};

export function FaultPanel({ fault, className }: FaultPanelProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/15">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <CardTitle className="text-sm font-semibold">Current Fault</CardTitle>
          </div>
          <Badge variant={severityBadge[fault.severity]} className="text-[10px] uppercase">
            {fault.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Issue */}
        <div>
          <p className="text-[13px] font-medium text-foreground">{fault.issue}</p>
        </div>

        {/* Confidence + AI Prediction */}
        <div className="rounded-lg bg-muted/30 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-semibold text-foreground">AI Analysis</span>
            <Badge variant="info" className="ml-auto text-[10px]">
              {fault.confidenceScore}% confidence
            </Badge>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {fault.aiPrediction}
          </p>
        </div>

        {/* Affected Systems */}
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Affected Systems
          </p>
          <div className="flex flex-wrap gap-1.5">
            {fault.affectedSystems.map((sys) => (
              <Badge key={sys} variant="outline" className="text-[10px]">
                {sys}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recommended Action */}
        <div className="flex gap-2 rounded-lg bg-primary/5 p-2.5">
          <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Recommended Action
            </p>
            <p className="text-[11px] leading-relaxed text-foreground">{fault.recommendedAction}</p>
          </div>
        </div>

        {/* Downtime + Next Inspection row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/30 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-[10px] font-medium">Est. Downtime</span>
            </div>
            <p className="mt-1 text-sm font-bold text-warning">{fault.estimatedDowntimeHours}h</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span className="text-[10px] font-medium">Next Inspection</span>
            </div>
            <p className="mt-1 text-sm font-bold text-foreground">{formatDate(fault.nextInspection)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}