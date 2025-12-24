import { useState, useEffect } from "react";
import { 
  Activity, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight,
  MoreHorizontal,
  Filter,
  AlertTriangle,
  Clock,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data ---

const REVENUE_LEVERS = [
  {
    id: 1,
    title: "Untapped Mortgage Referrals",
    text: "27 mortgage opportunities in last 14 days; only 2 referred to brokers.",
    impact: "+£41k",
    action: "View affected opportunities"
  },
  {
    id: 2,
    title: "Low Protection Uptake",
    text: "Adviser Sarah Evans: 9 protection opportunities; 0 workflows started.",
    impact: "+£18k",
    action: "View adviser details"
  },
  {
    id: 3,
    title: "Pension Transfer Drop-off",
    text: "Only 38% of pension workflows progress past Provider Info stage.",
    impact: "+20% Conv.",
    action: "View bottleneck"
  }
];

const BOTTLENECKS = [
  { id: "ops", label: "Ops", score: 62, subtext: "Some backlog in case handling", status: "amber" },
  { id: "mortgage", label: "Mortgage Team", score: 35, subtext: "Low referral conversion", status: "red" },
  { id: "protection", label: "Protection Team", score: 88, subtext: "Flowing well", status: "green" },
  { id: "advisers", label: "Advisers", score: 74, subtext: "Avg response time 4h", status: "amber" },
  { id: "providers", label: "Providers", score: 48, subtext: "Slow responses from 3 key providers", status: "red" },
  { id: "automations", label: "Automations", score: 94, subtext: "High efficiency", status: "green" },
];

const SLIPPING_OPPS = [
  { id: 1, client: "Mark Hill", type: "Pension Transfer", value: "£340k", age: "9 days", reason: "No workflow started" },
  { id: 2, client: "Jane Parsons", type: "Mortgage", value: "£280k", age: "12 days", reason: "Not referred to broker" },
  { id: 3, client: "Robert Fox", type: "Protection", value: "£1,200/yr", age: "15 days", reason: "Waiting on adviser" },
  { id: 4, client: "Julia Chen", type: "ISA Transfer", value: "£45k", age: "7 days", reason: "Stuck in Ops" },
];

// --- Components ---

function AnimatedNumber({ value, className }: { value: number, className?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {value}
    </motion.span>
  );
}

function FlowNode({ label, count, color, onClick, isSelected }: any) {
  return (
    <div 
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer w-32 z-10 bg-card",
        isSelected 
          ? "border-primary shadow-[0_0_15px_rgba(0,0,0,0.2)] shadow-primary/20 scale-105" 
          : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
      )}
      onClick={onClick}
    >
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</span>
      <span className={cn("text-2xl font-bold", color)}>{count}</span>
    </div>
  );
}

function FlowLink({ from, to, width, color, delay }: any) {
  return (
    <div className="flex-1 h-[100px] relative flex items-center overflow-visible">
       <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
         <motion.path
           d={`M 0,50 C ${width*2},50 ${100-(width*2)},50 100,50`} // Simplified straightish line for block layout
           vectorEffect="non-scaling-stroke"
           stroke="currentColor"
           strokeWidth={width}
           fill="none"
           className={cn("opacity-20", color)}
           initial={{ pathLength: 0, opacity: 0 }}
           animate={{ pathLength: 1, opacity: 0.2 }}
           transition={{ duration: 1, delay }}
         />
         {/* Animated flow particles */}
         <motion.circle 
            r="2" 
            fill="currentColor" 
            className={color}
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            style={{ offsetPath: `path("M 0,50 C ${width*2},50 ${100-(width*2)},50 100,50")` }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: Math.random() }}
         />
       </svg>
    </div>
  )
}

