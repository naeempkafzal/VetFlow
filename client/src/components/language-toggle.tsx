import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const [language, setLanguage] = useState<"en" | "ur">("en");

  const toggleLanguage = (lang: "en" | "ur") => {
    setLanguage(lang);
    // Store in localStorage for persistence
    localStorage.setItem("language", lang);
    
    // Add/remove urdu class to body for RTL support
    if (lang === "ur") {
      document.body.classList.add("urdu-text");
      document.dir = "rtl";
    } else {
      document.body.classList.remove("urdu-text");
      document.dir = "ltr";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" data-testid="language-toggle">
          <Globe className="h-4 w-4 mr-2" />
          {language === "en" ? "English" : "اردو"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => toggleLanguage("en")}
          data-testid="language-english"
        >
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => toggleLanguage("ur")}
          data-testid="language-urdu"
        >
          🇵🇰 اردو
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
