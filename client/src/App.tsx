import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import CommandPage from "@/pages/Command";
import WorkflowsPage from "@/pages/Workflows";
import MIPage from "@/pages/MI";
import OpportunitiesPage from "@/pages/Opportunities";
import MeetingDetailPage from "@/pages/MeetingDetail";
import CompliancePage from "@/pages/Compliance";
import AgentsPage from "@/pages/Agents";
import ClientsPage from "@/pages/Clients";
import ActivityLogPage from "@/pages/ActivityLog";
import AdvisorDashboard from "@/pages/AdvisorDashboard";
import LoginPage from "@/pages/Login";
import SettingsPage from "@/pages/Settings";

function Router() {
  const [location] = useLocation();

  if (location === "/login") {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={CommandPage} />
        <Route path="/dashboard" component={AdvisorDashboard} />
        <Route path="/activity-log" component={ActivityLogPage} />
        <Route path="/clients" component={ClientsPage} />
        <Route path="/agents" component={AgentsPage} />
        <Route path="/workflows" component={WorkflowsPage} />
        <Route path="/mi" component={MIPage} />
        <Route path="/opportunities" component={OpportunitiesPage} />
        <Route path="/meeting-detail" component={MeetingDetailPage} />
        <Route path="/compliance" component={CompliancePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
