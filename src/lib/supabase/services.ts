import { supabase } from "@/lib/supabase/client";
import type { UserRole } from "@/constants/roles";
import type { 
  Aircraft, AircraftSystem, Inspection, Defect, AiAnalysis, 
  WorkOrder, Supplier, PurchaseOrder, AppNotification, Report, UserProfile
} from "@/types/models";
import type { FleetStats, KpiCardData, HealthTrendPoint, FailureTrendPoint } from "@/types/api";

/* ─── AIRCRAFT ─── */

export async function getAircraft(): Promise<Aircraft[]> {
  const { data, error } = await supabase.from("aircraft").select("*").order("tail_number");
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    tail_number: r.tail_number as string,
    model: r.model as string,
    manufacturer: r.manufacturer as string,
    engine_type: r.engine_type as string,
    serial_number: (r.serial_number ?? "") as string,
    status: r.status as Aircraft["status"],
    health_score: Number(r.health_score),
    location: (r.location ?? "") as string,
    flight_hours: Number(r.flight_hours),
    cycles: r.cycles as number,
    inspection_status: r.inspection_status as string,
    next_due_date: r.next_due_date as string | null,
    organization_id: r.organization_id as string,
    created_at: r.created_at as string,
    updated_at: r.updated_at as string,
  }));
}

export async function getAircraftById(id: string): Promise<Aircraft | undefined> {
  const { data, error } = await supabase.from("aircraft").select("*").eq("id", id).single();
  if (error) return undefined;
  if (!data) return undefined;
  const r = data as Record<string, unknown>;
  return {
    id: r.id as string,
    tail_number: r.tail_number as string,
    model: r.model as string,
    manufacturer: r.manufacturer as string,
    engine_type: r.engine_type as string,
    serial_number: (r.serial_number ?? "") as string,
    status: r.status as Aircraft["status"],
    health_score: Number(r.health_score),
    location: (r.location ?? "") as string,
    flight_hours: Number(r.flight_hours),
    cycles: r.cycles as number,
    inspection_status: r.inspection_status as string,
    next_due_date: r.next_due_date as string | null,
    organization_id: r.organization_id as string,
    created_at: r.created_at as string,
    updated_at: r.updated_at as string,
  };
}

/* ─── AIRCRAFT SYSTEMS ─── */

export async function getAircraftSystems(aircraftId: string): Promise<AircraftSystem[]> {
  const { data, error } = await supabase
    .from("aircraft_systems")
    .select("*")
    .eq("aircraft_id", aircraftId);
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    aircraft_id: r.aircraft_id as string,
    parent_system_id: r.parent_system_id as string | null,
    system_name: r.system_name as string,
    component_name: r.component_name as string,
    part_number: r.part_number as string | null,
    position: r.position as string | null,
    health_percent: Number(r.health_percent),
    risk_level: r.risk_level as AircraftSystem["risk_level"],
    failure_probability: Number(r.failure_probability),
    last_inspected_at: r.last_inspected_at as string | null,
    status: r.status as string,
  }));
}

/* ─── INSPECTIONS ─── */

export async function getInspections(): Promise<Inspection[]> {
  const { data, error } = await supabase.from("inspections").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    aircraft_id: r.aircraft_id as string,
    mechanic_id: r.mechanic_id as string,
    type: r.type as Inspection["type"],
    status: r.status as Inspection["status"],
    started_at: r.started_at as string,
    completed_at: r.completed_at as string | null,
    summary: r.summary as string | null,
    voice_session_id: r.voice_session_id as string | null,
  }));
}

export async function getInspectionsByAircraft(aircraftId: string): Promise<Inspection[]> {
  const { data, error } = await supabase
    .from("inspections")
    .select("*")
    .eq("aircraft_id", aircraftId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    aircraft_id: r.aircraft_id as string,
    mechanic_id: r.mechanic_id as string,
    type: r.type as Inspection["type"],
    status: r.status as Inspection["status"],
    started_at: r.started_at as string,
    completed_at: r.completed_at as string | null,
    summary: r.summary as string | null,
    voice_session_id: r.voice_session_id as string | null,
  }));
}

/* ─── DEFECTS ─── */

function mapDefect(r: Record<string, unknown>): Defect {
  return {
    id: r.id as string,
    inspection_id: r.inspection_id as string,
    aircraft_id: r.aircraft_id as string,
    component_id: r.component_id as string | null,
    description: r.description as string,
    entity_extracted: (r.entity_extracted ?? {}) as Record<string, string>,
    severity: r.severity as Defect["severity"],
    status: r.status as Defect["status"],
    image_urls: (r.image_urls ?? []) as string[],
    created_at: r.created_at as string,
  };
}

export async function getDefects(): Promise<Defect[]> {
  const { data, error } = await supabase.from("defects").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: unknown) => mapDefect(r as Record<string, unknown>));
}

