import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Briefcase, 
  ChevronRight, 
  Activity, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Filter,
  LayoutGrid,
  List,
  Radar,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock Data Types
interface TriageItem {
  id: string;
  type: "Meeting" | "File" | "Client" | "New Business" | "Observation";
  title: string; // Client + Adviser
  reason: string;
  owner: "HITL" | "ADVISER" | "AUTO";
  priority: "Critical" | "High" | "Medium" | "Low";
  timestamp: string;
  actions: string[];
  status?: "running" | "completed"; // for animation
}

interface AdviserStat {
  id: string;
  name: string;
  filesReviewed: number;
  passRate: string;
  highRiskFlags: number;
  overdueReviews: number;
}

interface ActivityItem {
  id: string;
  time: string;
  description: string;
  type: "alert" | "background";
  isNew?: boolean; // for animation
}

interface MeetingStatus {
    adviser: string;
    status: "green" | "amber" | "red" | "checking";
    count: string;
    isNew?: boolean;
}

// Mock Data
const initialCriticalLane: TriageItem[] = [
  { 
    id: "c1", 
    type: "Meeting", 
    title: "Jane Parsons (Sarah Evans)", 
    reason: "Red flag on observation check: Missing risk discussion", 
    owner: "HITL", 
    priority: "Critical",
    timestamp: "10:30 AM",
    actions: ["Review meeting", "Escalate"]
  },
  { 
    id: "c2", 
    type: "File", 
    title: "Robert Fox (Priya Patel)", 
    reason: "Possible unsuitable advice flagged in final report", 
    owner: "HITL", 
    priority: "Critical",
    timestamp: "09:15 AM",
    actions: ["Open file check", "Escalate"]
  }
];

const initialTodayLane: TriageItem[] = [
  { 
    id: "t1", 
    type: "New Business", 
    title: "Mark Hill (Sarah Evans)", 
    reason: "Pension Transfer - Advice template deviation", 
    owner: "HITL", 
    priority: "High",
    timestamp: "11:45 AM",
    actions: ["Approve", "Send back"]
  },
  { 
    id: "t2", 
    type: "Observation", 
    title: "Julia Chen (James Wood)", 
    reason: "Amber flag: Fee disclosure was brief", 
    owner: "ADVISER", 
    priority: "Medium",
    timestamp: "10:00 AM",
    actions: ["Mark as OK", "Notify"]
  },
  { 
    id: "t3", 
    type: "File", 
    title: "David Miller (Sarah Evans)", 
    reason: "Incomplete client signature on illustration", 
    owner: "ADVISER", 
    priority: "Medium",
    timestamp: "Yesterday",
    actions: ["Send back"]
  }
];

const initialBackgroundLane: TriageItem[] = [
  { 
    id: "b1", 
    type: "File", 
    title: "Julia Chen (ISA Transfer)", 
    reason: "Missing KID – returned to adviser automatically", 
    owner: "AUTO", 
    priority: "Low",
    timestamp: "10 min ago",
    actions: [],
    status: "completed"
  },
  { 
    id: "b2", 
    type: "File", 
    title: "Robert Fox (Mortgage)", 
    reason: "Unsigned document – re-submission requested", 
    owner: "AUTO", 
    priority: "Low",
    timestamp: "30 min ago",
    actions: [],
    status: "completed"
  },
  { 
    id: "b3", 
    type: "Observation", 
    title: "Emma Wilson (Pension)", 
    reason: "Low-risk template deviation – adviser notified", 
    owner: "AUTO", 
    priority: "Low",
    timestamp: "1 hour ago",
    actions: [],
    status: "completed"
  }
];

const initialActivityFeed: ActivityItem[] = [
  { id: "1", time: "Just now", description: "Red flag on meeting with Jane Parsons (missing risk discussion).", type: "alert" },
  { id: "2", time: "5 min ago", description: "New business for Mark Hill flagged for suitability review.", type: "alert" },
  { id: "3", time: "10 min ago", description: "4 files auto-cleared after missing docs re-submitted.", type: "background" },
  { id: "4", time: "30 min ago", description: "Evidence pack generated for Q4 pension transfers.", type: "background" },
  { id: "5", time: "1 hour ago", description: "Compliance monthly report auto-generated.", type: "background" },
];

