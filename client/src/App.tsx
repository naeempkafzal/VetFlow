import { useState } from "react";
import Dashboard from "./pages/dashboard";
import Navigation from "./components/navigation";

export default function App() {
  const [currentPage, setCurrentPage] = useState("/");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} setPage={setCurrentPage} />
      <main>
        {currentPage === "/" && <Dashboard />}
        {currentPage !== "/" && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Page not found</h1>
          </div>
        )}
      </main>
    </div>
  );
}
