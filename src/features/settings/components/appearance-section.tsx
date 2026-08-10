import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Palette, Moon, Sun, Check } from "lucide-react";

function Toggle({ checked, onChange, label, description }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; description?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <button type="button" role="switch" aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", checked ? "bg-primary" : "bg-muted")}
      >
        <span className={cn("pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out", checked ? "translate-x-5" : "translate-x-0")} />
      </button>
    </div>
  );
}

export function AppearanceSection() {
  const [darkMode, setDarkMode] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("America/New_York");

  const ThemeCard = ({icon:Icon,label,selected,onClick}:{icon:React.ComponentType<{className?:string}>;label:string;selected:boolean;onClick:()=>void}) => (
    <button type="button" onClick={onClick}
      className={cn("flex flex-col items-center gap-2 rounded-lg border p-4 transition-all duration-150 cursor-pointer", selected?"border-primary bg-primary/10":"border-border/50 hover:border-border hover:bg-muted/30")}>
      <Icon className={cn("h-6 w-6",selected?"text-primary":"text-muted-foreground")} />
      <span className={cn("text-sm font-medium",selected?"text-primary":"text-foreground")}>{label}</span>
      {selected && <Check className="h-4 w-4 text-primary" />}
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><Palette className="h-5 w-5 text-primary" />Appearance</CardTitle>
          <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Theme</h4>
            <div className="grid grid-cols-2 gap-4 sm:w-72">
              <ThemeCard icon={Moon} label="Dark Mode" selected={darkMode} onClick={()=>setDarkMode(true)} />
              <ThemeCard icon={Sun} label="Light Mode" selected={!darkMode} onClick={()=>setDarkMode(false)} />
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Display Options</h4>
            <div className="space-y-2">
              <Toggle label="Compact Mode" description="Reduce spacing for a denser layout" checked={compactMode} onChange={setCompactMode} />
              <Toggle label="Sidebar Collapse" description="Keep the sidebar collapsed by default" checked={sidebarCollapsed} onChange={setSidebarCollapsed} />
            </div>
          </div>
          <div className="border-t border-border pt-6">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Regional</h4>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Language</label>
                <Select options={[
                  {value:"en",label:"English (US)"},{value:"en-gb",label:"English (UK)"},
                  {value:"de",label:"Deutsch"},{value:"fr",label:"Français"},{value:"es",label:"Español"},
                ]} value={language} onChange={e=>setLanguage(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Timezone</label>
                <Select options={[
                  {value:"America/New_York",label:"America/New_York (EST)"},{value:"America/Chicago",label:"America/Chicago (CST)"},
                  {value:"America/Los_Angeles",label:"America/Los_Angeles (PST)"},{value:"Europe/London",label:"Europe/London (GMT)"},
                  {value:"Asia/Dubai",label:"Asia/Dubai (GST)"},
                ]} value={timezone} onChange={e=>setTimezone(e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}