import { useState } from "react";
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  MoreHorizontal, 
  Command as CommandIcon, 
  Bot, 
  Workflow, 
  ShieldCheck, 
  MonitorCheck,
  User,
  FileText,
  Calendar
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Types
type ActivityType = "Command" | "Agent" | "Workflow" | "Compliance" | "System";
type ActivityStatus = "Completed" | "In Progress" | "Failed" | "Flagged";

interface ActivityItem {
  id: string;
  time: string;
  dateGroup: "Today" | "Yesterday" | "Last Week" | "Older";
  type: ActivityType;
  summary: string;
  context: string;
  user: string;
  status: ActivityStatus;
  details?: {
    fullCommand?: string;
    response?: string;
    steps?: string[];
    relatedEntity?: { type: string; name: string };
  };
}

// Mock Data
const MOCK_ACTIVITY: ActivityItem[] = [
  // Today
  {
    id: "1",
    dateGroup: "Today",
    time: "09:42",
    type: "Command",
    summary: "Started Pension Transfer workflow",
    context: "Client: Jane Parsons",
    user: "Sarah Evans",
    status: "Completed",
    details: {
      fullCommand: "Start a pension transfer for Jane Parsons",
      response: "Workflow started. I've initiated the transfer process and assigned the first task.",
      relatedEntity: { type: "Workflow", name: "Pension Transfer - Jane Parsons" }
    }
  },
  {
    id: "2",
    dateGroup: "Today",
    time: "09:15",
    type: "Agent",
    summary: "Provider Chase for Aviva advanced to Step 3",
    context: "Firm-wide",
    user: "System Agent",
    status: "In Progress",
    details: {
      steps: ["Call initiated", "Connected to agent", "Policy confirmed"],
      relatedEntity: { type: "Agent", name: "Provider Chase - Aviva" }
    }
  },
  {
    id: "3",
    dateGroup: "Today",
    time: "08:30",
    type: "System",
    summary: "Daily backup completed successfully",
    context: "System",
    user: "System",
    status: "Completed"
  },
  
  // Yesterday
  {
    id: "4",
    dateGroup: "Yesterday",
    time: "16:03",
    type: "Command",
    summary: "Summarise all meetings from yesterday",
    context: "Meetings",
    user: "Sarah Evans",
    status: "Completed",
    details: {
      fullCommand: "Summarise all meetings from yesterday",
      response: "Generated summaries for 3 meetings. 2 opportunities identified."
    }
  },
  {
    id: "5",
    dateGroup: "Yesterday",
    time: "15:20",
    type: "Compliance",
    summary: "File check flagged missing KYC",
    context: "Client: Sarah Collins",
    user: "Compliance Bot",
    status: "Flagged",
    details: {
        response: "Missing Photo ID for Sarah Collins. Flagged for review.",
        relatedEntity: { type: "Client", name: "Sarah Collins" }
    }
  },
  {
    id: "6",
    dateGroup: "Yesterday",
    time: "14:10",
    type: "Workflow",
    summary: "Annual Review pack generated",
    context: "Client: Mark Hill",
    user: "Sarah Evans",
    status: "Completed",
    details: {
        relatedEntity: { type: "Document", name: "Annual Review Pack 2024.pdf" }
    }
  },
  {
      id: "7",
      dateGroup: "Yesterday",
      time: "11:45",
      type: "Agent",
      summary: "Email Follow-up sent to Royal London",
      context: "Pension Transfer",
      user: "System Agent",
      status: "Completed"
  },

  // Last Week
  {
      id: "8",
      dateGroup: "Last Week",
      time: "Fri 10:00",
      type: "Compliance",
      summary: "Weekly Compliance Report Generated",
      context: "Firm-wide",
      user: "System",
      status: "Completed"
  },
  {
      id: "9",
      dateGroup: "Last Week",
      time: "Thu 14:30",
      type: "Command",
      summary: "Create new client profile",
      context: "Client: David Miller",
      user: "Sarah Evans",
      status: "Completed"
  },
  {
      id: "10",
      dateGroup: "Last Week",
      time: "Wed 09:15",
      type: "Agent",
      summary: "Market Update Agent run failed",
      context: "Investment Committee",
      user: "System Agent",
      status: "Failed",
      details: {
          response: "API Timeout Error (504) from Data Provider."
      }
  },
  {
      id: "11",
      dateGroup: "Last Week",
      time: "Tue 16:45",
      type: "Workflow",
      summary: "Onboarding Workflow completed",
      context: "Client: Emma Thompson",
      user: "Mark Hill",
      status: "Completed"
  },
  {
      id: "12",
      dateGroup: "Last Week",
      time: "Mon 11:00",
      type: "Command",
      summary: "Search for high-risk portfolios",
      context: "MI & Reporting",
      user: "Compliance Officer",
      status: "Completed"
  }
];

