/* ════════════════════════════════════════════════════════════
   Notifications — Types, Mock Data & Service
   ════════════════════════════════════════════════════════════ */

import { delay } from "@/lib/api";

/* ── Types ── */

export type NotificationCategory =
  | "inspection"
  | "ai_analysis"
  | "procurement"
  | "approval"
  | "reports"
  | "system";

export type NotificationPriority = "critical" | "warning" | "info" | "success";

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
  aircraft?: string;
  tailNumber?: string;
  affectedComponent?: string;
  assignedUser?: string;
  suggestedAction?: string;
  relatedModule?: string;
  actionLabel?: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  systemAlerts: boolean;
  criticalAlerts: boolean;
  aiAlerts: boolean;
  maintenanceAlerts: boolean;
  procurementAlerts: boolean;
}

export interface NotificationService {
  getNotifications(): Promise<NotificationItem[]>;
  markRead(id: string): Promise<void>;
  markUnread(id: string): Promise<void>;
  markAllRead(): Promise<void>;
  archive(id: string): Promise<void>;
  delete(id: string): Promise<void>;
  getPreferences(): Promise<NotificationPreferences>;
  updatePreferences(prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences>;
}

/* ── Labels ── */

export const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  inspection: "Inspection", ai_analysis: "AI Analysis", procurement: "Procurement",
  approval: "Approval", reports: "Reports", system: "System",
};

export const PRIORITY_LABELS: Record<NotificationPriority, string> = {
  critical: "Critical", warning: "Warning", info: "Information", success: "Success",
};

/* ── Helpers ── */

const _now = Date.now();
function ago(ms: number) { return new Date(_now - ms).toISOString(); }
const m = (n: number) => n * 60_000;
const h = (n: number) => n * 3_600_000;
const d = (n: number) => n * 86_400_000;

