import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";

export function ApiKeysSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><Key className="h-5 w-5 text-primary" />API Keys</CardTitle>
          <CardDescription>Manage API keys for external integrations. Keys are stored in Supabase Secret Manager.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { service:"speechmatics", label:"Speechmatics", keyDisplay:"sk_••••••••••••••••", configured:false },
            { service:"featherless", label:"Featherless AI", keyDisplay:"fl_••••••••••••••••", configured:false },
            { service:"brightdata", label:"Bright Data", keyDisplay:"bd_••••••••••••••••", configured:false },
          ].map(k => (
            <div key={k.service} className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-all hover:border-border">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{k.label}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{k.keyDisplay}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${k.configured ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>
                  {k.configured ? "Configured" : "Not Set"}
                </span>
                <Button variant="outline" size="sm">{k.configured ? "Update" : "Set Key"}</Button>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            API keys are stored in Supabase Edge Function secrets and never exposed client-side.
            Use the Supabase dashboard to manage secrets directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}