import { useState, useEffect } from "react";

interface Outbreak {
  id?: number;
  disease?: string;
  geoCoordinates?: string;
  province?: string;
  advisory?: string;
}

const Outbreaks = ({ language }: { language: string }) => {
  const t = (en: string, ur: string) => language === "en" ? en : ur;
  const [outbreaks, setOutbreaks] = useState<Outbreak[]>([]);
  const [form, setForm] = useState({
    disease: "",
    geoCoordinates: "",
    province: "",
    advisory: "",
  });

  useEffect(() => {
    fetch("/api/outbreaks")
      .then((res) => res.json())
      .then(setOutbreaks)
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleSubmit = () => {
    if (!form.disease || !form.geoCoordinates || !form.province) {
      alert(t("Please fill all required fields", "براہ کرم تمام ضروری فیلڈز بھریں"));
      return;
    }

    fetch("/api/outbreaks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() => {
        setForm({ disease: "", geoCoordinates: "", province: "", advisory: "" });
        return fetch("/api/outbreaks");
      })
      .then((res) => res.json())
      .then(setOutbreaks)
      .catch((err) => console.error("Error adding outbreak:", err));
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#1f2937", marginBottom: "24px" }}>
        {t("Disease Outbreak Reporting", "بیماری کی وباء کی رپورٹنگ")}
      </h1>

      <div
        style={{
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          maxWidth: "448px",
          backgroundColor: "#fff",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#374151" }}>
          {t("Report New Outbreak", "نئی وباء کی رپورٹ کریں")}
        </h2>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>
            {t("Disease:", "بیماری:")}
          </label>
          <input
            type="text"
            value={form.disease}
            onChange={(e) => setForm({ ...form, disease: e.target.value })}
            placeholder={t("e.g., Foot and Mouth Disease", "مثلاً، منہ اور کھر کی بیماری")}
            style={{
              marginTop: "4px",
              padding: "8px",
              width: "100%",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>
            {t("Geo Coordinates:", "جغرافیائی کوآرڈینیٹس:")}
          </label>
          <input
            type="text"
            value={form.geoCoordinates}
            onChange={(e) => setForm({ ...form, geoCoordinates: e.target.value })}
            placeholder={t("e.g., 33.6844° N, 73.0479° E", "مثلاً، 33.6844° N, 73.0479° E")}
            style={{
              marginTop: "4px",
              padding: "8px",
              width: "100%",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>
            {t("Province:", "صوبہ:")}
          </label>
          <input
            type="text"
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
            placeholder={t("e.g., Punjab", "مثلاً، پنجاب")}
            style={{
              marginTop: "4px",
              padding: "8px",
              width: "100%",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>
            {t("Advisory:", "مشورہ:")}
          </label>
          <input
            type="text"
            value={form.advisory}
            onChange={(e) => setForm({ ...form, advisory: e.target.value })}
            placeholder={t("Optional advisory notes", "اختیاری مشورہ نوٹس")}
            style={{
              marginTop: "4px",
              padding: "8px",
              width: "100%",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "8px 16px",
            backgroundColor: "#dc2626",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
        >
          {t("Report Outbreak", "وباء کی رپورٹ کریں")}
        </button>
      </div>

      <div style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", padding: "24px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#374151" }}>
          {t("Reported Outbreaks", "رپورٹ شدہ وباؤں")}
        </h2>

        <ul style={{ display: "flex", flexDirection: "column", gap: "16px", listStyle: "none", padding: 0, margin: 0 }}>
          {outbreaks.length === 0 ? (
            <li style={{ color: "#6b7280", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px", textAlign: "center" }}>
              {t("No outbreaks reported.", "کوئی وباء رپورٹ نہیں ہوئی.")}
            </li>
          ) : (
            outbreaks.map((outbreak) => (
              <li
                key={outbreak.id}
                style={{
                  padding: "16px",
                  borderRadius: "8px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px" }}>⚠️</span>
                    <span style={{ fontSize: "16px", fontWeight: "600", color: "#991b1b" }}>
                      {outbreak.disease || t("Unknown Disease", "نامعلوم بیماری")}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px", fontSize: "14px" }}>
                    <span style={{ color: "#6b7280", fontWeight: "500" }}>
                      {t("Province:", "صوبہ:")}
                    </span>
                    <span style={{ color: "#1f2937" }}>
                      {outbreak.province || t("Unknown", "نامعلوم")}
                    </span>

                    <span style={{ color: "#6b7280", fontWeight: "500" }}>
                      {t("Location:", "مقام:")}
                    </span>
                    <span style={{ color: "#1f2937", fontFamily: "monospace", fontSize: "12px" }}>
                      {outbreak.geoCoordinates || t("Not specified", "متعین نہیں")}
                    </span>

                    {outbreak.advisory && (
                      <>
                        <span style={{ color: "#6b7280", fontWeight: "500" }}>
                          {t("Advisory:", "مشورہ:")}
                        </span>
                        <span style={{ color: "#1f2937" }}>{outbreak.advisory}</span>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div
        style={{
          padding: "16px",
          backgroundColor: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "8px",
          borderLeft: "4px solid #2563eb",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <span style={{ fontSize: "20px" }}>ℹ️</span>
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1e40af", marginBottom: "4px" }}>
              {t("Biosafety Advisories", "بایو سیفٹی مشورے")}
            </h3>
            <p style={{ fontSize: "14px", color: "#1e40af", margin: 0 }}>
              {t(
                "Punjab - Quarantine required for Hemorrhagic Septicemia (HS) cases. Contact local livestock department for guidance.",
                "پنجاب - ہیمرجک سیپٹیسیمیا (HS) کیسز کے لیے قرنطینہ ضروری ہے۔ رہنمائی کے لیے مقامی لائیو سٹاک ڈیپارٹمنٹ سے رابطہ کریں۔"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outbreaks;
