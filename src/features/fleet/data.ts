/* ════════════════════════════════════════════════════════════
   Fleet Management — Mock Data Service
   Central fleet overview for maintenance managers.
   No backend integration yet — swap for real services later.
   ════════════════════════════════════════════════════════════ */

import { delay } from "@/lib/api";

export type FleetStatus = "active" | "maintenance" | "grounded";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type HealthBucket = "healthy" | "warning" | "critical";

export interface FleetAircraft {
  id: string;
  tailNumber: string;
  shortModel: string; // e.g. "B737-800"
  model: string; // e.g. "Boeing 737-800"
  manufacturer: "Boeing" | "Airbus";
  healthScore: number;
  status: FleetStatus;
  location: string;
  flightHours: number;
  lastInspection: string; // ISO date
  nextInspection: string; // ISO date
  aiRiskLevel: RiskLevel;
}

/* ── Date helpers (ISO, relative to now so mock always looks live) ── */

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

const daysAgo = (days: number) => daysFromNow(-days);

/* ── Mock fleet (20 aircraft across Boeing + Airbus families) ── */

const FLEET: FleetAircraft[] = [
  { id: "ac-1001", tailNumber: "N801AM", shortModel: "B737-800", model: "Boeing 737-800", manufacturer: "Boeing", healthScore: 96, status: "active", location: "JFK", flightHours: 12450, lastInspection: daysAgo(6), nextInspection: daysFromNow(21), aiRiskLevel: "low" },
  { id: "ac-1002", tailNumber: "N802AM", shortModel: "A320neo", model: "Airbus A320neo", manufacturer: "Airbus", healthScore: 91, status: "active", location: "LAX", flightHours: 8730, lastInspection: daysAgo(12), nextInspection: daysFromNow(30), aiRiskLevel: "low" },
  { id: "ac-1003", tailNumber: "N803AM", shortModel: "A330-300", model: "Airbus A330-300", manufacturer: "Airbus", healthScore: 84, status: "active", location: "DFW", flightHours: 22310, lastInspection: daysAgo(9), nextInspection: daysFromNow(18), aiRiskLevel: "low" },
  { id: "ac-1004", tailNumber: "N804AM", shortModel: "B787-9", model: "Boeing 787-9", manufacturer: "Boeing", healthScore: 73, status: "active", location: "LHR", flightHours: 18120, lastInspection: daysAgo(15), nextInspection: daysFromNow(12), aiRiskLevel: "medium" },
  { id: "ac-1005", tailNumber: "N805AM", shortModel: "B737-800", model: "Boeing 737-800", manufacturer: "Boeing", healthScore: 55, status: "grounded", location: "ATL", flightHours: 32440, lastInspection: daysAgo(28), nextInspection: daysFromNow(5), aiRiskLevel: "critical" },
  { id: "ac-1006", tailNumber: "N806AM", shortModel: "A320-200", model: "Airbus A320-200", manufacturer: "Airbus", healthScore: 92, status: "active", location: "ORD", flightHours: 9970, lastInspection: daysAgo(3), nextInspection: daysFromNow(45), aiRiskLevel: "low" },
  { id: "ac-1007", tailNumber: "N807AM", shortModel: "B777-300ER", model: "Boeing 777-300ER", manufacturer: "Boeing", healthScore: 78, status: "maintenance", location: "DXB", flightHours: 26890, lastInspection: daysAgo(20), nextInspection: daysFromNow(9), aiRiskLevel: "medium" },
  { id: "ac-1008", tailNumber: "N808AM", shortModel: "A350-900", model: "Airbus A350-900", manufacturer: "Airbus", healthScore: 88, status: "active", location: "MUC", flightHours: 15230, lastInspection: daysAgo(7), nextInspection: daysFromNow(26), aiRiskLevel: "low" },
  { id: "ac-1009", tailNumber: "N809AM", shortModel: "B737-800", model: "Boeing 737-800", manufacturer: "Boeing", healthScore: 45, status: "grounded", location: "MIA", flightHours: 41200, lastInspection: daysAgo(31), nextInspection: daysFromNow(2), aiRiskLevel: "critical" },
  { id: "ac-1010", tailNumber: "N810AM", shortModel: "A320neo", model: "Airbus A320neo", manufacturer: "Airbus", healthScore: 95, status: "active", location: "SEA", flightHours: 7640, lastInspection: daysAgo(2), nextInspection: daysFromNow(34), aiRiskLevel: "low" },
  { id: "ac-1011", tailNumber: "N811AM", shortModel: "B787-9", model: "Boeing 787-9", manufacturer: "Boeing", healthScore: 82, status: "active", location: "DEN", flightHours: 20980, lastInspection: daysAgo(11), nextInspection: daysFromNow(16), aiRiskLevel: "low" },
  { id: "ac-1012", tailNumber: "N812AM", shortModel: "A321-200", model: "Airbus A321-200", manufacturer: "Airbus", healthScore: 63, status: "active", location: "IAH", flightHours: 28760, lastInspection: daysAgo(18), nextInspection: daysFromNow(8), aiRiskLevel: "medium" },
  { id: "ac-1013", tailNumber: "N813AM", shortModel: "B737-800", model: "Boeing 737-800", manufacturer: "Boeing", healthScore: 89, status: "maintenance", location: "LAX", flightHours: 13210, lastInspection: daysAgo(5), nextInspection: daysFromNow(14), aiRiskLevel: "medium" },
  { id: "ac-1014", tailNumber: "N814AM", shortModel: "A330-300", model: "Airbus A330-300", manufacturer: "Airbus", healthScore: 51, status: "active", location: "JFK", flightHours: 35600, lastInspection: daysAgo(25), nextInspection: daysFromNow(4), aiRiskLevel: "high" },
  { id: "ac-1015", tailNumber: "N815AM", shortModel: "B777-300ER", model: "Boeing 777-300ER", manufacturer: "Boeing", healthScore: 76, status: "active", location: "ORD", flightHours: 24110, lastInspection: daysAgo(13), nextInspection: daysFromNow(19), aiRiskLevel: "medium" },
  { id: "ac-1016", tailNumber: "N816AM", shortModel: "B747-8", model: "Boeing 747-8", manufacturer: "Boeing", healthScore: 94, status: "active", location: "JFK", flightHours: 28740, lastInspection: daysAgo(8), nextInspection: daysFromNow(28), aiRiskLevel: "low" },
  { id: "ac-1017", tailNumber: "N817AM", shortModel: "B747-8", model: "Boeing 747-8", manufacturer: "Boeing", healthScore: 86, status: "active", location: "LHR", flightHours: 31420, lastInspection: daysAgo(10), nextInspection: daysFromNow(22), aiRiskLevel: "low" },
  { id: "ac-1018", tailNumber: "N818AM", shortModel: "A350-1000", model: "Airbus A350-1000", manufacturer: "Airbus", healthScore: 68, status: "active", location: "DXB", flightHours: 12110, lastInspection: daysAgo(16), nextInspection: daysFromNow(11), aiRiskLevel: "medium" },
  { id: "ac-1019", tailNumber: "N819AM", shortModel: "B787-9", model: "Boeing 787-9", manufacturer: "Boeing", healthScore: 58, status: "maintenance", location: "ATL", flightHours: 19120, lastInspection: daysAgo(22), nextInspection: daysFromNow(6), aiRiskLevel: "high" },
  { id: "ac-1020", tailNumber: "N820AM", shortModel: "A320-200", model: "Airbus A320-200", manufacturer: "Airbus", healthScore: 90, status: "active", location: "MIA", flightHours: 8450, lastInspection: daysAgo(4), nextInspection: daysFromNow(40), aiRiskLevel: "low" },
];