const adviserStats: AdviserStat[] = [
  { id: "1", name: "Sarah Evans", filesReviewed: 42, passRate: "94%", highRiskFlags: 2, overdueReviews: 1 },
  { id: "2", name: "James Wood", filesReviewed: 38, passRate: "89%", highRiskFlags: 5, overdueReviews: 8 },
  { id: "3", name: "Priya Patel", filesReviewed: 31, passRate: "97%", highRiskFlags: 1, overdueReviews: 0 },
  { id: "4", name: "Marcus Chen", filesReviewed: 25, passRate: "92%", highRiskFlags: 3, overdueReviews: 2 },
];

const initialMeetings: MeetingStatus[] = [
    { adviser: "Sarah Evans", status: "green", count: "3/3 green" },
    { adviser: "James Wood", status: "amber", count: "1 amber" },
    { adviser: "Priya Patel", status: "red", count: "1 red" },
];

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState("alerts");
  const [criticalItems, setCriticalItems] = useState<TriageItem[]>(initialCriticalLane);
  const [todayItems, setTodayItems] = useState<TriageItem[]>(initialTodayLane);
  const [backgroundItems, setBackgroundItems] = useState<TriageItem[]>(initialBackgroundLane);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>(initialActivityFeed);
  const [meetings, setMeetings] = useState<MeetingStatus[]>(initialMeetings);
  
  // Active Checks State
  const [activeChecks, setActiveChecks] = useState({
      observation: 7,
      file: 4,
      provider: 3
  });

  // Overall Status State
  const [overallStatus, setOverallStatus] = useState<{
      label: string;
      color: string;
      pulse: boolean;
  }>({
      label: "Attention Needed",
      color: "text-amber-500",
      pulse: true
  });

  // 1. Active Checks Simulation
  useEffect(() => {
      const interval = setInterval(() => {
          setActiveChecks(prev => {
              const change = Math.random() > 0.5 ? 1 : -1;
              const type = Math.random() > 0.6 ? 'observation' : Math.random() > 0.5 ? 'file' : 'provider';
              const newVal = Math.max(0, prev[type] + change);
              return { ...prev, [type]: newVal };
          });
      }, 3000);
      return () => clearInterval(interval);
  }, []);

  // 2. Background Lane Simulation
  useEffect(() => {
      const interval = setInterval(() => {
          const newItem: TriageItem = {
              id: Date.now().toString(),
              type: Math.random() > 0.5 ? "File" : "Observation",
              title: "Auto-Check (System)",
              reason: "Routine scan completed - no issues found",
              owner: "AUTO",
              priority: "Low",
              timestamp: "Just now",
              actions: [],
              status: "running"
          };
          
          setBackgroundItems(prev => [newItem, ...prev.slice(0, 4)]); // Keep recent 5
          
          // Reset status for animation after delay
          setTimeout(() => {
             setBackgroundItems(prev => prev.map(item => item.id === newItem.id ? { ...item, status: "completed" } : item));
          }, 2000);

      }, 15000);
      return () => clearInterval(interval);
  }, []);

  // 5. Live Activity Feed Simulation
  useEffect(() => {
      const interval = setInterval(() => {
          const events = [
              { description: "Observation check flagged amber for meeting with Mark Hill.", type: "alert" },
              { description: "Missing KID returned to adviser (auto-handled).", type: "background" },
              { description: "New business for Jane Parsons passed file check.", type: "background" },
              { description: "Daily compliance summary generated.", type: "background" }
          ];
          const randomEvent = events[Math.floor(Math.random() * events.length)];
          
          const newActivity: ActivityItem = {
              id: Date.now().toString(),
              time: "Just now",
              description: randomEvent.description,
              type: randomEvent.type as "alert" | "background",
              isNew: true
          };

          setActivityItems(prev => [newActivity, ...prev.slice(0, 8)]);
          
          // Remove highlight
          setTimeout(() => {
              setActivityItems(prev => prev.map(item => item.id === newActivity.id ? { ...item, isNew: false } : item));
          }, 2000);

      }, 12000);
      return () => clearInterval(interval);
  }, []);

  // 4. Resolve Critical Item
  const resolveCriticalItem = (id: string) => {
      setCriticalItems(prev => prev.filter(item => item.id !== id));
      toast("Critical risk cleared.", {
          description: "System a little safer.",
          className: "bg-card border-l-4 border-l-green-500",
          duration: 2000,
      });

      // Update status if empty
      if (criticalItems.length <= 1) { // will be 0 after update
          setOverallStatus({
              label: "All Clear",
              color: "text-green-500",
              pulse: false
          });
      }
  };

  // 6. Simulate Meeting Ending Demo
  const handleSimulateMeeting = () => {
      // 1. Add checking item to widget
      const checkingMeeting: MeetingStatus = {
          adviser: "Sarah Evans",
          status: "checking",
          count: "Checking...",
          isNew: true
      };
      setMeetings(prev => [checkingMeeting, ...prev]);

      // 2. Resolve after delay
      setTimeout(() => {
          setMeetings(prev => {
              const filtered = prev.filter(m => m !== checkingMeeting);
              // Increment red for demo purpose
              const updatedPriya = { ...filtered.find(m => m.adviser === "Priya Patel")!, count: "2 red" };
              return filtered.map(m => m.adviser === "Priya Patel" ? updatedPriya : m);
          });

          // Add to Critical Lane
          const newItem: TriageItem = {
              id: Date.now().toString(),
              type: "Meeting",
              title: "Jane Parsons (Sarah Evans)",
              reason: "Red flag: Missing risk discussion detected",
              owner: "HITL",
              priority: "Critical",
              timestamp: "Just now",
              actions: ["Review meeting", "Escalate"],
              status: "running" // for initial flash
          };
          setCriticalItems(prev => [newItem, ...prev]);
          
          // Push Alert
          setActivityItems(prev => [{
              id: Date.now().toString(),
              time: "Just now",
              description: "Red flag on meeting with Jane Parsons (missing risk discussion).",
              type: "alert",
              isNew: true
          }, ...prev]);

          // Update Status
          setOverallStatus({
              label: "Action Required",
              color: "text-red-500",
              pulse: true
          });

      }, 3000);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* 1. Overall Status Strip */}
      <div className="bg-background/95 backdrop-blur z-20 shrink-0 border-b border-border transition-colors duration-500">
         <div className="h-14 px-6 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full animate-pulse", overallStatus.color.replace("text-", "bg-"))} />
                    <span className={cn("font-bold text-lg transition-colors duration-500", overallStatus.color)}>{overallStatus.label}</span>
                </div>
                <div className="h-4 w-px bg-border mx-2" />
                <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="transition-all duration-300"><span className={cn("font-medium text-foreground", criticalItems.length > 0 ? "text-red-500" : "")}>{criticalItems.length}</span> critical</span>
                    <span className="transition-all duration-300"><span className="font-medium text-foreground">{todayItems.length}</span> need review</span>
                    <span className="transition-all duration-300"><span className="font-medium text-foreground">{12 + backgroundItems.length}</span> auto-handled</span>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                 {/* Demo Button */}
                 <Button variant="outline" size="sm" className="h-7 text-xs border-dashed border-muted-foreground/40" onClick={handleSimulateMeeting}>
                    <Clock className="w-3 h-3 mr-2" />
                    Simulate Meeting Ending (Demo)
                 </Button>

                 {/* Legend */}
                 <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-purple-500" /> HITL
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Adviser
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500" /> Auto
                    </div>
                 </div>
             </div>
         </div>
         
         {/* 1. Active Checks Line */}
         <div className="px-6 py-1.5 bg-muted/20 border-t border-border/50 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <Activity className="w-3 h-3 text-primary animate-pulse" />
            <span>Right now:</span>
            <span className="text-foreground">{activeChecks.observation}</span> observation checks running
            <span className="text-border mx-1">·</span>
            <span className="text-foreground">{activeChecks.file}</span> file checks in progress
            <span className="text-border mx-1">·</span>
            <span className="text-foreground">{activeChecks.provider}</span> provider chases flagged
         </div>

         {/* KPI Row (Secondary) */}
         <div className="px-6 py-4 flex gap-4 overflow-x-auto scrollbar-none border-t border-border/50">
            <MiniKpi title="At-Risk Clients" value="24" trend="+5" color="text-red-500" />
            <MiniKpi title="Overdue Reviews" value="17" trend="-3" color="text-green-500" />
            <MiniKpi title="Avg Check Score" value="92" trend="=" color="text-muted-foreground" />
            <MiniKpi title="Observation Checks" value="38" trend="+2" color="text-green-500" />
         </div>
      </div>

      {/* Main Scroll Area */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8 pb-20 max-w-[1600px] mx-auto">
            
            <div className="flex flex-col xl:flex-row gap-8">
                {/* 2. Triage Lanes */}
                <div className="flex-1 space-y-6 min-w-0">
                    {/* Lane 1: Critical */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-red-500">
                                <AlertTriangle className="w-4 h-4" />
                                Critical – Human in the Loop <span className="text-muted-foreground font-normal">({criticalItems.length})</span>
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {criticalItems.map(item => (
                                <TriageCard 
                                    key={item.id} 
                                    item={item} 
                                    onResolve={() => resolveCriticalItem(item.id)}
                                />
                            ))}
                            {criticalItems.length === 0 && (
                                <div className="h-24 rounded border border-dashed border-border/50 flex items-center justify-center text-xs text-muted-foreground bg-muted/10">
                                    No critical items. Good job.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lane 2: Today */}
                    <div className="space-y-3">
                         <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-amber-500">
                                <Clock className="w-4 h-4" />
                                Today – Needs Review <span className="text-muted-foreground font-normal">({todayItems.length})</span>
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {todayItems.map(item => <TriageCard key={item.id} item={item} />)}
                        </div>
                    </div>

                    {/* Lane 3: Background */}
                    <div className="space-y-3 opacity-80 hover:opacity-100 transition-opacity">
                         <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4" />
                                Background – Auto-handled <span className="text-muted-foreground font-normal">({12 + backgroundItems.length} today)</span>
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {backgroundItems.map(item => <TriageCard key={item.id} item={item} compact />)}
                        </div>
                    </div>
                </div>

                {/* Right Column: Radar & Activity */}
                <div className="w-full xl:w-[400px] shrink-0 space-y-6">
                    
                    {/* 3. Today's Meetings Radar */}
                    <Card className="bg-card border-border shadow-sm">
                        <CardHeader className="pb-3 pt-4 px-4 border-b border-border/40">
                            <CardTitle className="text-sm font-medium">Today's Meetings</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between text-sm font-mono bg-muted/30 p-2 rounded-md border border-border/50">
                                <span className="text-green-500">🟢 9</span>
                                <span className="text-amber-500">🟡 2</span>
                                <span className="text-red-500">🔴 1</span>
                            </div>
                            <div className="space-y-2">
                                {meetings.map((m, i) => (
                                    <div key={i} className={cn(
                                        "flex items-center justify-between text-sm p-2 rounded-md transition-all duration-500 cursor-pointer",
                                        m.isNew ? "bg-primary/10" : "hover:bg-muted/20"
                                    )}>
                                        <div className="flex items-center gap-2">
                                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>{m.adviser}</span>
                                        </div>
                                        {m.status === "checking" ? (
                                            <Badge variant="outline" className="bg-muted border-muted-foreground/30 h-5 font-normal text-muted-foreground gap-1">
                                                <span className="flex gap-0.5">
                                                    <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                                                    <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                                                    <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                                                </span>
                                                Checking...
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className={cn(
                                                "h-5 font-normal transition-colors duration-500",
                                                m.status === "green" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                                m.status === "amber" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                "bg-red-500/10 text-red-500 border-red-500/20"
                                            )}>
                                                {m.count}
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. New Business Snapshot */}
                    <Card className="bg-card border-border shadow-sm">
                        <CardHeader className="pb-3 pt-4 px-4 border-b border-border/40">
                            <CardTitle className="text-sm font-medium">New Business Today</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                             <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
                                    <div className="text-lg font-bold text-green-500 leading-none">7</div>
                                    <div className="text-[9px] text-muted-foreground uppercase mt-1">Passed</div>
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2">
                                    <div className="text-lg font-bold text-amber-500 leading-none">3</div>
                                    <div className="text-[9px] text-muted-foreground uppercase mt-1">Returned</div>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/20 rounded p-2">
                                    <div className="text-lg font-bold text-red-500 leading-none">1</div>
                                    <div className="text-[9px] text-muted-foreground uppercase mt-1">Needs You</div>
                                </div>
                             </div>
                             
                             <div className="space-y-2 pt-2 border-t border-border/50">
                                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Needs Decision</label>
                                <div className="p-3 bg-muted/20 rounded-md border border-border/60 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium">Mark Hill – Pension Transfer</span>
                                        <OwnershipChip type="HITL" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Warning – potential suitability issue detected in report.</p>
                                    <div className="flex gap-2 pt-1">
                                        <Button size="sm" variant="outline" className="h-6 text-[10px] w-full">Review</Button>
                                        <Button size="sm" variant="outline" className="h-6 text-[10px] w-full">Approve</Button>
                                    </div>
                                </div>
                             </div>
                        </CardContent>
                    </Card>

                    {/* 5. Activity Feed */}
                    <Card className="bg-card border-border shadow-sm flex-1">
                         <Tabs defaultValue="alerts" className="w-full">
                            <div className="p-3 border-b border-border/40 flex items-center justify-between">
                                <h3 className="text-sm font-medium">Risk Activity</h3>
                                <TabsList className="h-7 bg-muted/50">
                                    <TabsTrigger value="alerts" className="h-5 text-[10px] px-2">Alerts</TabsTrigger>
                                    <TabsTrigger value="background" className="h-5 text-[10px] px-2">Background</TabsTrigger>
                                </TabsList>
                            </div>
                            
                            <div className="p-4 min-h-[200px]">
                                <TabsContent value="alerts" className="mt-0 space-y-4">
                                    {activityItems.filter(i => i.type === "alert").map(item => (
                                        <div key={item.id} className={cn(
                                            "relative flex gap-3 transition-all duration-500",
                                            item.isNew ? "translate-x-[-10px] opacity-0 animate-in fade-in slide-in-from-top-2" : ""
                                        )}>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full shrink-0 mt-1.5 ring-4 ring-background transition-all duration-500",
                                                item.isNew ? "bg-primary shadow-[0_0_10px_hsl(var(--primary))]" : "bg-red-500"
                                            )} />
                                            <div className="space-y-0.5">
                                                <p className="text-xs leading-relaxed">{item.description}</p>
                                                <p className="text-[10px] text-muted-foreground">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </TabsContent>
                                <TabsContent value="background" className="mt-0 space-y-4">
                                    {activityItems.filter(i => i.type === "background").map(item => (
                                        <div key={item.id} className={cn(
                                            "relative flex gap-3 opacity-80 transition-all duration-500",
                                            item.isNew ? "translate-x-[-10px] opacity-0 animate-in fade-in slide-in-from-top-2" : ""
                                        )}>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full shrink-0 mt-1.5 ring-4 ring-background transition-all duration-500",
                                                item.isNew ? "bg-green-500 shadow-[0_0_10px_hsl(var(--green-500))]" : "bg-muted-foreground"
                                            )} />
                                            <div className="space-y-0.5">
                                                <p className="text-xs leading-relaxed">{item.description}</p>
                                                <p className="text-[10px] text-muted-foreground">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </TabsContent>
                            </div>
                         </Tabs>
                    </Card>
                </div>
            </div>

            {/* 7. Trends & Analytics (Lower Section) */}
            <div className="space-y-4 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Historical Trends & Analytics</h3>
                <Card className="shadow-sm border-border/60 bg-card/30">
                    <div className="overflow-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground bg-muted/20 font-medium">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Adviser</th>
                                    <th className="px-4 py-3 font-medium text-right">Files Reviewed (30d)</th>
                                    <th className="px-4 py-3 font-medium text-right">Pass Rate</th>
                                    <th className="px-4 py-3 font-medium text-right">High-Risk Flags</th>
                                    <th className="px-4 py-3 font-medium text-right">Overdue Reviews</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {adviserStats.map((adv) => (
                                    <tr key={adv.id} className="hover:bg-muted/10">
                                        <td className="px-4 py-3 font-medium">{adv.name}</td>
                                        <td className="px-4 py-3 text-right text-muted-foreground">{adv.filesReviewed}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={cn(
                                                parseInt(adv.passRate) >= 95 ? "text-green-500" :
                                                parseInt(adv.passRate) >= 90 ? "text-amber-500" : "text-red-500"
                                            )}>
                                                {adv.passRate}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">{adv.highRiskFlags}</td>
                                        <td className="px-4 py-3 text-right">
                                            {adv.overdueReviews > 0 && (
                                                <Badge variant="secondary" className="h-5 px-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20">
                                                    {adv.overdueReviews}
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

        </div>
      </ScrollArea>
    </div>
  );
}

// Helper Components

function MiniKpi({ title, value, trend, color }: any) {
    return (
        <div className="flex flex-col min-w-[120px] px-3 py-2 rounded-md bg-muted/20 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{title}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-bold leading-none">{value}</span>
                <span className={cn("text-[10px] font-medium", color)}>{trend}</span>
            </div>
        </div>
    )
}

function OwnershipChip({ type }: { type: "HITL" | "ADVISER" | "AUTO" }) {
    const styles = {
        HITL: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        ADVISER: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        AUTO: "bg-green-500/10 text-green-500 border-green-500/20"
    };

    return (
        <Badge variant="outline" className={cn("h-4 px-1.5 text-[9px] font-semibold border", styles[type])}>
            {type}
        </Badge>
    )
}

function TriageCard({ item, compact, onResolve }: { item: TriageItem, compact?: boolean, onResolve?: () => void }) {
    return (
        <Card className={cn(
            "border-l-4 transition-all duration-500 hover:shadow-md animate-in fade-in slide-in-from-bottom-2",
            item.priority === "Critical" ? "border-l-red-500 bg-red-500/5 border-y-border border-r-border" :
            item.priority === "High" ? "border-l-amber-500 bg-amber-500/5 border-y-border border-r-border" :
            item.priority === "Medium" ? "border-l-amber-500/50 bg-card border-y-border border-r-border" :
            "border-l-green-500/50 bg-muted/20 border-y-border border-r-border opacity-80",
            item.status === "completed" && "opacity-60",
            item.status === "running" && "ring-1 ring-primary/50"
        )}>
            <div className={cn("p-3 flex items-start justify-between gap-4", compact && "py-2")}>
                <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.type}</span>
                        <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                        <OwnershipChip type={item.owner} />
                        {item.status === "running" && (
                            <span className="flex gap-0.5 ml-2">
                                <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                                <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                                <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-snug">{item.reason}</p>
                </div>
                
                {!compact && (
                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                        <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                        <div className="flex gap-2">
                            {item.actions.map(action => (
                                <Button 
                                    key={action} 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 text-xs bg-background/50 hover:bg-background"
                                    onClick={() => {
                                        if (action === "Approve" || action === "Mark as cleared" || item.priority === "Critical") {
                                            onResolve?.();
                                        }
                                    }}
                                >
                                    {action}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
