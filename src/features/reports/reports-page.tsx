/* ════════════════════════════════════════════════════════════
   Reports & Analytics — Executive analytics dashboard
   ════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { HealthIndicator } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Table, type TableColumn } from "@/components/ui/table";
import { ErrorState } from "@/components/ui/error-state";
import { TrendAreaChart } from "./components/trend-area-chart";
import { TrendBarChart } from "./components/trend-bar-chart";
import { TrendPieChart } from "./components/trend-pie-chart";
import { MiniSparkline } from "./components/mini-sparkline";
import { reportsService, type ReportData, type ReportFilters } from "./data";
import {
  BarChart3,
  Download,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  BrainCircuit,
  Wrench,
  ShieldCheck,
  PackageSearch,
  DollarSign,
  Plane,
  Settings2,
  Printer,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Constants ── */

const INITIAL_FILTERS: ReportFilters = {
  dateRange: "12m",
  dateFrom: undefined,
  dateTo: undefined,
  aircraftModel: "All",
  status: "All",
  supplier: "All",
  maintenanceType: "All",
  region: "All",
};

const PERIOD_OPTIONS = [
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "6m", label: "Last 6 months" },
  { value: "12m", label: "Last 12 months" },
];

/* ── Main Component ── */

export function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilters>(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await reportsService.getReportData(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load report data");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const cyan = "#06B6D4";
  const blue = "#3B82F6";
  const green = "#10B981";
  const amber = "#F59E0B";
  const red = "#EF4444";

  function riskVariant(level: string) {
    switch (level) {
      case "low": return "success" as const;
      case "medium": return "warning" as const;
      case "high": return "destructive" as const;
      case "critical": return "destructive" as const;
      default: return "default" as const;
    }
  }

  const fleetColumns: TableColumn<ReportData["fleetPerformance"][number]>[] = useMemo(() => [
    { key: "aircraft", header: "Aircraft", render: (r) => (
      <div className="flex items-center gap-2">
        <Plane className="h-4 w-4 text-primary/60" />
        <div>
          <p className="font-medium text-foreground">{r.aircraft}</p>
          <p className="text-xs text-muted-foreground">{r.tailNumber}</p>
        </div>
      </div>
    )},
    { key: "healthScore", header: "Health", render: (r) => (
      <HealthIndicator score={r.healthScore} size="sm" showLabel />
    )},
    { key: "availability", header: "Avail.", render: (r) => (
      <span className="tabular-nums text-foreground">{r.availability}%</span>
    )},
    { key: "flightHours", header: "Flight Hrs", render: (r) => (
      <span className="tabular-nums text-muted-foreground">{r.flightHours.toLocaleString()}</span>
    )},
    { key: "maintenanceCost", header: "Maint. Cost", render: (r) => (
      <span className="tabular-nums text-foreground">${(r.maintenanceCost / 1000).toFixed(0)}k</span>
    )},
    { key: "riskLevel", header: "Risk", render: (r) => (
      <Badge variant={riskVariant(r.riskLevel)} className="uppercase text-[10px] tracking-wider">
        {r.riskLevel}
      </Badge>
    )},
    { key: "lastInspection", header: "Last Inspection", render: (r) => (
      <span className="text-muted-foreground">{r.lastInspection}</span>
    )},
  ], []);

  function fmtCurrency(val: number): string {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}k`;
    return `$${val.toFixed(0)}`;
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Reports & Analytics" description="Loading executive analytics..." />
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-8">
        <PageHeader title="Reports & Analytics" description="Fleet-wide insights and maintenance KPIs" />
        <ErrorState message={error ?? "No data available"} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Reports & Analytics"
        description="Fleet-wide insights, maintenance KPIs, and operational trends"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={filters.dateRange}
              onChange={(e) => setFilters((f) => ({ ...f, dateRange: e.target.value as ReportFilters["dateRange"] }))}
              options={PERIOD_OPTIONS}
              className="w-40"
            />
            <Button variant="outline" size="sm" onClick={() => setShowFilters((v) => !v)} className="gap-1.5">
              <Settings2 className="h-3.5 w-3.5" /> Filters
            </Button>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> PDF</Button>
              <Button variant="outline" size="sm" className="gap-1.5"><FileSpreadsheet className="h-3.5 w-3.5" /> Excel</Button>
              <Button variant="outline" size="sm" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> CSV</Button>
              <Button variant="outline" size="sm" className="gap-1.5"><Printer className="h-3.5 w-3.5" /> Print</Button>
            </div>
          </div>
        }
      />

      {showFilters && (
        <div className="glass-card rounded-xl animate-slide-in-up">
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={filters.aircraftModel} onChange={(e) => setFilters((f) => ({ ...f, aircraftModel: e.target.value }))}
              options={["All", "Boeing 737-800", "Airbus A320neo", "Boeing 787-9", "Airbus A330-300", "Boeing 777-300ER", "Airbus A350-900"].map((v) => ({ value: v, label: v }))}
              placeholder="Aircraft Model" />
            <Select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              options={["All", "Active", "Maintenance", "Grounded"].map((v) => ({ value: v, label: v }))} placeholder="Status" />
            <Select value={filters.supplier} onChange={(e) => setFilters((f) => ({ ...f, supplier: e.target.value }))}
              options={["All", "GE Aerospace", "Collins Aerospace", "Honeywell Aerospace", "Boeing Distribution", "Parker Aerospace"].map((v) => ({ value: v, label: v }))} placeholder="Supplier" />
            <Select value={filters.region} onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}
              options={["All", "North America", "Europe", "Middle East", "Asia Pacific"].map((v) => ({ value: v, label: v }))} placeholder="Region" />
          </div>
        </div>
      )}

      {/* Executive KPI Cards */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Executive KPIs
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.kpis.map((kpi) => (
            <Card key={kpi.label}>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    kpi.accent === "cyan" && "bg-primary/15", kpi.accent === "green" && "bg-success/15",
                    kpi.accent === "amber" && "bg-warning/15", kpi.accent === "red" && "bg-destructive/15",
                    kpi.accent === "blue" && "bg-info/15",
                  )}>
                    <span className={cn(
                      kpi.accent === "cyan" && "text-primary", kpi.accent === "green" && "text-success",
                      kpi.accent === "amber" && "text-warning", kpi.accent === "red" && "text-destructive",
                      kpi.accent === "blue" && "text-info",
                    )}>
                      <BarChart3 className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-foreground">{kpi.value}</span>
                  {kpi.unit && <span className="text-sm text-muted-foreground">{kpi.unit}</span>}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  {kpi.trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-success" />}
                  {kpi.trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
                  <span className={cn("text-xs font-medium", kpi.trend === "up" && "text-success", kpi.trend === "down" && "text-destructive")}>
                    {kpi.delta > 0 ? "+" : ""}{kpi.delta}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs last period</span>
                </div>
                <MiniSparkline data={kpi.sparklineData} color={
                  kpi.accent === "cyan" ? cyan : kpi.accent === "green" ? green : kpi.accent === "amber" ? amber : kpi.accent === "red" ? red : blue
                } height={36} className="mt-2" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Analytics Charts Grid */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" /> Analytics
        </h2>

        {/* Row 1 */}
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><ShieldCheck className="h-4 w-4 text-primary" /> Fleet Health Trend</CardTitle></CardHeader>
            <CardContent><TrendAreaChart data={data.fleetHealthTrend as unknown as Record<string, unknown>[]} xKey="month"
              lines={[{ dataKey: "health", color: cyan, name: "Health Score" }, { dataKey: "target", color: green, name: "Target" }]} height={200} /></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><DollarSign className="h-4 w-4 text-amber" /> Maintenance Cost Trend</CardTitle></CardHeader>
            <CardContent><TrendAreaChart data={data.maintenanceCostTrend as unknown as Record<string, unknown>[]} xKey="month"
              lines={[{ dataKey: "value", color: amber, name: "Current Year" }, { dataKey: "previousYear", color: "#64748B", name: "Previous Year" }]} height={200} /></CardContent></Card>
        </div>

        {/* Row 2 */}
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> Inspection Completion Trend</CardTitle></CardHeader>
            <CardContent><TrendAreaChart data={data.inspectionCompletionTrend as unknown as Record<string, unknown>[]} xKey="month"
              lines={[{ dataKey: "value", color: green, name: "Completed" }]} height={200} /></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-red" /> Aircraft Downtime</CardTitle></CardHeader>
            <CardContent><TrendBarChart data={data.aircraftDowntime as unknown as Record<string, unknown>[]} xKey="month"
              bars={[{ dataKey: "value", color: red, name: "This Year" }, { dataKey: "previousYear", color: "#64748B", name: "Previous Year" }]} height={200} /></CardContent></Card>
        </div>

        {/* Row 3 */}
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><BrainCircuit className="h-4 w-4 text-primary" /> AI Prediction Accuracy</CardTitle></CardHeader>
            <CardContent><TrendAreaChart data={data.aiPredictionAccuracy as unknown as Record<string, unknown>[]} xKey="month"
              lines={[{ dataKey: "value", color: cyan, name: "Accuracy" }, { dataKey: "previousYear", color: "#64748B", name: "Previous Year" }]} height={200} /></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><AlertTriangle className="h-4 w-4 text-warning" /> Failure Distribution</CardTitle></CardHeader>
            <CardContent><TrendPieChart data={data.failureDistribution} height={240} innerRadius={50} outerRadius={80} /></CardContent></Card>
        </div>

        {/* Row 4 */}
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><AlertTriangle className="h-4 w-4 text-destructive" /> Top Failure Categories</CardTitle></CardHeader>
            <CardContent><div className="space-y-3">
              {data.topFailureCategories.map((cat) => (
                <div key={cat.name} className="group">
                  <div className="mb-1 flex items-center justify-between"><span className="text-sm text-foreground">{cat.name}</span>
                    <div className="flex items-center gap-2"><span className="text-sm font-semibold tabular-nums text-foreground">{cat.count}</span>
                      <span className={cn("text-xs font-medium", cat.trend >= 0 ? "text-success" : "text-destructive")}>{cat.trend > 0 ? "+" : ""}{cat.trend}</span></div></div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50"><div className="h-full rounded-full bg-destructive/70 transition-all duration-500" style={{ width: `${(cat.count / 42) * 100}%` }} /></div>
                </div>
              ))}
            </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Wrench className="h-4 w-4 text-blue" /> Maintenance by Aircraft Type</CardTitle></CardHeader>
            <CardContent><TrendBarChart data={data.maintenanceByAircraftType as unknown as Record<string, unknown>[]} xKey="type" height={200} stacked
              bars={[{ dataKey: "scheduled", color: cyan, name: "Scheduled" }, { dataKey: "unscheduled", color: amber, name: "Unscheduled" }]} /></CardContent></Card>
        </div>

        {/* Row 5 */}
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><PackageSearch className="h-4 w-4 text-success" /> Supplier Performance</CardTitle></CardHeader>
            <CardContent><TrendBarChart data={data.supplierPerformance as unknown as Record<string, unknown>[]} xKey="name" height={200}
              bars={[{ dataKey: "onTime", color: green, name: "On-Time %" }, { dataKey: "quality", color: blue, name: "Quality %" }, { dataKey: "cost", color: amber, name: "Cost %" }]} /></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><DollarSign className="h-4 w-4 text-primary" /> Monthly Maintenance Cost ($M)</CardTitle></CardHeader>
            <CardContent><TrendAreaChart data={data.monthlyMaintenanceCost as unknown as Record<string, unknown>[]} xKey="month"
              lines={[{ dataKey: "value", color: cyan, name: "Cost ($M)" }]} height={200} /></CardContent></Card>
        </div>

        {/* Row 6 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><BarChart3 className="h-4 w-4 text-purple" /> Cost Breakdown</CardTitle></CardHeader>
            <CardContent><TrendPieChart data={data.costBreakdown.map((item) => ({ name: item.category, value: item.value, color: item.color }))} height={240} innerRadius={50} outerRadius={80} /></CardContent></Card>
        </div>
      </section>

      {/* AI Performance Panel */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-primary" /> AI Performance
        </h2>
        <Card>
          <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {[
              { label: "Total AI Analyses", value: data.aiPerformance.totalAnalyses.toLocaleString(), icon: BrainCircuit, color: cyan },
              { label: "Avg. Confidence", value: `${data.aiPerformance.averageConfidence}%`, icon: TrendingUp, color: green },
              { label: "Prediction Accuracy", value: `${data.aiPerformance.predictionAccuracy}%`, icon: ShieldCheck, color: cyan },
              { label: "Detected Defects", value: data.aiPerformance.detectedDefects.toLocaleString(), icon: AlertTriangle, color: amber },
              { label: "False Positives", value: data.aiPerformance.falsePositives.toString(), icon: XCircle, color: red },
              { label: "False Negatives", value: data.aiPerformance.falseNegatives.toString(), icon: XCircle, color: red },
              { label: "Avg. Processing Time", value: data.aiPerformance.averageProcessingTime, icon: Clock, color: blue },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${item.color}15` }}>
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Procurement Analytics */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
          <PackageSearch className="h-4 w-4 text-primary" /> Procurement Analytics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Purchase Orders" value={data.procurementAnalytics.purchaseOrders.toString()} icon={<PackageSearch className="h-5 w-5" />} iconAccent="cyan" trend="neutral" />
          <StatCard label="Total Procurement Cost" value={fmtCurrency(data.procurementAnalytics.totalCost)} icon={<DollarSign className="h-5 w-5" />} iconAccent="red" trend="neutral" />
          <StatCard label="Avg. Delivery Time" value={data.procurementAnalytics.averageDeliveryDays.toString()} unit="days" icon={<Clock className="h-5 w-5" />} iconAccent="amber" trend="neutral" />
          <StatCard label="Cost Savings" value={fmtCurrency(data.procurementAnalytics.costSavings)} icon={<TrendingUp className="h-5 w-5" />} iconAccent="green" trend="up" delta={data.procurementAnalytics.costSavings > 400000 ? 12.5 : 0} />
        </div>
        <div className="mt-4 glass-card rounded-xl">
          <div className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Top Suppliers</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {data.procurementAnalytics.topSuppliers.map((s) => (
                <div key={s.name} className="rounded-lg border border-border/40 bg-white/[0.02] p-4 text-center">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{s.orders}</p>
                  <p className="text-xs text-muted-foreground">orders placed</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={cn("h-2 w-2 rounded-full", i < Math.round(s.rating) ? "bg-primary" : "bg-muted")} />
                    ))}
                    <span className="ml-1 text-xs text-muted-foreground">{s.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Performance Table */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
          <Plane className="h-4 w-4 text-primary" /> Fleet Performance
        </h2>
        <div className="glass-card rounded-xl overflow-hidden">
          <Table columns={fleetColumns} data={data.fleetPerformance} keyExtractor={(r) => r.tailNumber} />
        </div>
      </section>
    </div>
  );
}