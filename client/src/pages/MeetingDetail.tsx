import { 
  Calendar, 
  Clock, 
  User, 
  Briefcase, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  MoreHorizontal, 
  Shield, 
  Home, 
  Banknote,
  GitBranch,
  Clock3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function MeetingDetailPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border px-6 flex items-center gap-4 bg-background/95 backdrop-blur z-20 shrink-0">
        <Link href="/opportunities">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-2">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back
          </Button>
        </Link>
        <Separator orientation="vertical" className="h-6" />
        <h1 className="font-semibold text-lg">Meeting Detail</h1>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          
          {/* A. Meeting Header */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-semibold">Meeting with Jane Parsons</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Annual Review • 24 Nov 2025</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 h-auto">
                    <CheckCircle2 className="w-3 h-3 mr-2" />
                    Processed
                  </Badge>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => alert("Opening transcript in Command (Demo)")}>
                    <FileText className="w-3 h-3 mr-2" />
                    Open transcript
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Client</span>
                  <div className="flex items-center gap-2 font-medium">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Jane Parsons
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Adviser</span>
                  <div className="flex items-center gap-2 font-medium">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    Sarah Evans
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Date</span>
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    24 Nov 2025
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Duration</span>
                  <div className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    46 minutes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* B. AI Meeting Summary */}
          <Card className="border-border bg-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                AI Meeting Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mt-2">
                {[
                  "Client wants to consolidate two old workplace pensions into a single, current plan.",
                  "Fixed-rate mortgage ends in 12 months; open to reviewing options closer to expiry.",
                  "Client has no income protection and is worried about job security.",
                  "Comfortable increasing monthly contributions if it helps retire earlier."
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* C. Opportunities from This Meeting */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Opportunities from this meeting
              <Badge variant="secondary" className="ml-2 text-xs font-normal">3 identified</Badge>
            </h2>

            {/* Opportunity 1 - Pension Transfer */}
            <Card className="border-border overflow-hidden group hover:border-primary/40 transition-all duration-300">
              <div className="h-1 bg-green-500 w-full" />
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-green-500/10 text-green-500">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">Pension Transfer</h3>
                        <p className="text-sm text-muted-foreground">Consolidate two legacy workplace pensions into current SIPP.</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Est. Value</span>
                        <span className="font-mono font-medium">£120,000</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Owner</span>
                        <span>IFA — Sarah Evans</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Workflow</span>
                        <span className="flex items-center gap-1.5">
                          <GitBranch className="w-3 h-3" />
                          Pension Transfer
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 min-w-[200px]">
                    <div className="text-right space-y-1">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-2.5">Live</Badge>
                      <div className="text-xs text-muted-foreground pt-1">Next Action: Start transfer case</div>
                    </div>
                    
                    <div className="mt-auto pt-4 w-full border-t border-border/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Assigned to: <span className="text-foreground font-medium">Sarah Evans</span></span>
                        <Button variant="link" className="h-auto p-0 text-primary" onClick={() => alert("Opening workflow (Demo)")}>
                          Open workflow <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opportunity 2 - Mortgage Renewal */}
            <Card className="border-border overflow-hidden group hover:border-primary/40 transition-all duration-300">
              <div className="h-1 bg-amber-500 w-full" />
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-amber-500/10 text-amber-500">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">Mortgage Renewal</h3>
                        <p className="text-sm text-muted-foreground">Fixed-rate mortgage ends in 12 months; review options.</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Est. Value</span>
                        <span className="font-mono font-medium">£300,000 balance</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Owner</span>
                        <span>Mortgage Team</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Workflow</span>
                        <span className="flex items-center gap-1.5">
                          <GitBranch className="w-3 h-3" />
                          Mortgage Renewal
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 min-w-[200px]">
                    <div className="text-right space-y-1">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-2.5">On Hold</Badge>
                      <div className="text-xs text-muted-foreground pt-1">Next Action: Contact in 90 days</div>
                    </div>
                    
                    <div className="mt-auto pt-4 w-full border-t border-border/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Route: <span className="text-foreground font-medium">Holding Queue → Broker</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Automation Sequence Visualization */}
                <div className="mt-6 bg-muted/30 rounded-lg p-4 border border-border/50 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/20" />
                   <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                     <Clock3 className="w-3 h-3" />
                     Automation Sequence
                   </h4>
                   
                   <div className="space-y-4 relative ml-2">
                     <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border border-l border-dashed border-muted-foreground/30" />
                     
                     <div className="relative flex items-start gap-4">
                       <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 ring-4 ring-background relative z-10" />
                       <div className="flex-1">
                         <span className="text-xs font-semibold text-foreground">Today</span>
                         <p className="text-xs text-muted-foreground">Tag client for renewal and send summary to IFA.</p>
                       </div>
                     </div>

                     <div className="relative flex items-start gap-4 opacity-60">
                       <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40 mt-1.5 ring-4 ring-background relative z-10" />
                       <div className="flex-1">
                         <span className="text-xs font-semibold text-foreground">90 days before expiry</span>
                         <p className="text-xs text-muted-foreground">Notify Mortgage Team.</p>
                       </div>
                     </div>

                     <div className="relative flex items-start gap-4 opacity-40">
                       <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20 mt-1.5 ring-4 ring-background relative z-10" />
                       <div className="flex-1">
                         <span className="text-xs font-semibold text-foreground">30 days before expiry</span>
                         <p className="text-xs text-muted-foreground">Broker contacts client directly.</p>
                       </div>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Opportunity 3 - Protection Gap */}
            <Card className="border-border overflow-hidden group hover:border-primary/40 transition-all duration-300">
              <div className="h-1 bg-blue-500 w-full" />
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">Protection Gap</h3>
                        <p className="text-sm text-muted-foreground">Discuss income protection in case of job loss.</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Est. Value</span>
                        <span className="font-mono font-medium">£80/month</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Owner</span>
                        <span>Protection Specialist</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Workflow</span>
                        <span className="flex items-center gap-1.5">
                          <GitBranch className="w-3 h-3" />
                          Protection Recommendation
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 min-w-[200px]">
                    <div className="text-right space-y-1">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-2.5">Live</Badge>
                      <div className="text-xs text-muted-foreground pt-1">Next Action: Call client next week</div>
                    </div>
                    
                    <div className="mt-auto pt-4 w-full border-t border-border/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Assigned to: <span className="text-foreground font-medium">Protection Team</span></span>
                        <Button variant="link" className="h-auto p-0 text-primary" onClick={() => alert("Opening workflow (Demo)")}>
                          Open workflow <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
