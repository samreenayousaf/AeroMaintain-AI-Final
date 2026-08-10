/* ════════════════════════════════════════════════════════════
   Supplier Procurement — Data Service
   Uses the supplier-search Edge Function backed by Bright Data
   Web Unlocker for supplier intelligence, with Supabase catalog
   fallback for known suppliers.
   ════════════════════════════════════════════════════════════ */

/* ── Types ── */

export interface ProcurementSupplier {
  id: string;
  name: string;
  logo: string;
  region: string;
  rating: number;
  certifications: string[];
  partNumber: string;
  partDescription: string;
  manufacturer: string;
  stockQty: number;
  unitPrice: number;
  currency: string;
  deliveryDays: number;
  warrantyMonths: number;
  status: "in_stock" | "low_stock" | "out_of_stock" | "special_order";
}

export interface ProcurementFilter {
  availability: string;
  deliveryTime: string;
  rating: string;
  priceRange: string;
  region: string;
  aircraftModel: string;
}

export type SortOption = "best_match" | "lowest_price" | "highest_rating" | "fastest_delivery";

export interface ProcurementAiRecommendation {
  recommendedSupplier: string;
  reason: string;
  confidence: number;
  estimatedSavings: number;
  riskAssessment: "low" | "medium" | "high";
  alternativeSupplier: string;
  alternativeReason: string;
}

export interface PurchaseSummary {
  supplierId: string;
  supplierName: string;
  partNumber: string;
  partDescription: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  estimatedDelivery: string;
  priority: "low" | "medium" | "high" | "critical";
}

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  partNumber: string;
  partDescription: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: "draft" | "submitted" | "approved" | "ordered" | "received" | "rejected";
  created: string;
}

/* ── Abstract Service Interface ── */

export interface ProcurementService {
  getSuppliers(filters: Partial<ProcurementFilter>, sort: SortOption, search: string): Promise<ProcurementSupplier[]>;
  getAiRecommendation(partNumber: string): Promise<ProcurementAiRecommendation>;
  getPurchaseOrders(): Promise<PurchaseOrder[]>;
}

/* ── Export the real Edge-backed service ── */

import { EdgeProcurementService } from "./edge-procurement-service";
export const procurementService: ProcurementService = new EdgeProcurementService();

/* ── Convenience ── */

export const FILTER_OPTIONS = {
  availability: [
    { value: "all", label: "All Availability" },
    { value: "in_stock", label: "In Stock" },
    { value: "low_stock", label: "Low Stock" },
    { value: "out_of_stock", label: "Out of Stock" },
    { value: "special_order", label: "Special Order" },
  ],
  deliveryTime: [
    { value: "all", label: "Any Delivery" },
    { value: "1-7", label: "1–7 Days" },
    { value: "8-14", label: "8–14 Days" },
    { value: "15-30", label: "15–30 Days" },
    { value: "31-999", label: "30+ Days" },
  ],
  rating: [
    { value: "all", label: "Any Rating" },
    { value: "4.5", label: "4.5+" },
    { value: "4.0", label: "4.0+" },
    { value: "3.5", label: "3.5+" },
  ],
  region: [
    { value: "all", label: "All Regions" },
    { value: "North America", label: "North America" },
    { value: "Europe", label: "Europe" },
    { value: "Asia Pacific", label: "Asia Pacific" },
  ],
  sort: [
    { value: "best_match", label: "Best Match" },
    { value: "lowest_price", label: "Lowest Price" },
    { value: "highest_rating", label: "Highest Rating" },
    { value: "fastest_delivery", label: "Fastest Delivery" },
  ],
};

export function formatDeliveryDays(days: number): string {
  if (days <= 3) return `${days} days`;
  if (days <= 14) return `${days} days`;
  if (days <= 30) return `${days} days`;
  return `${Math.round(days / 7)} weeks`;
}

export function formatStockLabel(qty: number): string {
  if (qty === 0) return "Out of stock";
  if (qty < 10) return `${qty} units (low)`;
  return `${qty} units`;
}

export function stockBadgeVariant(status: ProcurementSupplier["status"]): "success" | "warning" | "destructive" | "secondary" {
  switch (status) {
    case "in_stock": return "success";
    case "low_stock": return "warning";
    case "out_of_stock": return "destructive";
    case "special_order": return "secondary";
  }
}