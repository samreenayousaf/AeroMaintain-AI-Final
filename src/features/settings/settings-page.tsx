import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Building2, Shield, Cpu } from "lucide-react";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account, organization, and integrations."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="organization"><Building2 className="mr-2 h-4 w-4" /> Organization</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-2 h-4 w-4" /> Security</TabsTrigger>
          <TabsTrigger value="ai-services"><Cpu className="mr-2 h-4 w-4" /> AI Services</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input defaultValue="Alex Martinez" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input defaultValue="alex@airline.com" type="email" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Organization Name</label>
                  <Input defaultValue="Global Airline Corp" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">ICAO Code</label>
                  <Input defaultValue="GAC" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Current Password</label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">New Password</label>
                  <Input type="password" />
                </div>
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-services">
          <Card>
            <CardHeader>
              <CardTitle>AI Services Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Speechmatics (STT)", status: "not configured", key: "SPEECHMATICS_API_KEY" },
                { name: "Featherless AI (LLM)", status: "not configured", key: "FEATHERLESS_API_KEY" },
                { name: "Bright Data (Suppliers)", status: "not configured", key: "BRIGHTDATA_API_KEY" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">Key: {s.key}</p>
                  </div>
                  <span className="text-xs rounded-full bg-muted px-3 py-1 text-muted-foreground capitalize">
                    {s.status}
                  </span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                API keys are stored securely in Supabase Secret Manager and never exposed client-side.
                Configure them when the backend integration phase begins.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}