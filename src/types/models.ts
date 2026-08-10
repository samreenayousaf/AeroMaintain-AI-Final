import type { UserRole } from "@/constants/roles";

export type ID = string;

export interface Organization {
  id: ID;
  name: string;
  icao_code: string | null;
  logo_url: string | null;
  subscription_tier: "free" | "pro" | "enterprise";
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: ID;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id: ID | null;
  avatar_url: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export type AircraftStatus =
  | "active"
  | "maintenance"
  | "grounded"
  | "retired";

export interface Aircraft {
  id: ID;
  tail_number: string;
  model: string;
  manufacturer: string;
  engine_type: string;
  serial_number: string;
  status: AircraftStatus;
  health_score: number;
  location: string;
  flight_hours: number;
  cycles: number;
  inspection_status: string;
  next_due_date: string | null;
  organization_id: ID;
  created_at: string;
  updated_at: string;
}

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface AircraftSystem {
  id: ID;
  aircraft_id: ID;
  parent_system_id: ID | null;
  system_name: string;
  component_name: string;
  part_number: string | null;
  position: string | null;
  health_percent: number;
  risk_level: RiskLevel;
  failure_probability: number;
  last_inspected_at: string | null;
  status: string;
}

export type InspectionStatus =
  | "in_progress"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected";

export type InspectionType = "routine" | "defect" | "a_check" | "c_check";

export interface Inspection {
  id: ID;
  aircraft_id: ID;
  mechanic_id: ID;
  type: InspectionType;
  status: InspectionStatus;
  started_at: string;
  completed_at: string | null;
  summary: string | null;
  voice_session_id: ID | null;
}

export interface VoiceSession {
  id: ID;
  inspection_id: ID;
  mechanic_id: ID;
  audio_url: string | null;
  transcript: string | null;
  status: "recording" | "transcribing" | "completed" | "failed";
  duration_seconds: number;
  created_at: string;
}

export type DefectSeverity = "critical" | "major" | "minor";
export type DefectStatus = "open" | "approved" | "rejected" | "resolved";

export interface Defect {
  id: ID;
  inspection_id: ID;
  aircraft_id: ID;
  component_id: ID | null;
  description: string;
  entity_extracted: Record<string, string>;
  severity: DefectSeverity;
  status: DefectStatus;
  image_urls: string[];
  created_at: string;
}

export interface AiAnalysis {
  id: ID;
  defect_id: ID;
  root_cause: string;
  confidence_score: number;
  severity: DefectSeverity;
  failure_probability: number;
  recommended_action: string;
  affected_systems: string[];
  predicted_next_failure: string | null;
  estimated_downtime_hours: number;
  model_used: string;
  analysis_raw: Record<string, unknown>;
  created_at: string;
}

export interface DigitalTwinState {
  id: ID;
  aircraft_id: ID;
  component_id: ID;
  health_percent: number;
  risk_level: RiskLevel;
  failure_probability: number;
  metadata: Record<string, unknown>;
  updated_at: string;
}

export interface MaintenanceLog {
  id: ID;
  aircraft_id: ID;
  work_order_id: ID | null;
  component_id: ID | null;
  mechanic_id: ID;
  description: string;
  hours_spent: number;
  completed_at: string;
}

export type WorkOrderStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "awaiting_parts"
  | "completed";

export interface WorkOrder {
  id: ID;
  defect_id: ID;
  aircraft_id: ID;
  assigned_to: ID | null;
  status: WorkOrderStatus;
  priority: "low" | "medium" | "high" | "critical";
  due_date: string | null;
  created_at: string;
}

export interface Supplier {
  id: ID;
  name: string;
  contact_info: Record<string, string>;
  rating: number;
  certifications: string[];
  locations: string[];
  bright_data_id: string | null;
  created_at: string;
}

export interface Part {
  id: ID;
  part_number: string;
  name: string;
  category: string;
  aircraft_model_compatibility: string[];
  created_at: string;
}

export interface SupplierPart {
  id: ID;
  supplier_id: ID;
  part_id: ID;
  price: number;
  currency: string;
  delivery_time_days: number;
  stock_qty: number;
  moq: number;
  last_updated: string;
}

export type PurchaseOrderStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "ordered"
  | "received";

export interface PurchaseOrder {
  id: ID;
  work_order_id: ID | null;
  supplier_id: ID;
  part_id: ID;
  quantity: number;
  unit_price: number;
  total: number;
  status: PurchaseOrderStatus;
  requested_by: ID;
  approved_by: ID | null;
  created_at: string;
}

export interface AppNotification {
  id: ID;
  user_id: ID;
  type: "inspection_complete" | "critical_alert" | "approval_required" | "supplier_update" | "system";
  title: string;
  message: string;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

export interface Report {
  id: ID;
  type: string;
  title: string;
  data: Record<string, unknown>;
  generated_by: ID;
  date_range: { start: string; end: string } | null;
  export_url: string | null;
  created_at: string;
}

export interface AuditLog {
  id: ID;
  user_id: ID;
  action: string;
  entity_type: string;
  entity_id: ID;
  changes: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
