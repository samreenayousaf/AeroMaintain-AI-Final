import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, type TableColumn } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/format";
import type { SettingsUser } from "../data";
import { settingsService } from "../data";
import { ClipboardList, ChevronRight, Plus } from "lucide-react";

export function UsersSection() {
  const [users, setUsers] = useState<SettingsUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsService.getUsers().then(d => { setUsers(d); setLoading(false); });
  }, []);

  const roleStyles: Record<string,string> = {
    admin:"bg-cyan-500/20 text-cyan-400", manager:"bg-blue-500/20 text-blue-400",
    mechanic:"bg-amber-500/20 text-amber-400", procurement_officer:"bg-violet-500/20 text-violet-400",
    executive:"bg-emerald-500/20 text-emerald-400",
  };

  const columns: TableColumn<SettingsUser>[] = [
    { key:"user", header:"User",
      render:(u)=>(
        <div className="flex items-center gap-3">
          <Avatar name={u.full_name} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{u.full_name}</p>
            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key:"role", header:"Role",
      render:(u)=>(
        <span className={cn("inline-flex rounded-md px-2.5 py-0.5 text-xs font-medium capitalize",roleStyles[u.role]||"bg-muted text-muted-foreground")}>
          {u.role.replace("_"," ")}
        </span>
      ),
    },
    { key:"department", header:"Department",
      render:(u)=><span className="text-sm text-muted-foreground">{u.department}</span>,
    },
    { key:"status", header:"Status",
      render:(u)=><Badge variant={u.status==="active"?"success":u.status==="inactive"?"secondary":"destructive"}>{u.status}</Badge>,
    },
    { key:"last_login", header:"Last Login",
      render:(u)=><span className="text-sm text-muted-foreground">{timeAgo(u.last_login)}</span>,
    },
    { key:"actions", header:"", render:()=><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>, className:"w-12" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3"><ClipboardList className="h-5 w-5 text-primary" />Users & Roles</CardTitle>
              <CardDescription>Manage team members, assign roles, and control access.</CardDescription>
            </div>
            <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add User</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table columns={columns} data={users} keyExtractor={u=>u.id} isLoading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}