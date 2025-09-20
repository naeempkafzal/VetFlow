import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/translations";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertOutbreakSchema, type Outbreak } from "@shared/schema";
import { diseases } from "@/lib/disease-knowledge";
import { AlertTriangle, Plus, MapPin, Users, Calendar, Info, Shield } from "lucide-react";
import { z } from "zod";

const extendedOutbreakSchema = insertOutbreakSchema.extend({
  affectedAnimals: z.number().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const provinces = [
  "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Gilgit-Baltistan", "Azad Kashmir"
];

const severityLevels = [
  { value: "low", label: "Low", labelUrdu: "کم", color: "text-green-600 bg-green-50" },
  { value: "medium", label: "Medium", labelUrdu: "درمیانہ", color: "text-yellow-600 bg-yellow-50" },
  { value: "high", label: "High", labelUrdu: "زیادہ", color: "text-orange-600 bg-orange-50" },
  { value: "critical", label: "Critical", labelUrdu: "انتہائی", color: "text-red-600 bg-red-50" },
];

const biosafetyProtocols = {
  "Punjab": {
    "high": "Immediately isolate affected animals. Report to District Livestock Officer. Implement 5km quarantine zone. Disinfect all equipment and vehicles.",
    "critical": "Emergency response: Contact Punjab Livestock Department immediately. Establish 10km containment zone. Restrict all animal movement. Begin vaccination campaign."
  },
  "Sindh": {
    "high": "Notify Sindh Livestock Department. Quarantine affected areas. Test all animals within 3km radius. Implement biosecurity measures.",
    "critical": "Emergency protocol: Contact Chief Veterinary Officer Sindh. Mass quarantine. Stop all animal trading in affected district."
  },
  "default": {
    "high": "Isolate affected animals. Report to provincial livestock authorities. Implement quarantine measures. Monitor surrounding farms.",
    "critical": "Emergency response required. Contact provincial veterinary services immediately. Establish containment zones. Restrict animal movement."
  }
};

export default function Outbreaks() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [showReportOutbreak, setShowReportOutbreak] = useState(false);
  const [selectedOutbreak, setSelectedOutbreak] = useState<Outbreak | null>(null);

  const { data: outbreaks, isLoading } = useQuery<Outbreak[]>({
    queryKey: ["/api/outbreaks"],
  });

  const { data: activeOutbreaks } = useQuery<Outbreak[]>({
    queryKey: ["/api/outbreaks/active"],
  });

  const reportOutbreakMutation = useMutation({
    mutationFn: (data: z.infer<typeof extendedOutbreakSchema>) =>
      apiRequest("POST", "/api/outbreaks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/outbreaks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/outbreaks/active"] });
      toast({ title: "Outbreak reported successfully" });
      setShowReportOutbreak(false);
      form.reset();
    },
  });

  const updateOutbreakMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Outbreak> }) =>
      apiRequest("PUT", `/api/outbreaks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/outbreaks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/outbreaks/active"] });
      toast({ title: "Outbreak status updated" });
    },
  });

  const form = useForm<z.infer<typeof extendedOutbreakSchema>>({
    resolver: zodResolver(extendedOutbreakSchema),
    defaultValues: {
      diseaseName: "",
      diseaseNameUrdu: "",
      location: "",
      province: "",
      affectedAnimals: 1,
      species: "",
      reportedBy: "",
      severity: "medium",
    },
  });

  const getSeverityColor = (severity: string) => {
    return severityLevels.find(level => level.value === severity)?.color || "text-gray-600 bg-gray-50";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-red-600 bg-red-50 border-red-200";
      case "contained": return "text-orange-600 bg-orange-50 border-orange-200";
      case "resolved": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getBiosafetyAdvice = (province: string, severity: string) => {
    const provinceProtocols = biosafetyProtocols[province as keyof typeof biosafetyProtocols] || biosafetyProtocols.default;
    return provinceProtocols[severity as keyof typeof provinceProtocols] || provinceProtocols.high;
  };

  const onSubmit = (data: z.infer<typeof extendedOutbreakSchema>) => {
    const selectedDisease = diseases.find(d => d.name === data.diseaseName);
    const outbreakData = {
      ...data,
      diseaseNameUrdu: selectedDisease?.nameUrdu || data.diseaseNameUrdu,
      biosafetyMeasures: getBiosafetyAdvice(data.province, data.severity),
    };
    reportOutbreakMutation.mutate(outbreakData);
  };

  const updateOutbreakStatus = (outbreak: Outbreak, newStatus: string) => {
    updateOutbreakMutation.mutate({
      id: outbreak.id,
      data: { status: newStatus }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const criticalOutbreaks = activeOutbreaks?.filter(outbreak => outbreak.severity === "critical") || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("outbreaks.title")}
            </h1>
            <p className="text-muted-foreground">
              {language === "ur"
                ? "بیماری کی وبا کی رپورٹنگ اور نگرانی کریں"
                : "Report and monitor disease outbreaks"
              }
            </p>
          </div>
          <Dialog open={showReportOutbreak} onOpenChange={setShowReportOutbreak}>
            <DialogTrigger asChild>
              <Button className="gradient-bg text-white" data-testid="report-outbreak-button">
                <Plus className="h-4 w-4 mr-2" />
                {t("outbreaks.report")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Report Disease Outbreak</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="diseaseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disease</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            const disease = diseases.find(d => d.name === value);
                            if (disease) {
                              form.setValue("diseaseNameUrdu", disease.nameUrdu);
                              form.setValue("species", disease.species[0]);
                            }
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="disease-select">
                              <SelectValue placeholder="Select disease" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {diseases.map(disease => (
                              <SelectItem key={disease.id} value={disease.name}>
                                {language === "ur" ? disease.nameUrdu : disease.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="other">Other Disease</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("diseaseName") === "other" && (
                    <>
                      <FormField
                        control={form.control}
                        name="diseaseName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Disease Name (English)</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="custom-disease-name-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="diseaseNameUrdu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Disease Name (Urdu)</FormLabel>
                            <FormControl>
                              <Input {...field} className="urdu-text" data-testid="custom-disease-name-urdu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Affected Species</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="species-select">
                              <SelectValue placeholder="Select species" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cow">Cow (گائے)</SelectItem>
                            <SelectItem value="buffalo">Buffalo (بھینس)</SelectItem>
                            <SelectItem value="goat">Goat (بکری)</SelectItem>
                            <SelectItem value="dog">Dog (کتا)</SelectItem>
                            <SelectItem value="cat">Cat (بلی)</SelectItem>
                            <SelectItem value="mixed">Mixed Species</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="affectedAnimals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Affected Animals</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                            data-testid="affected-animals-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location (City/Village)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Lahore, Faisalabad" data-testid="location-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="province-select">
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {provinces.map(province => (
                              <SelectItem key={province} value={province}>
                                {province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="any"
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                              data-testid="latitude-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="any"
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                              data-testid="longitude-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="severity-select">
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {severityLevels.map(level => (
                              <SelectItem key={level.value} value={level.value}>
                                {language === "ur" ? level.labelUrdu : level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reportedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reported By</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Your name or organization" data-testid="reported-by-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={reportOutbreakMutation.isPending}
                    data-testid="submit-outbreak-button"
                  >
                    {reportOutbreakMutation.isPending ? "Reporting..." : "Report Outbreak"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalOutbreaks.length > 0 && (
        <Alert className="border-red-300 bg-red-50 mb-8">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical Alert:</strong> {criticalOutbreaks.length} critical outbreak(s) require immediate attention!
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Outbreaks</p>
                <p className="text-2xl font-bold text-foreground">{outbreaks?.length || 0}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Outbreaks</p>
                <p className="text-2xl font-bold text-red-600">{activeOutbreaks?.length || 0}</p>
              </div>
              <div className="bg-red-50 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Level</p>
                <p className="text-2xl font-bold text-red-600">{criticalOutbreaks.length}</p>
              </div>
              <div className="bg-red-50 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {outbreaks?.filter(o => o.status === "resolved").length || 0}
                </p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Outbreaks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                {t("outbreaks.active")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOutbreaks && activeOutbreaks.length > 0 ? (
                  activeOutbreaks.map((outbreak, index) => (
                    <div 
                      key={outbreak.id} 
                      className="p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setSelectedOutbreak(outbreak)}
                      data-testid={`outbreak-${index}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">
                            {language === "ur" ? outbreak.diseaseNameUrdu : outbreak.diseaseName}
                          </h4>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {outbreak.location}, {outbreak.province}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getSeverityColor(outbreak.severity)}>
                            {severityLevels.find(s => s.value === outbreak.severity)?.label}
                          </Badge>
                          <Badge className={getStatusColor(outbreak.status)}>
                            {outbreak.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Species:</span>
                          <p className="text-muted-foreground">{outbreak.species}</p>
                        </div>
                        <div>
                          <span className="font-medium">Affected Animals:</span>
                          <p className="text-muted-foreground">{outbreak.affectedAnimals}</p>
                        </div>
                        <div>
                          <span className="font-medium">Reported By:</span>
                          <p className="text-muted-foreground">{outbreak.reportedBy}</p>
                        </div>
                        <div>
                          <span className="font-medium">Date Reported:</span>
                          <p className="text-muted-foreground">
                            {new Date(outbreak.reportDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {outbreak.status === "active" && (
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOutbreakStatus(outbreak, "contained");
                            }}
                            disabled={updateOutbreakMutation.isPending}
                            data-testid={`contain-outbreak-${index}`}
                          >
                            Mark as Contained
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOutbreakStatus(outbreak, "resolved");
                            }}
                            disabled={updateOutbreakMutation.isPending}
                            data-testid={`resolve-outbreak-${index}`}
                          >
                            Mark as Resolved
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No active outbreaks</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* All Outbreaks History */}
          <Card>
            <CardHeader>
              <CardTitle>Outbreak History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {outbreaks && outbreaks.length > 0 ? (
                  outbreaks
                    .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
                    .map((outbreak, index) => (
                    <div key={outbreak.id} className="p-3 border rounded-lg" data-testid={`history-outbreak-${index}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {language === "ur" ? outbreak.diseaseNameUrdu : outbreak.diseaseName}
                        </span>
                        <div className="flex gap-2">
                          <Badge className={getSeverityColor(outbreak.severity)}>
                            {outbreak.severity}
                          </Badge>
                          <Badge className={getStatusColor(outbreak.status)}>
                            {outbreak.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{outbreak.location}, {outbreak.province} • {outbreak.affectedAnimals} {outbreak.species}(s)</p>
                        <p>Reported: {new Date(outbreak.reportDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No outbreaks reported yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Outbreak Details */}
          {selectedOutbreak && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Outbreak Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Disease:</span>
                    <p className="text-muted-foreground">
                      {language === "ur" ? selectedOutbreak.diseaseNameUrdu : selectedOutbreak.diseaseName}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <p className="text-muted-foreground">{selectedOutbreak.location}, {selectedOutbreak.province}</p>
                  </div>
                  {selectedOutbreak.latitude && selectedOutbreak.longitude && (
                    <div>
                      <span className="font-medium">Coordinates:</span>
                      <p className="text-muted-foreground">{selectedOutbreak.latitude}, {selectedOutbreak.longitude}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Biosafety Measures:</span>
                    <p className="text-muted-foreground text-xs mt-1 p-2 bg-muted rounded">
                      {selectedOutbreak.biosafetyMeasures}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Provincial Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-500" />
                Provincial Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-medium">Punjab Livestock Department</h4>
                  <p className="text-muted-foreground">Phone: +92-42-9201234</p>
                  <p className="text-muted-foreground">Emergency: +92-300-1234567</p>
                </div>
                <div>
                  <h4 className="font-medium">Sindh Livestock Department</h4>
                  <p className="text-muted-foreground">Phone: +92-21-9201234</p>
                  <p className="text-muted-foreground">Emergency: +92-300-7654321</p>
                </div>
                <div>
                  <h4 className="font-medium">PVMC Compliance</h4>
                  <p className="text-muted-foreground">Report all outbreaks within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Most Affected Province:</span>
                  <span className="font-medium">
                    {outbreaks && outbreaks.length > 0 ? (
                      Object.entries(
                        outbreaks.reduce((acc, outbreak) => {
                          acc[outbreak.province] = (acc[outbreak.province] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A"
                    ) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Most Common Disease:</span>
                  <span className="font-medium">
                    {outbreaks && outbreaks.length > 0 ? (
                      Object.entries(
                        outbreaks.reduce((acc, outbreak) => {
                          acc[outbreak.diseaseName] = (acc[outbreak.diseaseName] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A"
                    ) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Animals Affected:</span>
                  <span className="font-medium">
                    {outbreaks?.reduce((sum, outbreak) => sum + outbreak.affectedAnimals, 0) || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
