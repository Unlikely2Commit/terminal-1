import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Terminal, 
  ArrowRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [_, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
             backgroundSize: "40px 40px"
           }} 
      />
      
      {/* Subtle vignettes */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-transparent to-background opacity-90 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-background via-transparent to-background opacity-90 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="mb-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="p-2 bg-primary/10 rounded border border-primary/20">
              <Terminal className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-foreground">
            TERMINAL 1
          </h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
            Advisor Command Centre
          </p>
        </div>

        <Card className="border-border/60 bg-card/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1 pb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-4">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              SYSTEM OPERATIONAL
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider" htmlFor="email">
                  Identifier
                </label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="advisor@terminal1.ai" 
                    className="bg-background/50 border-border/60 font-mono text-sm pl-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider" htmlFor="password">
                    Access Key
                  </label>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••••••" 
                    className="bg-background/50 border-border/60 font-mono text-sm pl-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-10 font-medium transition-all" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    AUTHENTICATE <ArrowRight className="ml-2 h-4 w-4 opacity-70" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-border/40" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">Or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full border-border/60 bg-background/30 hover:bg-background/50 h-10" type="button">
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Continue with Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-border/40 pt-4 pb-4">
             <div className="flex items-center gap-2 justify-center w-full text-[10px] text-muted-foreground font-mono">
                <ShieldCheck className="w-3 h-3 text-green-500/70" />
                <span>SECURE SESSION ENCRYPTED (AES-256)</span>
             </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-[10px] text-muted-foreground/40 font-mono">
          <p>TERMINAL 1 VER 2.4.0-RC1 // UNAUTHORIZED ACCESS PROHIBITED</p>
        </div>
      </motion.div>
    </div>
  );
}
