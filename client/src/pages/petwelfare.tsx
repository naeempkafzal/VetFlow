import { useState } from "react";

const PetWelfare = ({ language = "en" }: { language?: string }) => {
  const t = (en: string, ur: string) => language === "en" ? en : ur;
  const [healthData, setHealthData] = useState("");
  const [visitPatterns, setVisitPatterns] = useState("");
  const [score, setScore] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const visitCount = parseInt(visitPatterns) || 0;
    const healthScore = healthData.toLowerCase() === "good" ? 80 : 40;
    setScore(healthScore - visitCount * 5);
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px", color: "#f1f5f9" }}>
        {t("Pet Welfare Scoring", "پالتو جانور کی فلاح و بہبود کا سکورنگ")}
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
              {t("Health Data (good/poor):", "صحت کا ڈیٹا (اچھا/غریب):")}
            </label>
            <input
              type="text"
              value={healthData}
              onChange={(e) => setHealthData(e.target.value)}
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
              {t("Visit Patterns (number):", "وزٹ کے پیٹرن (نمبر):")}
            </label>
            <input
              type="number"
              value={visitPatterns}
              onChange={(e) => setVisitPatterns(e.target.value)}
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
            {t("Calculate Score", "سکور کا حساب لگائیں")}
          </button>
        </form>
      </div>
      {score !== null && (
        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", color: "#f1f5f9" }}>
          <p style={{ fontSize: "16px" }}>
            {t(`Pet Welfare Score: ${score}`, `پالتو جانور کی فلاح و بہبود کا سکور: ${score}`)}
          </p>
        </div>
      )}
    </div>
  );
};

export default PetWelfare;