"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, MessageCircle, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function BloomingWelcome() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Show after slight delay for smooth aesthetic entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400);

    // Auto close after 5.5 seconds so it blooms, floats, and closes cleanly
    const autoClose = setTimeout(() => {
      handleClose();
    }, 5500);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoClose);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 600);
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060515]/75 backdrop-blur-md transition-all duration-500 ${isClosing ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
        }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative max-w-lg w-full bg-gradient-to-b from-[#170E3B] via-[#0E0B28] to-[#07051A] text-white rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(139,53,255,0.35)] border border-[#8B35FF]/50 text-center overflow-hidden transition-all duration-500 ${isClosing ? "scale-90 opacity-0 -translate-y-4" : "animate-bloom"
          }`}
      >
        {/* Soft Background Radial Light */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#8B35FF]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#38BDF8]/25 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#D5D2E5] hover:text-white transition-colors"
          aria-label="Close welcome"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Blooming Flower Graphic */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-5">
          {/* Glowing Aura Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#38BDF8] via-[#8B35FF] to-[#C084FC] blur-xl opacity-70 animate-pulse" />

          {/* SVG Blooming Lotus / Flower with layered petals */}
          <svg
            className="w-full h-full relative z-10 drop-shadow-[0_0_20px_rgba(139,53,255,0.7)] animate-spin"
            style={{ animationDuration: "25s" }}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Petals */}
            <path
              d="M50 15 C55 30 75 35 85 50 C75 65 55 70 50 85 C45 70 25 65 15 50 C25 35 45 30 50 15 Z"
              fill="url(#petalGradient1)"
              opacity="0.9"
            />
            {/* Rotated Middle Petals */}
            <path
              d="M50 20 C62 32 68 48 80 50 C68 52 62 68 50 80 C38 68 32 52 20 50 C32 48 38 32 50 20 Z"
              fill="url(#petalGradient2)"
              opacity="0.85"
              transform="rotate(45 50 50)"
            />
            {/* Inner Blossom Core */}
            <circle cx="50" cy="50" r="14" fill="url(#coreGradient)" />
            <circle cx="50" cy="50" r="7" fill="#FFFFFF" />

            <defs>
              <linearGradient id="petalGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B35FF" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
              <linearGradient id="petalGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
              <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#8B35FF" />
              </radialGradient>
            </defs>
          </svg>

          {/* Floating Sparkles around Flower */}
          <Sparkles className="w-5 h-5 text-[#38BDF8] absolute -top-1 -right-1 animate-bounce" />
          <Sparkles className="w-4 h-4 text-[#C084FC] absolute -bottom-1 -left-1 animate-pulse" />
        </div>

        {/* Floating Greeting Text */}
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B35FF]/20 border border-[#8B35FF]/40 text-[#E9D5FF] text-xs font-semibold">
            <span>🌸</span>
            <span>{t("welcome.greeting_tag")}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug drop-shadow">
            {t("welcome.modal_title_part1")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#C084FC] to-[#8B35FF]">
              {t("welcome.modal_title_part2")}
            </span>
          </h2>

          <p className="text-[#D5D2E5] text-sm sm:text-base leading-relaxed">
            {t("welcome.modal_desc")}
          </p>

          {/* Helpline pill */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <a
              href="https://wa.me/8801938267920"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{t("welcome.whatsapp_cta")}</span>
            </a>
          </div>

          <p className="text-[11px] text-[#94A3B8] pt-1">
            {t("welcome.fade_hint")}
          </p>
        </div>
      </div>
    </div>
  );
}
