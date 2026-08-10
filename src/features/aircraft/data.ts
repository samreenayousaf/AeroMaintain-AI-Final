/* ════════════════════════════════════════════════════════════
   Aircraft Detail — Mock Data Service
   Central aircraft health monitoring / AI Digital Twin data.
   No backend integration yet — swap for real services later.
   ════════════════════════════════════════════════════════════ */

import { delay } from "@/lib/api";
import type { RiskLevel } from "@/features/fleet/data";

/* ── Types ── */

export interface AircraftDetail {
  id: string;
  tailNumber: string;
  model: string;
  manufacturer: string;
  engineType: string;
  healthScore: number;
  status: "active" | "maintenance" | "grounded";
  location: string;
  flightHours: number;
  cycles: number;
  lastInspection: string;
  nextInspection: string;
  lastUpdated: string;
  currentIssue: string | null;
  aiConfidence: number | null;
  failureProbability: number | null;
}

export interface ComponentHealth {
  id: string;
  name: string;
  system: string;
  health: number;
  riskLevel: RiskLevel;
  failureProbability: number;
  lastInspection: string;
  predictedRemainingLife: string;
  status: "operational" | "degraded" | "failed";
  svgId: string; // maps to SVG element id
}

export interface CurrentFault {
  issue: string;
  severity: "critical" | "major" | "minor";
  confidenceScore: number;
  aiPrediction: string;
  affectedSystems: string[];
  recommendedAction: string;
  estimatedDowntimeHours: number;
  nextInspection: string;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  technician: string;
  issue: string;
  actionTaken: string;
  status: "completed" | "in-progress" | "scheduled";
  inspectionType: "routine" | "a-check" | "c-check" | "defect";
}

/* ── Date helpers ── */

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

/* ── Mock Detail ── */

const AIRCRAFT: AircraftDetail = {
  id: "ac-1001",
  tailNumber: "N839UA",
  model: "Boeing 737-800",
  manufacturer: "Boeing",
  engineType: "CFM56-7B",
  healthScore: 94,
  status: "active",
  location: "JFK",
  flightHours: 12450,
  cycles: 9842,
  lastInspection: daysAgo(6),
  nextInspection: daysFromNow(21),
  lastUpdated: new Date().toISOString(),
  currentIssue: "Hydraulic Leak Detected",
  aiConfidence: 96,
  failureProbability: 75,
};

/* ── Mock Component Health ── */

const COMPONENTS: ComponentHealth[] = [
  {
    id: "comp-left-engine",
    name: "Left Engine",
    system: "Propulsion",
    health: 92,
    riskLevel: "low",
    failureProbability: 8,
    lastInspection: daysAgo(12),
    predictedRemainingLife: "4,200 hrs",
    status: "operational",
    svgId: "left-engine",
  },
  {
    id: "comp-right-engine",
    name: "Right Engine",
    system: "Propulsion",
    health: 88,
    riskLevel: "low",
    failureProbability: 12,
    lastInspection: daysAgo(10),
    predictedRemainingLife: "3,800 hrs",
    status: "operational",
    svgId: "right-engine",
  },
  {
    id: "comp-hydraulic",
    name: "Hydraulic System",
    system: "Hydraulics",
    health: 62,
    riskLevel: "high",
    failureProbability: 75,
    lastInspection: daysAgo(3),
    predictedRemainingLife: "180 hrs",
    status: "degraded",
    svgId: "hydraulic-system",
  },
  {
    id: "comp-landing-gear",
    name: "Landing Gear",
    system: "Landing Gear",
    health: 94,
    riskLevel: "low",
    failureProbability: 6,
    lastInspection: daysAgo(15),
    predictedRemainingLife: "6,500 hrs",
    status: "operational",
    svgId: "landing-gear",
  },
  {
    id: "comp-wing-systems",
    name: "Wing Systems",
    system: "Airframe",
    health: 90,
    riskLevel: "low",
    failureProbability: 10,
    lastInspection: daysAgo(8),
    predictedRemainingLife: "5,200 hrs",
    status: "operational",
    svgId: "wing-systems",
  },
  {
    id: "comp-cabin-pressure",
    name: "Cabin Pressure",
    system: "Environmental",
    health: 97,
    riskLevel: "low",
    failureProbability: 3,
    lastInspection: daysAgo(5),
    predictedRemainingLife: "8,000 hrs",
    status: "operational",
    svgId: "cabin-pressure",
  },
  {
    id: "comp-electrical",
    name: "Electrical System",
    system: "Electrical",
    health: 85,
    riskLevel: "medium",
    failureProbability: 15,
    lastInspection: daysAgo(7),
    predictedRemainingLife: "3,000 hrs",
    status: "operational",
    svgId: "electrical-system",
  },
  {
    id: "comp-fuel",
    name: "Fuel System",
    system: "Fuel",
    health: 91,
    riskLevel: "low",
    failureProbability: 9,
    lastInspection: daysAgo(9),
    predictedRemainingLife: "4,500 hrs",
    status: "operational",
    svgId: "fuel-system",
  },
  {
    id: "comp-bleed-air",
    name: "Bleed Air System",
    system: "Pneumatics",
    health: 76,
    riskLevel: "medium",
    failureProbability: 24,
    lastInspection: daysAgo(14),
    predictedRemainingLife: "1,200 hrs",
    status: "degraded",
    svgId: "bleed-air-system",
  },
  {
    id: "comp-tail",
    name: "Tail Section",
    system: "Airframe",
    health: 95,
    riskLevel: "low",
    failureProbability: 5,
    lastInspection: daysAgo(20),
    predictedRemainingLife: "7,000 hrs",
    status: "operational",
    svgId: "tail-section",
  },
  {
    id: "comp-cockpit",
    name: "Cockpit",
    system: "Avionics",
    health: 98,
    riskLevel: "low",
    failureProbability: 2,
    lastInspection: daysAgo(4),
    predictedRemainingLife: "9,000 hrs",
    status: "operational",
    svgId: "cockpit",
  },
];

