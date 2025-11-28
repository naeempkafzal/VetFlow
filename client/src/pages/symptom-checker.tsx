import { useState, FormEvent } from "react";

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

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [species, setSpecies] = useState("");
  const [results, setResults] = useState<any[]>([]); // Fixed syntax
  const [lang, setLang] = useState<"en" | "ur">("en"); // Fixed syntax

  const handleSubmit = (e: FormEvent) => {
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
    <div className="container mx-auto p-4">
      <button
        onClick={() => setLang(lang === "en" ? "ur" : "en")}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Switch Language (تبدیل زبان)
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {lang === "en" ? "Symptom Checker" : "علامات چیکر"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg shadow-md max-w-md bg-white"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en"
              ? "Species (Livestock or Pets):"
              : "نوع (مویشی یا پالتو جانور):"}
          </label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en"
              ? "Symptoms (comma-separated):"
              : "علامات (کاما سے الگ):"}
          </label>
          <input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {lang === "en" ? "Check" : "چیکنگ کریں"}
        </button>
      </form>
      <ul className="mt-6 space-y-4">
        {results.length === 0 ? (
          <li className="text-gray-600">
            {lang === "en"
              ? "No matching diseases."
              : "کوئی ملتی جلتی بیماری نہیں."}
          </li>
        ) : (
          results.map((d) => (
            <li key={d.name} className="p-4 rounded-lg shadow-md bg-white">
              <span className="text-gray-800">
                {lang === "en" ? d.name : d.urdu}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SymptomChecker;
