import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List, Plus, SearchX, Plane } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar, type FilterChip } from "@/components/ui/filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { HealthIndicator } from "@/components/ui/status-badge";
import { Table, type TableColumn } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { ROUTES } from "@/constants/routes";
import { formatDate, formatFlightHours } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AircraftCard, FleetStatusBadge } from "@/features/fleet/components/aircraft-card";
import {
  getFleetAircraft,
  RISK_BADGE,
  type FleetAircraft,
  type HealthBucket,
  type RiskLevel,
} from "@/features/fleet/data";

const PAGE_SIZE = 9;

type ViewMode = "grid" | "list";
type SortKey = "health-desc" | "health-asc" | "hours-desc" | "tail-asc" | "next-due";
type ManufacturerFilter = "all" | "Boeing" | "Airbus";
type StatusFilter = "all" | "active" | "maintenance" | "grounded";
type HealthFilter = "all" | HealthBucket;

const STATUS_LABEL: Record<Exclude<StatusFilter, "all">, string> = {
  active: "Active",
  maintenance: "In Maintenance",
  grounded: "Grounded",
};

const HEALTH_LABEL: Record<Exclude<HealthFilter, "all">, string> = {
  healthy: "Healthy (≥80)",
  warning: "Warning (60–79)",
  critical: "Critical (<60)",
};

function scoreBucket(score: number): HealthBucket {
  if (score >= 80) return "healthy";
  if (score >= 60) return "warning";
  return "critical";
}

const RISK_BADGE_FOR_TABLE: Record<RiskLevel, "success" | "warning" | "destructive"> =
  RISK_BADGE;

