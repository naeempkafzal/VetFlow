import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useTranslation } from "../lib/translations";
import {
  Stethoscope,
  Calendar,
  AlertTriangle,
  Package,
  Syringe,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom"; // Changed from wouter to react-router-dom

interface DashboardStats {
  totalAnimals: number;
  upcomingAppointments: number;
  lowStockItems: number;
  activeOutbreaks: number;
  overdueVaccinations: number;
}

export default function Dashboard() {
  const { t, language } = useTranslation(); // Added language for conditional rendering

  const {
    data: stats = {
      totalAnimals: 0,
      upcomingAppointments: 0,
      lowStockItems: 0,
      activeOutbreaks: 0,
      overdueVaccinations: 0,
    },
    isLoading,
  } = useQuery<DashboardStats>({
    queryKey: ["http://localhost:5001/api/analytics/dashboard"],
    retry: false,
  });

  const { data: upcomingAppointments = [] } = useQuery<any[]>({
    queryKey: ["http://localhost:5001/api/appointments/upcoming"],
    retry: false,
  });

  const { data: lowStockItems = [] } = useQuery<any[]>({
    queryKey: ["http://localhost:5001/api/inventory/low-stock"],
    retry: false,
  });

  const { data: activeOutbreaks = [] } = useQuery<any[]>({
    queryKey: ["http://localhost:5001/api/outbreaks/active"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: t("dashboard.stats.totalAnimals") || "Total Animals",
      value: stats.totalAnimals,
      icon: Stethoscope,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title:
        t("dashboard.stats.upcomingAppointments") || "Upcoming Appointments",
      value: stats.upcomingAppointments,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: t("dashboard.stats.lowStockItems") || "Low Stock Items",
      value: stats.lowStockItems,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: t("dashboard.stats.activeOutbreaks") || "Active Outbreaks",
      value: stats.activeOutbreaks,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: t("dashboard.stats.overdueVaccinations") || "Overdue Vaccinations",
      value: stats.overdueVaccinations,
      icon: Syringe,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t("dashboard.welcome") || "Welcome to Vet Dashboard"}
            </h1>
            <p className="text-gray-600">
              {t("dashboard.subtitle") ||
                "Overview of your veterinary operations"}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Link to="/symptom-checker">
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                data-testid="quick-symptom-check"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Quick Symptom Check
              </Button>
            </Link>
            <Link to="/records">
              <Button variant="outline" data-testid="add-animal">
                <Plus className="h-4 w-4 mr-2" />
                Add Animal
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p
                        className="text-2xl font-bold text-gray-800"
                        data-testid={`stat-${index}`}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/symptom-checker">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    data-testid="action-symptom-checker"
                  >
                    <Stethoscope className="h-6 w-6 mb-2" />
                    <span className="text-xs">Symptom Checker</span>
                  </Button>
                </Link>
                <Link to="/appointments">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    data-testid="action-appointments"
                  >
                    <Calendar className="h-6 w-6 mb-2" />
                    <span className="text-xs">Appointments</span>
                  </Button>
                </Link>
                <Link to="/vaccinations">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    data-testid="action-vaccinations"
                  >
                    <Syringe className="h-6 w-6 mb-2" />
                    <span className="text-xs">Vaccinations</span>
                  </Button>
                </Link>
                <Link to="/inventory">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    data-testid="action-inventory"
                  >
                    <Package className="h-6 w-6 mb-2" />
                    <span className="text-xs">Inventory</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Today's Appointments
                </span>
                <Link to="/appointments">
                  <Button
                    variant="ghost"
                    size="sm"
                    data-testid="view-all-appointments"
                  >
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(upcomingAppointments) &&
              upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments
                    .slice(0, 3)
                    .map((appointment: any, index: number) => (
                      <div
                        key={appointment.id || index}
                        className="flex items-center justify-between p-3 border rounded-lg bg-white"
                        data-testid={`appointment-${index}`}
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {appointment.ownerName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.purpose}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(
                              appointment.appointmentDate,
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <Badge variant="outline" className="text-gray-600">
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No appointments scheduled for today
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(stats.lowStockItems || 0) > 0 && (
                  <div
                    className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                    data-testid="alert-low-stock"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-800">
                          Low Stock Items
                        </p>
                        <p className="text-xs text-orange-600">
                          {stats.lowStockItems} items need restocking
                        </p>
                      </div>
                      <Link to="/inventory">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-300"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {(stats.overdueVaccinations || 0) > 0 && (
                  <div
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    data-testid="alert-overdue-vaccinations"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Overdue Vaccinations
                        </p>
                        <p className="text-xs text-red-600">
                          {stats.overdueVaccinations} animals need vaccination
                        </p>
                      </div>
                      <Link to="/vaccinations">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {(stats.activeOutbreaks || 0) > 0 && (
                  <div
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    data-testid="alert-active-outbreaks"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Active Outbreaks
                        </p>
                        <p className="text-xs text-red-600">
                          {stats.activeOutbreaks} disease outbreaks reported
                        </p>
                      </div>
                      <Link to="/outbreaks">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {!(stats.lowStockItems || 0) &&
                  !(stats.overdueVaccinations || 0) &&
                  !(stats.activeOutbreaks || 0) && (
                    <p className="text-gray-600 text-center py-4">
                      No active alerts
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* PVMC Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-800">
                PVMC Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vaccination Records</span>
                  <Badge variant="outline" className="text-green-600">
                    ✓ Compliant
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Treatment Logs</span>
                  <Badge variant="outline" className="text-green-600">
                    ✓ Compliant
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Outbreak Reporting</span>
                  <Badge variant="outline" className="text-green-600">
                    ✓ Compliant
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
