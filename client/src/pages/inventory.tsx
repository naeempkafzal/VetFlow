import { useState, useEffect } from "react";

interface InventoryItem {
  id?: number;
  itemName?: string;
  quantity?: number;
  cost?: number;
  lowStockThreshold?: number;
  initialStock?: number;
  // New fields from Forecast
  status?: string;
  predictedEmptyDate?: string;
}

const Inventory = ({ language }: { language: string }) => {
  const t = (en: string, ur: string) => language === "en" ? en : ur;
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [form, setForm] = useState({
    itemName: "",
    quantity: 0,
    cost: 0,
    lowStockThreshold: 10,
  });
  const [forecast, setForecast] = useState<any>(null);

  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => res.json())
      .then(setInventory)
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Helper: Fetch Forecast
  const fetchForecast = (id: number) => {
    fetch(`/api/inventory/forecast/${id}`)
      .then(res => res.json())
      .then(data => setForecast(data))
      .catch(err => console.error("Forecast error", err));
  };

  const handleSubmit = () => {
    if (!form.itemName || form.quantity <= 0 || form.cost <= 0) {
      alert(t("Please fill all fields correctly", "براہ کرم تمام فیلڈز صحیح طریقے سے بھریں"));
      return;
    }

    const payload = {
      itemName: form.itemName,
      quantity: parseInt(form.quantity.toString()),
      cost: parseFloat(form.cost.toString()),
      lowStockThreshold: parseInt(form.lowStockThreshold.toString()),
    };
    
    fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => {
        setForm({ itemName: "", quantity: 0, cost: 0, lowStockThreshold: 10 });
        return fetch("/api/inventory");
      })
      .then((res) => res.json())
      .then(setInventory)
      .catch((err) => console.error("Error adding inventory:", err));
  };

  const handleDeduct = (id: number) => {
    const amount = prompt("Enter amount to deduct:");
    if (!amount) return;
    fetch(`/api/inventory/deduct/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseInt(amount) })
    })
    .then(res => res.json())
    .then(updatedItem => {
      setInventory(inv => inv.map(item => item.id === id ? updatedItem : item));
      alert("Stock Deducted");
    });
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#f1f5f9", marginBottom: "24px" }}>
        {t("Inventory Management", "انوینٹری مینجمنٹ")}
      </h1>
      
      {/* AI Forecasting Card */}
      {forecast && (
        <div style={{ padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", border: `2px solid ${forecast.status === 'CRITICAL' ? '#dc2626' : '#2563eb'}`, marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "#f1f5f9" }}>
            🤖 {t("AI Forecast", "AI پیشگوئی")}: {forecast.itemName}
          </h2>
          <div style={{ display: "grid", gap: "12px" }}>
             <p style={{ color: "#cbd5e1" }}>
               {t("Current Stock", "موجودہ اسٹاک")}: <strong>{forecast.currentStock}</strong>
             </p>
             <p style={{ color: "#cbd5e1" }}>
               {t("Predicted Empty Date", "اگرا خالی ہونے کی تاریخ")}: <strong style={{ color: forecast.status === 'CRITICAL' ? '#dc2626' : 'inherit' }}>{forecast.predictedEmptyDate}</strong>
             </p>
          </div>
          <button onClick={() => setForecast(null)} style={{ padding: "4px 8px", border: "1px solid #334155", borderRadius: "4px", background: "#0f172a", color: "#f1f5f9" }}>
            Close
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "start" }}>
        
        {/* Form */}
        <div style={{ backgroundColor: "#1e293b", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)", maxWidth: "448px", padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#f1f5f9" }}>
            {t("Add Item", "آئٹم شامل کریں")}
          </h2>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "4px" }}>
              {t("Item Name:", "اشیاء کا نام:")}
            </label>
            <input type="text" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} style={{ marginTop: "4px", padding: "8px", width: "100%", border: "1px solid #334155", borderRadius: "4px", fontSize: "14px", backgroundColor: "#0f172a", color: "#f1f5f9" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "4px" }}>
              {t("Quantity:", "مقدار:")}
            </label>
            <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} style={{ marginTop: "4px", padding: "8px", width: "100%", border: "1px solid #334155", borderRadius: "4px", fontSize: "14px", backgroundColor: "#0f172a", color: "#f1f5f9" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "4px" }}>
              {t("Cost (PKR):", "قیمت (PKR):")}
            </label>
            <input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })} style={{ marginTop: "4px", padding: "8px", width: "100%", border: "1px solid #334155", borderRadius: "4px", fontSize: "14px", backgroundColor: "#0f172a", color: "#f1f5f9" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "4px" }}>
              {t("Low Stock Threshold:", "کم اسٹاک کی حد:")}
            </label>
            <input type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: parseInt(e.target.value) || 10 })} style={{ marginTop: "4px", padding: "8px", width: "100%", border: "1px solid #334155", borderRadius: "4px", fontSize: "14px", backgroundColor: "#0f172a", color: "#f1f5f9" }} />
          </div>
          <button onClick={handleSubmit} style={{ width: "100%", padding: "8px 16px", backgroundColor: "#2563eb", color: "#fff", borderRadius: "4px", border: "none", fontSize: "14px", fontWeight: "500", cursor: "pointer", transition: "background-color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}>
            {t("Add Item", "آئٹم شامل کریں")}
          </button>
        </div>

        {/* List */}
        <ul style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px", listStyle: "none", padding: 0 }}>
          {inventory.length === 0 ? (
            <li style={{ color: "#cbd5e1", padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px" }}>
              {t("No inventory items found.", "کوئی انوینٹری آئٹم نہیں ملی.")}
            </li>
          ) : (
            inventory.map((item) => (
              <li key={item.id} style={{ padding: "16px", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)", backgroundColor: "#1e293b", border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "16px" }}>{item.itemName || t("Unknown", "نامعلوم")}</span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>ID: {item.id}</span>
                  </div>
                  <div style={{ display: "flex", gap: "16px", fontSize: "14px", color: "#cbd5e1" }}>
                    <span>{t("Qty:", "مقدار:")} <strong>{item.quantity || 0}</strong></span>
                    <span>{t("Cost:", "قیمت:")} <strong>{item.cost || 0} PKR</strong></span>
                    <span>{t("Threshold:", "حد:")} <strong>{item.lowStockThreshold || 10}</strong></span>
                  </div>
                </div>

                {/* AI Actions */}
                <div style={{ display: "flex", gap: "8px" }}>
                   <button onClick={() => fetchForecast(item.id!)} style={{ padding: "6px 12px", backgroundColor: "#3b82f6", color: "white", borderRadius: "4px", fontSize: "12px", border: "none", cursor: "pointer" }}>
                    🤖 {t("Forecast", "پیشگوئی")}
                  </button>
                  <button onClick={() => handleDeduct(item.id!)} style={{ padding: "6px 12px", backgroundColor: "#f97316", color: "white", borderRadius: "4px", fontSize: "12px", border: "none", cursor: "pointer" }}>
                    ➖ {t("Deduct", "کم کریں")}
                  </button>
                </div>

                {item.quantity != null &&
                  item.lowStockThreshold != null &&
                  item.quantity < item.lowStockThreshold && (
                    <span style={{ color: "#dc2626", marginLeft: "8px", fontWeight: "600", fontSize: "14px", display: "inline-block", marginTop: "8px", backgroundColor: "#fee2e2", padding: "4px 8px", borderRadius: "4px" }}>
                      ⚠️ {t("Low Stock Alert", "کم اسٹاک الرٹ")}
                    </span>
                  )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Inventory;