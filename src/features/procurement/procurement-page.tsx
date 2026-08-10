import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Table, type TableColumn } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatCurrency } from "@/lib/utils";
import {
  procurementService,
  FILTER_OPTIONS,
  formatDeliveryDays,
  formatStockLabel,
  stockBadgeVariant,
  type ProcurementSupplier,
  type ProcurementFilter,
  type SortOption,
  type ProcurementAiRecommendation,
} from "./data";
import {
  Truck,
  CheckCircle2,
  Shield,
  Package,
  Building2,
  Star,
  Clock,
  Zap,
  X,
  ArrowRight,
  Scale,
  Wallet,
} from "lucide-react";

/* ── Price bar ── */
function PriceBar({ price, maxPrice }: { price: number; maxPrice: number }) {
  const isBest = price <= maxPrice;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", isBest ? "bg-success shadow-[0_0_6px_rgba(16,185,129,0.4)]" : "bg-primary/40")}
          style={{ width: `${(price / maxPrice) * 100}%` }}
        />
      </div>
      <span className={cn("text-xs font-semibold tabular-nums w-16 text-right", isBest && "text-success")}>
        {formatCurrency(price)}
      </span>
    </div>
  );
}

/* ── Main Page ── */

export function ProcurementPage() {
  const [suppliers, setSuppliers] = useState<ProcurementSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("best_match");
  const [filters, setFilters] = useState<Partial<ProcurementFilter>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [aiRec, setAiRec] = useState<ProcurementAiRecommendation | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [quantity, setQuantity] = useState(2);

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await procurementService.getSuppliers(filters, sort, supplierSearch);
      setSuppliers(data);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, supplierSearch]);

  useEffect(() => { loadSuppliers(); }, [loadSuppliers]);

  useEffect(() => {
    setAiLoading(true);
    procurementService.getAiRecommendation("PN-48213").then((rec) => {
      setAiRec(rec);
      setAiLoading(false);
    });
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectedSuppliers = suppliers.filter((s) => selectedIds.includes(s.id));
  const maxPrice = Math.max(...selectedSuppliers.map((s) => s.unitPrice), 1);
  const selectedForPurchase = selectedSuppliers.length > 0 ? selectedSuppliers[0] : null;

  const columns: TableColumn<ProcurementSupplier>[] = [
    {
      key: "select",
      header: "",
      render: (row) => (
        <button type="button" onClick={(e) => { e.stopPropagation(); toggleSelect(row.id); }}
          className={cn("flex h-5 w-5 items-center justify-center rounded border transition-colors cursor-pointer",
            selectedIds.includes(row.id) ? "border-primary bg-primary text-primary-foreground" : "border-border/50 hover:border-primary/50")}
          aria-label={`Select ${row.name}`}>
          {selectedIds.includes(row.id) && <CheckCircle2 className="h-3.5 w-3.5" />}
        </button>
      ),
      className: "w-10",
    },
    {
      key: "supplier", header: "Supplier",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{row.logo}</div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />{row.manufacturer}<span className="mx-1">·</span>{row.region}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "part", header: "Part",
      render: (row) => (<div><p className="text-xs font-medium text-foreground">{row.partNumber}</p><p className="text-xs text-muted-foreground truncate max-w-[140px]">{row.partDescription}</p></div>),
    },
    {
      key: "price", header: "Price", sortable: true,
      render: (row) => (<span className="font-semibold tabular-nums text-foreground">{formatCurrency(row.unitPrice)}</span>),
    },
    {
      key: "stock", header: "Stock", sortable: true,
      render: (row) => (<Badge variant={stockBadgeVariant(row.status)}>{formatStockLabel(row.stockQty)}</Badge>),
    },
    {
      key: "delivery", header: "Delivery", sortable: true,
      render: (row) => (<div className="flex items-center gap-1.5 text-sm text-foreground"><Clock className="h-3.5 w-3.5 text-muted-foreground" />{formatDeliveryDays(row.deliveryDays)}</div>),
    },
    {
      key: "rating", header: "Rating", sortable: true,
      render: (row) => (<div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" /><span className="text-sm font-medium tabular-nums">{row.rating.toFixed(1)}</span></div>),
    },
    {
      key: "cert", header: "Cert.",
      render: (row) => (<div className="flex flex-wrap gap-1">{row.certifications.map((c) => (<span key={c} className="inline-flex items-center rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{c}</span>))}</div>),
    },
  ];

  const [poCreatedMsg, setPoCreatedMsg] = useState<{ id: string; supplier: string; total: number; type: string } | null>(null);

  const handleCreatePO = (type = "Purchase Order", supplierName?: string, price?: number) => {
    const targetSupplier = supplierName || selectedForPurchase?.name || "Honeywell Aerospace";
    const unitPrice = price || selectedForPurchase?.unitPrice || 4250;
    const total = unitPrice * quantity;
    const poId = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setPoCreatedMsg({ id: poId, supplier: targetSupplier, total, type });
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <PageHeader
        title="Supplier Procurement"
        description="N427ET · Boeing 737-800 · Recommended: Hydraulic Actuator PN-48213"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="text-xs">Awaiting Quote</Badge>
            <Badge variant="destructive" className="text-xs">Priority: High</Badge>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="default" size="sm" onClick={() => handleCreatePO("Quote Request")}><Zap className="mr-1.5 h-4 w-4" /> Request Quote</Button>
        <Button variant="outline" size="sm" onClick={() => handleCreatePO("Purchase Order")}><Package className="mr-1.5 h-4 w-4" /> Create PO</Button>
        <Button variant="outline" size="sm" onClick={() => handleCreatePO("Approval Request")}><CheckCircle2 className="mr-1.5 h-4 w-4" /> Send for Approval</Button>
        <Button variant="ghost" size="sm" onClick={() => handleCreatePO("Draft Order")}>Save Draft</Button>
      </div>

      {/* Search & Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Search Suppliers</label>
            <SearchInput value={supplierSearch} onChange={setSupplierSearch} placeholder="Search by name, part, or manufacturer…" className="bg-white/[0.02] border-border/40" />
          </div>
          <div className="w-40"><label className="mb-1.5 block text-xs font-medium text-muted-foreground">Availability</label>
            <Select value={filters.availability ?? "all"} onChange={(e) => setFilters((f) => ({ ...f, availability: e.target.value }))} options={FILTER_OPTIONS.availability} /></div>
          <div className="w-36"><label className="mb-1.5 block text-xs font-medium text-muted-foreground">Delivery</label>
            <Select value={filters.deliveryTime ?? "all"} onChange={(e) => setFilters((f) => ({ ...f, deliveryTime: e.target.value }))} options={FILTER_OPTIONS.deliveryTime} /></div>
          <div className="w-32"><label className="mb-1.5 block text-xs font-medium text-muted-foreground">Rating</label>
            <Select value={filters.rating ?? "all"} onChange={(e) => setFilters((f) => ({ ...f, rating: e.target.value }))} options={FILTER_OPTIONS.rating} /></div>
          <div className="w-36"><label className="mb-1.5 block text-xs font-medium text-muted-foreground">Region</label>
            <Select value={filters.region ?? "all"} onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))} options={FILTER_OPTIONS.region} /></div>
          <div className="w-36"><label className="mb-1.5 block text-xs font-medium text-muted-foreground">Sort By</label>
            <Select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} options={FILTER_OPTIONS.sort} /></div>
          {(filters.availability || filters.deliveryTime || filters.rating || filters.region) && (
            <Button variant="ghost" size="sm" onClick={() => { setFilters({}); setSort("best_match"); }} className="mb-0.5"><X className="mr-1 h-3 w-3" /> Clear</Button>)}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: Supplier Table */}
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Supplier Results</CardTitle>
                <span className="text-xs text-muted-foreground">{loading ? "Loading…" : `${suppliers.length} suppliers found`}</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table columns={columns} data={suppliers} keyExtractor={(r) => r.id} isLoading={loading}
                emptyState={<EmptyState icon={<Truck className="h-8 w-8" />} title="No suppliers found" description="Try adjusting filters or search terms." />}
                onRowClick={(row) => toggleSelect(row.id)} />
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          {aiLoading ? (
            <Card><CardContent className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />AI analyzing suppliers…
              </div>
            </CardContent></Card>
          ) : aiRec && (
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10"><Zap className="h-3.5 w-3.5 text-primary" /></div>
                    <CardTitle className="text-sm">AI Recommendation</CardTitle>
                  </div>
                  <Badge variant="success" className="text-xs">94% Confidence</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-lg bg-success/5 p-3 border border-success/10">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <div><p className="text-sm font-semibold text-foreground">{aiRec.recommendedSupplier}</p><p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{aiRec.reason}</p></div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-white/[0.02] p-3">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div><p className="text-sm font-medium text-foreground">Alternative: {aiRec.alternativeSupplier}</p><p className="text-xs text-muted-foreground mt-0.5">{aiRec.alternativeReason}</p></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card rounded-lg p-3 text-center bg-white/[0.02]">
                      <Wallet className="mx-auto mb-1 h-4 w-4 text-success" />
                      <p className="text-xs text-muted-foreground">Est. Savings</p>
                      <p className="text-sm font-bold text-success">{formatCurrency(aiRec.estimatedSavings)}</p>
                    </div>
                    <div className="glass-card rounded-lg p-3 text-center bg-white/[0.02]">
                      <Shield className="mx-auto mb-1 h-4 w-4 text-blue-400" />
                      <p className="text-xs text-muted-foreground">Risk</p>
                      <Badge variant={aiRec.riskAssessment === "low" ? "success" : aiRec.riskAssessment === "medium" ? "warning" : "destructive"} className="mt-1 text-xs">
                        {aiRec.riskAssessment === "low" ? "Low Risk" : aiRec.riskAssessment === "medium" ? "Medium" : "High"}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Compare + Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Scale className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-sm">Compare</CardTitle></div>
                {selectedIds.length > 0 && <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="h-6 text-xs"><X className="mr-1 h-3 w-3" /> Clear</Button>}
              </div>
            </CardHeader>
            <CardContent>
              {selectedIds.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center"><Scale className="mb-2 h-8 w-8 text-muted-foreground/40" /><p className="text-xs text-muted-foreground">Select suppliers from the table to compare pricing & delivery side by side.</p></div>
              ) : (
                <div className="space-y-3">
                  {selectedSuppliers.map((s) => {
                    const isRecommended = aiRec?.recommendedSupplier === s.name;
                    return (
                      <div key={s.id} className={cn("rounded-lg border p-3 transition-colors", isRecommended ? "border-primary/30 bg-primary/5" : "border-border/40")}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">{s.logo}</div>
                            <span className="text-sm font-medium">{s.name}</span>
                          </div>
                          {isRecommended && <Badge variant="success" className="text-[10px] px-1.5 py-0">AI Pick</Badge>}
                        </div>
                        <div className="space-y-1.5 text-xs text-muted-foreground">
                          <PriceBar price={s.unitPrice} maxPrice={maxPrice} />
                          <div className="flex justify-between"><span>Delivery</span><span className="text-foreground">{formatDeliveryDays(s.deliveryDays)}</span></div>
                          <div className="flex justify-between"><span>Stock</span><span className="text-foreground">{formatStockLabel(s.stockQty)}</span></div>
                          <div className="flex justify-between"><span>Rating</span><span className="flex items-center gap-1 text-foreground"><Star className="h-3 w-3 fill-warning text-warning" />{s.rating.toFixed(1)}</span></div>
                          <div className="flex justify-between"><span>Warranty</span><span className="text-foreground">{s.warrantyMonths} mo</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedForPurchase && (
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2"><Package className="h-4 w-4 text-primary" /><CardTitle className="text-sm">Purchase Summary</CardTitle></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Supplier</span><span className="font-medium">{selectedForPurchase.name}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Part</span><span className="font-medium">{selectedForPurchase.partNumber}</span></div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-6 w-6 items-center justify-center rounded border border-border/50 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" aria-label="Decrease quantity">−</button>
                    <span className="w-6 text-center font-medium tabular-nums">{quantity}</span>
                    <button type="button" onClick={() => setQuantity((q) => q + 1)} className="flex h-6 w-6 items-center justify-center rounded border border-border/50 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Unit Price</span><span className="tabular-nums">{formatCurrency(selectedForPurchase.unitPrice)}</span></div>
                <hr className="border-border/50" />
                <div className="flex items-center justify-between"><span className="text-sm font-semibold text-foreground">Total Cost</span><span className="text-lg font-bold text-primary tabular-nums">{formatCurrency(selectedForPurchase.unitPrice * quantity)}</span></div>
                <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Estimated Delivery</span><span>{formatDeliveryDays(selectedForPurchase.deliveryDays)}</span></div>
                <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Priority</span><Badge variant="destructive" className="text-[10px]">High</Badge></div>
                <div className="pt-2 space-y-2">
                  <Button className="w-full" size="sm" onClick={() => handleCreatePO("Purchase Order", selectedForPurchase.name, selectedForPurchase.unitPrice)}>
                    <Zap className="mr-1.5 h-4 w-4" /> Create Purchase Order
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCreatePO("Quote Request", selectedForPurchase.name, selectedForPurchase.unitPrice)}>Request Quote</Button>
                    <Button variant="outline" size="sm" onClick={() => handleCreatePO("Draft Order", selectedForPurchase.name, selectedForPurchase.unitPrice)}>Save Draft</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* PO Confirmation Toast */}
      {poCreatedMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-success/40 bg-slate-900/95 p-4 text-foreground shadow-2xl backdrop-blur-md animate-slide-up">
          <CheckCircle2 className="h-6 w-6 text-success shrink-0" />
          <div className="space-y-0.5">
            <p className="text-sm font-semibold">{poCreatedMsg.type} {poCreatedMsg.id} Created!</p>
            <p className="text-xs text-muted-foreground">
              Issued to <span className="font-medium text-foreground">{poCreatedMsg.supplier}</span> for{" "}
              <span className="font-bold text-success">{formatCurrency(poCreatedMsg.total)}</span> (Status: Submitted)
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setPoCreatedMsg(null)} className="ml-2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}