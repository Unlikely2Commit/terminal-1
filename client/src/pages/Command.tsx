import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Phone, Mail, User, Building2, CheckCircle2, XCircle, ArrowRight, ClipboardCheck, FileText, ArrowUpRight, Briefcase, DollarSign, Command as CommandIcon, Loader2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "wouter";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string; // The raw text to stream
  ui?: React.ReactNode; // The interactive elements
  timestamp: Date;
  animate?: boolean; // Whether to animate this message
}

interface LiveAgentState {
  id: string;
  active: boolean;
  type: "call" | "email" | "human" | "workflow";
  title: string;
  status: string;
  timer: number;
  isComplete: boolean;
}

const MENTION_SUGGESTIONS = [
  { id: "jane", label: "Jane Parsons", type: "client" },
  { id: "mark", label: "Mark Hill", type: "client" },
  { id: "sarah", label: "Sarah Evans", type: "adviser" },
  { id: "all", label: "All clients", type: "group" },
  { id: "pension", label: "Pension transfers", type: "context" },
  { id: "meetings", label: "Meetings", type: "context" },
];

// SIPPAgentTile Component
function SIPPAgentTile() {
  const [steps, setSteps] = useState<{text: string, completed: boolean}[]>([]);
  const [status, setStatus] = useState<"Running" | "Completed">("Running");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (status === "Running") {
        setTimer(t => t + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    // Step sequencing
    const sequence = [
      { time: 500, text: "Loaded Jane’s FactFind and KYC from CRM." },
      { time: 2500, text: "Filled in personal and employment details." },
      { time: 3500, text: "Added contribution instructions from latest review." },
      { time: 5500, text: "Submitted SIPP application via Platform 1 API (demo)." },
      { time: 8500, text: "Platform 1 confirmed SIPP creation. Account ID: P1-SIPP-74382." },
      { time: 10500, text: "Added new SIPP to Jane’s product list in CRM." },
      { time: 12500, text: "Created workflow: SIPP initial funding & suitability report." }
    ];

    sequence.forEach(({ time, text }) => {
      setTimeout(() => {
        setSteps(prev => [...prev, { text, completed: true }]);
      }, time);
    });

    // Completion
    setTimeout(() => {
      setStatus("Completed");
    }, 13000);

  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn(
      "w-full max-w-md mt-2 overflow-hidden border transition-all duration-500",
      status === "Completed" ? "bg-green-500/5 border-green-500/20" : "bg-card border-primary/20"
    )}>
      {/* Header */}
      <div className={cn(
        "p-3 border-b flex justify-between items-center",
        status === "Completed" ? "bg-green-500/10 border-green-500/10" : "bg-primary/5 border-primary/10"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center shadow-sm",
            status === "Completed" ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
          )}>
             {status === "Completed" ? <CheckCircle2 className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-none">Open SIPP – Platform One</h3>
            <p className="text-xs text-muted-foreground mt-1">Client: Jane Parsons</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <Badge variant="outline" className={cn(
             "mb-1 font-mono text-[10px] h-5",
             status === "Completed" ? "border-green-500/30 text-green-600" : "border-primary/30 text-primary"
           )}>
             {status === "Completed" ? "Completed" : "Running"}
           </Badge>
           <span className="font-mono text-xs text-muted-foreground">{formatTime(timer)}</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="p-4 space-y-3">
         {steps.map((step, i) => (
           <div key={i} className="flex gap-3 animate-in slide-in-from-left-2 fade-in duration-300">
              <div className="mt-0.5 relative">
                 <div className="w-2 h-2 rounded-full bg-primary/40" />
                 {i !== steps.length - 1 && <div className="absolute top-2 left-1 w-px h-full bg-border" />}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.text}</p>
           </div>
         ))}
         {status === "Running" && (
           <div className="flex gap-3 animate-pulse">
              <div className="mt-0.5 w-2 h-2 rounded-full bg-muted" />
              <div className="h-3 w-3/4 bg-muted/50 rounded" />
           </div>
         )}
         
         {status === "Completed" && (
           <div className="pt-2 mt-2 border-t border-green-500/10 flex items-center gap-2 text-xs font-medium text-green-600 animate-in fade-in duration-500">
              <CheckCircle2 className="w-3.5 h-3.5" />
              SIPP opened successfully for Jane Parsons.
           </div>
         )}
      </div>
    </Card>
  );
}

