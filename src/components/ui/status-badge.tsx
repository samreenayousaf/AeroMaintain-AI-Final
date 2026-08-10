import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "severity" | "health";
  className?: string;
}

const statusMap: Record<string, { label: string; ring: string; bg: string; text: string }> = {
  /* Aircraft */
  active:        { label: "Active",       ring: "ring-success/30", bg: "bg-success/10", text: "text-success" },
  maintenance:   { label: "In Maint.",    ring: "ring-warning/30", bg: "bg-warning/10", text: "text-warning" },
  grounded:      { label: "Grounded",     ring: "ring-destructive/30", bg: "bg-destructive/10", text: "text-destructive" },
  retired:       { label: "Retired",      ring: "ring-muted-foreground/30", bg: "bg-muted", text: "text-muted-foreground" },
  /* Inspection */
  in_progress:   { label: "In Progress",  ring: "ring-info/30", bg: "bg-info/10", text: "text-info" },
  submitted:     { label: "Submitted",    ring: "ring-warning/30", bg: "bg-warning/10", text: "text-warning" },
  under_review:  { label: "Under Review", ring: "ring-warning/30", bg: "bg-warning/10", text: "text-warning" },
  approved:      { label: "Approved",     ring: "ring-success/30", bg: "bg-success/10", text: "text-success" },
  rejected:      { label: "Rejected",     ring: "ring-destructive/30", bg: "bg-destructive/10", text: "text-destructive" },
  /* Defect */
  open:          { label: "Open",         ring: "ring-destructive/30", bg: "bg-destructive/10", text: "text-destructive" },
  resolved:      { label: "Resolved",     ring: "ring-success/30", bg: "bg-success/10", text: "text-success" },
  /* Severity */
  critical:      { label: "Critical",     ring: "ring-destructive/30", bg: "bg-destructive/10", text: "text-destructive" },
  major:         { label: "Major",        ring: "ring-warning/30", bg: "bg-warning/10", text: "text-warning" },
  minor:         { label: "Minor",        ring: "ring-info/30", bg: "bg-info/10", text: "text-info" },
  low:           { label: "Low",          ring: "ring-success/30", bg: "bg-success/10", text: "text-success" },
  medium:        { label: "Medium",       ring: "ring-warning/30", bg: "bg-warning/10", text: "text-warning" },
  high:          { label: "High",         ring: "ring-destructive/30", bg: "bg-destructive/10", text: "text-destructive" },
  /* Work Orders */
  assigned:      { label: "Assigned",     ring: "ring-info/30", bg: "bg-info/10", text: "text-info" },
  awaiting_parts:{ label: "Awaiting Parts", ring: "ring-warning/30", bg: "bg-warning/10", text: "text-warning" },
  completed:     { label: "Completed",    ring: "ring-success/30", bg: "bg-success/10", text: "text-success" },
  /* PO */
  draft:         { label: "Draft",        ring: "ring-muted-foreground/30", bg: "bg-muted", text: "text-muted-foreground" },
  ordered:       { label: "Ordered",      ring: "ring-info/30", bg: "bg-info/10", text: "text-info" },
  submitted_po:  { label: "Submitted",    ring: "ring-warning/30", bg: "bg-warning/10", text: "text-warning" },
  received:      { label: "Received",     ring: "ring-success/30", bg: "bg-success/10", text: "text-success" },
};

export function StatusBadge({ status, variant: _variant = "default", className }: StatusBadgeProps) {
  const config = statusMap[status] ?? {
    label: status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    ring: "ring-muted-foreground/30",
    bg: "bg-muted",
    text: "text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        config.bg,
        config.text,
        config.ring,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.text.replace("text-", "bg-"))} />
      {config.label}
    </span>
  );
}

/* ═ Health Indicator ═ */

interface HealthIndicatorProps {
  score: number; // 0–100
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

function healthColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

function healthBg(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 50) return "bg-warning";
  return "bg-destructive";
}

export function HealthIndicator({ score, size = "sm", showLabel = false, className }: HealthIndicatorProps) {
  const barH = size === "sm" ? "h-1.5" : "h-2";
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className={cn("w-16 rounded-full bg-muted overflow-hidden", barH)}>
        <div
          className={cn(barH, "rounded-full transition-all duration-500", healthBg(score))}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn("text-xs font-semibold tabular-nums", healthColor(score))}>
          {score}%
        </span>
      )}
    </div>
  );
}