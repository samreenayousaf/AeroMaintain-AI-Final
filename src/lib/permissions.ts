import type { UserRole } from "@/constants/roles";
import { ROLES } from "@/constants/roles";

const ROLE_HIERARCHY: UserRole[] = ["admin", "manager", "mechanic", "procurement_officer", "executive"];

/** Check if user's role is at least the required level (admin > manager > mechanic > po > executive) */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const userIdx = ROLE_HIERARCHY.indexOf(userRole);
  const requiredIdx = ROLE_HIERARCHY.indexOf(requiredRole);
  if (userIdx === -1 || requiredIdx === -1) return false;
  return userIdx <= requiredIdx; // lower index = higher privilege
}

/** Check if user role matches any of the allowed roles */
export function isAllowedRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

/** Human-readable role label */
export function roleLabel(role: UserRole): string {
  return ROLES[role]?.label ?? role;
}

/** Can the user approve work orders? */
export function canApprove(role: UserRole): boolean {
  return role === "admin" || role === "manager";
}

/** Can the user manage (CRUD) aircraft? */
export function canManageAircraft(role: UserRole): boolean {
  return role === "admin" || role === "manager";
}

/** Can the user view analytics/reports? */
export function canViewReports(role: UserRole): boolean {
  return role !== "mechanic";
}

/** Can the user access procurement? */
export function canAccessProcurement(role: UserRole): boolean {
  return role === "admin" || role === "manager" || role === "procurement_officer";
}

/** Can the user manage users? */
export function canManageUsers(role: UserRole): boolean {
  return role === "admin";
}