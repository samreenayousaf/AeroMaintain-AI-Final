/* ════════════════════════════════════════════════════════════
   Reports & Analytics — Mock Data Service
   Abstract interface so a live backend / Supabase can replace
   the mock without changing the UI.
   ════════════════════════════════════════════════════════════ */

import { delay } from "@/lib/api";

/* ── Types ── */

export interface ReportFilters {
  dateRange: "30d" | "90d" | "6m" | "12m" | "custom";
  dateFrom?: string;
  dateTo?: string;
  aircraftModel: string;
  status: string;
  supplier: string;
  maintenanceType: string;
  region: string;
}

export interface ExecutiveKpi {
  label: string;
  value: string;
  unit?: string;
  delta: number;
  trend: "up" | "down" | "neutral";
  accent: "cyan" | "green" | "amber" | "red" | "blue";
  sparklineData: number[];
}

export interface HealthTrendPoint {
  month: string;
  health: number;
  target: number;
}

export interface MonthlyTrend {
  month: string;
  value: number;
  previousYear?: number;
}

export interface FleetPerformanceRow {
  aircraft: string;
  tailNumber: string;
  healthScore: number;
  availability: number;
  flightHours: number;
  maintenanceCost: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  lastInspection: string;
}

export interface AiPerformance {
  totalAnalyses: number;
  averageConfidence: number;
  predictionAccuracy: number;
  detectedDefects: number;
  falsePositives: number;
  falseNegatives: number;
  averageProcessingTime: string;
}

export interface ProcurementAnalytics {
  purchaseOrders: number;
  totalCost: number;
  averageDeliveryDays: number;
  averageSupplierRating: number;
  topSuppliers: Array<{ name: string; orders: number; rating: number }>;
  costSavings: number;
}

export interface FailureCategory {
  name: string;
  count: number;
  trend: number;
}

export interface MaintenanceByType {
  type: string;
  scheduled: number;
  unscheduled: number;
}

export interface SupplierPerf {
  name: string;
  onTime: number;
  quality: number;
  cost: number;
}

export interface FailureDistItem {
  name: string;
  value: number;
  color: string;
}

export interface CostBreakdownItem {
  category: string;
  value: number;
  color: string;
}

export interface ReportData {
  kpis: ExecutiveKpi[];
  fleetHealthTrend: HealthTrendPoint[];
  maintenanceCostTrend: MonthlyTrend[];
  inspectionCompletionTrend: MonthlyTrend[];
  aircraftDowntime: MonthlyTrend[];
  aiPredictionAccuracy: MonthlyTrend[];
  failureDistribution: FailureDistItem[];
  topFailureCategories: FailureCategory[];
  maintenanceByAircraftType: MaintenanceByType[];
  supplierPerformance: SupplierPerf[];
  monthlyMaintenanceCost: MonthlyTrend[];
  costBreakdown: CostBreakdownItem[];
  fleetPerformance: FleetPerformanceRow[];
  aiPerformance: AiPerformance;
  procurementAnalytics: ProcurementAnalytics;
}

export interface FilterOptions {
  aircraftModels: string[];
  statuses: string[];
  suppliers: string[];
  maintenanceTypes: string[];
  regions: string[];
}

/* ── Abstract Service Interface ── */

export interface ReportsService {
  getReportData(filters: ReportFilters): Promise<ReportData>;
  getFilterOptions(): Promise<FilterOptions>;
}

/* ── Month Helpers ── */

