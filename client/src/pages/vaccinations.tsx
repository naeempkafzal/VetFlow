import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/translations";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertVaccinationSchema, type Animal, type Vaccination } from "@shared/schema";
import { vaccineSchedules, calculateNextVaccinationDate, getOverdueVaccinations, getUpcomingVaccinations } from "@/lib/vaccine-schedules";
import { Syringe, Plus, AlertTriangle, Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const extendedVaccinationSchema = insertVaccinationSchema.extend({
  cost: z.number().min(0),
  dateGiven: z.date(),
  nextDueDate: z.date().optional(),
});

export default function Vaccinations() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [showAddVaccination, setShowAddVaccination] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const { data: vaccinations, isLoading } = useQuery<Vaccination[]>({
    queryKey: ["/api/vaccinations"],
  });

  const { data: animals } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const addVaccinationMutation = useMutation({
    mutationFn: (data: z.infer<typeof extendedVaccinationSchema>) =>
      apiRequest("POST", "/api/vaccinations", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vaccinations"] });
      toast({ title: "Vaccination record added successfully" });
      setShowAddVaccination(false);
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof extendedVaccinationSchema>>({
    resolver: zodResolver(extendedVaccinationSchema),
    defaultValues: {
      animalId: "",
      vaccineName: "",
      vaccineNameUrdu: "",
      dateGiven: new Date(),
      batchNumber: "",
      cost: 0,
      veterinarianName: "",
    },
  });

  const overdueVaccinations = vaccinations ? getOverdueVaccinations(vaccinations) : [];
  const upcomingVaccinations = vaccinations ? getUpcomingVaccinations(vaccinations, 30) : [];

  const onSubmit = (data: z.infer<typeof extendedVaccinationSchema>) => {
    const selectedVaccine = vaccineSchedules.find(v => v.name === data.vaccineName);
    const vaccinationData = {
      ...data,
      nextDueDate: selectedVaccine 
        ? calculateNextVaccinationDate(data.dateGiven, selectedVaccine.intervalMonths)
        : undefined,
    };
    addVaccinationMutation.mutate(vaccinationData);
  };

  const getAnimalName = (animalId: string) => {
    return animals?.find(a => a.id === animalId)?.name || "Unknown Animal";
  };

  const getAnimalSpecies = (animalId: string) => {
    return animals?.find(a => a.id === animalId)?.species || "";
  };

  const getStatusColor = (vaccination: Vaccination) => {
    if (!vaccination.nextDueDate) return "text-gray-600 bg-gray-50";
    
    const now = new Date();
    const dueDate = new Date(vaccination.nextDueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return "text-red-600 bg-red-50";
    if (daysUntilDue <= 30) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  const getStatusText = (vaccination: Vaccination) => {
    if (!vaccination.nextDueDate) return "Completed";
    
    const now = new Date();
    const dueDate = new Date(vaccination.nextDueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} days`;
    if (daysUntilDue <= 30) return `Due in ${daysUntilDue} days`;
    return "Up to date";
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("vaccinations.title")}
            </h1>
            <p className="text-muted-foreground">
              {language === "ur"
                ? "PVMC کے مطابق ویکسینیشن شیڈول اور ریکارڈز کا انتظام کریں"
                : "Manage vaccination schedules and records according to PVMC guidelines"
              }
            </p>
          </div>
          <Dialog open={showAddVaccination} onOpenChange={setShowAddVaccination}>
            <DialogTrigger asChild>
              <Button className="gradient-bg text-white" data-testid="add-vaccination-button">
                <Plus className="h-4 w-4 mr-2" />
                {t("vaccinations.addNew")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Vaccination Record</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="animalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Animal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="vaccination-animal-select">
                              <SelectValue placeholder="Select animal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {animals?.map(animal => (
                              <SelectItem key={animal.id} value={animal.id}>
                                {animal.name} ({animal.species})
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
                    name="vaccineName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vaccine</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            const vaccine = vaccineSchedules.find(v => v.name === value);
                            if (vaccine) {
                              form.setValue("vaccineNameUrdu", vaccine.nameUrdu);
                              form.setValue("cost", vaccine.cost);
                            }
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="vaccine-select">
                              <SelectValue placeholder="Select vaccine" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vaccineSchedules
                              .filter(vaccine => {
                                const selectedAnimalSpecies = form.watch("animalId") 
                                  ? getAnimalSpecies(form.watch("animalId"))
                                  : "";
                                return !selectedAnimalSpecies || vaccine.species.includes(selectedAnimalSpecies);
                              })
                              .map(vaccine => (
                              <SelectItem key={vaccine.id} value={vaccine.name}>
                                {language === "ur" ? vaccine.nameUrdu : vaccine.name}
                                {vaccine.isPVMCRequired && <span className="text-red-500"> *</span>}
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
                    name="dateGiven"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date Given</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                data-testid="vaccination-date-picker"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="batchNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Batch Number</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="batch-number-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost (PKR)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="vaccination-cost-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="veterinarianName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Veterinarian Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="veterinarian-name-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={addVaccinationMutation.isPending}
                    data-testid="submit-vaccination-button"
                  >
                    {addVaccinationMutation.isPending ? "Adding..." : "Add Vaccination"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vaccinations</p>
                <p className="text-2xl font-bold text-foreground">{vaccinations?.length || 0}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Syringe className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueVaccinations.length}</p>
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
                <p className="text-sm text-muted-foreground">Due Soon</p>
                <p className="text-2xl font-bold text-orange-600">{upcomingVaccinations.length}</p>
              </div>
              <div className="bg-orange-50 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PVMC Compliant</p>
                <p className="text-2xl font-bold text-green-600">
                  {vaccinations?.filter(v => vaccineSchedules.find(s => s.name === v.vaccineName)?.isPVMCRequired).length || 0}
                </p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue Vaccinations Alert */}
          {overdueVaccinations.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>{overdueVaccinations.length} vaccinations are overdue!</strong> 
                {language === "ur" ? " فوری طور پر ویکسینیشن کروائیں۔" : " Schedule vaccinations immediately."}
              </AlertDescription>
            </Alert>
          )}

          {/* Vaccination Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Syringe className="h-5 w-5 mr-2 text-primary" />
                Vaccination Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vaccinations && vaccinations.length > 0 ? (
                  vaccinations
                    .sort((a, b) => new Date(b.dateGiven).getTime() - new Date(a.dateGiven).getTime())
                    .map((vaccination, index) => (
                    <div key={vaccination.id} className="p-4 border rounded-lg" data-testid={`vaccination-${index}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{getAnimalName(vaccination.animalId)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {language === "ur" ? vaccination.vaccineNameUrdu : vaccination.vaccineName}
                          </p>
                        </div>
                        <Badge className={getStatusColor(vaccination)}>
                          {getStatusText(vaccination)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Date Given:</span>
                          <p className="text-muted-foreground">
                            {new Date(vaccination.dateGiven).toLocaleDateString()}
                          </p>
                        </div>
                        {vaccination.nextDueDate && (
                          <div>
                            <span className="font-medium">Next Due:</span>
                            <p className="text-muted-foreground">
                              {new Date(vaccination.nextDueDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {vaccination.cost && (
                          <div>
                            <span className="font-medium">Cost:</span>
                            <p className="text-muted-foreground">PKR {vaccination.cost}</p>
                          </div>
                        )}
                        {vaccination.batchNumber && (
                          <div>
                            <span className="font-medium">Batch:</span>
                            <p className="text-muted-foreground">{vaccination.batchNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No vaccination records yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* PVMC Vaccine Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">PVMC Required Vaccines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vaccineSchedules
                  .filter(vaccine => vaccine.isPVMCRequired)
                  .map(vaccine => (
                  <div key={vaccine.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {language === "ur" ? vaccine.nameUrdu : vaccine.name}
                      </span>
                      <Badge variant="outline">PKR {vaccine.cost}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Every {vaccine.intervalMonths} months
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Species: {vaccine.species.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Vaccinations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-orange-500" />
                Due Soon (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingVaccinations.length > 0 ? (
                  upcomingVaccinations.map((vaccination, index) => (
                    <div key={vaccination.id} className="p-2 bg-orange-50 border border-orange-200 rounded text-sm" data-testid={`upcoming-${index}`}>
                      <p className="font-medium">{getAnimalName(vaccination.animalId)}</p>
                      <p className="text-muted-foreground">{vaccination.vaccineName}</p>
                      <p className="text-orange-600 text-xs">
                        Due: {vaccination.nextDueDate ? new Date(vaccination.nextDueDate).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No upcoming vaccinations</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cost Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Cost Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Spent (This Year):</span>
                  <span className="font-medium">
                    PKR {vaccinations?.reduce((sum, v) => sum + (v.cost || 0), 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Average Cost per Vaccination:</span>
                  <span className="font-medium">
                    PKR {vaccinations?.length 
                      ? Math.round(vaccinations.reduce((sum, v) => sum + (v.cost || 0), 0) / vaccinations.length)
                      : 0
                    }
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
