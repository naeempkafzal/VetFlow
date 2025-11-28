import { useState } from "react";
import Dashboard from "./pages/dashboard";
import Vaccinations from "./pages/vaccinations";
import Inventory from "./pages/inventory";
import Appointments from "./pages/appointments";
import Outbreaks from "./pages/outbreaks";
import Analytics from "./pages/analytics";
import NotFound from "./pages/not-found";

const pages = [
  { name: "Dashboard", path: "/", nameUr: "ڈیش بورڈ" },
  { name: "Records", path: "/records", nameUr: "ریکارڈز" },
  { name: "Vaccinations", path: "/vaccinations", nameUr: "ویکسین" },
  { name: "Inventory", path: "/inventory", nameUr: "اسٹاک" },
  { name: "Appointments", path: "/appointments", nameUr: "اپائنٹمنٹس" },
  { name: "Outbreaks", path: "/outbreaks", nameUr: "پھیلاؤ" },
  { name: "Analytics", path: "/analytics", nameUr: "تجزیہ" },
];

const App = () => {
  const [currentPage, setCurrentPage] = useState("/");
  const [language, setLanguage] = useState<"en" | "ur">("en");

  const isRTL = language === "ur";
  const navItems = pages.map(p => ({ name: language === "en" ? p.name : p.nameUr, path: p.path }));

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f9fafb", direction: isRTL ? "rtl" : "ltr" }}>
      <nav style={{ backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => setCurrentPage("/")}>
            <div style={{ backgroundColor: "#2563eb", padding: "8px", borderRadius: "8px", fontSize: "20px" }}>🏥</div>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#111", margin: 0 }}>VetFlow</h1>
              <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>{language === "en" ? "Veterinary Automation" : "ویٹرنری خودکاری"}</p>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => setCurrentPage(item.path)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: currentPage === item.path ? "#2563eb" : "transparent",
                  color: currentPage === item.path ? "#fff" : "#374151",
                }}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => setLanguage(language === "en" ? "ur" : "en")}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                border: "1px solid #e5e7eb",
                backgroundColor: "#f3f4f6",
                cursor: "pointer",
                color: "#374151",
              }}
            >
              {language === "en" ? "اردو" : "EN"}
            </button>
            <div style={{ width: "32px", height: "32px", backgroundColor: "#2563eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}>Dr</span>
            </div>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, overflowY: "auto" }}>
        {currentPage === "/" && <Dashboard language={language} />}
        {currentPage === "/vaccinations" && <Vaccinations language={language} />}
        {currentPage === "/inventory" && <Inventory language={language} />}
        {currentPage === "/appointments" && <Appointments language={language} />}
        {currentPage === "/outbreaks" && <Outbreaks language={language} />}
        {currentPage === "/analytics" && <Analytics language={language} />}
        {currentPage !== "/" && currentPage !== "/vaccinations" && currentPage !== "/inventory" && currentPage !== "/appointments" && currentPage !== "/outbreaks" && currentPage !== "/analytics" && <NotFound language={language} />}
      </main>
    </div>
  );
};

export default App;
