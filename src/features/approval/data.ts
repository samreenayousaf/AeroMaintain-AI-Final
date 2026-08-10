/* ════════════════════════════════════════════════════════════
   Manager Approval — Mock Data Service
   Abstract interface so Bright Data / live backend can replace
   the mock without changing the UI.
   ════════════════════════════════════════════════════════════ */

import { delay } from "@/lib/api";

/* ── Types ── */

export type RequestType = "inspection" | "ai_analysis" | "procurement" | "defect_report";
export type ApprovalStatus = "pending_review" | "under_review" | "approved" | "rejected" | "changes_requested" | "escalated" | "draft";
export type Priority = "critical" | "high" | "medium" | "low";

export interface ApprovalRequest {
  id: string;
  requestType: RequestType;
  aircraft: string;
  tailNumber: string;
  title: string;
  description: string;
  requestedBy: string;
  priority: Priority;
  status: ApprovalStatus;
  submissionTime: string;
  updatedAt: string;
  aircraftModel: string;
  aircraftAge: string;
  totalFlightHours: number;
  cycles: number;
  inspectionSummary: string;
  aiRootCause: string;
  affectedComponent: string;
  failureProbability: number;
  severity: string;
  estimatedDowntime: string;
  recommendedMaintenance: string;
  costEstimate: number;
  recommendedSupplier: string;
  supplierQuoteRef: string;
  assignedEngineer: string | null;
  managerNotes: string | null;
  rejectionReason: string | null;
  activityLog: ActivityEntry[];
  comments: CommentEntry[];
}

export interface ActivityEntry {
  action: string;
  user: string;
  timestamp: string;
}

export interface CommentEntry {
  id: string;
  author: string;
  role: "manager" | "engineer" | "procurement" | "mechanic";
  text: string;
  timestamp: string;
}

export interface ApprovalStats {
  pendingCount: number;
  criticalCount: number;
  approvedToday: number;
  rejectedToday: number;
  avgProcessingHours: number;
}

export const ROLE_LABELS: Record<CommentEntry["role"], string> = {
  manager: "Manager", engineer: "Engineer", procurement: "Procurement", mechanic: "Mechanic",
};

/* ── Abstract Service Interface ── */

export interface ApprovalService {
  getRequests(): Promise<ApprovalRequest[]>;
  getStats(): Promise<ApprovalStats>;
  approveRequest(id: string, notes?: string): Promise<void>;
  rejectRequest(id: string, reason: string): Promise<void>;
  requestChanges(id: string, notes: string): Promise<void>;
  assignEngineer(id: string, engineer: string): Promise<void>;
  escalateRequest(id: string, reason: string): Promise<void>;
  saveDraft(id: string, notes: string): Promise<void>;
  addComment(id: string, author: string, text: string): Promise<void>;
}

/* ── Helpers ── */

const now = new Date();
function daysAgo(n: number) { return new Date(now.getTime() - n * 86400000).toISOString(); }
function hoursAgo(n: number) { return new Date(now.getTime() - n * 3600000).toISOString(); }

/* ── Mock Data ── */