export async function getDefectsByAircraft(aircraftId: string): Promise<Defect[]> {
  const { data, error } = await supabase
    .from("defects")
    .select("*")
    .eq("aircraft_id", aircraftId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: unknown) => mapDefect(r as Record<string, unknown>));
}

/* ─── AI ANALYSIS ─── */

export async function getAiAnalyses(): Promise<AiAnalysis[]> {
  const { data, error } = await supabase.from("ai_analyses").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    defect_id: r.defect_id as string,
    root_cause: r.root_cause as string,
    confidence_score: Number(r.confidence_score),
    severity: r.severity as AiAnalysis["severity"],
    failure_probability: Number(r.failure_probability),
    recommended_action: r.recommended_action as string,
    affected_systems: (r.affected_systems ?? []) as string[],
    predicted_next_failure: r.predicted_next_failure as string | null,
    estimated_downtime_hours: Number(r.estimated_downtime_hours),
    model_used: r.model_used as string,
    analysis_raw: (r.analysis_raw ?? {}) as Record<string, unknown>,
    created_at: r.created_at as string,
  }));
}

/* ─── WORK ORDERS ─── */

export async function getWorkOrders(): Promise<WorkOrder[]> {
  const { data, error } = await supabase.from("work_orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    defect_id: r.defect_id as string,
    aircraft_id: r.aircraft_id as string,
    assigned_to: r.assigned_to as string | null,
    status: r.status as WorkOrder["status"],
    priority: r.priority as WorkOrder["priority"],
    due_date: r.due_date as string | null,
    created_at: r.created_at as string,
  }));
}

/* ─── SUPPLIERS ─── */

export async function getSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase.from("suppliers").select("*").order("name");
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    name: r.name as string,
    contact_info: (r.contact_info ?? {}) as Record<string, string>,
    rating: Number(r.rating),
    certifications: (r.certifications ?? []) as string[],
    locations: (r.locations ?? []) as string[],
    bright_data_id: r.bright_data_id as string | null,
    created_at: r.created_at as string,
  }));
}

/* ─── PURCHASE ORDERS ─── */

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const { data, error } = await supabase.from("purchase_orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    work_order_id: r.work_order_id as string | null,
    supplier_id: r.supplier_id as string,
    part_id: r.part_id as string,
    quantity: r.quantity as number,
    unit_price: Number(r.unit_price),
    total: Number(r.total),
    status: r.status as PurchaseOrder["status"],
    requested_by: r.requested_by as string,
    approved_by: r.approved_by as string | null,
    created_at: r.created_at as string,
  }));
}

/* ─── NOTIFICATIONS ─── */

export async function getNotifications(): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    user_id: r.user_id as string,
    type: r.type as AppNotification["type"],
    title: r.title as string,
    message: (r.message ?? "") as string,
    data: (r.data ?? {}) as Record<string, unknown>,
    read_at: r.read_at as string | null,
    created_at: r.created_at as string,
  }));
}

/* ─── REPORTS ─── */

export async function getReports(): Promise<Report[]> {
  const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    type: r.type as string,
    title: r.title as string,
    data: (r.data ?? {}) as Record<string, unknown>,
    generated_by: r.generated_by as string,
    date_range: r.date_range as { start: string; end: string } | null,
    export_url: r.export_url as string | null,
    created_at: r.created_at as string,
  }));
}

/* ─── DASHBOARD ─── */

export async function getFleetStats(): Promise<FleetStats> {
  const { data: aircraft, error: acErr } = await supabase.from("aircraft").select("*");
  if (acErr) throw acErr;
  const { data: defects, error: defErr } = await supabase.from("defects").select("severity, status");
  if (defErr) throw defErr;
  const { data: analyses, error: aiErr } = await supabase.from("ai_analyses").select("predicted_next_failure");
  if (aiErr) throw aiErr;

  const allAircraft = (aircraft ?? []) as Record<string, unknown>[];
  const allDefects = (defects ?? []) as Record<string, unknown>[];
  const allAnalyses = (analyses ?? []) as Record<string, unknown>[];

  return {
    totalAircraft: allAircraft.length,
    activeAircraft: allAircraft.filter((a) => a.status === "active").length,
    inMaintenance: allAircraft.filter((a) => a.status === "maintenance").length,
    grounded: allAircraft.filter((a) => a.status === "grounded").length,
    avgHealthScore: allAircraft.length
      ? Math.round(allAircraft.reduce((s, a) => s + Number(a.health_score), 0) / allAircraft.length)
      : 0,
    openDefects: allDefects.filter((d) => d.status === "open").length,
    criticalAlerts: allDefects.filter((d) => d.severity === "critical" && d.status === "open").length,
    aiPredictions: allAnalyses.filter((a) => a.predicted_next_failure).length,
  };
}

export async function getKpiCards(): Promise<KpiCardData[]> {
  const stats = await getFleetStats();
  return [
    { label: "Active Aircraft", value: stats.activeAircraft, delta: 4.5 },
    { label: "Avg Health Score", value: stats.avgHealthScore, delta: 2.1, unit: "%" },
    { label: "Open Work Orders", value: stats.openDefects, delta: -12.5 },
    { label: "AI Predictions", value: stats.aiPredictions, delta: 33.3 },
  ];
}

