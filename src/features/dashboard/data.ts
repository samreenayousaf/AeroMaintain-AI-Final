/* ════════════════════════════════════════════════════════════
   Executive Dashboard — Mock Data Service
   Simulates a fleet-wide command-center data layer.
   No backend integration yet — swap for real services later.
   ════════════════════════════════════════════════════════════ */

import { delay } from "@/lib/api";

/* ── KPI helpers ── */
export interface DashboardKpi {
  label: string;
  value: string;
  delta?: number;
  unit?: string;
  subtext: string;
  trend: "up" | "down" | "neutral";
  icon: "health" | "fleet" | "alerts" | "inspections";
}

/* ── Health trend point ── */
export interface HealthTrendPoint {
  week: string;
  health: number;
}

/* ── Defects trend point ── */
export interface DefectsTrendPoint {
  month: string;
  detected: number;
  critical: number;
}

/* ── Downtime trend point ── */
export interface DowntimeTrendPoint {
  month: string;
  hours: number;
  scheduled: number;
  unscheduled: number;
}

/* ── Heatmap aircraft marker ── */
export interface HeatmapAircraft {
  id: string;
  tailNumber: string;
  model: string;
  healthScore: number;
  flightHours: number;
  location: string;
  coordinates: [number, number]; // [lng, lat]
  status: "healthy" | "watch" | "critical" | "maintenance";
  color: string;
}

/* ── Activity timeline entry ── */
export type ActivityType =
  | "inspection"
  | "defect"
  | "ai_analysis"
  | "supplier"
  | "approval"
  | "notification";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  tailNumber?: string;
}

const delayMs = 350;

function isoDaysAgo(days: number, hoursOffset = 0): string {
  return new Date(
    Date.now() - days * 86_400_000 - hoursOffset * 3_600_000,
  ).toISOString();
}

