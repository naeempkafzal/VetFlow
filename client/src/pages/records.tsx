import { useState, useEffect, FormEvent } from "react";

interface Animal {
  id?: number;
  name?: string;
  ownerName?: string;
  species?: string;
  breed?: string;
  location?: string;
}

interface Visit {
  id?: number;
  animalId?: number;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string;
  notes?: string;
  veterinarianName?: string;
}

const Records = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    species: "",
    breed: "",
    location: "",
  });
  const [visitForm, setVisitForm] = useState({
    animalId: 0,
    symptoms: "",
    diagnosis: "",
    treatment: "",
    medications: "",
    notes: "",
    veterinarianName: "",
  });
  const [lang, setLang] = useState<"en" | "ur">("en");

  useEffect(() => {
    // FIX: Changed hardcoded URL to relative path
    fetch("/api/records")
      .then((res) => res.json())
      .then(setAnimals)
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleAnimalSubmit = (e: FormEvent) => {
    e.preventDefault();
    // FIX: Changed hardcoded URL to relative path
    fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() =>
        fetch("/api/records")
          .then((res) => res.json())
          .then(setAnimals),
      )
      .catch((err) => console.error("Error adding animal:", err));
  };

  const handleVisitSubmit = (e: FormEvent) => {
    e.preventDefault();
    // FIX: Changed hardcoded URL to relative path
    fetch("/api/visit-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitForm),
    })
      .then(() => {
        setVisitForm({
          animalId: 0,
          symptoms: "",
          diagnosis: "",
          treatment: "",
          medications: "",
          notes: "",
          veterinarianName: "",
        }); // Reset form after success
      })
      .catch((err) => console.error("Error adding visit:", err));
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
        {lang === "en" ? "Animal Records" : "جانور کے ریکارڈز"}
      </h1>
      <form
        onSubmit={handleAnimalSubmit}
        className="p-6 rounded-lg shadow-md max-w-md mb-8 bg-white"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Name:" : "نام:"}
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Owner Name:" : "مالک کا نام:"}
          </label>
          <input
            type="text"
            value={form.ownerName}
            onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Species:" : "نوع:"}
          </label>
          <input
            type="text"
            value={form.species}
            onChange={(e) => setForm({ ...form, species: e.target.value })}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Breed:" : "نسل:"}
          </label>
          <input
            type="text"
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Location:" : "مقام:"}
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {lang === "en" ? "Add Animal" : "جانور شامل کریں"}
        </button>
      </form>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8">
        {lang === "en" ? "Existing Records" : "موجودہ ریکارڈز"}
      </h2>
      <ul className="space-y-4">
        {animals.length === 0 ? (
          <li className="text-gray-600">
            {lang === "en" ? "No records found." : "کوئی ریکارڈ نہیں ملا."}
          </li>
        ) : (
          animals.map((animal) => (
            <li key={animal.id} className="p-4 rounded-lg shadow-md bg-white">
              <span className="text-gray-800">
                ID: {animal.id} -{" "}
                {animal.name || (lang === "en" ? "Unknown" : "نامعلوم")} (
                {animal.species || (lang === "en" ? "Unknown" : "نامعلوم")})
              </span>
            </li>
          ))
        )}
      </ul>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8">
        {lang === "en" ? "Add Visit" : "وزٹ شامل کریں"}
      </h2>
      <form
        onSubmit={handleVisitSubmit}
        className="p-6 rounded-lg shadow-md max-w-md bg-white"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Animal ID:" : "جانور کا ID:"}
          </label>
          <input
            type="number"
            value={visitForm.animalId}
            onChange={(e) =>
              setVisitForm({
                ...visitForm,
                animalId: parseInt(e.target.value) || 0,
              })
            }
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Symptoms:" : "علامات:"}
          </label>
          <input
            type="text"
            value={visitForm.symptoms}
            onChange={(e) =>
              setVisitForm({ ...visitForm, symptoms: e.target.value })
            }
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Diagnosis:" : "تشخیص:"}
          </label>
          <input
            type="text"
            value={visitForm.diagnosis}
            onChange={(e) =>
              setVisitForm({ ...visitForm, diagnosis: e.target.value })
            }
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Treatment:" : "علاج:"}
          </label>
          <input
            type="text"
            value={visitForm.treatment}
            onChange={(e) =>
              setVisitForm({ ...visitForm, treatment: e.target.value })
            }
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Medications:" : "ادویات:"}
          </label>
          <input
            type="text"
            value={visitForm.medications}
            onChange={(e) =>
              setVisitForm({ ...visitForm, medications: e.target.value })
            }
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Notes:" : "نوٹس:"}
          </label>
          <input
            type="text"
            value={visitForm.notes}
            onChange={(e) =>
              setVisitForm({ ...visitForm, notes: e.target.value })
            }
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en" ? "Veterinarian Name:" : "ویٹرینیرین کا نام:"}
          </label>
          <input
            type="text"
            value={visitForm.veterinarianName}
            onChange={(e) =>
              setVisitForm({ ...visitForm, veterinarianName: e.target.value })
            }
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {lang === "en" ? "Add Visit" : "وزٹ شامل کریں"}
        </button>
      </form>
    </div>
  );
};

export default Records;