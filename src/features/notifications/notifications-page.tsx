import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn, timeAgo } from "@/lib/utils";
import {
  type NotificationItem,
  type NotificationCategory,
  type NotificationPriority,
  type NotificationPreferences,
  notificationService,
  CATEGORY_LABELS,
} from "./data";
import {
  Bell, CheckCheck, AlertTriangle, Info as InfoIcon, CheckCircle2,
  Search, Settings2, X, Archive, Trash2, MailOpen, Mail,
  ExternalLink, AlertCircle, Loader2,
} from "lucide-react";

/* ── Priority config ── */

const PRIORITY_STYLES: Record<NotificationPriority, { dot: string; bg: string; label: string }> = {
  critical: { dot: "bg-destructive", bg: "bg-destructive/10", label: "Critical" },
  warning:  { dot: "bg-warning",     bg: "bg-warning/10",     label: "Warning" },
  info:     { dot: "bg-info",        bg: "bg-info/10",        label: "Information" },
  success:  { dot: "bg-success",     bg: "bg-success/10",     label: "Success" },
};

const PRIORITY_ICONS: Record<NotificationPriority, typeof AlertTriangle> = {
  critical: AlertCircle, warning: AlertTriangle, info: InfoIcon, success: CheckCircle2,
};

/* ── Toggle Switch ── */

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-sm text-foreground">{label}</span>
      <div onClick={() => onChange(!checked)} className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer", checked ? "bg-cyan-500" : "bg-muted")}>
        <div className={cn("absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", checked && "translate-x-4")} />
      </div>
    </label>
  );
}

/* ── Settings Dialog ── */

