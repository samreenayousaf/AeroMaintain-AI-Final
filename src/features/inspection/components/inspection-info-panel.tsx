import { Plane, User, ClipboardList, CalendarClock, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { INSPECTION_SESSION } from "@/features/inspection/data";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function InspectionInfoPanel() {
  const s = INSPECTION_SESSION;
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Inspection Information</CardTitle>
          <StatusBadge status="in_progress" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow icon={<Plane className="h-4 w-4" />} label="Aircraft" value={s.aircraft} />
        <InfoRow icon={<Layers className="h-4 w-4" />} label="Tail Number" value={s.tailNumber} />
        <InfoRow icon={<User className="h-4 w-4" />} label="Mechanic" value={s.mechanicName} />
        <InfoRow icon={<ClipboardList className="h-4 w-4" />} label="Inspection Type" value={s.inspectionType} />
        <InfoRow icon={<Layers className="h-4 w-4" />} label="ATA Chapter" value={`${s.ataChapter} — ${s.ataTitle}`} />
        <InfoRow icon={<CalendarClock className="h-4 w-4" />} label="Date & Time" value={s.dateTime} />
      </CardContent>
    </Card>
  );
}