export async function getFleetAircraft(): Promise<FleetAircraft[]> {
  await delay(400);
  return [...FLEET];
}

/* ── Display helpers ── */

/** Card/table status derived from aircraft state (spec: Healthy/Warning/Critical/Maintenance). */
export function deriveHealthStatus(a: Pick<FleetAircraft, "status" | "healthScore">): HealthBucket | "maintenance" {
  if (a.status === "maintenance") return "maintenance";
  if (a.status === "grounded") return "critical";
  if (a.healthScore >= 80) return "healthy";
  if (a.healthScore >= 60) return "warning";
  return "critical";
}

export const HEALTH_STATUS_META: Record<
  HealthBucket | "maintenance",
  { label: string; badge: "success" | "warning" | "destructive" | "info"; bar: string; glow: string }
> = {
  healthy: {
    label: "Healthy",
    badge: "success",
    bar: "bg-success",
    glow: "from-success/25 via-card to-card",
  },
  warning: {
    label: "Warning",
    badge: "warning",
    bar: "bg-warning",
    glow: "from-warning/25 via-card to-card",
  },
  critical: {
    label: "Critical",
    badge: "destructive",
    bar: "bg-destructive",
    glow: "from-destructive/25 via-card to-card",
  },
  maintenance: {
    label: "In Maintenance",
    badge: "info",
    bar: "bg-info",
    glow: "from-info/25 via-card to-card",
  },
};

export function healthBarClass(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-destructive";
}

export const RISK_BADGE: Record<RiskLevel, "success" | "warning" | "destructive"> = {
  low: "success",
  medium: "warning",
  high: "destructive",
  critical: "destructive",
};

export const MANUFACTURERS: Array<"Boeing" | "Airbus"> = ["Boeing", "Airbus"];
export const STATUSES: FleetStatus[] = ["active", "maintenance", "grounded"];