function SettingsDialog({ open, onClose, prefs, onUpdate }: {
  open: boolean; onClose: () => void; prefs: NotificationPreferences; onUpdate: (p: Partial<NotificationPreferences>) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 animate-zoom-in">
        <div className="rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-4 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Delivery Channels</p>
            <Toggle label="Email Notifications" checked={prefs.email} onChange={(v) => onUpdate({ email: v })} />
            <Toggle label="SMS Notifications" checked={prefs.sms} onChange={(v) => onUpdate({ sms: v })} />
            <Toggle label="Push Notifications" checked={prefs.push} onChange={(v) => onUpdate({ push: v })} />
            <hr className="border-border" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alert Types</p>
            <Toggle label="System Alerts" checked={prefs.systemAlerts} onChange={(v) => onUpdate({ systemAlerts: v })} />
            <Toggle label="Critical Alerts" checked={prefs.criticalAlerts} onChange={(v) => onUpdate({ criticalAlerts: v })} />
            <Toggle label="AI Alerts" checked={prefs.aiAlerts} onChange={(v) => onUpdate({ aiAlerts: v })} />
            <Toggle label="Maintenance Alerts" checked={prefs.maintenanceAlerts} onChange={(v) => onUpdate({ maintenanceAlerts: v })} />
            <Toggle label="Procurement Alerts" checked={prefs.procurementAlerts} onChange={(v) => onUpdate({ procurementAlerts: v })} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Category Emoji Icon ── */

function CategoryIcon({ category }: { category: NotificationCategory }) {
  const map: Record<NotificationCategory, string> = {
    inspection: "🔍", ai_analysis: "🧠", procurement: "📦", approval: "✅", reports: "📊", system: "⚙️",
  };
  return <span className="text-base">{map[category]}</span>;
}

/* ── Notification Card ── */

function NotificationCard({
  n, selected, onSelect, onMarkRead, onMarkUnread, onArchive, onDelete,
}: {
  n: NotificationItem; selected: boolean; onSelect: () => void;
  onMarkRead: () => void; onMarkUnread: () => void; onArchive: () => void; onDelete: () => void;
}) {
  const style = PRIORITY_STYLES[n.priority];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); }
    if (menuOpen) document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [menuOpen]);

  return (
    <div
      className={cn(
        "group relative border-b border-border/50 p-4 transition-all duration-150 cursor-pointer hover:bg-muted/30",
        !n.read && "bg-muted/10",
        selected && "bg-cyan-500/5 border-l-2 border-l-cyan-400",
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        {/* Priority dot */}
        <div className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", style.dot, n.read && "opacity-30")} />

        {/* Icon */}
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", style.bg)}>
          <CategoryIcon category={n.category} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className={cn("text-sm leading-snug", n.read ? "font-medium text-muted-foreground" : "font-semibold text-foreground")}>
              {n.title}
            </p>
            <span className="shrink-0 text-[10px] text-muted-foreground whitespace-nowrap">{timeAgo(n.timestamp)}</span>
          </div>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">{n.description}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{CATEGORY_LABELS[n.category]}</Badge>
            {n.tailNumber && <span className="text-[10px] font-mono text-muted-foreground">{n.tailNumber}</span>}
            {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
          </div>
        </div>

        {/* Menu */}
        <div ref={menuRef} className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setMenuOpen(!menuOpen)} className={cn("flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100", menuOpen && "opacity-100")}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-border bg-card py-1 shadow-xl">
              {n.read ? (
                <button onClick={() => { onMarkUnread(); setMenuOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><Mail className="h-3.5 w-3.5" /> Mark as Unread</button>
              ) : (
                <button onClick={() => { onMarkRead(); setMenuOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><MailOpen className="h-3.5 w-3.5" /> Mark as Read</button>
              )}
              <button onClick={() => { onArchive(); setMenuOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><Archive className="h-3.5 w-3.5" /> Archive</button>
              <button onClick={() => { onDelete(); setMenuOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Details Panel ── */

function DetailsPanel({ n }: { n: NotificationItem }) {
  const style = PRIORITY_STYLES[n.priority];
  const Icon = PRIORITY_ICONS[n.priority];

  return (
    <div className="space-y-5 animate-slide-in-right">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style.bg)}>
            <Icon className={cn("h-5 w-5", style.dot.replace("bg-", "text-"))} />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">{n.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-[10px]">{CATEGORY_LABELS[n.category]}</Badge>
              <span className={cn("text-[10px] font-medium", style.dot.replace("bg-", "text-"))}>{style.label}</span>
            </div>
          </div>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(n.timestamp)}</span>
      </div>

      <p className="text-sm leading-relaxed text-foreground">{n.description}</p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border/50 bg-muted/20 p-4">
        {n.aircraft && (<div><p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Aircraft</p><p className="text-sm text-foreground">{n.aircraft}</p></div>)}
        {n.tailNumber && (<div><p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Tail Number</p><p className="text-sm font-mono text-cyan-400">{n.tailNumber}</p></div>)}
        {n.affectedComponent && (<div className="col-span-2"><p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Component</p><p className="text-sm text-foreground">{n.affectedComponent}</p></div>)}
        {n.assignedUser && (<div><p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Assigned To</p><p className="text-sm text-foreground">{n.assignedUser}</p></div>)}
        <div><p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Status</p><div className="flex items-center gap-2 mt-0.5"><span className={cn("h-2 w-2 rounded-full", style.dot)} /><span className="text-sm text-foreground">{n.read ? "Read" : "Unread"}</span></div></div>
      </div>

      {n.suggestedAction && (
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
          <p className="mb-1 text-xs font-semibold text-cyan-400">Suggested Action</p>
          <p className="text-xs leading-relaxed text-foreground">{n.suggestedAction}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {n.relatedModule && (
          <Button size="sm" variant="default" onClick={() => window.location.href = n.relatedModule!}>
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> {n.actionLabel || "Go to Module"}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── Filter Pill ── */

function FilterPill({ label, active, count, onClick }: { label: string; active: boolean; count?: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer", active ? "bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
      {label}
      {count !== undefined && <span className={cn("ml-0.5 text-[10px]", active ? "text-cyan-400" : "text-muted-foreground/60")}>({count})</span>}
    </button>
  );
}

/* ── Main Page ── */

export function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    email: true, sms: false, push: true, systemAlerts: true, criticalAlerts: true,
    aiAlerts: true, maintenanceAlerts: true, procurementAlerts: true,
  });

  const selected = items.find((n) => n.id === selectedId) ?? null;
  const unreadCount = items.filter((n) => !n.read).length;

  const load = useCallback(async () => {
    setIsLoading(true);
    const [notifs, prefsData] = await Promise.all([notificationService.getNotifications(), notificationService.getPreferences()]);
    setItems(notifs);
    setPrefs(prefsData);
    if (!selectedId && notifs.length > 0) setSelectedId(notifs[0].id);
    setIsLoading(false);
  }, [selectedId]);

  useEffect(() => { load(); }, []);

  // Filtered
  const filtered = items.filter((n) => {
    if (search) {
      const q = search.toLowerCase();
      if (!n.title.toLowerCase().includes(q) && !n.description.toLowerCase().includes(q) && !(n.aircraft || "").toLowerCase().includes(q) && !(n.tailNumber || "").toLowerCase().includes(q)) return false;
    }
    if (filterPriority === "unread") return !n.read;
    if (filterPriority !== "all" && n.priority !== filterPriority) return false;
    if (filterCategory !== "all" && n.category !== filterCategory) return false;
    return true;
  });

  // Actions
  const handleMarkRead = async (id: string) => { await notificationService.markRead(id); setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))); };
  const handleMarkUnread = async (id: string) => { await notificationService.markUnread(id); setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n))); };
  const handleMarkAllRead = async () => { await notificationService.markAllRead(); setItems((prev) => prev.map((n) => ({ ...n, read: true }))); };
  const handleArchive = async (id: string) => {
    await notificationService.archive(id);
    setItems((prev) => { const next = prev.filter((n) => n.id !== id); if (selectedId === id) { const first = next[0]; setSelectedId(first?.id ?? null); } return next; });
  };
  const handleDelete = async (id: string) => {
    await notificationService.delete(id);
    setItems((prev) => { const next = prev.filter((n) => n.id !== id); if (selectedId === id) { const first = next[0]; setSelectedId(first?.id ?? null); } return next; });
  };
  const handleUpdatePrefs = async (p: Partial<NotificationPreferences>) => { setPrefs((prev) => ({ ...prev, ...p })); await notificationService.updatePreferences(p); };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
        description={unreadCount > 0 ? `You have ${unreadCount} unread notifications.` : "All caught up."}
        actions={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && <Button variant="ghost" size="sm" onClick={handleMarkAllRead}><CheckCheck className="mr-1.5 h-4 w-4" /> Mark All Read</Button>}
            <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}><Settings2 className="mr-1.5 h-4 w-4" /> Preferences</Button>
          </div>
        }
      />

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search notifications…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterPill label="All" active={filterPriority === "all" && filterCategory === "all"} onClick={() => { setFilterPriority("all"); setFilterCategory("all"); }} count={items.length} />
          <FilterPill label="Unread" active={filterPriority === "unread"} onClick={() => setFilterPriority(filterPriority === "unread" ? "all" : "unread")} count={unreadCount} />
          <div className="mx-1 h-4 w-px bg-border" />
          <FilterPill label="Critical" active={filterPriority === "critical"} onClick={() => setFilterPriority(filterPriority === "critical" ? "all" : "critical")} count={items.filter((n) => n.priority === "critical").length} />
          <FilterPill label="Warning" active={filterPriority === "warning"} onClick={() => setFilterPriority(filterPriority === "warning" ? "all" : "warning")} count={items.filter((n) => n.priority === "warning").length} />
          <FilterPill label="Info" active={filterPriority === "info"} onClick={() => setFilterPriority(filterPriority === "info" ? "all" : "info")} count={items.filter((n) => n.priority === "info").length} />
          <FilterPill label="Success" active={filterPriority === "success"} onClick={() => setFilterPriority(filterPriority === "success" ? "all" : "success")} count={items.filter((n) => n.priority === "success").length} />
          <div className="mx-1 h-4 w-px bg-border" />
          <Select options={[
            { value: "all", label: "All Categories" }, { value: "inspection", label: "Inspection" },
            { value: "ai_analysis", label: "AI Analysis" }, { value: "procurement", label: "Procurement" },
            { value: "approval", label: "Approval" }, { value: "reports", label: "Reports" }, { value: "system", label: "System" },
          ]} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-[155px]" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">{filtered.length} of {items.length}</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">
        {/* Left: List */}
        <Card>
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-muted-foreground" />
              Notifications
              {filtered.length > 0 && <span className="text-xs font-normal text-muted-foreground">({filtered.length})</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Bell className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm font-medium text-muted-foreground">No notifications</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {filtered.map((n) => (
                  <NotificationCard key={n.id} n={n} selected={n.id === selectedId} onSelect={() => setSelectedId(n.id)}
                    onMarkRead={() => handleMarkRead(n.id)} onMarkUnread={() => handleMarkUnread(n.id)}
                    onArchive={() => handleArchive(n.id)} onDelete={() => handleDelete(n.id)} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Details */}
        <div className="space-y-4">
          {selected ? (
            <Card className="xl:sticky xl:top-6"><CardContent className="p-4"><DetailsPanel n={selected} /></CardContent></Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <Bell className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm font-medium text-muted-foreground">Select a notification</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Click any notification to view details.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} prefs={prefs} onUpdate={handleUpdatePrefs} />
    </div>
  );
}