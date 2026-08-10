import type {
  Aircraft,
  AircraftSystem,
  Inspection,
  Defect,
  AiAnalysis,
  WorkOrder,
  AppNotification,
  PurchaseOrder,
  Supplier,
  Report,
  UserProfile,
} from "@/types/models";
import type { FleetStats, KpiCardData, HealthTrendPoint, FailureTrendPoint } from "@/types/api";

/* ════════════════════════════════════════════
   Deterministic pseudo-random generator (seeded)
   so mock data is stable across renders.
   ════════════════════════════════════════════ */

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const rand = mulberry32(1337);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

/* ════════════════════════════════════════════
   AIRCRAFT
   ════════════════════════════════════════════ */

const TAIL_NUMBERS = [
  "N801AM", "N802AM", "N803AM", "N804AM", "N805AM",
  "N806AM", "N807AM", "N808AM", "N809AM", "N810AM",
  "N811AM", "N812AM", "N813AM", "N814AM", "N815AM",
];

const MODELS = ["A320-200", "A320neo", "A321-200", "A330-300", "A350-900", "B737-800", "B777-300ER", "B787-9"];

const LOCATIONS = ["JFK", "LAX", "DFW", "ATL", "ORD", "MIA", "SEA", "DEN", "IAH", "MUC", "LHR", "DXB"];

function makeAircraft(i: number): Aircraft {
  const statuses: Aircraft["status"][] = ["active", "active", "active", "maintenance", "active", "grounded"];
  const model = pick(MODELS);
  const tail = TAIL_NUMBERS[i % TAIL_NUMBERS.length];
  const seed = hashCode(tail + model);

  return {
    id: `ac-${1000 + i}`,
    tail_number: tail,
    model,
    manufacturer: model.startsWith("A") ? "Airbus" : "Boeing",
    engine_type: model.startsWith("A") ? "CFM56" : "GE90",
    serial_number: `SN-${seed % 100000}`,
    status: statuses[i % statuses.length],
    health_score: 45 + (seed % 55),
    location: pick(LOCATIONS),
    flight_hours: 5_000 + (seed % 45_000),
    cycles: 800 + (seed % 8_000),
    inspection_status: pick(["approved", "in_progress", "under_review", "submitted"]),
    next_due_date: rand() > 0.3 ? daysAgo(-randomInt(5, 90)) : null,
    organization_id: "org-1",
    created_at: daysAgo(365 * 3),
    updated_at: daysAgo(randomInt(0, 20)),
  };
}

export const AIRCRAFT: Aircraft[] = Array.from({ length: 15 }, (_, i) => makeAircraft(i));

export function getAircraft(): Promise<Aircraft[]> {
  return Promise.resolve([...AIRCRAFT]);
}

export function getAircraftById(id: string): Promise<Aircraft | undefined> {
  return Promise.resolve(AIRCRAFT.find((a) => a.id === id));
}

/* ════════════════════════════════════════════
   AIRCRAFT SYSTEMS
   ════════════════════════════════════════════ */

const SYSTEM_NAMES = ["Hydraulic", "Pneumatic", "Electrical", "Avionics", "Fuel", "Landing Gear", "Engine", "APU", "Environmental"];
const COMPONENT_NAMES = ["Pump", "Actuator", "Valve", "Controller", "Sensor", "Harness", "Motor", "Seal", "Filter", "Transducer"];

function makeSystems(aircraftId: string): AircraftSystem[] {
  return Array.from({ length: 8 }, (_, i) => {
    const health = 35 + randomInt(0, 60);
    const risk: AircraftSystem["risk_level"] = health >= 80 ? "low" : health >= 55 ? "medium" : health >= 35 ? "high" : "critical";
    return {
      id: `sys-${aircraftId}-${i}`,
      aircraft_id: aircraftId,
      parent_system_id: null,
      system_name: SYSTEM_NAMES[i % SYSTEM_NAMES.length],
      component_name: COMPONENT_NAMES[randomInt(0, COMPONENT_NAMES.length - 1)],
      part_number: `PN-${randomInt(10000, 99999)}`,
      position: `STN ${randomInt(100, 900)}`,
      health_percent: health,
      risk_level: risk,
      failure_probability: Math.round((100 - health) / 3) / 100,
      last_inspected_at: daysAgo(randomInt(1, 60)),
      status: risk === "critical" ? "maintenance" : risk === "high" ? "watch" : "ok",
    };
  });
}

