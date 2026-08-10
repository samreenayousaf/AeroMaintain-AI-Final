import { NavLink } from "react-router-dom";
import { Plane, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";
import { NAV_ITEMS } from "./nav-items";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants/config";
import { initials } from "@/lib/utils";

export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const mobileOpen = useUiStore((s) => s.mobileSidebarOpen);
  const setMobileOpen = useUiStore((s) => s.setMobileSidebarOpen);

  const items = user
    ? NAV_ITEMS.filter((item) => item.roles.includes(user.role))
    : [];

  const sidebarContent = (
    <>
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 items-center gap-3 border-b border-border/50 px-4",
          collapsed && "justify-center px-2",
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary glow-cyan">
          <Plane className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-wide text-foreground">
              {APP_NAME}
            </p>
            <p className="text-[10px] text-primary/70">AI Maintenance Ops</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4"
      >
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "text-muted-foreground/80 hover:text-foreground",
                "hover:bg-white/[0.03]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive && "sidebar-active text-primary",
                collapsed && "justify-center px-2",
              )
            }
            title={item.label}
          >
            <item.icon
              className={cn(
                "h-5 w-5 shrink-0 transition-all duration-200",
              )}
            />
            {!collapsed && <span className="truncate">{item.label}</span>}
            {!collapsed && item.badge === "alerts" && (
              <span className="ml-auto flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      {user && (
        <div
          className={cn(
            "flex items-center gap-3 border-t border-border/50 p-4",
            collapsed && "justify-center px-2",
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary text-xs font-bold ring-1 ring-primary/20">
            {initials(user.full_name)}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {user.full_name}
              </p>
              <p className="truncate text-[10px] capitalize text-muted-foreground">
                {user.role.replace("_", " ")}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex h-screen flex-col shrink-0 border-r border-border/50 bg-card transition-all duration-300 relative",
          collapsed ? "w-[68px]" : "w-60",
        )}
        aria-label="Sidebar"
      >
        {sidebarContent}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border/60 bg-card shadow-md hover:bg-muted text-muted-foreground z-10"
        >
          {collapsed ? <ChevronsRight className="h-3 w-3" /> : <ChevronsLeft className="h-3 w-3" />}
        </Button>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-border/50 bg-card">
            <div className="flex justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}