const MOCK_REQUESTS: ApprovalRequest[] = [
  {
    id: "APR-0047", requestType: "inspection", aircraft: "Boeing 737-800", tailNumber: "N427ET",
    title: "Right Engine Turbine Blade Inspection",
    description: "Boroscopic inspection revealed micro-cracking on 3 turbine blades in HPT stage 1 on CFM56-7B engine #2.",
    requestedBy: "Sarah Chen", priority: "critical", status: "pending_review",
    submissionTime: hoursAgo(2), updatedAt: hoursAgo(1),
    aircraftModel: "Boeing 737-800", aircraftAge: "8.3 years", totalFlightHours: 28450, cycles: 18200,
    inspectionSummary: "Boroscopic inspection of CFM56-7B engine #2 found 3 adjacent turbine blades with micro-cracking (0.3–0.8mm) on the trailing edge of HPT stage 1. Cracks trending upward since last inspection.",
    aiRootCause: "Thermal-mechanical fatigue from repeated takeoff cycles in high-temp operations. Crack propagation rate increased 22% vs fleet average, suggesting possible material degradation.",
    affectedComponent: "HPT Stage 1 Turbine Blade Set (CFM56-7B)",
    failureProbability: 76, severity: "Critical", estimatedDowntime: "5–7 days",
    recommendedMaintenance: "Replace all 3 affected turbine blades per AMM 72-53-01. Full borescope inspection of adjacent stages. HPT module life-limited part audit.",
    costEstimate: 48500, recommendedSupplier: "GE Aerospace — CFM56-7B Blade Kit", supplierQuoteRef: "GE-Q-2024-8842",
    assignedEngineer: null, managerNotes: null, rejectionReason: null,
    activityLog: [
      { action: "Inspection Submitted", user: "Sarah Chen (Mechanic)", timestamp: hoursAgo(2) },
      { action: "AI Analysis Completed", user: "AeroMaintain AI", timestamp: hoursAgo(1.5) },
      { action: "Routed for Manager Review", user: "System", timestamp: hoursAgo(1) },
    ],
    comments: [{ id: "c1", author: "Sarah Chen", role: "mechanic", text: "Flagged thermal imaging showing hotspots on blade #2 and #3. Worth expediting.", timestamp: hoursAgo(1.8) }],
  },
  {
    id: "APR-0046", requestType: "ai_analysis", aircraft: "Airbus A320neo", tailNumber: "N882BA",
    title: "APU Start Cycle Anomaly — Predictive Alert",
    description: "AI model detected abnormal start cycle duration on APS3200 APU — increased from 42s to 68s over 30 days.",
    requestedBy: "Marcus Webb", priority: "high", status: "under_review",
    submissionTime: hoursAgo(5), updatedAt: hoursAgo(2),
    aircraftModel: "Airbus A320neo", aircraftAge: "4.1 years", totalFlightHours: 12100, cycles: 8900,
    inspectionSummary: "APU start cycle degradation trend — increased 62% over 30 days. Vibration harmonics indicate bearing wear on starter motor.",
    aiRootCause: "Probable starter motor bearing degradation. Vibration matches known failure mode for APS3200 units >8,000 cycles (89% confidence). Current draw up 14%.",
    affectedComponent: "APU Starter Motor (APS3200)",
    failureProbability: 68, severity: "Major", estimatedDowntime: "2–3 days",
    recommendedMaintenance: "Replace APU starter motor per AMM 49-11-11. Oil analysis on APU gearbox as precaution.",
    costEstimate: 18200, recommendedSupplier: "Collins Aerospace — APS3200 Starter Kit", supplierQuoteRef: "CA-Q-2024-7713",
    assignedEngineer: "David Okonkwo", managerNotes: "Awaiting oil analysis results.", rejectionReason: null,
    activityLog: [
      { action: "AI Alert Generated", user: "AeroMaintain AI", timestamp: hoursAgo(6) },
      { action: "Inspection Created", user: "Marcus Webb (Mechanic)", timestamp: hoursAgo(5) },
      { action: "Under Review", user: "System", timestamp: hoursAgo(2) },
    ],
    comments: [
      { id: "c2", author: "Marcus Webb", role: "mechanic", text: "Oil sample sent to lab — results in 48h. Vibration data attached.", timestamp: hoursAgo(4.5) },
      { id: "c3", author: "David Okonkwo", role: "engineer", text: "Concur with AI assessment. Bearing wear pattern is textbook. Ready to proceed pending oil results.", timestamp: hoursAgo(3) },
    ],
  },
  {
    id: "APR-0045", requestType: "procurement", aircraft: "Boeing 737-800", tailNumber: "N319CM",
    title: "Landing Gear Seal Kit Procurement — Expedite",
    description: "Procurement request for landing gear seal kit (PN-6621C) after hydraulic fluid seepage on NLG actuator.",
    requestedBy: "James Torres", priority: "high", status: "pending_review",
    submissionTime: hoursAgo(8), updatedAt: hoursAgo(7),
    aircraftModel: "Boeing 737-800", aircraftAge: "12.7 years", totalFlightHours: 42100, cycles: 31500,
    inspectionSummary: "Walk-around revealed hydraulic staining on NLG strut. Fluid loss ~120ml over 5 flights. Seal bypass leakage confirmed.",
    aiRootCause: "Aging seal degradation — seals beyond 10yr/20k-cycle replacement interval (curr. 31,500 cycles). Seepage expected to accelerate 2-3x over next 50 cycles.",
    affectedComponent: "NLG Actuator Seal Kit (PN-6621C)",
    failureProbability: 92, severity: "Major", estimatedDowntime: "3–4 days",
    recommendedMaintenance: "Replace NLG seal kit per AMM 32-21-15. Inspect actuator piston for scoring. Hydraulic system flush.",
    costEstimate: 1850, recommendedSupplier: "Boeing Distribution", supplierQuoteRef: "BD-Q-2024-6651",
    assignedEngineer: null, managerNotes: null, rejectionReason: null,
    activityLog: [
      { action: "Defect Reported", user: "James Torres (Mechanic)", timestamp: hoursAgo(8) },
      { action: "AI Analysis Completed", user: "AeroMaintain AI", timestamp: hoursAgo(7.5) },
      { action: "Procurement Prepared", user: "System", timestamp: hoursAgo(7) },
    ],
    comments: [],
  },
  {
    id: "APR-0044", requestType: "defect_report", aircraft: "Boeing 737-800", tailNumber: "N427ET",
    title: "Cabin Pressure Valve Fault — Intermittent FCU Error",
    description: "Crew reported CABIN ALTITUDE warning during cruise at FL370. Fault code 7221 logged. Recurred on 2 of last 4 flights.",
    requestedBy: "Elena Rossi", priority: "medium", status: "pending_review",
    submissionTime: hoursAgo(12), updatedAt: hoursAgo(10),
    aircraftModel: "Boeing 737-800", aircraftAge: "8.3 years", totalFlightHours: 28450, cycles: 18200,
    inspectionSummary: "Pressure controller (PN-5510F) logged fault 7221 on 2 flights. Self-test passes on ground. Likely intermittent electronics issue.",
    aiRootCause: "Probable cold solder joint or PCB component degradation (86% confidence). Faults with no ground recurrence correlate with thermal cycle fatigue.",
    affectedComponent: "Cabin Pressure Controller FCU (PN-5510F)",
    failureProbability: 54, severity: "Major", estimatedDowntime: "1–2 days",
    recommendedMaintenance: "Replace pressure controller FCU per AMM 21-31-00. Bench test removed unit. Consider ARINC 429 bus monitor for data collection.",
    costEstimate: 3400, recommendedSupplier: "Honeywell Aerospace — PN-5510F", supplierQuoteRef: "HA-Q-2024-5501",
    assignedEngineer: null, managerNotes: null, rejectionReason: null,
    activityLog: [
      { action: "Defect Reported", user: "Elena Rossi (Mechanic)", timestamp: hoursAgo(12) },
      { action: "AI Analysis Completed", user: "AeroMaintain AI", timestamp: hoursAgo(11) },
      { action: "Pending Manager Review", user: "System", timestamp: hoursAgo(10) },
    ],
    comments: [{ id: "c4", author: "Elena Rossi", role: "mechanic", text: "Pulled QAR data — fault only occurs above FL350, suggesting temp sensitivity.", timestamp: hoursAgo(10.5) }],
  },
  {
    id: "APR-0043", requestType: "procurement", aircraft: "Airbus A320neo", tailNumber: "N882BA",
    title: "Bleed Air Valve Replacement Order",
    description: "Scheduled replacement of bleed air valve (PN-22904) before 9,000-cycle limit.",
    requestedBy: "Marcus Webb", priority: "low", status: "approved",
    submissionTime: daysAgo(1), updatedAt: hoursAgo(6),
    aircraftModel: "Airbus A320neo", aircraftAge: "4.1 years", totalFlightHours: 12100, cycles: 8900,
    inspectionSummary: "Scheduled replacement per maintenance plan. No active defect.",
    aiRootCause: "No defect. Scheduled maintenance based on fleet reliability data.",
    affectedComponent: "Bleed Air Valve (PN-22904)",
    failureProbability: 18, severity: "Minor", estimatedDowntime: "4–6 hours",
    recommendedMaintenance: "Replace bleed air valve per AMM 36-11-00. Inspect ducting for heat damage.",
    costEstimate: 3800, recommendedSupplier: "Collins Aerospace — PN-22904", supplierQuoteRef: "CA-Q-2024-2290",
    assignedEngineer: "David Okonkwo", managerNotes: "Go ahead — overnight maintenance window.", rejectionReason: null,
    activityLog: [
      { action: "Maintenance Planned", user: "Marcus Webb", timestamp: daysAgo(2) },
      { action: "Procurement Prepared", user: "System", timestamp: daysAgo(1.5) },
      { action: "Approved", user: "Manager", timestamp: hoursAgo(6) },
    ],
    comments: [],
  },
  {
    id: "APR-0042", requestType: "inspection", aircraft: "Boeing 737-800", tailNumber: "N319CM",
    title: "Fan Blade Boroscopic Inspection — Routine",
    description: "Scheduled 1,000-cycle boroscopic inspection of CFM56-7B engine #1. No anomalies.",
    requestedBy: "James Torres", priority: "low", status: "approved",
    submissionTime: daysAgo(2), updatedAt: daysAgo(1),
    aircraftModel: "Boeing 737-800", aircraftAge: "12.7 years", totalFlightHours: 42100, cycles: 31500,
    inspectionSummary: "Boroscopic inspection per AMM 72-21-00 completed. All blades within limits.",
    aiRootCause: "No anomaly detected.",
    affectedComponent: "CFM56-7B Fan Blades",
    failureProbability: 3, severity: "Low", estimatedDowntime: "3 hours",
    recommendedMaintenance: "No maintenance required.",
    costEstimate: 0, recommendedSupplier: "N/A", supplierQuoteRef: "N/A",
    assignedEngineer: null, managerNotes: "All clear — signed off.", rejectionReason: null,
    activityLog: [
      { action: "Inspection Completed", user: "James Torres", timestamp: daysAgo(2) },
      { action: "Approved", user: "Manager", timestamp: daysAgo(1) },
    ],
    comments: [],
  },
  {
    id: "APR-0041", requestType: "defect_report", aircraft: "Boeing 777-300ER", tailNumber: "N773KL",
    title: "Cabin Light Ballast Fault — Zone 4A Recurrence",
    description: "Third recurrence of cabin light failure in Zone 4A. Ballast replaced twice in 6 months.",
    requestedBy: "Elena Rossi", priority: "medium", status: "changes_requested",
    submissionTime: daysAgo(3), updatedAt: hoursAgo(12),
    aircraftModel: "Boeing 777-300ER", aircraftAge: "6.8 years", totalFlightHours: 22100, cycles: 5400,
    inspectionSummary: "Ballast replaced twice — third failure at 47 cycles. Bench-tested OK. Possible PSU issue.",
    aiRootCause: "Upstream power supply issue — voltage ripple 340mV (threshold 200mV). Probable rectifier diode degradation in Zone 4A PSU (92% confidence).",
    affectedComponent: "Zone 4A Cabin Lighting PSU",
    failureProbability: 82, severity: "Minor", estimatedDowntime: "1 day",
    recommendedMaintenance: "Replace Zone 4A PSU per AMM 33-21-00. Do NOT replace ballast again. Verify ripple voltage.",
    costEstimate: 2800, recommendedSupplier: "Boeing Distribution — Zone 4A PSU", supplierQuoteRef: "BD-Q-2024-3301",
    assignedEngineer: null, managerNotes: "Wiring diagram review requested.", rejectionReason: null,
    activityLog: [
      { action: "Defect Reported", user: "Elena Rossi", timestamp: daysAgo(3) },
      { action: "AI Analysis Completed", user: "AeroMaintain AI", timestamp: daysAgo(2.5) },
      { action: "Changes Requested", user: "Manager", timestamp: hoursAgo(12) },
    ],
    comments: [{ id: "c5", author: "Elena Rossi", role: "mechanic", text: "Wiring diagram review attached — common ground issue in Zone 4A harness.", timestamp: hoursAgo(10) }],
  },
  {
    id: "APR-0040", requestType: "procurement", aircraft: "Airbus A350-900", tailNumber: "N350XA",
    title: "Emergency — Engine #1 Hydraulic Pump Failure",
    description: "AOG — Engine-driven hydraulic pump failed on taxi-out. Aircraft returned to gate.",
    requestedBy: "Marcus Webb", priority: "critical", status: "escalated",
    submissionTime: hoursAgo(6), updatedAt: hoursAgo(3),
    aircraftModel: "Airbus A350-900", aircraftAge: "3.2 years", totalFlightHours: 8900, cycles: 2100,
    inspectionSummary: "EDP failed during taxi — pressure dropped to 800 PSI from 3,000. External leakage at seal. Metal particles in filter.",
    aiRootCause: "Catastrophic seal failure with secondary wear — metal particles indicate internal pump degradation. Possible manufacturing defect.",
    affectedComponent: "Engine #1 EDP (Hydraulic Pump)",
    failureProbability: 99, severity: "Critical", estimatedDowntime: "24–36 hours",
    recommendedMaintenance: "Replace EDP per AMM 29-11-00. Flush hydraulic system. Replace return filter. Oil analysis.",
    costEstimate: 28500, recommendedSupplier: "Parker Aerospace — A350 EDP Kit", supplierQuoteRef: "PA-Q-2024-9950",
    assignedEngineer: "David Okonkwo", managerNotes: "Escalated to VP of Maintenance — AOG approved. Parts expedited.", rejectionReason: null,
    activityLog: [
      { action: "AOG Alert Triggered", user: "Flight Operations", timestamp: hoursAgo(6) },
      { action: "Inspection Completed", user: "Marcus Webb", timestamp: hoursAgo(5.5) },
      { action: "Escalated", user: "Manager", timestamp: hoursAgo(3) },
    ],
    comments: [
      { id: "c6", author: "Marcus Webb", role: "mechanic", text: "Metal particles = internal pump failure. Need full system flush.", timestamp: hoursAgo(5) },
      { id: "c7", author: "David Okonkwo", role: "engineer", text: "Secured EDP from LAX pool. ETA 4h. Flush kit on order.", timestamp: hoursAgo(4) },
    ],
  },
  {
    id: "APR-0039", requestType: "ai_analysis", aircraft: "Boeing 787-9", tailNumber: "N787DH",
    title: "GEN-1 Generator De-rating — Predictive Alert",
    description: "AI detected 7% output reduction on GEN-1 over 14 days toward threshold.",
    requestedBy: "James Torres", priority: "high", status: "pending_review",
    submissionTime: hoursAgo(3), updatedAt: hoursAgo(1),
    aircraftModel: "Boeing 787-9", aircraftAge: "5.5 years", totalFlightHours: 16800, cycles: 4100,
    inspectionSummary: "VFG #1 at 93% capacity vs 98% fleet avg. Trend suggests threshold breach (85%) in ~30 cycles.",
    aiRootCause: "Probable exciter diode bridge degradation (84% confidence). Harmonic distortion pattern matches known VFG failure mode.",
    affectedComponent: "VFG #1 Generator (Variable Frequency)",
    failureProbability: 71, severity: "Major", estimatedDowntime: "2–3 days",
    recommendedMaintenance: "Replace VFG #1 per AMM 24-21-00. Consider proactive replacement at next C-check (18 cycles).",
    costEstimate: 32000, recommendedSupplier: "GE Aerospace — VFG 787 Unit", supplierQuoteRef: "GE-Q-2024-8883",
    assignedEngineer: null, managerNotes: null, rejectionReason: null,
    activityLog: [
      { action: "AI Alert Generated", user: "AeroMaintain AI", timestamp: hoursAgo(4) },
      { action: "Inspection Created", user: "James Torres", timestamp: hoursAgo(3) },
      { action: "Pending Manager Review", user: "System", timestamp: hoursAgo(1) },
    ],
    comments: [],
  },
  {
    id: "APR-0038", requestType: "inspection", aircraft: "Boeing 737-800", tailNumber: "N319CM",
    title: "Wing Root Corrosion — Repeat Inspection",
    description: "Second occurrence of surface corrosion on left wing root fairing. Previous treatment partially effective.",
    requestedBy: "Elena Rossi", priority: "medium", status: "rejected",
    submissionTime: daysAgo(5), updatedAt: daysAgo(3),
    aircraftModel: "Boeing 737-800", aircraftAge: "12.7 years", totalFlightHours: 42100, cycles: 31500,
    inspectionSummary: "Grade 2 surface corrosion on left wing root fairing (~12cm×5cm). Previous sealant adhesion incomplete.",
    aiRootCause: "Previous treatment didn't fully neutralize corrosion cell. Incompatible sealant (non-BMS 5-142). Galvanic coupling re-established via pinhole defects.",
    affectedComponent: "Left Wing Root Fairing (Stringer 4–6)",
    failureProbability: 45, severity: "Major", estimatedDowntime: "2–3 days",
    recommendedMaintenance: "Remove corrosion per SRM 51-10-00. Apply BMS 5-142 inhibitor. Replace fasteners. Re-seal.",
    costEstimate: 4800, recommendedSupplier: "Honeywell Aerospace — Corrosion Kit", supplierQuoteRef: "HA-Q-2024-5120",
    assignedEngineer: null, managerNotes: null,
    rejectionReason: "Insufficient root cause data. Need full corrosion mapping and metallurgical analysis before proceeding.",
    activityLog: [
      { action: "Inspection Completed", user: "Elena Rossi", timestamp: daysAgo(5) },
      { action: "AI Analysis Completed", user: "AeroMaintain AI", timestamp: daysAgo(4.5) },
      { action: "Rejected", user: "Manager", timestamp: daysAgo(3) },
    ],
    comments: [{ id: "c8", author: "Elena Rossi", role: "mechanic", text: "Agreed — will coordinate NDT with metallurgy lab for full corrosion map.", timestamp: daysAgo(3) }],
  },
];

