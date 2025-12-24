import { useState, useEffect } from "react";
import { 
  Calendar, 
  Check, 
  CheckCircle2, 
  AlertCircle,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface UserSettings {
  calendarConnected: boolean;
  recordingRule: string;
  exclusions: string;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch settings from backend
  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ['/api/settings'],
  });

  const [isConnected, setIsConnected] = useState(false);
  const [recordingRule, setRecordingRule] = useState("selective");
  const [exclusions, setExclusions] = useState("");

  // Sync local state with fetched settings
  useEffect(() => {
    if (settings) {
      setIsConnected(settings.calendarConnected);
      setRecordingRule(settings.recordingRule);
      setExclusions(settings.exclusions);
    }
  }, [settings]);

  // Update settings mutation
  const updateSettings = useMutation({
    mutationFn: async (data: Partial<UserSettings>) => {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      });
    },
  });

  const handleConnect = () => {
    setIsConnected(true);
    updateSettings.mutate({ 
      calendarConnected: true,
      recordingRule,
      exclusions 
    });
  };

  const handleRuleChange = (value: string) => {
    setRecordingRule(value);
    updateSettings.mutate({ 
      calendarConnected: isConnected,
      recordingRule: value,
      exclusions 
    });
  };

  const handleExclusionsChange = (value: string) => {
    setExclusions(value);
  };

  const handleExclusionsBlur = () => {
    updateSettings.mutate({ 
      calendarConnected: isConnected,
      recordingRule,
      exclusions 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 pb-20 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendar & Meeting Recording</h1>
        <p className="text-muted-foreground">Control how Terminal 1 joins and records your client meetings.</p>
      </div>

      <div className="grid gap-6">
        
        {/* Section 1: Calendar Connection */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              Calendar access
            </CardTitle>
            <CardDescription>
              Terminal 1 connects to your calendar to detect and record eligible client meetings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-[#0078D4] rounded flex items-center justify-center text-white">
                   <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M23 4H18V2H16V4H8V2H6V4H1C0.45 4 0 4.45 0 5V23C0 23.55 0.45 24 1 24H23C23.55 24 24 23.55 24 23V5C24 4.45 23.55 4 23 4ZM22 22H2V9H22V22ZM22 7H2V6H22V7Z"/></svg>
                </div>
                <div>
                  <h3 className="font-medium">Microsoft Outlook / Teams</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      isConnected ? "bg-green-500" : "bg-muted-foreground"
                    )} />
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      {isConnected ? "Connected" : "Not connected"}
                    </span>
                  </div>
                </div>
              </div>
              
              {!isConnected ? (
                <Button onClick={handleConnect} className="gap-2 bg-[#0078D4] hover:bg-[#0078D4]/90 text-white">
                  Connect Outlook
                </Button>
              ) : (
                <Button variant="outline" className="gap-2 text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400">
                  <Check className="w-4 h-4" /> Connected
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 ml-1">Only meetings organised by you are considered.</p>
          </CardContent>
        </Card>

        {/* Section 2: Meeting Detection Rules */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="w-5 h-5 text-primary" />
              Meeting detection rules
            </CardTitle>
            <CardDescription>
              Choose which meetings Terminal 1 should automatically join and record.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-w-md">
            <Select value={recordingRule} onValueChange={handleRuleChange} disabled={!isConnected}>
              <SelectTrigger>
                <SelectValue placeholder="Select a rule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disabled">
                   <span className="font-medium">Disabled</span> - Do not join or record
                </SelectItem>
                <SelectItem value="selective">
                   <span className="font-medium">Selective</span> - Only meetings with clients
                </SelectItem>
                <SelectItem value="always">
                   <span className="font-medium">Always</span> - All meetings you organise
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Section 5: Exclusions */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-primary" />
              Exclusions
            </CardTitle>
            <CardDescription>
              Meetings or domains you do not want Terminal 1 to record.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input 
              placeholder="e.g. internal.company.com, personal@gmail.com" 
              className="max-w-md"
              value={exclusions}
              onChange={(e) => handleExclusionsChange(e.target.value)}
              onBlur={handleExclusionsBlur}
              disabled={!isConnected}
            />
            <p className="text-xs text-muted-foreground mt-2">Meetings involving these domains will be ignored.</p>
          </CardContent>
        </Card>

      </div>

      {/* Section 6: Status & Confirmation */}
      {isConnected && (
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 border border-green-500/20 bg-green-500/5 rounded-lg text-sm"
         >
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
               <CheckCircle2 className="w-4 h-4" />
               <span className="font-medium">Calendar connected</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
               <CheckCircle2 className="w-4 h-4" />
               <span className="font-medium">Selective meeting detection active</span>
            </div>
         </motion.div>
      )}
    </div>
  );
}
