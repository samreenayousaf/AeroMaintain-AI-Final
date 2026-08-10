import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Save } from "lucide-react";

function Toggle({ checked, onChange, label, description }: {
  checked: boolean; onChange: (v: boolean) => void; label?: string; description?: string;
}) {
  const inner = (
    <button type="button" role="switch" aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", checked ? "bg-primary" : "bg-muted")}
    >
      <span className={cn("pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out", checked ? "translate-x-5" : "translate-x-0")} />
    </button>
  );
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {inner}
    </div>
  );
}

export function NotificationsSection() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifPush, setNotifPush] = useState(true);
  const [notifCritical, setNotifCritical] = useState(true);
  const [notifInspection, setNotifInspection] = useState(true);
  const [notifProcurement, setNotifProcurement] = useState(true);
  const [notifAiAnalysis, setNotifAiAnalysis] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><Bell className="h-5 w-5 text-primary" />Notification Preferences</CardTitle>
          <CardDescription>Control how you receive alerts and updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Notification Channels</h4>
            <div className="space-y-2">
              <Toggle label="Email Notifications" description="Receive notifications via email" checked={notifEmail} onChange={setNotifEmail} />
              <Toggle label="SMS Notifications" description="Receive SMS alerts for critical events" checked={notifSms} onChange={setNotifSms} />
              <Toggle label="Push Notifications" description="Receive in-app and browser push notifications" checked={notifPush} onChange={setNotifPush} />
            </div>
          </div>
          <div className="border-t border-border pt-6">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Alert Types</h4>
            <div className="space-y-2">
              <Toggle label="Critical Alerts" description="Safety-critical issues requiring immediate attention" checked={notifCritical} onChange={setNotifCritical} />
              <Toggle label="Inspection Alerts" description="Inspection completions, findings, and updates" checked={notifInspection} onChange={setNotifInspection} />
              <Toggle label="Procurement Alerts" description="Purchase orders, supplier updates, and stock alerts" checked={notifProcurement} onChange={setNotifProcurement} />
              <Toggle label="AI Analysis Alerts" description="Root cause analysis completions and recommendations" checked={notifAiAnalysis} onChange={setNotifAiAnalysis} />
            </div>
          </div>
          <div className="flex justify-end border-t border-border pt-6">
            <Button><Save className="mr-2 h-4 w-4" /> Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}