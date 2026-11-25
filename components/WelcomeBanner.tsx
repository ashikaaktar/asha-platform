"use client";

import React, { useState } from "react";
import { Sparkles, MessageCircle, Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage, AVAILABLE_LANGUAGES, Language } from "@/context/LanguageContext";

export default function WelcomeBanner() {
  const { t, language, setLanguage } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const phoneNumber = "01938267920";
  const whatsappUrl = `https://wa.me/8801938267920?text=${encodeURIComponent(
    "Hello! I am contacting you from the ASHA website."
  )}`;

  const currentLangObj =
    AVAILABLE_LANGUAGES.find((l) => l.code === language) || AVAILABLE_LANGUAGES[0];

  return (
    <div className="relative bg-gradient-to-r from-asha-navy via-[#1e40af] to-asha-navy text-white text-xs border-b border-blue-900/50 shadow-xs z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left Welcome message */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-yellow-300" />
          </span>
          <p className="font-medium text-slate-100 text-[11px] sm:text-xs">
            {t("welcome.top_announcement")}
          </p>
        </div>

        {/* Right WhatsApp & Language Selector */}
        <div className="flex items-center gap-3 shrink-0">
          {/* WhatsApp Direct Helpline Link */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs hover:shadow-md transition-all border border-emerald-400/40"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>{t("welcome.whatsapp_btn")}:</span>
            <span className="tracking-wide underline font-extrabold">{phoneNumber}</span>
          </a>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-colors border border-white/15"
              aria-label="Change language"
            >
              <Globe className="w-3 h-3 text-blue-200" />
              <span>{currentLangObj.flag} {currentLangObj.label.split(" ")[0]}</span>
              <ChevronDown className="w-3 h-3 text-blue-200" />
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-44 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Select Language / ভাষা
                  </div>
                  {AVAILABLE_LANGUAGES.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                          isSelected ? "text-asha-primary font-bold bg-blue-50/60" : "text-slate-700 font-medium"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-asha-primary" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
