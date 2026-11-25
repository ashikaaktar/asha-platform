"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BloomingWelcome from "@/components/BloomingWelcome";
import FloatingAtmosphere from "@/components/FloatingAtmosphere";
import VideoWalkthroughModal from "@/components/VideoWalkthroughModal";
import AiIdeaGeneratorBox from "@/components/AiIdeaGeneratorBox";
import EditorDemoModal from "@/components/EditorDemoModal";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Layout,
  Globe,
  Smartphone,
  BarChart3,
  ShieldCheck,
  Check,
  ChevronDown,
  Layers,
  Palette,
  Eye,
  MessageCircle,
  Wand2,
  Users,
  Play,
  Star,
  Loader2,
  Code,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TemplateItem {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string | null;
  isFeatured: boolean;
  data: any;
}

export default function LandingPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Modals
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);
  const [editorDemoOpen, setEditorDemoOpen] = useState(false);
  const [cloningTemplateId, setCloningTemplateId] = useState<string | null>(null);

  const phoneNumber = "01938267920";

  const getGreetingMessage = () => {
    switch (language) {
      case "bn":
        return "আসসালামু আলাইকুম! আমি ASHA প্ল্যাটফর্মে ওয়েবসাইট তৈরি করতে চাই।";
      case "ar":
        return "السلام عليكم! أود إنشاء موقع على منصة ASHA.";
      case "hi":
        return "नमस्ते! मैं ASHA प्लेटफॉर्म पर वेबसाइट बनाना चाहता हूँ।";
      case "es":
        return "¡Hola! Deseo crear un sitio web en la plataforma ASHA.";
      default:
        return "Hello! I would like to create a website on ASHA platform.";
    }
  };

  const whatsappUrl = `https://wa.me/8801938267920?text=${encodeURIComponent(getGreetingMessage())}`;

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : { templates: [] }))
      .then((data) => setTemplates(data.templates || []))
      .catch(() => { });
  }, []);

  const filteredTemplates = templates.filter((template) => {
    if (selectedCategory === "All") return true;
    return template.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const getCategoryName = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "all":
        return t("cat.all");
      case "business":
        return t("cat.business");
      case "portfolio":
        return t("cat.portfolio");
      case "agency":
        return t("cat.agency");
      case "personal":
      case "personal website":
        return t("cat.personal");
      case "blog":
        return t("cat.blog");
      case "landing":
      case "landing page":
        return t("cat.landing");
      case "store":
      case "online store":
        return t("cat.store");
      default:
        return cat;
    }
  };

  // Direct Template Clone & Use Handler
  const handleUseTemplate = async (template: TemplateItem) => {
    setCloningTemplateId(template.id);
    try {
      // 1. Ensure user/guest session
      await fetch("/api/auth/guest", { method: "POST" });

      // 2. Clone template into new website
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: template.title,
          category: template.category,
          templateId: template.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.website?.id) {
        router.push(`/editor/${data.website.id}`);
      } else {
        alert(data.error || (language === "bn" ? "টেমপ্লেট লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Failed to load template. Please try again."));
      }
    } catch (err) {
      console.error("Failed to use template:", err);
      alert(language === "bn" ? "সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। আবার চেষ্টা করুন।" : "Connection error. Please try again.");
    } finally {
      setCloningTemplateId(null);
    }
  };

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#07091E] text-[#D5D2E5] selection:bg-[#8B35FF]/30 selection:text-white relative overflow-hidden">
      {/* Floating Atmosphere: Birds, Particles & Ambient Navy-Purple Glow */}
      <FloatingAtmosphere />

      {/* Blooming Welcome Lotus Modal */}
      <BloomingWelcome />

      {/* Video Walkthrough Modal */}
      <VideoWalkthroughModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onStartBuilder={() => setAiGeneratorOpen(true)}
      />

      {/* AI Idea Generator Modal */}
      {aiGeneratorOpen && (
        <AiIdeaGeneratorBox
          isModal
          onClose={() => setAiGeneratorOpen(false)}
        />
      )}

      {/* Editor & Code Demo Modal */}
      <EditorDemoModal
        isOpen={editorDemoOpen}
        onClose={() => setEditorDemoOpen(false)}
        onOpenBuilder={() => setAiGeneratorOpen(true)}
      />

      {/* Modern Cosmic Header */}
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION — EXACT MATCH WITH USER'S REFERENCE SCREENSHOT              */}
        {/* ========================================================================= */}
        <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Cosmic Navy-Purple Gradient Canvas */}
          <div className="absolute inset-0 bg-radial from-[#1A1248]/70 via-[#0B0F33] to-[#07091E] pointer-events-none" />

          {/* S-shaped Radiant Purple & Electric Blue Neon Light Curves (SVG Aurora Trails) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg
              className="w-full h-full object-cover opacity-90"
              viewBox="0 0 1440 900"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="purpleArc" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B35FF" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#A855F7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
                </linearGradient>

                <linearGradient id="blueArc" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#818CF8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#8B35FF" stopOpacity="0.2" />
                </linearGradient>

                <filter id="neonGlowPurple" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="18" result="blur1" />
                  <feGaussianBlur stdDeviation="35" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="neonGlowBlue" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="16" result="blur1" />
                  <feGaussianBlur stdDeviation="30" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d="M -100 280 C 150 120, 200 650, -50 780"
                stroke="url(#purpleArc)"
                strokeWidth="4"
                filter="url(#neonGlowPurple)"
              />
              <path
                d="M -50 200 C 350 100, 250 850, -100 880"
                stroke="#A855F7"
                strokeWidth="2.5"
                strokeOpacity="0.6"
              />
              <path
                d="M -150 680 C 300 740, 850 790, 1550 560"
                stroke="url(#purpleArc)"
                strokeWidth="3.5"
                filter="url(#neonGlowPurple)"
              />
              <path
                d="M 900 120 C 1200 180, 1500 500, 1580 850"
                stroke="url(#blueArc)"
                strokeWidth="3.5"
                filter="url(#neonGlowBlue)"
              />
            </svg>
          </div>

          {/* Ambient Lighting Spheres */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#8B35FF]/18 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-[550px] h-[550px] bg-[#0284C7]/15 rounded-full blur-[150px] pointer-events-none" />

          {/* 3D FLOATING GLASS CUBES */}
          <div className="hidden lg:flex absolute top-28 left-[10%] z-20 animate-float pointer-events-none">
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#2D1B69]/80 to-[#120B33]/90 backdrop-blur-xl border border-[#8B35FF]/60 flex items-center justify-center shadow-[0_0_35px_rgba(139,53,255,0.45)] transform -rotate-12">
              <Wand2 className="w-9 h-9 text-[#C084FC]" />
              <div className="absolute inset-0 rounded-3xl bg-[#8B35FF]/15 animate-pulse" />
            </div>
          </div>

          <div className="hidden lg:flex absolute bottom-36 left-[8%] z-20 animate-float-delayed pointer-events-none">
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1C164D]/80 to-[#0A0724]/90 backdrop-blur-xl border border-[#6366F1]/50 flex items-center justify-center shadow-[0_0_35px_rgba(99,102,241,0.4)] transform rotate-6">
              <Layers className="w-9 h-9 text-[#818CF8]" />
              <div className="absolute inset-0 rounded-3xl bg-[#6366F1]/15" />
            </div>
          </div>

          <div className="hidden lg:flex absolute top-24 right-[12%] z-20 animate-float pointer-events-none">
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#122B57]/80 to-[#07132E]/90 backdrop-blur-xl border border-[#38BDF8]/60 flex items-center justify-center shadow-[0_0_35px_rgba(56,189,248,0.45)] transform rotate-12">
              <Zap className="w-9 h-9 text-[#38BDF8]" />
              <div className="absolute inset-0 rounded-3xl bg-[#38BDF8]/15 animate-pulse" />
            </div>
          </div>

          {/* HERO CENTER CONTENT */}
          <div className="relative z-30 max-w-6xl mx-auto w-full text-center space-y-8">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1F144B]/80 backdrop-blur-md border border-[#8B35FF]/60 text-xs sm:text-sm font-semibold text-[#E9D5FF] shadow-[0_0_20px_rgba(139,53,255,0.35)] animate-pulse-glow">
              <span>{t("hero.badge_ai")}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                {t("hero.title_p1")}
              </h1>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15] text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#C084FC] drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
                {t("hero.title_p2")}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-[#D5D2E5] font-normal leading-relaxed drop-shadow">
              {t("hero.subtitle_v2")}
            </p>

            {/* 3 Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {/* Button 1: Start Building with AI */}
              <button
                onClick={() => setAiGeneratorOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#7C3AED] via-[#8B35FF] to-[#38BDF8] hover:from-[#6D28D9] hover:to-[#0284C7] shadow-[0_0_35px_rgba(124,58,237,0.7)] hover:shadow-[0_0_50px_rgba(56,189,248,0.85)] hover:scale-105 transition-all"
              >
                <span>{t("hero.btn_build")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Button 2: Watch Interactive Video Demo */}
              <button
                onClick={() => setVideoModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white bg-[#0D1038]/90 hover:bg-[#161B52] border border-[#27255C] hover:border-[#8B35FF]/80 backdrop-blur-md shadow-lg transition-all hover:scale-105 group"
              >
                <Play className="w-4 h-4 text-[#C084FC] fill-[#C084FC] group-hover:scale-110 transition-transform" />
                <span>{t("hero.btn_video")}</span>
              </button>

              {/* Button 3: Star Templates */}
              <a
                href="#templates"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold text-[#38BDF8] bg-[#0A1838]/85 hover:bg-[#0E234F] border border-[#0EA5E9]/50 hover:border-[#38BDF8] backdrop-blur-md shadow-lg shadow-[#0284C7]/20 transition-all hover:scale-105"
              >
                <Star className="w-4 h-4 text-[#38BDF8] fill-[#38BDF8]" />
                <span>{t("hero.btn_templates")}</span>
              </a>
            </div>

            {/* 3 Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-[#D5D2E5] pt-4">
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-[#818CF8]" />
                <span>{t("hero.trust_nocode")}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-[#818CF8]" />
                <span>{t("hero.trust_speed")}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-[#818CF8]" />
                <span>{t("hero.trust_easy")}</span>
              </span>
            </div>

            {/* 2 Floating Stats Cards & Center 3D Preview */}
            <div className="relative pt-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Floating Stat Card: Users */}
              <div className="w-full md:w-auto p-4 sm:p-5 rounded-2xl bg-[#0D1038]/90 backdrop-blur-xl border border-[#27255C] hover:border-[#8B35FF]/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center gap-4 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#1E1B4B] border border-[#6366F1]/40 flex items-center justify-center text-[#818CF8] shadow-[0_0_20px_rgba(99,102,241,0.3)] shrink-0">
                  <Users className="w-6 h-6 text-[#818CF8]" />
                </div>
                <div className="text-left">
                  <h4 className="text-base sm:text-lg font-extrabold text-white">
                    {t("hero.stat_users_count")}
                  </h4>
                  <p className="text-xs text-[#94A3B8]">
                    {t("hero.stat_users_desc")}
                  </p>
                </div>
              </div>

              {/* Center 3D Laptop Preview */}
              <div
                onClick={() => setVideoModalOpen(true)}
                className="hidden lg:flex relative w-72 h-44 rounded-2xl bg-gradient-to-tr from-[#1E1245] to-[#0A1A3A] p-2 border border-[#8B35FF]/40 shadow-[0_0_50px_rgba(139,53,255,0.3)] items-center justify-center group hover:scale-105 transition-all cursor-pointer"
                title="Click to watch demo walkthrough video"
              >
                <div className="w-full h-full rounded-xl bg-[#08071F] overflow-hidden flex flex-col border border-white/10 relative">
                  <div className="h-4 bg-[#13112E] flex items-center gap-1 px-2 border-b border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/70" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex-1 p-2 flex flex-col justify-center items-center text-center space-y-1 bg-gradient-to-b from-[#0F0D2E] to-[#060515]">
                    <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                    <span className="text-[10px] font-bold text-white">{t("hero.preview_badge")}</span>
                    <span className="text-[8px] text-[#A855F7]">{t("hero.preview_sub")}</span>
                  </div>
                </div>
              </div>

              {/* Right Floating Stat Card: Security */}
              <div className="w-full md:w-auto p-4 sm:p-5 rounded-2xl bg-[#0D1038]/90 backdrop-blur-xl border border-[#27255C] hover:border-[#10B981]/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center gap-4 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#06241D] border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#10B981]" />
                </div>
                <div className="text-left">
                  <h4 className="text-base sm:text-lg font-extrabold text-white">
                    {t("hero.stat_trust_count")}
                  </h4>
                  <p className="text-xs text-[#94A3B8]">
                    {t("hero.stat_trust_desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#07091E] via-[#0B1038] to-[#07091E] relative border-t border-[#25225C]/70">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#38BDF8] bg-[#0C2442] border border-[#0EA5E9]/40 uppercase tracking-wider">
                {t("how.tag")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                {t("how.title")}
              </h2>
              <p className="text-sm sm:text-base text-[#D5D2E5]">
                {t("how.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1: Share Idea */}
              <div className="glass-floating rounded-3xl p-8 relative flex flex-col justify-between space-y-4 group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#38BDF8] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_25px_rgba(124,58,237,0.4)]">
                    {t("how.step1_num")}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t("how.step1_title")}
                  </h3>
                  <p className="text-sm text-[#D5D2E5] leading-relaxed">
                    {t("how.step1_desc")}
                  </p>
                </div>
              </div>

              {/* Step 2: Visual Editor & Code */}
              <div className="glass-floating rounded-3xl p-8 relative flex flex-col justify-between space-y-4 group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#38BDF8] to-[#818CF8] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_25px_rgba(56,189,248,0.4)]">
                    {t("how.step2_num")}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t("how.step2_title")}
                  </h3>
                  <p className="text-sm text-[#D5D2E5] leading-relaxed">
                    {t("how.step2_desc")}
                  </p>
                </div>
              </div>

              {/* Step 3: 1-Click Publish */}
              <div className="glass-floating rounded-3xl p-8 relative flex flex-col justify-between space-y-4 group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#38BDF8] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                    {t("how.step3_num")}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t("how.step3_title")}
                  </h3>
                  <p className="text-sm text-[#D5D2E5] leading-relaxed">
                    {t("how.step3_desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FEATURES GRID */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#07091E] via-[#0D1240] to-[#070A22] relative border-t border-[#25225C]/70">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#A855F7] bg-[#1F144B] border border-[#8B35FF]/40 uppercase tracking-wider">
                {t("feat.tag")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                {t("feat.title")}
              </h2>
              <p className="text-sm sm:text-base text-[#D5D2E5]">
                {t("feat.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  color: "from-[#8B35FF] to-[#38BDF8]",
                  title: t("feat.ai_title"),
                  desc: t("feat.ai_desc"),
                  isAiTrigger: true,
                },
                {
                  icon: Layout,
                  color: "from-[#38BDF8] to-[#818CF8]",
                  title: t("feat.editor_title"),
                  desc: t("feat.editor_desc"),
                  isEditorTrigger: true,
                },
                {
                  icon: Globe,
                  color: "from-[#10B981] to-[#38BDF8]",
                  title: t("feat.publish_title"),
                  desc: t("feat.publish_desc"),
                  isPublishTrigger: true,
                },
                {
                  icon: Smartphone,
                  color: "from-[#F59E0B] to-[#EF4444]",
                  title: t("feat.responsive_title"),
                  desc: t("feat.responsive_desc"),
                },
                {
                  icon: Palette,
                  color: "from-[#EC4899] to-[#8B35FF]",
                  title: t("feat.media_title"),
                  desc: t("feat.media_desc"),
                },
                {
                  icon: BarChart3,
                  color: "from-[#38BDF8] to-[#2563EB]",
                  title: t("feat.analytics_title"),
                  desc: t("feat.analytics_desc"),
                },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div key={i} className="glass-floating rounded-3xl p-8 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-lg`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                      <p className="text-sm text-[#D5D2E5] leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TEMPLATES SHOWCASE */}
        <section id="templates" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#070A22] via-[#0F1448] to-[#080B26] relative border-t border-[#25225C]/70">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#38BDF8] bg-[#0C2442] border border-[#0EA5E9]/40 uppercase tracking-wider">
                {t("tmpl.tag")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                {t("tmpl.title")}
              </h2>
              <p className="text-sm sm:text-base text-[#D5D2E5]">
                {t("tmpl.subtitle")}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                "All",
                "Business",
                "Portfolio",
                "Agency",
                "Personal Website",
                "Blog",
                "Landing Page",
                "Online Store",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedCategory === cat
                    ? "bg-gradient-to-r from-[#7C3AED] to-[#38BDF8] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                    : "bg-[#0D0B24] text-[#D5D2E5] hover:text-white border border-[#2D2A5D] hover:border-[#8B35FF]/40"
                    }`}
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => {
                const isCloning = cloningTemplateId === template.id;
                return (
                  <div
                    key={template.id}
                    className="glass-floating rounded-3xl overflow-hidden flex flex-col group"
                  >
                    <div className="relative aspect-video bg-[#13112E] overflow-hidden flex items-center justify-center">
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={template.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[#94A3B8]">
                          <Layout className="w-10 h-10 text-[#8B35FF]" />
                          <span className="text-xs font-medium">ASHA Template</span>
                        </div>
                      )}
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-[#060515]/80 backdrop-blur-md border border-[#2D2A5D]">
                        {getCategoryName(template.category)}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                          {template.title}
                        </h4>
                        <p className="text-xs text-[#D5D2E5] line-clamp-2 mt-1 leading-relaxed">
                          {template.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#2D2A5D] bg-[#0D0B24] hover:bg-[#1A1642] text-xs font-semibold text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
                          <span>{t("tmpl.preview")}</span>
                        </button>

                        {/* 1-Click Template Use Button */}
                        <button
                          onClick={() => handleUseTemplate(template)}
                          disabled={isCloning}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#38BDF8] hover:from-[#6D28D9] hover:to-[#0284C7] disabled:opacity-75 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                        >
                          {isCloning ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{language === "bn" ? "প্রস্তুত হচ্ছে..." : "Loading..."}</span>
                            </>
                          ) : (
                            <>
                              <span>{t("tmpl.use")}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PRICING SECTION */}
        <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#080B26] via-[#11164E] to-[#07091E] relative border-t border-[#25225C]/70">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#A855F7] bg-[#1F144B] border border-[#8B35FF]/40 uppercase tracking-wider">
                {t("price.tag")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                {t("price.title")}
              </h2>
              <p className="text-sm sm:text-base text-[#D5D2E5]">
                {t("price.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="glass-floating rounded-3xl p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                    {t("price.free")}
                  </span>
                  <div className="flex items-baseline gap-1 text-white">
                    <span className="text-4xl font-extrabold">{t("price.free_price")}</span>
                    <span className="text-xs text-[#94A3B8]">{t("price.per_month")}</span>
                  </div>
                  <p className="text-xs text-[#D5D2E5]">{t("price.free_sub")}</p>
                  <ul className="space-y-3 text-xs text-[#D5D2E5] pt-4 border-t border-[#2D2A5D]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#10B981]" /> {t("price.free_feat1")}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#10B981]" /> {t("price.free_feat2")}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#10B981]" /> {t("price.free_feat3")}
                    </li>
                  </ul>
                </div>
                <Link
                  href="/register"
                  className="w-full py-3 rounded-xl border border-[#2D2A5D] bg-[#0D0B24] hover:bg-[#1A1642] text-center font-bold text-xs text-white transition-colors block"
                >
                  {t("price.get_started")}
                </Link>
              </div>

              {/* Pro Creator Plan — Highlighted */}
              <div className="relative rounded-3xl p-8 bg-gradient-to-b from-[#1F144B] to-[#0D0B24] border-2 border-[#8B35FF] shadow-[0_0_40px_rgba(139,53,255,0.4)] flex flex-col justify-between space-y-6 transform md:-translate-y-2">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-extrabold text-white bg-gradient-to-r from-[#8B35FF] to-[#38BDF8] uppercase tracking-wider shadow-md">
                  {t("price.popular")}
                </div>
                <div className="space-y-4">
                  <span className="text-xs font-bold text-[#C084FC] uppercase tracking-wider">
                    {t("price.pro")}
                  </span>
                  <div className="flex items-baseline gap-1 text-white">
                    <span className="text-4xl font-extrabold">{t("price.pro_price")}</span>
                    <span className="text-xs text-[#94A3B8]">{t("price.per_month")}</span>
                  </div>
                  <p className="text-xs text-[#D5D2E5]">{t("price.pro_sub")}</p>
                  <ul className="space-y-3 text-xs text-[#D5D2E5] pt-4 border-t border-[#8B35FF]/30">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#38BDF8]" /> {t("price.pro_feat1")}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#38BDF8]" /> {t("price.pro_feat2")}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#38BDF8]" /> {t("price.pro_feat3")}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#38BDF8]" /> {t("price.pro_feat4")}
                    </li>
                  </ul>
                </div>
                <Link
                  href="/register"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#38BDF8] text-center font-bold text-xs text-white shadow-lg hover:scale-105 transition-all block"
                >
                  {t("price.start_trial")}
                </Link>
              </div>

              {/* Agency Plan */}
              <div className="glass-floating rounded-3xl p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                    {t("price.agency")}
                  </span>
                  <div className="flex items-baseline gap-1 text-white">
                    <span className="text-4xl font-extrabold">{t("price.agency_price")}</span>
                    <span className="text-xs text-[#94A3B8]">{t("price.per_month")}</span>
                  </div>
                  <p className="text-xs text-[#D5D2E5]">{t("price.agency_sub")}</p>
                  <ul className="space-y-3 text-xs text-[#D5D2E5] pt-4 border-t border-[#2D2A5D]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#10B981]" /> {t("price.agency_feat1")}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#10B981]" /> {t("price.agency_feat2")}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#10B981]" /> {t("price.agency_feat3")}
                    </li>
                  </ul>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl border border-[#2D2A5D] bg-[#0D0B24] hover:bg-[#1A1642] text-center font-bold text-xs text-white transition-colors"
                >
                  {t("price.contact_agency")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#07091E] via-[#0C103A] to-[#06081A] relative border-t border-[#25225C]/70">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#38BDF8] bg-[#0C2442] border border-[#0EA5E9]/40 uppercase tracking-wider">
                {t("faq.tag")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                {t("faq.title")}
              </h2>
              <p className="text-sm sm:text-base text-[#D5D2E5]">
                {t("faq.subtitle")}
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="glass-floating rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-white text-base hover:text-[#38BDF8] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#8B35FF] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#38BDF8]" : ""
                          }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm text-[#D5D2E5] leading-relaxed border-t border-[#25225C]/60 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#06081A] relative">
          <div className="max-w-5xl mx-auto rounded-3xl p-10 sm:p-16 bg-gradient-to-r from-[#1E1245] via-[#0E1B3B] to-[#141235] border border-[#8B35FF]/40 shadow-[0_0_50px_rgba(139,53,255,0.25)] text-center space-y-6 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                {t("cta.title")}
              </h2>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#D5D2E5]">
                {t("cta.subtitle")}
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#templates"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-[#7C3AED] via-[#38BDF8] to-[#10B981] shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-all"
                >
                  <span>{t("cta.btn")}</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-base font-semibold text-white bg-[#0D0B24] border border-[#2D2A5D] hover:border-[#10B981] transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-[#10B981]" />
                  <span>{phoneNumber}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Cosmic Footer */}
      <Footer />

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#0D0B24] border border-[#2D2A5D] rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-[#2D2A5D] pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {previewTemplate.title}
                </h3>
                <span className="text-xs text-[#38BDF8]">
                  {getCategoryName(previewTemplate.category)}
                </span>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 rounded-xl bg-[#1A1642] text-[#D5D2E5] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl bg-[#060515] overflow-hidden border border-[#2D2A5D] flex items-center justify-center">
              {previewTemplate.thumbnail ? (
                <img
                  src={previewTemplate.thumbnail}
                  alt={previewTemplate.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-2">
                  <Layout className="w-12 h-12 text-[#8B35FF] mx-auto" />
                  <p className="text-sm text-[#D5D2E5]">{t("tmpl.design_preview")}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-5 py-2.5 rounded-xl border border-[#2D2A5D] text-xs font-semibold text-[#D5D2E5] hover:text-white"
              >
                {t("tmpl.close")}
              </button>
              <button
                onClick={() => {
                  const t = previewTemplate;
                  setPreviewTemplate(null);
                  handleUseTemplate(t);
                }}
                disabled={Boolean(cloningTemplateId)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#38BDF8] text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
              >
                {cloningTemplateId === previewTemplate.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === "bn" ? "প্রস্তুত হচ্ছে..." : "Loading..."}</span>
                  </>
                ) : (
                  <>
                    <span>{t("tmpl.start_using")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
