import { useLocation } from "wouter";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import Navigation from "@/components/navigation";

function AppRouter() {
  const [location] = useLocation();
  if (location === "/") return <Dashboard />;
  return <NotFound />;
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AppRouter />
    </div>
  );
}

export default App;
