import { useState, useEffect, FormEvent } from "react";
import { format } from "date-fns";

interface Vaccination {
  id?: number;
  animalId?: number;
  vaccineType?: string;
  dueDate?: string;
  status?: string;
}

const Vaccinations = () => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [form, setForm] = useState({
    animalId: 0,
    vaccineType: "",
    dueDate: "",
    status: "",
  });
  const [lang, setLang] = useState<"en" | "ur">("en");

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
    <div className="container mx-auto p-4">
      <button
        onClick={() => setLang(lang === "en" ? "ur" : "en")}
        className="mb-4 p-2 bg-secondary text-secondary-foreground rounded"
      >
        Switch Language (تبدیل زبان)
      </button>
      <h1 className="text-3xl font-bold text-foreground mb-6 urdu-text">
        {lang === "en" ? "Vaccination Scheduler" : "ویکسینیشن شیڈولر"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="glass-card p-6 rounded-lg shadow-md max-w-md"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            {lang === "en" ? "Animal ID:" : "جانور کا ID:"}
          </label>
          <input
            type="number"
            value={form.animalId}
            onChange={(e) =>
              setForm({ ...form, animalId: parseInt(e.target.value) || 0 })
            }
            required
            className="mt-1 p-2 w-full border border-border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            {lang === "en" ? "Vaccine Type:" : "ویکسین کی قسم:"}
          </label>
          <input
            type="text"
            value={form.vaccineType}
            onChange={(e) => setForm({ ...form, vaccineType: e.target.value })}
            required
            className="mt-1 p-2 w-full border border-border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            {lang === "en" ? "Due Date:" : "موعد کی تاریخ:"}
          </label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            required
            className="mt-1 p-2 w-full border border-border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            {lang === "en" ? "Status:" : "حالت:"}
          </label>
          <input
            type="text"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="mt-1 p-2 w-full border border-border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          {lang === "en" ? "Add Vaccination" : "ویکسینیشن شامل کریں"}
        </button>
      </form>
      <ul className="mt-6 space-y-4">
        {vaccinations.length === 0 ? (
          <li className="text-muted-foreground">
            {lang === "en"
              ? "No vaccinations found."
              : "کوئی ویکسینیشن نہیں ملی."}
          </li>
        ) : (
          vaccinations.map((vax) => (
            <li key={vax.id} className="glass-card p-4 rounded-lg shadow-md">
              <span className="text-foreground">
                Animal ID: {vax.animalId} -{" "}
                {vax.vaccineType || (lang === "en" ? "Unknown" : "نامعلوم")} -
                Due:{" "}
                {vax.dueDate ? format(new Date(vax.dueDate), "PPP") : "No Date"}{" "}
                - Status:{" "}
                {vax.status || (lang === "en" ? "Unknown" : "نامعلوم")}
              </span>
              {vax.dueDate && new Date(vax.dueDate) < new Date() && (
                <span className="text-destructive ml-2">
                  {lang === "en" ? "(Overdue)" : "(اوورڈیو)"}
                </span>
              )}
            </li>
          ))
        )}
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">
        {lang === "en"
          ? "PVMC Compliant Schedules: HS vaccine every 6 months, Rabies annually."
          : "PVMC مطابق شیڈول: HS ویکسین ہر 6 مہینے, ریبیز سالانہ."}
      </p>
    </div>
  );
};

export default Vaccinations;
