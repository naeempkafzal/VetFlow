import React, { useState, useEffect } from "react";

interface Outbreak {
  id?: number;
  disease?: string;
  geoCoordinates?: string;
  province?: string;
  advisory?: string;
}

const Outbreaks: React.FC = () => {
  const [outbreaks, setOutbreaks] = useState<Outbreak[]>([]);
  const [form, setForm] = useState({
    disease: "",
    geoCoordinates: "",
    province: "",
    advisory: "",
  });
  const [lang, setLang] = useState<"en" | "ur">("en");

  useEffect(() => {
    fetch("/api/outbreaks")
      .then((res) => res.json())
      .then(setOutbreaks)
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/outbreaks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() =>
        fetch("/api/outbreaks")
          .then((res) => res.json())
          .then(setOutbreaks),
      )
      .catch((err) => console.error("Error adding outbreak:", err));
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => setLang(lang === "en" ? "ur" : "en")}
        className="mb-4 p-2 bg-secondary text-secondary-foreground rounded"
      >
        Switch Language (تبدیل زبان)
      </button>
      <h1 className="text-3xl font-bold text-foreground mb-6 urdu-text">
        {lang === "en"
          ? "Disease Outbreak Reporting"
          : "بیماری کی وباء کی رپورٹنگ"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="glass-card p-6 rounded-lg shadow-md max-w-md"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            {lang === "en" ? "Disease:" : "بیماری:"}
          </label>
          <input
            type="text"
            value={form.disease}
            onChange={(e) => setForm({ ...form, disease: e.target.value })}
            required
            className="mt-1 p-2 w-full border border-border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            {lang === "en" ? "Geo Coordinates:" : "جغرافیائی کوآرڈینیٹس:"}
          </label>
          <input
            type="text"
            value={form.geoCoordinates}
            onChange={(e) =>
              setForm({ ...form, geoCoordinates: e.target.value })
            }
            required
            className="mt-1 p-2 w-full border border-border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            {lang === "en" ? "Province:" : "صوبہ:"}
          </label>
          <input
            type="text"
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
            required
            className="mt-1 p-2 w-full border border-border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            {lang === "en" ? "Advisory:" : "مشورہ:"}
          </label>
          <input
            type="text"
            value={form.advisory}
            onChange={(e) => setForm({ ...form, advisory: e.target.value })}
            className="mt-1 p-2 w-full border border-border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          {lang === "en" ? "Report Outbreak" : "وباء کی رپورٹ کریں"}
        </button>
      </form>
      <ul className="mt-6 space-y-4">
        {outbreaks.length === 0 ? (
          <li className="text-muted-foreground">
            {lang === "en" ? "No outbreaks found." : "کوئی وباء نہیں ملی."}
          </li>
        ) : (
          outbreaks.map((outbreak) => (
            <li
              key={outbreak.id}
              className="glass-card p-4 rounded-lg shadow-md"
            >
              <span className="text-foreground">
                Disease:{" "}
                {outbreak.disease || (lang === "en" ? "Unknown" : "نامعلوم")} -
                Province:{" "}
                {outbreak.province || (lang === "en" ? "Unknown" : "نامعلوم")}
              </span>
            </li>
          ))
        )}
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">
        {lang === "en"
          ? "Biosafety Advisories: Punjab - Quarantine for HS cases."
          : "بایوسیفٹی مشورے: پنجاب - HS کیسز کے لیے قرنطینہ."}
      </p>
    </div>
  );
};

export default Outbreaks;
