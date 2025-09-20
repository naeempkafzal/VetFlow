import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "@/components/language-toggle";
import {
  Home,
  Stethoscope,
  FileText,
  Syringe,
  Package,
  Calendar,
  AlertTriangle,
  BarChart3,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, nameUrdu: "ڈیش بورڈ" },
  { name: "Symptom Checker", href: "/symptom-checker", icon: Stethoscope, nameUrdu: "علامات کی جانچ" },
  { name: "Records", href: "/records", icon: FileText, nameUrdu: "ریکارڈز" },
  { name: "Vaccinations", href: "/vaccinations", icon: Syringe, nameUrdu: "ویکسینیشن" },
  { name: "Inventory", href: "/inventory", icon: Package, nameUrdu: "انوینٹری" },
  { name: "Appointments", href: "/appointments", icon: Calendar, nameUrdu: "اپائنٹمنٹس" },
  { name: "Outbreaks", href: "/outbreaks", icon: AlertTriangle, nameUrdu: "وبائی امراض" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, nameUrdu: "تجزیات" },
];

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="gradient-bg w-10 h-10 rounded-lg flex items-center justify-center">
              <Stethoscope className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">VetFlow</h1>
              <p className="text-xs text-muted-foreground">ویٹ فلو</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <LanguageToggle />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Profile */}
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">Dr</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="grid grid-cols-2 gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full justify-start text-sm font-medium",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="truncate">{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
