import { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Play, 
  Pause, 
  Square, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Search, 
  MoreHorizontal, 
  User, 
  Briefcase, 
  TerminalSquare,
  Activity,
  FileText,
  Phone,
  Mail,
  ShieldAlert,
  Library,
  Plus,
  Workflow
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

// Types
type AgentStatus = "Running" | "Paused" | "Completed" | "Failed" | "Escalated" | "Stopped";
type AgentType = "Provider Chase" | "Report" | "File Check" | "Workflow" | "Reminder" | "Account Opening" | "Other";

interface AgentLog {
  time: string;
  message: string;
}

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  client: string;
  context: string;
  owner: string;
  status: AgentStatus;
  startTime: string;
  elapsedTime: string; // formatted MM:SS
  elapsedSeconds: number;
  currentStep: string;
  logs: AgentLog[];
  reusableId?: string; // ID of the library agent this is based on
}

interface LibraryAgent {
    id: string;
    name: string;
    type: AgentType;
    purpose: string;
    usage: string;
    status: "Enabled" | "Disabled";
    workflows: string[];
    inputs: string[];
    outputs: string[];
    runStats: string;
}

// Mock Data Generator
const generateInitialAgents = (): Agent[] => [
  {
    id: "1",
    name: "Provider Chase – Aviva",
    type: "Provider Chase",
    client: "Jane Parsons",
    context: "Pension Transfer",
    owner: "Sarah Evans",
    status: "Running",
    startTime: "12:01",
    elapsedTime: "03:12",
    elapsedSeconds: 192,
    currentStep: "On hold – awaiting provider response",
    logs: [
      { time: "12:01", message: "Agent started (Provider Chase – Aviva for Jane Parsons)" },
      { time: "12:02", message: "Phone call initiated to Aviva" },
      { time: "12:03", message: "Email sent to Aviva with ceding scheme request" },
      { time: "12:04", message: "Waiting for provider response" }
    ],
    reusableId: "lib1"
  },
  {
    id: "2",
    name: "Generate Suitability Report",
    type: "Report",
    client: "Mark Hill",
    context: "ISA Top-up",
    owner: "System",
    status: "Running",
    startTime: "12:03",
    elapsedTime: "01:45",
    elapsedSeconds: 105,
    currentStep: "Drafting Section 3: Risk Assessment",
    logs: [
      { time: "12:03", message: "Agent started (Suitability Report generation)" },
      { time: "12:03", message: "Analyzing client risk profile" },
      { time: "12:04", message: "Drafting executive summary" }
    ],
    reusableId: "lib2"
  },
  {
    id: "3",
    name: "File Check – Pension Transfers",
    type: "File Check",
    client: "Multiple Clients",
    context: "10 recent cases",
    owner: "Compliance Team",
    status: "Running",
    startTime: "11:59",
    elapsedTime: "05:22",
    elapsedSeconds: 322,
    currentStep: "Checking document completeness (Case 4/10)",
    logs: [
      { time: "11:59", message: "Batch process started: 10 files" },
      { time: "12:00", message: "Case 1 verified: Pass" },
      { time: "12:02", message: "Case 2 verified: Pass" },
      { time: "12:03", message: "Case 3 flagged: Missing ID" }
    ],
    reusableId: "lib3"
  },
  {
    id: "4",
    name: "Mortgage Renewal Outreach",
    type: "Workflow",
    client: "Sarah Evans’ clients",
    context: "Renewal Campaign",
    owner: "Sarah Evans",
    status: "Paused",
    startTime: "11:50",
    elapsedTime: "12:03",
    elapsedSeconds: 723,
    currentStep: "Paused by user request",
    logs: [
      { time: "11:50", message: "Campaign started" },
      { time: "11:55", message: "List generated: 45 clients" },
      { time: "12:00", message: "5 emails sent" },
      { time: "12:02", message: "Agent paused by manager." }
    ]
  }
];

