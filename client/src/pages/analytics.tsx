import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useTranslation } from "../lib/translations";
import { Animal, VisitRecord, Vaccination } from "../../shared/schema";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Heart,
  Shield,
  Calculator,
  Calendar,
} from "lucide-react";

interface ProductivityMetrics {
  animalId: string;
  animalName: string;
  species: string;
  baselineProductivity: number;
  currentProductivity: number;
  lossPercentage: number;
  estimatedLoss: number;
  illnessDays: number;
}

interface WelfareScore {
  animalId: string;
  animalName: string;
  species: string;
  score: number;
  lastVisit?: Date;
  vaccinationStatus: "up-to-date" | "overdue" | "none";
  healthTrend: "improving" | "stable" | "declining";
}

interface AMRRisk {
  animalId: string;
  animalName: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  antibioticTreatments: number;
  repeatedTreatments: number;
  lastTreatmentDate?: Date;
  riskFactors: string[];
}

export default function Analytics({ language = "en" }: { language?: string }) {
  const { t } = useTranslation();
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("3months");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");

  const { data: animals = [] } = useQuery<Animal[]>({
    queryKey: ["http://localhost:5001/api/animals"],
    retry: false,
  });

  const { data: visitRecords = [] } = useQuery<VisitRecord[]>({
    queryKey: ["http://localhost:5001/api/visit-records"],
    retry: false,
  });

  const { data: vaccinations = [] } = useQuery<Vaccination[]>({
    queryKey: ["http://localhost:5001/api/vaccinations"],
    retry: false,
  });

  const productivityMetrics = useMemo((): ProductivityMetrics[] => {
    return animals
      .filter(
        (animal) => animal.species === "cow" || animal.species === "buffalo",
      )
      .map((animal) => {
        const animalVisits = visitRecords.filter(
          (visit) => visit.animalId === animal.id,
        );
        const recentVisits = animalVisits.filter((visit) => {
          const visitDate = new Date(visit.visitDate);
          const timeframeDays =
            selectedTimeframe === "1month"
              ? 30
              : selectedTimeframe === "3months"
                ? 90
                : 365;
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);
          return visitDate >= cutoffDate;
        });

        const baselineDaily = animal.species === "cow" ? 15 : 12;
        const illnessDays = recentVisits.reduce((total, visit) => {
          if (visit.diagnosis?.toLowerCase().includes("mastitis"))
            return total + 7;
          if (visit.diagnosis?.toLowerCase().includes("fever"))
            return total + 3;
          if (visit.diagnosis?.toLowerCase().includes("septicaemia"))
            return total + 14;
          return total + 2;
        }, 0);

        const productivityLoss =
          illnessDays > 0 ? Math.min(illnessDays * 0.3, 0.8) : 0;
        const currentDaily = baselineDaily * (1 - productivityLoss);
        const lossPercentage =
          ((baselineDaily - currentDaily) / baselineDaily) * 100;
        const estimatedLoss =
          (baselineDaily - currentDaily) * 120 * illnessDays;

        return {
          animalId: animal.id,
          animalName: animal.name,
          species: animal.species,
          baselineProductivity: baselineDaily,
          currentProductivity: currentDaily,
          lossPercentage,
          estimatedLoss,
          illnessDays,
        };
      })
      .filter(
        (metric) =>
          selectedSpecies === "all" || metric.species === selectedSpecies,
      );
  }, [animals, visitRecords, selectedTimeframe, selectedSpecies]);

  const welfareScores = useMemo((): WelfareScore[] => {
    return animals
      .filter((animal) => animal.species === "dog" || animal.species === "cat")
      .map((animal) => {
        const animalVisits = visitRecords.filter(
          (visit) => visit.animalId === animal.id,
        );
        const animalVaccinations = vaccinations.filter(
          (vacc) => vacc.animalId === animal.id,
        );

        let score = 100;
        const lastVisit = animalVisits.sort(
          (a, b) =>
            new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime(),
        )[0];

        if (!lastVisit) {
          score -= 30;
        } else {
          const daysSinceVisit = Math.floor(
            (new Date().getTime() - new Date(lastVisit.visitDate).getTime()) /
              (1000 * 60 * 60 * 24),
          );
          if (daysSinceVisit > 365) score -= 25;
          else if (daysSinceVisit > 180) score -= 15;
        }

        const rabiesVacc = animalVaccinations.find((v) =>
          v.vaccineName.includes("Rabies"),
        );
        let vaccinationStatus: "up-to-date" | "overdue" | "none" = "none";

        if (rabiesVacc) {
          const daysSinceVacc = Math.floor(
            (new Date().getTime() - new Date(rabiesVacc.dateGiven).getTime()) /
              (1000 * 60 * 60 * 24),
          );
          if (daysSinceVacc <= 365) {
            vaccinationStatus = "up-to-date";
          } else {
            vaccinationStatus = "overdue";
            score -= 20;
          }
        } else {
          score -= 30;
        }

        const recentVisits = animalVisits.slice(0, 3);
        let healthTrend: "improving" | "stable" | "declining" = "stable";

        if (recentVisits.length >= 2) {
          const hasImprovement =
            recentVisits[0].diagnosis?.toLowerCase().includes("healthy") ||
            recentVisits[0].diagnosis?.toLowerCase().includes("recovered");
          const hadIssues =
            recentVisits[1].diagnosis?.toLowerCase().includes("sick") ||
            recentVisits[1].diagnosis?.toLowerCase().includes("infection");

          if (hasImprovement && hadIssues) {
            healthTrend = "improving";
            score += 5;
          } else if (
            recentVisits.every(
              (visit) =>
                visit.diagnosis?.toLowerCase().includes("sick") ||
                visit.diagnosis?.toLowerCase().includes("infection"),
            )
          ) {
            healthTrend = "declining";
            score -= 15;
          }
        }

        return {
          animalId: animal.id,
          animalName: animal.name,
          species: animal.species,
          score: Math.max(0, Math.min(100, score)),
          lastVisit: lastVisit ? new Date(lastVisit.visitDate) : undefined,
          vaccinationStatus,
          healthTrend,
        };
      })
      .filter(
        (welfare) =>
          selectedSpecies === "all" || welfare.species === selectedSpecies,
      );
  }, [animals, visitRecords, vaccinations, selectedSpecies]);

  const amrRisks = useMemo((): AMRRisk[] => {
    return animals
      .map((animal) => {
        const animalVisits = visitRecords.filter(
          (visit) => visit.animalId === animal.id,
        );

        const antibioticTreatments = animalVisits.filter(
          (visit) =>
            visit.treatment?.toLowerCase().includes("antibiotic") ||
            visit.treatment?.toLowerCase().includes("penicillin") ||
            visit.treatment?.toLowerCase().includes("amoxicillin") ||
            visit.medications?.toLowerCase().includes("antibiotic"),
        ).length;

        const repeatedTreatments = animalVisits.reduce(
          (count, visit, index) => {
            if (!visit.treatment?.toLowerCase().includes("antibiotic"))
              return count;

            const sameTypeWithin30Days = animalVisits
              .slice(index + 1)
              .some((otherVisit) => {
                const daysDiff =
                  Math.abs(
                    new Date(visit.visitDate).getTime() -
                      new Date(otherVisit.visitDate).getTime(),
                  ) /
                  (1000 * 60 * 60 * 24);
                return (
                  daysDiff <= 30 &&
                  otherVisit.treatment?.toLowerCase().includes("antibiotic")
                );
              });

            return sameTypeWithin30Days ? count + 1 : count;
          },
          0,
        );

        const lastTreatment = animalVisits
          .filter(
            (visit) =>
              visit.treatment?.toLowerCase().includes("antibiotic") ||
              visit.medications?.toLowerCase().includes("antibiotic"),
          )
          .sort(
            (a, b) =>
              new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime(),
          )[0];

        const riskFactors: string[] = [];
        if (antibioticTreatments >= 5)
          riskFactors.push("Frequent antibiotic use");
        if (repeatedTreatments >= 2) riskFactors.push("Repeated treatments");
        if (animal.species === "cow" || animal.species === "buffalo") {
          if (
            animalVisits.some((v) =>
              v.diagnosis?.toLowerCase().includes("mastitis"),
            )
          ) {
            riskFactors.push("Chronic mastitis history");
          }
        }

        let riskLevel: "low" | "medium" | "high" | "critical" = "low";
        if (antibioticTreatments >= 8 || repeatedTreatments >= 3) {
          riskLevel = "critical";
        } else if (antibioticTreatments >= 5 || repeatedTreatments >= 2) {
          riskLevel = "high";
        } else if (antibioticTreatments >= 3 || repeatedTreatments >= 1) {
          riskLevel = "medium";
        }

        return {
          animalId: animal.id,
          animalName: animal.name,
          riskLevel,
          antibioticTreatments,
          repeatedTreatments,
          lastTreatmentDate: lastTreatment
            ? new Date(lastTreatment.visitDate)
            : undefined,
          riskFactors,
        };
      })
      .filter(
        (risk) =>
          selectedSpecies === "all" ||
          animals.find((a) => a.id === risk.animalId)?.species ===
            selectedSpecies,
      );
  }, [animals, visitRecords, selectedSpecies]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return { color: "#dc2626", backgroundColor: "#fef2f2", borderColor: "#fecaca" };
      case "high":
        return { color: "#ea580c", backgroundColor: "#fff7ed", borderColor: "#fed7aa" };
      case "medium":
        return { color: "#ca8a04", backgroundColor: "#fefce8", borderColor: "#fef08a" };
      case "low":
        return { color: "#16a34a", backgroundColor: "#f0fdf4", borderColor: "#dcfce7" };
      default:
        return { color: "#4b5563", backgroundColor: "#f9fafb", borderColor: "#e5e7eb" };
    }
  };

  const getWelfareColor = (score: number) => {
    if (score >= 80) return { color: "#16a34a", backgroundColor: "#f0fdf4" };
    if (score >= 60) return { color: "#ca8a04", backgroundColor: "#fefce8" };
    if (score >= 40) return { color: "#ea580c", backgroundColor: "#fff7ed" };
    return { color: "#dc2626", backgroundColor: "#fef2f2" };
  };

  const totalProductivityLoss = productivityMetrics.reduce(
    (sum, metric) => sum + metric.estimatedLoss,
    0,
  );
  const averageWelfareScore =
    welfareScores.length > 0
      ? welfareScores.reduce((sum, welfare) => sum + welfare.score, 0) /
        welfareScores.length
      : 0;
  const highRiskAnimals = amrRisks.filter(
    (risk) => risk.riskLevel === "high" || risk.riskLevel === "critical",
  ).length;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#1f2937", marginBottom: "8px" }}>
              {t("analytics.title") || "Analytics Dashboard"}
            </h1>
            <p style={{ color: "#4b5563" }}>
              {language === "ur"
                ? "فارم کی پیداوار، جانوروں کی فلاح اور AMR خطرے کا تجزیہ"
                : "Farm productivity, animal welfare, and AMR risk analysis"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <Select
              value={selectedTimeframe}
              onValueChange={setSelectedTimeframe}
            >
              <SelectTrigger style={{ width: "160px" }} data-testid="timeframe-select">
                <SelectValue placeholder="Select Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
              <SelectTrigger
                style={{ width: "160px" }}
                data-testid="species-filter-select"
              >
                <SelectValue placeholder="Select Species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Species</SelectItem>
                <SelectItem value="cow">Cows</SelectItem>
                <SelectItem value="buffalo">Buffalo</SelectItem>
                <SelectItem value="goat">Goats</SelectItem>
                <SelectItem value="dog">Dogs</SelectItem>
                <SelectItem value="cat">Cats</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        <Card>
          <CardContent style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "14px", color: "#4b5563" }}>
                  {language === "ur"
                    ? "کل پیداوار کا نقصان"
                    : "Total Productivity Loss"}
                </p>
                <p style={{ fontSize: "24px", fontWeight: "bold", color: "#dc2626" }}>
                  PKR {totalProductivityLoss.toLocaleString()}
                </p>
                <p style={{ fontSize: "12px", color: "#4b5563", marginTop: "4px" }}>
                  {language === "ur" ? "اس مدت میں" : "In selected period"}
                </p>
              </div>
              <div style={{ backgroundColor: "#fef2f2", padding: "12px", borderRadius: "8px" }}>
                <TrendingDown style={{ height: "24px", width: "24px", color: "#dc2626" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "14px", color: "#4b5563" }}>
                  {language === "ur"
                    ? "اوسط فلاحی اسکور"
                    : "Average Welfare Score"}
                </p>
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: averageWelfareScore >= 70 ? "#16a34a" : "#ea580c",
                  }}
                >
                  {averageWelfareScore.toFixed(1)}/100
                </p>
                <p style={{ fontSize: "12px", color: "#4b5563", marginTop: "4px" }}>
                  {language === "ur" ? "پالتو جانوروں کے لیے" : "For pets"}
                </p>
              </div>
              <div style={{ backgroundColor: "#eff6ff", padding: "12px", borderRadius: "8px" }}>
                <Heart style={{ height: "24px", width: "24px", color: "#2563eb" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "14px", color: "#4b5563" }}>
                  {language === "ur" ? "زیادہ AMR خطرہ" : "High AMR Risk"}
                </p>
                <p style={{ fontSize: "24px", fontWeight: "bold", color: "#ea580c" }}>
                  {highRiskAnimals}
                </p>
                <p style={{ fontSize: "12px", color: "#4b5563", marginTop: "4px" }}>
                  {language === "ur" ? "جانور" : "Animals"}
                </p>
              </div>
              <div style={{ backgroundColor: "#fff7ed", padding: "12px", borderRadius: "8px" }}>
                <Shield style={{ height: "24px", width: "24px", color: "#ea580c" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
        <Card>
          <CardHeader>
            <CardTitle style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Calculator style={{ height: "20px", width: "20px", color: "#2563eb" }} />
              {t("analytics.productivity") || "Productivity Analysis"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {productivityMetrics.length > 0 ? (
                productivityMetrics
                  .sort((a, b) => b.estimatedLoss - a.estimatedLoss)
                  .slice(0, 5)
                  .map((metric, index) => (
                    <div
                      key={metric.animalId}
                      style={{ padding: "16px", border: "1px solid #334155", borderRadius: "8px", backgroundColor: "#1e293b" }}
                      data-testid={`productivity-${index}`}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <h4 style={{ fontWeight: "500", color: "#1f2937" }}>
                          {metric.animalName}
                        </h4>
                        <Badge style={{ textTransform: "capitalize", color: "#4b5563" }}>
                          {metric.species}
                        </Badge>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", fontSize: "14px" }}>
                        <div>
                          <span style={{ color: "#4b5563" }}>
                            {language === "ur"
                              ? "بنیادی پیداوار:"
                              : "Baseline:"}
                          </span>
                          <p style={{ fontWeight: "500", color: "#f1f5f9" }}>
                            {metric.baselineProductivity} L/day
                          </p>
                        </div>
                        <div>
                          <span style={{ color: "#4b5563" }}>
                            {language === "ur" ? "موجودہ پیداوار:" : "Current:"}
                          </span>
                          <p style={{ fontWeight: "500", color: "#f1f5f9" }}>
                            {metric.currentProductivity.toFixed(1)} L/day
                          </p>
                        </div>
                        <div>
                          <span style={{ color: "#4b5563" }}>
                            {language === "ur" ? "نقصان:" : "Loss:"}
                          </span>
                          <p style={{ fontWeight: "500", color: "#dc2626" }}>
                            {metric.lossPercentage.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <span style={{ color: "#4b5563" }}>
                            {language === "ur"
                              ? "مالی نقصان:"
                              : "Financial Loss:"}
                          </span>
                          <p style={{ fontWeight: "500", color: "#dc2626" }}>
                            PKR {metric.estimatedLoss.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {metric.illnessDays > 0 && (
                        <p style={{ fontSize: "12px", color: "#4b5563", marginTop: "8px" }}>
                          {language === "ur"
                            ? `بیماری کے دن: ${metric.illnessDays}`
                            : `Illness days: ${metric.illnessDays}`}
                        </p>
                      )}
                    </div>
                  ))
              ) : (
                <p style={{ color: "#4b5563", textAlign: "center", padding: "32px 0" }}>
                  {language === "ur"
                    ? "کوئی دودھ دینے والے جانور کا ڈیٹا دستیاب نہیں"
                    : "No dairy animal data available"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Heart style={{ height: "20px", width: "20px", color: "#2563eb" }} />
              {t("analytics.welfare") || "Welfare Scores"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {welfareScores.length > 0 ? (
                welfareScores
                  .sort((a, b) => a.score - b.score)
                  .slice(0, 8)
                  .map((welfare, index) => (
                    <div
                      key={welfare.animalId}
                      style={{ padding: "16px", border: "1px solid #334155", borderRadius: "8px", backgroundColor: "#1e293b" }}
                      data-testid={`welfare-${index}`}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <h4 style={{ fontWeight: "500", color: "#1f2937" }}>
                          {welfare.animalName}
                        </h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Badge style={getWelfareColor(welfare.score)}>
                            {welfare.score.toFixed(0)}/100
                          </Badge>
                          <Badge style={{ textTransform: "capitalize", color: "#4b5563" }}>
                            {welfare.species}
                          </Badge>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#4b5563" }}>
                            {language === "ur" ? "آخری ملاقات:" : "Last Visit:"}
                          </span>
                          <span>
                            {welfare.lastVisit
                              ? welfare.lastVisit.toLocaleDateString()
                              : language === "ur"
                                ? "کوئی ریکارڈ نہیں"
                                : "No record"}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#4b5563" }}>
                            {language === "ur" ? "ویکسینیشن:" : "Vaccination:"}
                          </span>
                          <Badge style={{
                            color: welfare.vaccinationStatus === "up-to-date" ? "#16a34a" : welfare.vaccinationStatus === "overdue" ? "#ea580c" : "#dc2626"
                          }}>
                            {welfare.vaccinationStatus === "up-to-date" &&
                              (language === "ur" ? "اپ ٹو ڈیٹ" : "Up to date")}
                            {welfare.vaccinationStatus === "overdue" &&
                              (language === "ur" ? "تاخیر" : "Overdue")}
                            {welfare.vaccinationStatus === "none" &&
                              (language === "ur" ? "کوئی نہیں" : "None")}
                          </Badge>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#4b5563" }}>
                            {language === "ur"
                              ? "صحت کا رجحان:"
                              : "Health Trend:"}
                          </span>
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: welfare.healthTrend === "improving" ? "#16a34a" : welfare.healthTrend === "stable" ? "#2563eb" : "#dc2626"
                            }}
                          >
                            {welfare.healthTrend === "improving" &&
                              (language === "ur" ? "بہتری" : "Improving")}
                            {welfare.healthTrend === "stable" &&
                              (language === "ur" ? "مستحکم" : "Stable")}
                            {welfare.healthTrend === "declining" &&
                              (language === "ur" ? "خراب" : "Declining")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p style={{ color: "#4b5563", textAlign: "center", padding: "32px 0" }}>
                  {language === "ur"
                    ? "کوئی پالتو جانور کا ڈیٹا دستیاب نہیں"
                    : "No pet data available"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card style={{ gridColumn: "span 2" }}>
          <CardHeader>
            <CardTitle style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Shield style={{ height: "20px", width: "20px", color: "#2563eb" }} />
              {t("analytics.amr") || "AMR Risk Assessment"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
              {amrRisks.length > 0 ? (
                amrRisks
                  .filter((risk) => risk.riskLevel !== "low")
                  .sort((a, b) => {
                    const riskOrder = {
                      critical: 4,
                      high: 3,
                      medium: 2,
                      low: 1,
                    };
                    return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
                  })
                  .slice(0, 6)
                  .map((risk, index) => (
                    <div
                      key={risk.animalId}
                      style={{ padding: "16px", border: "1px solid #334155", borderRadius: "8px", backgroundColor: "#1e293b" }}
                      data-testid={`amr-risk-${index}`}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <h4 style={{ fontWeight: "500", color: "#1f2937" }}>
                          {risk.animalName}
                        </h4>
                        <Badge style={{
                          ...getRiskColor(risk.riskLevel),
                          border: `1px solid ${getRiskColor(risk.riskLevel).borderColor}`
                        }}>
                          {risk.riskLevel.toUpperCase()}
                        </Badge>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#4b5563" }}>
                            {language === "ur"
                              ? "اینٹی بائیوٹک کا استعمال:"
                              : "Antibiotic Treatments:"}
                          </span>
                          <span style={{ fontWeight: "500", color: "#1f2937" }}>
                            {risk.antibioticTreatments}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#4b5563" }}>
                            {language === "ur"
                              ? "دوبارہ علاج:"
                              : "Repeated Treatments:"}
                          </span>
                          <span style={{ fontWeight: "500", color: "#1f2937" }}>
                            {risk.repeatedTreatments}
                          </span>
                        </div>
                        {risk.lastTreatmentDate && (
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#4b5563" }}>
                              {language === "ur"
                                ? "آخری علاج:"
                                : "Last Treatment:"}
                            </span>
                            <span>
                              {risk.lastTreatmentDate.toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {risk.riskFactors.length > 0 && (
                          <div style={{ marginTop: "8px" }}>
                            <p style={{ fontSize: "12px", color: "#4b5563", marginBottom: "4px" }}>
                              {language === "ur"
                                ? "خطرے کے عوامل:"
                                : "Risk Factors:"}
                            </p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                              {risk.riskFactors.map((factor, factorIndex) => (
                                <Badge
                                  key={factorIndex}
                                  style={{ fontSize: "12px", color: "#4b5563" }}
                                >
                                  {factor}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div style={{ gridColumn: "span 2" }}>
                  <p style={{ color: "#4b5563", textAlign: "center", padding: "32px 0" }}>
                    {language === "ur"
                      ? "کوئی AMR خطرے کا ڈیٹا دستیاب نہیں"
                      : "No AMR risk data available"}
                  </p>
                </div>
              )}
            </div>

            {amrRisks.filter((risk) => risk.riskLevel !== "low").length > 6 && (
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <Button variant="outline" size="sm" data-testid="view-more-amr">
                  {language === "ur" ? "مزید دیکھیں" : "View More"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card style={{ marginTop: "24px" }}>
        <CardHeader>
          <CardTitle style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingUp style={{ height: "20px", width: "20px", color: "#2563eb" }} />
            {language === "ur" ? "سفارشات" : "Recommendations"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            {totalProductivityLoss > 10000 && (
              <div style={{ padding: "16px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px" }}>
                <h4 style={{ fontWeight: "500", color: "#991b1b", marginBottom: "8px" }}>
                  {language === "ur"
                    ? "پیداوار میں بہتری"
                    : "Productivity Improvement"}
                </h4>
                <p style={{ fontSize: "14px", color: "#b91c1c" }}>
                  {language === "ur"
                    ? "ماسٹائٹس کی روک تھام پر توجہ دیں اور حفظان صحت بہتر بنائیں"
                    : "Focus on mastitis prevention and improve hygiene protocols"}
                </p>
              </div>
            )}

            {averageWelfareScore < 70 && (
              <div style={{ padding: "16px", backgroundColor: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px" }}>
                <h4 style={{ fontWeight: "500", color: "#92400e", marginBottom: "8px" }}>
                  {language === "ur" ? "فلاحی بہتری" : "Welfare Improvement"}
                </h4>
                <p style={{ fontSize: "14px", color: "#b45309" }}>
                  {language === "ur"
                    ? "باقاعدہ ویکسینیشن اور چیک اپ کا شیڈول بنائیں"
                    : "Schedule regular vaccinations and health checkups"}
                </p>
              </div>
            )}

            {highRiskAnimals > 0 && (
              <div style={{ padding: "16px", backgroundColor: "#fefce8", border: "1px solid #fef08a", borderRadius: "8px" }}>
                <h4 style={{ fontWeight: "500", color: "#713f12", marginBottom: "8px" }}>
                  {language === "ur" ? "AMR کا انتظام" : "AMR Management"}
                </h4>
                <p style={{ fontSize: "14px", color: "#854d0e" }}>
                  {language === "ur"
                    ? "اینٹی بائیوٹک کا محتاط استعمال اور کلچر ٹیسٹ کروائیں"
                    : "Practice prudent antibiotic use and conduct culture tests"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