/* ── 48 Mock Notifications ── */

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  // ── Critical ──
  { id: "N-001", category: "inspection", priority: "critical",
    title: "Hydraulic Leak Detected on N839UA",
    description: "Significant hydraulic fluid loss detected on NLG actuator. Fluid level dropped 40% over 2 flights. Immediate grounding recommended.",
    timestamp: ago(m(18)), read: false, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N839UA", affectedComponent: "NLG Actuator Seal",
    assignedUser: "Sarah Chen", suggestedAction: "Inspect NLG actuator seals and replenish hydraulic fluid before next flight.",
    relatedModule: "/aircraft/N839UA", actionLabel: "View Aircraft" },
  { id: "N-002", category: "ai_analysis", priority: "critical",
    title: "APU Failure Predicted — N882BA",
    description: "AI model predicts APU starter motor failure within 50 flight hours. Failure probability 67%. Immediate action required.",
    timestamp: ago(h(2)), read: false, archived: false,
    aircraft: "Airbus A320neo", tailNumber: "N882BA", affectedComponent: "APU Starter Motor (APS3200)",
    assignedUser: "Marcus Webb", suggestedAction: "Schedule APU starter motor replacement within next 3 days.",
    relatedModule: "/aircraft/N882BA", actionLabel: "Review Analysis" },
  { id: "N-003", category: "procurement", priority: "critical",
    title: "AOG — Engine #1 Hydraulic Pump Failed",
    description: "A350-900 (N350XA) returned to gate after EDP failure during taxi. Metal particles in filter. Aircraft grounded AOG.",
    timestamp: ago(h(5)), read: false, archived: false,
    aircraft: "Airbus A350-900", tailNumber: "N350XA", affectedComponent: "Engine #1 EDP",
    assignedUser: "David Okonkwo", suggestedAction: "Expedite EDP replacement. Full hydraulic system flush required.",
    relatedModule: "/procurement", actionLabel: "Open Procurement" },
  { id: "N-004", category: "system", priority: "critical",
    title: "Fleet Health Dropped Below 85%",
    description: "Fleet-wide health score declined to 82.7%. Three aircraft in 'critical' status. Escalated to VP Maintenance.",
    timestamp: ago(h(10)), read: false, archived: false,
    suggestedAction: "Review fleet health dashboard. Prioritize maintenance scheduling for affected aircraft.",
    relatedModule: "/dashboard", actionLabel: "Open Dashboard" },
  { id: "N-005", category: "inspection", priority: "critical",
    title: "Turbine Blade Cracking — N427ET",
    description: "Boroscopic inspection found micro-cracking on 3 HPT stage 1 blades. CFM56-7B engine #2. Failure probability 76%.",
    timestamp: ago(h(3)), read: true, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N427ET", affectedComponent: "HPT Stage 1 Blades",
    assignedUser: "Sarah Chen", suggestedAction: "Approve blade replacement under AMM 72-53-01.",
    relatedModule: "/approval", actionLabel: "Open Approval" },
  { id: "N-036", category: "procurement", priority: "critical",
    title: "Critical Part Backorder — PN-6621C",
    description: "NLG seal kit PN-6621C on backorder from Boeing Distribution. Alternate supplier ETA: 7 days. AOG risk for N319CM.",
    timestamp: ago(h(8)), read: false, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N319CM", affectedComponent: "NLG Actuator Seal Kit",
    assignedUser: "James Torres", suggestedAction: "Source alternate supplier or negotiate expedited shipping.",
    relatedModule: "/procurement", actionLabel: "Find Alternative" },

  // ── Warning ──
  { id: "N-006", category: "approval", priority: "warning",
    title: "Manager Approval Required — APR-0045",
    description: "Landing gear seal kit procurement (PN-6621C) requires your approval. NLG hydraulic seepage — expedite recommended.",
    timestamp: ago(h(7)), read: false, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N319CM", affectedComponent: "NLG Actuator Seal Kit",
    suggestedAction: "Review procurement details and approve for overnight maintenance window.",
    relatedModule: "/approval", actionLabel: "Review" },
  { id: "N-007", category: "ai_analysis", priority: "warning",
    title: "GEN-1 Generator De-rating — N787DH",
    description: "VFG #1 output dropped to 93%. Trend suggests threshold breach in ~30 cycles. AI recommends proactive replacement.",
    timestamp: ago(h(4)), read: false, archived: false,
    aircraft: "Boeing 787-9", tailNumber: "N787DH", affectedComponent: "VFG #1 Generator",
    suggestedAction: "Plan VFG #1 replacement at next C-check (18 cycles away).",
    relatedModule: "/analysis", actionLabel: "View Analysis" },
  { id: "N-008", category: "inspection", priority: "warning",
    title: "Wing Root Corrosion — Second Occurrence",
    description: "Surface corrosion on left wing root fairing (N319CM) recurred after previous treatment. Incompatible sealant used.",
    timestamp: ago(d(3)), read: false, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N319CM", affectedComponent: "Left Wing Root Fairing",
    suggestedAction: "Full corrosion mapping and metallurgical analysis required before re-treatment.",
    relatedModule: "/aircraft/N319CM", actionLabel: "View Details" },
  { id: "N-009", category: "procurement", priority: "warning",
    title: "Supplier Quote Expiring — PO-245",
    description: "GE Aerospace quote #8842 for CFM56-7B blade kit expires in 48 hours. $48,500 — 3 units in stock.",
    timestamp: ago(h(12)), read: true, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N427ET",
    suggestedAction: "Approve purchase order before quote expires to avoid price increase.",
    relatedModule: "/procurement", actionLabel: "View PO" },
  { id: "N-010", category: "reports", priority: "warning",
    title: "Monthly Compliance Report Due",
    description: "Monthly maintenance compliance report for October is due within 72 hours. 4 items still pending sign-off.",
    timestamp: ago(d(1)), read: false, archived: false,
    suggestedAction: "Complete pending sign-offs and generate compliance report.",
    relatedModule: "/reports", actionLabel: "Open Reports" },
  { id: "N-011", category: "system", priority: "warning",
    title: "Bright Data API Quota at 85%",
    description: "Supplier pricing API usage approaching monthly limit. Current usage: 8,512 / 10,000 requests.",
    timestamp: ago(h(8)), read: false, archived: false,
    suggestedAction: "Review API usage and consider upgrading plan if trend continues.",
    relatedModule: "/settings", actionLabel: "Settings" },
  { id: "N-012", category: "inspection", priority: "warning",
    title: "Cabin Pressure Valve Fault — Recurring",
    description: "CABIN ALTITUDE warning recurred on 2 of 4 flights. Fault code 7221 — intermittent FCU issue on N427ET.",
    timestamp: ago(h(6)), read: true, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N427ET", affectedComponent: "Cabin Pressure Controller FCU",
    suggestedAction: "Replace pressure controller FCU per AMM 21-31-00.",
    relatedModule: "/aircraft/N427ET", actionLabel: "View Details" },
  { id: "N-037", category: "inspection", priority: "warning",
    title: "N350XA — Post-Flight Inspection Required",
    description: "Hard landing reported on A350-900 flight LAX-SFO. Maintenance inspection required per AMM 05-51-00 before next flight.",
    timestamp: ago(h(4)), read: false, archived: false,
    aircraft: "Airbus A350-900", tailNumber: "N350XA", assignedUser: "Marcus Webb",
    suggestedAction: "Schedule hard landing inspection and download flight data.",
    relatedModule: "/inspection", actionLabel: "Create Inspection" },
  { id: "N-043", category: "system", priority: "warning",
    title: "Storage Quota at 80%",
    description: "Inspection image and document storage at 80% capacity (1.6 TB / 2 TB). Consider archiving completed inspections.",
    timestamp: ago(d(3)), read: false, archived: false,
    relatedModule: "/settings", actionLabel: "Manage Storage" },

  // ── Info ──
  { id: "N-013", category: "ai_analysis", priority: "info",
    title: "AI Analysis Completed — N882BA",
    description: "AeroMaintain AI completed root cause analysis for APU start cycle anomaly. Starter motor bearing degradation identified (89% confidence).",
    timestamp: ago(h(3)), read: false, archived: false,
    aircraft: "Airbus A320neo", tailNumber: "N882BA", affectedComponent: "APU Starter Motor",
    assignedUser: "Marcus Webb", suggestedAction: "Review AI findings and determine maintenance priority.",
    relatedModule: "/analysis", actionLabel: "View Report" },
  { id: "N-014", category: "inspection", priority: "info",
    title: "Inspection INS-0049 Submitted",
    description: "Routine boroscopic inspection of CFM56-7B engine #1 completed. No anomalies detected. All blades within limits.",
    timestamp: ago(h(6)), read: false, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N319CM", assignedUser: "James Torres",
    suggestedAction: "Review and sign off inspection report.",
    relatedModule: "/inspection", actionLabel: "Review" },
  { id: "N-015", category: "procurement", priority: "info",
    title: "New Supplier Match Found — SkyParts Ltd",
    description: "SkyParts Ltd added to your approved supplier catalog. FAA/EASA certified. Competitive pricing on CFM56-7B components.",
    timestamp: ago(d(1)), read: false, archived: false,
    suggestedAction: "Review SkyParts Ltd catalog and pricing for potential cost savings.",
    relatedModule: "/procurement", actionLabel: "View Supplier" },
  { id: "N-016", category: "approval", priority: "info",
    title: "APR-0043 Auto-Approved",
    description: "Bleed air valve replacement PO auto-approved. Collins Aerospace PN-22904 — $3,800. Overnight maintenance window.",
    timestamp: ago(h(6)), read: false, archived: false,
    aircraft: "Airbus A320neo", tailNumber: "N882BA", affectedComponent: "Bleed Air Valve",
    assignedUser: "David Okonkwo", relatedModule: "/approval", actionLabel: "View" },
  { id: "N-017", category: "reports", priority: "info",
    title: "Weekly Maintenance Summary Available",
    description: "Weekly summary generated: 12 inspections completed, 4 AOG events, 3 POs approved. Average downtime 4.2 hours.",
    timestamp: ago(h(2)), read: true, archived: false,
    relatedModule: "/reports", actionLabel: "View Summary" },
  { id: "N-018", category: "system", priority: "info",
    title: "Database Backup Completed",
    description: "Automated daily backup of maintenance records completed successfully. Size: 2.4 GB. Duration: 14 minutes.",
    timestamp: ago(h(1)), read: false, archived: false },
  { id: "N-019", category: "procurement", priority: "info",
    title: "Parts Delivery — LAX Warehouse",
    description: "CFM56-7B fan blade set delivered to LAX warehouse. QA inspection pending. Scheduled for N427ET installation.",
    timestamp: ago(h(8)), read: false, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N427ET", relatedModule: "/procurement", actionLabel: "Track Shipment" },
  { id: "N-020", category: "inspection", priority: "info",
    title: "Borescope Inspection Scheduled — N773KL",
    description: "Routine borescope inspection for B777-300ER engine #1 scheduled for tomorrow 08:00. Estimated duration: 3h.",
    timestamp: ago(h(4)), read: false, archived: false,
    aircraft: "Boeing 777-300ER", tailNumber: "N773KL", assignedUser: "Elena Rossi",
    relatedModule: "/inspection", actionLabel: "View Schedule" },
  { id: "N-021", category: "ai_analysis", priority: "info",
    title: "Predictive Model Updated — Fleet v2.4",
    description: "AI prediction model updated with 1,200 new data points. Accuracy improved by 3.2%. New failure mode patterns detected.",
    timestamp: ago(d(2)), read: true, archived: false,
    relatedModule: "/analysis", actionLabel: "See What's New" },
  { id: "N-022", category: "system", priority: "info",
    title: "AeroMaintain v3.1.2 Deployed",
    description: "New features: enhanced workflow visualization, improved comment threading, and performance optimizations.",
    timestamp: ago(d(3)), read: false, archived: false,
    relatedModule: "/settings", actionLabel: "Release Notes" },
  { id: "N-023", category: "approval", priority: "info",
    title: "Engineer Assigned — APR-0046",
    description: "David Okonkwo assigned to APU start cycle investigation on N882BA. Awaiting oil analysis results.",
    timestamp: ago(h(2)), read: false, archived: false,
    aircraft: "Airbus A320neo", tailNumber: "N882BA", assignedUser: "David Okonkwo",
    relatedModule: "/approval", actionLabel: "View Request" },
  { id: "N-024", category: "inspection", priority: "info",
    title: "NDT Scan Results Uploaded",
    description: "Ultrasonic NDT scan results for N319CM wing root corrosion area uploaded by Elena Rossi.",
    timestamp: ago(h(9)), read: true, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N319CM", assignedUser: "Elena Rossi",
    relatedModule: "/aircraft/N319CM", actionLabel: "View Scan" },
  { id: "N-025", category: "system", priority: "info",
    title: "User Role Updated",
    description: "Marcus Webb promoted to Senior Mechanic. Additional permissions granted for inspection sign-off.",
    timestamp: ago(d(4)), read: false, archived: false,
    relatedModule: "/settings", actionLabel: "View Users" },
  { id: "N-038", category: "system", priority: "info",
    title: "Regulatory Alert: AD-2024-088",
    description: "New Airworthiness Directive affecting CFM56-7B engines. Compliance deadline: 90 days. 4 aircraft affected.",
    timestamp: ago(d(1)), read: false, archived: false,
    suggestedAction: "Review AD and plan compliance for affected aircraft.",
    relatedModule: "/reports", actionLabel: "View AD" },
  { id: "N-039", category: "procurement", priority: "info",
    title: "Bulk Order Discount Available",
    description: "GE Aerospace offering 12% discount on orders of 5+ CFM56-7B blade kits. Current fleet demand: 3 units needed this quarter.",
    timestamp: ago(h(12)), read: false, archived: false,
    suggestedAction: "Evaluate bulk purchase vs projected maintenance needs.",
    relatedModule: "/procurement", actionLabel: "View Offer" },
  { id: "N-040", category: "ai_analysis", priority: "info",
    title: "New AI Model Available — v3.0",
    description: "Updated prediction model with enhanced vibration analysis and improved false positive reduction. Accuracy: 94.7%.",
    timestamp: ago(d(1)), read: false, archived: false,
    relatedModule: "/analysis", actionLabel: "Try Now" },
  { id: "N-042", category: "inspection", priority: "info",
    title: "Mechanic Certification Renewal Reminder",
    description: "3 mechanic certifications expiring within 30 days. Renewal training scheduled. Review and confirm attendance.",
    timestamp: ago(d(2)), read: false, archived: false,
    relatedModule: "/settings", actionLabel: "Review" },

  // ── Success ──
  { id: "N-026", category: "approval", priority: "success",
    title: "Manager Approved APR-0047",
    description: "Turbine blade replacement approved for N427ET. GE Aerospace blade kit ordered. Scheduled for overnight maintenance.",
    timestamp: ago(h(1)), read: false, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N427ET", assignedUser: "Sarah Chen",
    relatedModule: "/approval", actionLabel: "View" },
  { id: "N-027", category: "inspection", priority: "success",
    title: "Inspection Completed — No Defects",
    description: "Fan blade boroscopic inspection on N319CM completed successfully. All 28 blades within wear limits.",
    timestamp: ago(h(5)), read: false, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N319CM", assignedUser: "James Torres",
    relatedModule: "/inspection", actionLabel: "View Report" },
  { id: "N-028", category: "procurement", priority: "success",
    title: "Purchase Order #PO-245 Approved",
    description: "CFM56-7B blade kit ($48,500) approved. Expected delivery: 3 days. GE Aerospace confirmed stock available.",
    timestamp: ago(h(4)), read: false, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N427ET",
    relatedModule: "/procurement", actionLabel: "Track Order" },
  { id: "N-029", category: "reports", priority: "success",
    title: "Q3 Maintenance Report Generated",
    description: "Quarterly report compiled. 98.3% fleet availability. 12% reduction in unscheduled maintenance. 0 safety incidents.",
    timestamp: ago(d(3)), read: true, archived: false,
    relatedModule: "/reports", actionLabel: "Download Report" },
  { id: "N-030", category: "inspection", priority: "success",
    title: "N882BA Returned to Service",
    description: "APU starter motor replacement completed. Ground test passed. Aircraft returned to active service at 14:30.",
    timestamp: ago(h(2)), read: false, archived: false,
    aircraft: "Airbus A320neo", tailNumber: "N882BA", affectedComponent: "APU Starter Motor",
    assignedUser: "David Okonkwo", relatedModule: "/aircraft/N882BA", actionLabel: "View Aircraft" },
  { id: "N-031", category: "system", priority: "success",
    title: "Fleet Health Restored to 92%",
    description: "Fleet health score recovered from 82.7% to 92.1%. All critical aircraft returned to operational status.",
    timestamp: ago(h(6)), read: false, archived: false,
    relatedModule: "/dashboard", actionLabel: "View Dashboard" },
  { id: "N-032", category: "procurement", priority: "success",
    title: "Supplier Rating Improved",
    description: "Collins Aerospace rating increased from 4.2 to 4.5 based on on-time delivery performance over last 30 days.",
    timestamp: ago(d(2)), read: false, archived: false,
    relatedModule: "/procurement", actionLabel: "View Suppliers" },
  { id: "N-033", category: "approval", priority: "success",
    title: "Changes Accepted — APR-0041",
    description: "Elena Rossi accepted requested changes for cabin light PSU replacement. Wiring diagram review completed.",
    timestamp: ago(h(8)), read: true, archived: false,
    aircraft: "Boeing 777-300ER", tailNumber: "N773KL",
    relatedModule: "/approval", actionLabel: "Review Update" },
  { id: "N-034", category: "ai_analysis", priority: "success",
    title: "AI Alert False Positive Confirmed",
    description: "GEN-1 de-rating on N787DH confirmed as sensor calibration drift, not actual generator degradation. Model adjusted.",
    timestamp: ago(d(1)), read: false, archived: false,
    aircraft: "Boeing 787-9", tailNumber: "N787DH",
    relatedModule: "/analysis", actionLabel: "View Details" },
  { id: "N-035", category: "reports", priority: "success",
    title: "FAA Audit Passed",
    description: "Random FAA spot audit of maintenance records completed with zero findings. All documentation compliant.",
    timestamp: ago(d(5)), read: false, archived: false,
    relatedModule: "/reports", actionLabel: "View Audit Log" },
  { id: "N-041", category: "approval", priority: "success",
    title: "APR-0045 Approved — Expedited",
    description: "NLG seal kit procurement expedited and approved. Overnight shipping from LAX parts depot. ETA: 06:00.",
    timestamp: ago(h(2)), read: true, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N319CM",
    relatedModule: "/approval", actionLabel: "Track Delivery" },
  { id: "N-044", category: "reports", priority: "success",
    title: "Fuel Efficiency Report — October",
    description: "Fleet fuel efficiency improved 2.3% month-over-month. Estimated savings: $127,000 annually at current fuel prices.",
    timestamp: ago(d(4)), read: false, archived: false,
    relatedModule: "/reports", actionLabel: "View Report" },

  // ── Final entries ──
  { id: "N-045", category: "ai_analysis", priority: "info",
    title: "Vibration Analysis — N839UA Engine #1",
    description: "AI vibration analysis completed. Engine #1 vibration within normal limits. No maintenance action required.",
    timestamp: ago(h(7)), read: false, archived: false,
    aircraft: "Boeing 737-800", tailNumber: "N839UA",
    relatedModule: "/analysis", actionLabel: "View Data" },
  { id: "N-046", category: "system", priority: "info",
    title: "Supabase Realtime Connected",
    description: "Real-time data sync established. All modules receiving live updates. Connection latency: 24ms.",
    timestamp: ago(m(30)), read: false, archived: false },
  { id: "N-047", category: "procurement", priority: "success",
    title: "Inventory Reorder Complete",
    description: "Automated reorder of 24 consumable part lines completed. Total order value: $15,240. Expected delivery: 5 days.",
    timestamp: ago(h(6)), read: false, archived: false,
    relatedModule: "/procurement", actionLabel: "Review Order" },
  { id: "N-048", category: "approval", priority: "warning",
    title: "APR-0039 — Pending Manager Review",
    description: "VFG #1 generator replacement on N787DH pending your review. AI recommends proactive replacement at next C-check.",
    timestamp: ago(h(1)), read: false, archived: false,
    aircraft: "Boeing 787-9", tailNumber: "N787DH", affectedComponent: "VFG #1 Generator",
    suggestedAction: "Review AI analysis and approve or schedule for next C-check.",
    relatedModule: "/approval", actionLabel: "Review Now" },
];

