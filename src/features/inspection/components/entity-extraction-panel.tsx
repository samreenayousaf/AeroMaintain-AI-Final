import { useMemo } from "react";
import { BrainCircuit, ScanSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  extractEntities,
  computeProgress,
  INSPECTION_CHECKLIST,
  type ExtractedEntity,
} from "@/features/inspection/data";
import { formatConfidence } from "@/features/inspection/utils";
import type { TranscriptEntry } from "@/features/inspection/speechmatics";
import { cn } from "@/lib/utils";

interface EntityExtractionPanelProps {
  entries: TranscriptEntry[];
  isLive: boolean;
}

function EntityRow({ entity }: { entity: ExtractedEntity }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{entity.label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{entity.value}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {entity.label === "Severity" || entity.label === "Risk Level" ? (
          <StatusBadge status={entity.value.toLowerCase()} variant="severity" />
        ) : (
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatConfidence(entity.confidence)}
          </span>
        )}
      </div>
    </div>
  );
}

export function EntityExtractionPanel({ entries, isLive }: EntityExtractionPanelProps) {
  const finalText = useMemo(
    () => entries.map((e) => e.text).join(" "),
    [entries],
  );
  const entities = useMemo(() => extractEntities(finalText), [finalText]);

  const completedCount = INSPECTION_CHECKLIST.length;
  const progress = computeProgress(completedCount, INSPECTION_CHECKLIST.length);

  const aiStatus = !isLive && entries.length === 0
    ? "Idle"
    : entities.length === 0
      ? "Listening…"
      : "Analyzing";

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">AI Extraction</CardTitle>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
              aiStatus === "Idle"
                ? "border-border bg-muted/40 text-muted-foreground"
                : aiStatus === "Analyzing"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-info/30 bg-info/10 text-info",
            )}
          >
            <BrainCircuit className="h-3 w-3" />
            {aiStatus}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Inspection progress */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Inspection Progress</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {INSPECTION_CHECKLIST.length} systems reviewed
            </p>
          </div>
          <ProgressRing value={progress} size={52} />
        </div>

        {/* Extracted entities */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <ScanSearch className="h-3.5 w-3.5" /> Detected Entities
          </p>
          {entities.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center">
              <p className="text-sm text-foreground">No entities detected yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Dictate a defect while recording and the AI will extract the component, system,
                severity and risk automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {entities.map((e) => (
                <EntityRow key={e.id} entity={e} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}