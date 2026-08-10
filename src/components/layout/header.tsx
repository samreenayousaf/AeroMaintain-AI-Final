import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, Search, LogOut, User, Settings, ChevronDown, MessageSquare, Plus } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initials } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setMobileOpen = useUiStore((s) => s.setMobileSidebarOpen);
  const notificationCount = useUiStore((s) => s.activeNotificationsCount);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate(ROUTES.login);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/40 bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-muted-foreground"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumb area */}
      <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="text-foreground font-medium">Dashboard</span>
      </div>

      {/* Search */}
      <div className="relative ml-auto hidden sm:block w-full max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          type="search"
          placeholder="Search tail number, part, defect…"
          aria-label="Search"
          className="pl-9 bg-white/[0.03] border-border/40 focus:border-primary/40 h-9 text-sm rounded-lg"
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
        />
        {searchOpen && (
          <div className="absolute top-full z-50 mt-2 w-full glass-card rounded-lg p-2 shadow-xl">
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">
              Search will be available with the data layer
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hidden sm:flex">
        <Plus className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hidden sm:flex">
        <MessageSquare className="h-5 w-5" />
      </Button>

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-muted-foreground hover:text-foreground"
        aria-label={`Notifications${notificationCount ? `, ${notificationCount} unread` : ""}`}
        onClick={() => navigate(ROUTES.notifications)}
      >
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground shadow-md">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </Button>

      {/* User menu */}
      {user && (
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2 hover:bg-white/[0.03]"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 text-xs font-bold text-primary ring-1 ring-primary/20">
              {initials(user.full_name)}
            </span>
            <span className="hidden text-sm font-medium text-foreground md:inline">
              {user.full_name.split(" ")[0]}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-56 glass-card rounded-lg p-1 shadow-xl"
            >
              <div className="border-b border-border/50 px-3 py-2">
                <p className="truncate text-sm font-medium text-foreground">{user.full_name}</p>
                <p className="truncate text-xs capitalize text-muted-foreground">
                  {user.role.replace("_", " ")}
                </p>
              </div>
              <Link
                to={ROUTES.settings}
                role="menuitem"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors"
              >
                <Settings className="h-4 w-4 text-muted-foreground" /> Settings
              </Link>
              <Link
                to={ROUTES.settingsProfile}
                role="menuitem"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors"
              >
                <User className="h-4 w-4 text-muted-foreground" /> Profile
              </Link>
              <button
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}