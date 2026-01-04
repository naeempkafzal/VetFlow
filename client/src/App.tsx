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

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      backgroundColor: "#0f172a", 
      direction: isRTL ? "rtl" : "ltr",
      fontFamily: isRTL ? "'Noto Nastaliq Urdu', serif" : "inherit"
    }}>
      <nav style={{ backgroundColor: "#1e293b", borderBottom: "1px solid #334155" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => setCurrentPage("/")}>
            <div style={{ backgroundColor: "#2563eb", padding: "8px", borderRadius: "8px" }}>🏥</div>
            <div>
              <h1 style={{ fontSize: "18px", fontWeight: "bold", color: "#f1f5f9", margin: 0 }}>VetFlow</h1>
            </div>
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            {pages.map((p) => (
              <button
                key={p.path}
                onClick={() => setCurrentPage(p.path)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: currentPage === p.path ? "#2563eb" : "transparent",
                  color: currentPage === p.path ? "#fff" : "#cbd5e1",
                }}
              >
                {language === "en" ? p.name : p.nameUr}
              </button>
            ))}
          </div>

          <button
            onClick={() => setLanguage(language === "en" ? "ur" : "en")}
            style={{ padding: "6px 12px", borderRadius: "6px", backgroundColor: "#334155", color: "#fff", border: "1px solid #475569", cursor: "pointer" }}
          >
            {language === "en" ? "اردو" : "EN"}
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, backgroundColor: "#0f172a" }}>
        {currentPage === "/" && <Dashboard language={language} />}
        {currentPage === "/vaccinations" && <Vaccinations language={language} />}
        {currentPage === "/inventory" && <Inventory language={language} />}
        {currentPage === "/appointments" && <Appointments language={language} />}
        {currentPage === "/outbreaks" && <Outbreaks language={language} />}
        {currentPage === "/analytics" && <Analytics language={language} />}
        {/* Simple check for undefined paths */}
        {!pages.find(p => p.path === currentPage) && <NotFound language={language} />}
      </main>
    </div>
  );
};

export default App;