export function getAircraftSystems(aircraftId: string): Promise<AircraftSystem[]> {
  return Promise.resolve(makeSystems(aircraftId));
}

/* ════════════════════════════════════════════
   INSPECTIONS
   ════════════════════════════════════════════ */

const INSPECTION_TYPES: Inspection["type"][] = ["routine", "defect", "a_check", "c_check"];
const INSPECTION_STATUSES: Inspection["status"][] = ["in_progress", "submitted", "under_review", "approved"];

function makeInspection(i: number): Inspection {
  const aircraft = AIRCRAFT[i % AIRCRAFT.length];
  return {
    id: `insp-${100 + i}`,
    aircraft_id: aircraft.id,
    mechanic_id: `user-mech-${(i % 4) + 1}`,
    type: INSPECTION_TYPES[i % INSPECTION_TYPES.length],
    status: INSPECTION_STATUSES[i % INSPECTION_STATUSES.length],
    started_at: daysAgo(randomInt(0, 14)),
    completed_at: rand() > 0.4 ? daysAgo(randomInt(0, 14)) : null,
    summary: rand() > 0.5 ? "Routine inspection completed. Minor wear noted on brake assembly." : null,
    voice_session_id: rand() > 0.5 ? `voice-${i}` : null,
  };
}

export const INSPECTIONS: Inspection[] = Array.from({ length: 14 }, (_, i) => makeInspection(i));

export function getInspections(): Promise<Inspection[]> {
  return Promise.resolve([...INSPECTIONS]);
}

export function getInspectionsByAircraft(aircraftId: string): Promise<Inspection[]> {
  return Promise.resolve(INSPECTIONS.filter((i) => i.aircraft_id === aircraftId));
}

/* ════════════════════════════════════════════
   DEFECTS
   ════════════════════════════════════════════ */

const DEFECT_DESCRIPTIONS = [
  "Hydraulic fluid leak detected on left main gear actuator",
  "Excessive vibration in right engine fan assembly",
  "Cracked windshield outer pane, starboard side",
  "Landing gear strut pressure below minimum",
  "APU exhaust duct shows signs of heat damage",
  "Leading edge slat actuator sluggish response",
  "Fuel pump #2 output pressure fluctuating",
  "Cabin pressure outflow valve intermittent fault",
];

const SEVERITIES: Defect["severity"][] = ["critical", "major", "major", "minor", "minor"];

function makeDefect(i: number): Defect {
  const inspection = INSPECTIONS[i % INSPECTIONS.length];
  const severity = SEVERITIES[i % SEVERITIES.length];
  return {
    id: `def-${500 + i}`,
    inspection_id: inspection.id,
    aircraft_id: inspection.aircraft_id,
    component_id: `sys-${inspection.aircraft_id}-${i % 8}`,
    description: DEFECT_DESCRIPTIONS[i % DEFECT_DESCRIPTIONS.length],
    entity_extracted: { part: COMPONENT_NAMES[i % COMPONENT_NAMES.length], position: `STN ${randomInt(100, 900)}` },
    severity,
    status: severity === "critical" ? "open" : pick(["open", "approved", "resolved"] as Defect["status"][]),
    image_urls: [],
    created_at: daysAgo(randomInt(0, 10)),
  };
}

export const DEFECTS: Defect[] = Array.from({ length: 12 }, (_, i) => makeDefect(i));

export function getDefects(): Promise<Defect[]> {
  return Promise.resolve([...DEFECTS]);
}

export function getDefectsByAircraft(aircraftId: string): Promise<Defect[]> {
  return Promise.resolve(DEFECTS.filter((d) => d.aircraft_id === aircraftId));
}

/* ════════════════════════════════════════════
   AI ANALYSIS
   ════════════════════════════════════════════ */

const ROOT_CAUSES = [
  "Worn seal degradation under thermal cycling",
  "Bearing fatigue from imbalanced fan assembly",
  "Material stress fracture from bird strike",
  "Hydraulic contamination from failed filter",
  "Electrical arcing due to insulation breakdown",
];

