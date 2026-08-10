import type { UserProfile } from "./models";

export interface ApiResponse<T> {
  data: T;
  error: null | { message: string; code?: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  user: UserProfile;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface FleetStats {
  totalAircraft: number;
  activeAircraft: number;
  inMaintenance: number;
  grounded: number;
  avgHealthScore: number;
  openDefects: number;
  criticalAlerts: number;
  aiPredictions: number;
}

export interface HealthTrendPoint {
  date: string;
  avgHealthScore: number;
  aircraftCount: number;
}

export interface FailureTrendPoint {
  date: string;
  failures: number;
  predictions: number;
}

export interface KpiCardData {
  label: string;
  value: number;
  delta: number;
  unit?: string;
}

export interface SupplierSearchResult {
  suppliers: SupplierEnriched[];
  query: string;
  generatedAt: string;
}

export interface SupplierEnriched {
  id: string;
  name: string;
  rating: number;
  certifications: string[];
  locations: string[];
  price: number;
  deliveryTimeDays: number;
  stockQty: number;
  source: "catalog" | "web";
}

export interface AiAnalysisRequest {
  defectId: string;
  model?: string;
}

export interface AiAnalysisResult {
  rootCause: string;
  confidenceScore: number;
  severity: string;
  failureProbability: number;
  recommendedAction: string;
  affectedSystems: string[];
  predictedNextFailure: string | null;
  estimatedDowntimeHours: number;
  modelUsed: string;
}

export interface VoiceTokenResponse {
  token: string;
  expiresIn: number;
}
