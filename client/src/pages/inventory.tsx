import { useState, useEffect } from "react";

interface InventoryItem {
  id?: number;
  itemName?: string;
  quantity?: number;
  cost?: number;
  lowStockThreshold?: number;
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

  useEffect(() => {
    fetch("http://localhost:5001/api/inventory")
      .then((res) => res.json())
      .then(setInventory)
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleSubmit = () => {
    if (!form.itemName || form.quantity <= 0 || form.cost <= 0) {
      alert(t("Please fill all fields correctly", "براہ کرم تمام فیلڈز صحیح طریقے سے بھریں"));
      return;
    }
    
    fetch("http://localhost:5001/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() => {
        setForm({ itemName: "", quantity: 0, cost: 0, lowStockThreshold: 10 });
        return fetch("http://localhost:5001/api/inventory");
      })
      .then((res) => res.json())
      .then(setInventory)
      .catch((err) => console.error("Error adding inventory:", err));
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#f1f5f9", marginBottom: "24px" }}>
        {t("Inventory Management", "انوینٹری مینجمنٹ")}
      </h1>
      
      <div
        style={{ 
          padding: "24px", 
          borderRadius: "8px", 
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)", 
          maxWidth: "448px", 
          backgroundColor: "#1e293b",
          marginBottom: "24px"
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1" }}>
            {t("Item Name:", "اشیاء کا نام:")}
          </label>
          <input
            type="text"
            value={form.itemName}
            onChange={(e) => setForm({ ...form, itemName: e.target.value })}
            style={{ 
              marginTop: "4px", 
              padding: "8px", 
              width: "100%", 
              border: "1px solid #334155", 
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: "#0f172a",
              color: "#f1f5f9"
            }}
          />
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1" }}>
            {t("Quantity:", "مقدار:")}
          </label>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: parseInt(e.target.value) || 0 })
            }
            style={{ 
              marginTop: "4px", 
              padding: "8px", 
              width: "100%", 
              border: "1px solid #334155", 
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: "#0f172a",
              color: "#f1f5f9"
            }}
          />
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1" }}>
            {t("Cost (PKR):", "قیمت (PKR):")}
          </label>
          <input
            type="number"
            value={form.cost}
            onChange={(e) =>
              setForm({ ...form, cost: parseFloat(e.target.value) || 0 })
            }
            style={{ 
              marginTop: "4px", 
              padding: "8px", 
              width: "100%", 
              border: "1px solid #334155", 
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: "#0f172a",
              color: "#f1f5f9"
            }}
          />
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1" }}>
            {t("Low Stock Threshold:", "کم اسٹاک کی حد:")}
          </label>
          <input
            type="number"
            value={form.lowStockThreshold}
            onChange={(e) =>
              setForm({
                ...form,
                lowStockThreshold: parseInt(e.target.value) || 10,
              })
            }
            style={{ 
              marginTop: "4px", 
              padding: "8px", 
              width: "100%", 
              border: "1px solid #334155", 
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: "#0f172a",
              color: "#f1f5f9"
            }}
          />
        </div>
        
        <button
          onClick={handleSubmit}
          style={{ 
            width: "100%", 
            padding: "8px 16px", 
            backgroundColor: "#2563eb", 
            color: "#fff", 
            borderRadius: "4px",
            border: "none",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
        >
          {t("Add Item", "آئٹم شامل کریں")}
        </button>
      </div>
      
      <ul style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px", listStyle: "none", padding: 0 }}>
        {inventory.length === 0 ? (
          <li style={{ color: "#cbd5e1", padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px" }}>
            {t("No inventory items found.", "کوئی انوینٹری آئٹم نہیں ملی.")}
          </li>
        ) : (
          inventory.map((item) => (
            <li 
              key={item.id} 
              style={{ 
                padding: "16px", 
                borderRadius: "8px", 
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)", 
                backgroundColor: "#1e293b",
                border: item.quantity != null && item.lowStockThreshold != null && item.quantity < item.lowStockThreshold 
                  ? "2px solid #dc2626" 
                  : "1px solid #334155"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "16px" }}>
                  {item.itemName || t("Unknown", "نامعلوم")}
                </span>
                <div style={{ display: "flex", gap: "16px", fontSize: "14px", color: "#cbd5e1" }}>
                  <span>{t("Qty:", "مقدار:")} <strong>{item.quantity || 0}</strong></span>
                  <span>{t("Cost:", "قیمت:")} <strong>{item.cost || 0} PKR</strong></span>
                  <span>{t("Threshold:", "حد:")} <strong>{item.lowStockThreshold || 10}</strong></span>
                </div>
              </div>
              {item.quantity != null &&
                item.lowStockThreshold != null &&
                item.quantity < item.lowStockThreshold && (
                  <span 
                    style={{ 
                      color: "#dc2626", 
                      marginLeft: "8px",
                      fontWeight: "600",
                      fontSize: "14px",
                      display: "inline-block",
                      marginTop: "8px",
                      backgroundColor: "#fee2e2",
                      padding: "4px 8px",
                      borderRadius: "4px"
                    }}
                  >
                    ⚠️ {t("Low Stock Alert", "کم اسٹاک الرٹ")}
                  </span>
                )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Inventory;
