/* ═══════════════════════════════════════════════════════════════
   Inspection mock data + lightweight entity-extraction heuristics.
   In production the entity extraction runs server-side (LLM via
   an Edge Function); this local matcher only powers the UI demo.
   ═══════════════════════════════════════════════════════════════ */

export interface InspectionSessionInfo {
  aircraft: string;
  tailNumber: string;
  mechanicName: string;
  inspectionType: string;
  ataChapter: string;
  ataTitle: string;
  dateTime: string;
  status: string;
}

export const INSPECTION_SESSION: InspectionSessionInfo = {
  aircraft: "Boeing 737-800",
  tailNumber: "N839UA",
  mechanicName: "James Martinez",
  inspectionType: "Routine",
  ataChapter: "36",
  ataTitle: "Pneumatic",
  dateTime: "2026-08-05 09:42",
  status: "In Progress",
};

/* ── Checklist ─────────────────────────────────────────────── */

export type ChecklistStatus = "pending" | "completed" | "skipped";

export interface ChecklistItem {
  id: string;
  label: string;
  status: ChecklistStatus;
}

export const INSPECTION_CHECKLIST: ChecklistItem[] = [
  { id: "engine", label: "Engine", status: "pending" },
  { id: "hydraulics", label: "Hydraulics", status: "pending" },
  { id: "landing-gear", label: "Landing Gear", status: "pending" },
  { id: "fuel", label: "Fuel", status: "pending" },
  { id: "electrical", label: "Electrical", status: "pending" },
  { id: "cabin", label: "Cabin", status: "pending" },
  { id: "avionics", label: "Avionics", status: "pending" },
  { id: "brakes", label: "Brakes", status: "pending" },
];

/* ── Entity extraction ─────────────────────────────────────── */

export interface ExtractedEntity {
  id: string;
  label: string;
  value: string;
  confidence: number; // 0–1
}

interface KeywordRule {
  label: string;
  keywords: string[];
  value: string;
}

const AIRCRAFT_RULES: KeywordRule[] = [
  { label: "Aircraft", keywords: ["737"], value: "Boeing 737-800" },
  { label: "Aircraft", keywords: ["a320"], value: "Airbus A320" },
  { label: "Aircraft", keywords: ["787"], value: "Boeing 787-9" },
];

const ATA_RULES: KeywordRule[] = [
  { label: "ATA Chapter", keywords: ["bleed", "pneumatic"], value: "36 — Pneumatic" },
  { label: "ATA Chapter", keywords: ["landing gear", "strut"], value: "32 — Landing Gear" },
  { label: "ATA Chapter", keywords: ["brake"], value: "32 — Landing Gear" },
  { label: "ATA Chapter", keywords: ["fuel"], value: "28 — Fuel" },
  { label: "ATA Chapter", keywords: ["electrical", "wiring"], value: "24 — Electrical" },
  { label: "ATA Chapter", keywords: ["avionics", "cable"], value: "27 — Flight Controls" },
  { label: "ATA Chapter", keywords: ["apu"], value: "49 — APU" },
  { label: "ATA Chapter", keywords: ["cargo door"], value: "52 — Doors" },
  { label: "ATA Chapter", keywords: ["windshield"], value: "56 — Windows" },
  { label: "ATA Chapter", keywords: ["engine"], value: "72 — Engine" },
  { label: "ATA Chapter", keywords: ["static port"], value: "34 — Navigation" },
];

const COMPONENT_RULES: KeywordRule[] = [
  { label: "Component", keywords: ["bleed air valve"], value: "Bleed Air Valve" },
  { label: "Component", keywords: ["seal ring"], value: "Seal Ring" },
  { label: "Component", keywords: ["landing gear strut"], value: "Landing Gear Strut" },
  { label: "Component", keywords: ["aileron cable"], value: "Aileron Control Cable" },
  { label: "Component", keywords: ["apu bleed duct"], value: "APU Bleed Duct" },
  { label: "Component", keywords: ["cargo door latch"], value: "Cargo Door Latch" },
  { label: "Component", keywords: ["cross-feed valve", "cross feed"], value: "Fuel Cross-Feed Valve" },
  { label: "Component", keywords: ["static port"], value: "Static Port" },
  { label: "Component", keywords: ["rudder trim"], value: "Rudder Trim Actuator" },
  { label: "Component", keywords: ["slide pressure"], value: "Emergency Exit Slide" },
  { label: "Component", keywords: ["windshield"], value: "Windshield" },
  { label: "Component", keywords: ["brake wear"], value: "Brake Wear Indicator" },
];

