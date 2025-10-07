import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Replaced wouter with react-router-dom
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../components/ui/toaster"; // Adjusted import path
import { TooltipProvider } from "../components/ui/tooltip"; // Adjusted import path
import NotFound from "./pages/not-found"; // Adjusted import path
import Dashboard from "./pages/dashboard"; // Adjusted import path
import SymptomChecker from "./pages/symptom-checker"; // Adjusted import path
import Records from "./pages/records"; // Adjusted import path
import Vaccinations from "./pages/vaccinations"; // Adjusted import path
import Inventory from "./pages/inventory"; // Adjusted import path
import Appointments from "./pages/appointments"; // Adjusted import path
import Outbreaks from "./pages/outbreaks"; // Adjusted import path
import Analytics from "./pages/analytics"; // Adjusted import path
import Navigation from "../components/navigation"; // Adjusted import path

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/symptom-checker" element={<SymptomChecker />} />
      <Route path="/records" element={<Records />} />
      <Route path="/vaccinations" element={<Vaccinations />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/outbreaks" element={<Outbreaks />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <AppRouter />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
