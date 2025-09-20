import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/lib/translations";
import { type Animal, type VisitRecord, type Vaccination } from "@shared/schema";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, Heart, Shield, Calculator, Calendar } from "lucide-react";

interface ProductivityMetrics {
  animalId: string;
  animalName: string;
  species: string;
  baselineProductivity: number;
  currentProductivity: number;
  lossPercentage: number;
  estimatedLoss: number; // in PKR
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

export default function Analytics() {
  const { t, language } = useTranslation();
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("3months");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");

  const { data: animals } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const { data: visitRecords } = useQuery<VisitRecord[]>({
    queryKey: ["/api/visit-records"],
  });

  const { data: vaccinations } = useQuery<Vaccination[]>({
    queryKey: ["/api/vaccinations"],
  });

  // Calculate farm productivity metrics
  const productivityMetrics = useMemo((): ProductivityMetrics[] => {
    if (!animals || !visitRecords) return [];

    return animals
      .filter(animal => animal.species === "cow" || animal.species === "buffalo")
      .map(animal => {
        const animalVisits = visitRecords.filter(visit => visit.animalId === animal.id);
        const recentVisits = animalVisits.filter(visit => {
          const visitDate = new Date(visit.visitDate);
          const timeframeDays = selectedTimeframe === "1month" ? 30 : 
                               selectedTimeframe === "3months" ? 90 : 365;
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);
          return visitDate >= cutoffDate;
        });

        // Estimate baseline productivity (liters per day for dairy animals)
        const baselineDaily = animal.species === "cow" ? 15 : 12; // Average for local breeds
        const illnessDays = recentVisits.reduce((total, visit) => {
          // Estimate illness duration based on diagnosis severity
          if (visit.diagnosis?.toLowerCase().includes("mastitis")) return total + 7;
          if (visit.diagnosis?.toLowerCase().includes("fever")) return total + 3;
          if (visit.diagnosis?.toLowerCase().includes("septicaemia")) return total + 14;
          return total + 2; // Default illness duration
        }, 0);

        const productivityLoss = illnessDays > 0 ? Math.min(illnessDays * 0.3, 0.8) : 0; // 30% loss per illness day, max 80%
        const currentDaily = baselineDaily * (1 - productivityLoss);
        const lossPercentage = ((baselineDaily - currentDaily) / baselineDaily) * 100;
        
        // Estimate monetary loss (average milk price in Pakistan: PKR 120/liter)
        const milkPrice = 120;
        const estimatedLoss = (baselineDaily - currentDaily) * milkPrice * illnessDays;

        return {
          animalId: animal.id,
          animalName: animal.name,
          species: animal.species,
          baselineProductivity: baselineDaily,
          currentProductivity: currentDaily,
          lossPercentage,
          estimatedLoss,
          illnessDays
        };
      })
      .filter(metric => selectedSpecies === "all" || metric.species === selectedSpecies);
  }, [animals, visitRecords, selectedTimeframe, selectedSpecies]);

