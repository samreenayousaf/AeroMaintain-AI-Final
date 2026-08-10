import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";
import { Shield, Eye, EyeOff, RefreshCw, Fingerprint, Clock, Monitor, Smartphone, Laptop, LogOut, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsService } from "../data";
import type { ActiveSession } from "../data";

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
  if (!label) return inner;
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

export function SecuritySection() {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [loginHistory, setLoginHistory] = useState<Array<{timestamp:string;device:string;location:string;ip:string;success:boolean}>>([]);
  const [loginHistoryLoading, setLoginHistoryLoading] = useState(true);

  useEffect(() => {
    settingsService.getActiveSessions().then(d => { setSessions(d); setSessionsLoading(false); });
    settingsService.getLoginHistory().then(d => { setLoginHistory(d); setLoginHistoryLoading(false); });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><Shield className="h-5 w-5 text-primary" />Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Current Password</label>
              <Input type={showPassword?"text":"password"} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <div className="relative">
                <Input type={showPassword?"text":"password"} />
                <button type="button" onClick={()=>setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={showPassword?"Hide passwords":"Show passwords"}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Update Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><Fingerprint className="h-5 w-5 text-primary" />Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Toggle label="Authenticator App" description="Use an authenticator app like Google Authenticator or Authy"
            checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" />Session Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Session Timeout (minutes)</label>
              <Select options={[{value:"15",label:"15 minutes"},{value:"30",label:"30 minutes"},{value:"60",label:"1 hour"},{value:"120",label:"2 hours"},{value:"240",label:"4 hours"}]}
                value={sessionTimeout} onChange={e=>setSessionTimeout(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3"><Monitor className="h-5 w-5 text-primary" />Active Sessions</CardTitle>
              <CardDescription>Sessions across your devices.</CardDescription>
            </div>
            <Button variant="outline" size="sm"><LogOut className="mr-1.5 h-4 w-4" /> Revoke All</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : sessions.map(s=>(
            <div key={s.id} className={cn("flex items-center justify-between rounded-lg border px-4 py-3", s.current?"border-primary/30 bg-primary/5":"border-border/50")}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {s.device.toLowerCase().includes("iphone")||s.device.toLowerCase().includes("phone")
                    ? <Smartphone className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {s.device}{s.current && <span className="ml-2 text-xs text-primary">(current)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.browser} · {s.location}</p>
                </div>
              </div>
              {!s.current && <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">Revoke</Button>}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" />Login History</CardTitle>
          <CardDescription>Recent login attempts to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["Timestamp","Device & Browser","Location","IP Address","Status"].map(h=>(
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground last:text-center">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loginHistoryLoading ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></td></tr>
                ) : loginHistory.map((l,i)=>(
                  <tr key={i} className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/20">
                    <td className="px-4 py-2.5 text-sm text-foreground">{formatDateTime(l.timestamp)}</td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground">{l.device}</td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground">{l.location}</td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground font-mono">{l.ip}</td>
                    <td className="px-4 py-2.5 text-center">
                      {l.success ? <CheckCircle2 className="inline h-4 w-4 text-success" /> : <XCircle className="inline h-4 w-4 text-destructive" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}