/* ── Mock Service ── */

class MockApprovalService implements ApprovalService {
  private requests = MOCK_REQUESTS.map((r) => ({ ...r, activityLog: [...r.activityLog], comments: [...r.comments] }));

  private addActivity(id: string, action: string, user: string) {
    const r = this.requests.find((x) => x.id === id);
    if (r) { r.activityLog.unshift({ action, user, timestamp: new Date().toISOString() }); r.updatedAt = new Date().toISOString(); }
  }

  async getRequests() { await delay(400); return this.requests.map((r) => ({ ...r, activityLog: [...r.activityLog], comments: [...r.comments] })); }

  async getStats(): Promise<ApprovalStats> {
    await delay(200);
    const today = new Date().toDateString();
    const pending = this.requests.filter((r) => r.status === "pending_review" || r.status === "under_review");
    return {
      pendingCount: pending.length,
      criticalCount: pending.filter((r) => r.priority === "critical").length,
      approvedToday: this.requests.filter((r) => r.status === "approved" && new Date(r.updatedAt).toDateString() === today).length,
      rejectedToday: this.requests.filter((r) => r.status === "rejected" && new Date(r.updatedAt).toDateString() === today).length,
      avgProcessingHours: 8.4,
    };
  }

  async approveRequest(id: string, notes?: string) { await delay(500); const r = this.requests.find((x) => x.id === id); if (!r) return; r.status = "approved"; r.managerNotes = notes ?? r.managerNotes; this.addActivity(id, "Approved", "Manager"); }
  async rejectRequest(id: string, reason: string) { await delay(500); const r = this.requests.find((x) => x.id === id); if (!r) return; r.status = "rejected"; r.rejectionReason = reason; this.addActivity(id, `Rejected — ${reason}`, "Manager"); }
  async requestChanges(id: string, notes: string) { await delay(400); const r = this.requests.find((x) => x.id === id); if (!r) return; r.status = "changes_requested"; r.managerNotes = notes; this.addActivity(id, `Changes Requested — ${notes}`, "Manager"); }
  async assignEngineer(id: string, engineer: string) { await delay(300); const r = this.requests.find((x) => x.id === id); if (!r) return; r.assignedEngineer = engineer; this.addActivity(id, `Assigned to ${engineer}`, "Manager"); }
  async escalateRequest(id: string, reason: string) { await delay(400); const r = this.requests.find((x) => x.id === id); if (!r) return; r.status = "escalated"; this.addActivity(id, `Escalated — ${reason}`, "Manager"); }
  async saveDraft(_id: string, notes: string) { await delay(200); const r = this.requests.find((x) => x.id === _id); if (!r) return; r.managerNotes = notes; this.addActivity(_id, "Draft saved", "Manager"); }
  async addComment(id: string, author: string, text: string) { await delay(300); const r = this.requests.find((x) => x.id === id); if (!r) return; r.comments.push({ id: `c${Date.now()}`, author, role: "manager", text, timestamp: new Date().toISOString() }); this.addActivity(id, `Comment added by ${author}`, author); }
}

export const approvalService: ApprovalService = new MockApprovalService();

/* ── Convenience ── */

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  inspection: "Inspection", ai_analysis: "AI Analysis", procurement: "Procurement", defect_report: "Defect Report",
};
export const STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending_review: "Pending Review", under_review: "Under Review", approved: "Approved", rejected: "Rejected",
  changes_requested: "Changes Requested", escalated: "Escalated", draft: "Draft",
};
export const PRIORITY_LABELS: Record<Priority, string> = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
}