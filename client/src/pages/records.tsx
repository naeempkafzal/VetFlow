import React, { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/translations";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertAnimalSchema, insertVisitRecordSchema, type Animal, type VisitRecord } from "@shared/schema";
import { Search, Plus, FileText, Calendar, MapPin, Phone, User } from "lucide-react";
import { z } from "zod";

const extendedAnimalSchema = insertAnimalSchema.extend({
  age: z.number().min(0).max(50),
  weight: z.number().min(0).max(2000),
});

const extendedVisitSchema = insertVisitRecordSchema.extend({
  cost: z.number().min(0),
});

export default function Records() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showAddAnimal, setShowAddAnimal] = useState(false);
  const [showAddVisit, setShowAddVisit] = useState(false);

  const { data: animals, isLoading } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const { data: visitRecords } = useQuery<VisitRecord[]>({
    queryKey: ["/api/visit-records"],
  });

  const addAnimalMutation = useMutation({
    mutationFn: (data: z.infer<typeof extendedAnimalSchema>) =>
      apiRequest("POST", "/api/animals", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({ title: "Animal added successfully" });
      setShowAddAnimal(false);
      animalForm.reset();
    },
  });

  const addVisitMutation = useMutation({
    mutationFn: (data: z.infer<typeof extendedVisitSchema>) =>
      apiRequest("POST", "/api/visit-records", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/visit-records"] });
      toast({ title: "Visit record added successfully" });
      setShowAddVisit(false);
      visitForm.reset();
    },
  });

  const animalForm = useForm<z.infer<typeof extendedAnimalSchema>>({
    resolver: zodResolver(extendedAnimalSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      age: 0,
      weight: 0,
      gender: "",
      ownerName: "",
      ownerPhone: "",
      ownerAddress: "",
      location: "",
    },
  });

  const visitForm = useForm<z.infer<typeof extendedVisitSchema>>({
    resolver: zodResolver(extendedVisitSchema),
    defaultValues: {
      animalId: selectedAnimal?.id || "",
      symptoms: "",
      diagnosis: "",
      treatment: "",
      medications: "",
      cost: 0,
      notes: "",
      veterinarianName: "",
    },
  });

  const filteredAnimals = animals?.filter(animal =>
    animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    animal.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    animal.species.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Update visit form when selected animal changes
  React.useEffect(() => {
    if (selectedAnimal) {
      visitForm.setValue("animalId", selectedAnimal.id);
    }
  }, [selectedAnimal, visitForm]);

  const getAnimalVisits = (animalId: string) => {
    return visitRecords?.filter(record => record.animalId === animalId) || [];
  };

  const speciesOptions = [
    { value: "cow", label: "Cow", labelUrdu: "گائے" },
    { value: "buffalo", label: "Buffalo", labelUrdu: "بھینس" },
    { value: "goat", label: "Goat", labelUrdu: "بکری" },
    { value: "dog", label: "Dog", labelUrdu: "کتا" },
    { value: "cat", label: "Cat", labelUrdu: "بلی" },
  ];

  const onSubmitAnimal = (data: z.infer<typeof extendedAnimalSchema>) => {
    addAnimalMutation.mutate(data);
  };

  const onSubmitVisit = (data: z.infer<typeof extendedVisitSchema>) => {
    addVisitMutation.mutate(data);
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
              {t("records.title")}
            </h1>
            <p className="text-muted-foreground">
              {language === "ur"
                ? "جانوروں کے ریکارڈز اور ویٹرنری کی تاریخ کا انتظام کریں"
                : "Manage animal records and veterinary history"
              }
            </p>
          </div>
          <Dialog open={showAddAnimal} onOpenChange={setShowAddAnimal}>
            <DialogTrigger asChild>
              <Button className="gradient-bg text-white" data-testid="add-animal-button">
                <Plus className="h-4 w-4 mr-2" />
                {t("records.addNew")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Animal</DialogTitle>
              </DialogHeader>
              <Form {...animalForm}>
                <form onSubmit={animalForm.handleSubmit(onSubmitAnimal)} className="space-y-4">
                  <FormField
                    control={animalForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Animal Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="animal-name-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={animalForm.control}
                    name="species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Species</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="animal-species-select">
                              <SelectValue placeholder="Select species" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {speciesOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {language === "ur" ? option.labelUrdu : option.label}
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
                      control={animalForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age (years)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="animal-age-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={animalForm.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="animal-weight-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={animalForm.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="owner-name-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={animalForm.control}
                    name="ownerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Phone</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} placeholder="+92-XXX-XXXXXXX" data-testid="owner-phone-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={animalForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} placeholder="City, Province" data-testid="animal-location-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={addAnimalMutation.isPending}
                    data-testid="submit-animal-button"
                  >
                    {addAnimalMutation.isPending ? "Adding..." : "Add Animal"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t("records.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-animals-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animals List */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAnimals.map((animal) => {
              const visits = getAnimalVisits(animal.id);
              const lastVisit = visits.sort((a, b) => 
                new Date(b.visitDate || new Date()).getTime() - new Date(a.visitDate || new Date()).getTime()
              )[0];

              return (
                <Card 
                  key={animal.id} 
                  className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                    selectedAnimal?.id === animal.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedAnimal(animal)}
                  data-testid={`animal-card-${animal.id}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{animal.name}</CardTitle>
                      <Badge variant="outline">
                        {language === "ur" 
                          ? speciesOptions.find(s => s.value === animal.species)?.labelUrdu
                          : animal.species
                        }
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <User className="h-4 w-4 mr-2" />
                        <span>{animal.ownerName}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{animal.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{animal.ownerPhone}</span>
                      </div>
                      {lastVisit && (
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Last visit: {new Date(lastVisit.visitDate || new Date()).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredAnimals.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? "No animals found matching your search"
                    : "No animals registered yet"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Animal Details */}
        <div>
          {selectedAnimal ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Animal Details
                    </CardTitle>
                    <Dialog open={showAddVisit} onOpenChange={setShowAddVisit}>
                      <DialogTrigger asChild>
                        <Button size="sm" data-testid="add-visit-button">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Visit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Visit Record</DialogTitle>
                        </DialogHeader>
                        <Form {...visitForm}>
                          <form onSubmit={visitForm.handleSubmit(onSubmitVisit)} className="space-y-4">
                            <FormField
                              control={visitForm.control}
                              name="animalId"
                              render={({ field }) => (
                                <FormItem className="hidden">
                                  <FormControl>
                                    <Input {...field} value={selectedAnimal?.id || ""} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={visitForm.control}
                              name="symptoms"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Symptoms</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} value={field.value || ""} data-testid="visit-symptoms-input" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={visitForm.control}
                              name="diagnosis"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Diagnosis</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} value={field.value || ""} data-testid="visit-diagnosis-input" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={visitForm.control}
                              name="treatment"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Treatment</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} value={field.value || ""} data-testid="visit-treatment-input" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={visitForm.control}
                              name="cost"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cost (PKR)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                      data-testid="visit-cost-input"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button 
                              type="submit" 
                              className="w-full" 
                              disabled={addVisitMutation.isPending}
                              data-testid="submit-visit-button"
                            >
                              {addVisitMutation.isPending ? "Adding..." : "Add Visit Record"}
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedAnimal.name}
                    </div>
                    <div>
                      <span className="font-medium">Species:</span> {selectedAnimal.species}
                    </div>
                    <div>
                      <span className="font-medium">Age:</span> {selectedAnimal.age} years
                    </div>
                    <div>
                      <span className="font-medium">Weight:</span> {selectedAnimal.weight} kg
                    </div>
                    <div>
                      <span className="font-medium">Owner:</span> {selectedAnimal.ownerName}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {selectedAnimal.location}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visit History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visit History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getAnimalVisits(selectedAnimal.id)
                      .sort((a, b) => new Date(b.visitDate || new Date()).getTime() - new Date(a.visitDate || new Date()).getTime())
                      .map((visit, index) => (
                      <div key={visit.id} className="p-3 border rounded-lg" data-testid={`visit-${index}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">
                            {new Date(visit.visitDate || new Date()).toLocaleDateString()}
                          </span>
                          {visit.cost && (
                            <Badge variant="outline">PKR {visit.cost}</Badge>
                          )}
                        </div>
                        {visit.diagnosis && (
                          <p className="text-sm text-muted-foreground mb-1">
                            <strong>Diagnosis:</strong> {visit.diagnosis}
                          </p>
                        )}
                        {visit.treatment && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Treatment:</strong> {visit.treatment}
                          </p>
                        )}
                      </div>
                    ))}
                    
                    {getAnimalVisits(selectedAnimal.id).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        No visit records yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select an animal to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
