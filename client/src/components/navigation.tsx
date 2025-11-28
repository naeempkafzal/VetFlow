import { useState } from "react";
import { Stethoscope, Menu, X } from "lucide-react";

interface NavigationProps {
  currentPage: string;
  setPage: (page: string) => void;
}

export default function Navigation({ currentPage, setPage }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = [
    { name: "Dashboard", path: "/" },
    { name: "Records", path: "/records" },
    { name: "Vaccinations", path: "/vaccinations" },
    { name: "Appointments", path: "/appointments" },
  ];

  const handleNavClick = (path: string) => {
    setPage(path);
    setMobileOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick("/")}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">VetFlow</h1>
              <p className="text-xs text-gray-500">Veterinary Automation</p>
            </div>
          </div>

          <div className="hidden md:flex gap-1">
            {items.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="flex md:hidden gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">Dr</span>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 space-y-2">
            {items.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
