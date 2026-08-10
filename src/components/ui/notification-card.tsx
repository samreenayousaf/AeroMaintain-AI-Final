import type { AppNotification } from "@/types/models";
import { cn, timeAgo } from "@/lib/utils";
import { Bell, AlertTriangle, ClipboardCheck, PackageSearch, Info } from "lucide-react";

const typeConfig = {
  inspection_complete: { icon: ClipboardCheck, bg: "bg-success/10", color: "text-success" },
  critical_alert:     { icon: AlertTriangle, bg: "bg-destructive/10", color: "text-destructive" },
  approval_required:  { icon: Info,          bg: "bg-warning/10", color: "text-warning" },
  supplier_update:    { icon: PackageSearch, bg: "bg-info/10",     color: "text-info" },
  system:             { icon: Bell,          bg: "bg-muted",       color: "text-muted-foreground" },
};

interface NotificationCardProps {
  notification: AppNotification;
  onMarkRead?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

export function NotificationCard({
  notification: n,
  onMarkRead,
  onClick,
  className,
}: NotificationCardProps) {
  const cfg = typeConfig[n.type] ?? typeConfig.system;
  const Icon = cfg.icon;

  return (
    <button
      type="button"
      onClick={() => {
        onClick?.(n.id);
        if (!n.read_at) onMarkRead?.(n.id);
      }}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border border-border bg-card p-4 text-left transition-all duration-150 hover:bg-muted/50 cursor-pointer",
        !n.read_at && "border-l-primary",
        className,
      )}
    >
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", cfg.bg)}>
        <Icon className={cn("h-4 w-4", cfg.color)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm", !n.read_at ? "font-semibold text-foreground" : "font-medium text-muted-foreground")}>
          {n.title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.message}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(n.created_at)}</p>
      </div>
      {!n.read_at && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}