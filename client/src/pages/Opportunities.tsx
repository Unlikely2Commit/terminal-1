import { useState } from "react";
import { Link } from "wouter";
import { 
  LayoutList, 
  Filter, 
  Search, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  CheckSquare, 
  ArrowUpRight, 
  Calendar, 
  DollarSign,
  Briefcase,
  User,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Opportunity {
  id: string;
  client: string;
  product: string;
  value: number;
  confidence: "High" | "Medium" | "Low";
  status: "New" | "Active" | "Won" | "Lost";
  source: "Meeting" | "Email" | "Referral";
  lastActivity: string;
  owner: string;
  transcript: string;
  meetingLink?: string;
}

const opportunities: Opportunity[] = [
  {
    id: "1",
    client: "Jane Parsons",
    product: "Pension Transfer",
    value: 120000,
    confidence: "High",
    status: "Active",
    source: "Meeting",
    lastActivity: "Today, 10:14",
    owner: "Sarah Evans",
    transcript: "Client mentioned she has an old workplace pension and wants to consolidate into a single plan.",
    meetingLink: "/meeting-detail"
  },
  {
    id: "7",
    client: "Jane Parsons",
    product: "Mortgage Renewal",
    value: 300000,
    confidence: "High",
    status: "Active",
    source: "Meeting",
    lastActivity: "Today, 10:15",
    owner: "Mortgage Team",
    transcript: "Fixed-rate mortgage ends in 12 months; wants to review options early.",
    meetingLink: "/meeting-detail"
  },
  {
    id: "8",
    client: "Jane Parsons",
    product: "Protection Gap",
    value: 960, // £80/month * 12
    confidence: "Medium",
    status: "New",
    source: "Meeting",
    lastActivity: "Today, 10:20",
    owner: "Protection Specialist",
    transcript: "discussed income protection in case of job loss. Client is interested but needs quotes.",
    meetingLink: "/meeting-detail"
  },
  {
    id: "2",
    client: "Mark Hill",
    product: "Protection Policy",
    value: 45000,
    confidence: "Medium",
    status: "New",
    source: "Email",
    lastActivity: "Yesterday, 14:30",
    owner: "James Wood",
    transcript: "Inquired about life insurance options for his growing family. Specifically interested in critical illness cover."
  },
  {
    id: "3",
    client: "Sarah Evans",
    product: "ISA Top-Up",
    value: 20000,
    confidence: "High",
    status: "Won",
    source: "Meeting",
    lastActivity: "23 Nov, 09:15",
    owner: "Sarah Evans",
    transcript: "Confirmed intention to maximize ISA allowance before end of tax year. Requested transfer forms."
  },
  {
    id: "4",
    client: "Robert Fox",
    product: "Mortgage",
    value: 350000,
    confidence: "Low",
    status: "Lost",
    source: "Referral",
    lastActivity: "22 Nov, 16:45",
    owner: "Marcus Chen",
    transcript: "Looking to remortgage but current rates are too high. Decided to stick with current lender for now."
  },
  {
    id: "5",
    client: "Elena Roy",
    product: "Pension Consolidation",
    value: 280000,
    confidence: "High",
    status: "Active",
    source: "Email",
    lastActivity: "21 Nov, 11:20",
    owner: "Sarah Evans",
    transcript: "Sent details of three separate pots to review. Wants to understand fee structure for consolidation."
  },
  {
    id: "6",
    client: "David Miller",
    product: "Investment Bond",
    value: 150000,
    confidence: "Medium",
    status: "New",
    source: "Meeting",
    lastActivity: "20 Nov, 15:10",
    owner: "James Wood",
    transcript: "Discussed tax-efficient withdrawal strategies for inheritance planning. Needs follow-up meeting."
  }
];

export default function OpportunitiesPage() {
  const [selectedId, setSelectedId] = useState<string | null>("1");
  
  const selectedOpp = opportunities.find(o => o.id === selectedId);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="h-auto border-b border-border bg-background/95 backdrop-blur z-20 shrink-0 flex flex-col gap-4 p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-lg flex items-center gap-2">
              <LayoutList className="w-5 h-5 text-muted-foreground" />
              Opportunities
            </h1>
            <div className="h-4 w-px bg-border mx-2" />
            <div className="flex gap-4 text-xs text-muted-foreground">
               <div className="flex items-center gap-1.5">
                 <span className="font-medium text-foreground">73</span> Open Opps
               </div>
               <div className="flex items-center gap-1.5">
                 <span className="font-medium text-foreground">£4.2M</span> Pipeline
               </div>
               <div className="flex items-center gap-1.5">
                 <span className="font-medium text-foreground text-green-500">£320k</span> Won This Month
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <Button size="sm" className="h-8">
               <LayoutList className="w-3.5 h-3.5 mr-2" />
               New Opportunity
             </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-xs w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search opportunities..." 
              className="pl-8 h-8 text-xs bg-muted/30 border-border/60"
            />
          </div>
          
          <div className="h-4 w-px bg-border mx-1" />
          
          <Select defaultValue="me">
            <SelectTrigger className="h-8 w-[110px] text-xs bg-muted/30 border-border/60">
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="me">Me</SelectItem>
              <SelectItem value="team">My Team</SelectItem>
              <SelectItem value="firm">Whole Firm</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="h-8 w-[110px] text-xs bg-muted/30 border-border/60">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="h-8 w-[130px] text-xs bg-muted/30 border-border/60">
              <SelectValue placeholder="Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="pension">Pension</SelectItem>
              <SelectItem value="isa">ISA</SelectItem>
              <SelectItem value="mortgage">Mortgage</SelectItem>
              <SelectItem value="protection">Protection</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Main Table Area */}
        <div className="flex-1 overflow-auto bg-muted/5">
          <table className="w-full text-sm text-left border-separate border-spacing-0">
            <thead className="text-xs text-muted-foreground bg-muted/30 font-medium sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-3 font-medium border-b border-border">Client</th>
                <th className="px-4 py-3 font-medium border-b border-border">Product</th>
                <th className="px-4 py-3 font-medium border-b border-border">Value</th>
                <th className="px-4 py-3 font-medium border-b border-border">Confidence</th>
                <th className="px-4 py-3 font-medium border-b border-border">Status</th>
                <th className="px-4 py-3 font-medium border-b border-border">Source</th>
                <th className="px-4 py-3 font-medium border-b border-border text-right">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {opportunities.map((opp) => (
                <tr 
                  key={opp.id} 
                  onClick={() => setSelectedId(opp.id)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-muted/30",
                    selectedId === opp.id ? "bg-primary/5 hover:bg-primary/10" : ""
                  )}
                >
                  <td className="px-6 py-3.5">
                    <div className="font-medium text-foreground">{opp.client}</div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{opp.product}</td>
                  <td className="px-4 py-3.5 font-mono text-foreground">{formatCurrency(opp.value)}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant="outline" className={cn(
                      "font-normal border-0",
                      opp.confidence === "High" ? "bg-green-500/10 text-green-500" :
                      opp.confidence === "Medium" ? "bg-amber-500/10 text-amber-500" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {opp.confidence}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant="secondary" className={cn(
                      "font-normal h-5 px-2",
                      opp.status === "Active" ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" :
                      opp.status === "New" ? "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" :
                      opp.status === "Won" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" :
                      "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    )}>
                      {opp.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground text-xs">{opp.source}</td>
                  <td className="px-4 py-3.5 text-right text-xs text-muted-foreground font-mono">{opp.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Detail Panel */}
        {selectedOpp && (
          <div className="w-96 border-l border-border bg-card shadow-xl z-20 flex flex-col overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-lg">{selectedOpp.client}</h2>
                <p className="text-sm text-muted-foreground">{selectedOpp.product}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-8">
              {/* Key Fields */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Owner
                  </span>
                  <span className="text-sm font-medium">{selectedOpp.owner}</span>
                </div>
                <Separator className="opacity-50" />
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5" /> Estimated Value
                  </span>
                  <span className="text-sm font-medium font-mono">{formatCurrency(selectedOpp.value)}</span>
                </div>
                <Separator className="opacity-50" />
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Confidence
                  </span>
                  <Badge variant="outline" className={cn(
                      "font-normal border-0 h-5",
                      selectedOpp.confidence === "High" ? "bg-green-500/10 text-green-500" :
                      selectedOpp.confidence === "Medium" ? "bg-amber-500/10 text-amber-500" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {selectedOpp.confidence}
                  </Badge>
                </div>
                <Separator className="opacity-50" />
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" /> Source
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{selectedOpp.source}</span>
                    {selectedOpp.source === "Meeting" && selectedOpp.meetingLink && (
                      <Link href={selectedOpp.meetingLink}>
                        <Button variant="link" className="h-auto p-0 text-[10px] text-primary">View meeting</Button>
                      </Link>
                    )}
                    {selectedOpp.source !== "Meeting" && (
                      <Button variant="link" className="h-auto p-0 text-[10px] text-primary">View</Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Transcript Snippet */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Origin Context</label>
                <div className="bg-muted/30 p-4 rounded-md border border-border text-sm italic text-muted-foreground leading-relaxed relative">
                   <span className="absolute top-2 left-2 text-2xl text-muted-foreground/20 font-serif">"</span>
                   {selectedOpp.transcript}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Suggested Actions</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-3.5 h-3.5 mr-2" />
                    Call Client
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-3.5 h-3.5 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" className="w-full justify-start col-span-2">
                    <CheckSquare className="w-3.5 h-3.5 mr-2" />
                    Create Task
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-auto p-6 border-t border-border bg-muted/10 space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Won
              </Button>
              <Button variant="outline" className="w-full hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50">
                <XCircle className="w-4 h-4 mr-2" />
                Mark as Lost
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
