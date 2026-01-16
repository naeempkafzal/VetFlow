import { useState } from "react";

const diseases = [
  {
    name: "Haemorrhagic Septicaemia (HS)",
    urdu: "خون بہنے والی خون کی بیماری",
    symptoms: ["Fever", "Respiratory Distress", "Swelling (Throat/Neck)", "Rapid Onset"],
    species: "Livestock",
    severity: "High",
    advice: "Isolate animal immediately. Contact vet. This is often fatal without rapid antibiotics."
  },
  {
    name: "Foot-and-Mouth Disease (FMD)",
    urdu: "منہ اور کھر کی بیماری",
    symptoms: ["Fever", "Blisters (Mouth/Foot)", "Lameness", "Excessive Salivation"],
    species: "Livestock",
    severity: "Critical",
    advice: "Strict quarantine required. Report to authorities immediately."
  },
  {
    name: "Rabies",
    urdu: "ہلکا مرض",
    symptoms: ["Aggression", "Paralysis", "Foaming at Mouth", "Fear of Water"],
    species: "Pets",
    severity: "Fatal",
    advice: "Urgent: Animal is a danger to humans. Contact emergency services immediately."
  },
  {
    name: "Mastitis",
    urdu: "پست",
    symptoms: ["Swollen Udder", "Painful Teats", "Watery Milk", "Fever"],
    species: "Livestock",
    severity: "Medium",
    advice: "Stop milking. Separate animal. Vet assistance required."
  }
];

const SymptomChecker = ({ language = "en" }: { language?: string }) => {
  const t = (en: string, ur: string) => language === "en" ? en : ur;
  const [species, setSpecies] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(50);
  const [results, setResults] = useState<any[]>([]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = diseases.filter(
      (d) => d.species.toLowerCase() === species.toLowerCase() &&
        (d.symptoms.some(s => selectedSymptoms.includes(s)) || selectedSymptoms.length === 0) // Show all if none selected, or matches
    );

    // Sort by Severity Score
    filtered.sort((a, b) => {
      const scoreMap: Record<string, number> = { "Fatal": 4, "Critical": 3, "High": 2, "Medium": 1 };
      const scoreA = scoreMap[a.severity] || 0;
      const scoreB = scoreMap[b.severity] || 0;
      return scoreB - scoreA;
    });

    setResults(filtered);
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px", color: "#f1f5f9" }}>
        {t("AI Symptom Checker", "AI علامات چیکر")}
      </h1>
      <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
        {t("Select symptoms and species for diagnostic suggestions.", "تشخیص کے مشوروں کے لیے علامات اور قسم منتخب کریں.")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        
        {/* Input Form */}
        <div
          style={{
            padding: "24px",
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "8px" }}>
                {t("Species (Livestock / Pets):", "نوع (مویشی / پالتو جانور):")}
              </label>
              <select
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
              >
                <option value="">{t("Select...", "منتخب کریں...")}</option>
                <option value="Livestock">Livestock (مویشی)</option>
                <option value="Pets">Pets (پالتو جانور)</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "8px" }}>
                {t("Observed Symptoms:", "مشاہدہ علامات:")}
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {[
                  "Fever", "Cough", "Lameness", "Swelling", "Diarrhea", 
                  "Paralysis", "Aggression", "Loss of Appetite"
                ].map((symptom) => (
                  <label key={symptom} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", color: "#cbd5e1" }}>
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                      style={{ width: "16px", height: "16px" }}
                    />
                    {symptom}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "8px" }}>
                {t("Severity Slider:", "شدت سلائیڑر:")}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                style={{ width: "100%", cursor: "pointer" }}
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
              {t("Diagnose", "تشخیص کریں")}
            </button>
          </form>
        </div>

        {/* AI Feedback / Results Area */}
        <div style={{ minHeight: "400px" }}>
          {results.length === 0 ? (
            <div style={{ padding: "24px", backgroundColor: "#1e293b", borderRadius: "8px", textAlign: "center", color: "#94a3b8", border: "1px dashed #334155" }}>
              <span style={{ fontSize: "24px" }}>🤖</span>
              <p style={{ marginTop: "12px" }}>
                {t("Enter data to receive analysis.", "تجزیہ حاصل کرنے کے لیے ڈیٹا درج کریں.")}
              </p>
            </div>
          ) : (
            <ul style={{ display: "flex", flexDirection: "column", gap: "16px", listStyle: "none", padding: 0 }}>
              {results.map((d) => (
                <li
                  key={d.name}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    backgroundColor: d.severity === "Critical" || d.severity === "Fatal" ? "#7f1d1d" : "#1e293b",
                    border: d.severity === "Critical" ? "2px solid #dc2626" : "1px solid #334155",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: language === "en" ? d.name : d.urdu }}>
                        {language === "en" ? d.name : d.urdu}
                      </h3>
                      <span style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: "bold", color: d.severity === "Fatal" ? "#dc2626" : "#f97316", marginLeft: "8px" }}>
                        {d.severity} Severity
                      </span>
                    </div>
                  </div>
                  
                  {/* AI / Practical Advice */}
                  <div style={{ backgroundColor: "#0f172a", padding: "12px", borderRadius: "6px", fontSize: "14px", color: "#cbd5e1", borderLeft: "2px solid #2563eb" }}>
                    <strong style={{ color: "#38bdf8", display: "block", marginBottom: "4px" }}>
                      {t("Analysis:", "تجزیہ:")}
                    </strong>
                    {d.advice}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;