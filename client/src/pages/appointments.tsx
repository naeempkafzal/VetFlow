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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/translations";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertAppointmentSchema, type Appointment, type Animal } from "@shared/schema";
import { Calendar as CalendarIcon, Plus, Clock, User, Phone, MapPin, CheckCircle, X } from "lucide-react";
import { z } from "zod";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

const extendedAppointmentSchema = insertAppointmentSchema.extend({
  appointmentDate: z.date(),
});

export default function Appointments() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: animals } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const addAppointmentMutation = useMutation({
    mutationFn: (data: z.infer<typeof extendedAppointmentSchema>) =>
      apiRequest("POST", "/api/appointments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ title: "Appointment scheduled successfully" });
      setShowAddAppointment(false);
      form.reset();
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) =>
      apiRequest("PUT", `/api/appointments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ title: "Appointment updated successfully" });
      setSelectedAppointment(null);
    },
  });

  const form = useForm<z.infer<typeof extendedAppointmentSchema>>({
    resolver: zodResolver(extendedAppointmentSchema),
    defaultValues: {
      ownerName: "",
      ownerPhone: "",
      appointmentDate: new Date(),
      purpose: "",
      notes: "",
    },
  });

  const getAppointmentsForDate = (date: Date) => {
    return appointments?.filter(apt => 
      isSameDay(new Date(apt.appointmentDate), date)
    ).sort((a, b) => 
      new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
    ) || [];
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments?.filter(apt => 
      new Date(apt.appointmentDate) >= now && apt.status === "scheduled"
    ).sort((a, b) => 
      new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
    ).slice(0, 5) || [];
  };

  const getAppointmentsByStatus = (status: string) => {
    return appointments?.filter(apt => apt.status === status) || [];
  };

  const onSubmit = (data: z.infer<typeof extendedAppointmentSchema>) => {
    addAppointmentMutation.mutate(data);
  };

  const updateAppointmentStatus = (appointment: Appointment, newStatus: string) => {
    updateAppointmentMutation.mutate({
      id: appointment.id,
      data: { status: newStatus }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "text-blue-600 bg-blue-50 border-blue-200";
      case "completed": return "text-green-600 bg-green-50 border-green-200";
      case "cancelled": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

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
              {t("appointments.title")}
            </h1>
            <p className="text-muted-foreground">
              {language === "ur"
                ? "کلینک کی ملاقاتوں کا شیڈول اور انتظام کریں"
                : "Schedule and manage clinic appointments"
              }
            </p>
          </div>
          <Dialog open={showAddAppointment} onOpenChange={setShowAddAppointment}>
            <DialogTrigger asChild>
              <Button className="gradient-bg text-white" data-testid="add-appointment-button">
                <Plus className="h-4 w-4 mr-2" />
                {t("appointments.schedule")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="animalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Animal (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                          <FormControl>
                            <SelectTrigger data-testid="appointment-animal-select">
                              <SelectValue placeholder="Select animal (if existing)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No animal selected</SelectItem>
                            {animals?.map(animal => (
                              <SelectItem key={animal.id} value={animal.id}>
                                {animal.name} - {animal.ownerName}
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
                    control={form.control}
                    name="ownerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Phone</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+92-XXX-XXXXXXX" data-testid="owner-phone-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Appointment Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                data-testid="appointment-date-picker"
                              >
                                {field.value ? (
                                  format(field.value, "PPP 'at' p")
                                ) : (
                                  <span>Pick date and time</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  // Keep existing time or set to 9 AM
                                  const newDate = new Date(date);
                                  if (field.value) {
                                    newDate.setHours(field.value.getHours(), field.value.getMinutes());
                                  } else {
                                    newDate.setHours(9, 0);
                                  }
                                  field.onChange(newDate);
                                }
                              }}
                              disabled={(date) => date < startOfDay(new Date())}
                              initialFocus
                            />
                            <div className="p-3 border-t">
                              <label className="text-sm font-medium mb-2 block">Time:</label>
                              <Select 
                                onValueChange={(time) => {
                                  if (field.value) {
                                    const [hours, minutes] = time.split(':').map(Number);
                                    const newDate = new Date(field.value);
                                    newDate.setHours(hours, minutes);
                                    field.onChange(newDate);
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue 
                                    placeholder="Select time" 
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeSlots.map(time => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose of Visit</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Vaccination, checkup, treatment..." data-testid="purpose-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} data-testid="notes-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={addAppointmentMutation.isPending}
                    data-testid="submit-appointment-button"
                  >
                    {addAppointmentMutation.isPending ? "Scheduling..." : "Schedule Appointment"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
                <p className="text-2xl font-bold text-foreground">{appointments?.length || 0}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{getAppointmentsByStatus("scheduled").length}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{getAppointmentsByStatus("completed").length}</p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <p className="text-2xl font-bold text-orange-600">{getAppointmentsForDate(new Date()).length}</p>
              </div>
              <div className="bg-orange-50 p-2 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar and Today's Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                Appointment Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{
                    hasAppointments: (date) => {
                      return (appointments || []).some(apt => 
                        isSameDay(new Date(apt.appointmentDate), date)
                      );
                    }
                  }}
                  modifiersStyles={{
                    hasAppointments: {
                      backgroundColor: 'hsl(217, 91%, 60%)',
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  }}
                  className="rounded-md border"
                  data-testid="appointment-calendar"
                />
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>
                Appointments for {format(selectedDate, "PPPP")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getAppointmentsForDate(selectedDate).map((appointment, index) => (
                  <div 
                    key={appointment.id} 
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    data-testid={`appointment-${index}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          {appointment.ownerName}
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-2" />
                          {format(new Date(appointment.appointmentDate), "p")}
                        </p>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        {appointment.ownerPhone}
                      </p>
                      <p><strong>Purpose:</strong> {appointment.purpose}</p>
                      {appointment.notes && (
                        <p><strong>Notes:</strong> {appointment.notes}</p>
                      )}
                    </div>

                    {appointment.status === "scheduled" && (
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          onClick={() => updateAppointmentStatus(appointment, "completed")}
                          disabled={updateAppointmentMutation.isPending}
                          data-testid={`complete-appointment-${index}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment, "cancelled")}
                          disabled={updateAppointmentMutation.isPending}
                          data-testid={`cancel-appointment-${index}`}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {getAppointmentsForDate(selectedDate).length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No appointments scheduled for this date
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                {t("appointments.upcoming")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getUpcomingAppointments().map((appointment, index) => (
                  <div key={appointment.id} className="p-3 border rounded-lg" data-testid={`upcoming-appointment-${index}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{appointment.ownerName}</span>
                      <Badge variant="outline" className="text-xs">
                        {format(new Date(appointment.appointmentDate), "MMM dd")}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{appointment.purpose}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(appointment.appointmentDate), "p")}
                    </p>
                  </div>
                ))}
                
                {getUpcomingAppointments().length === 0 && (
                  <p className="text-muted-foreground text-sm">No upcoming appointments</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => setSelectedDate(new Date())}
                  data-testid="view-today"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  View Today
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setSelectedDate(addDays(new Date(), 1))}
                  data-testid="view-tomorrow"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  View Tomorrow
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowAddAppointment(true)}
                  data-testid="quick-schedule"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Appointments:</span>
                  <span className="font-medium">
                    {appointments?.filter(apt => {
                      const aptDate = new Date(apt.appointmentDate);
                      const weekStart = new Date();
                      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekEnd.getDate() + 6);
                      return aptDate >= weekStart && aptDate <= weekEnd;
                    }).length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium text-green-600">
                    {appointments?.filter(apt => {
                      const aptDate = new Date(apt.appointmentDate);
                      const weekStart = new Date();
                      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekEnd.getDate() + 6);
                      return aptDate >= weekStart && aptDate <= weekEnd && apt.status === "completed";
                    }).length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className="font-medium text-blue-600">
                    {appointments?.filter(apt => {
                      const aptDate = new Date(apt.appointmentDate);
                      const weekStart = new Date();
                      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekEnd.getDate() + 6);
                      return aptDate >= weekStart && aptDate <= weekEnd && apt.status === "scheduled";
                    }).length || 0}
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
