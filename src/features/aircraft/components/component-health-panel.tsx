import { ProgressRing } from "@/components/ui/progress-ring";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ── Ring with label + status badge ── */

interface HealthRingItem {
  label: string;
  health: number;
  isSelected?: boolean;
  onClick?: () => void;
  /** Matches component svgId for mapping */
  svgId?: string;
}

interface ComponentHealthPanelProps {
  rings: HealthRingItem[];
  /** The svgId of the currently selected component (or null) */
  selectedSvgId?: string | null;
  className?: string;
}

export function ComponentHealthPanel({ rings, selectedSvgId, className }: ComponentHealthPanelProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-3 sm:grid-cols-6", className)}>
      {rings.map((ring) => {
        const isSelected = ring.isSelected ?? ring.svgId === selectedSvgId;
        return (
          <button
            key={ring.label}
            type="button"
            onClick={ring.onClick}
            disabled={!ring.onClick}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-200",
              isSelected
                ? "border-primary/50 bg-primary/5 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                : "border-border bg-card hover:border-primary/20 hover:bg-muted/30",
              ring.onClick && "cursor-pointer",
            )}
            aria-label={`${ring.label}: ${ring.health}%${isSelected ? " (selected)" : ""}`}
            aria-pressed={isSelected}
          >
            <ProgressRing value={ring.health} size={52} strokeWidth={5} className="shrink-0" />
            <span className="text-[11px] font-medium text-foreground leading-tight">{ring.label}</span>
            <Badge
              variant={ring.health >= 80 ? "success" : ring.health >= 50 ? "warning" : "destructive"}
              className="text-[10px] px-1.5 py-0"
            >
              {ring.health}%
            </Badge>
          </button>
        );
      })}
    </div>
  );
}