  // Calculate pet welfare scores
  const welfareScores = useMemo((): WelfareScore[] => {
    if (!animals || !visitRecords || !vaccinations) return [];

    return animals
      .filter(animal => animal.species === "dog" || animal.species === "cat")
      .map(animal => {
        const animalVisits = visitRecords.filter(visit => visit.animalId === animal.id);
        const animalVaccinations = vaccinations.filter(vacc => vacc.animalId === animal.id);
        
        let score = 100; // Start with perfect score
        
        // Deduct points for lack of recent visits
        const lastVisit = animalVisits.sort((a, b) => 
          new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
        )[0];
        
        if (!lastVisit) {
          score -= 30; // No visit history
        } else {
          const daysSinceVisit = Math.floor(
            (new Date().getTime() - new Date(lastVisit.visitDate).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysSinceVisit > 365) score -= 25;
          else if (daysSinceVisit > 180) score -= 15;
        }

        // Check vaccination status
        const rabiesVacc = animalVaccinations.find(v => v.vaccineName.includes("Rabies"));
        let vaccinationStatus: "up-to-date" | "overdue" | "none" = "none";
        
        if (rabiesVacc) {
          const daysSinceVacc = Math.floor(
            (new Date().getTime() - new Date(rabiesVacc.dateGiven).getTime()) / (1000 * 60 * 60 * 24)
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

        // Assess health trend based on recent visits
        const recentVisits = animalVisits.slice(0, 3);
        let healthTrend: "improving" | "stable" | "declining" = "stable";
        
        if (recentVisits.length >= 2) {
          const hasImprovement = recentVisits[0].diagnosis?.toLowerCase().includes("healthy") ||
                                 recentVisits[0].diagnosis?.toLowerCase().includes("recovered");
          const hadIssues = recentVisits[1].diagnosis?.toLowerCase().includes("sick") ||
                           recentVisits[1].diagnosis?.toLowerCase().includes("infection");
          
          if (hasImprovement && hadIssues) {
            healthTrend = "improving";
            score += 5;
          } else if (recentVisits.every(visit => 
            visit.diagnosis?.toLowerCase().includes("sick") ||
            visit.diagnosis?.toLowerCase().includes("infection")
          )) {
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
          healthTrend
        };
      })
      .filter(welfare => selectedSpecies === "all" || welfare.species === selectedSpecies);
  }, [animals, visitRecords, vaccinations, selectedSpecies]);

  // Calculate AMR risk assessment
  const amrRisks = useMemo((): AMRRisk[] => {
    if (!animals || !visitRecords) return [];

    return animals.map(animal => {
      const animalVisits = visitRecords.filter(visit => visit.animalId === animal.id);
      
      // Count antibiotic treatments
      const antibioticTreatments = animalVisits.filter(visit =>
        visit.treatment?.toLowerCase().includes("antibiotic") ||
        visit.treatment?.toLowerCase().includes("penicillin") ||
        visit.treatment?.toLowerCase().includes("amoxicillin") ||
        visit.medications?.toLowerCase().includes("antibiotic")
      ).length;

      // Count repeated treatments (same type within 30 days)
      const repeatedTreatments = animalVisits.reduce((count, visit, index) => {
        if (!visit.treatment?.toLowerCase().includes("antibiotic")) return count;
        
        const sameTypeWithin30Days = animalVisits.slice(index + 1).some(otherVisit => {
          const daysDiff = Math.abs(
            new Date(visit.visitDate).getTime() - new Date(otherVisit.visitDate).getTime()
          ) / (1000 * 60 * 60 * 24);
          return daysDiff <= 30 && 
                 otherVisit.treatment?.toLowerCase().includes("antibiotic");
        });
        
        return sameTypeWithin30Days ? count + 1 : count;
      }, 0);

      const lastTreatment = animalVisits
        .filter(visit => 
          visit.treatment?.toLowerCase().includes("antibiotic") ||
          visit.medications?.toLowerCase().includes("antibiotic")
        )
        .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())[0];

      // Assess risk factors
      const riskFactors: string[] = [];
      if (antibioticTreatments >= 5) riskFactors.push("Frequent antibiotic use");
      if (repeatedTreatments >= 2) riskFactors.push("Repeated treatments");
      if (animal.species === "cow" || animal.species === "buffalo") {
        if (animalVisits.some(v => v.diagnosis?.toLowerCase().includes("mastitis"))) {
          riskFactors.push("Chronic mastitis history");
        }
      }

      // Determine risk level
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
        lastTreatmentDate: lastTreatment ? new Date(lastTreatment.visitDate) : undefined,
        riskFactors
      };
    }).filter(risk => selectedSpecies === "all" || 
      animals?.find(a => a.id === risk.animalId)?.species === selectedSpecies);
  }, [animals, visitRecords, selectedSpecies]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getWelfareColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    if (score >= 40) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const totalProductivityLoss = productivityMetrics.reduce((sum, metric) => sum + metric.estimatedLoss, 0);
  const averageWelfareScore = welfareScores.length > 0 
    ? welfareScores.reduce((sum, welfare) => sum + welfare.score, 0) / welfareScores.length 
    : 0;
  const highRiskAnimals = amrRisks.filter(risk => risk.riskLevel === "high" || risk.riskLevel === "critical").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("analytics.title")}
            </h1>
            <p className="text-muted-foreground">
              {language === "ur"
                ? "فارم کی پیداوار، جانوروں کی فلاح اور AMR خطرے کا تجزیہ"
                : "Farm productivity, animal welfare, and AMR risk analysis"
              }
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-40" data-testid="timeframe-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
              <SelectTrigger className="w-40" data-testid="species-filter-select">
                <SelectValue />
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "ur" ? "کل پیداوار کا نقصان" : "Total Productivity Loss"}
                </p>
                <p className="text-2xl font-bold text-red-600">PKR {totalProductivityLoss.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "ur" ? "اس مدت میں" : "In selected period"}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "ur" ? "اوسط فلاحی اسکور" : "Average Welfare Score"}
                </p>
                <p className={`text-2xl font-bold ${averageWelfareScore >= 70 ? "text-green-600" : "text-orange-600"}`}>
                  {averageWelfareScore.toFixed(1)}/100
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "ur" ? "پالتو جانوروں کے لیے" : "For pets"}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "ur" ? "زیادہ AMR خطرہ" : "High AMR Risk"}
                </p>
                <p className="text-2xl font-bold text-orange-600">{highRiskAnimals}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "ur" ? "جانور" : "Animals"}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farm Productivity Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-primary" />
              {t("analytics.productivity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productivityMetrics.length > 0 ? (
                productivityMetrics
                  .sort((a, b) => b.estimatedLoss - a.estimatedLoss)
                  .slice(0, 5)
                  .map((metric, index) => (
                  <div key={metric.animalId} className="p-4 border rounded-lg" data-testid={`productivity-${index}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{metric.animalName}</h4>
                      <Badge variant="outline" className="capitalize">{metric.species}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          {language === "ur" ? "بنیادی پیداوار:" : "Baseline:"}
                        </span>
                        <p className="font-medium">{metric.baselineProductivity} L/day</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {language === "ur" ? "موجودہ پیداوار:" : "Current:"}
                        </span>
                        <p className="font-medium">{metric.currentProductivity.toFixed(1)} L/day</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {language === "ur" ? "نقصان:" : "Loss:"}
                        </span>
                        <p className="font-medium text-red-600">{metric.lossPercentage.toFixed(1)}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {language === "ur" ? "مالی نقصان:" : "Financial Loss:"}
                        </span>
                        <p className="font-medium text-red-600">PKR {metric.estimatedLoss.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {metric.illnessDays > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {language === "ur" 
                          ? `بیماری کے دن: ${metric.illnessDays}`
                          : `Illness days: ${metric.illnessDays}`
                        }
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {language === "ur" 
                    ? "کوئی دودھ دینے والے جانور کا ڈیٹا دستیاب نہیں"
                    : "No dairy animal data available"
                  }
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pet Welfare Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-primary" />
              {t("analytics.welfare")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {welfareScores.length > 0 ? (
                welfareScores
                  .sort((a, b) => a.score - b.score)
                  .slice(0, 8)
                  .map((welfare, index) => (
                  <div key={welfare.animalId} className="p-4 border rounded-lg" data-testid={`welfare-${index}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{welfare.animalName}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getWelfareColor(welfare.score)}>
                          {welfare.score.toFixed(0)}/100
                        </Badge>
                        <Badge variant="outline" className="capitalize">{welfare.species}</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {language === "ur" ? "آخری ملاقات:" : "Last Visit:"}
                        </span>
                        <span>
                          {welfare.lastVisit 
                            ? welfare.lastVisit.toLocaleDateString()
                            : language === "ur" ? "کوئی ریکارڈ نہیں" : "No record"
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {language === "ur" ? "ویکسینیشن:" : "Vaccination:"}
                        </span>
                        <Badge 
                          variant="outline"
                          className={
                            welfare.vaccinationStatus === "up-to-date" ? "text-green-600" :
                            welfare.vaccinationStatus === "overdue" ? "text-orange-600" : "text-red-600"
                          }
                        >
                          {welfare.vaccinationStatus === "up-to-date" && (language === "ur" ? "اپ ٹو ڈیٹ" : "Up to date")}
                          {welfare.vaccinationStatus === "overdue" && (language === "ur" ? "تاخیر" : "Overdue")}
                          {welfare.vaccinationStatus === "none" && (language === "ur" ? "کوئی نہیں" : "None")}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {language === "ur" ? "صحت کا رجحان:" : "Health Trend:"}
                        </span>
                        <span className={`text-sm font-medium ${
                          welfare.healthTrend === "improving" ? "text-green-600" :
                          welfare.healthTrend === "stable" ? "text-blue-600" : "text-red-600"
                        }`}>
                          {welfare.healthTrend === "improving" && (language === "ur" ? "بہتری" : "Improving")}
                          {welfare.healthTrend === "stable" && (language === "ur" ? "مستحکم" : "Stable")}
                          {welfare.healthTrend === "declining" && (language === "ur" ? "خراب" : "Declining")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {language === "ur" 
                    ? "کوئی پالتو جانور کا ڈیٹا دستیاب نہیں"
                    : "No pet data available"
                  }
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AMR Risk Assessment */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              {t("analytics.amr")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {amrRisks.length > 0 ? (
                amrRisks
                  .filter(risk => risk.riskLevel !== "low")
                  .sort((a, b) => {
                    const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                    return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
                  })
                  .slice(0, 6)
                  .map((risk, index) => (
                  <div key={risk.animalId} className="p-4 border rounded-lg" data-testid={`amr-risk-${index}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{risk.animalName}</h4>
                      <Badge className={getRiskColor(risk.riskLevel)}>
                        {risk.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {language === "ur" ? "اینٹی بائیوٹک کا استعمال:" : "Antibiotic Treatments:"}
                        </span>
                        <span className="font-medium">{risk.antibioticTreatments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {language === "ur" ? "دوبارہ علاج:" : "Repeated Treatments:"}
                        </span>
                        <span className="font-medium">{risk.repeatedTreatments}</span>
                      </div>
                      {risk.lastTreatmentDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {language === "ur" ? "آخری علاج:" : "Last Treatment:"}
                          </span>
                          <span>{risk.lastTreatmentDate.toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {risk.riskFactors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">
                            {language === "ur" ? "خطرے کے عوامل:" : "Risk Factors:"}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {risk.riskFactors.map((factor, factorIndex) => (
                              <Badge key={factorIndex} variant="outline" className="text-xs">
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
                <div className="col-span-2">
                  <p className="text-muted-foreground text-center py-8">
                    {language === "ur" 
                      ? "کوئی AMR خطرے کا ڈیٹا دستیاب نہیں"
                      : "No AMR risk data available"
                    }
                  </p>
                </div>
              )}
            </div>
            
            {amrRisks.filter(risk => risk.riskLevel !== "low").length > 6 && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" data-testid="view-more-amr">
                  {language === "ur" ? "مزید دیکھیں" : "View More"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            {language === "ur" ? "سفارشات" : "Recommendations"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {totalProductivityLoss > 10000 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">
                  {language === "ur" ? "پیداوار میں بہتری" : "Productivity Improvement"}
                </h4>
                <p className="text-sm text-red-700">
                  {language === "ur" 
                    ? "ماسٹائٹس کی روک تھام پر توجہ دیں اور حفظان صحت بہتر بنائیں"
                    : "Focus on mastitis prevention and improve hygiene protocols"
                  }
                </p>
              </div>
            )}
            
            {averageWelfareScore < 70 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">
                  {language === "ur" ? "فلاحی بہتری" : "Welfare Improvement"}
                </h4>
                <p className="text-sm text-orange-700">
                  {language === "ur" 
                    ? "باقاعدہ ویکسینیشن اور چیک اپ کا شیڈول بنائیں"
                    : "Schedule regular vaccinations and health checkups"
                  }
                </p>
              </div>
            )}
            
            {highRiskAnimals > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">
                  {language === "ur" ? "AMR کا انتظام" : "AMR Management"}
                </h4>
                <p className="text-sm text-yellow-700">
                  {language === "ur" 
                    ? "اینٹی بائیوٹک کا محتاط استعمال اور کلچر ٹیسٹ کروائیں"
                    : "Practice prudent antibiotic use and conduct culture tests"
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
