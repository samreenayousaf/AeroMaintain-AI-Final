import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Building2, Save } from "lucide-react";

export function OrganizationSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><Building2 className="h-5 w-5 text-primary" />Organization Settings</CardTitle>
          <CardDescription>Update your organization details and regional preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Organization Name</label>
              <Input defaultValue="AeroMaintain Operations" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">ICAO Code</label>
              <Input defaultValue="AMO" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fleet Size</label>
              <Input defaultValue="120" type="number" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Company Address</label>
              <Input defaultValue="2500 Aviation Blvd, Hangar 7, JFK International Airport" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Country</label>
              <Select options={[
                {value:"us",label:"United States"},{value:"uk",label:"United Kingdom"},
                {value:"de",label:"Germany"},{value:"ae",label:"UAE"},{value:"sg",label:"Singapore"},
              ]} defaultValue="us" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Timezone</label>
              <Select options={[
                {value:"America/New_York",label:"America/New_York (EST)"},{value:"America/Chicago",label:"America/Chicago (CST)"},
                {value:"America/Los_Angeles",label:"America/Los_Angeles (PST)"},{value:"Europe/London",label:"Europe/London (GMT)"},
                {value:"Asia/Dubai",label:"Asia/Dubai (GST)"},
              ]} defaultValue="America/New_York" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Language</label>
              <Select options={[
                {value:"en",label:"English (US)"},{value:"en-gb",label:"English (UK)"},
                {value:"de",label:"Deutsch"},{value:"fr",label:"Français"},{value:"es",label:"Español"},
              ]} defaultValue="en" />
            </div>
          </div>
          <div className="mt-6 flex justify-end border-t border-border pt-6">
            <Button><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}