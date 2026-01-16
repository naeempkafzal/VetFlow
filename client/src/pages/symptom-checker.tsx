import { useState } from "react";

const diseases = [
  {
    name: "Haemorrhagic Septicaemia (HS)",
    urdu: "خون بہنے والی خون کی بیماری",
    symptoms: ["Fever", "Respiratory distress", "Swelling"],
    species: "Livestock",
  },
  {
    name: "Foot-and-Mouth Disease (FMD)",
    urdu: "منہ اور کھر کی بیماری",
    symptoms: ["Fever", "Blisters on mouth", "Lameness"],
    species: "Livestock",
  },
  {
    name: "Rabies",
    urdu: "ہلکا مرض",
    symptoms: ["Aggression", "Paralysis", "Foaming at mouth"],
    species: "Pets",
  },
];

const SymptomChecker = ({ language = "en" }: { language?: string }) => {
  const t = (en: string, ur: string) => language === "en" ? en : ur;
  const [symptoms, setSymptoms] = useState("");
  const [species, setSpecies] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = diseases.filter(
      (d) =>
        d.species.toLowerCase() === species.toLowerCase() &&
        d.symptoms.some((s) =>
          symptoms.toLowerCase().includes(s.toLowerCase()),
        ),
    );
    setResults(filtered);
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px", color: "#f1f5f9" }}>
        {t("Symptom Checker", "علامات چیکر")}
      </h1>
      <div
        style={{
          padding: "24px",
          backgroundColor: "#1e293b",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
          maxWidth: "448px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "4px" }}>
              {t("Species (Livestock or Pets):", "نوع (مویشی یا پالتو جانور):")}
            </label>
            <input
              type="text"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              required
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
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "4px" }}>
              {t("Symptoms (comma-separated):", "علامات (کاما سے الگ):")}
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
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
            type="submit"
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
            }}
          >
            {t("Check", "چیکنگ کریں")}
          </button>
        </form>
      </div>

      <ul style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px", listStyle: "none", padding: 0 }}>
        {results.length === 0 ? (
          <li style={{ color: "#cbd5e1", padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px" }}>
            {t("No matching diseases.", "کوئی ملتی جلتی بیماری نہیں.")}
          </li>
        ) : (
          results.map((d) => (
            <li key={d.name} style={{ padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", color: "#f1f5f9", border: "1px solid #334155" }}>
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                {language === "en" ? d.name : d.urdu}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SymptomChecker;