/* ── Mock Current Fault ── */

const CURRENT_FAULT: CurrentFault = {
  issue: "Hydraulic System Pressure Drop",
  severity: "major",
  confidenceScore: 96,
  aiPrediction:
    "High probability of seal degradation in hydraulic pump #2. Recommend immediate inspection of hydraulic lines in wheel well area.",
  affectedSystems: ["Hydraulic System", "Landing Gear", "Braking System"],
  recommendedAction:
    "Inspect hydraulic pump #2 seals and replace if worn. Check fluid levels and pressure regulators.",
  estimatedDowntimeHours: 8,
  nextInspection: daysFromNow(21),
};

/* ── Mock Maintenance History ── */

const MAINTENANCE_HISTORY: MaintenanceRecord[] = [
  {
    id: "mnt-001",
    date: daysAgo(6),
    technician: "Sarah Chen",
    issue: "Routine A-Check Inspection",
    actionTaken: "Completed scheduled A-Check, replaced cabin air filters",
    status: "completed",
    inspectionType: "a-check",
  },
  {
    id: "mnt-002",
    date: daysAgo(14),
    technician: "James Rodriguez",
    issue: "Engine #1 Oil Leak",
    actionTaken: "Replaced oil seal on engine #1, verified no further leakage",
    status: "completed",
    inspectionType: "defect",
  },
  {
    id: "mnt-003",
    date: daysAgo(22),
    technician: "Emily Watson",
    issue: "Landing Gear Actuator",
    actionTaken: "Lubricated and tested main landing gear actuator",
    status: "completed",
    inspectionType: "defect",
  },
  {
    id: "mnt-004",
    date: daysAgo(35),
    technician: "Sarah Chen",
    issue: "C-Check Preparation",
    actionTaken: "Pre-inspection for upcoming C-Check cycle",
    status: "completed",
    inspectionType: "c-check",
  },
  {
    id: "mnt-005",
    date: daysAgo(49),
    technician: "Mike Park",
    issue: "Routine Inspection",
    actionTaken: "Performed 50-hour routine inspection, all systems nominal",
    status: "completed",
    inspectionType: "routine",
  },
  {
    id: "mnt-006",
    date: daysAgo(63),
    technician: "Emily Watson",
    issue: "Hydraulic Fluid Top-Up",
    actionTaken: "Topped up hydraulic system B fluid, inspected for leaks",
    status: "completed",
    inspectionType: "routine",
  },
];

/* ── Public API ── */

export async function getAircraftDetail(): Promise<AircraftDetail> {
  await delay(350);
  return { ...AIRCRAFT };
}

export async function getAircraftComponents(): Promise<ComponentHealth[]> {
  await delay(400);
  return COMPONENTS.map((c) => ({ ...c }));
}

export async function getCurrentFault(): Promise<CurrentFault | null> {
  await delay(250);
  return { ...CURRENT_FAULT };
}

export async function getMaintenanceHistory(): Promise<MaintenanceRecord[]> {
  await delay(300);
  return MAINTENANCE_HISTORY.map((r) => ({ ...r }));
}

export async function getAircraftDashboardData() {
  const [detail, components, fault, history] = await Promise.all([
    getAircraftDetail(),
    getAircraftComponents(),
    getCurrentFault(),
    getMaintenanceHistory(),
  ]);
  return { detail, components, fault, history };
}

/* ── Helpers ── */

export function healthColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 50) return "#F59E0B";
  return "#EF4444";
}

export function healthLabel(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 50) return "Warning";
  return "Critical";
}

export function healthGlowClass(score: number): string {
  if (score >= 80) return "glow-success";
  if (score >= 50) return "shadow-[0_0_12px_rgba(245,158,11,0.3)]";
  return "glow-error";
}