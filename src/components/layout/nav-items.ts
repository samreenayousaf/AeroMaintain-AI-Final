import {
  LayoutDashboard,
  Plane,
  ClipboardCheck,
  BrainCircuit,
  ShieldCheck,
  PackageSearch,
  BarChart3,
  Settings,
} from "lucide-react";
import type { UserRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

export interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: "alerts";
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: ROUTES.dashboard,
    icon: LayoutDashboard,
    roles: ["admin", "manager", "mechanic", "procurement_officer", "executive"],
  },
  {
    label: "Fleet",
    to: ROUTES.fleet,
    icon: Plane,
    roles: ["admin", "manager", "mechanic", "executive"],
  },
  {
    label: "Inspections",
    to: ROUTES.inspection,
    icon: ClipboardCheck,
    roles: ["admin", "manager", "mechanic"],
  },
  {
    label: "AI Analysis",
    to: ROUTES.analysis,
    icon: BrainCircuit,
    roles: ["admin", "manager", "mechanic"],
  },
  {
    label: "Approvals",
    to: ROUTES.approval,
    icon: ShieldCheck,
    roles: ["admin", "manager"],
    badge: "alerts",
  },
  {
    label: "Procurement",
    to: ROUTES.procurement,
    icon: PackageSearch,
    roles: ["admin", "manager", "procurement_officer"],
  },
  {
    label: "Reports",
    to: ROUTES.reports,
    icon: BarChart3,
    roles: ["admin", "manager", "procurement_officer", "executive"],
  },
  {
    label: "Settings",
    to: ROUTES.settings,
    icon: Settings,
    roles: ["admin"],
  },
];
