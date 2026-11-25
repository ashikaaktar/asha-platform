"use client";

import React, { useState } from "react";
import { MessageCircle, Phone, X, Sparkles, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function WhatsAppWidget() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = "01938267920";
  const internationalNumber = "+8801938267920";
  const cleanNumber = "8801938267920";

  const getGreetingMessage = () => {
    switch (language) {
      case "bn":
        return "আসসালামু আলাইকুম! আমি ASHA প্ল্যাটফর্মে ওয়েবসাইট তৈরির বিষয়ে কথা বলতে চাই।";
      case "ar":
        return "السلام عليكم، أود الاستفسار عن إنشاء موقع عبر منصة ASHA.";
      case "hi":
        return "नमस्ते! मैं ASHA पर वेबसाइट बनाने के बारे में बात करना चाहता हूँ।";
      case "es":
        return "¡Hola! Me gustaría consultar sobre la creación de sitios web con ASHA.";
      default:
        return "Hello! I am interested in building a website with ASHA platform.";
    }
  };

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(getGreetingMessage())}`;

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-[#0D0B24] rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-[#2D2A5D] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Card Header */}
          <div className="bg-[#170E3B] text-white p-4 flex items-center justify-between border-b border-[#2D2A5D]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center font-bold text-white shadow-inner">
                  <MessageCircle className="w-6 h-6 fill-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] border-2 border-[#170E3B] rounded-full animate-ping" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] border-2 border-[#170E3B] rounded-full" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm tracking-tight flex items-center gap-1.5 text-white">
                  {t("whatsapp.helpline")}
                  <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                </h4>
                <p className="text-[11px] text-[#D5D2E5] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" />
                  {t("whatsapp.online")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-[#D5D2E5] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Card Body */}
          <div className="p-5 space-y-4 text-left bg-[#07051A]">
            <div className="bg-[#0D0B24] p-3.5 rounded-2xl border border-[#2D2A5D] space-y-1">
              <span className="text-[11px] font-bold text-[#818CF8] uppercase tracking-wider">
                {t("whatsapp.official_helpline")}
              </span>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#10B981]" />
                <span className="font-extrabold text-white text-base tracking-wider">
                  {phoneNumber}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                {internationalNumber}
              </p>
            </div>

            <p className="text-xs text-[#D5D2E5] leading-relaxed">
              {t("whatsapp.subtitle")}
            </p>

            {/* Direct Connect Action */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-lg shadow-[#10B981]/25 hover:shadow-xl transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{t("whatsapp.btn_chat")}</span>
              <Send className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-[#10B981] hover:bg-[#059669] text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all hover:scale-105 active:scale-95 focus:outline-none"
          aria-label="Open WhatsApp Chat"
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <MessageCircle className="w-7 h-7 fill-white text-white" />
          )}
        </button>

        {/* Floating Tooltip */}
        {!isOpen && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#0D0B24] border border-[#2D2A5D] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {t("whatsapp.floating_tooltip")}
          </div>
        )}
      </div>
    </aside>
  );
}