/* ── Mock Service ── */

class MockNotificationService implements NotificationService {
  private items = MOCK_NOTIFICATIONS.map((n) => ({ ...n }));

  async getNotifications(): Promise<NotificationItem[]> {
    await delay(300);
    return this.items.filter((n) => !n.archived).map((n) => ({ ...n }));
  }

  async markRead(id: string) { await delay(100); const n = this.items.find((x) => x.id === id); if (n) n.read = true; }
  async markUnread(id: string) { await delay(100); const n = this.items.find((x) => x.id === id); if (n) n.read = false; }
  async markAllRead() { await delay(300); this.items.forEach((n) => { n.read = true; }); }
  async archive(id: string) { await delay(200); const n = this.items.find((x) => x.id === id); if (n) n.archived = true; }
  async delete(id: string) { await delay(200); const idx = this.items.findIndex((x) => x.id === id); if (idx !== -1) this.items.splice(idx, 1); }

  async getPreferences(): Promise<NotificationPreferences> {
    await delay(150);
    return { email: true, sms: false, push: true, systemAlerts: true, criticalAlerts: true, aiAlerts: true, maintenanceAlerts: true, procurementAlerts: true };
  }

  async updatePreferences(prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    await delay(300);
    const current: NotificationPreferences = { email: true, sms: false, push: true, systemAlerts: true, criticalAlerts: true, aiAlerts: true, maintenanceAlerts: true, procurementAlerts: true };
    return { ...current, ...prefs };
  }
}

export const notificationService: NotificationService = new MockNotificationService();