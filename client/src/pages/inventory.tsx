import { useState, useEffect, FormEvent } from "react";

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:5001/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() =>
        fetch("http://localhost:5001/api/inventory")
          .then((res) => res.json())
          .then(setInventory),
      )
      .catch((err) => console.error("Error adding inventory:", err));
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => setLang(lang === "en" ? "ur" : "en")}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Switch Language (تبدیل زبان)
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {lang === "en" ? "Inventory Management" : "انوینٹری مینجمنٹ"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg shadow-md max-w-md bg-white"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Item Name:" : "اشیاء کا نام:"}
          </label>
          <input
            type="text"
            value={form.itemName}
            onChange={(e) => setForm({ ...form, itemName: e.target.value })}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Quantity:" : "مقدار:"}
          </label>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: parseInt(e.target.value) || 0 })
            }
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Cost (PKR):" : "قیمت (PKR):"}
          </label>
          <input
            type="number"
            value={form.cost}
            onChange={(e) =>
              setForm({ ...form, cost: parseFloat(e.target.value) || 0 })
            }
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Low Stock Threshold:" : "کم اسٹاک کی حد:"}
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
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {lang === "en" ? "Add Item" : "آئٹم شامل کریں"}
        </button>
      </form>
      <ul className="mt-6 space-y-4">
        {inventory.length === 0 ? (
          <li className="text-gray-600">
            {lang === "en"
              ? "No inventory items found."
              : "کوئی انوینٹری آئٹم نہیں ملی."}
          </li>
        ) : (
          inventory.map((item) => (
            <li key={item.id} className="p-4 rounded-lg shadow-md bg-white">
              <span className="text-gray-800">
                {item.itemName || (lang === "en" ? "Unknown" : "نامعلوم")} -
                Quantity: {item.quantity || 0} - Cost: {item.cost || 0} PKR
              </span>
              {item.quantity != null &&
                item.lowStockThreshold != null &&
                item.quantity < item.lowStockThreshold && (
                  <span className="text-red-600 ml-2">
                    {lang === "en" ? "(Low Stock)" : "(کم اسٹاک)"}
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
