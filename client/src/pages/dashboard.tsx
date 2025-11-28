export default function Dashboard() {
  return (
    <div style={{ padding: "32px", maxWidth: "1280px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px", color: "#111" }}>
        Veterinary Dashboard
      </h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>Welcome to VetFlow - Comprehensive veterinary workflow automation</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>
          <p style={{ fontSize: "14px", color: "#666" }}>Total Animals</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111" }}>12</p>
        </div>
        <div style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>
          <p style={{ fontSize: "14px", color: "#666" }}>Appointments Today</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111" }}>3</p>
        </div>
        <div style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>
          <p style={{ fontSize: "14px", color: "#666" }}>Overdue Vaccinations</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111" }}>2</p>
        </div>
        <div style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>
          <p style={{ fontSize: "14px", color: "#666" }}>Low Stock Items</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111" }}>1</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        <div style={{ gridColumn: "span 2", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "24px", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#111", marginBottom: "16px" }}>Recent Activities</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "12px", borderLeft: "4px solid #2563eb", backgroundColor: "#eff6ff" }}>
              <p style={{ fontWeight: "500", color: "#111" }}>Animal Record Created</p>
              <p style={{ fontSize: "14px", color: "#666" }}>Cow registered - Sahiwal breed</p>
            </div>
            <div style={{ padding: "12px", borderLeft: "4px solid #16a34a", backgroundColor: "#f0fdf4" }}>
              <p style={{ fontWeight: "500", color: "#111" }}>Vaccination Completed</p>
              <p style={{ fontSize: "14px", color: "#666" }}>FMD vaccine administered</p>
            </div>
            <div style={{ padding: "12px", borderLeft: "4px solid #ea580c", backgroundColor: "#fff7ed" }}>
              <p style={{ fontWeight: "500", color: "#111" }}>Inventory Updated</p>
              <p style={{ fontSize: "14px", color: "#666" }}>Stock levels adjusted</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "24px", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>
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
    </div>
  );
}
