import { useState } from "react";
import { 
  ArrowRight, 
  Plus, 
  Mail, 
  Phone, 
  FileText, 
  Bell, 
  Clock, 
  CheckCircle, 
  MoreHorizontal,
  Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "wait";
  title: string;
  icon: any;
  status?: "active" | "inactive";
}

export default function WorkflowsPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState("pension-transfer");
  const [selectedNode, setSelectedNode] = useState<string | null>("node-3");

  const workflows = [
    { id: "pension-transfer", name: "Pension Transfer", desc: "Automates end-to-end pension transfer process", status: "Active" },
    { id: "isa-top-up", name: "ISA Top-Up", desc: "Client deposit and fund allocation flow", status: "Draft" },
    { id: "protection-policy", name: "Protection Policy", desc: "Underwriting and policy issuance check", status: "Active" },
  ];

  const nodes: WorkflowNode[] = [
    { id: "node-1", type: "trigger", title: "New Pension Transfer Request", icon: FileText },
    { id: "node-2", type: "action", title: "Email Client for Details", icon: Mail },
    { id: "node-3", type: "action", title: "Request Ceding Info from Provider", icon: Phone },
    { id: "node-4", type: "wait", title: "Wait for Provider Response", icon: Clock },
    { id: "node-5", type: "action", title: "Generate Suitability Report", icon: FileText },
    { id: "node-6", type: "action", title: "Notify Adviser & Update CRM", icon: Bell },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-background z-20">
        <h1 className="font-semibold text-lg">Workflows</h1>
      </header>

      {/* Top Strip - Workflow Library */}
      <div className="h-40 border-b border-border bg-muted/10 p-6 flex gap-4 overflow-x-auto items-center">
        {workflows.map((wf) => (
          <Card 
            key={wf.id}
            onClick={() => setSelectedWorkflow(wf.id)}
            className={cn(
              "w-72 shrink-0 cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedWorkflow === wf.id 
                ? "border-primary shadow-sm bg-card" 
                : "border-border bg-card/50 opacity-70 hover:opacity-100"
            )}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium">{wf.name}</CardTitle>
                <Badge variant={wf.status === "Active" ? "default" : "secondary"} className="text-[10px] h-5">
                  {wf.status}
                </Badge>
              </div>
              <CardDescription className="text-xs line-clamp-2 mt-1">{wf.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
        
        <Button variant="outline" className="h-[100px] w-24 shrink-0 border-dashed flex flex-col gap-2 text-muted-foreground hover:text-foreground">
          <Plus className="w-6 h-6" />
          <span className="text-xs">New</span>
        </Button>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Canvas (Center) */}
        <div className="flex-1 bg-muted/5 p-10 overflow-auto relative">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="max-w-md mx-auto space-y-8 relative z-10 pt-10">
            {nodes.map((node, index) => (
              <div key={node.id} className="relative flex flex-col items-center group">
                {/* Node Card */}
                <div 
                  onClick={() => setSelectedNode(node.id)}
                  className={cn(
                    "w-64 p-4 rounded-xl border transition-all duration-200 cursor-pointer relative z-20 flex items-center gap-3",
                    selectedNode === node.id
                      ? "bg-card border-primary shadow-lg ring-2 ring-primary/20"
                      : "bg-card border-border hover:border-primary/50 shadow-sm"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                    selectedNode === node.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    <node.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{node.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{node.type}</p>
                  </div>
                  {selectedNode === node.id && (
                    <div className="absolute -right-1 -top-1 h-3 w-3 bg-primary rounded-full border-2 border-card" />
                  )}
                </div>

                {/* Connecting Line */}
                {index < nodes.length - 1 && (
                  <div className="h-8 w-0.5 bg-border relative">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                      <ArrowRight className="w-3 h-3 text-border rotate-90" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Config Panel (Right) */}
        <div className="w-80 border-l border-border bg-card p-6 flex flex-col shadow-xl z-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-sm">Node Configuration</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {selectedNode ? (
            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Node Name</Label>
                <Input 
                  defaultValue={nodes.find(n => n.id === selectedNode)?.title} 
                  className="font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Action Type</Label>
                <Select defaultValue="call-provider">
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email-provider">Email Provider</SelectItem>
                    <SelectItem value="call-provider">Call Provider</SelectItem>
                    <SelectItem value="fill-form">Fill Form</SelectItem>
                    <SelectItem value="create-task">Create Task</SelectItem>
                    <SelectItem value="run-check">Run Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Textarea 
                  placeholder="Explain what this step does..." 
                  className="resize-none h-20 text-sm"
                  defaultValue="Initiates an automated call to the provider to request ceding scheme details."
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-xs font-semibold flex items-center justify-between">
                  Inputs / Mappings
                  <span className="text-[10px] text-primary cursor-pointer hover:underline">Edit</span>
                </Label>
                
                <div className="bg-muted/30 rounded-md p-3 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Client Name</span>
                    <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">{"{{client.name}}"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Policy Number</span>
                    <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">{"{{policy.number}}"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Provider ID</span>
                    <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">{"{{provider.id}}"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Template Preview</Label>
                <div className="bg-muted/50 p-3 rounded-md border border-border text-xs text-muted-foreground italic">
                  "Dear Aviva, we are requesting ceding scheme information for {"{{client.name}}"} (policy {"{{policy.number}}"})..."
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select a node to configure
            </div>
          )}

          <div className="pt-6 mt-auto">
            <Button className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Node
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
