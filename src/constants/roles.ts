export type UserRole =
  | "admin"
  | "manager"
  | "mechanic"
  | "procurement_officer"
  | "executive";

export const ROLES: Record<UserRole, { label: string; description: string }> = {
  admin: { label: "Admin", description: "Full system administration" },
  manager: { label: "Manager", description: "Maintenance oversight & approvals" },
  mechanic: { label: "Mechanic", description: "Field maintenance & inspections" },
  procurement_officer: {
    label: "Procurement Officer",
    description: "Supply chain & purchase orders",
  },
  executive: { label: "Executive", description: "Leadership analytics" },
};

export const ROLE_LABELS: Record<UserRole, string> = Object.fromEntries(
  Object.entries(ROLES).map(([key, value]) => [key, value.label]),
) as Record<UserRole, string>;

export const ROLE_ORDER: UserRole[] = [
  "admin",
  "manager",
  "mechanic",
  "procurement_officer",
  "executive",
];
