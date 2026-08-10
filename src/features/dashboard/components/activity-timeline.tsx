import { formatDistanceToNow } from "date-fns";
import {
  ClipboardCheck,
  AlertTriangle,
  BrainCircuit,
  Truck,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ActivityEntry, ActivityType } from "@/features/dashboard/data";

interface ActivityTimelineProps {
  items: ActivityEntry[];
  isLoading?: boolean;
}

/* ── Activity type configuration ── */
interface TypeConfig {
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  color: string;
}

const TYPE_CONFIG: Record<ActivityType, TypeConfig> = {
  inspection: {
    icon: ClipboardCheck,
    bg: "bg-success/15",
    color: "text-success",
  },
  defect: {
    icon: AlertTriangle,
    bg: "bg-destructive/15",
    color: "text-destructive",
  },
  ai_analysis: {
    icon: BrainCircuit,
    bg: "bg-primary/15",
    color: "text-primary",
  },
  supplier: {
    icon: Truck,
    bg: "bg-info/15",
    color: "text-info",
  },
  approval: {
    icon: ShieldCheck,
    bg: "bg-warning/15",
    color: "text-warning",
  },
  notification: {
    icon: Info,
    bg: "bg-muted",
    color: "text-muted-foreground",
  },
};

function ActivityItem({ entry }: { entry: ActivityEntry }) {
  const cfg = TYPE_CONFIG[entry.type];
  const Icon = cfg.icon;
  const timeAgo = formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true });

  return (
    <div className="group relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-3.5 top-8 bottom-0 w-px bg-border last:hidden" />

      {/* Dot + icon */}
      <div
        className={cn(
          "absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border border-border",
          cfg.bg,
        )}
      >
        <Icon className={cn("h-3.5 w-3.5", cfg.color)} />
      </div>

      {/* Content */}
      <div className="pb-5 last:pb-0">
        <p className="text-sm font-medium text-foreground">{entry.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
          {entry.description}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          {entry.tailNumber && (
            <span className="inline-block rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-mono font-medium text-primary">
              {entry.tailNumber}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

export function ActivityTimeline({ items, isLoading }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : !items.length ? (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No recent activity to show.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {items.map((entry) => (
              <div key={entry.id} className="py-1 first:pt-0 last:pb-0">
                <div className="relative">
                  <ActivityItem entry={entry} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}