// Typewriter Component for Streaming Text
function MessageItem({ message }: { message: Message }) {
  const [displayedText, setDisplayedText] = useState(message.animate ? "" : message.text);
  const [showUi, setShowUi] = useState(!message.animate);
  
  useEffect(() => {
    if (message.animate && displayedText.length < message.text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(message.text.slice(0, displayedText.length + 2)); // Stream 2 chars at a time for speed
      }, 15); // Fast typing speed
      return () => clearTimeout(timeout);
    } else if (message.animate && !showUi) {
      setShowUi(true);
    }
  }, [message.animate, displayedText, message.text, showUi]);

  return (
    <div className={cn(
      "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
      message.role === "user" ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 mt-1 border border-border shadow-sm">
        {message.role === "assistant" ? (
           <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">T1</AvatarFallback>
        ) : (
          <AvatarFallback className="bg-muted text-muted-foreground text-xs">ME</AvatarFallback>
        )}
      </Avatar>
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        message.role === "user" ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed",
          message.role === "user" 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-card border border-border text-card-foreground rounded-tl-sm"
        )}>
          <div className="space-y-3">
            {message.text && (
              <p className="whitespace-pre-wrap">
                {displayedText}
                {message.animate && displayedText.length < message.text.length && (
                  <span className="inline-block w-1.5 h-3.5 bg-primary/50 ml-0.5 animate-pulse align-middle" />
                )}
              </p>
            )}
            
            {/* Typing Indicator for Streaming State */}
            {message.animate && displayedText.length < message.text.length && (
               <div className="text-[10px] text-muted-foreground animate-pulse font-medium pt-1">
                 Terminal 1 is thinking...
               </div>
            )}

            {/* UI Elements (Buttons, Cards) appear after typing */}
            <div className={cn(
              "transition-all duration-500 ease-out",
              showUi ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden"
            )}>
              {message.ui}
            </div>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground mt-1 px-1 opacity-50">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

export default function CommandPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState(0);
  const [liveAgents, setLiveAgents] = useState<LiveAgentState[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mentions State
  const inputRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionQuery, setSuggestionQuery] = useState("");
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [cursorCoords, setCursorCoords] = useState({ top: 0, left: 0 });

  // Live Agent Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAgents(agents => agents.map(agent => 
        agent.active && !agent.isComplete ? { ...agent, timer: agent.timer + 1 } : agent
      ));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update initial state to use safe handlers
  useEffect(() => {
    setMessages(prev => {
        if (prev.length > 0) return prev; // Already hydrated
        return [
            {
                id: "1",
                role: "user" as const,
                text: "Chase provider for ceding scheme information.",
                timestamp: new Date(),
                animate: false,
            },
            {
                id: "2",
                role: "assistant" as const,
                text: "Sure. Which client is this for?",
                ui: (
                    <div className="flex flex-wrap gap-2">
                        {["Jane Parsons", "Mark Hill", "Sarah Evans"].map((name) => (
                            <Button
                                key={name}
                                variant="outline"
                                size="sm"
                                className="rounded-full bg-background hover:bg-accent hover:text-accent-foreground border-dashed border-muted-foreground/40"
                                onClick={() => handleClientSelect(name)}
                            >
                                <User className="w-3 h-3 mr-2" />
                                {name}
                            </Button>
                        ))}
                    </div>
                ),
                timestamp: new Date(),
                animate: false,
            },
        ];
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SIPP Demo Workflow
  const handleSIPPWorkflow = (originalText: string) => {
    // 1. Add User Message
    setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "user",
        text: originalText,
        timestamp: new Date(),
        animate: true
    }]);

    // Dispatch event for Agents page logic (and save to localStorage for persistence)
    localStorage.setItem("sipp-demo-start", Date.now().toString());
    window.dispatchEvent(new Event("storage")); // Force update if needed, or just let it be

    // 2. T1 Response 1
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: "assistant",
            text: "Got it. I’ll open a Platform 1 SIPP for Jane Parsons using her latest FactFind details.",
            timestamp: new Date(),
            animate: true
        }]);
    }, 600);

    // 3. T1 Response 2 + Agent Tile
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: "assistant",
            text: "I’ll keep you updated here as I work through the steps.",
            ui: <SIPPAgentTile />, 
            timestamp: new Date(),
            animate: true
        }]);
    }, 1200);
  };

  const handleClientSelect = (client: string) => {
    if (step > 0) return;
    
    const newMessages: Message[] = [
      ...messages,
      {
        id: Date.now().toString(),
        role: "user",
        text: client,
        timestamp: new Date(),
        animate: true,
      },
    ];
    setMessages(newMessages);
    setStep(1);

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          text: `Got it. ${client} has multiple pension providers. Which one should I chase?`,
          ui: (
            <div className="flex flex-wrap gap-2">
              {["Aviva", "Scottish Widows", "Royal London"].map((provider) => (
                <Button
                  key={provider}
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-background hover:bg-accent hover:text-accent-foreground border-dashed border-muted-foreground/40"
                  onClick={() => handleProviderSelect(provider)}
                >
                  <Building2 className="w-3 h-3 mr-2" />
                  {provider}
                </Button>
              ))}
            </div>
          ),
          timestamp: new Date(),
          animate: true,
        },
      ]);
    }, 600);
  };

  const handleProviderSelect = (provider: string) => {
    if (step > 1) return;

    const newMessages: Message[] = [
      ...messages,
      {
        id: Date.now().toString(),
        role: "user",
        text: provider,
        timestamp: new Date(),
        animate: true,
      },
    ];
    setMessages(newMessages);
    setStep(2);

    // Start Sequence
    setTimeout(() => {
      // 1. Initial Response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          text: `I’ll call ${provider} now and send a follow-up email.`,
          ui: (
              <div className="space-y-2">
                <Card className="bg-card/50 border-primary/20 overflow-hidden mt-2">
                    <div className="bg-primary/10 p-3 border-b border-primary/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="font-medium text-sm text-primary">Live call – {provider} Pensions</span>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">Connected • 03:12</span>
                    </div>
                    <div className="p-4 space-y-3 font-mono text-sm">
                        <div className="flex gap-3">
                            <span className="text-muted-foreground w-24 shrink-0">Aviva Agent:</span>
                            <span className="text-foreground">Hello, Aviva pensions, how can I help?</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-primary w-24 shrink-0">Terminal 1:</span>
                            <span className="text-foreground">Good afternoon. I’m calling on behalf of adviser Sarah Evans regarding client Jane Parsons. We’re looking for ceding scheme information for policy ABC123.</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-muted-foreground w-24 shrink-0">Aviva Agent:</span>
                            <span className="text-foreground">Certainly. I’ll just run a quick security check. Can you confirm the client’s date of birth and postcode?</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-primary w-24 shrink-0">Terminal 1:</span>
                            <span className="text-foreground">Date of birth is 14 March 1979 and postcode is SW1A 1AA.</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-muted-foreground w-24 shrink-0">Aviva Agent:</span>
                            <span className="text-foreground">Thank you. One moment while I bring up the policy details...</span>
                        </div>
                        <div className="flex gap-3 pl-28 italic text-muted-foreground text-xs">
                            (Short pause while Aviva checks details...)
                        </div>
                        <div className="flex gap-3">
                            <span className="text-muted-foreground w-24 shrink-0">Aviva Agent:</span>
                            <span className="text-foreground">Thanks for holding. I’ve found the policy. The ceding scheme reference is ABC123 and the receiving scheme is PAR-987.</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-primary w-24 shrink-0">Terminal 1:</span>
                            <span className="text-foreground">Great, thank you. I’ll note that down for the adviser. Have a good day.</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-muted-foreground w-24 shrink-0">Aviva Agent:</span>
                            <span className="text-foreground">You’re welcome. Goodbye.</span>
                        </div>
                    </div>
                </Card>
              </div>
          ),
          timestamp: new Date(),
          animate: true,
        },
      ]);

      // 2. Start Live Agents
      setLiveAgents([
        {
          id: "call-1",
          active: true,
          type: "call",
          title: `Calling ${provider}`,
          status: "Dialling...",
          timer: 3,
          isComplete: false
        },
        {
          id: "email-1",
          active: true,
          type: "email",
          title: `Email to ${provider}`,
          status: "Composing email...",
          timer: 0,
          isComplete: false
        }
      ]);

      // 3. Sequence Updates
      
      // Call Progress
      setTimeout(() => {
        updateAgent("call-1", { status: "Ringing...", timer: 8 });
      }, 2000);

      setTimeout(() => {
        updateAgent("call-1", { status: "Connected... verifying client details...", timer: 23 });
      }, 4500);
      
      setTimeout(() => {
         updateAgent("call-1", { status: "On hold - Aviva checking policy...", timer: 92 });
      }, 7500);

      setTimeout(() => {
        updateAgent("call-1", { 
            title: `Call completed - ${provider}`,
            status: `Provider confirmed: ceding scheme ABC123.`,
            timer: 192, 
            isComplete: true
        });

        // Show "Energy Hit" Toast
        toast("Done. CRM updated. +2 steps ahead.", {
          className: "bg-card border-primary/50 text-foreground font-medium",
          duration: 2000,
        });

        // 4. Final Follow-up Message
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: "assistant",
                    text: "I’ve recorded the ceding scheme information (ABC123) and updated Jane Parsons’ pension record in the CRM. I’ve also logged the call and a confirmation email to Aviva.",
                    timestamp: new Date(),
                    animate: true,
                },
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    text: "I also found 2 similar cases with old workplace pensions. Want me to chase those providers too?",
                    ui: (
                        <div className="flex gap-2 pt-1">
                            <Button 
                                size="sm" 
                                className="bg-primary hover:bg-primary/90 text-primary-foreground h-8"
                                onClick={() => {
                                    setMessages(m => [...m, {
                                        id: Date.now().toString(),
                                        role: "assistant",
                                        text: "Got it, I’ll chase them now.",
                                        timestamp: new Date(),
                                        animate: true,
                                    }]);
                                }}
                            >
                                Yes, chase them
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8" onClick={handleSummariseMeeting}>
                                Demo: Summarise Meeting
                            </Button>
                        </div>
                    ),
                    timestamp: new Date(),
                    animate: true,
                },
            ]);
        }, 1000);

      }, 11000);

      // Email Progress
      setTimeout(() => {
        updateAgent("email-1", { status: "Sent to provider", timer: 2 });
      }, 1500);

      setTimeout(() => {
        updateAgent("email-1", { 
            title: `Email sent - ${provider}`,
            status: "Delivered to Aviva", 
            timer: 8,
            isComplete: true
        });
      }, 3500);

    }, 800);
  };

  const updateAgent = (id: string, updates: Partial<LiveAgentState>) => {
    setLiveAgents(prev => prev.map(agent => 
        agent.id === id ? { ...agent, ...updates } : agent
    ));
  };

  const handleSummariseMeeting = () => {
    const newMessages: Message[] = [
        ...messages,
        {
            id: Date.now().toString(),
            role: "user",
            text: "Summarise my last meeting with Jane Parsons and show me any opportunities.",
            timestamp: new Date(),
            animate: true,
        }
    ];
    setMessages(newMessages);

    // Streaming response
    setTimeout(() => {
        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                role: "assistant",
                text: "In your last meeting with Jane Parsons, you reviewed her existing pensions, discussed an upcoming mortgage renewal, and explored her concerns about income protection in case of job loss. Jane is open to consolidating her old workplace pensions and reviewing her mortgage closer to renewal. She is also interested in understanding protection options, but hasn’t committed yet.",
                ui: (
                    <div className="space-y-4 mt-2">
                        <Card className="bg-card/50 border-border overflow-hidden">
                            <div className="bg-muted/30 p-3 border-b border-border flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-sm">Opportunities from this meeting</span>
                                </div>
                                <Badge variant="outline" className="text-[10px]">3 Found</Badge>
                            </div>
                            <div className="divide-y divide-border/50">
                                {/* Opportunity 1 */}
                                <div className="p-4 hover:bg-muted/10 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px] h-5 bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">Pension</Badge>
                                            <h4 className="font-medium text-sm">Pension Transfer</h4>
                                        </div>
                                        <span className="text-sm font-mono">£120,000</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">Consolidate two legacy workplace pensions into current SIPP.</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                            <Avatar className="w-4 h-4">
                                                <AvatarFallback className="text-[8px] bg-primary/20 text-primary">SE</AvatarFallback>
                                            </Avatar>
                                            <span>Sarah Evans</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-green-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            Live
                                        </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <ArrowRight className="w-3 h-3 text-primary" />
                                        Added to Opportunities and started “Pension Transfer” workflow.
                                    </div>
                                </div>

                                {/* Opportunity 2 */}
                                <div className="p-4 hover:bg-muted/10 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px] h-5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Mortgage</Badge>
                                            <h4 className="font-medium text-sm">Mortgage Renewal</h4>
                                        </div>
                                        <span className="text-sm font-mono">£300,000</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">Fixed-rate mortgage ends in 12 months; review options.</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                            <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                                                <Briefcase className="w-2.5 h-2.5" />
                                            </div>
                                            <span>Mortgage Team</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-amber-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            On Hold
                                        </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                        Added to Opportunities (On Hold until 12 months before expiry).
                                    </div>
                                </div>

                                {/* Opportunity 3 */}
                                <div className="p-4 hover:bg-muted/10 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px] h-5 bg-pink-500/10 text-pink-500 hover:bg-pink-500/20">Protection</Badge>
                                            <h4 className="font-medium text-sm">Protection Gap</h4>
                                        </div>
                                        <span className="text-sm font-mono">£80/mo</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">Discuss income protection in case of job loss.</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                            <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                                                <Briefcase className="w-2.5 h-2.5" />
                                            </div>
                                            <span>Protection Specialist</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-green-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            Live
                                        </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <ArrowRight className="w-3 h-3 text-primary" />
                                        Added to Opportunities and assigned to Protection Team.
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex justify-center">
                            <Link href="/meeting-detail">
                                <Button variant="outline" className="text-primary hover:text-primary border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View full meeting detail
                                </Button>
                            </Link>
                        </div>
                    </div>
                ),
                timestamp: new Date(),
                animate: true,
            }
        ]);

        // Spawn Workflow Live Agent
        setTimeout(() => {
            setLiveAgents(prev => [
                ...prev,
                {
                    id: "workflow-1",
                    active: true,
                    type: "workflow",
                    title: "Pension Transfer Workflow – Jane Parsons",
                    status: "Step 1/6 – Preparing transfer pack",
                    timer: 0,
                    isComplete: false
                }
            ]);
        }, 2000);

    }, 1000);
  };

  // Input Handling
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText;
    setInputValue(text);

    // Check for mentions
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const cursorPosition = range.startOffset;
        const textBeforeCursor = range.startContainer.textContent?.slice(0, cursorPosition) || "";
        
        const match = textBeforeCursor.match(/@(\w*)$/);
        if (match) {
            const query = match[1];
            setShowSuggestions(true);
            setSuggestionQuery(query);
            
            // Get cursor coordinates for dropdown
            const rect = range.getBoundingClientRect();
            setCursorCoords({ top: rect.bottom, left: rect.left });
        } else {
            setShowSuggestions(false);
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (showSuggestions) {
          if (e.key === "ArrowDown") {
              e.preventDefault();
              setSuggestionIndex(i => (i + 1) % filteredSuggestions.length);
          } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSuggestionIndex(i => (i - 1 + filteredSuggestions.length) % filteredSuggestions.length);
          } else if (e.key === "Enter") {
              e.preventDefault();
              if (filteredSuggestions.length > 0) {
                  insertMention(filteredSuggestions[suggestionIndex]);
              }
          } else if (e.key === "Escape") {
              setShowSuggestions(false);
          }
      } else if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (inputValue.trim()) {
             const text = inputValue.trim();
             
             // Check for SIPP trigger phrases
             if (text.toLowerCase().includes("open a sipp with platform one for jane parsons") || 
                 text.toLowerCase().includes("open an account with platform one for jane parsons sipp")) {
                 handleSIPPWorkflow(text);
             } else {
                 toast("Command sent", { className: "bg-card" });
                 // Reset input
                 setInputValue("");
                 if (inputRef.current) inputRef.current.innerText = "";
             }

             // Clear input for SIPP flow too (handled inside handleSIPPWorkflow if needed, or here)
             // We should clear it here for both cases
             setInputValue("");
             if (inputRef.current) inputRef.current.innerText = "";
          }
      }
  };

  const insertMention = (suggestion: typeof MENTION_SUGGESTIONS[0]) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const textNode = range.startContainer;
      const text = textNode.textContent || "";
      const match = text.slice(0, range.startOffset).match(/@(\w*)$/);

      if (match) {
          const start = range.startOffset - match[0].length;
          const end = range.startOffset;
          
          // Delete the @query
          range.setStart(textNode, start);
          range.setEnd(textNode, end);
          range.deleteContents();

          // Create the chip
          const chip = document.createElement("span");
          chip.contentEditable = "false";
          chip.className = "inline-flex items-center bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 text-sm mx-1 select-none";
          chip.innerText = `@${suggestion.label}`;
          
          // Create a spacer after
          const spacer = document.createTextNode("\u00A0");

          range.insertNode(spacer);
          range.insertNode(chip);

          // Move cursor after spacer
          range.setStartAfter(spacer);
          range.setEndAfter(spacer);
          selection.removeAllRanges();
          selection.addRange(range);
          
          setShowSuggestions(false);
          setInputValue(inputRef.current?.innerText || "");
      }
  };

  const filteredSuggestions = MENTION_SUGGESTIONS.filter(s => 
    s.label.toLowerCase().includes(suggestionQuery.toLowerCase())
  );

  // Helper to get visible messages (Rolling Window)
  const visibleMessages = messages.slice(-10); // Show only last 10 messages
  const hiddenCount = Math.max(0, messages.length - 10);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 relative bg-background/50 backdrop-blur-sm z-10 shrink-0">
        <div className="w-20" /> {/* Spacer for centering */}
        <h1 className="font-semibold text-sm tracking-wide flex items-center gap-2">
          Command
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal text-muted-foreground">Beta</Badge>
        </h1>
        <Link href="/activity-log">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1">
                <Clock className="w-3.5 h-3.5" />
                Activity Log
            </Button>
        </Link>
      </header>

      {/* Live Agent Strip */}
      {liveAgents.length > 0 && (
         <div className="bg-muted/20 border-b border-border/50 p-2 animate-in slide-in-from-top-4 duration-300">
           <div className="max-w-4xl mx-auto flex gap-3 overflow-x-auto pb-1">
             {liveAgents.map(agent => (
                 <div key={agent.id} className={cn(
                   "rounded-lg border p-3 flex items-center gap-4 transition-all duration-500 min-w-[280px] flex-1",
                   agent.isComplete 
                    ? "bg-green-500/10 border-green-500/20" 
                    : agent.type === "human"
                    ? "bg-amber-500/10 border-amber-500/20"
                    : "bg-card border-primary/20 shadow-[0_0_15px_-3px_hsl(var(--primary)/0.1)]"
                 )}>
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      agent.isComplete ? "bg-green-500 text-white" : 
                      agent.type === "human" ? "bg-amber-500 text-white" :
                      "bg-primary/10 text-primary"
                    )}>
                      {agent.isComplete ? <CheckCircle2 className="w-4 h-4" /> : 
                       agent.type === "email" ? <Mail className="w-4 h-4" /> :
                       agent.type === "human" ? <ClipboardCheck className="w-4 h-4" /> :
                       agent.type === "workflow" ? <ArrowUpRight className="w-4 h-4" /> :
                       <Phone className="w-4 h-4" />
                      }
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate pr-2">{agent.title}</h3>
                        {agent.type !== "human" && (
                            <span className="font-mono text-xs text-muted-foreground tabular-nums">
                            {formatTime(agent.timer)}
                            </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {!agent.isComplete && agent.type !== "human" && (
                          <span className="flex gap-0.5">
                            <span className="w-1 h-1 bg-primary rounded-full animate-[bounce_1s_infinite_0ms]" />
                            <span className="w-1 h-1 bg-primary rounded-full animate-[bounce_1s_infinite_200ms]" />
                            <span className="w-1 h-1 bg-primary rounded-full animate-[bounce_1s_infinite_400ms]" />
                          </span>
                        )}
                        <p className="text-xs text-muted-foreground truncate">{agent.status}</p>
                      </div>
                    </div>
                 </div>
             ))}
           </div>
         </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full px-4 md:px-0">
          <div className="max-w-2xl mx-auto py-8 space-y-8 pb-32">
            
            {/* Hidden History Indicator */}
            {hiddenCount > 0 && (
                <div className="flex justify-center animate-in fade-in duration-500">
                    <Link href="/activity-log">
                        <Button variant="ghost" size="sm" className="text-xs text-primary/70 hover:text-primary hover:bg-primary/5 gap-1 group">
                            <span className="text-muted-foreground group-hover:text-primary/70">{hiddenCount} earlier interactions hidden ·</span> 
                            View full activity log 
                            <ArrowRight className="w-3 h-3 ml-0.5 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                    </Link>
                </div>
            )}

            {visibleMessages.map((msg) => (
              <MessageItem key={msg.id} message={msg} />
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mask-fade-right">
            {["Find opportunities", "Summarise meeting", "Create workflow", "Chase provider"].map((chip) => (
              <Button
                key={chip}
                variant="secondary"
                size="sm"
                className="rounded-full bg-secondary/50 hover:bg-secondary text-xs font-normal whitespace-nowrap"
                onClick={() => {
                    if (chip === "Summarise meeting") {
                        handleSummariseMeeting();
                    }
                }}
              >
                <Sparkles className="w-3 h-3 mr-2 text-primary/70" />
                {chip}
              </Button>
            ))}
          </div>
          
          <div className="relative">
            <div 
                ref={inputRef}
                contentEditable
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                className="h-14 pl-4 pr-12 py-3.5 rounded-xl bg-card border border-border shadow-sm text-base focus-visible:ring-1 focus-visible:ring-primary/50 outline-none overflow-y-auto"
                data-placeholder="Ask a question or give a command..."
                style={{ minHeight: "3.5rem" }}
            />
            {!inputValue && (
                <div className="absolute left-4 top-3.5 text-muted-foreground pointer-events-none select-none">
                    Ask a question or give a command...
                </div>
            )}
            
            <Button 
              size="icon" 
              className="absolute right-2 top-2 h-10 w-10 rounded-lg"
              variant={inputValue.trim() ? "default" : "ghost"}
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
                <div 
                    className="absolute bottom-full left-0 mb-2 w-64 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100"
                    style={{ 
                        left: "0px" 
                    }}
                >
                    <div className="p-1">
                        {filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map((suggestion, i) => (
                                <button
                                    key={suggestion.id}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-sm rounded-md flex items-center justify-between",
                                        i === suggestionIndex ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"
                                    )}
                                    onClick={() => insertMention(suggestion)}
                                >
                                    <span>{suggestion.label}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{suggestion.type}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-muted-foreground">No matches found</div>
                        )}
                    </div>
                </div>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground/50">
              Terminal 1 can make mistakes. Verify critical information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
