import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Puzzle, Wifi, AlertTriangle, Globe, Server, CheckCircle2 } from "lucide-react";

function StatusDot({ status }: { status: "connected" | "not_configured" | "error" | "partial" }) {
  const colors: Record<string, string> = {
    connected: "bg-success shadow-[0_0_6px_rgba(16,185,129,0.5)]",
    not_configured: "bg-muted-foreground",
    error: "bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.5)]",
    partial: "bg-warning shadow-[0_0_6px_rgba(245,158,11,0.5)]",
  };
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", colors[status])} />;
}

export function IntegrationsSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><Puzzle className="h-5 w-5 text-primary" />API Integrations</CardTitle>
          <CardDescription>Connect third-party services to extend platform capabilities.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/50 p-5 transition-all hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400"><Wifi className="h-5 w-5" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Speechmatics</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">Real-time speech-to-text for voice inspections</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      <StatusDot status="not_configured" /> Not Configured
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 p-5 transition-all hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400"><AlertTriangle className="h-5 w-5" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Featherless AI</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">LLM-powered root cause analysis & defect detection</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      <StatusDot status="not_configured" /> Not Configured
                    </span>
                    <Select options={[{value:"deepseek",label:"DeepSeek"},{value:"qwen",label:"Qwen"},{value:"mistral",label:"Mistral"}]}
                      defaultValue="deepseek" className="h-8 w-32 text-xs" />
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 p-5 transition-all hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400"><Globe className="h-5 w-5" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Bright Data</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">Supplier catalog enrichment & market intelligence</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      <StatusDot status="not_configured" /> Not Configured
                    </span>
                    <Badge variant="outline" className="text-xs">Supplier Sync: Off</Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 p-5 transition-all hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400"><Server className="h-5 w-5" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Supabase</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">Database, authentication, realtime & edge functions</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/20 px-2.5 py-0.5 text-xs font-medium text-success">
                      <StatusDot status="connected" /> Connected
                    </span>
                    <span className="text-xs text-muted-foreground">Project: cjawctzikzmotjzfmkdo</span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> DB Online</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> Realtime Active</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">Dashboard</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}