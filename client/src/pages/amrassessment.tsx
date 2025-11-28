import { useState, FormEvent } from "react";

const AMRAssessment = () => {
  const [healthData, setHealthData] = useState("");
  const [visitPatterns, setVisitPatterns] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [lang, setLang] = useState<"en" | "ur">("en");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simple scoring logic: Higher visits = lower score
    const visitCount = parseInt(visitPatterns) || 0;
    const healthScore = healthData.toLowerCase() === "good" ? 80 : 40;
    setScore(healthScore - visitCount * 5);
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
        {lang === "en" ? "AMR Assessment Scoring" : "ای ایم آر تشخیص سکورنگ"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg shadow-md max-w-md bg-white"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en"
              ? "Health Data (good/poor):"
              : "صحت کا ڈیٹا (اچھا/غریب):"}
          </label>
          <input
            type="text"
            value={healthData}
            onChange={(e) => setHealthData(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            {lang === "en"
              ? "Visit Patterns (number):"
              : "وزٹ کے پیٹرن (نمبر):"}
          </label>
          <input
            type="number"
            value={visitPatterns}
            onChange={(e) => setVisitPatterns(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {lang === "en" ? "Calculate Score" : "سکور کا حساب لگائیں"}
        </button>
      </form>
      {score !== null && (
        <p className="mt-4 text-sm text-gray-800">
          {lang === "en"
            ? `AMR Assessment Score: ${score}`
            : `ای ایم آر تشخیص سکور: ${score}`}
        </p>
      )}
    </div>
  );
};

export default AMRAssessment;
