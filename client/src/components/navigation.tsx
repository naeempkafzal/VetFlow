import { useState } from "react";

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
    <nav style={{ backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => handleNavClick("/")}>
            <div style={{ backgroundColor: "#2563eb", padding: "8px", borderRadius: "8px" }}>
              <span style={{ color: "#fff", fontSize: "20px" }}>🏥</span>
            </div>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#111", margin: 0 }}>VetFlow</h1>
              <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>Veterinary Automation</p>
            </div>
          </div>

          <div style={{ display: "none" }} className="md:flex gap-1">
            {items.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
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
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                padding: "8px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
            <div style={{ width: "32px", height: "32px", backgroundColor: "#2563eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}>Dr</span>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div style={{ paddingBottom: "12px", borderTop: "1px solid #e5e7eb" }}>
            {items.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: "8px",
                  backgroundColor: currentPage === item.path ? "#2563eb" : "transparent",
                  color: currentPage === item.path ? "#fff" : "#374151",
                }}
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