export default function ActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null);

  const filteredActivity = MOCK_ACTIVITY.filter(item => {
    if (searchQuery && !item.summary.toLowerCase().includes(searchQuery.toLowerCase()) && !item.context.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedType !== "all" && item.type !== selectedType) return false;
    return true;
  });

  // Group by Date
  const groupedActivity: Record<string, ActivityItem[]> = {
    "Today": filteredActivity.filter(i => i.dateGroup === "Today"),
    "Yesterday": filteredActivity.filter(i => i.dateGroup === "Yesterday"),
    "Last Week": filteredActivity.filter(i => i.dateGroup === "Last Week"),
  };

  const getIcon = (type: ActivityType) => {
      switch (type) {
          case "Command": return <CommandIcon className="w-4 h-4 text-primary" />;
          case "Agent": return <Bot className="w-4 h-4 text-purple-500" />;
          case "Workflow": return <Workflow className="w-4 h-4 text-blue-500" />;
          case "Compliance": return <ShieldCheck className="w-4 h-4 text-amber-500" />;
          case "System": return <MonitorCheck className="w-4 h-4 text-slate-500" />;
          default: return <Clock className="w-4 h-4" />;
      }
  };

  const getStatusColor = (status: ActivityStatus) => {
      switch (status) {
          case "Completed": return "text-green-500 bg-green-500/10 border-green-500/20";
          case "In Progress": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
          case "Flagged": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
          case "Failed": return "text-red-500 bg-red-500/10 border-red-500/20";
          default: return "text-muted-foreground bg-muted";
      }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur p-6 space-y-4 sticky top-0 z-10">
        <div>
            <h1 className="font-semibold text-xl">Activity Log</h1>
            <p className="text-sm text-muted-foreground">Full history of commands, actions, and agent activity across Terminal 1.</p>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative max-w-md flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by client, command, or keyword..." 
                    className="pl-9 bg-muted/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[150px] bg-muted/30">
                    <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Command">Commands</SelectItem>
                    <SelectItem value="Agent">Agents</SelectItem>
                    <SelectItem value="Workflow">Workflows</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                </SelectContent>
            </Select>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-[150px] bg-muted/30">
                    <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1 p-6 pt-2">
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {Object.entries(groupedActivity).map(([group, items]) => (
                items.length > 0 && (
                    <div key={group} className="space-y-3 animate-in slide-in-from-bottom-2 duration-500">
                        <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-2 z-0">{group}</h3>
                        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
                            {items.map((item, index) => (
                                <div 
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className={cn(
                                        "flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-muted/50",
                                        index !== items.length - 1 && "border-b border-border/50"
                                    )}
                                >
                                    <div className="w-16 text-xs font-mono text-muted-foreground shrink-0">{item.time}</div>
                                    
                                    <div className="w-8 flex justify-center shrink-0">
                                        {getIcon(item.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-medium text-sm truncate">{item.summary}</span>
                                            {item.type === "Command" && (
                                                <span className="text-xs text-muted-foreground bg-primary/5 px-1.5 rounded border border-primary/10">Command</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span>{item.context}</span>
                                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                                            <span>{item.user}</span>
                                        </div>
                                    </div>

                                    <div className="shrink-0">
                                        <Badge variant="outline" className={cn("font-normal", getStatusColor(item.status))}>
                                            {item.status}
                                        </Badge>
                                    </div>

                                    <div className="shrink-0 text-muted-foreground/50">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}
            
            {Object.values(groupedActivity).every(arr => arr.length === 0) && (
                <div className="text-center py-20 text-muted-foreground">
                    No activity found matching your filters.
                </div>
            )}
        </div>
      </ScrollArea>

      {/* Detail Sheet */}
      <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            {selectedItem && (
                <>
                    <SheetHeader className="mb-6">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            {getIcon(selectedItem.type)}
                            <span className="text-sm font-medium">{selectedItem.type}</span>
                            <span className="text-xs">• {selectedItem.time}, {selectedItem.dateGroup}</span>
                        </div>
                        <SheetTitle className="text-xl leading-normal">{selectedItem.summary}</SheetTitle>
                        <SheetDescription className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={cn("font-normal", getStatusColor(selectedItem.status))}>
                                {selectedItem.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">by {selectedItem.user}</span>
                        </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-6">
                        {selectedItem.details?.fullCommand && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Full Command</h4>
                                <div className="p-3 bg-primary/5 rounded-md text-sm border border-primary/10 font-mono">
                                    {selectedItem.details.fullCommand}
                                </div>
                            </div>
                        )}

                        {selectedItem.details?.response && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[10px]">System Response</h4>
                                <div className="p-3 bg-muted/30 rounded-md text-sm border border-border">
                                    {selectedItem.details.response}
                                </div>
                            </div>
                        )}

                        {selectedItem.details?.steps && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Execution Steps</h4>
                                <div className="space-y-2">
                                    {selectedItem.details.steps.map((step, i) => (
                                        <div key={i} className="flex gap-3 text-sm">
                                            <div className="flex flex-col items-center mt-1">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                {i !== selectedItem.details!.steps!.length - 1 && (
                                                    <div className="w-px h-4 bg-border mt-1" />
                                                )}
                                            </div>
                                            <span>{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[10px] mb-2">Context</h4>
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    {selectedItem.context}
                                </div>
                            </div>
                            {selectedItem.details?.relatedEntity && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[10px] mb-2">Related Entity</h4>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        {selectedItem.details.relatedEntity.name}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <SheetFooter className="mt-8">
                        <Button variant="outline" className="w-full" onClick={() => setSelectedItem(null)}>Close</Button>
                    </SheetFooter>
                </>
            )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
