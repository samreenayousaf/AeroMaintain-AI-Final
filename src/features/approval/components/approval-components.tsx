import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import type {
  ApprovalRequest,
  ApprovalStatus,
  Priority,
  RequestType,
  CommentEntry,
} from "../data";
import {
  REQUEST_TYPE_LABELS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  ROLE_LABELS,
  timeAgo,
  formatCurrency,
} from "../data";
import {
  Clock, CheckCircle2, XCircle, AlertTriangle, MessageSquare, SendHorizonal, Activity, UserPlus, FileEdit, Loader2,
} from "lucide-react";

/* ── Stat Card ── */

export function StatsCards({ stats, children }: { stats: { pendingCount: number; criticalCount: number; approvedToday: number; rejectedToday: number; avgProcessingHours: number }; children?: React.ReactNode }) {
  const items = [
    { label: "Pending Requests", value: stats.pendingCount, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Critical Requests", value: stats.criticalCount, icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10" },
    { label: "Approved Today", value: stats.approvedToday, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Rejected Today", value: stats.rejectedToday, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "Avg Processing", value: `${stats.avgProcessingHours}h`, icon: Clock, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="animate-slide-in-up">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", item.bg)}>
              <item.icon className={cn("h-5 w-5", item.color)} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold tabular-nums text-foreground">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      {children}
    </div>
  );
}

/* ── Priority / Status Badges ── */

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, "destructive" | "warning" | "info" | "secondary"> = { critical: "destructive", high: "warning", medium: "info", low: "secondary" };
  return <Badge variant={map[priority]}>{PRIORITY_LABELS[priority]}</Badge>;
}

export function StatusBadge({ status }: { status: ApprovalStatus }) {
  const map: Record<ApprovalStatus, "destructive" | "warning" | "success" | "info" | "secondary" | "default"> = {
    pending_review: "warning", under_review: "info", approved: "success", rejected: "destructive",
    changes_requested: "warning", escalated: "destructive", draft: "secondary",
  };
  return <Badge variant={map[status]}>{STATUS_LABELS[status]}</Badge>;
}

const TYPE_ICONS: Record<RequestType, string> = { inspection: "🔬", ai_analysis: "🧠", procurement: "📦", defect_report: "⚠️" };

/* ── Workflow Visual ── */