function months(n: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

/* ── Mock Implementation ── */

class MockReportsService implements ReportsService {
  async getReportData(_filters: ReportFilters): Promise<ReportData> {
    await delay(500);

    return {
      /* ── Executive KPIs ── */
      kpis: [
        { label: "Fleet Health Score", value: "89.4", unit: "%", delta: 2.1, trend: "up", accent: "cyan", sparklineData: [84, 85, 84, 86, 87, 86, 88, 87, 88, 89, 88, 89.4] },
        { label: "Aircraft Availability", value: "94.2", unit: "%", delta: 1.8, trend: "up", accent: "green", sparklineData: [91, 91, 92, 92, 93, 92, 93, 93, 94, 93, 94, 94.2] },
        { label: "Average Downtime", value: "4.2", unit: "days", delta: -12.5, trend: "down", accent: "red", sparklineData: [6.8, 6.5, 6.2, 5.9, 5.7, 5.4, 5.2, 5.0, 4.8, 4.6, 4.4, 4.2] },
        { label: "Maintenance Cost", value: "$12.4M", delta: -8.3, trend: "down", accent: "amber", sparklineData: [14.2, 14.0, 13.8, 13.5, 13.2, 13.0, 12.8, 12.6, 12.5, 12.4, 12.4, 12.4] },
        { label: "Cost Savings (YTD)", value: "$2.8M", delta: 34.2, trend: "up", accent: "green", sparklineData: [0.4, 0.8, 1.1, 1.4, 1.7, 1.9, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8] },
        { label: "Completed Inspections", value: "347", unit: "mo", delta: 12.4, trend: "up", accent: "blue", sparklineData: [245, 258, 271, 284, 298, 305, 312, 320, 328, 335, 342, 347] },
        { label: "Pending Inspections", value: "24", delta: -18.9, trend: "down", accent: "amber", sparklineData: [42, 40, 38, 36, 35, 33, 31, 30, 28, 27, 25, 24] },
        { label: "AI Prediction Accuracy", value: "93.7", unit: "%", delta: 2.8, trend: "up", accent: "cyan", sparklineData: [84, 86, 87, 88, 89, 90, 91, 91, 92, 92, 93, 93.7] },
        { label: "Average Repair Time", value: "3.8", unit: "hrs", delta: -15.2, trend: "down", accent: "green", sparklineData: [5.8, 5.5, 5.2, 4.9, 4.7, 4.5, 4.3, 4.2, 4.1, 4.0, 3.9, 3.8] },
      ],

      /* ── Fleet Health Trend ── */
      fleetHealthTrend: [
        { month: months(11), health: 84, target: 85 },
        { month: months(10), health: 85, target: 85 },
        { month: months(9), health: 84, target: 86 },
        { month: months(8), health: 86, target: 86 },
        { month: months(7), health: 87, target: 87 },
        { month: months(6), health: 86, target: 87 },
        { month: months(5), health: 88, target: 87 },
        { month: months(4), health: 87, target: 88 },
        { month: months(3), health: 88, target: 88 },
        { month: months(2), health: 89, target: 88 },
        { month: months(1), health: 88, target: 89 },
        { month: months(0), health: 89.4, target: 89 },
      ],

      /* ── Maintenance Cost Trend ── */
      maintenanceCostTrend: [
        { month: months(11), value: 14.2, previousYear: 15.8 },
        { month: months(10), value: 14.0, previousYear: 15.5 },
        { month: months(9), value: 13.8, previousYear: 15.3 },
        { month: months(8), value: 13.5, previousYear: 15.0 },
        { month: months(7), value: 13.2, previousYear: 14.8 },
        { month: months(6), value: 13.0, previousYear: 14.5 },
        { month: months(5), value: 12.8, previousYear: 14.3 },
        { month: months(4), value: 12.6, previousYear: 14.0 },
        { month: months(3), value: 12.5, previousYear: 13.8 },
        { month: months(2), value: 12.4, previousYear: 13.5 },
        { month: months(1), value: 12.4, previousYear: 13.2 },
        { month: months(0), value: 12.4, previousYear: 13.0 },
      ],

      /* ── Inspection Completion Trend ── */
      inspectionCompletionTrend: [
        { month: months(11), value: 18 },
        { month: months(10), value: 22 },
        { month: months(9), value: 20 },
        { month: months(8), value: 25 },
        { month: months(7), value: 24 },
        { month: months(6), value: 28 },
        { month: months(5), value: 26 },
        { month: months(4), value: 30 },
        { month: months(3), value: 29 },
        { month: months(2), value: 32 },
        { month: months(1), value: 31 },
        { month: months(0), value: 34 },
      ],

      /* ── Aircraft Downtime ── */
      aircraftDowntime: [
        { month: months(11), value: 342, previousYear: 410 },
        { month: months(10), value: 325, previousYear: 395 },
        { month: months(9), value: 365, previousYear: 420 },
        { month: months(8), value: 301, previousYear: 380 },
        { month: months(7), value: 287, previousYear: 365 },
        { month: months(6), value: 264, previousYear: 350 },
        { month: months(5), value: 245, previousYear: 340 },
        { month: months(4), value: 230, previousYear: 325 },
        { month: months(3), value: 218, previousYear: 310 },
        { month: months(2), value: 210, previousYear: 295 },
        { month: months(1), value: 205, previousYear: 285 },
        { month: months(0), value: 198, previousYear: 275 },
      ],

      /* ── AI Prediction Accuracy ── */
      aiPredictionAccuracy: [
        { month: months(11), value: 84, previousYear: 72 },
        { month: months(10), value: 86, previousYear: 74 },
        { month: months(9), value: 87, previousYear: 75 },
        { month: months(8), value: 88, previousYear: 76 },
        { month: months(7), value: 89, previousYear: 78 },
        { month: months(6), value: 90, previousYear: 79 },
        { month: months(5), value: 91, previousYear: 80 },
        { month: months(4), value: 91, previousYear: 81 },
        { month: months(3), value: 92, previousYear: 82 },
        { month: months(2), value: 92, previousYear: 83 },
        { month: months(1), value: 93, previousYear: 83 },
        { month: months(0), value: 93.7, previousYear: 84 },
      ],

      /* ── Failure Distribution ── */
      failureDistribution: [
        { name: "Engine", value: 28, color: "#EF4444" },
        { name: "Hydraulics", value: 22, color: "#F59E0B" },
        { name: "Avionics", value: 18, color: "#3B82F6" },
        { name: "Landing Gear", value: 14, color: "#10B981" },
        { name: "Electrical", value: 10, color: "#8B5CF6" },
        { name: "Structure", value: 8, color: "#06B6D4" },
      ],

      /* ── Top Failure Categories ── */
      topFailureCategories: [
        { name: "Turbine Blade Fatigue", count: 42, trend: -12 },
        { name: "Hydraulic Seal Failure", count: 35, trend: -8 },
        { name: "Avionics Display Fault", count: 28, trend: 5 },
        { name: "Landing Gear Actuator", count: 22, trend: -15 },
        { name: "APU Starter Degradation", count: 18, trend: -6 },
        { name: "Fuel Pump Malfunction", count: 15, trend: 3 },
      ],

      /* ── Maintenance by Aircraft Type ── */
      maintenanceByAircraftType: [
        { type: "Boeing 737-800", scheduled: 84, unscheduled: 22 },
        { type: "Airbus A320neo", scheduled: 62, unscheduled: 14 },
        { type: "Boeing 787-9", scheduled: 48, unscheduled: 10 },
        { type: "Airbus A330-300", scheduled: 38, unscheduled: 12 },
        { type: "Boeing 777-300ER", scheduled: 32, unscheduled: 8 },
        { type: "Airbus A350-900", scheduled: 28, unscheduled: 5 },
      ],

      /* ── Supplier Performance ── */
      supplierPerformance: [
        { name: "GE Aerospace", onTime: 96, quality: 98, cost: 88 },
        { name: "Collins Aerospace", onTime: 92, quality: 95, cost: 85 },
        { name: "Honeywell Aerospace", onTime: 88, quality: 93, cost: 82 },
        { name: "Boeing Distribution", onTime: 94, quality: 97, cost: 78 },
        { name: "Parker Aerospace", onTime: 86, quality: 91, cost: 80 },
      ],

      /* ── Monthly Maintenance Cost ── */
      monthlyMaintenanceCost: [
        { month: "Jan", value: 1.12 },
        { month: "Feb", value: 1.05 },
        { month: "Mar", value: 1.18 },
        { month: "Apr", value: 1.10 },
        { month: "May", value: 1.08 },
        { month: "Jun", value: 1.15 },
        { month: "Jul", value: 1.02 },
        { month: "Aug", value: 0.98 },
        { month: "Sep", value: 1.04 },
        { month: "Oct", value: 0.95 },
        { month: "Nov", value: 0.92 },
        { month: "Dec", value: 0.88 },
      ],

      /* ── Cost Breakdown ── */
      costBreakdown: [
        { category: "Labor", value: 35, color: "#06B6D4" },
        { category: "Parts", value: 42, color: "#3B82F6" },
        { category: "Tooling", value: 8, color: "#8B5CF6" },
        { category: "Overhead", value: 10, color: "#F59E0B" },
        { category: "Other", value: 5, color: "#10B981" },
      ],

      /* ── Fleet Performance Table ── */
      fleetPerformance: [
        { aircraft: "Boeing 737-800", tailNumber: "N801AM", healthScore: 96, availability: 97.2, flightHours: 12450, maintenanceCost: 185000, riskLevel: "low", lastInspection: "2 days ago" },
        { aircraft: "Airbus A320neo", tailNumber: "N802AM", healthScore: 91, availability: 95.8, flightHours: 8730, maintenanceCost: 142000, riskLevel: "low", lastInspection: "5 days ago" },
        { aircraft: "Airbus A330-300", tailNumber: "N803AM", healthScore: 84, availability: 91.4, flightHours: 22310, maintenanceCost: 268000, riskLevel: "medium", lastInspection: "12 days ago" },
        { aircraft: "Boeing 787-9", tailNumber: "N804AM", healthScore: 73, availability: 85.2, flightHours: 18120, maintenanceCost: 345000, riskLevel: "high", lastInspection: "8 days ago" },
        { aircraft: "Boeing 737-800", tailNumber: "N805AM", healthScore: 55, availability: 72.6, flightHours: 32440, maintenanceCost: 412000, riskLevel: "critical", lastInspection: "3 days ago" },
        { aircraft: "Airbus A320-200", tailNumber: "N806AM", healthScore: 92, availability: 96.1, flightHours: 9970, maintenanceCost: 156000, riskLevel: "low", lastInspection: "1 day ago" },
        { aircraft: "Boeing 777-300ER", tailNumber: "N807AM", healthScore: 78, availability: 88.5, flightHours: 26890, maintenanceCost: 298000, riskLevel: "medium", lastInspection: "6 days ago" },
        { aircraft: "Airbus A350-900", tailNumber: "N808AM", healthScore: 88, availability: 93.7, flightHours: 15230, maintenanceCost: 204000, riskLevel: "low", lastInspection: "4 days ago" },
        { aircraft: "Boeing 737-800", tailNumber: "N809AM", healthScore: 45, availability: 65.3, flightHours: 41200, maintenanceCost: 485000, riskLevel: "critical", lastInspection: "1 day ago" },
        { aircraft: "Airbus A320neo", tailNumber: "N810AM", healthScore: 95, availability: 96.8, flightHours: 7640, maintenanceCost: 128000, riskLevel: "low", lastInspection: "7 days ago" },
      ],

      /* ── AI Performance ── */
      aiPerformance: {
        totalAnalyses: 2486,
        averageConfidence: 87.3,
        predictionAccuracy: 93.7,
        detectedDefects: 1842,
        falsePositives: 68,
        falseNegatives: 49,
        averageProcessingTime: "2.4s",
      },

      /* ── Procurement Analytics ── */
      procurementAnalytics: {
        purchaseOrders: 156,
        totalCost: 4280000,
        averageDeliveryDays: 4.8,
        averageSupplierRating: 4.2,
        topSuppliers: [
          { name: "GE Aerospace", orders: 34, rating: 4.8 },
          { name: "Collins Aerospace", orders: 28, rating: 4.6 },
          { name: "Boeing Distribution", orders: 22, rating: 4.5 },
          { name: "Honeywell Aerospace", orders: 18, rating: 4.3 },
          { name: "Parker Aerospace", orders: 12, rating: 4.1 },
        ],
        costSavings: 425000,
      },
    };
  }

  async getFilterOptions(): Promise<FilterOptions> {
    await delay(200);
    return {
      aircraftModels: ["All", "Boeing 737-800", "Airbus A320neo", "Boeing 787-9", "Airbus A330-300", "Boeing 777-300ER", "Airbus A350-900", "Airbus A320-200", "Airbus A321-200"],
      statuses: ["All", "Active", "Maintenance", "Grounded"],
      suppliers: ["All", "GE Aerospace", "Collins Aerospace", "Honeywell Aerospace", "Boeing Distribution", "Parker Aerospace"],
      maintenanceTypes: ["All", "A-Check", "B-Check", "C-Check", "Unscheduled", "Engine Overhaul", "Component Swap"],
      regions: ["All", "North America", "Europe", "Middle East", "Asia Pacific", "Latin America"],
    };
  }
}

export const reportsService: ReportsService = new MockReportsService();