import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  unit?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  subtext?: string;
  iconAccent?: "cyan" | "green" | "amber" | "red" | "blue";
  className?: string;
  onClick?: () => void;
}

const iconAccentStyles: Record<string, string> = {
  cyan: "bg-primary/15 text-primary",
  green: "bg-success/15 text-success",
  amber: "bg-warning/15 text-warning",
  red: "bg-destructive/15 text-destructive",
  blue: "bg-info/15 text-info",
};

export function StatCard({
  label,
  value,
  delta,
  unit,
  icon,
  trend,
  subtext,
  iconAccent,
  className,
  onClick,
}: StatCardProps) {
  const resolvedTrend =
    trend ?? (delta !== undefined ? (delta > 0 ? "up" : delta < 0 ? "down" : "neutral") : undefined);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200",
        onClick && "cursor-pointer hover:border-primary/30 hover:shadow-md",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter") onClick(); } : undefined}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon && (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              iconAccent ? iconAccentStyles[iconAccent] : "bg-muted text-muted-foreground",
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>

      {subtext && (
        <p className="mt-0.5 text-xs text-muted-foreground">{subtext}</p>
      )}

      {resolvedTrend && (
        <div className="mt-1 flex items-center gap-1">
          {resolvedTrend === "up" && <TrendingUp className="h-3.5 w-3.5 text-success" />}
          {resolvedTrend === "down" && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
          {resolvedTrend === "neutral" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
          {delta !== undefined && (
            <span
              className={cn(
                "text-xs font-medium",
                resolvedTrend === "up" && "text-success",
                resolvedTrend === "down" && "text-destructive",
                resolvedTrend === "neutral" && "text-muted-foreground",
              )}
            >
              {delta > 0 ? "+" : ""}
              {delta}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}