import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "@/lib/translations";
import { diseases, diagnoseSymptoms, getCommonSymptoms, type Disease } from "@/lib/disease-knowledge";
import { Stethoscope, AlertTriangle, Info, Thermometer } from "lucide-react";

export default function SymptomChecker() {
  const { t, language } = useTranslation();
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [diagnosisResults, setDiagnosisResults] = useState<Disease[]>([]);
  const [showResults, setShowResults] = useState(false);

  const speciesOptions = [
    { value: "cow", label: "Cow", labelUrdu: "گائے" },
    { value: "buffalo", label: "Buffalo", labelUrdu: "بھینس" },
    { value: "goat", label: "Goat", labelUrdu: "بکری" },
    { value: "dog", label: "Dog", labelUrdu: "کتا" },
    { value: "cat", label: "Cat", labelUrdu: "بلی" },
  ];

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    }
  };

  const handleDiagnosis = () => {
    if (!selectedSpecies || selectedSymptoms.length === 0) return;
    
    const results = diagnoseSymptoms(selectedSpecies, selectedSymptoms);
    setDiagnosisResults(results);
    setShowResults(true);
  };

  const resetChecker = () => {
    setSelectedSpecies("");
    setSelectedSymptoms([]);
    setDiagnosisResults([]);
    setShowResults(false);
  };

  const availableSymptoms = selectedSpecies ? getCommonSymptoms(selectedSpecies) : [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("symptomChecker.title")}
        </h1>
        <p className="text-muted-foreground">
          {language === "ur" 
            ? "علامات کی بنیاد پر ممکنہ بیماریوں کی تشخیص کریں - یہ پیشہ ورانہ ویٹرنری مشورے کا متبادل نہیں"
            : "Identify potential diseases based on symptoms - This is not a substitute for professional veterinary advice"
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-primary" />
                {t("symptomChecker.selectSpecies")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                <SelectTrigger data-testid="species-select">
                  <SelectValue placeholder="Select animal species" />
                </SelectTrigger>
                <SelectContent>
                  {speciesOptions.map(species => (
                    <SelectItem key={species.value} value={species.value}>
                      {language === "ur" ? species.labelUrdu : species.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedSpecies && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-2 text-primary" />
                  {t("symptomChecker.symptoms")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableSymptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`symptom-${index}`}
                        checked={selectedSymptoms.includes(symptom)}
                        onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                        data-testid={`symptom-${index}`}
                      />
                      <label
                        htmlFor={`symptom-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {symptom}
                      </label>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex gap-3">
                  <Button
                    onClick={handleDiagnosis}
                    disabled={!selectedSpecies || selectedSymptoms.length === 0}
                    className="gradient-bg text-white"
                    data-testid="diagnose-button"
                  >
                    Diagnose Symptoms
                  </Button>
                  <Button variant="outline" onClick={resetChecker} data-testid="reset-button">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {showResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                  {t("symptomChecker.diagnosis")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {diagnosisResults.length > 0 ? (
                  <div className="space-y-4">
                    {diagnosisResults.map((disease, index) => (
                      <div
                        key={disease.id}
                        className={`p-4 border rounded-lg ${getSeverityColor(disease.severity)}`}
                        data-testid={`diagnosis-${index}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">
                              {language === "ur" ? disease.nameUrdu : disease.name}
                            </h3>
                            {language !== "ur" && (
                              <p className="text-sm opacity-75 urdu-text">{disease.nameUrdu}</p>
                            )}
                          </div>
                          <Badge variant="outline" className={getSeverityColor(disease.severity)}>
                            {disease.severity.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div>
                            <h4 className="font-medium mb-1">
                              {language === "ur" ? "علاج کی سفارشات:" : "Treatment Recommendations:"}
                            </h4>
                            <p>{language === "ur" ? disease.treatmentUrdu : disease.treatment}</p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1">
                              {language === "ur" ? "بچاؤ:" : "Prevention:"}
                            </h4>
                            <p>{language === "ur" ? disease.preventionUrdu : disease.prevention}</p>
                          </div>
                        </div>

                        {disease.severity === "critical" && (
                          <Alert className="mt-3 border-red-300 bg-red-50">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-red-800">
                              {language === "ur"
                                ? "یہ ایک سنگین حالت ہے۔ فوری طور پر ویٹرنریرین سے رابطہ کریں!"
                                : "This is a critical condition. Contact a veterinarian immediately!"
                              }
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {language === "ur"
                        ? "منتخب کردہ علامات کی بنیاد پر کوئی تشخیص نہیں ملی"
                        : "No diagnosis found based on selected symptoms"
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Information Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {language === "ur" ? "اہم معلومات" : "Important Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {language === "ur"
                      ? "یہ ٹول صرف ابتدائی تشخیص کے لیے ہے۔ ہمیشہ پیشہ ور ویٹرنریرین سے مشورہ کریں۔"
                      : "This tool is for preliminary diagnosis only. Always consult a professional veterinarian."
                    }
                  </AlertDescription>
                </Alert>

                <div>
                  <h4 className="font-medium mb-2">
                    {language === "ur" ? "فوری ویٹرنری کیئر کب لیں:" : "When to Seek Immediate Veterinary Care:"}
                  </h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• {language === "ur" ? "تیز بخار (104°F+)" : "High fever (104°F+)"}</li>
                    <li>• {language === "ur" ? "سانس لینے میں دشواری" : "Difficulty breathing"}</li>
                    <li>• {language === "ur" ? "کھانا پینا بند" : "Not eating or drinking"}</li>
                    <li>• {language === "ur" ? "خون بہنا" : "Bleeding"}</li>
                    <li>• {language === "ur" ? "دورے پڑنا" : "Seizures"}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {language === "ur" ? "مشہور بیماریاں - پاکستان" : "Common Diseases - Pakistan"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {diseases.slice(0, 5).map(disease => (
                  <div key={disease.id} className="flex items-center justify-between p-2 border rounded text-sm">
                    <span className="font-medium">
                      {language === "ur" ? disease.nameUrdu : disease.name}
                    </span>
                    <Badge variant="outline" className={getSeverityColor(disease.severity)}>
                      {disease.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