const RECOMMENDED_ACTIONS = [
  "Replace seal assembly, inspect adjacent actuators",
  "Rebalance fan, replace bearing, perform vibration test",
  "Replace windshield pane, inspect frame for stress",
  "Flush hydraulic system, replace filter, retest pressure",
  "Replace harness section, inspect adjacent wiring",
];

function makeAiAnalysis(i: number): AiAnalysis {
  const defect = DEFECTS[i % DEFECTS.length];
  return {
    id: `ai-${300 + i}`,
    defect_id: defect.id,
    root_cause: ROOT_CAUSES[i % ROOT_CAUSES.length],
    confidence_score: 0.72 + rand() * 0.25,
    severity: defect.severity,
    failure_probability: Math.round((30 + rand() * 65) / 5) / 20,
    recommended_action: RECOMMENDED_ACTIONS[i % RECOMMENDED_ACTIONS.length],
    affected_systems: [SYSTEM_NAMES[i % SYSTEM_NAMES.length], SYSTEM_NAMES[(i + 3) % SYSTEM_NAMES.length]],
    predicted_next_failure: rand() > 0.4 ? daysAgo(-randomInt(3, 45)) : null,
    estimated_downtime_hours: randomInt(2, 48),
    model_used: "aero-llm-3",
    analysis_raw: {},
    created_at: daysAgo(randomInt(0, 9)),
  };
}

export const AI_ANALYSES: AiAnalysis[] = Array.from({ length: 10 }, (_, i) => makeAiAnalysis(i));

export function getAiAnalyses(): Promise<AiAnalysis[]> {
  return Promise.resolve([...AI_ANALYSES]);
}

/* ════════════════════════════════════════════
   WORK ORDERS
   ════════════════════════════════════════════ */

const WO_PRIORITIES: WorkOrder["priority"][] = ["low", "medium", "high", "critical"];
const WO_STATUSES: WorkOrder["status"][] = ["open", "assigned", "in_progress", "awaiting_parts", "completed"];

function makeWorkOrder(i: number): WorkOrder {
  const defect = DEFECTS[i % DEFECTS.length];
  return {
    id: `wo-${200 + i}`,
    defect_id: defect.id,
    aircraft_id: defect.aircraft_id,
    assigned_to: `user-mech-${(i % 4) + 1}`,
    status: WO_STATUSES[i % WO_STATUSES.length],
    priority: WO_PRIORITIES[i % WO_PRIORITIES.length],
    due_date: daysAgo(-randomInt(1, 14)),
    created_at: daysAgo(randomInt(0, 8)),
  };
}

export const WORK_ORDERS: WorkOrder[] = Array.from({ length: 10 }, (_, i) => makeWorkOrder(i));

export function getWorkOrders(): Promise<WorkOrder[]> {
  return Promise.resolve([...WORK_ORDERS]);
}

/* ════════════════════════════════════════════
   SUPPLIERS
   ════════════════════════════════════════════ */

const SUPPLIER_NAMES = [
  "AeroParts International", "Skyline Components", "Aviation Hardware Co.",
  "Global Air Spares", "Precision Aero", "Nordic Aero Supply",
  "Pacific Aerospace Parts", "Vertex Aviation Logistics",
];

function makeSupplier(i: number): Supplier {
  return {
    id: `sup-${i + 1}`,
    name: SUPPLIER_NAMES[i % SUPPLIER_NAMES.length],
    contact_info: { email: `sales@${SUPPLIER_NAMES[i % SUPPLIER_NAMES.length].toLowerCase().replace(/[^a-z]/g, "")}.com`, phone: `+1-555-01${i}${i}${i}` },
    rating: 3.2 + rand() * 1.8,
    certifications: pick([["ASA-100", "FAA"], ["EASA", "ASA-100"], ["ISO 9001", "FAA"], ["ASA-100"]]),
    locations: pick([["USA"], ["Europe"], ["Asia"], ["USA", "Europe"], ["Middle East"]]),
    bright_data_id: null,
    created_at: daysAgo(365),
  };
}

export const SUPPLIERS: Supplier[] = Array.from({ length: 8 }, (_, i) => makeSupplier(i));

