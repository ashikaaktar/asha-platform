"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, Language } from "@/lib/translations";

export type { Language };

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "bn",
  setLanguage: () => { },
  t: (key: string) => key,
});

export const AVAILABLE_LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "bn", label: "বাংলা (Bangla)", flag: "🇧🇩" },
  { code: "en", label: "English (US)", flag: "🇺🇸" },
  { code: "ar", label: "العربية (Arabic)", flag: "🇸🇦" },
  { code: "hi", label: "हिंदी (Hindi)", flag: "🇮🇳" },
  { code: "es", label: "Español (Spanish)", flag: "🇪🇸" },
];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("bn");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("asha_preferred_lang") as Language | null;
      if (saved && ["bn", "en", "ar", "hi", "es"].includes(saved)) {
        setLanguageState(saved);
      }
    } catch { }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("asha_preferred_lang", lang);
    } catch { }
  };

  const t = (key: string): string => {
    return (
      translations[language]?.[key] ||
      translations["en"]?.[key] ||
      translations["bn"]?.[key] ||
      key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