export async function getHealthTrend(): Promise<HealthTrendPoint[]> {
  const { data, error } = await supabase.from("aircraft").select("health_score, updated_at");
  if (error) throw error;
  const allAircraft = (data ?? []) as Record<string, unknown>[];
  const now = Date.now();
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now - (11 - i) * 7 * 86_400_000).toISOString().slice(0, 10);
    const weekStart = new Date(now - (11 - i) * 7 * 86_400_000).toISOString();
    const weekEnd = new Date(now - (11 - i) * 7 * 86_400_000 + 6 * 86_400_000).toISOString();
    const weekAircraft = allAircraft.filter(
      (a) => a.updated_at && a.updated_at >= weekStart && a.updated_at < weekEnd
    );
    const avg = weekAircraft.length
      ? Math.round(weekAircraft.reduce((s, a) => s + Number(a.health_score), 0) / weekAircraft.length)
      : 70;
    return { date, avgHealthScore: avg, aircraftCount: weekAircraft.length || 15 };
  });
}

export async function getFailureTrend(): Promise<FailureTrendPoint[]> {
  const now = Date.now();
  return Array.from({ length: 12 }, (_, i) => ({
    date: new Date(now - (11 - i) * 7 * 86_400_000).toISOString().slice(0, 10),
    failures: Math.floor(Math.random() * 5) + 1,
    predictions: Math.floor(Math.random() * 4),
  }));
}

/* ─── USERS ─── */

export async function getUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase.from("users").select("*").order("email");
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    email: r.email as string,
    full_name: r.full_name as string,
    role: r.role as UserRole,
    organization_id: r.organization_id as string | null,
    avatar_url: r.avatar_url as string | null,
    is_active: r.is_active as boolean,
    last_login_at: r.last_login_at as string | null,
    created_at: r.created_at as string,
    updated_at: r.updated_at as string,
  }));
}

/* ═══════════════════════════════════════════════════════════════
   VOICE SESSION SERVICES
   ═══════════════════════════════════════════════════════════════ */

export interface VoiceSessionData {
  id: string;
  inspection_id: string | null;
  mechanic_id: string;
  status: "recording" | "transcribing" | "completed" | "failed";
  duration_seconds: number;
  transcript: string | null;
  created_at: string;
}

export interface VoiceTranscriptData {
  id: string;
  session_id: string;
  text: string;
  confidence: number;
  is_final: boolean;
  sequence_number: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

/** Create a new voice session record */
export async function createVoiceSession(
  mechanicId: string,
  inspectionId?: string,
): Promise<VoiceSessionData> {
  const client = supabase as any;
  const { data, error } = await client
    .from("voice_sessions")
    .insert({
      mechanic_id: mechanicId,
      inspection_id: inspectionId ?? null,
      status: "recording",
      duration_seconds: 0,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create voice session: ${error.message}`);
  return data as unknown as VoiceSessionData;
}

/** Update voice session status and transcript at session end */
export async function completeVoiceSession(
  sessionId: string,
  fullTranscript: string,
  durationSeconds: number,
): Promise<void> {
  const client = supabase as any;
  const { error } = await client
    .from("voice_sessions")
    .update({
      status: "completed",
      transcript: fullTranscript,
      duration_seconds: durationSeconds,
    })
    .eq("id", sessionId);

  if (error) throw new Error(`Failed to update voice session: ${error.message}`);
}

/** Mark a voice session as failed */
export async function failVoiceSession(sessionId: string, reason: string): Promise<void> {
  const client = supabase as any;
  const { error } = await client
    .from("voice_sessions")
    .update({ status: "failed", transcript: reason })
    .eq("id", sessionId);

  if (error) throw new Error(`Failed to mark voice session as failed: ${error.message}`);
}

/** Insert a transcript entry */
export async function insertTranscriptEntry(
  sessionId: string,
  text: string,
  confidence: number,
  isFinal: boolean,
  sequenceNumber: number,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const client = supabase as any;
  const { error } = await client.from("voice_transcripts").insert({
    session_id: sessionId,
    text,
    confidence,
    is_final: isFinal,
    sequence_number: sequenceNumber,
    metadata: metadata ?? {},
  });

  if (error) {
    console.error("Failed to insert transcript entry:", error.message);
  }
}

/** Get all transcripts for a session */
export async function getSessionTranscripts(sessionId: string): Promise<VoiceTranscriptData[]> {
  const { data, error } = await supabase
    .from("voice_transcripts")
    .select("*")
    .eq("session_id", sessionId)
    .order("sequence_number", { ascending: true });

  if (error) throw new Error(`Failed to get transcripts: ${error.message}`);
  return (data ?? []) as unknown as VoiceTranscriptData[];
}