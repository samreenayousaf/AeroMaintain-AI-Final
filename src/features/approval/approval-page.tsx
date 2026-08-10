import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";
import { approvalService, type ApprovalRequest, type ApprovalStats, type Priority } from "./data";
import {
  StatsCards,
  RequestTable,
  DetailsPanel,
  ActionDialog,
} from "./components/approval-components";

const PRIORITY_ORDER: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export function ApprovalPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [stats, setStats] = useState<ApprovalStats | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [commentText, setCommentText] = useState("");
  const [dialog, setDialog] = useState<{ type: string; open: boolean }>({ type: "", open: false });
  const [dialogText, setDialogText] = useState("");
  const [dialogLoading, setDialogLoading] = useState(false);

  const selected = requests.find((r) => r.id === selectedId) ?? null;

  const load = useCallback(async () => {
    setIsLoading(true);
    const [r, s] = await Promise.all([approvalService.getRequests(), approvalService.getStats()]);
    setRequests(r);
    setStats(s);
    if (!selectedId && r.length > 0) setSelectedId(r[0].id);
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, []);

  const filtered = requests
    .filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        if (!r.id.toLowerCase().includes(q) && !r.title.toLowerCase().includes(q)
          && !r.aircraft.toLowerCase().includes(q) && !r.tailNumber.toLowerCase().includes(q)
          && !r.requestedBy.toLowerCase().includes(q)) return false;
      }
      if (filterType !== "all" && r.requestType !== filterType) return false;
      if (filterPriority !== "all" && r.priority !== filterPriority) return false;
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      || new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime());

  const refresh = async () => {
    const [r, s] = await Promise.all([approvalService.getRequests(), approvalService.getStats()]);
    setRequests(r);
    setStats(s);
  };

  const closeDialog = () => { setDialog({ type: "", open: false }); setDialogText(""); };

  const handleApprove = async () => {
    if (!selectedId) return;
    setDialogLoading(true);
    await approvalService.approveRequest(selectedId, dialogText || undefined);
    setDialogLoading(false);
    closeDialog();
    await refresh();
  };

  const handleReject = async () => {
    if (!selectedId || !dialogText.trim()) return;
    setDialogLoading(true);
    await approvalService.rejectRequest(selectedId, dialogText);
    setDialogLoading(false);
    closeDialog();
    await refresh();
  };

  const handleRequestChanges = async () => {
    if (!selectedId || !dialogText.trim()) return;
    setDialogLoading(true);
    await approvalService.requestChanges(selectedId, dialogText);
    setDialogLoading(false);
    closeDialog();
    await refresh();
  };

  const handleAssignEngineer = async () => {
    if (!selectedId || !dialogText.trim()) return;
    setDialogLoading(true);
    await approvalService.assignEngineer(selectedId, dialogText);
    setDialogLoading(false);
    closeDialog();
    await refresh();
  };

  const handleEscalate = async () => {
    if (!selectedId || !dialogText.trim()) return;
    setDialogLoading(true);
    await approvalService.escalateRequest(selectedId, dialogText);
    setDialogLoading(false);
    closeDialog();
    await refresh();
  };

  const handleSaveDraft = async () => {
    if (!selectedId) return;
    await approvalService.saveDraft(selectedId, "Draft saved");
    await refresh();
  };

  const handleAddComment = async () => {
    if (!selectedId || !commentText.trim()) return;
    await approvalService.addComment(selectedId, "Manager", commentText);
    setCommentText("");
    await refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manager Approval"
        description="Review and approve inspection findings, AI analysis, and procurement requests before maintenance scheduling."
      />

      {stats && <StatsCards stats={stats} />}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search ID, aircraft, tail, engineer…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select options={[
          { value: "all", label: "All Types" }, { value: "inspection", label: "Inspection" },
          { value: "ai_analysis", label: "AI Analysis" }, { value: "procurement", label: "Procurement" },
          { value: "defect_report", label: "Defect Report" },
        ]} value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-[140px]" />
        <Select options={[
          { value: "all", label: "All Priority" }, { value: "critical", label: "Critical" },
          { value: "high", label: "High" }, { value: "medium", label: "Medium" }, { value: "low", label: "Low" },
        ]} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="w-[140px]" />
        <Select options={[
          { value: "all", label: "All Status" }, { value: "pending_review", label: "Pending Review" },
          { value: "under_review", label: "Under Review" }, { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" }, { value: "changes_requested", label: "Changes Requested" },
          { value: "escalated", label: "Escalated" },
        ]} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-[160px]" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">{filtered.length} of {requests.length}</span>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" /> Approval Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <RequestTable requests={filtered} selectedId={selectedId} onSelect={setSelectedId} isLoading={isLoading} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {selected ? (
            <Card className="xl:sticky xl:top-6">
              <CardContent className="p-4">
                <DetailsPanel
                  request={selected}
                  onApprove={() => setDialog({ type: "approve", open: true })}
                  onReject={() => { setDialogText(""); setDialog({ type: "reject", open: true }); }}
                  onRequestChanges={() => { setDialogText(""); setDialog({ type: "changes", open: true }); }}
                  onAssignEngineer={() => { setDialogText(""); setDialog({ type: "assign", open: true }); }}
                  onEscalate={() => { setDialogText(""); setDialog({ type: "escalate", open: true }); }}
                  onSaveDraft={handleSaveDraft}
                  onAddComment={handleAddComment}
                  commentText={commentText}
                  setCommentText={setCommentText}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <ArrowUpDown className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm font-medium text-muted-foreground">Select a request</p>
                <p className="text-xs text-muted-foreground/60">Click any row to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ActionDialog
        open={dialog.type === "approve" && dialog.open}
        onClose={closeDialog}
        onConfirm={handleApprove}
        title="Approve Request"
        description="Confirm approval of this maintenance request."
        confirmLabel="Approve"
        confirmVariant="default"
        isLoading={dialogLoading}
      >
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Notes (optional)</label>
          <textarea
            value={dialogText}
            onChange={(e) => setDialogText(e.target.value)}
            placeholder="Add approval notes…"
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>
      </ActionDialog>

      <ActionDialog
        open={dialog.type === "reject" && dialog.open}
        onClose={closeDialog}
        onConfirm={handleReject}
        title="Reject Request"
        description="Provide a reason for rejection."
        confirmLabel="Reject"
        confirmVariant="destructive"
        isLoading={dialogLoading}
      >
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Reason *</label>
          <textarea
            value={dialogText}
            onChange={(e) => setDialogText(e.target.value)}
            placeholder="Explain why this request is rejected…"
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>
      </ActionDialog>

      <ActionDialog
        open={dialog.type === "changes" && dialog.open}
        onClose={closeDialog}
        onConfirm={handleRequestChanges}
        title="Request Changes"
        description="Specify what changes are needed."
        confirmLabel="Request Changes"
        isLoading={dialogLoading}
      >
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Change Notes *</label>
          <textarea
            value={dialogText}
            onChange={(e) => setDialogText(e.target.value)}
            placeholder="Describe the changes needed…"
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>
      </ActionDialog>

      <ActionDialog
        open={dialog.type === "assign" && dialog.open}
        onClose={closeDialog}
        onConfirm={handleAssignEngineer}
        title="Assign Engineer"
        description="Enter the engineer's name."
        confirmLabel="Assign"
        isLoading={dialogLoading}
      >
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Engineer Name *</label>
          <Input
            value={dialogText}
            onChange={(e) => setDialogText(e.target.value)}
            placeholder="e.g. David Okonkwo"
          />
        </div>
      </ActionDialog>

      <ActionDialog
        open={dialog.type === "escalate" && dialog.open}
        onClose={closeDialog}
        onConfirm={handleEscalate}
        title="Escalate Request"
        description="Provide escalation reason."
        confirmLabel="Escalate"
        confirmVariant="destructive"
        isLoading={dialogLoading}
      >
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Escalation Reason *</label>
          <textarea
            value={dialogText}
            onChange={(e) => setDialogText(e.target.value)}
            placeholder="Explain why this needs escalation…"
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>
      </ActionDialog>
    </div>
  );
}