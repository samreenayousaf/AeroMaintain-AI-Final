import { Table, type TableColumn } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { MaintenanceRecord } from "@/features/aircraft/data";

interface MaintenanceHistoryProps {
  records: MaintenanceRecord[];
  isLoading?: boolean;
  className?: string;
}

const statusBadge: Record<MaintenanceRecord["status"], "success" | "info" | "warning"> = {
  completed: "success",
  "in-progress": "warning",
  scheduled: "info",
};

const typeBadge: Record<MaintenanceRecord["inspectionType"], string> = {
  routine: "text-[10px] uppercase",
  "a-check": "text-[10px] uppercase",
  "c-check": "text-[10px] uppercase",
  defect: "text-[10px] uppercase",
};

const columns: TableColumn<MaintenanceRecord>[] = [
  {
    key: "date",
    header: "Date",
    render: (r) => <span className="text-xs text-foreground">{formatDate(r.date)}</span>,
  },
  {
    key: "technician",
    header: "Technician",
    render: (r) => (
      <span className="inline-flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
          {r.technician.split(" ").map((n) => n[0]).join("")}
        </span>
        <span className="text-xs text-foreground">{r.technician}</span>
      </span>
    ),
  },
  {
    key: "issue",
    header: "Issue",
    render: (r) => <span className="text-xs font-medium text-foreground">{r.issue}</span>,
  },
  {
    key: "action",
    header: "Action Taken",
    render: (r) => <span className="text-xs text-muted-foreground">{r.actionTaken}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (r) => (
      <Badge variant={statusBadge[r.status]} className="text-[10px] capitalize">
        {r.status.replace("-", " ")}
      </Badge>
    ),
  },
  {
    key: "type",
    header: "Inspection Type",
    render: (r) => (
      <Badge variant="outline" className={typeBadge[r.inspectionType]}>
        {r.inspectionType}
      </Badge>
    ),
  },
];

export function MaintenanceHistory({ records, isLoading, className }: MaintenanceHistoryProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info/15">
            <ClipboardList className="h-4 w-4 text-info" />
          </div>
          <CardTitle className="text-sm font-semibold">Maintenance History</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Table
          columns={columns}
          data={records}
          keyExtractor={(r) => r.id}
          isLoading={isLoading}
          emptyState={
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-medium text-foreground">No maintenance records yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Completed inspections and work orders will appear here.
              </p>
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}