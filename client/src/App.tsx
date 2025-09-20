import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import SymptomChecker from "@/pages/symptom-checker";
import Records from "@/pages/records";
import Vaccinations from "@/pages/vaccinations";
import Inventory from "@/pages/inventory";
import Appointments from "@/pages/appointments";
import Outbreaks from "@/pages/outbreaks";
import Analytics from "@/pages/analytics";
import Navigation from "@/components/navigation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/symptom-checker" component={SymptomChecker} />
      <Route path="/records" component={Records} />
      <Route path="/vaccinations" component={Vaccinations} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/outbreaks" component={Outbreaks} />
      <Route path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
