import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrainCircuit, AlertTriangle, Activity, Clock, TrendingUp, Shield, Zap, ArrowRight, BarChart3 } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";

export function AnalysisPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Analysis"
        description="Root-cause analysis, failure prediction, and recommended actions."
        actions={
          <Button variant="default" size="sm">
            <Zap className="mr-1.5 h-4 w-4" /> Run New Analysis
          </Button>
        }
      />

      {/* ── AI Confidence Overview ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Models Active", value: "3", icon: BrainCircuit, color: "primary", detail: "Ensemble AI" },
          { label: "Total Analyses", value: "1,247", icon: BarChart3, color: "blue", detail: "This month" },
          { label: "Avg. Confidence", value: "94.2%", icon: TrendingUp, color: "green", detail: "+2.1% vs last month" },
          { label: "Critical Issues", value: "4", icon: AlertTriangle, color: "destructive", detail: "Requires attention" },
        ].map((s) => (
          <Card key={s.label}>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${s.color}/10 text-${s.color}`}>
                  <s.icon className={`h-4 w-4 ${s.color === 'primary' ? 'text-primary' : s.color === 'blue' ? 'text-blue-400' : s.color === 'green' ? 'text-success' : 'text-destructive'}`} />
                </div>
              </div>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Analysis Cards ── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Engine Vibration Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Activity className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <CardTitle>Engine #1 — Vibration Anomaly</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">N427ET · CFM56-7B</p>
                </div>
              </div>
              <Badge variant="warning" className="text-[10px]">82% confidence</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="glass-card rounded-lg p-4 bg-white/[0.02]">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-primary" /> Root Cause
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Fan blade #4 leading edge erosion with secondary imbalance in LPT stage 2.
                Vibration pattern consistent with progressive blade degradation over 320 flight hours.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-lg p-4 text-center bg-white/[0.02]">
                <div className="flex justify-center mb-2">
                  <ProgressRing value={34} size={56} strokeWidth={6} />
                </div>
                <p className="text-xs text-muted-foreground">Failure Probability</p>
                <p className="text-sm font-bold text-warning mt-1">34% in 50h</p>
              </div>
              <div className="glass-card rounded-lg p-4 text-center bg-white/[0.02]">
                <div className="flex justify-center mb-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Est. Downtime</p>
                <p className="text-sm font-bold text-foreground mt-1">18 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
              <Shield className="mt-0.5 h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Recommended Action</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Schedule borescope inspection within 50 flight hours. Replace fan blade 
                  if erosion exceeds OEM limit. Coordinate with CFM field service.
                </p>
                <Button size="sm" variant="link" className="h-auto p-0 mt-2 text-xs">
                  Create Work Order <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* APU Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle>APU — Start Cycle Time Increase</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">N882BA · GTCP131-9B</p>
                </div>
              </div>
              <Badge variant="destructive" className="text-[10px]">High risk</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="glass-card rounded-lg p-4 bg-white/[0.02]">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-primary" /> Root Cause
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Battery voltage drop combined with starter motor brush wear. 
                Start cycle time increased 40% over baseline. Two consecutive 
                start failures recorded.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-lg p-4 text-center bg-white/[0.02]">
                <div className="flex justify-center mb-2">
                  <ProgressRing value={67} size={56} strokeWidth={6} />
                </div>
                <p className="text-xs text-muted-foreground">Failure Probability</p>
                <p className="text-sm font-bold text-destructive mt-1">67% imminent</p>
              </div>
              <div className="glass-card rounded-lg p-4 text-center bg-white/[0.02]">
                <div className="flex justify-center mb-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Est. Downtime</p>
                <p className="text-sm font-bold text-foreground mt-1">4 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/[0.03] p-4">
              <Shield className="mt-0.5 h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Recommended Action</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Replace starter motor immediately. Test battery and replace if below 
                  80% capacity. Inspect APU gearbox for debris.
                </p>
                <Button size="sm" variant="link" className="h-auto p-0 mt-2 text-xs text-destructive">
                  Escalate <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Prediction Timeline ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            AI Prediction Timeline — Next 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {[
              { day: "Today", event: "N427ET — Engine #1 vibration monitoring", severity: "warning", time: "14:30" },
              { day: "Tomorrow", event: "N882BA — APU maintenance window", severity: "critical", time: "08:00" },
              { day: "In 3 days", event: "N395JL — Landing gear inspection due", severity: "info", time: "10:00" },
              { day: "In 5 days", event: "N712CF — Fuel system calibration", severity: "success", time: "09:00" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-border/40 p-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-20 text-xs text-muted-foreground font-medium">{item.day}</div>
                <div className="flex-1 text-sm text-foreground">{item.event}</div>
                <Badge variant={
                  item.severity === 'critical' ? 'destructive' : 
                  item.severity === 'warning' ? 'warning' : 
                  item.severity === 'info' ? 'info' : 'success'
                } className="text-[10px] capitalize">
                  {item.severity}
                </Badge>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}