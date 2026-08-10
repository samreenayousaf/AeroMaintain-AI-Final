import { useMemo, useState, useCallback } from "react";
import { ClipboardCheck, CheckCircle2, SkipForward, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  INSPECTION_CHECKLIST,
  matchedChecklistIds,
  type ChecklistStatus,
} from "@/features/inspection/data";
import type { TranscriptEntry } from "@/features/inspection/speechmatics";
import { cn } from "@/lib/utils";

interface InspectionChecklistProps {
  entries: TranscriptEntry[];
}

const STATUS_CYCLE: ChecklistStatus[] = ["pending", "completed", "skipped"];

export function InspectionChecklist({ entries }: InspectionChecklistProps) {
  const finalText = useMemo(
    () => entries.map((e) => e.text).join(" "),
    [entries],
  );
  const transcriptMatches = useMemo(
    () => matchedChecklistIds(finalText),
    [finalText],
  );

  // Track manual overrides. Keyed by checklist item id.
  const [overrides, setOverrides] = useState<Record<string, ChecklistStatus>>({});

  const getStatus = useCallback(
    (item: (typeof INSPECTION_CHECKLIST)[number]): ChecklistStatus => {
      // User override wins
      if (overrides[item.id] !== undefined) return overrides[item.id];
      // Auto-complete items mentioned in transcript
      if (transcriptMatches.includes(item.id)) return "completed";
      return "pending";
    },
    [overrides, transcriptMatches],
  );

  const toggleStatus = useCallback((id: string) => {
    setOverrides((prev) => {
      const current = prev[id] ?? "pending";
      const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
      if (next === "pending") {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  }, []);

  const completedCount = INSPECTION_CHECKLIST.filter(
    (i) => getStatus(i) === "completed",
  ).length;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardCheck className="h-4 w-4 text-primary" /> Checklist
          </CardTitle>
          <span className="text-xs tabular-nums text-muted-foreground">
            {completedCount}/{INSPECTION_CHECKLIST.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {INSPECTION_CHECKLIST.map((item) => {
          const status = getStatus(item);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleStatus(item.id)}
              aria-label={`${item.label}: ${status}. Click to toggle.`}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-150 active:scale-[0.98] cursor-pointer",
                status === "completed"
                  ? "bg-success/10 text-success"
                  : status === "skipped"
                    ? "bg-warning/5 text-warning/70 line-through"
                    : "bg-muted/20 text-muted-foreground hover:bg-muted/40",
              )}
            >
              <span className="flex shrink-0 items-center justify-center">
                {status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : status === "skipped" ? (
                  <SkipForward className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </span>
              <span className="flex-1">{item.label}</span>
              <span className="text-[10px] uppercase tabular-nums tracking-wider">
                {status}
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}