export function getSuppliers(): Promise<Supplier[]> {
  return Promise.resolve([...SUPPLIERS]);
}

/* ════════════════════════════════════════════
   PURCHASE ORDERS
   ════════════════════════════════════════════ */

const PO_STATUSES: PurchaseOrder["status"][] = ["draft", "submitted", "approved", "ordered", "received"];

function makePurchaseOrder(i: number): PurchaseOrder {
  const wo = WORK_ORDERS[i % WORK_ORDERS.length];
  const supplier = SUPPLIERS[i % SUPPLIERS.length];
  const qty = randomInt(1, 10);
  const unitPrice = randomInt(500, 25_000);
  return {
    id: `po-${400 + i}`,
    work_order_id: wo.id,
    supplier_id: supplier.id,
    part_id: `pn-${randomInt(1000, 9999)}`,
    quantity: qty,
    unit_price: unitPrice,
    total: qty * unitPrice,
    status: PO_STATUSES[i % PO_STATUSES.length],
    requested_by: `user-mech-${(i % 4) + 1}`,
    approved_by: rand() > 0.5 ? "user-mgr-1" : null,
    created_at: daysAgo(randomInt(0, 12)),
  };
}

export const PURCHASE_ORDERS: PurchaseOrder[] = Array.from({ length: 8 }, (_, i) => makePurchaseOrder(i));

export function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  return Promise.resolve([...PURCHASE_ORDERS]);
}

/* ════════════════════════════════════════════
   NOTIFICATIONS
   ════════════════════════════════════════════ */

const NOTIF_TITLES: Array<AppNotification["type"]> = ["inspection_complete", "critical_alert", "approval_required", "supplier_update", "system"];

function makeNotification(i: number): AppNotification {
  const type = NOTIF_TITLES[i % NOTIF_TITLES.length];
  const titles: Record<string, string> = {
    inspection_complete: "Inspection submitted for review",
    critical_alert: "Critical defect detected",
    approval_required: "Work order awaiting approval",
    supplier_update: "Supplier quote received",
    system: "System maintenance scheduled",
  };
  const messages: Record<string, string> = {
    inspection_complete: "N801AM routine inspection was submitted by J. Martinez.",
    critical_alert: "Hydraulic leak on N805AM flagged as critical severity.",
    approval_required: "Work order WO-201 requires your approval.",
    supplier_update: "AeroParts International quoted $4,250 for PN-48213.",
    system: "AeroMaintain will be briefly unavailable Sunday 02:00 UTC.",
  };
  return {
    id: `notif-${i + 1}`,
    user_id: "user-mech-1",
    type,
    title: titles[type],
    message: messages[type],
    data: {},
    read_at: rand() > 0.55 ? daysAgo(randomInt(0, 5)) : null,
    created_at: daysAgo(randomInt(0, 6)),
  };
}

export const NOTIFICATIONS: AppNotification[] = Array.from({ length: 9 }, (_, i) => makeNotification(i));

export function getNotifications(): Promise<AppNotification[]> {
  return Promise.resolve([...NOTIFICATIONS]);
}

/* ════════════════════════════════════════════
   REPORTS
   ════════════════════════════════════════════ */

const REPORT_TYPES = ["fleet_health", "maintenance", "defect", "procurement", "compliance"];

function makeReport(i: number): Report {
  return {
    id: `rep-${i + 1}`,
    type: REPORT_TYPES[i % REPORT_TYPES.length],
    title: `${REPORT_TYPES[i % REPORT_TYPES.length].replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} Report — ${new Date(Date.now() - i * 7 * 86_400_000).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`,
    data: { totalAircraft: 15, avgHealth: 78, openDefects: 8 },
    generated_by: "user-mgr-1",
    date_range: { start: daysAgo(30), end: daysAgo(0) },
    export_url: null,
    created_at: daysAgo(i * 7),
  };
}

export const REPORTS: Report[] = Array.from({ length: 6 }, (_, i) => makeReport(i));

export function getReports(): Promise<Report[]> {
  return Promise.resolve([...REPORTS]);
}

/* ════════════════════════════════════════════
   FLEET STATS & TRENDS
   ════════════════════════════════════════════ */

