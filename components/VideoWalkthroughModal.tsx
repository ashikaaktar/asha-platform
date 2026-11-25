"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Layout,
  Globe,
  Code,
  Laptop,
  Check,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface VideoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBuilder: () => void;
}

export default function VideoWalkthroughModal({
  isOpen,
  onClose,
  onStartBuilder,
}: VideoWalkthroughModalProps) {
  const { t, language } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const steps = [
    {
      id: 0,
      title: language === "bn" ? "১. আইডিয়া প্রদান" : "1. Share Idea",
      subtitle: language === "bn" ? "ব্যবসার প্রম্পট বা বিবরণ লিখুন" : "Enter business prompt or vision",
      icon: Sparkles,
      color: "from-[#8B35FF] to-[#38BDF8]",
    },
    {
      id: 1,
      title: language === "bn" ? "২. এআই জেনারেশন" : "2. AI Generation",
      subtitle: language === "bn" ? "সেকেন্ডে রেসপন্সিভ পেজ তৈরি" : "Instant multi-section creation",
      icon: Laptop,
      color: "from-[#38BDF8] to-[#818CF8]",
    },
    {
      id: 2,
      title: language === "bn" ? "৩. ভিজুয়াল এডিটর" : "3. Visual Editor",
      subtitle: language === "bn" ? "ড্র্যাগ & ড্রপ ও কোড পরিবর্তন" : "Live styling & custom code",
      icon: Code,
      color: "from-[#F59E0B] to-[#EF4444]",
    },
    {
      id: 3,
      title: language === "bn" ? "৪. ১-ক্লিকে পাবলিশ" : "4. 1-Click Publish",
      subtitle: language === "bn" ? "ফ্রি SSL সহ ইন্টারনেটে লাইভ" : "Live on web with free SSL",
      icon: Globe,
      color: "from-[#10B981] to-[#38BDF8]",
    },
  ];

  // Auto-play steps simulation
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((s) => (s + 1) % steps.length);
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0D0B24] border border-[#2D2A5D] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(139,53,255,0.35)] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#170E3B] via-[#0D0B24] to-[#121A3D] border-b border-[#2D2A5D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#38BDF8] flex items-center justify-center text-white shadow-lg shadow-[#7C3AED]/30">
              <Play className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>
                  {language === "bn"
                    ? "ভিডিও গাইড: ২ মিনিটে কীভাবে ওয়েবসাইট তৈরি করবেন"
                    : "Video Guide: How to Build a Website in 2 Minutes"}
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 uppercase tracking-wider">
                  Live Demo
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {language === "bn"
                  ? "কোনো কোডিং ছাড়াই স্টেপ-বাই-স্টেপ স্বয়ংক্রিয়ভাবে ওয়েবসাইট তৈরির সরাসরি প্রদর্শন"
                  : "Step-by-step visual interactive demonstration of building without coding"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1A1642] text-[#D5D2E5] hover:text-white hover:bg-[#251F5E] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Display Screen */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="relative aspect-[16/9] w-full rounded-2xl bg-[#060515] border border-[#2D2A5D] overflow-hidden flex flex-col shadow-inner">
            {/* Top Browser Bar */}
            <div className="h-8 bg-[#13112E] px-4 flex items-center justify-between border-b border-[#2D2A5D]/60 select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="ml-3 text-[11px] font-mono text-[#94A3B8] hidden sm:inline">
                  https://asha.site/builder/interactive-demo
                </span>
              </div>
              <span className="text-[10px] font-semibold text-[#8B35FF] uppercase tracking-wider">
                Stage {activeStep + 1} of 4
              </span>
            </div>

            {/* Screen Content for Active Step */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-b from-[#0A0724] to-[#060515]">
              {/* Radial ambient glow */}
              <div className="absolute inset-0 bg-radial from-[#8B35FF]/15 via-transparent to-transparent pointer-events-none" />

              {/* Step 0: Share Idea */}
              {activeStep === 0 && (
                <div className="max-w-md w-full space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#38BDF8] flex items-center justify-center text-white mx-auto shadow-[0_0_30px_rgba(124,58,237,0.5)]">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
                      {language === "bn" ? "ধাপ ১: প্রম্পট ইনপুট" : "Step 1: Prompt Input"}
                    </span>
                    <h4 className="text-xl font-extrabold text-white">
                      {language === "bn"
                        ? "আপনার ব্যবসা বা আইডিয়ার বিবরণ লিখুন"
                        : "Describe Your Vision or Business Idea"}
                    </h4>
                  </div>
                  {/* Simulated typing input */}
                  <div className="p-4 rounded-2xl bg-[#0D0B24] border border-[#8B35FF]/60 text-left space-y-2 shadow-xl">
                    <span className="text-[11px] font-bold text-[#A855F7] uppercase tracking-wider">
                      {language === "bn" ? "এআই প্রম্পট বক্স" : "AI Prompt Box"}
                    </span>
                    <div className="text-sm font-medium text-white flex items-center gap-1 font-mono">
                      <span>
                        {language === "bn"
                          ? "আমার একটি আধুনিক রেস্টুরেন্ট আছে, মেনু ও টেবিল বুকিং সহ ওয়েবসাইট চাই..."
                          : "I run a modern rooftop restaurant with online food menu and table reservation..."}
                      </span>
                      <span className="w-2 h-4 bg-[#38BDF8] animate-pulse" />
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#38BDF8] text-white text-xs font-bold shadow-lg shadow-[#7C3AED]/40">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {language === "bn"
                        ? "এআই দিয়ে ১-ক্লিকে ওয়েবসাইট বানান"
                        : "Generate Complete Website with AI"}
                    </span>
                  </div>
                </div>
              )}

              {/* Step 1: AI Generation */}
              {activeStep === 1 && (
                <div className="max-w-md w-full space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#38BDF8] to-[#818CF8] flex items-center justify-center text-white mx-auto shadow-[0_0_30px_rgba(56,189,248,0.5)]">
                    <Laptop className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
                      {language === "bn" ? "ধাপ ২: এআই জেনারেশন" : "Step 2: Instant Generation"}
                    </span>
                    <h4 className="text-xl font-extrabold text-white">
                      {language === "bn"
                        ? "এআই মুহূর্তেই পুরো ওয়েবসাইট তৈরি করছে"
                        : "AI is Creating the Entire Website"}
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0D0B24] border border-[#2D2A5D] text-left space-y-3 shadow-xl">
                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#10B981]" />
                        {language === "bn" ? "হিরো ও ব্যানার সেকশন প্রস্তুত" : "Hero & Banner Section Ready"}
                      </span>
                      <span className="font-mono text-[#38BDF8]">100%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#10B981]" />
                        {language === "bn" ? "ফুড মেনু ও সার্ভিসেস গ্রিড" : "Interactive Menu & Services Grid"}
                      </span>
                      <span className="font-mono text-[#38BDF8]">100%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#10B981]" />
                        {language === "bn" ? "টেবিল বুকিং ও যোগাযোগ ফর্ম" : "Booking & Instant WhatsApp CTA"}
                      </span>
                      <span className="font-mono text-[#38BDF8]">100%</span>
                    </div>
                    <div className="w-full bg-[#1A1642] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#7C3AED] to-[#38BDF8] h-full animate-pulse w-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Visual Editor & Code */}
              {activeStep === 2 && (
                <div className="max-w-md w-full space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F59E0B] to-[#EF4444] flex items-center justify-center text-white mx-auto shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                    <Code className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
                      {language === "bn" ? "ধাপ ৩: ড্র্যাগ & ড্রপ ও কোড এডিটর" : "Step 3: Visual & Code Editor"}
                    </span>
                    <h4 className="text-xl font-extrabold text-white">
                      {language === "bn"
                        ? "নিজের ইচ্ছামতো লেখা, রং ও কোড পরিবর্তন করুন"
                        : "Freely Customize Visuals, Copy & Code"}
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0D0B24] border border-[#2D2A5D] text-left space-y-2.5 shadow-xl">
                    <div className="flex items-center justify-between border-b border-[#2D2A5D] pb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Layout className="w-3.5 h-3.5 text-[#38BDF8]" /> Visual Canvas
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#8B35FF]/20 text-[#C084FC]">
                        Live Sync
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-[#D5D2E5]">
                      <div className="p-2 rounded-lg bg-[#181340] border border-[#8B35FF]/40 text-white flex items-center justify-between">
                        <span>✏️ Heading: &quot;স্বাদ ও ঐতিহ্যের সেরা আয়োজন&quot;</span>
                        <span className="text-[10px] text-[#38BDF8]">Editable</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#181340] border border-[#8B35FF]/40 text-white flex items-center justify-between">
                        <span>🎨 Color Palette: Deep Navy & Neon Blue</span>
                        <span className="text-[10px] text-[#10B981]">Custom CSS</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: 1-Click Publish */}
              {activeStep === 3 && (
                <div className="max-w-md w-full space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#38BDF8] flex items-center justify-center text-white mx-auto shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                    <Globe className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">
                      {language === "bn" ? "ধাপ ৪: ১-ক্লিকে প্রকাশ করুন" : "Step 4: 1-Click Publish"}
                    </span>
                    <h4 className="text-xl font-extrabold text-white">
                      {language === "bn"
                        ? "মুহূর্তেই ইন্টারনেটে লাইভ ওয়েবসাইট পাবলিশ!"
                        : "Instantly Live on Internet with Free SSL"}
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#06241D] border border-[#10B981]/50 text-left space-y-3 shadow-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#10B981]">
                      <Check className="w-4 h-4" />
                      <span>{language === "bn" ? "পাবলিশ সম্পন্ন হয়েছে!" : "Successfully Deployed!"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0D0B24] border border-[#2D2A5D] flex items-center justify-between">
                      <span className="font-mono text-xs text-[#38BDF8]">
                        https://myrestaurant.asha.site
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/20 text-[#10B981]">
                        SSL Secured
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="h-12 bg-[#0D0B24] px-4 flex items-center justify-between border-t border-[#2D2A5D]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-[#1A1642] text-white hover:bg-[#251F5E] transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  onClick={() => {
                    setActiveStep(0);
                    setProgress(0);
                  }}
                  className="p-1.5 rounded-lg bg-[#1A1642] text-[#94A3B8] hover:text-white transition-colors"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-[#94A3B8]">
                  0:{String(Math.floor((activeStep * 25 + progress * 0.25) / 10)).padStart(2, "0")} / 0:60
                </span>
              </div>

              {/* Progress bar */}
              <div className="flex-1 mx-6 h-1.5 bg-[#1A1642] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7C3AED] via-[#38BDF8] to-[#10B981] transition-all duration-100"
                  style={{ width: `${(activeStep * 25) + (progress * 0.25)}%` }}
                />
              </div>

              <span className="text-xs font-bold text-[#38BDF8]">
                {steps[activeStep].title}
              </span>
            </div>
          </div>

          {/* 4 Interactive Step Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {steps.map((st) => {
              const Icon = st.icon;
              const isActive = activeStep === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    setActiveStep(st.id);
                    setProgress(0);
                  }}
                  className={`p-3 rounded-2xl text-left transition-all border ${
                    isActive
                      ? "bg-[#181340] border-[#8B35FF] shadow-lg shadow-[#8B35FF]/20"
                      : "bg-[#0D0B24] border-[#2D2A5D] hover:border-[#8B35FF]/40 text-[#94A3B8]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#38BDF8]" : "text-[#94A3B8]"}`} />
                    <span className={`text-xs font-bold ${isActive ? "text-white" : "text-[#D5D2E5]"}`}>
                      {st.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#94A3B8] line-clamp-1">{st.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#2D2A5D] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h5 className="text-sm font-bold text-white">
                {language === "bn"
                  ? "ভিডিও গাইড দেখে ভালো লেগেছে? এখনই শুরু করুন!"
                  : "Ready to launch your own website?"}
              </h5>
              <p className="text-xs text-[#94A3B8]">
                {language === "bn"
                  ? "কোনো ক্রেডিট কার্ড ছাড়াই মাত্র ২ মিনিটে ওয়েবসাইট লাইভ করুন"
                  : "No credit card required • Build and publish in 2 minutes"}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#2D2A5D] text-xs font-semibold text-[#D5D2E5] hover:text-white"
              >
                {language === "bn" ? "বন্ধ করুন" : "Close"}
              </button>
              <button
                onClick={() => {
                  onClose();
                  onStartBuilder();
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#38BDF8] text-white text-xs font-bold shadow-lg shadow-[#7C3AED]/40 hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {language === "bn"
                    ? "এখনই ওয়েবসাইট তৈরি করুন"
                    : "Build Your Website Now"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
