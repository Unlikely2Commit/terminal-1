import { Link, useLocation } from "wouter";
import { Command, Workflow, Settings, Terminal, BarChart3, LayoutList, ShieldCheck, Bot, Users, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Command, label: "Command" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Control" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/agents", icon: Bot, label: "Agents" },
    { href: "/workflows", icon: Workflow, label: "Workflows" },
    { href: "/mi", icon: BarChart3, label: "MI" },
    { href: "/opportunities", icon: LayoutList, label: "Opportunities" },
    { href: "/compliance", icon: ShieldCheck, label: "Compliance" },
  ];

  return (
    <div className="h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-2">
        <div className="h-8 w-8 bg-primary text-primary-foreground rounded-md flex items-center justify-center font-bold font-mono text-lg">
          T1
        </div>
        <span className="font-semibold text-lg tracking-tight">Terminal 1</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground")} />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <Link href="/login">
          <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors hover:bg-sidebar-accent/50 rounded-md">
            <Terminal className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </div>
        </Link>
        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors hover:bg-sidebar-accent/50 rounded-md">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