export function WorkflowTimeline({ status }: { status: ApprovalStatus }) {
  const steps = [
    { key: "inspection", label: "Inspection Completed" },
    { key: "ai_analysis", label: "AI Analysis Generated" },
    { key: "procurement", label: "Procurement Prepared" },
    { key: "review", label: "Manager Review" },
    { key: "decision", label: "Approved / Rejected" },
    { key: "scheduled", label: "Maintenance Scheduled" },
  ];
  const doneUntil: Record<string, number> = { draft: 0, pending_review: 3, under_review: 3, changes_requested: 3, approved: 5, rejected: 5, escalated: 5 };
  const position = doneUntil[status] ?? 0;
  const isDecided = ["approved", "rejected", "escalated"].includes(status);

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workflow</p>
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {steps.map((step, idx) => {
          const done = idx <= position;
          const isLast = step.key === "scheduled";
          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                    done ? (isLast && isDecided ? "bg-success/20 text-success" : "bg-cyan-500/20 text-cyan-400") : "bg-muted text-muted-foreground",
                  )}
                >
                  {idx + 1}
                </div>
                <span className={cn("whitespace-nowrap text-[10px] leading-tight", done ? "text-foreground" : "text-muted-foreground")}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && <div className={cn("mx-0.5 h-px w-6 sm:w-10", done ? "bg-cyan-500/40" : "bg-muted")} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Request Table ── */

export function RequestTable({
  requests, selectedId, onSelect, isLoading,
}: {
  requests: ApprovalRequest[]; selectedId: string | null; onSelect: (id: string) => void; isLoading: boolean;
}) {
  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (requests.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CheckCircle2 className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">No matching requests</p>
      <p className="text-xs text-muted-foreground/60">Try adjusting your filters</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <th className="py-3 pl-2 pr-3">ID</th>
            <th className="p-3">Aircraft</th>
            <th className="p-3">Tail</th>
            <th className="p-3">By</th>
            <th className="hidden p-3 md:table-cell">Type</th>
            <th className="hidden p-3 sm:table-cell">Priority</th>
            <th className="hidden p-3 md:table-cell">Status</th>
            <th className="hidden p-3 lg:table-cell">Time</th>
            <th className="w-10 p-3" />
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr
              key={req.id}
              className={cn(
                "cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/50",
                selectedId === req.id && "bg-cyan-500/5",
              )}
              onClick={() => onSelect(req.id)}
            >
              <td className="py-2.5 pl-2 pr-3 font-medium text-cyan-400">{req.id}</td>
              <td className="p-2.5">{req.aircraft}</td>
              <td className="p-2.5 font-mono text-xs text-muted-foreground">{req.tailNumber}</td>
              <td className="p-2.5 whitespace-nowrap">{req.requestedBy}</td>
              <td className="hidden p-2.5 md:table-cell"><span className="text-xs">{TYPE_ICONS[req.requestType]} {REQUEST_TYPE_LABELS[req.requestType]}</span></td>
              <td className="hidden p-2.5 sm:table-cell"><PriorityBadge priority={req.priority} /></td>
              <td className="hidden p-2.5 md:table-cell"><StatusBadge status={req.status} /></td>
              <td className="hidden p-2.5 lg:table-cell"><span className="whitespace-nowrap text-xs text-muted-foreground">{timeAgo(req.submissionTime)}</span></td>
              <td className="p-2.5"><ChevronIcon selected={selectedId === req.id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChevronIcon({ selected }: { selected: boolean }) {
  return (
    <svg className={cn("h-4 w-4 text-muted-foreground transition-transform", selected && "rotate-0 text-cyan-400")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={selected ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
    </svg>
  );
}

/* ── Detail Field ── */

function DetailField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

/* ── Comments ── */

export function CommentsSection({ comments, onAddComment, commentText, setCommentText }: {
  comments: CommentEntry[]; onAddComment: () => void; commentText: string; setCommentText: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <MessageSquare className="h-4 w-4 text-muted-foreground" /> Comments ({comments.length})
      </div>
      <div className="flex gap-2">
        <input
          placeholder="Add a comment…"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && commentText.trim()) onAddComment(); }}
          className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button onClick={onAddComment} disabled={!commentText.trim()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50 cursor-pointer transition-colors">
          <SendHorizonal className="h-4 w-4" />
        </button>
      </div>
      {comments.length === 0 && <p className="text-xs text-muted-foreground/60 italic">No comments yet.</p>}
      <div className="max-h-48 space-y-2 overflow-y-auto">
        {comments.map((c) => (
          <div key={c.id} className="rounded-lg border border-border/50 bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{c.author}</span>
                <Badge variant="outline" className="text-[10px]">{ROLE_LABELS[c.role]}</Badge>
              </div>
              <span className="text-[10px] text-muted-foreground">{timeAgo(c.timestamp)}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Activity Timeline ── */

export function ActivityTimeline({ log }: { log: Array<{ action: string; user: string; timestamp: string }> }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Activity className="h-4 w-4 text-muted-foreground" /> Activity
      </div>
      <div className="space-y-0">
        {log.map((entry, idx: number) => (
          <div key={idx} className="relative flex gap-3 pb-3 last:pb-0">
            {idx < log.length - 1 && <div className="absolute left-[5px] top-3 h-full w-px bg-border" />}
            <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-500/40 ring-2 ring-background" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">{entry.action}</p>
              <p className="text-[10px] text-muted-foreground">{entry.user} · {timeAgo(entry.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Details Panel ── */

export function DetailsPanel({
  request, onApprove, onReject, onRequestChanges, onAssignEngineer, onEscalate, onSaveDraft,
  onAddComment, commentText, setCommentText,
}: {
  request: ApprovalRequest; onApprove: () => void; onReject: () => void; onRequestChanges: () => void;
  onAssignEngineer: () => void; onEscalate: () => void; onSaveDraft: () => void;
  onAddComment: () => void; commentText: string; setCommentText: (v: string) => void;
}) {
  const isDecided = ["approved", "rejected", "escalated"].includes(request.status);

  return (
    <div className="space-y-5 animate-slide-in-right">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-cyan-400">{request.id}</span>
            <StatusBadge status={request.status} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{request.title}</p>
        </div>
        <PriorityBadge priority={request.priority} />
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{request.description}</p>

      {/* Aircraft */}
      <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
        <p className="mb-2 text-xs font-semibold text-muted-foreground">AIRCRAFT</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <DetailField label="Model">{request.aircraftModel}</DetailField>
          <DetailField label="Tail">{request.tailNumber}</DetailField>
          <DetailField label="Age">{request.aircraftAge}</DetailField>
          <DetailField label="Cycles">{request.cycles.toLocaleString()}</DetailField>
          <DetailField label="FH">{request.totalFlightHours.toLocaleString()}</DetailField>
          <DetailField label="Downside">{request.estimatedDowntime}</DetailField>
        </div>
      </div>

      {/* Inspection */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">INSPECTION</p>
        <p className="text-xs leading-relaxed text-foreground">{request.inspectionSummary}</p>
      </div>

      {/* AI */}
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
          <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px]">AI</span> Root Cause
        </p>
        <p className="text-xs leading-relaxed text-foreground">{request.aiRootCause}</p>
      </div>

      {/* Component / Probability / Cost */}
      <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
        <DetailField label="Component" className="col-span-2">{request.affectedComponent}</DetailField>
        <div className="flex items-center gap-3"><ProgressRing value={request.failureProbability} size={44} strokeWidth={4} /><DetailField label="Prob.">{request.failureProbability}%</DetailField></div>
        <DetailField label="Severity">{request.severity}</DetailField>
        <DetailField label="Downside">{request.estimatedDowntime}</DetailField>
        <DetailField label="Cost">{formatCurrency(request.costEstimate)}</DetailField>
      </div>

      {/* Maintenance */}
      {request.recommendedSupplier !== "N/A" && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">RECOMMENDED</p>
          <p className="text-xs leading-relaxed text-foreground">{request.recommendedMaintenance}</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <DetailField label="Supplier">{request.recommendedSupplier}</DetailField>
            <DetailField label="Quote">{request.supplierQuoteRef}</DetailField>
          </div>
        </div>
      )}

      {/* Notes / Rejection */}
      {(request.managerNotes || request.rejectionReason) && (
        <div className={cn("rounded-lg border p-3", request.rejectionReason ? "border-destructive/30 bg-destructive/5" : "border-cyan-500/20 bg-cyan-500/5")}>
          <p className="mb-1 text-xs font-semibold">{request.rejectionReason ? "Rejection Reason" : "Notes"}</p>
          <p className="text-xs leading-relaxed text-foreground">{request.rejectionReason ?? request.managerNotes}</p>
        </div>
      )}

      {/* Assigned */}
      {request.assignedEngineer && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <UserPlus className="h-3.5 w-3.5" /> Engineer: <span className="font-medium text-foreground">{request.assignedEngineer}</span>
        </div>
      )}

      {/* Actions */}
      {!isDecided && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">ACTIONS</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={onApprove} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer transition-colors active:scale-[0.97]"><CheckCircle2 className="h-3.5 w-3.5" /> Approve</button>
            <button onClick={onReject} className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 cursor-pointer transition-colors active:scale-[0.97]"><XCircle className="h-3.5 w-3.5" /> Reject</button>
            <button onClick={onRequestChanges} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted cursor-pointer transition-colors"><FileEdit className="h-3.5 w-3.5" /> Changes</button>
            <button onClick={onAssignEngineer} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted cursor-pointer transition-colors"><UserPlus className="h-3.5 w-3.5" /> Assign</button>
            <button onClick={onEscalate} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted cursor-pointer transition-colors"><AlertTriangle className="h-3.5 w-3.5" /> Escalate</button>
            <button onClick={onSaveDraft} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted cursor-pointer transition-colors">Draft</button>
          </div>
        </div>
      )}

      {/* Comments */}
      <CommentsSection comments={request.comments} onAddComment={onAddComment} commentText={commentText} setCommentText={setCommentText} />
      <ActivityTimeline log={request.activityLog} />
      <WorkflowTimeline status={request.status} />
    </div>
  );
}

/* ── Action Dialog ── */

export function ActionDialog({
  open, onClose, onConfirm, title, description, children, confirmLabel = "Confirm", confirmVariant = "default", isLoading,
}: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string;
  children?: React.ReactNode; confirmLabel?: string; confirmVariant?: "default" | "destructive"; isLoading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-lg mx-4 animate-zoom-in">
        <div className="rounded-xl border border-border bg-card shadow-xl">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {children && <div className="px-6 py-4">{children}</div>}
          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            <button onClick={onClose} disabled={isLoading} className="h-10 rounded-lg border border-border bg-transparent px-4 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50 cursor-pointer transition-colors">Cancel</button>
            <button onClick={onConfirm} disabled={isLoading} className={cn("h-10 rounded-lg px-4 text-sm font-medium disabled:opacity-50 cursor-pointer transition-colors", confirmVariant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
              {isLoading && <Loader2 className="mr-1.5 inline h-4 w-4 animate-spin" />}{confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}