export function FleetPage() {
  const navigate = useNavigate();

  const [aircraft, setAircraft] = useState<FleetAircraft[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [manufacturer, setManufacturer] = useState<ManufacturerFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [health, setHealth] = useState<HealthFilter>("all");
  const [sort, setSort] = useState<SortKey>("health-desc");
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);

  /* ── Load mock fleet ── */
  useEffect(() => {
    let cancelled = false;
    getFleetAircraft().then((data) => {
      if (cancelled) return;
      setAircraft(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Reset to first page whenever the result set changes ── */
  useEffect(() => {
    setPage(1);
  }, [query, manufacturer, status, health, view]);

  /* ── Filter ── */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return aircraft.filter((a) => {
      if (
        q &&
        !`${a.tailNumber} ${a.model} ${a.shortModel} ${a.location}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (manufacturer !== "all" && a.manufacturer !== manufacturer) return false;
      if (status !== "all" && a.status !== status) return false;
      if (health !== "all" && scoreBucket(a.healthScore) !== health) return false;
      return true;
    });
  }, [aircraft, query, manufacturer, status, health]);

  /* ── Sort ── */
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "health-asc":
        arr.sort((a, b) => a.healthScore - b.healthScore);
        break;
      case "hours-desc":
        arr.sort((a, b) => b.flightHours - a.flightHours);
        break;
      case "tail-asc":
        arr.sort((a, b) => a.tailNumber.localeCompare(b.tailNumber));
        break;
      case "next-due":
        arr.sort((a, b) => a.nextInspection.localeCompare(b.nextInspection));
        break;
      default:
        arr.sort((a, b) => b.healthScore - a.healthScore);
    }
    return arr;
  }, [filtered, sort]);

  /* ── Paginate ── */
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* ── Active filter chips ── */
  const chips = useMemo<FilterChip[]>(() => {
    const list: FilterChip[] = [];
    if (query.trim()) list.push({ key: "query", label: "Search", value: query.trim() });
    if (manufacturer !== "all")
      list.push({ key: "manufacturer", label: "Fleet", value: manufacturer });
    if (status !== "all")
      list.push({ key: "status", label: "Status", value: STATUS_LABEL[status] });
    if (health !== "all")
      list.push({ key: "health", label: "Health", value: HEALTH_LABEL[health] });
    return list;
  }, [query, manufacturer, status, health]);

  const removeChip = (key: string) => {
    switch (key) {
      case "query": setQuery(""); break;
      case "manufacturer": setManufacturer("all"); break;
      case "status": setStatus("all"); break;
      case "health": setHealth("all"); break;
    }
  };

  const clearAll = () => {
    setQuery("");
    setManufacturer("all");
    setStatus("all");
    setHealth("all");
  };

  const goToDetails = (id: string) => navigate(ROUTES.aircraftDetail(id));

  const handleAddAircraft = () => {
    toast("Add Aircraft", {
      description: "Aircraft onboarding arrives in a later phase.",
      variant: "info",
    });
  };

  /* ── List view columns ── */
  const columns: TableColumn<FleetAircraft>[] = [
    {
      key: "aircraft",
      header: "Aircraft",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Plane className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground">{row.tailNumber}</p>
            <p className="text-xs text-muted-foreground">{row.model}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <FleetStatusBadge aircraft={row} />,
    },
    {
      key: "health",
      header: "Health",
      render: (row) => <HealthIndicator score={row.healthScore} showLabel />,
    },
    {
      key: "location",
      header: "Location",
      render: (row) => <span className="text-muted-foreground">{row.location}</span>,
    },
    {
      key: "risk",
      header: "AI Risk",
      render: (row) => (
        <Badge variant={RISK_BADGE_FOR_TABLE[row.aiRiskLevel]} className="capitalize text-[10px]">
          {row.aiRiskLevel}
        </Badge>
      ),
    },
    {
      key: "lastInsp",
      header: "Last Inspection",
      render: (row) => (
        <span className="text-muted-foreground">{formatDate(row.lastInspection)}</span>
      ),
    },
    {
      key: "nextInsp",
      header: "Next Inspection",
      render: (row) => (
        <span className="text-muted-foreground">{formatDate(row.nextInspection)}</span>
      ),
    },
    {
      key: "hours",
      header: "Flight Hours",
      render: (row) => (
        <span className="tabular-nums text-muted-foreground">
          {formatFlightHours(row.flightHours)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <Button size="sm" variant="ghost" onClick={() => goToDetails(row.id)} className="text-xs">
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Fleet Management"
        description="Monitor and manage your entire fleet in real time."
        actions={
          <Button size="sm" onClick={handleAddAircraft}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add Aircraft
          </Button>
        }
      />

      {/* Toolbar: search, filters, sort, view toggle */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search by tail, model or location…"
              className="min-w-[200px] flex-1 bg-white/[0.02] border-border/40"
            />
            <div className="flex items-center gap-1.5" role="group" aria-label="View mode">
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-150 cursor-pointer",
                  view === "grid"
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/40 bg-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-150 cursor-pointer",
                  view === "list"
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/40 bg-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <List className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value as ManufacturerFilter)}
              aria-label="Fleet filter"
              className="w-auto min-w-[130px]"
              options={[
                { value: "all", label: "All Fleets" },
                { value: "Boeing", label: "Boeing" },
                { value: "Airbus", label: "Airbus" },
              ]}
            />
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              aria-label="Status filter"
              className="w-auto min-w-[150px]"
              options={[
                { value: "all", label: "All Statuses" },
                { value: "active", label: "Active" },
                { value: "maintenance", label: "In Maintenance" },
                { value: "grounded", label: "Grounded" },
              ]}
            />
            <Select
              value={health}
              onChange={(e) => setHealth(e.target.value as HealthFilter)}
              aria-label="Health filter"
              className="w-auto min-w-[160px]"
              options={[
                { value: "all", label: "All Health" },
                { value: "healthy", label: "Healthy (≥80)" },
                { value: "warning", label: "Warning (60–79)" },
                { value: "critical", label: "Critical (<60)" },
              ]}
            />
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort aircraft"
              className="w-auto min-w-[190px]"
              options={[
                { value: "health-desc", label: "Health: High → Low" },
                { value: "health-asc", label: "Health: Low → High" },
                { value: "hours-desc", label: "Flight Hours: High → Low" },
                { value: "tail-asc", label: "Tail Number: A → Z" },
                { value: "next-due", label: "Next Inspection: Soonest" },
              ]}
            />
            <span className="ml-auto text-sm tabular-nums text-muted-foreground">
              {sorted.length} aircraft
            </span>
          </div>
        </div>
      </div>

      <FilterBar chips={chips} onRemove={removeChip} onClearAll={clearAll} />

      {/* Content */}
      {loading ? (
        <div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          role="status"
          aria-label="Loading fleet"
        >
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl glass-card">
              <div className="h-28 animate-pulse bg-white/[0.03]" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.05]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.05]" />
                <div className="h-1.5 w-full animate-pulse rounded bg-white/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={<SearchX className="h-6 w-6" aria-hidden="true" />}
          title="No aircraft found"
          description="No aircraft match your current search and filters. Try adjusting or clearing them."
          action={
            <Button size="sm" variant="outline" onClick={clearAll}>
              Clear all filters
            </Button>
          }
        />
      ) : (
        <>
          {view === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {paged.map((a) => (
                <AircraftCard key={a.id} aircraft={a} onViewDetails={goToDetails} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl overflow-hidden">
              <Table
                columns={columns}
                data={paged}
                keyExtractor={(row) => row.id}
                onRowClick={(row) => goToDetails(row.id)}
                emptyState={null}
              />
            </div>
          )}
          <Pagination
            page={safePage}
            totalPages={totalPages}
            totalCount={sorted.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}