import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Animal, type VisitRecord } from "@shared/schema";
import {
  TrendingDown,
  Heart,
  Shield,
  Calculator,
  AlertCircle
} from "lucide-react";

export default function Analytics({ language = "en" }: { language?: string }) {
  const t = (en: string, ur: string) => language === "en" ? en : ur;
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data using useEffect
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/animals").then(res => res.json()),
      fetch("/api/visit-records").then(res => res.json())
    ])
    .then(([animalsData, visitsData]) => {
      setAnimals(animalsData);
      setVisitRecords(visitsData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Analytics fetch error:", err);
      setLoading(false);
    });
  }, []);

  const productivityMetrics = useMemo(() => {
    if (!animals.length) return [];
    return animals
      .filter((a) => a.species === "cow" || a.species === "buffalo")
      .map((animal) => {
        const animalVisits = visitRecords.filter((v) => v.animalId === animal.id);
        const baseline = animal.species === "cow" ? 15 : 12;
        const illnessImpact = animalVisits.length * 0.8;
        const current = Math.max(0, baseline - illnessImpact);
        const lossPercent = baseline > 0 ? ((baseline - current) / baseline) * 100 : 0;

        return {
          id: animal.id,
          name: animal.name,
          species: animal.species,
          current,
          lossPercent,
          financialLoss: (baseline - current) * 120,
        };
      })
      .filter((m) => selectedSpecies === "all" || m.species === selectedSpecies);
  }, [animals, visitRecords, selectedSpecies]);

  const amrRisks = useMemo(() => {
    if (!animals.length) return [];
    return animals.map((animal) => {
      const antibiotics = visitRecords.filter(
        (v) => v.animalId === animal.id && 
        (v.treatment?.toLowerCase().includes("antibiotic") || v.treatment?.toLowerCase().includes("penicillin"))
      ).length;

      let level: "Low" | "Medium" | "High" | "Critical" = "Low";
      if (antibiotics > 4) level = "Critical";
      else if (antibiotics > 2) level = "High";
      else if (antibiotics > 0) level = "Medium";

      return { name: animal.name, count: antibiotics, level };
    }).filter(r => r.level !== "Low");
  }, [animals, visitRecords]);

  const totalFinancialLoss = productivityMetrics.reduce((sum, m) => sum + m.financialLoss, 0);

  if (loading) return <div className="p-8 text-slate-400">Loading Analytics...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-[#0f172a]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            {t("Farm Analytics", "فارم کے تجزیات")}
          </h1>
        </div>
        <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
          <SelectTrigger className="w-full md:w-48 bg-slate-900 border-slate-700 text-slate-200">
            <SelectValue placeholder="Species" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700 text-white">
            <SelectItem value="all">All Species</SelectItem>
            <SelectItem value="cow">Cows</SelectItem>
            <SelectItem value="buffalo">Buffalo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-400">Financial Loss</p>
              <p className="text-2xl font-bold text-red-500">PKR {totalFinancialLoss.toLocaleString()}</p>
            </div>
            <TrendingDown className="text-red-500 h-8 w-8" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-400">Welfare Index</p>
              <p className="text-2xl font-bold text-emerald-500">Normal</p>
            </div>
            <Heart className="text-emerald-500 h-8 w-8" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-400">AMR Status</p>
              <p className="text-2xl font-bold text-orange-500">Monitoring</p>
            </div>
            <Shield className="text-orange-500 h-8 w-8" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-400" />
              Productivity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {productivityMetrics.map((m) => (
              <div key={m.id} className="p-4 bg-slate-800/50 rounded-lg flex justify-between border border-slate-700">
                <span className="text-slate-200">{m.name}</span>
                <Badge className="bg-red-500/20 text-red-500 border-red-500/50">-{m.lossPercent.toFixed(0)}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              AMR Risk Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {amrRisks.map((r, i) => (
              <div key={i} className="p-4 bg-slate-800/50 rounded-lg flex justify-between border border-slate-700">
                <span className="text-slate-200">{r.name}</span>
                <Badge className={r.level === 'Critical' ? 'bg-red-600' : 'bg-orange-500'}>
                  {r.level} Risk
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}