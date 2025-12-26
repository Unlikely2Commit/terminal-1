import { useState, useEffect, useRef } from "react";
import { 
  Users, 
  Search, 
  ChevronRight, 
  MoreHorizontal, 
  Briefcase, 
  FileText, 
  Clock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare,
  ArrowUpRight,
  Command,
  Sparkles,
  X,
  ArrowLeft,
  Play,
  Download,
  Mic,
  ListChecks,
  History,
  ArrowRight,
  ClipboardCheck,
  Upload,
  File,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- Mock Data ---

const CLIENTS = [
  { id: "1", name: "Jane Parsons", status: "Active", adviser: "Sarah Evans", avatar: "JP", risk: "Balanced", lastContact: "2 days ago", nextReview: "12 Mar 2026" },
  { id: "2", name: "Mark Hill", status: "Active", adviser: "James Wood", avatar: "MH", risk: "High", lastContact: "1 week ago", nextReview: "15 Apr 2026" },
  { id: "3", name: "Sarah Collins", status: "Prospect", adviser: "Priya Patel", avatar: "SC", risk: "Low", lastContact: "Today", nextReview: "N/A" },
  { id: "4", name: "Robert Fox", status: "Active", adviser: "Sarah Evans", avatar: "RF", risk: "Balanced", lastContact: "3 days ago", nextReview: "01 Jun 2026" },
  { id: "5", name: "Emily Chen", status: "Review", adviser: "Marcus Chen", avatar: "EC", risk: "Medium", lastContact: "Yesterday", nextReview: "20 Feb 2026" },
  { id: "6", name: "David Miller", status: "Active", adviser: "Sarah Evans", avatar: "DM", risk: "Balanced", lastContact: "1 month ago", nextReview: "10 Jul 2026" },
  { id: "7", name: "Thomas Wright", status: "Active", adviser: "James Wood", avatar: "TW", risk: "High", lastContact: "2 weeks ago", nextReview: "22 Aug 2026" },
  { id: "8", name: "Emma Wilson", status: "Active", adviser: "Priya Patel", avatar: "EW", risk: "Low", lastContact: "5 days ago", nextReview: "05 Sep 2026" },
];

// Initial FactFind Data
const INITIAL_FACTFIND = {
  personal: {
    maritalStatus: { value: "Married", updated: false },
    dependants: { value: "1 child", updated: false }
  },
  employment: {
    occupation: { value: "Project Manager", updated: false },
    employer: { value: "ABC Ltd", updated: false },
    income: { value: "£75,000", updated: false }
  },
  savings: {
    monthly: { value: "£150/month", updated: false },
    pensions: { value: "£280,000", updated: false }
  },
  lastSynced: "10 Mar 2025 - Review"
};

const JANE_PROFILE_BASE = {
  id: "1",
  name: "Jane Parsons",
  initials: "JP",
  status: "Active",
  risk: "Balanced",
  serviceLevel: "Gold",
  adviser: "Sarah Evans",
  nextReview: "12 Mar 2026",
  atRisk: false,
  suitability: "Up to date",
  overview: {
    age: 45,
    family: "Married, 2 children",
    occupation: "Senior Project Manager",
    income: "£85,000",
    timeHorizon: "Retire at 60",
    goals: ["Comfortable retirement", "Help children with university costs", "Pay off mortgage early"]
  },
  financials: {
    total: "£420,000",
    breakdown: [
      { label: "Pensions", value: "£280,000", color: "bg-blue-500" },
      { label: "ISA", value: "£60,000", color: "bg-green-500" },
      { label: "GIA", value: "£40,000", color: "bg-amber-500" },
      { label: "Cash", value: "£20,000", color: "bg-slate-500" }
    ],
    mortgage: "£300,000"
  },
  opportunities: [
    { id: 1, type: "Pension Transfer", description: "Consolidate two legacy workplace pensions into current SIPP.", value: "£120,000", status: "Live", owner: "IFA – Sarah Evans", source: "Meeting – 24 Nov", highlight: true },
    { id: 2, type: "Mortgage Renewal", description: "Fixed-rate mortgage ends in 12 months; review options.", value: "£300,000 balance", status: "On Hold", owner: "Mortgage Team", source: "Meeting – 24 Nov" },
    { id: 3, type: "Protection Gap", description: "Explore income protection if Jane is unable to work.", value: "~£80/month", status: "Live", owner: "Protection Specialist", source: "Meeting – 24 Nov" }
  ],
  workflows: [
    { id: 1, name: "Pension Transfer", step: 3, totalSteps: 6, stepName: "Waiting for provider", status: "active" },
    { id: 2, name: "Mortgage Renewal", status: "on-hold", note: "On hold until 12 months before current rate ends.", nextAction: "Re-contact 3 months before renewal" }
  ],
  meetings: [
    { id: 1, date: "24 Nov 2025", time: "15:12", title: "Annual Review", adviser: "Sarah Evans", duration: "42 min", recording: "Recorded", status: "Green" },
    { id: 2, date: "10 Mar 2025", time: "11:30", title: "Review", adviser: "Sarah Evans", duration: "35 min", recording: "Recorded", status: "Amber" },
    { id: 3, date: "12 Sep 2024", time: "09:00", title: "Fact-find", adviser: "Sarah Evans", duration: "55 min", recording: "Recorded", status: "Green" }
  ],
  comms: [
    { id: 1, date: "Today", from: "Aviva", subject: "Ceding scheme info for Jane Parsons", tag: "Used by agent" },
    { id: 2, date: "2 days ago", from: "Jane", subject: "Sent updated payslip" },
    { id: 3, date: "1 week ago", to: "Jane", subject: "Follow-up on protection options" }
  ],
  docs: [
    { name: "Fact-find (2025)", status: "Current" },
    { name: "ID & Address Verification", status: "Current" },
    { name: "Suitability Report (2025)", status: "Current" },
    { name: "KYC (2023)", status: "Expiring soon", warn: true }
  ]
};

const TRANSCRIPT_SAMPLE = [
  { time: "15:12:56", speaker: "Adviser", text: "Hi Jane, how have you been since our last review?" },
  { time: "15:13:15", speaker: "Client", text: "Morning, I've been okay, just busy with work. The project management role has been quite demanding lately." },
  { time: "15:13:42", speaker: "Adviser", text: "I can imagine. So looking at your retirement timeline, you mentioned 60 as the target age. Is that still the goal?" },
  { time: "15:14:01", speaker: "Client", text: "Yes, definitely. As I said, finding the work stressful makes me want to stick to that plan. I'd love to step back by then." },
  { time: "15:14:28", speaker: "Adviser", text: "Understood. With the current pension contributions, we're tracking well, but the mortgage balance is the main headwind we identified." },
  { time: "15:14:45", speaker: "Client", text: "Exactly. That's why I wanted to ask about using the tax-free cash to pay it down. Is that a viable option?" },
  { time: "15:15:10", speaker: "Adviser", text: "We can certainly model that. It would reduce your monthly outgoings significantly in retirement, but we need to check if it leaves you enough liquidity." },
  { time: "15:15:35", speaker: "Client", text: "That makes sense. I also received a letter from Aviva about my old workplace pension. Should I forward that?" },
  { time: "15:15:55", speaker: "Adviser", text: "Yes, please do. We are looking into consolidating those legacy pots into your SIPP for better visibility and lower fees." }
];

const SUGGESTED_UPDATES = [
  { id: 1, section: "employment", field: "occupation", label: "Occupation", old: "Project Manager", new: "Senior Project Manager", accepted: false, rejected: false },
  { id: 2, section: "employment", field: "income", label: "Gross Income", old: "£75,000", new: "£85,000", accepted: false, rejected: false },
  { id: 3, section: "personal", field: "dependants", label: "Dependants", old: "1 child", new: "2 children", accepted: false, rejected: false },
  { id: 4, section: "savings", field: "monthly", label: "Monthly Savings", old: "£150/month", new: "£250/month", accepted: false, rejected: false }
];

// --- Components ---

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  // "view" state controls whether we see the list ("browse") or profile ("profile")
  const [view, setView] = useState<"browse" | "profile">("browse");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  // New state for full-page meeting detail
  const [viewMeetingId, setViewMeetingId] = useState<string | null>(null);

  // State for FactFind and Updates
  const [factFind, setFactFind] = useState(INITIAL_FACTFIND);
  const [updates, setUpdates] = useState(SUGGESTED_UPDATES);
  const [updatesApplied, setUpdatesApplied] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // State for recording upload
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMeetingType, setUploadMeetingType] = useState("Annual Review");
  const [uploadMeetingDate, setUploadMeetingDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock filtering
  const filteredClients = CLIENTS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientClick = (id: string) => {
    setSelectedClientId(id);
    setView("profile");
    setViewMeetingId(null);
  };

  const handleBackToBrowse = () => {
    setView("browse");
    setSelectedClientId(null);
    setViewMeetingId(null);
  };

  const handleAcceptAllUpdates = () => {
    const newFactFind = { ...factFind };
    
    updates.forEach(update => {
       if (!update.rejected) {
           // @ts-ignore
           if (newFactFind[update.section] && newFactFind[update.section][update.field]) {
               // @ts-ignore
               newFactFind[update.section][update.field] = { value: update.new, updated: true };
           }
       }
    });

    newFactFind.lastSynced = "Annual Review - 24 Nov 2025";
    
    setFactFind(newFactFind);
    setUpdatesApplied(true);
    setShowSuccessMessage(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
        setShowSuccessMessage(false);
    }, 3000);

    toast("FactFind updated", {
        description: "Data synced from meeting transcript.",
        className: "bg-card border-primary/20",
    });
  };

  const toggleUpdateStatus = (id: number, status: 'accepted' | 'rejected') => {
      setUpdates(prev => prev.map(u => {
          if (u.id === id) {
              return {
                  ...u,
                  accepted: status === 'accepted' ? !u.accepted : false,
                  rejected: status === 'rejected' ? !u.rejected : false
              };
          }
          return u;
      }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUploadRecording = async () => {
    if (!uploadFile || !selectedClientId || !uploadMeetingDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("clientId", selectedClientId);
      formData.append("meetingDate", uploadMeetingDate);
      formData.append("meetingType", uploadMeetingType);
      
      const response = await fetch("/api/recordings", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      
      toast.success("Recording uploaded", {
        description: "Processing will complete shortly.",
        className: "bg-card border-primary/20",
      });
      
      setUploadDialogOpen(false);
      setUploadFile(null);
      setUploadMeetingDate("");
      setUploadMeetingType("Annual Review");
    } catch (error) {
      toast.error("Failed to upload recording");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const selectedClient = selectedClientId === "1" ? JANE_PROFILE_BASE : null;
  const activeMeeting = viewMeetingId && selectedClient ? selectedClient.meetings.find(m => m.id.toString() === viewMeetingId) : null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      
      {/* BROWSE STATE: Full-width Client List */}
      {view === "browse" && (
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-20 border-b border-border px-8 flex items-center justify-between bg-background/80 backdrop-blur shrink-0">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                Clients
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Manage client relationships and profiles</p>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search clients by name..." 
                className="pl-10 bg-muted/30 border-border/60 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </header>
          
          <ScrollArea className="flex-1">
            <div className="p-8 max-w-[1400px] mx-auto">
               <Card className="border-border/60 shadow-sm bg-card/40 overflow-hidden">
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                     <thead className="text-xs text-muted-foreground bg-muted/30 font-medium border-b border-border/50">
                       <tr>
                         <th className="px-6 py-4 font-medium">Client</th>
                         <th className="px-6 py-4 font-medium">Status</th>
                         <th className="px-6 py-4 font-medium">Adviser</th>
                         <th className="px-6 py-4 font-medium">Risk Profile</th>
                         <th className="px-6 py-4 font-medium">Last Contact</th>
                         <th className="px-6 py-4 font-medium">Next Review</th>
                         <th className="px-6 py-4 font-medium text-right">Action</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border/50">
                       {filteredClients.map((client) => (
                         <tr 
                           key={client.id} 
                           className="group hover:bg-muted/20 transition-colors cursor-pointer"
                           onClick={() => handleClientClick(client.id)}
                         >
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                               <Avatar className="h-9 w-9 border border-border/50">
                                 <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">{client.avatar}</AvatarFallback>
                               </Avatar>
                               <span className="font-medium group-hover:text-primary transition-colors">{client.name}</span>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <Badge variant="outline" className={cn(
                               "h-5 px-2 font-normal border-0",
                               client.status === "Active" ? "bg-green-500/10 text-green-500" : 
                               client.status === "Prospect" ? "bg-blue-500/10 text-blue-500" :
                               "bg-amber-500/10 text-amber-500"
                             )}>
                               {client.status}
                             </Badge>
                           </td>
                           <td className="px-6 py-4 text-muted-foreground">{client.adviser}</td>
                           <td className="px-6 py-4">
                             <Badge variant="outline" className="border-border/60 text-muted-foreground font-normal">{client.risk}</Badge>
                           </td>
                           <td className="px-6 py-4 text-muted-foreground">{client.lastContact}</td>
                           <td className="px-6 py-4 text-muted-foreground">{client.nextReview}</td>
                           <td className="px-6 py-4 text-right">
                             <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                               <ChevronRight className="w-4 h-4 text-muted-foreground" />
                             </Button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                   {filteredClients.length === 0 && (
                      <div className="p-12 text-center text-muted-foreground">
                        No clients found matching "{searchQuery}"
                      </div>
                   )}
                 </div>
               </Card>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* PROFILE STATE: Full-width Client Profile */}
      {view === "profile" && selectedClient ? (
          <div className="flex flex-col h-full relative">
            
            {/* Client Snapshot Header */}
            <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-background/95 backdrop-blur shrink-0 sticky top-0 z-30">
              <div className="flex items-center gap-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
                  onClick={handleBackToBrowse}
                >
                  <ArrowLeft className="w-4 h-4" />
                  All clients
                </Button>
                
                <div className="h-6 w-px bg-border/60" />
                
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-border/50">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{selectedClient.initials}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-lg font-bold tracking-tight">{selectedClient.name}</h2>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 px-2 py-0.5 text-[10px] h-5">{selectedClient.status}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                 <span className="flex items-center gap-1.5">
                   <Briefcase className="w-3.5 h-3.5" />
                   {selectedClient.adviser}
                 </span>
                 <Separator orientation="vertical" className="h-3" />
                 <span className="flex items-center gap-1.5">
                   <Clock className="w-3.5 h-3.5" />
                   Next Review: {selectedClient.nextReview}
                 </span>
              </div>
            </header>

            {/* Profile Content Scroll Area */}
            <ScrollArea className="flex-1">
              <div className="p-8 max-w-[1400px] mx-auto space-y-8 pb-32">
                
                {/* Conditionally Render either Main Profile or Meeting Detail */}
                {!viewMeetingId ? (
                  <>
                    {/* Row 1: Overview & Financials */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Overview */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Overview
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Age</div>
                                <div className="font-medium text-lg">{selectedClient.overview.age}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Occupation</div>
                                <div className="font-medium text-lg">{factFind.employment.occupation.value}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Income</div>
                                <div className="font-medium text-lg">{factFind.employment.income.value}</div>
                              </div>
                               <div>
                                <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Time Horizon</div>
                                <div className="font-medium text-lg">{selectedClient.overview.timeHorizon}</div>
                              </div>
                            </div>
                            <Separator className="bg-border/50" />
                            <div className="space-y-3">
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Primary Goals</span>
                              <div className="grid gap-2">
                                 {selectedClient.overview.goals.map((g, i) => (
                                   <div key={i} className="flex items-center gap-2 text-sm p-2 bg-muted/30 rounded-md border border-border/50">
                                      <CheckCircle2 className="w-4 h-4 text-primary/60" />
                                      <span>{g}</span>
                                   </div>
                                 ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Financial Snapshot */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Financial Snapshot
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="flex items-end justify-between">
                              <div>
                                 <div className="text-sm text-muted-foreground mb-1">Total Investable Assets</div>
                                 <div className="text-3xl font-bold tracking-tight">{selectedClient.financials.total}</div>
                              </div>
                              <div className="text-right">
                                 <div className="text-sm text-muted-foreground mb-1">Mortgage Balance</div>
                                 <div className="text-xl font-medium">{selectedClient.financials.mortgage}</div>
                              </div>
                            </div>
                            
                            {/* Mini Chart Bar */}
                            <div className="space-y-2">
                               <div className="flex h-3 w-full rounded-full overflow-hidden gap-0.5">
                                 {selectedClient.financials.breakdown.map((item, i) => (
                                   <div key={i} className={cn("h-full", item.color)} style={{ flex: 1 }} />
                                 ))}
                               </div>
                               <div className="flex justify-between pt-1 text-xs text-muted-foreground">
                                  <span>0%</span>
                                  <span>100%</span>
                               </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                               {selectedClient.financials.breakdown.map((item, i) => (
                                 <div key={i} className="flex justify-between items-center p-2 rounded hover:bg-muted/30 transition-colors">
                                   <div className="flex items-center gap-2">
                                     <div className={cn("w-2.5 h-2.5 rounded-full", item.color)} />
                                     <span className="text-sm text-muted-foreground">{item.label}</span>
                                   </div>
                                   <span className="text-sm font-medium font-mono">{item.value}</span>
                                 </div>
                               ))}
                            </div>
                          </CardContent>
                        </Card>
                    </div>

                     {/* FactFind Card */}
                     <Card>
                        <CardHeader className="pb-3 border-b border-border/50">
                           <div className="flex items-center justify-between">
                              <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                                 <ClipboardCheck className="w-4 h-4" />
                                 FactFind
                              </CardTitle>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                 <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
                                 Auto-updated from meetings
                              </div>
                           </div>
                           <p className="text-xs text-muted-foreground/70 mt-1">Last synced from: {factFind.lastSynced}</p>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              {/* Personal Details */}
                              <div className="space-y-3">
                                 <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Personal Details</h4>
                                 <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted/20">
                                       <span className="text-muted-foreground">Marital status</span>
                                       <div className="flex items-center gap-2">
                                          <span className="font-medium">{factFind.personal.maritalStatus.value}</span>
                                          {factFind.personal.maritalStatus.updated && <span className="text-[9px] text-primary bg-primary/10 px-1.5 rounded">New</span>}
                                       </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted/20">
                                       <span className="text-muted-foreground">Dependants</span>
                                       <div className="flex items-center gap-2">
                                          <span className="font-medium">{factFind.personal.dependants.value}</span>
                                          {factFind.personal.dependants.updated && <span className="text-[9px] text-primary bg-primary/10 px-1.5 rounded">Updated</span>}
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              {/* Employment & Income */}
                              <div className="space-y-3">
                                 <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Employment & Income</h4>
                                 <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted/20">
                                       <span className="text-muted-foreground">Occupation</span>
                                       <div className="flex items-center gap-2">
                                          <span className="font-medium">{factFind.employment.occupation.value}</span>
                                          {factFind.employment.occupation.updated && <span className="text-[9px] text-primary bg-primary/10 px-1.5 rounded">Updated</span>}
                                       </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted/20">
                                       <span className="text-muted-foreground">Employer</span>
                                       <div className="flex items-center gap-2">
                                          <span className="font-medium">{factFind.employment.employer.value}</span>
                                          {factFind.employment.employer.updated && <span className="text-[9px] text-primary bg-primary/10 px-1.5 rounded">New</span>}
                                       </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted/20">
                                       <span className="text-muted-foreground">Gross Income</span>
                                       <div className="flex items-center gap-2">
                                          <span className="font-medium">{factFind.employment.income.value}</span>
                                          {factFind.employment.income.updated && <span className="text-[9px] text-primary bg-primary/10 px-1.5 rounded">Updated</span>}
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              {/* Savings & Investments */}
                              <div className="space-y-3">
                                 <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Savings & Investments</h4>
                                 <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted/20">
                                       <span className="text-muted-foreground">Monthly Savings</span>
                                       <div className="flex items-center gap-2">
                                          <span className="font-medium">{factFind.savings.monthly.value}</span>
                                          {factFind.savings.monthly.updated && <span className="text-[9px] text-primary bg-primary/10 px-1.5 rounded">Updated</span>}
                                       </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted/20">
                                       <span className="text-muted-foreground">Pensions</span>
                                       <div className="flex items-center gap-2">
                                          <span className="font-medium">{factFind.savings.pensions.value}</span>
                                          {factFind.savings.pensions.updated && <span className="text-[9px] text-primary bg-primary/10 px-1.5 rounded">New</span>}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                    {/* Row 2: Opportunities & Workflows */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Opportunities */}
                        <Card className="h-full">
                          <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Opportunities
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs">{selectedClient.opportunities.length} Active</Badge>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {selectedClient.opportunities.map(opp => (
                              <div key={opp.id} className={cn(
                                "p-4 rounded-lg border transition-all",
                                opp.highlight 
                                  ? "bg-primary/5 border-primary/20 shadow-sm" 
                                  : "bg-muted/20 border-border hover:bg-muted/30"
                              )}>
                                <div className="flex justify-between items-start mb-2">
                                   <div className="flex items-center gap-2">
                                      <span className="font-semibold text-sm">{opp.type}</span>
                                      {opp.highlight && <Sparkles className="w-3 h-3 text-primary fill-primary/20" />}
                                   </div>
                                   <span className="font-mono text-sm font-medium">{opp.value}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{opp.description}</p>
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                   <div className="flex items-center gap-3">
                                      <Badge variant="outline" className={cn(
                                        "h-5 px-1.5 font-normal border-0",
                                        opp.status === "Live" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                                      )}>{opp.status}</Badge>
                                      <span>{opp.owner}</span>
                                   </div>
                                   <span>{opp.source}</span>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* Active Workflows */}
                        <Card className="h-full">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Active Workflows
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {selectedClient.workflows.map(wf => (
                              <div key={wf.id} className="space-y-4 p-4 border border-border/50 rounded-lg bg-muted/10">
                                 <div className="flex justify-between items-start">
                                    <div>
                                       <h4 className="text-sm font-medium">{wf.name}</h4>
                                       {wf.status === "active" ? (
                                          <p className="text-xs text-muted-foreground mt-1">Step {wf.step} of {wf.totalSteps}: <span className="text-foreground font-medium">{wf.stepName}</span></p>
                                       ) : (
                                          <p className="text-xs text-amber-500 mt-1">{wf.note}</p>
                                       )}
                                    </div>
                                    {wf.status === "active" ? (
                                       <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0">In Progress</Badge>
                                    ) : (
                                       <Badge variant="outline" className="text-muted-foreground border-border">On Hold</Badge>
                                    )}
                                 </div>
                                 
                                 {wf.status === "active" && (
                                   <div className="space-y-2">
                                     <Progress value={(wf.step! / wf.totalSteps!) * 100} className="h-1.5" />
                                     <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
                                        <span>Start</span>
                                        <span>Complete</span>
                                     </div>
                                   </div>
                                 )}

                                 {wf.status === "on-hold" && (
                                    <div className="flex items-center gap-2 text-xs bg-muted/30 p-2.5 rounded border border-border/50">
                                       <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                       <span>Next Action: {wf.nextAction}</span>
                                    </div>
                                 )}
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                    </div>

                    {/* Row 3: Meetings & Recordings */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-3">
                          <CardHeader className="pb-3 flex flex-row items-center justify-between">
                             <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                               <MessageSquare className="w-4 h-4" />
                               Meetings & Recordings
                             </CardTitle>
                             <div className="flex items-center gap-2">
                                <Badge variant="outline" className="cursor-pointer hover:bg-muted/50">All Types</Badge>
                                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      className="h-7 gap-1.5 text-xs"
                                      data-testid="button-upload-recording"
                                    >
                                      <Upload className="w-3.5 h-3.5" />
                                      Upload Recording
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Upload Meeting Recording</DialogTitle>
                                      <DialogDescription>
                                        Upload an audio or video recording to process and transcribe.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="meeting-date">Meeting Date</Label>
                                        <Input
                                          id="meeting-date"
                                          type="date"
                                          value={uploadMeetingDate}
                                          onChange={(e) => setUploadMeetingDate(e.target.value)}
                                          className="bg-muted/30"
                                          data-testid="input-meeting-date"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Meeting Type</Label>
                                        <Select value={uploadMeetingType} onValueChange={setUploadMeetingType}>
                                          <SelectTrigger data-testid="select-meeting-type">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Annual Review">Annual Review</SelectItem>
                                            <SelectItem value="Fact-find">Fact-find</SelectItem>
                                            <SelectItem value="Review">Review</SelectItem>
                                            <SelectItem value="Initial Consultation">Initial Consultation</SelectItem>
                                            <SelectItem value="Follow-up">Follow-up</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Recording File</Label>
                                        <input
                                          ref={fileInputRef}
                                          type="file"
                                          accept="audio/*,video/*,.mp3,.mp4,.m4a,.wav,.webm"
                                          onChange={handleFileSelect}
                                          className="hidden"
                                          data-testid="input-file-recording"
                                        />
                                        {!uploadFile ? (
                                          <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-border/60 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors"
                                          >
                                            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                              Click to select a recording file
                                            </p>
                                            <p className="text-xs text-muted-foreground/60 mt-1">
                                              MP3, MP4, M4A, WAV, or WebM
                                            </p>
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                                            <div className="flex items-center gap-3">
                                              <div className="p-2 bg-primary/10 rounded">
                                                <File className="w-4 h-4 text-primary" />
                                              </div>
                                              <div>
                                                <p className="text-sm font-medium truncate max-w-[200px]">{uploadFile.name}</p>
                                                <p className="text-xs text-muted-foreground">{formatFileSize(uploadFile.size)}</p>
                                              </div>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0"
                                              onClick={() => setUploadFile(null)}
                                            >
                                              <X className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setUploadDialogOpen(false)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={handleUploadRecording}
                                        disabled={!uploadFile || !uploadMeetingDate || isUploading}
                                        data-testid="button-confirm-upload"
                                      >
                                        {isUploading ? (
                                          <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading...
                                          </>
                                        ) : (
                                          <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload
                                          </>
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                             </div>
                          </CardHeader>
                          <CardContent className="p-0">
                             <div className="w-full overflow-x-auto">
                               <table className="w-full text-sm text-left">
                                 <thead className="text-xs text-muted-foreground bg-muted/10 font-medium border-b border-border/50">
                                   <tr>
                                     <th className="px-6 py-3 font-medium">Date & Time</th>
                                     <th className="px-6 py-3 font-medium">Type</th>
                                     <th className="px-6 py-3 font-medium">Adviser</th>
                                     <th className="px-6 py-3 font-medium">Duration</th>
                                     <th className="px-6 py-3 font-medium">Recording</th>
                                     <th className="px-6 py-3 font-medium text-right">Observation</th>
                                   </tr>
                                 </thead>
                                 <tbody className="divide-y divide-border/50">
                                   {selectedClient.meetings.map(meeting => (
                                     <tr 
                                       key={meeting.id} 
                                       onClick={() => setViewMeetingId(meeting.id.toString())}
                                       className="group hover:bg-muted/30 transition-colors cursor-pointer"
                                     >
                                       <td className="px-6 py-4">
                                         <span className="text-primary font-medium hover:underline decoration-primary/50 underline-offset-4">
                                           {meeting.date} · {meeting.time}
                                         </span>
                                       </td>
                                       <td className="px-6 py-4">{meeting.title}</td>
                                       <td className="px-6 py-4 text-muted-foreground">{meeting.adviser}</td>
                                       <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{meeting.duration}</td>
                                       <td className="px-6 py-4">
                                          <Badge variant="outline" className={cn(
                                            "h-5 px-2 font-normal border-0",
                                            meeting.recording === "Recorded" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                                          )}>
                                            {meeting.recording === "Recorded" && <Mic className="w-3 h-3 mr-1.5" />}
                                            {meeting.recording}
                                          </Badge>
                                       </td>
                                       <td className="px-6 py-4 text-right">
                                         <div className="flex justify-end">
                                            <div className={cn(
                                              "w-2.5 h-2.5 rounded-full",
                                              meeting.status === "Green" ? "bg-green-500" : "bg-amber-500"
                                            )} />
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
                    
                     {/* Row 4: Comms & Docs */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         <Card>
                            <CardHeader className="pb-3">
                               <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                                 <Mail className="w-4 h-4" />
                                 Recent Communications
                               </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               {selectedClient.comms.map((comm, i) => (
                                  <div key={i} className="flex items-start justify-between p-3 rounded-lg border border-border/40 bg-muted/10">
                                     <div className="space-y-1">
                                        <p className="text-sm font-medium">{comm.subject}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                           <span>{comm.from || `To: ${comm.to}`}</span>
                                           <span>·</span>
                                           <span>{comm.date}</span>
                                        </div>
                                     </div>
                                     {comm.tag && (
                                        <Badge variant="secondary" className="text-[9px] h-5 px-1.5 bg-muted text-muted-foreground border-border/50">{comm.tag}</Badge>
                                     )}
                                  </div>
                               ))}
                            </CardContent>
                         </Card>

                         <Card>
                            <CardHeader className="pb-3">
                               <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                                 <FileText className="w-4 h-4" />
                                 Key Documents
                               </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                               {selectedClient.docs.map((doc, i) => (
                                 <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/10">
                                   <div className="flex items-center gap-3">
                                     <div className="p-2 bg-background rounded border border-border/50">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                     </div>
                                     <span className="text-sm font-medium">{doc.name}</span>
                                   </div>
                                   {doc.warn ? (
                                     <Badge variant="outline" className="text-[10px] h-5 px-2 border-red-500/30 text-red-500 bg-red-500/5">Expiring Soon</Badge>
                                   ) : (
                                     <Badge variant="outline" className="text-[10px] h-5 px-2 border-green-500/30 text-green-500 bg-green-500/5">Current</Badge>
                                   )}
                                 </div>
                               ))}
                            </CardContent>
                         </Card>
                     </div>
                  </>
                ) : activeMeeting ? (
                  /* MEETING DETAIL VIEW */
                  <div className="animate-in fade-in duration-300 slide-in-from-bottom-4 space-y-6">
                    
                    {/* Meeting Header */}
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-fit -ml-2 text-muted-foreground hover:text-foreground gap-1"
                        onClick={() => setViewMeetingId(null)}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to meetings
                      </Button>
                      <div className="flex items-center justify-between">
                         <div>
                            <h1 className="text-2xl font-bold tracking-tight">{activeMeeting.title} – {activeMeeting.date}</h1>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                               <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Adviser: {activeMeeting.adviser}</span>
                               <span className="w-1 h-1 rounded-full bg-border" />
                               <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Client: {selectedClient.name}</span>
                               <span className="w-1 h-1 rounded-full bg-border" />
                               <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {activeMeeting.duration}</span>
                            </div>
                         </div>
                         <Badge variant="outline" className="h-7 px-3 border-green-500/30 bg-green-500/5 text-green-500 gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Compliance Checked
                         </Badge>
                      </div>
                    </div>
                    
                    {/* Suggested Updates Panel - Only show if not applied yet */}
                    <AnimatePresence mode="wait">
                      {!updatesApplied ? (
                          <motion.div
                              key="updates-panel"
                              exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.95 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                          >
                              <Card className="border-primary/20 bg-primary/5 overflow-hidden">
                                  <CardHeader className="pb-3 border-b border-primary/10">
                                      <div className="flex items-center justify-between">
                                          <div className="space-y-1">
                                              <CardTitle className="text-base font-medium text-primary flex items-center gap-2">
                                                  <Sparkles className="w-4 h-4" />
                                                  Suggested FactFind Updates
                                              </CardTitle>
                                              <p className="text-xs text-muted-foreground">
                                                  Terminal 1 has scanned this transcript and found changes to the FactFind. Review and approve:
                                              </p>
                                          </div>
                                          <Button onClick={handleAcceptAllUpdates} size="sm" className="gap-2">
                                              <CheckCircle2 className="w-4 h-4" />
                                              Accept all & update FactFind
                                          </Button>
                                      </div>
                                  </CardHeader>
                                  <CardContent className="p-0">
                                      <div className="divide-y divide-primary/10">
                                          {updates.map(update => (
                                              <div key={update.id} className={cn(
                                                  "p-4 grid grid-cols-12 gap-4 items-center transition-colors",
                                                  update.accepted ? "bg-green-500/5" : update.rejected ? "opacity-50 bg-muted/30" : "hover:bg-primary/5"
                                              )}>
                                                  <div className="col-span-3 text-sm font-medium text-muted-foreground">{update.label}</div>
                                                  <div className="col-span-3 text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                                                      {update.old}
                                                  </div>
                                                  <div className="col-span-3 text-sm font-medium text-foreground flex items-center gap-2">
                                                      {update.new}
                                                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0 text-[10px] px-1.5 h-5">Suggested</Badge>
                                                  </div>
                                                  <div className="col-span-3 flex justify-end gap-2">
                                                      <Button 
                                                          variant={update.accepted ? "default" : "outline"} 
                                                          size="sm" 
                                                          className={cn(
                                                              "h-7 text-xs", 
                                                              update.accepted ? "bg-green-600 hover:bg-green-700" : ""
                                                          )}
                                                          onClick={() => toggleUpdateStatus(update.id, 'accepted')}
                                                      >
                                                          {update.accepted ? "Accepted" : "Accept"}
                                                      </Button>
                                                      <Button 
                                                          variant={update.rejected ? "secondary" : "ghost"} 
                                                          size="sm" 
                                                          className="h-7 text-xs"
                                                          onClick={() => toggleUpdateStatus(update.id, 'rejected')}
                                                      >
                                                          {update.rejected ? "Rejected" : "Reject"}
                                                      </Button>
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  </CardContent>
                              </Card>
                          </motion.div>
                      ) : showSuccessMessage ? (
                          <motion.div
                              key="success-message"
                              initial={{ opacity: 0, height: 0, scale: 0.95 }}
                              animate={{ opacity: 1, height: "auto", scale: 1 }}
                              exit={{ opacity: 0, height: 0, scale: 0.95 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                          >
                               <Card className="bg-green-500/10 border-green-500/20 flex items-center justify-center p-8 mb-6">
                                  <div className="flex flex-col items-center gap-3 text-center">
                                      <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                                      </div>
                                      <h3 className="text-lg font-semibold text-green-600">FactFind Successfully Updated</h3>
                                      <p className="text-sm text-muted-foreground">FactFind successfully updated in Intelligent Office</p>
                                  </div>
                               </Card>
                          </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                       
                       {/* Left Column: Summary & Tabs */}
                       <Card className="lg:col-span-2 h-full flex flex-col overflow-hidden">
                          <Tabs defaultValue="summary" className="flex-1 flex flex-col overflow-hidden">
                             <div className="p-4 px-6 border-b border-border bg-muted/10 flex items-center justify-between">
                                <div className="font-medium flex items-center gap-2">
                                   <FileText className="w-4 h-4 text-primary" />
                                   Meeting Summary
                                </div>
                                <div className="flex items-center gap-4">
                                    <TabsList className="h-8 bg-muted/50">
                                        <TabsTrigger value="summary" className="text-xs h-6">Summary</TabsTrigger>
                                        <TabsTrigger value="tasks" className="text-xs h-6">Tasks & Actions</TabsTrigger>
                                        <TabsTrigger value="compliance" className="text-xs h-6">Compliance</TabsTrigger>
                                    </TabsList>
                                    <Button size="sm" variant="outline" className="h-8 gap-2 text-xs">
                                       <Download className="w-3.5 h-3.5" /> Download
                                    </Button>
                                </div>
                             </div>
                             
                             <CardContent className="flex-1 overflow-hidden p-0">
                                <ScrollArea className="h-full">
                                   <TabsContent value="summary" className="m-0 p-8 space-y-8">
                                      <div className="space-y-4">
                                         <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Bot className="w-5 h-5 text-primary" />
                                            Financial Adviser Transcript Summary
                                         </h3>
                                         <p className="text-sm text-muted-foreground leading-relaxed">
                                            Generated by AI Agent "Report" · {activeMeeting.date}
                                         </p>
                                      </div>

                                      <div className="space-y-4">
                                         <h4 className="font-medium text-foreground border-b border-border/50 pb-2">Client Profile & Circumstances</h4>
                                         <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                                            <li>Jane confirmed she is still working as a Senior Project Manager but finds the role increasingly stressful.</li>
                                            <li>She reiterated her strong desire to retire at age 60, which remains her primary financial objective.</li>
                                            <li>Family situation remains stable; married with two children. No new dependents mentioned.</li>
                                         </ul>
                                      </div>

                                      <div className="space-y-4">
                                         <h4 className="font-medium text-foreground border-b border-border/50 pb-2">Financial Plans & Objectives</h4>
                                         <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                                            <li><strong>Pension Contributions:</strong> Current contributions are tracking well against the age 60 retirement target.</li>
                                            <li><strong>Mortgage:</strong> Jane identified the mortgage balance as the main "headwind" to her retirement plans.</li>
                                            <li><strong>Tax-Free Cash:</strong> She explicitly enquired about using her pension tax-free cash (PCLS) to pay down the mortgage balance at retirement.</li>
                                            <li><strong>Consolidation:</strong> Jane mentioned receiving correspondence from Aviva regarding a legacy workplace pension and agreed to forward this for review.</li>
                                         </ul>
                                      </div>

                                      <div className="space-y-4">
                                         <h4 className="font-medium text-foreground border-b border-border/50 pb-2">Risk & Capacity for Loss</h4>
                                         <p className="text-sm text-muted-foreground leading-relaxed">
                                            Jane's attitude to risk appears consistent with previous files (Balanced). Her capacity for loss is supported by her stable income and other assets, though her desire to pay off debt suggests a preference for security in later life.
                                         </p>
                                      </div>
                                   </TabsContent>
                                   
                                   <TabsContent value="tasks" className="m-0 p-8">
                                      <div className="space-y-4">
                                          <h3 className="font-semibold mb-4">Action Items Detected</h3>
                                          <div className="p-4 border border-border rounded-lg bg-muted/10 flex items-start gap-3">
                                              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                                              <div>
                                                  <p className="font-medium text-sm">Model Mortgage Repayment</p>
                                                  <p className="text-xs text-muted-foreground mt-1">Run cashflow model using PCLS to clear mortgage balance at age 60.</p>
                                              </div>
                                          </div>
                                          <div className="p-4 border border-border rounded-lg bg-muted/10 flex items-start gap-3">
                                              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                                              <div>
                                                  <p className="font-medium text-sm">Consolidate Aviva Pension</p>
                                                  <p className="text-xs text-muted-foreground mt-1">Request ceding scheme info from Jane/Aviva and prepare transfer analysis.</p>
                                              </div>
                                          </div>
                                      </div>
                                   </TabsContent>

                                   <TabsContent value="compliance" className="m-0 p-8">
                                      <div className="flex flex-col items-center justify-center h-40 text-center space-y-3">
                                          <ShieldCheck className="w-12 h-12 text-green-500/20" />
                                          <p className="text-muted-foreground">Compliance check passed. No high-risk markers detected.</p>
                                      </div>
                                   </TabsContent>
                                </ScrollArea>
                             </CardContent>
                          </Tabs>
                       </Card>

                       {/* Right Column: Player & Transcript */}
                       <div className="flex flex-col gap-6 h-full overflow-hidden">
                          {/* Player Card */}
                          <Card className="bg-card border-border shadow-lg shrink-0">
                             <CardContent className="p-6 flex flex-col items-center justify-center space-y-6">
                                <div className="text-center space-y-1">
                                   <h3 className="font-medium">Recording</h3>
                                   <p className="text-xs text-muted-foreground">Annual Review · 24 Nov 2025</p>
                                </div>
                                
                                <div className="w-full max-w-[200px] aspect-video bg-muted/20 rounded-lg border border-border/50 flex items-center justify-center relative group cursor-pointer hover:bg-muted/30 transition-colors">
                                   <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                         <Play className="w-5 h-5 text-primary-foreground ml-1" />
                                      </div>
                                   </div>
                                   <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded font-mono">42:13</div>
                                </div>

                                <div className="w-full space-y-2">
                                   <div className="h-1 bg-muted rounded-full overflow-hidden">
                                      <div className="h-full w-1/3 bg-primary" />
                                   </div>
                                   <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                                      <span>15:12</span>
                                      <span>42:13</span>
                                   </div>
                                </div>
                                
                                <div className="flex gap-4 w-full">
                                   <Button variant="outline" size="sm" className="flex-1 text-xs h-8">Download Text</Button>
                                   <Button variant="outline" size="sm" className="flex-1 text-xs h-8">Download Audio</Button>
                                </div>
                             </CardContent>
                          </Card>

                          {/* Transcript Panel */}
                          <Card className="flex-1 flex flex-col overflow-hidden border-border shadow-sm">
                             <CardHeader className="p-4 py-3 border-b border-border bg-muted/10">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                   <ListChecks className="w-4 h-4" />
                                   Transcript
                                </CardTitle>
                             </CardHeader>
                             <CardContent className="flex-1 overflow-hidden p-0 bg-card/50">
                                <ScrollArea className="h-full">
                                   <div className="divide-y divide-border/30">
                                      {TRANSCRIPT_SAMPLE.map((line, i) => (
                                         <div key={i} className={cn(
                                            "p-4 hover:bg-muted/20 transition-colors text-sm group",
                                            i === 0 ? "bg-primary/5" : ""
                                         )}>
                                            <div className="flex items-center justify-between mb-1.5">
                                               <span className={cn(
                                                  "text-[10px] font-bold uppercase tracking-wider",
                                                  line.speaker === "Adviser" ? "text-primary" : "text-muted-foreground"
                                               )}>{line.speaker}</span>
                                               <span className="text-[10px] font-mono text-muted-foreground opacity-50 group-hover:opacity-100">{line.time}</span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed text-xs">{line.text}</p>
                                         </div>
                                      ))}
                                      {/* Mock filler for scroll */}
                                      {[1,2,3].map((_, i) => (
                                         <div key={`filler-${i}`} className="p-4 opacity-50">
                                            <div className="w-16 h-3 bg-muted rounded mb-2" />
                                            <div className="w-full h-3 bg-muted/50 rounded mb-1" />
                                            <div className="w-2/3 h-3 bg-muted/50 rounded" />
                                         </div>
                                      ))}
                                   </div>
                                </ScrollArea>
                             </CardContent>
                          </Card>
                       </div>
                    </div>

                  </div>
                ) : null}

              </div>
            </ScrollArea>

            {/* Client Command Bar - Only visible when NOT in meeting detail view */}
            <AnimatePresence>
              {!viewMeetingId && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl z-30"
                >
                   <div className="mx-6 relative group">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="bg-card/90 backdrop-blur-xl border border-primary/20 rounded-full shadow-2xl p-2 flex items-center gap-3 pl-5 pr-2 relative">
                         <Command className="w-4 h-4 text-primary animate-pulse" />
                         <div className="flex-1 flex flex-col justify-center">
                            <Input 
                              className="border-0 bg-transparent h-6 focus-visible:ring-0 text-sm placeholder:text-muted-foreground/70 p-0"
                              placeholder="Command for Jane Parsons (e.g. 'Generate suitability report')..."
                            />
                         </div>
                         <Button size="sm" className="h-8 rounded-full px-4 text-xs bg-primary/90 hover:bg-primary">
                            Run
                         </Button>
                      </div>
                      <div className="absolute -bottom-8 left-0 right-0 text-center flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                         <Badge variant="outline" className="bg-background/80 backdrop-blur border-border/50 text-[10px] text-muted-foreground cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                            "When did Jane last ask about retiring?"
                         </Badge>
                         <Badge variant="outline" className="bg-background/80 backdrop-blur border-border/50 text-[10px] text-muted-foreground cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                            "Show provider chases"
                         </Badge>
                         <Badge variant="outline" className="bg-background/80 backdrop-blur border-border/50 text-[10px] text-muted-foreground cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                            "Start mortgage review"
                         </Badge>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
      ) : view === "profile" && !selectedClient ? (
          <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">Client profile not found.</p>
                <Button onClick={handleBackToBrowse}>Back to list</Button>
              </div>
          </div>
      ) : null}
    </div>
  );
}

function Bot(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  )
}
