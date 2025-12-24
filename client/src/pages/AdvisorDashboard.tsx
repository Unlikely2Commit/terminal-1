import { 
  LayoutDashboard, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Building2, 
  Briefcase,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface SankeyNode {
  id: string;
  label: string;
  count: number;
  status: "healthy" | "warning" | "critical";
  tooltip?: string;
}

interface CriticalTask {
  id: string;
  urgency: "CRITICAL" | "IMPORTANT" | "UPCOMING";
  client: string;
  description: string;
  reason: string;
  linkText: string;
}

// Mock Data
const MOMENTUM_STAGES: SankeyNode[] = [
  { id: "fact-find", label: "Fact Find", count: 14, status: "healthy" },
  { id: "recommendation", label: "Recommendation", count: 9, status: "warning", tooltip: "3 cases waiting for your approval" },
  { id: "soa-draft", label: "SR Draft", count: 6, status: "healthy" },
  { id: "file-check", label: "File Check", count: 5, status: "critical", tooltip: "2 stalled cases" },
  { id: "provider", label: "Provider Processing", count: 7, status: "warning", tooltip: "4 delayed at provider" },
  { id: "completion", label: "Completion", count: 11, status: "healthy" },
];

const CRITICAL_TASKS: CriticalTask[] = [
  {
    id: "1",
    urgency: "CRITICAL",
    client: "Jane Parsons",
    description: "Approve fund switch recommendation",
    reason: "Provider waiting for confirmation. Workflow stalled at 'Recommendation Approval'.",
    linkText: "View client / Open workflow"
  },
  {
    id: "2",
    urgency: "CRITICAL",
    client: "Mark Hill",
    description: "Review and sign off Costs & Charges doc",
    reason: "Client cannot proceed with pension transfer until approved.",
    linkText: "View document"
  },
  {
    id: "3",
    urgency: "IMPORTANT",
    client: "Sarah Collins",
    description: "Respond to compliance query on SR",
    reason: "Compliance flagged a clarification. SLA: 1 day.",
    linkText: "View query"
  },
  {
    id: "4",
    urgency: "IMPORTANT",
    client: "Robert Thompson",
    description: "Confirm updated income details",
    reason: "FactFind auto-updated from meeting. Needs adviser confirmation.",
    linkText: "View profile"
  },
  {
    id: "5",
    urgency: "UPCOMING",
    client: "Emma Davis",
    description: "Book 6-month review",
    reason: "Next review due in 6 months. Not urgent.",
    linkText: "Schedule now"
  }
];

const BOTTLENECKS = [
  { stage: "Fact Find", you: "healthy", ops: "healthy", providers: "healthy", clients: "warning", note: "2 awaiting info" },
  { stage: "Recommendation", you: "critical", ops: "healthy", providers: "healthy", clients: "healthy", note: "3 approvals overdue" },
  { stage: "SR Draft", you: "healthy", ops: "healthy", providers: "healthy", clients: "healthy", note: "" },
  { stage: "File Check", you: "healthy", ops: "warning", providers: "healthy", clients: "healthy", note: "Backlog" },
  { stage: "Provider Processing", you: "healthy", ops: "healthy", providers: "critical", clients: "healthy", note: "Aviva & L&G delays" },
  { stage: "Completion", you: "healthy", ops: "healthy", providers: "healthy", clients: "healthy", note: "" },
];

function FlowNode({ label, count, color, onClick, isSelected, tooltip, className }: any) { // added className prop
    return (
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer z-10 bg-card group h-24 md:h-28", // Fluid height/width
          isSelected 
            ? "border-primary shadow-[0_0_15px_rgba(0,0,0,0.2)] shadow-primary/20 scale-105" 
            : "border-border/50 hover:border-primary/50 hover:bg-muted/30",
          className // Apply passed width classes
        )}
        onClick={onClick}
      >
        <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 md:mb-2 text-center leading-tight">{label}</span>
        <span className={cn("text-xl md:text-3xl font-bold", color)}>{count}</span>

        {/* Tooltip for Issues */}
        {tooltip && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max max-w-[150px] bg-popover border border-border px-2 py-1 rounded text-[10px] text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
            </div>
        )}
      </div>
    );
}

