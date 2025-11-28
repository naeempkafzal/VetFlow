import { useState } from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState("/");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f9fafb" }}>
      <nav style={{ backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => setCurrentPage("/")}>
            <div style={{ backgroundColor: "#2563eb", padding: "8px", borderRadius: "8px", fontSize: "20px" }}>🏥</div>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#111", margin: 0 }}>VetFlow</h1>
              <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>Veterinary Automation</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ width: "32px", height: "32px", backgroundColor: "#2563eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}>Dr</span>
            </div>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, overflowY: "auto", padding: "32px 16px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px", color: "#111" }}>Veterinary Dashboard</h1>
          <p style={{ color: "#666", marginBottom: "32px" }}>Welcome to VetFlow - Comprehensive veterinary workflow automation</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            <div style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>Total Animals</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111", margin: 0 }}>12</p>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>Appointments Today</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111", margin: 0 }}>3</p>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>Overdue Vaccinations</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111", margin: 0 }}>2</p>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>Low Stock Items</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111", margin: 0 }}>1</p>
            </div>
          </div>

          <div style={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#111", marginBottom: "16px" }}>System Status</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", color: "#666" }}>Backend API</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#186a3b", backgroundColor: "#c6f6d5", padding: "4px 8px", borderRadius: "4px" }}>✓ Online</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", color: "#666" }}>Database</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#186a3b", backgroundColor: "#c6f6d5", padding: "4px 8px", borderRadius: "4px" }}>✓ Connected</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", color: "#666" }}>PVMC Compliance</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#1e40af", backgroundColor: "#dbeafe", padding: "4px 8px", borderRadius: "4px" }}>✓ Ready</span>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "#999", marginTop: "16px" }}>Last sync: 5 mins ago</p>
          </div>
        </div>
      </main>
    </div>
  );
}
