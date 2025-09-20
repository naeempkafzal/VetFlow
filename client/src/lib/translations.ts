export const translations = {
  en: {
    dashboard: {
      title: "Veterinary Dashboard",
      welcome: "Welcome back, Dr. Veterinarian!",
      subtitle: "Manage your veterinary practice with comprehensive tools for livestock and pet care",
      stats: {
        totalAnimals: "Total Animals",
        upcomingAppointments: "Upcoming Appointments", 
        lowStockItems: "Low Stock Items",
        activeOutbreaks: "Active Outbreaks",
        overdueVaccinations: "Overdue Vaccinations"
      }
    },
    symptomChecker: {
      title: "Symptom Checker",
      selectSpecies: "Select Animal Species",
      symptoms: "Symptoms",
      diagnosis: "Diagnosis",
      treatment: "Treatment Recommendations"
    },
    records: {
      title: "Animal Records",
      addNew: "Add New Animal",
      search: "Search animals...",
      name: "Name",
      species: "Species",
      owner: "Owner",
      location: "Location"
    },
    vaccinations: {
      title: "Vaccination Management",
      schedule: "Vaccination Schedule",
      overdue: "Overdue Vaccinations",
      addNew: "Add New Vaccination"
    },
    inventory: {
      title: "Inventory Management",
      lowStock: "Low Stock Items",
      expiring: "Expiring Items",
      addNew: "Add New Item"
    },
    appointments: {
      title: "Appointment Scheduler",
      upcoming: "Upcoming Appointments",
      today: "Today's Appointments",
      schedule: "Schedule New"
    },
    outbreaks: {
      title: "Disease Outbreak Reporting",
      active: "Active Outbreaks",
      report: "Report New Outbreak",
      location: "Location",
      severity: "Severity"
    },
    analytics: {
      title: "Analytics & Reports",
      productivity: "Farm Productivity",
      welfare: "Pet Welfare Scores",
      amr: "AMR Risk Assessment"
    }
  },
  ur: {
    dashboard: {
      title: "ویٹرنری ڈیش بورڈ",
      welcome: "خوش آمدید، ڈاکٹر صاحب!",
      subtitle: "مویشیوں اور پالتو جانوروں کی دیکھ بھال کے لیے جامع آلات کے ساتھ اپنی ویٹرنری پریکٹس کا انتظام کریں",
      stats: {
        totalAnimals: "کل جانور",
        upcomingAppointments: "آنے والی اپائنٹمنٹس",
        lowStockItems: "کم اسٹاک آئٹمز",
        activeOutbreaks: "فعال وبائی امراض",
        overdueVaccinations: "ویکسینیشن کی تاخیر"
      }
    },
    symptomChecker: {
      title: "علامات کی جانچ",
      selectSpecies: "جانور کی قسم منتخب کریں",
      symptoms: "علامات",
      diagnosis: "تشخیص",
      treatment: "علاج کی سفارشات"
    },
    records: {
      title: "جانوروں کے ریکارڈز",
      addNew: "نیا جانور شامل کریں",
      search: "جانور تلاش کریں...",
      name: "نام",
      species: "قسم",
      owner: "مالک",
      location: "مقام"
    },
    vaccinations: {
      title: "ویکسینیشن کا انتظام",
      schedule: "ویکسینیشن شیڈول",
      overdue: "ویکسینیشن میں تاخیر",
      addNew: "نئی ویکسین شامل کریں"
    },
    inventory: {
      title: "انوینٹری کا انتظام",
      lowStock: "کم اسٹاک آئٹمز",
      expiring: "ختم ہونے والے آئٹمز",
      addNew: "نیا آئٹم شامل کریں"
    },
    appointments: {
      title: "اپائنٹمنٹ شیڈولر",
      upcoming: "آنے والی اپائنٹمنٹس",
      today: "آج کی اپائنٹمنٹس",
      schedule: "نئی شیڈول کریں"
    },
    outbreaks: {
      title: "بیماری کی وبا کی رپورٹنگ",
      active: "فعال وبائی امراض",
      report: "نئی وبا کی رپورٹ",
      location: "مقام",
      severity: "شدت"
    },
    analytics: {
      title: "تجزیات اور رپورٹس",
      productivity: "فارم کی پیداوار",
      welfare: "پالتو جانوروں کی فلاح کے اسکور",
      amr: "AMR خطرے کا جائزہ"
    }
  }
};

export function useTranslation() {
  const language = (localStorage.getItem("language") as "en" | "ur") || "en";
  return {
    t: (key: string) => {
      const keys = key.split(".");
      let value: any = translations[language];
      
      for (const k of keys) {
        if (value && typeof value === "object") {
          value = value[k];
        } else {
          return key; // Return key if translation not found
        }
      }
      
      return value || key;
    },
    language
  };
}