export default function AdvisorDashboard() {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-500 text-green-500";
      case "warning": return "bg-amber-500 text-amber-500";
      case "critical": return "bg-red-500 text-red-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-green-500";
      case "warning": return "text-amber-500";
      case "critical": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-500/20";
      case "warning": return "bg-amber-500/20";
      case "critical": return "bg-red-500/20";
      default: return "bg-muted/20";
    }
  };

  const getStatusMotionColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-500/40";
      case "warning": return "bg-amber-500/40";
      case "critical": return "bg-red-500/40";
      default: return "bg-muted/40";
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "CRITICAL": return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">CRITICAL</Badge>;
      case "IMPORTANT": return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">IMPORTANT</Badge>;
      case "UPCOMING": return <Badge variant="outline" className="text-muted-foreground">UPCOMING</Badge>;
      default: return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-background">
      {/* Header */}
      <div>
        <h1 className="font-semibold text-xl flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-primary" />
          Control
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Mission control for Woody</p>
      </div>

      {/* TOP: Workflow Momentum (Sankey-style) */}
      <Card className="overflow-hidden border-border bg-card/50">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium">Workflow Momentum</CardTitle>
              <CardDescription>Where your clients are in their journeys — and where cases are getting stuck.</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Flowing</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Delayed</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Bottleneck</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 pt-16 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[768px] w-full"> {/* min-w for mobile scroll, w-full for desktop expansion */}
            
            {MOMENTUM_STAGES.map((stage, index) => (
              <div key={stage.id} className={cn("flex items-center relative", index < MOMENTUM_STAGES.length - 1 ? "flex-1" : "")}> {/* Make items with connectors grow */}
                <FlowNode 
                    label={stage.label} 
                    count={stage.count} 
                    color={getStatusTextColor(stage.status)}
                    tooltip={stage.tooltip}
                    className="w-24 md:w-32 lg:w-40 shrink-0 z-10" // Responsive fixed widths
                />
                
                {/* Connector Line (if not last item) */}
                {index < MOMENTUM_STAGES.length - 1 && (
                    <div className={cn("h-1.5 md:h-2 flex-1 mx-2 md:mx-4 rounded-full relative overflow-hidden min-w-[20px]", getStatusBgColor(stage.status))}>
                        <motion.div 
                            className={cn("absolute inset-0", getStatusMotionColor(stage.status))} 
                            animate={{ x: ["-100%", "100%"] }} 
                            transition={{ duration: stage.status === "healthy" ? 1.5 : 3, repeat: Infinity, ease: "linear" }} 
                        />
                    </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MIDDLE: Critical Tasks */}
      <Card className="border-border bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
             <div>
                <CardTitle className="text-base font-medium">Critical Tasks</CardTitle>
                <CardDescription>Actions that are blocking client progress and need your attention.</CardDescription>
             </div>
             <div className="flex gap-1 bg-muted/30 p-1 rounded-lg">
                 <Button variant="ghost" size="sm" className="h-7 text-xs bg-background shadow-sm hover:bg-background">All</Button>
                 <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">Critical</Button>
                 <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">Important</Button>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
           <div className="divide-y divide-border/50">
              {CRITICAL_TASKS.map(task => (
                  <div key={task.id} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-4 group">
                      <div className="mt-0.5 shrink-0">
                          {task.urgency === "CRITICAL" ? <AlertCircle className="w-5 h-5 text-red-500" /> :
                           task.urgency === "IMPORTANT" ? <Clock className="w-5 h-5 text-amber-500" /> :
                           <Calendar className="w-5 h-5 text-muted-foreground" />
                          }
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                              {getUrgencyBadge(task.urgency)}
                              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                  <User className="w-3 h-3" /> {task.client}
                              </span>
                          </div>
                          <h4 className="text-base font-medium text-foreground mb-1">{task.description}</h4>
                          <p className="text-sm text-muted-foreground">{task.reason}</p>
                      </div>
                      <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="outline" className="gap-2">
                              {task.linkText} <ArrowRight className="w-3 h-3" />
                          </Button>
                      </div>
                  </div>
              ))}
           </div>
           <div className="p-2 border-t border-border/50 text-center">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground w-full">View all 12 tasks</Button>
           </div>
        </CardContent>
      </Card>

      {/* BOTTOM: Bottlenecks Heatmap */}
      <Card className="border-border bg-card/50">
         <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">Bottlenecks Overview</CardTitle>
            <CardDescription>Where your cases are slowing down — you, ops, providers, or clients.</CardDescription>
         </CardHeader>
         <CardContent>
             <div className="rounded-md border border-border overflow-hidden">
                 <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/30 border-b border-border">
                            <th className="py-3 px-4 text-left font-medium text-muted-foreground w-1/4">Stage</th>
                            <th className="py-3 px-4 text-left font-medium text-muted-foreground w-1/6">You</th>
                            <th className="py-3 px-4 text-left font-medium text-muted-foreground w-1/6">Ops</th>
                            <th className="py-3 px-4 text-left font-medium text-muted-foreground w-1/6">Providers</th>
                            <th className="py-3 px-4 text-left font-medium text-muted-foreground w-1/6">Clients</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {BOTTLENECKS.map((row, i) => (
                            <tr key={i} className="hover:bg-muted/10">
                                <td className="py-3 px-4 font-medium">{row.stage}</td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", getStatusColor(row.you).split(" ")[0])} />
                                        {row.you === "critical" && <span className="text-xs text-red-500 font-medium">{row.note}</span>}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", getStatusColor(row.ops).split(" ")[0])} />
                                        {row.ops === "warning" && <span className="text-xs text-amber-500 font-medium">{row.note}</span>}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", getStatusColor(row.providers).split(" ")[0])} />
                                        {row.providers === "critical" && <span className="text-xs text-red-500 font-medium">{row.note}</span>}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", getStatusColor(row.clients).split(" ")[0])} />
                                        {row.clients === "warning" && <span className="text-xs text-amber-500 font-medium">{row.note}</span>}
                                    </div>
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