const LIBRARY_AGENTS: LibraryAgent[] = [
    {
        id: "lib1",
        name: "Provider Chase",
        type: "Provider Chase",
        purpose: "Automatically chases providers until they respond and updates CRM.",
        usage: "Used in 2 workflows · Run 31 times this month",
        status: "Enabled",
        workflows: ["Pension Transfer", "ISA Transfer"],
        inputs: ["Client Name", "Provider Name", "Policy Number"],
        outputs: ["Updated CRM fields", "Workflow step completion"],
        runStats: "Run 31 times this month (12 providers, 18 clients)."
    },
    {
        id: "lib2",
        name: "Suitability Report Generator",
        type: "Report",
        purpose: "Drafts suitability reports based on meeting transcripts and client data.",
        usage: "Used in 3 workflows · Run 54 times this month",
        status: "Enabled",
        workflows: ["New Business", "Annual Review"],
        inputs: ["Meeting Transcript", "Fact-find Data"],
        outputs: ["Draft Report (Word/PDF)", "Compliance Log"],
        runStats: "Run 54 times this month (avg time 2m 30s)."
    },
    {
        id: "lib3",
        name: "File Check – Pension Transfers",
        type: "File Check",
        purpose: "Runs suitability and completeness checks for pension transfer cases.",
        usage: "Used in 1 workflow · Run 12 times this month",
        status: "Enabled",
        workflows: ["Pension Transfer"],
        inputs: ["Case File", "Provider Docs"],
        outputs: ["Compliance Score", "Missing Docs List"],
        runStats: "Run 12 times this month (92% pass rate)."
    },
    {
        id: "lib4",
        name: "Email Follow-up – Protection",
        type: "Reminder",
        purpose: "Follows up with clients on protection quotes.",
        usage: "Used in 1 workflow",
        status: "Enabled",
        workflows: ["Protection Gap Follow-up"],
        inputs: ["Client Email", "Quote ID"],
        outputs: ["Sent Email", "CRM Activity Log"],
        runStats: "Run 8 times this month."
    }
];

