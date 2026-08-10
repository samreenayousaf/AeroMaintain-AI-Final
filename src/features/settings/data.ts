/* ════════════════════════════════════════════════════════════
   Settings & User Management — Mock Data & Service Layer
   ════════════════════════════════════════════════════════════ */

import { delay } from "@/lib/api";
import type { UserRole } from "@/constants/roles";

/* ── Types ── */

export interface SettingsUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  department: string;
  employee_id: string;
  role: UserRole;
  status: "active" | "inactive" | "suspended";
  last_login: string;
  avatar_url: string | null;
}

export interface SettingsOrg {
  name: string;
  fleet_size: number;
  address: string;
  country: string;
  timezone: string;
  language: string;
  icao_code: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  status: "success" | "warning" | "error";
  ip_address: string;
}

export interface ApiIntegrationStatus {
  name: string;
  service: string;
  status: "connected" | "not_configured" | "error" | "partial";
  description: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  last_active: string;
  current: boolean;
}

/* ── Mock data ── */

const MOCK_USERS: SettingsUser[] = [
  { id: "u1", full_name: "Alex Martinez", email: "alex@aeromaintain.io", phone: "+1 (212) 555-0142", job_title: "Fleet Operations Director", department: "Operations", employee_id: "EMP-1001", role: "admin", status: "active", last_login: new Date(Date.now() - 0.3 * 3_600_000).toISOString(), avatar_url: null },
  { id: "u2", full_name: "Sarah Chen", email: "sarah@aeromaintain.io", phone: "+1 (212) 555-0198", job_title: "Lead Engineer", department: "Engineering", employee_id: "EMP-1002", role: "manager", status: "active", last_login: new Date(Date.now() - 1.2 * 3_600_000).toISOString(), avatar_url: null },
  { id: "u3", full_name: "James Okonkwo", email: "james@aeromaintain.io", phone: "+1 (212) 555-0234", job_title: "Senior Mechanic", department: "Maintenance", employee_id: "EMP-1003", role: "mechanic", status: "active", last_login: new Date(Date.now() - 2.5 * 3_600_000).toISOString(), avatar_url: null },
  { id: "u4", full_name: "Lisa Park", email: "lisa@aeromaintain.io", phone: "+1 (212) 555-0311", job_title: "Procurement Specialist", department: "Supply Chain", employee_id: "EMP-1004", role: "procurement_officer", status: "active", last_login: new Date(Date.now() - 0.8 * 3_600_000).toISOString(), avatar_url: null },
  { id: "u5", full_name: "David Rivera", email: "david@aeromaintain.io", phone: "+1 (212) 555-0456", job_title: "VP of Maintenance", department: "Executive", employee_id: "EMP-1005", role: "executive", status: "active", last_login: new Date(Date.now() - 5.0 * 3_600_000).toISOString(), avatar_url: null },
  { id: "u6", full_name: "Maria Torres", email: "maria@aeromaintain.io", phone: "+1 (212) 555-0512", job_title: "Aircraft Technician", department: "Maintenance", employee_id: "EMP-1006", role: "mechanic", status: "active", last_login: new Date(Date.now() - 3.1 * 3_600_000).toISOString(), avatar_url: null },
  { id: "u7", full_name: "Thomas Wright", email: "thomas@aeromaintain.io", phone: "+1 (212) 555-0623", job_title: "Quality Assurance Lead", department: "Quality", employee_id: "EMP-1007", role: "manager", status: "inactive", last_login: new Date(Date.now() - 720 * 3_600_000).toISOString(), avatar_url: null },
  { id: "u8", full_name: "Priya Sharma", email: "priya@aeromaintain.io", phone: "+1 (212) 555-0789", job_title: "Supply Chain Analyst", department: "Supply Chain", employee_id: "EMP-1008", role: "procurement_officer", status: "active", last_login: new Date(Date.now() - 1.5 * 3_600_000).toISOString(), avatar_url: null },
];

const MOCK_ORG: SettingsOrg = {
  name: "AeroMaintain Operations",
  fleet_size: 120,
  address: "2500 Aviation Blvd, Hangar 7, JFK International Airport",
  country: "United States",
  timezone: "America/New_York",
  language: "English (US)",
  icao_code: "AMO",
};