function formatWeekLabel(indexFromEnd: number): string {
  const d = new Date(Date.now() - indexFromEnd * 7 * 86_400_000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMonthLabel(indexFromEnd: number): string {
  const d = new Date(Date.now() - indexFromEnd * 30 * 86_400_000);
  return d.toLocaleDateString("en-US", { month: "short" });
}

/* ── KPI CARDS ── */
export async function getDashboardKpis(): Promise<DashboardKpi[]> {
  await delay(delayMs);
  return [
    {
      label: "Fleet Health",
      value: "94",
      unit: "%",
      delta: 2.6,
      subtext: "this month",
      trend: "up",
      icon: "health",
    },
    {
      label: "Total Aircraft",
      value: "120",
      subtext: "118 active",
      trend: "neutral",
      icon: "fleet",
    },
    {
      label: "Critical Alerts",
      value: "6",
      delta: -2,
      subtext: "high priority",
      trend: "down",
      icon: "alerts",
    },
    {
      label: "Today's Inspections",
      value: "35",
      subtext: "12 completed",
      trend: "neutral",
      icon: "inspections",
    },
  ];
}

/* ── FLEET HEALTH TREND (12 weeks) ── */
export async function getFleetHealthTrend(): Promise<HealthTrendPoint[]> {
  await delay(delayMs);
  return [
    { week: formatWeekLabel(11), health: 88 },
    { week: formatWeekLabel(10), health: 89 },
    { week: formatWeekLabel(9), health: 87 },
    { week: formatWeekLabel(8), health: 90 },
    { week: formatWeekLabel(7), health: 89 },
    { week: formatWeekLabel(6), health: 91 },
    { week: formatWeekLabel(5), health: 90 },
    { week: formatWeekLabel(4), health: 92 },
    { week: formatWeekLabel(3), health: 91 },
    { week: formatWeekLabel(2), health: 93 },
    { week: formatWeekLabel(1), health: 92 },
    { week: formatWeekLabel(0), health: 94 },
  ];
}

/* ── DEFECTS DETECTED (8 months) ── */
export async function getDefectsDetected(): Promise<DefectsTrendPoint[]> {
  await delay(delayMs);
  const data: DefectsTrendPoint[] = [
    { month: formatMonthLabel(7), detected: 42, critical: 6 },
    { month: formatMonthLabel(6), detected: 38, critical: 5 },
    { month: formatMonthLabel(5), detected: 45, critical: 7 },
    { month: formatMonthLabel(4), detected: 40, critical: 4 },
    { month: formatMonthLabel(3), detected: 34, critical: 3 },
    { month: formatMonthLabel(2), detected: 30, critical: 4 },
    { month: formatMonthLabel(1), detected: 27, critical: 3 },
    { month: formatMonthLabel(0), detected: 22, critical: 2 },
  ];
  return data;
}

/* ── DOWNTIME TREND (8 months) ── */
export async function getDowntimeTrend(): Promise<DowntimeTrendPoint[]> {
  await delay(delayMs);
  return [
    { month: formatMonthLabel(7), hours: 342, scheduled: 220, unscheduled: 122 },
    { month: formatMonthLabel(6), hours: 318, scheduled: 205, unscheduled: 113 },
    { month: formatMonthLabel(5), hours: 365, scheduled: 240, unscheduled: 125 },
    { month: formatMonthLabel(4), hours: 301, scheduled: 195, unscheduled: 106 },
    { month: formatMonthLabel(3), hours: 287, scheduled: 188, unscheduled: 99 },
    { month: formatMonthLabel(2), hours: 264, scheduled: 176, unscheduled: 88 },
    { month: formatMonthLabel(1), hours: 245, scheduled: 165, unscheduled: 80 },
    { month: formatMonthLabel(0), hours: 221, scheduled: 152, unscheduled: 69 },
  ];
}

/* ── FLEET HEATMAP (world fleet positions) ── */
const AIRPORTS: Record<string, [number, number]> = {
  JFK: [-73.78, 40.64],
  LAX: [-118.41, 33.94],
  DFW: [-97.04, 32.9],
  ATL: [-84.43, 33.64],
  ORD: [-87.9, 41.97],
  MIA: [-80.29, 25.79],
  SEA: [-122.31, 47.45],
  DEN: [-104.67, 39.86],
  IAH: [-95.34, 29.99],
  MUC: [11.79, 48.35],
  LHR: [-0.45, 51.47],
  DXB: [55.36, 25.25],
};

function healthColor(score: number, grounded: boolean): string {
  if (grounded) return "#3B82F6"; // blue — maintenance/grounded
  if (score >= 80) return "#10B981"; // green — healthy
  if (score >= 60) return "#F59E0B"; // amber — watch
  return "#EF4444"; // red — critical
}

export async function getFleetHeatmap(): Promise<HeatmapAircraft[]> {
  await delay(delayMs);
  const raw: Array<{
    id: string;
    tail: string;
    model: string;
    health: number;
    hours: number;
    loc: string;
    grounded?: boolean;
  }> = [
    { id: "1", tail: "N801AM", model: "Boeing 737-800", health: 96, hours: 12450, loc: "JFK" },
    { id: "2", tail: "N802AM", model: "Airbus A320neo", health: 91, hours: 8730, loc: "LAX" },
    { id: "3", tail: "N803AM", model: "Airbus A330-300", health: 84, hours: 22310, loc: "DFW" },
    { id: "4", tail: "N804AM", model: "Boeing 787-9", health: 73, hours: 18120, loc: "LHR" },
    { id: "5", tail: "N805AM", model: "Boeing 737-800", health: 55, hours: 32440, loc: "ATL" },
    { id: "6", tail: "N806AM", model: "Airbus A320-200", health: 92, hours: 9970, loc: "ORD" },
    { id: "7", tail: "N807AM", model: "Boeing 777-300ER", health: 78, hours: 26890, loc: "DXB" },
    { id: "8", tail: "N808AM", model: "Airbus A350-900", health: 88, hours: 15230, loc: "MUC" },
    { id: "9", tail: "N809AM", model: "Boeing 737-800", health: 45, hours: 41200, loc: "MIA" },
    { id: "10", tail: "N810AM", model: "Airbus A320neo", health: 95, hours: 7640, loc: "SEA" },
    { id: "11", tail: "N811AM", model: "Boeing 787-9", health: 82, hours: 20980, loc: "DEN" },
    { id: "12", tail: "N812AM", model: "Airbus A321-200", health: 63, hours: 28760, loc: "IAH" },
    { id: "13", tail: "N813AM", model: "Boeing 737-800", health: 89, hours: 13210, loc: "LAX", grounded: true },
    { id: "14", tail: "N814AM", model: "Airbus A330-300", health: 51, hours: 35600, loc: "JFK" },
    { id: "15", tail: "N815AM", model: "Boeing 777-300ER", health: 76, hours: 24110, loc: "ORD" },
  ];

  return raw.map((a) => {
    const grounded = !!a.grounded;
    const status: HeatmapAircraft["status"] = grounded
      ? "maintenance"
      : a.health >= 80
        ? "healthy"
        : a.health >= 60
          ? "watch"
          : "critical";
    return {
      id: a.id,
      tailNumber: a.tail,
      model: a.model,
      healthScore: a.health,
      flightHours: a.hours,
      location: a.loc,
      coordinates: AIRPORTS[a.loc],
      status,
      color: healthColor(a.health, grounded),
    };
  });
}

/* ── RECENT ACTIVITY TIMELINE ── */
export async function getRecentActivity(): Promise<ActivityEntry[]> {
  await delay(delayMs);
  return [
    {
      id: "act-1",
      type: "inspection",
      title: "Inspection completed",
      description: "Routine A-check finished on N806AM — 3 minor findings logged.",
      tailNumber: "N806AM",
      timestamp: isoDaysAgo(0, 0.4),
    },
    {
      id: "act-2",
      type: "defect",
      title: "Hydraulic leak detected",
      description: "Pressure drop on left main gear actuator flagged as critical.",
      tailNumber: "N805AM",
      timestamp: isoDaysAgo(0, 1.2),
    },
    {
      id: "act-3",
      type: "ai_analysis",
      title: "AI analysis completed",
      description: "Root-cause report generated for N814AM engine vibration.",
      tailNumber: "N814AM",
      timestamp: isoDaysAgo(0, 2.5),
    },
    {
      id: "act-4",
      type: "supplier",
      title: "Supplier quote received",
      description: "AeroParts International quoted $4,250 for PN-48213.",
      timestamp: isoDaysAgo(0, 3.8),
    },
    {
      id: "act-5",
      type: "approval",
      title: "Manager approval completed",
      description: "Work order WO-207 approved for immediate dispatch.",
      timestamp: isoDaysAgo(0, 5.1),
    },
    {
      id: "act-6",
      type: "notification",
      title: "System notification",
      description: "Weekly fleet health digest published to all leads.",
      timestamp: isoDaysAgo(1, 0.3),
    },
  ];
}

/* ── FLEET COMPOSITION ── */
export interface FleetComposition {
  active: number;
  maintenance: number;
  grounded: number;
  availablePct: number;
}

export async function getFleetComposition(): Promise<FleetComposition> {
  await delay(delayMs);
  return { active: 113, maintenance: 5, grounded: 2, availablePct: 94 };
}