const newAgentsQueue = [
  {
    id: "5",
    name: "File Check – Q4 ISA Cases",
    type: "File Check",
    client: "System",
    context: "Q4 Audit",
    owner: "Compliance Bot",
    status: "Running",
    startTime: "12:06",
    elapsedTime: "00:05",
    elapsedSeconds: 5,
    currentStep: "Initializing scan...",
    logs: [
      { time: "12:06", message: "Audit agent started" }
    ],
    reusableId: "lib3"
  },
  {
    id: "6",
    name: "Email Follow-up – Protection",
    type: "Workflow",
    client: "Sarah Evans",
    context: "Protection Gap",
    owner: "System",
    status: "Running",
    startTime: "12:07",
    elapsedTime: "00:02",
    elapsedSeconds: 2,
    currentStep: "Composing email draft",
    logs: [
      { time: "12:07", message: "Follow-up task triggered" }
    ],
    reusableId: "lib4"
  }
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(generateInitialAgents());
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>("lib1");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [spawnCount, setSpawnCount] = useState(0);
  const [activeTab, setActiveTab] = useState("live"); // 'live' | 'library'
  const [, setLocation] = useLocation();

  const selectedAgent = agents.find(a => a.id === selectedId);
  const selectedLibraryAgent = LIBRARY_AGENTS.find(a => a.id === selectedLibraryId);

  // Stats
  const runningCount = agents.filter(a => a.status === "Running").length;
  const pausedCount = agents.filter(a => a.status === "Paused").length;
  const completedCount = 18 + agents.filter(a => a.status === "Completed").length; // Mock base + current

  // Timer for elapsed time & spawning & SIPP demo state check
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === "Running") {
          const newSeconds = agent.elapsedSeconds + 1;
          
          // Special check for SIPP demo agent completion simulation
          if (agent.id === "sipp-demo" && newSeconds >= 14) {
              return {
                  ...agent,
                  status: "Completed",
                  elapsedSeconds: newSeconds,
                  elapsedTime: "00:14",
                  currentStep: "All steps complete",
                  logs: [
                      ...agent.logs,
                      { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), message: "Platform 1 confirmed SIPP creation (Account ID: P1-SIPP-74382)" },
                      { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), message: "CRM and workflows updated" }
                  ].filter((log, index, self) => 
                    // unique logs only
                    index === self.findIndex((t) => (t.message === log.message))
                  )
              };
          }

          const mins = Math.floor(newSeconds / 60);
          const secs = newSeconds % 60;
          return {
            ...agent,
            elapsedSeconds: newSeconds,
            elapsedTime: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
          };
        }
        return agent;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check for SIPP Demo trigger from Command page
  useEffect(() => {
    const checkSIPPStatus = () => {
        const startTimeStr = localStorage.getItem("sipp-demo-start");
        if (startTimeStr) {
            const startTime = parseInt(startTimeStr);
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            
            // Only show if started within the last hour
            if (elapsed < 3600) {
                setAgents(prev => {
                    if (prev.some(a => a.id === "sipp-demo")) return prev; // Already added

                    const isCompleted = elapsed >= 14;
                    
                    const startLog = { time: new Date(startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), message: "Loaded FactFind and KYC for Jane Parsons" };
                    const logs = [startLog];

                    if (elapsed >= 2) logs.push({ time: new Date(startTime + 2000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), message: "Populated Platform 1 SIPP application" });
                    if (elapsed >= 5) logs.push({ time: new Date(startTime + 5000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), message: "Submitted application to Platform 1" });
                    if (elapsed >= 8) logs.push({ time: new Date(startTime + 8000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), message: "Platform 1 confirmed SIPP creation (Account ID: P1-SIPP-74382)" });
                    if (elapsed >= 11) logs.push({ time: new Date(startTime + 11000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), message: "CRM and workflows updated" });

                    const newAgent: Agent = {
                        id: "sipp-demo",
                        name: "Open SIPP – Platform One",
                        type: "Account Opening" as AgentType,
                        client: "Jane Parsons",
                        context: "New Business",
                        owner: "You",
                        status: isCompleted ? "Completed" : "Running",
                        startTime: new Date(startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                        elapsedTime: isCompleted ? "00:14" : "00:00", // Will be updated by timer
                        elapsedSeconds: elapsed,
                        currentStep: isCompleted ? "All steps complete" : "Processing application...",
                        logs: logs
                    };
                    return [newAgent, ...prev];
                });
            }
        }
    };

    // Check immediately
    checkSIPPStatus();

    // Listen for storage events (cross-tab or just triggered)
    window.addEventListener("storage", checkSIPPStatus);
    
    return () => window.removeEventListener("storage", checkSIPPStatus);
  }, []);

  // Separate effect for spawning to be more controlled
  useEffect(() => {
    if (spawnCount >= newAgentsQueue.length) return;

    const timeout = setTimeout(() => {
      const nextAgent = newAgentsQueue[spawnCount];
      const typedAgent: Agent = {
          ...nextAgent,
          type: nextAgent.type as AgentType,
          status: nextAgent.status as AgentStatus
      };
      
      setAgents(prev => [typedAgent, ...prev]);
      setSpawnCount(c => c + 1);
      toast("New Agent Started", {
        description: `${nextAgent.name} started by ${nextAgent.owner}`,
        className: "bg-card border-primary/20",
      });
    }, 10000 + (spawnCount * 8000)); 

    return () => clearTimeout(timeout);
  }, [spawnCount]);


  // Actions
  const handleAction = (id: string, action: "Pause" | "Stop" | "Escalate") => {
    setAgents(prev => prev.map(agent => {
      if (agent.id !== id) return agent;

      let newStatus: AgentStatus = agent.status;
      let logMessage = "";

      if (action === "Pause") {
        newStatus = "Paused";
        logMessage = "Agent paused by manager.";
      } else if (action === "Stop") {
        newStatus = "Stopped";
        logMessage = "Agent stopped by manager.";
      } else if (action === "Escalate") {
        newStatus = "Escalated";
        logMessage = "Escalated to human reviewer.";
      }

      const newLog: AgentLog = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: logMessage
      };

      return {
        ...agent,
        status: newStatus,
        logs: [...agent.logs, newLog]
      };
    }));
  };

  const filteredAgents = agents.filter(a => {
    if (filterStatus !== "all" && a.status.toLowerCase() !== filterStatus.toLowerCase()) return false;
    if (filterType !== "all" && a.type !== filterType) return false;
    return true;
  });

  const filteredLibraryAgents = LIBRARY_AGENTS.filter(a => {
      if (filterType !== "all" && a.type !== filterType) return false;
      return true;
  });

  // Handler to jump from live agent to library definition
  const jumpToLibrary = (libId: string) => {
      setActiveTab("library");
      setSelectedLibraryId(libId);
  };

  // Status Pill Component
  const StatusPill = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      "Running": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Paused": "bg-amber-500/10 text-amber-500 border-amber-500/20",
      "Completed": "bg-green-500/10 text-green-500 border-green-500/20",
      "Failed": "bg-red-500/10 text-red-500 border-red-500/20",
      "Escalated": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "Stopped": "bg-slate-500/10 text-slate-500 border-slate-500/20"
    };

    return (
      <Badge variant="outline" className={cn("font-normal border", colors[status] || colors["Running"])}>
        {status === "Running" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse" />}
        {status}
      </Badge>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="h-auto border-b border-border bg-background/95 backdrop-blur z-20 shrink-0 p-6 pb-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-lg flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              Agents
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Live view of all AI agents currently working in your firm.</p>
          </div>
          
          <div className="flex gap-3">
             <Card className="bg-muted/20 border-none shadow-none px-4 py-2 flex flex-col items-center min-w-[80px]">
                <span className="text-2xl font-bold text-primary">{runningCount}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Running</span>
             </Card>
             <Card className="bg-muted/20 border-none shadow-none px-4 py-2 flex flex-col items-center min-w-[80px]">
                <span className="text-2xl font-bold text-amber-500">{pausedCount}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Paused</span>
             </Card>
             <Card className="bg-muted/20 border-none shadow-none px-4 py-2 flex flex-col items-center min-w-[80px]">
                <span className="text-2xl font-bold text-green-500">{completedCount}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Done Today</span>
             </Card>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="live">Live Agents</TabsTrigger>
                    <TabsTrigger value="library">Agent Library</TabsTrigger>
                </TabsList>
             </Tabs>
             
             {activeTab === "library" && (
                 <Button size="sm" className="gap-2" onClick={() => setLocation("/")}>
                     <Plus className="w-4 h-4" />
                     New Agent from Command
                 </Button>
             )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <div className="relative max-w-xs w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder={activeTab === "live" ? "Search running agents..." : "Search reusable agents..."} 
              className="pl-8 h-8 text-xs bg-muted/30 border-border/60"
            />
          </div>
          
          <div className="h-4 w-px bg-border mx-1" />
          
          {activeTab === "live" && (
            <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 w-[130px] text-xs bg-muted/30 border-border/60">
                <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
            </Select>
          )}

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-8 w-[130px] text-xs bg-muted/30 border-border/60">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Provider Chase">Provider Chase</SelectItem>
              <SelectItem value="Report">Report</SelectItem>
              <SelectItem value="File Check">File Check</SelectItem>
              <SelectItem value="Workflow">Workflow</SelectItem>
              <SelectItem value="Account Opening">Account Opening</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel: List (Switchable) */}
        <div className="flex-[3] overflow-auto border-r border-border bg-muted/5">
          
          {activeTab === "live" ? (
             <table className="w-full text-sm text-left border-separate border-spacing-0">
                <thead className="text-xs text-muted-foreground bg-muted/30 font-medium sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                    <th className="px-6 py-3 font-medium border-b border-border">Agent</th>
                    <th className="px-4 py-3 font-medium border-b border-border">Context</th>
                    <th className="px-4 py-3 font-medium border-b border-border">Status</th>
                    <th className="px-4 py-3 font-medium border-b border-border font-mono text-right">Elapsed</th>
                    <th className="px-4 py-3 font-medium border-b border-border text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                {filteredAgents.map((agent) => (
                    <tr 
                    key={agent.id} 
                    onClick={() => setSelectedId(agent.id)}
                    className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/30 animate-in fade-in slide-in-from-left-2 duration-300",
                        selectedId === agent.id ? "bg-primary/5 hover:bg-primary/10" : ""
                    )}
                    >
                    <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{agent.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Badge variant="outline" className="text-[10px] h-4 px-1 font-normal border-muted-foreground/30 text-muted-foreground">
                            {agent.type}
                        </Badge>
                        </div>
                    </td>
                    <td className="px-4 py-4">
                        <div className="text-foreground">{agent.client}</div>
                        <div className="text-xs text-muted-foreground">{agent.context}</div>
                    </td>
                    <td className="px-4 py-4">
                        <StatusPill status={agent.status} />
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-muted-foreground">
                        {agent.elapsedTime}
                    </td>
                    <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-amber-500/10 hover:text-amber-500" title="Pause" onClick={() => handleAction(agent.id, "Pause")}>
                            <Pause className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-500/10 hover:text-red-500" title="Stop" onClick={() => handleAction(agent.id, "Stop")}>
                            <Square className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-purple-500/10 hover:text-purple-500" title="Escalate" onClick={() => handleAction(agent.id, "Escalate")}>
                            <ShieldAlert className="w-3.5 h-3.5" />
                        </Button>
                        </div>
                    </td>
                    </tr>
                ))}
                {filteredAgents.length === 0 && (
                    <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        No agents found matching filters.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
          ) : (
             /* AGENT LIBRARY LIST */
             <table className="w-full text-sm text-left border-separate border-spacing-0">
                <thead className="text-xs text-muted-foreground bg-muted/30 font-medium sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                    <th className="px-6 py-3 font-medium border-b border-border">Agent</th>
                    <th className="px-4 py-3 font-medium border-b border-border">Purpose</th>
                    <th className="px-4 py-3 font-medium border-b border-border">Usage</th>
                    <th className="px-4 py-3 font-medium border-b border-border text-right">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                {filteredLibraryAgents.map((agent) => (
                    <tr 
                    key={agent.id} 
                    onClick={() => setSelectedLibraryId(agent.id)}
                    className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/30 animate-in fade-in slide-in-from-left-2 duration-300",
                        selectedLibraryId === agent.id ? "bg-primary/5 hover:bg-primary/10" : ""
                    )}
                    >
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded bg-muted/50 flex items-center justify-center border border-border">
                              <Bot className="w-4 h-4 text-muted-foreground" />
                           </div>
                           <div>
                                <div className="font-medium text-foreground">{agent.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                <Badge variant="outline" className="text-[10px] h-4 px-1 font-normal border-muted-foreground/30 text-muted-foreground">
                                    {agent.type}
                                </Badge>
                                </div>
                           </div>
                        </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground max-w-xs truncate" title={agent.purpose}>
                        {agent.purpose}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground text-xs">
                        {agent.usage}
                    </td>
                    <td className="px-4 py-4 text-right">
                         <Badge variant="outline" className={cn(
                             "h-5 px-2 font-normal border-0",
                             agent.status === "Enabled" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                         )}>{agent.status}</Badge>
                    </td>
                    </tr>
                ))}
                </tbody>
             </table>
          )}
        </div>

        {/* Right Panel: Detail (Switchable) */}
        <div className="flex-[2] border-l border-border bg-card shadow-xl z-20 flex flex-col overflow-y-auto min-w-[350px]">
           {activeTab === "live" && selectedAgent ? (
             /* LIVE AGENT DETAIL */
             <>
               <div className="p-6 border-b border-border">
                 <div className="flex justify-between items-start mb-4">
                   <h2 className="font-semibold text-lg pr-4 leading-tight">{selectedAgent.name}</h2>
                   <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 shrink-0">
                     <MoreHorizontal className="w-4 h-4" />
                   </Button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                       <div className="text-xs text-muted-foreground mb-1">Client</div>
                       <div className="font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          {selectedAgent.client}
                       </div>
                    </div>
                    <div>
                       <div className="text-xs text-muted-foreground mb-1">Started by</div>
                       <div className="font-medium">{selectedAgent.owner}</div>
                    </div>
                    <div>
                       <div className="text-xs text-muted-foreground mb-1">Context</div>
                       <div className="font-medium flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                          {selectedAgent.context}
                       </div>
                    </div>
                    <div>
                       <div className="text-xs text-muted-foreground mb-1">Elapsed</div>
                       <div className="font-mono">{selectedAgent.elapsedTime}</div>
                    </div>
                 </div>

                 <div className="flex items-center gap-2 mb-2">
                    <StatusPill status={selectedAgent.status} />
                    <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                       Started at {selectedAgent.startTime}
                    </span>
                 </div>
               </div>
               
               <div className="flex-1 bg-muted/5 flex flex-col overflow-hidden">
                  <div className="p-4 pb-2 bg-muted/10 border-b border-border">
                     <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5" />
                        Live Activity Log
                     </h3>
                  </div>
                  <ScrollArea className="flex-1">
                     <div className="p-4 space-y-6">
                        {selectedAgent.logs.map((log, i) => (
                           <div key={i} className="flex gap-3 group">
                              <div className="flex flex-col items-center mt-1">
                                 <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                 {i !== selectedAgent.logs.length - 1 && (
                                    <div className="w-px h-full bg-border/50 mt-1 min-h-[20px]" />
                                 )}
                              </div>
                              <div className="pb-1">
                                 <div className="text-xs text-muted-foreground font-mono mb-0.5">{log.time}</div>
                                 <div className="text-sm text-foreground">{log.message}</div>
                              </div>
                           </div>
                        ))}
                        {selectedAgent.status === "Running" && (
                           <div className="flex gap-3 animate-pulse opacity-50">
                              <div className="w-2 h-2 rounded-full bg-muted mt-1" />
                              <div className="text-sm text-muted-foreground italic">Agent working...</div>
                           </div>
                        )}
                     </div>
                  </ScrollArea>
               </div>
               
               <div className="p-4 border-t border-border bg-muted/10 flex justify-between items-center gap-4">
                  <Button variant="outline" size="sm" className="flex-1 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50" onClick={() => handleAction(selectedAgent.id, "Stop")}>
                     <Square className="w-4 h-4 mr-2" />
                     Stop Agent
                  </Button>
                  <Button variant="default" size="sm" className="flex-1" onClick={() => handleAction(selectedAgent.id, "Pause")}>
                     <Pause className="w-4 h-4 mr-2" />
                     Pause
                  </Button>
               </div>
             </>
           ) : activeTab === "library" && selectedLibraryAgent ? (
             /* LIBRARY AGENT DETAIL */
             <>
               <div className="p-6 border-b border-border">
                 <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg leading-tight">{selectedLibraryAgent.name}</h2>
                        <Badge variant="outline" className="mt-2 font-normal">{selectedLibraryAgent.type}</Badge>
                    </div>
                 </div>
                 <p className="text-sm text-muted-foreground leading-relaxed">{selectedLibraryAgent.purpose}</p>
               </div>

               <div className="p-6 space-y-6 overflow-y-auto">
                  <div className="space-y-3">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                          <Workflow className="w-4 h-4 text-primary" />
                          Workflows
                      </h3>
                      <div className="flex flex-wrap gap-2">
                          {selectedLibraryAgent.workflows.map(w => (
                              <Badge key={w} variant="secondary" className="font-normal bg-muted text-muted-foreground">{w}</Badge>
                          ))}
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                          <h3 className="text-sm font-medium">Inputs</h3>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                              {selectedLibraryAgent.inputs.map(i => <li key={i}>{i}</li>)}
                          </ul>
                      </div>
                      <div className="space-y-3">
                          <h3 className="text-sm font-medium">Outputs</h3>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                              {selectedLibraryAgent.outputs.map(o => <li key={o}>{o}</li>)}
                          </ul>
                      </div>
                  </div>

                  <div className="p-4 bg-muted/20 rounded-lg border border-border">
                      <h3 className="text-sm font-medium mb-2">Usage Stats</h3>
                      <p className="text-sm text-muted-foreground">{selectedLibraryAgent.runStats}</p>
                  </div>
               </div>
               
               <div className="p-4 border-t border-border mt-auto">
                   <Button className="w-full">Use this Agent</Button>
               </div>
             </>
           ) : (
             <div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center">
                Select an agent to view details
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