function isoDaysAgo(days: number, hoursOffset = 0): string {
  return new Date(Date.now() - days * 86_400_000 - hoursOffset * 3_600_000).toISOString();
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: "al1", timestamp: isoDaysAgo(0, 0.1), user: "Alex Martinez", action: "Updated fleet settings", module: "Settings", status: "success", ip_address: "192.168.1.42" },
  { id: "al2", timestamp: isoDaysAgo(0, 0.5), user: "Sarah Chen", action: "Approved work order WO-421", module: "Approvals", status: "success", ip_address: "192.168.1.54" },
  { id: "al3", timestamp: isoDaysAgo(0, 1.2), user: "Lisa Park", action: "Created purchase order PO-893", module: "Procurement", status: "success", ip_address: "10.0.0.23" },
  { id: "al4", timestamp: isoDaysAgo(0, 2.0), user: "James Okonkwo", action: "Submitted inspection report", module: "Inspections", status: "success", ip_address: "192.168.1.67" },
  { id: "al5", timestamp: isoDaysAgo(0, 3.5), user: "System", action: "AI analysis completed for N814AM", module: "AI Analysis", status: "success", ip_address: "system" },
  { id: "al6", timestamp: isoDaysAgo(0, 5.0), user: "Maria Torres", action: "Failed login attempt", module: "Auth", status: "error", ip_address: "203.0.113.42" },
  { id: "al7", timestamp: isoDaysAgo(1, 0.2), user: "David Rivera", action: "Exported monthly fleet report", module: "Reports", status: "success", ip_address: "192.168.1.12" },
  { id: "al8", timestamp: isoDaysAgo(1, 1.0), user: "Priya Sharma", action: "Updated supplier pricing", module: "Procurement", status: "success", ip_address: "10.0.0.45" },
  { id: "al9", timestamp: isoDaysAgo(1, 3.0), user: "Alex Martinez", action: "Modified user permissions", module: "Settings", status: "warning", ip_address: "192.168.1.42" },
  { id: "al10", timestamp: isoDaysAgo(1, 6.0), user: "Sarah Chen", action: "Reviewed defect report", module: "Inspections", status: "success", ip_address: "192.168.1.54" },
  { id: "al11", timestamp: isoDaysAgo(2, 0.5), user: "Thomas Wright", action: "Updated quality checklist", module: "Settings", status: "success", ip_address: "192.168.1.31" },
  { id: "al12", timestamp: isoDaysAgo(2, 2.0), user: "James Okonkwo", action: "Rejected part replacement request", module: "Procurement", status: "warning", ip_address: "192.168.1.67" },
  { id: "al13", timestamp: isoDaysAgo(2, 5.0), user: "System", action: "Automatic fleet health scan", module: "System", status: "success", ip_address: "system" },
  { id: "al14", timestamp: isoDaysAgo(3, 1.0), user: "Lisa Park", action: "Synced supplier catalog via Bright Data", module: "Integrations", status: "success", ip_address: "10.0.0.23" },
  { id: "al15", timestamp: isoDaysAgo(3, 4.0), user: "System", action: "Database backup completed", module: "System", status: "success", ip_address: "system" },
];

const MOCK_SESSIONS: ActiveSession[] = [
  { id: "s1", device: "MacBook Pro 16\"", browser: "Chrome 125", location: "New York, US", ip: "192.168.1.42", last_active: isoDaysAgo(0, 0.05), current: true },
  { id: "s2", device: "iPhone 15 Pro", browser: "Safari 17", location: "New York, US", ip: "192.168.1.100", last_active: isoDaysAgo(0, 2.0), current: false },
  { id: "s3", device: "Windows Desktop", browser: "Firefox 127", location: "Chicago, US", ip: "98.45.67.89", last_active: isoDaysAgo(1, 5.0), current: false },
];

const MOCK_LOGIN_HISTORY = [
  { timestamp: isoDaysAgo(0, 0.05), device: "MacBook Pro — Chrome 125", location: "New York, US", ip: "192.168.1.42", success: true },
  { timestamp: isoDaysAgo(0, 2.0), device: "iPhone 15 Pro — Safari 17", location: "New York, US", ip: "192.168.1.100", success: true },
  { timestamp: isoDaysAgo(0, 5.0), device: "Unknown — Chrome Mobile", location: "Lagos, NG", ip: "203.0.113.42", success: false },
  { timestamp: isoDaysAgo(1, 0.3), device: "MacBook Pro — Chrome 125", location: "New York, US", ip: "192.168.1.42", success: true },
  { timestamp: isoDaysAgo(1, 12.0), device: "Windows Desktop — Firefox 127", location: "Chicago, US", ip: "98.45.67.89", success: true },
  { timestamp: isoDaysAgo(2, 0.5), device: "MacBook Pro — Chrome 125", location: "New York, US", ip: "192.168.1.42", success: true },
];

/* ── Service Layer ── */

export const settingsService = {
  async getUsers(): Promise<SettingsUser[]> {
    await delay(300);
    return MOCK_USERS;
  },

  async getOrganization(): Promise<SettingsOrg> {
    await delay(250);
    return MOCK_ORG;
  },

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    await delay(350);
    return MOCK_AUDIT_LOGS;
  },

  async getActiveSessions(): Promise<ActiveSession[]> {
    await delay(200);
    return MOCK_SESSIONS;
  },

  async getLoginHistory(): Promise<Array<{ timestamp: string; device: string; location: string; ip: string; success: boolean }>> {
    await delay(200);
    return MOCK_LOGIN_HISTORY;
  },

  getApiIntegrations(): ApiIntegrationStatus[] {
    return [
      { name: "Speechmatics", service: "speechmatics", status: "not_configured", description: "Real-time speech-to-text for voice inspections" },
      { name: "Featherless AI", service: "featherless", status: "not_configured", description: "LLM-powered root cause analysis & defect detection" },
      { name: "Bright Data", service: "brightdata", status: "not_configured", description: "Supplier catalog enrichment & market intelligence" },
      { name: "Supabase", service: "supabase", status: "connected", description: "Database, authentication, realtime & edge functions" },
    ];
  },
};