const SYSTEM_RULES: KeywordRule[] = [
  { label: "System", keywords: ["hydraulic", "leak", "fluid"], value: "Hydraulic" },
  { label: "System", keywords: ["bleed", "pneumatic", "duct"], value: "Pneumatic" },
  { label: "System", keywords: ["fuel"], value: "Fuel" },
  { label: "System", keywords: ["electrical", "wiring"], value: "Electrical" },
  { label: "System", keywords: ["avionics", "cable", "static port"], value: "Avionics" },
  { label: "System", keywords: ["landing gear", "strut", "brake"], value: "Landing Gear" },
  { label: "System", keywords: ["engine"], value: "Engine" },
  { label: "System", keywords: ["apu"], value: "APU" },
  { label: "System", keywords: ["cabin", "slide"], value: "Cabin" },
];

const SEVERITY_RULES: KeywordRule[] = [
  { label: "Severity", keywords: ["critical", "failed", "below minimum"], value: "Critical" },
  { label: "Severity", keywords: ["leak", "crack", "excessive", "degradation", "corrosion"], value: "High" },
  { label: "Severity", keywords: ["sluggish", "minor", "slight"], value: "Medium" },
  { label: "Severity", keywords: ["within limits", "no anomalies", "passed"], value: "Low" },
];

const RISK_RULES: KeywordRule[] = [
  { label: "Risk Level", keywords: ["critical", "failed"], value: "Critical" },
  { label: "Risk Level", keywords: ["leak", "crack", "below minimum"], value: "High" },
  { label: "Risk Level", keywords: ["corrosion", "slack", "degradation", "sluggish"], value: "Medium" },
  { label: "Risk Level", keywords: ["within limits", "no anomalies", "passed"], value: "Low" },
];

function matchRule(text: string, rules: KeywordRule[]): KeywordRule | undefined {
  const lower = text.toLowerCase();
  return rules.find((r) => r.keywords.some((k) => lower.includes(k)));
}

/**
 * Extract entities from the finalized transcript text.
 * Returns a stable array of entities (most recently matched first).
 */
export function extractEntities(finalText: string): ExtractedEntity[] {
  const found: ExtractedEntity[] = [];

  const aircraft = matchRule(finalText, AIRCRAFT_RULES);
  if (aircraft) found.push({ id: "aircraft", label: "Aircraft", value: aircraft.value, confidence: 0.94 });

  const ata = matchRule(finalText, ATA_RULES);
  if (ata) found.push({ id: "ata", label: "ATA Chapter", value: ata.value, confidence: 0.9 });

  const component = matchRule(finalText, COMPONENT_RULES);
  if (component) found.push({ id: "component", label: "Component", value: component.value, confidence: 0.96 });

  const system = matchRule(finalText, SYSTEM_RULES);
  if (system) found.push({ id: "system", label: "System", value: system.value, confidence: 0.92 });

  const severity = matchRule(finalText, SEVERITY_RULES);
  if (severity) found.push({ id: "severity", label: "Severity", value: severity.value, confidence: 0.88 });

  const risk = matchRule(finalText, RISK_RULES);
  if (risk) found.push({ id: "risk", label: "Risk Level", value: risk.value, confidence: 0.85 });

  return found;
}

/**
 * Determine whether the transcript mentions a checklist system,
 * and which items are thus considered "covered" during inspection.
 */
export function matchedChecklistIds(finalText: string): string[] {
  const lower = finalText.toLowerCase();
  const matches = new Set<string>();

  if (/(engine|bleed|oil sample)/.test(lower)) matches.add("engine");
  if (/(hydraulic|fluid)/.test(lower)) matches.add("hydraulics");
  if (/(landing gear|strut)/.test(lower)) matches.add("landing-gear");
  if (/(fuel|cross-feed)/.test(lower)) matches.add("fuel");
  if (/(electrical|wiring|static port|avionics)/.test(lower)) matches.add("electrical");
  if (/(cabin|slide|door)/.test(lower)) matches.add("cabin");
  if (/(avionics|cable|static port)/.test(lower)) matches.add("avionics");
  if (/(brake|slack)/.test(lower)) matches.add("brakes");

  return [...matches];
}

/* ── Progress helper ───────────────────────────────────────── */

export function computeProgress(completedCount: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((completedCount / total) * 100));
}