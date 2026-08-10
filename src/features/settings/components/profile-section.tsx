import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { User, Save } from "lucide-react";

export function ProfileSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><User className="h-5 w-5 text-primary" />Profile Information</CardTitle>
          <CardDescription>Manage your personal details and contact information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">
            <Avatar name="Alex Martinez" size="xl" />
            <div>
              <Button variant="outline" size="sm">Change Photo</Button>
              <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or WEBP. 1MB max.</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input defaultValue="Alex Martinez" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input defaultValue="alex@aeromaintain.io" type="email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone</label>
              <Input defaultValue="+1 (212) 555-0142" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Job Title</label>
              <Input defaultValue="Fleet Operations Director" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Department</label>
              <Select options={[
                {value:"operations",label:"Operations"},{value:"engineering",label:"Engineering"},
                {value:"maintenance",label:"Maintenance"},{value:"supply-chain",label:"Supply Chain"},
                {value:"quality",label:"Quality"},{value:"executive",label:"Executive"},
              ]} defaultValue="operations" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Employee ID</label>
              <Input defaultValue="EMP-1001" disabled className="opacity-60" />
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