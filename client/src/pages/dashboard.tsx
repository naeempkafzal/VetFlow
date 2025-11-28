export default function Dashboard({ language }: { language: string }) {
  const t = (en: string, ur: string) => language === "en" ? en : ur;

  return (
    <div style={{ padding: "32px", maxWidth: "1280px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px", color: "#f1f5f9" }}>
        Veterinary Dashboard
      </h1>
      <p style={{ color: "#cbd5e1", marginBottom: "32px" }}>Welcome to VetFlow - Comprehensive veterinary workflow automation</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", border: "1px solid #334155", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.3)" }}>
          <p style={{ fontSize: "14px", color: "#cbd5e1" }}>Total Animals</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#f1f5f9" }}>12</p>
        </div>
        <div style={{ padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", border: "1px solid #334155", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.3)" }}>
          <p style={{ fontSize: "14px", color: "#cbd5e1" }}>Appointments Today</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#f1f5f9" }}>3</p>
        </div>
        <div style={{ padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", border: "1px solid #334155", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.3)" }}>
          <p style={{ fontSize: "14px", color: "#cbd5e1" }}>Overdue Vaccinations</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#f1f5f9" }}>2</p>
        </div>
        <div style={{ padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", border: "1px solid #334155", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.3)" }}>
          <p style={{ fontSize: "14px", color: "#cbd5e1" }}>Low Stock Items</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#f1f5f9" }}>1</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        <div style={{ gridColumn: "span 2", backgroundColor: "#1e293b", borderRadius: "8px", border: "1px solid #334155", padding: "24px", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.3)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#f1f5f9", marginBottom: "16px" }}>Recent Activities</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "12px", borderLeft: "4px solid #2563eb", backgroundColor: "#0c4a6e" }}>
              <p style={{ fontWeight: "500", color: "#f1f5f9" }}>Animal Record Created</p>
              <p style={{ fontSize: "14px", color: "#cbd5e1" }}>Cow registered - Sahiwal breed</p>
            </div>
            <div style={{ padding: "12px", borderLeft: "4px solid #16a34a", backgroundColor: "#0d3a1c" }}>
              <p style={{ fontWeight: "500", color: "#f1f5f9" }}>Vaccination Completed</p>
              <p style={{ fontSize: "14px", color: "#cbd5e1" }}>FMD vaccine administered</p>
            </div>
            <div style={{ padding: "12px", borderLeft: "4px solid #ea580c", backgroundColor: "#42280f" }}>
              <p style={{ fontWeight: "500", color: "#f1f5f9" }}>Inventory Updated</p>
              <p style={{ fontSize: "14px", color: "#cbd5e1" }}>Stock levels adjusted</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "1px solid #334155", padding: "24px", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.3)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#f1f5f9", marginBottom: "16px" }}>System Status</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: "#cbd5e1" }}>Backend API</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a", backgroundColor: "#0d3a1c", padding: "4px 8px", borderRadius: "4px" }}>✓ Online</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: "#cbd5e1" }}>Database</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a", backgroundColor: "#0d3a1c", padding: "4px 8px", borderRadius: "4px" }}>✓ Connected</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: "#cbd5e1" }}>PVMC Compliance</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#3b82f6", backgroundColor: "#0c2540", padding: "4px 8px", borderRadius: "4px" }}>✓ Ready</span>
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "16px" }}>Last sync: 5 mins ago</p>
        </div>
      </div>
    </div>
  );
}
