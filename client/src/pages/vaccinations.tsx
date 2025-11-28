import { useState, useEffect, FormEvent } from "react";

interface Vaccination {
  id?: number;
  animalId?: number;
  vaccineType?: string;
  dueDate?: string;
  status?: string;
}

const Vaccinations = ({ language }: { language: string }) => {
  const t = (en: string, ur: string) => language === "en" ? en : ur;
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [form, setForm] = useState({
    animalId: 0,
    vaccineType: "",
    dueDate: "",
    status: "",
  });

  useEffect(() => {
    fetch("/api/vaccinations")
      .then((res) => res.json())
      .then(setVaccinations)
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetch("/api/vaccinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() =>
        fetch("/api/vaccinations")
          .then((res) => res.json())
          .then(setVaccinations),
      )
      .catch((err) => console.error("Error adding vaccination:", err));
  };

  return (
    <div style={{ padding: "32px 16px", maxWidth: "1280px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px", color: "#f1f5f9" }}>
        {t("Vaccination Management", "ویکسین کی تدابیر")}
      </h1>
      <p style={{ color: "#cbd5e1", marginBottom: "32px" }}>
        {t("Track animal vaccinations and PVMC compliance", "جانوروں کی ویکسین اور PVMC کی تعریف کو ٹریک کریں")}
      </p>
      <form
        onSubmit={handleSubmit}
        style={{ padding: "24px", backgroundColor: "#1e293b", borderRadius: "8px", maxWidth: "500px", marginBottom: "32px" }}
      >
        <input type="number" value={form.animalId} onChange={(e) => setForm({ ...form, animalId: parseInt(e.target.value) || 0 })} placeholder={t("Animal ID", "جانور کا ID")} required style={{ width: "100%", padding: "8px", marginBottom: "16px", border: "1px solid #334155", borderRadius: "6px", backgroundColor: "#0f172a", color: "#f1f5f9" }} />
        <input type="text" value={form.vaccineType} onChange={(e) => setForm({ ...form, vaccineType: e.target.value })} placeholder={t("Vaccine Type", "ویکسین کی قسم")} required style={{ width: "100%", padding: "8px", marginBottom: "16px", border: "1px solid #334155", borderRadius: "6px", backgroundColor: "#0f172a", color: "#f1f5f9" }} />
        <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required style={{ width: "100%", padding: "8px", marginBottom: "16px", border: "1px solid #334155", borderRadius: "6px", backgroundColor: "#0f172a", color: "#f1f5f9" }} />
        <input type="text" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder={t("Status", "حالت")} style={{ width: "100%", padding: "8px", marginBottom: "16px", border: "1px solid #334155", borderRadius: "6px", backgroundColor: "#0f172a", color: "#f1f5f9" }} />
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
          {t("Add Vaccination", "ویکسینیشن شامل کریں")}
        </button>
      </form>
      <div style={{ marginTop: "16px" }}>
        {vaccinations.length === 0 ? (
          <p style={{ color: "#cbd5e1" }}>{t("No vaccinations found", "کوئی ویکسینیشن نہیں ملی")}</p>
        ) : (
          vaccinations.map((vax) => (
            <div key={vax.id} style={{ padding: "16px", border: "1px solid #334155", borderRadius: "8px", marginBottom: "12px", backgroundColor: "#1e293b" }}>
              <p style={{ margin: 0, color: "#f1f5f9", fontWeight: "600" }}>Animal {vax.animalId} - {vax.vaccineType}</p>
              <p style={{ margin: "4px 0 0 0", color: "#cbd5e1", fontSize: "14px" }}>{t("Due:", "موعد :")} {vax.dueDate || "N/A"}</p>
            </div>
          ))
        )}
      </div>
      <p style={{ marginTop: "16px", fontSize: "14px", color: "#64748b" }}>
        {t("PVMC Compliant: HS vaccine every 6 months, Rabies annually", "PVMC مطابق: HS ہر 6 مہینے، ریبیز سالانہ")}
      </p>
    </div>
  );
};

export default Vaccinations;