export function getFleetStats(): Promise<FleetStats> {
  const active = AIRCRAFT.filter((a) => a.status === "active").length;
  const maintenance = AIRCRAFT.filter((a) => a.status === "maintenance").length;
  const grounded = AIRCRAFT.filter((a) => a.status === "grounded").length;
  const avgHealth = Math.round(AIRCRAFT.reduce((s, a) => s + a.health_score, 0) / AIRCRAFT.length);
  const critical = DEFECTS.filter((d) => d.severity === "critical" && d.status === "open").length;

  return Promise.resolve({
    totalAircraft: AIRCRAFT.length,
    activeAircraft: active,
    inMaintenance: maintenance,
    grounded,
    avgHealthScore: avgHealth,
    openDefects: DEFECTS.filter((d) => d.status === "open").length,
    criticalAlerts: critical,
    aiPredictions: AI_ANALYSES.filter((a) => a.predicted_next_failure).length,
  });
}

export function getKpiCards(): Promise<KpiCardData[]> {
  return Promise.resolve([
    { label: "Active Aircraft", value: 11, delta: 4.5 },
    { label: "Avg Health Score", value: 78, delta: 2.1, unit: "%" },
    { label: "Open Work Orders", value: 7, delta: -12.5 },
    { label: "AI Predictions", value: 6, delta: 33.3 },
  ]);
}

export function getHealthTrend(): Promise<HealthTrendPoint[]> {
  return Promise.resolve(
    Array.from({ length: 12 }, (_, i) => ({
      date: new Date(Date.now() - (11 - i) * 7 * 86_400_000).toISOString().slice(0, 10),
      avgHealthScore: 70 + randomInt(-6, 8),
      aircraftCount: 15,
    })),
  );
}

export function getFailureTrend(): Promise<FailureTrendPoint[]> {
  return Promise.resolve(
    Array.from({ length: 12 }, (_, i) => ({
      date: new Date(Date.now() - (11 - i) * 7 * 86_400_000).toISOString().slice(0, 10),
      failures: randomInt(1, 6),
      predictions: randomInt(0, 4),
    })),
  );
}

/* ════════════════════════════════════════════
   USERS
   ════════════════════════════════════════════ */

export const MOCK_USERS: UserProfile[] = [
  {
    id: "user-admin-1", email: "admin@aeromaintain.com", full_name: "Sarah Chen", role: "admin",
    organization_id: "org-1", avatar_url: null, is_active: true, last_login_at: daysAgo(1), created_at: daysAgo(400), updated_at: daysAgo(1),
  },
  {
    id: "user-mgr-1", email: "manager@aeromaintain.com", full_name: "David Okafor", role: "manager",
    organization_id: "org-1", avatar_url: null, is_active: true, last_login_at: daysAgo(2), created_at: daysAgo(380), updated_at: daysAgo(2),
  },
  {
    id: "user-mech-1", email: "mechanic@aeromaintain.com", full_name: "James Martinez", role: "mechanic",
    organization_id: "org-1", avatar_url: null, is_active: true, last_login_at: daysAgo(0), created_at: daysAgo(300), updated_at: daysAgo(0),
  },
  {
    id: "user-mech-2", email: "mechanic2@aeromaintain.com", full_name: "Lena Fischer", role: "mechanic",
    organization_id: "org-1", avatar_url: null, is_active: true, last_login_at: daysAgo(1), created_at: daysAgo(280), updated_at: daysAgo(1),
  },
  {
    id: "user-po-1", email: "procurement@aeromaintain.com", full_name: "Ahmed Al-Rashid", role: "procurement_officer",
    organization_id: "org-1", avatar_url: null, is_active: true, last_login_at: daysAgo(3), created_at: daysAgo(250), updated_at: daysAgo(3),
  },
  {
    id: "user-exec-1", email: "executive@aeromaintain.com", full_name: "Rachel Kim", role: "executive",
    organization_id: "org-1", avatar_url: null, is_active: true, last_login_at: daysAgo(1), created_at: daysAgo(200), updated_at: daysAgo(1),
  },
];

export function getMockUsers(): Promise<UserProfile[]> {
  return Promise.resolve([...MOCK_USERS]);
}