export default function MIPage() {
  const [momentum, setMomentum] = useState(82);
  const [friction, setFriction] = useState(27);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedBottleneck, setSelectedBottleneck] = useState<string | null>(null);
  
  // Simulate live data
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setMomentum(prev => Math.min(100, Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1))));
      }
      if (Math.random() > 0.8) {
        setFriction(prev => Math.min(100, Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1))));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground font-sans">
      {/* 1. Top Section - Firm Pulse Header */}
      <header className="h-20 border-b border-border px-8 flex items-center justify-between bg-background/95 backdrop-blur z-20 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="flex flex-col">
                <h1 className="text-4xl font-bold flex items-baseline gap-2 text-foreground tracking-tight">
                   <AnimatedNumber value={momentum} />
                   <span className="text-sm font-medium text-muted-foreground translate-y-[-4px]">/ 100</span>
                </h1>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Firm Momentum</span>
             </div>
             <div className="h-8 w-px bg-border/60" />
             <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Live score based on flow velocity</div>
                <div className="flex items-center gap-2">
                   <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] text-green-500 font-medium">System Active</span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <Card className="border-border/40 bg-muted/10 shadow-none">
              <div className="px-4 py-2 flex items-center gap-3">
                 <Activity className="w-4 h-4 text-amber-500" />
                 <div>
                    <div className="text-lg font-bold leading-none text-amber-500"><AnimatedNumber value={friction} /></div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Friction Index</div>
                 </div>
              </div>
           </Card>
           <Card className="border-border/40 bg-muted/10 shadow-none">
              <div className="px-4 py-2 flex items-center gap-3">
                 <Zap className="w-4 h-4 text-primary" />
                 <div>
                    <div className="text-lg font-bold leading-none text-primary">56</div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Active Agents</div>
                 </div>
              </div>
           </Card>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-8 space-y-8 max-w-[1800px] mx-auto pb-20">
          
          {/* 2. Core Visual - Sankey "Flow of the Firm" */}
          <div className="flex flex-col xl:flex-row gap-8 h-[500px]">
            
            {/* Sankey Diagram Area */}
            <Card className="flex-[2] flex flex-col shadow-sm border-border/60 bg-card/30 overflow-hidden relative">
               <CardHeader className="pb-2 border-b border-border/40 px-6 pt-6">
                  <CardTitle className="text-lg font-medium">Flow of the Firm</CardTitle>
               </CardHeader>
               <CardContent className="flex-1 p-0 relative flex items-center justify-center">
                  <div className="flex items-center justify-between w-full max-w-4xl px-8">
                     
                     {/* Meetings */}
                     <FlowNode 
                        label="Meetings" 
                        count={120} 
                        color="text-foreground" 
                        isSelected={selectedStage === "Meetings"}
                        onClick={() => setSelectedStage(selectedStage === "Meetings" ? null : "Meetings")}
                     />

                     <div className="h-2 w-12 bg-green-500/20 rounded-full mx-2 relative overflow-hidden">
                        <motion.div className="absolute inset-0 bg-green-500/40" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                     </div>
                     
                     {/* Opportunities */}
                     <FlowNode 
                        label="Opportunities" 
                        count={80} 
                        color="text-green-500" 
                        isSelected={selectedStage === "Opportunities"}
                        onClick={() => setSelectedStage(selectedStage === "Opportunities" ? null : "Opportunities")}
                     />

                     <div className="h-2 w-12 bg-amber-500/20 rounded-full mx-2 relative overflow-hidden">
                        <motion.div className="absolute inset-0 bg-amber-500/40" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} />
                     </div>

                     {/* Workflows */}
                     <FlowNode 
                        label="Workflows" 
                        count={35} 
                        color="text-amber-500" 
                        isSelected={selectedStage === "Workflows"}
                        onClick={() => setSelectedStage(selectedStage === "Workflows" ? null : "Workflows")}
                     />

                     <div className="h-2 w-12 bg-foreground/10 rounded-full mx-2 relative overflow-hidden">
                        <motion.div className="absolute inset-0 bg-foreground/20" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                     </div>

                     {/* Submissions */}
                     <FlowNode 
                        label="Submissions" 
                        count={28} 
                        color="text-foreground" 
                        isSelected={selectedStage === "Submissions"}
                        onClick={() => setSelectedStage(selectedStage === "Submissions" ? null : "Submissions")}
                     />

                     <div className="h-2 w-12 bg-green-500/20 rounded-full mx-2 relative overflow-hidden">
                        <motion.div className="absolute inset-0 bg-green-500/40" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                     </div>

                     {/* Revenue */}
                     <FlowNode 
                        label="Revenue" 
                        count={15} 
                        color="text-green-500" 
                        isSelected={selectedStage === "Revenue"}
                        onClick={() => setSelectedStage(selectedStage === "Revenue" ? null : "Revenue")}
                     />
                  </div>

                  {/* Detail Drawer Overlay */}
                  <AnimatePresence>
                    {selectedStage && (
                       <motion.div 
                          initial={{ x: "100%" }}
                          animate={{ x: 0 }}
                          exit={{ x: "100%" }}
                          className="absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-border shadow-xl z-20 p-6 overflow-auto"
                       >
                          <div className="flex justify-between items-center mb-6">
                             <h3 className="font-semibold text-lg">{selectedStage} Analysis</h3>
                             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedStage(null)}>
                                <ChevronRight className="w-4 h-4" />
                             </Button>
                          </div>
                          
                          {selectedStage === "Workflows" && (
                             <div className="space-y-6">
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                                   <div className="flex gap-2 items-start">
                                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                                      <div>
                                         <h4 className="text-sm font-medium text-red-500">Huge Drop-off Detected</h4>
                                         <p className="text-xs text-muted-foreground mt-1">45 opportunities failed to convert to workflows this week.</p>
                                      </div>
                                   </div>
                                </div>
                                <div className="space-y-3">
                                   <h4 className="text-xs font-medium uppercase text-muted-foreground">Top Reasons</h4>
                                   <div className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                         <span>Not referred to broker</span>
                                         <span className="font-mono text-muted-foreground">40%</span>
                                      </div>
                                      <Progress value={40} className="h-1" />
                                   </div>
                                   <div className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                         <span>Client cold / no response</span>
                                         <span className="font-mono text-muted-foreground">25%</span>
                                      </div>
                                      <Progress value={25} className="h-1" />
                                   </div>
                                </div>
                             </div>
                          )}
                          
                          {selectedStage !== "Workflows" && (
                             <div className="text-sm text-muted-foreground flex flex-col items-center justify-center h-40">
                                <Activity className="w-8 h-8 mb-2 opacity-20" />
                                No critical alerts for this stage.
                             </div>
                          )}
                       </motion.div>
                    )}
                  </AnimatePresence>
               </CardContent>
               
               {/* 6. Compliance Indicator */}
               <div className="absolute bottom-4 left-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/20 rounded-full border border-border/50">
                     <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />
                     <span className="text-[10px] text-muted-foreground">Compliance: No material impact on flow</span>
                  </div>
               </div>
            </Card>

            {/* 3. Right Panel - Top Revenue Levers */}
            <div className="flex-1 min-w-[350px] flex flex-col gap-4">
               <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Top Levers for Revenue</h2>
                  <Badge variant="outline" className="text-green-500 bg-green-500/10 border-green-500/20">3 Active</Badge>
               </div>
               
               <div className="flex-1 space-y-3">
                  {REVENUE_LEVERS.map((lever) => (
                     <Card key={lever.id} className="bg-card/50 hover:bg-card transition-colors border-border/60 shadow-sm group cursor-pointer">
                        <CardContent className="p-5 space-y-3">
                           <div className="flex justify-between items-start gap-4">
                              <h3 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">{lever.title}</h3>
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 shrink-0">{lever.impact}</Badge>
                           </div>
                           <p className="text-xs text-muted-foreground leading-relaxed">{lever.text}</p>
                           <Button variant="ghost" size="sm" className="h-7 px-0 text-xs text-primary hover:text-primary/80 hover:bg-transparent p-0 flex items-center gap-1">
                              {lever.action} <ArrowRight className="w-3 h-3" />
                           </Button>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
          </div>

          {/* 4. Bottleneck Heatmap */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Where We're Slowing Down (This Week)</h2>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {BOTTLENECKS.map((item) => (
                   <div 
                      key={item.id}
                      onClick={() => setSelectedBottleneck(selectedBottleneck === item.id ? null : item.id)}
                      className={cn(
                         "p-4 rounded-lg border border-border/50 cursor-pointer transition-all hover:scale-[1.02]",
                         item.status === "green" ? "bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/30" :
                         item.status === "amber" ? "bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/30" :
                         "bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30",
                         selectedBottleneck === item.id && "ring-2 ring-primary"
                      )}
                   >
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.label}</span>
                         <span className={cn(
                            "text-sm font-bold",
                            item.status === "green" ? "text-green-500" :
                            item.status === "amber" ? "text-amber-500" : "text-red-500"
                         )}>{item.score}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-tight">{item.subtext}</p>
                   </div>
                ))}
             </div>
             
             {/* Bottleneck Detail Panel (Conditional) */}
             <AnimatePresence>
               {selectedBottleneck === "mortgage" && (
                  <motion.div 
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: "auto", opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="overflow-hidden"
                  >
                     <Card className="bg-muted/20 border-border border-l-4 border-l-red-500">
                        <CardContent className="p-4 flex items-center justify-between">
                           <div className="space-y-1">
                              <h4 className="text-sm font-medium">Mortgage Referral Bottleneck Detected</h4>
                              <p className="text-xs text-muted-foreground">27 opportunities identified in last 14 days, but only 2 have been referred to broker team.</p>
                           </div>
                           <div className="flex gap-3">
                              <Button size="sm" variant="outline">View Advisers</Button>
                              <Button size="sm">Auto-nudge Advisers</Button>
                           </div>
                        </CardContent>
                     </Card>
                  </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* 5. Slipping Opportunities Panel */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Slipping Opportunities</h2>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" className="h-7 text-xs">All</Button>
                   <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">Mortgage</Button>
                   <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">Protection</Button>
                   <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">Pension</Button>
                </div>
             </div>
             
             <Card className="border-border/60 shadow-sm bg-card/40">
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground bg-muted/20 font-medium">
                         <tr>
                            <th className="px-6 py-3 font-medium">Client</th>
                            <th className="px-6 py-3 font-medium">Type</th>
                            <th className="px-6 py-3 font-medium">Value</th>
                            <th className="px-6 py-3 font-medium">Age</th>
                            <th className="px-6 py-3 font-medium">Status / Reason</th>
                            <th className="px-6 py-3 font-medium text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                         {SLIPPING_OPPS.map((opp) => (
                            <tr key={opp.id} className="hover:bg-muted/10 transition-colors group">
                               <td className="px-6 py-3 font-medium text-foreground">{opp.client}</td>
                               <td className="px-6 py-3 text-muted-foreground">{opp.type}</td>
                               <td className="px-6 py-3 font-mono text-xs">{opp.value}</td>
                               <td className="px-6 py-3 text-amber-500 text-xs font-medium bg-amber-500/5 rounded w-fit px-2 py-1 inline-block my-2">{opp.age}</td>
                               <td className="px-6 py-3 text-muted-foreground">{opp.reason}</td>
                               <td className="px-6 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
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
