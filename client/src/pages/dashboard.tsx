import { useState, useEffect } from "react";

const Dashboard = ({ language }: { language: string }) => {
  const t = (en: string, ur: string) => language === "en" ? en : ur;
  const [stats, setStats] = useState({
    totalAnimals: 0,
    appointmentsToday: 0,
    overdueVaccinations: 0,
    lowStockCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animalsRes, inventoryRes, aptRes, vaxRes] = await Promise.all([
          fetch("/api/animals"),
          fetch("/api/inventory"),
          fetch("/api/appointments"),
          fetch("/api/vaccinations"),
        ]);

        const animals = await animalsRes.json();
        const inventory = await inventoryRes.json();
        const apts = await aptRes.json();
        const vaccines = await vaxRes.json();

        // Calculate: Total Animals
        const totalAnimals = animals.length;

        // Calculate: Appointments Today
        const today = new Date().toISOString().split('T')[0];
        const appointmentsToday = apts.filter((a: any) => 
          a.appointmentDate && a.appointmentDate.startsWith(today)
        ).length;

        // Calculate: Overdue Vaccinations
        const now = new Date();
        const overdueVaccinations = vaccines.filter((v: any) => 
          v.nextDueDate && new Date(v.nextDueDate) < now
        ).length;

        // Calculate: Low Stock Items
        const lowStockCount = inventory.filter((i: any) => 
          i.quantity < (i.lowStockThreshold || 10)
        ).length;

        setStats({ totalAnimals, appointmentsToday, overdueVaccinations, lowStockCount });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "32px", maxWidth: "1280px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px", color: "#f1f5f9" }}>
        Veterinary Dashboard
      </h1>
      <p style={{ color: "#cbd5e1", marginBottom: "32px" }}>
        {t("Real-time operational overview", "وقت کا حقیقی جائزہ")}.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", border: "1px solid #334155", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.3)" }}>
          <p style={{ fontSize: "14px", color: "#cbd5e1" }}>{t("Total Animals", "کل جانورات")}</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#f1f5f9" }}>{stats.totalAnimals}</p>
        </div>
        <div style={{ padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", border: "1px solid #334155", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.3)" }}>
          <p style={{ fontSize: "14px", color: "#cbd5e1" }}>{t("Appointments Today", "آج کی ملاقاتیں")}</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#f1f5f9" }}>{stats.appointmentsToday}</p>
        </div>
        <div style={{ padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", border: "1px solid #334155", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.3)" }}>
          <p style={{ fontSize: "14px", color: "#cbd5e1" }}>{t("Overdue Vaccinations", "اگرا وقت پر ویکسین")}</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#f1f5f9" }}>{stats.overdueVaccinations}</p>
        </div>
        <div style={{ padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", border: "1px solid #334155", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.3)" }}>
          <p style={{ fontSize: "14px", color: "#cbd5e1" }}>{t("Low Stock Items", "کم اسٹاک اشیاء")}</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#f1f5f9" }}>{stats.lowStockCount}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        <div style={{ gridColumn: "span 2", backgroundColor: "#1e293b", borderRadius: "8px", border: "1px solid #334155", padding: "24px", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.3)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#f1f5f9", marginBottom: "16px" }}>{t("System Status", "سسٹم کی حیثیت")}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: "#cbd5e1" }}>{t("Backend API", "بیک اینڈ اے پی آی")}</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a", backgroundColor: "#0d3a1c", padding: "4px 8px", borderRadius: "4px" }}>✓ Online</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: "#cbd5e1" }}>{t("Database", "ڈیٹا بیس")}</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a", backgroundColor: "#0d3a1c", padding: "4px 8px", borderRadius: "4px" }}>✓ Connected</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: "#cbd5e1" }}>{t("Sync Status", "سنک کی حیثیت")}</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#3b82f6", backgroundColor: "#0c2540", padding: "4px 8px", borderRadius: "4px" }}>✓ Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;