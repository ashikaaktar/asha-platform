"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Loader2,
  AlertCircle,
  Wand2,
  Layers,
  Globe,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AiIdeaGeneratorBoxProps {
  initialPrompt?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export default function AiIdeaGeneratorBox({
  initialPrompt = "",
  isModal = false,
  onClose,
}: AiIdeaGeneratorBoxProps) {
  const router = useRouter();
  const { language } = useLanguage();

  const [prompt, setPrompt] = useState(initialPrompt);
  const [siteName, setSiteName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Business");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const presets = [
    {
      label: language === "bn" ? "🍽️ রেস্টুরেন্ট ও ক্যাফে" : "🍽️ Restaurant & Cafe",
      category: "Business",
      name: language === "bn" ? "রয়্যাল ক্যাফে ও ডাইন" : "Royal Cafe & Dine",
      desc:
        language === "bn"
          ? "একটি প্রিমিয়াম ক্যাফে ও রেস্টুরেন্ট ওয়েবসাইট, যার মধ্যে ফুড মেনু, শেফ পরিচিতি, গ্রাহকদের রিভিউ এবং অনলাইন টেবিল বুকিং ও হোয়াটসঅ্যাপ অর্ডার অপশন রয়েছে।"
          : "A premium rooftop cafe & restaurant website featuring food menu, chef specials, customer reviews, table reservations, and WhatsApp ordering.",
    },
    {
      label: language === "bn" ? "💻 ডিজিটাল এজেন্সি ও টেক" : "💻 Digital Agency & Tech",
      category: "Agency",
      name: language === "bn" ? "নেক্সাস ডিজিটাল স্টুডিও" : "Nexus Digital Agency",
      desc:
        language === "bn"
          ? "একটি আধুনিক ডিজিটাল মার্কেটিং ও ওয়েব ডেভেলপমেন্ট এজেন্সি ওয়েবসাইট। আমাদের সেবা, আগের প্রজেক্টের কেস স্টাডি, ক্লায়েন্ট টেস্টিমোনিয়াল এবং কনসালটেশন বুকিং সেকশন সহ।"
          : "A sleek modern digital marketing & web development agency site showcasing services, portfolio case studies, client testimonials, and consultation booking.",
    },
    {
      label: language === "bn" ? "🎨 ক্রিয়েটিভ পোর্টফোলিও" : "🎨 Creative Portfolio",
      category: "Portfolio",
      name: language === "bn" ? "আশিকা ক্রিয়েটিভ শোকেস" : "Ashika Creative Portfolio",
      desc:
        language === "bn"
          ? "ফটোগ্রাফার ও ডিজাইনারদের জন্য প্রফেশনাল পোর্টফোলিও ওয়েবসাইট। হাই-রেজোলিউশন ইমেজ গ্যালারি, বায়ো, অ্যাওয়ার্ডস এবং ক্লায়েন্ট কন্টাক্ট ফর্ম সহ।"
          : "A professional portfolio website for photographers & designers featuring high-res masonry galleries, client testimonials, awards, and instant inquiry form.",
    },
    {
      label: language === "bn" ? "👗 অনলাইন ফ্যাশন শপ" : "👗 Online Fashion Store",
      category: "Online Store",
      name: language === "bn" ? "এলিগ্যান্ট ফ্যাশন বুটিক" : "Elegant Fashion Boutique",
      desc:
        language === "bn"
          ? "একটি ট্রেন্ডি ক্লোদিং ও জুয়েলারি অনলাইন স্টোর। ক্যাটাগরি গ্রিড, জনপ্রিয় প্রোডাক্ট শোকেস, কাস্টমার রিভিউ এবং হোয়াটসঅ্যাপে অর্ডার নেওয়ার চমৎকার ফিচার সহ।"
          : "A trendy online boutique store featuring product catalog, seasonal collections, customer ratings, FAQ, and direct WhatsApp checkout.",
    },
    {
      label: language === "bn" ? "🏥 ডেন্টাল ও হেলথ ক্লিনিক" : "🏥 Dental & Healthcare",
      category: "Business",
      name: language === "bn" ? "স্মাইল কেয়ার ডেন্টাল" : "SmileCare Dental Clinic",
      desc:
        language === "bn"
          ? "আধুনিক ডেন্টাল ও মেডিকেল ক্লিনিকের ওয়েবসাইট। অভিজ্ঞ ডাক্তারদের প্রোফাইল, আধুনিক চিকিৎসা সেবা, রোগীদের ফিডব্যাক এবং অনলাইনে অ্যাপয়েন্টমেন্ট বুকিং সুবিধা।"
          : "A modern dental healthcare clinic website with specialist doctor profiles, treatment packages, patient testimonials, and appointment booking.",
    },
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    setPrompt(p.desc);
    setSiteName(p.name);
    setSelectedCategory(p.category);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError(
        language === "bn"
          ? "অনুগ্রহ করে আপনার ওয়েবসাইট বা ব্যবসার আইডিয়া লিখুন।"
          : "Please describe your website or business idea."
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Step 1: Ensure user session (Guest auto-login if anonymous)
      setStage(
        language === "bn"
          ? "১. ব্যবহারকারী যাচাই ও সেশন তৈরি হচ্ছে..."
          : "1. Verifying session and creator authorization..."
      );
      await fetch("/api/auth/guest", { method: "POST" });

      // Step 2: AI Generating sections and pages
      setStage(
        language === "bn"
          ? "২. এআই আপনার আইডিয়া অনুযায়ী রেসপন্সিভ মাল্টি-সেকশন ডিজাইন করছে..."
          : "2. AI is structuring multi-section responsive layouts & copy..."
      );

      const generatedName =
        siteName.trim() ||
        (language === "bn" ? "আমার নতুন ওয়েবসাইট" : "My New Website");

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: generatedName,
          category: selectedCategory,
          description: prompt.trim(),
          language: language === "bn" ? "Bengali" : "English",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI generation failed. Please try again.");
      }

      // Step 3: Success and redirect
      setStage(
        language === "bn"
          ? "৩. ওয়েবসাইট প্রস্তুত! ভিজুয়াল ড্র্যাগ & ড্রপ এডিটর ওপেন হচ্ছে..."
          : "3. Website ready! Opening visual drag-and-drop editor..."
      );

      setTimeout(() => {
        if (data.website?.id) {
          router.push(`/editor/${data.website.id}`);
        } else {
          setError(data.error || "Website generation was incomplete. Please try again.");
          setLoading(false);
        }
      }, 700);
    } catch (err: any) {
      console.error("AI Generation error:", err);
      setError(err.message || "Failed to generate website. Please try again.");
      setLoading(false);
    }
  };

  const content = (
    <div className="w-full text-left space-y-5">
      {/* Header Info */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B35FF]/20 border border-[#8B35FF]/40 text-[#C084FC] text-xs font-bold">
          <Wand2 className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>
            {language === "bn"
              ? "স্মার্ট এআই ওয়েবসাইট জেনারেটর"
              : "Smart AI Website Generator"}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white">
          {language === "bn"
            ? "আপনার আইডিয়া জানান — এআই সেকেন্ডেই ওয়েবসাইট তৈরি করে দেবে"
            : "Share Your Vision — AI Builds Your Website in Seconds"}
        </h3>
        <p className="text-xs sm:text-sm text-[#D5D2E5] leading-relaxed">
          {language === "bn"
            ? "শুধু লিখুন আপনি কেমন ওয়েবসাইট চান। আমাদের এআই রেসপন্সিভ মাল্টি-সেকশন, ছবি ও আকর্ষণীয় লেখা সহ পুরো ওয়েবসাইট সাজিয়ে সরাসরি এডিটরে নিয়ে যাবে।"
            : "Describe what kind of website you want. Our AI generates responsive multi-sections, royalty-free photography, and persuasive copy instantly."}
        </p>
      </div>

      {/* Preset Pills */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-[#A855F7] uppercase tracking-wider block">
          {language === "bn"
            ? "জনপ্রিয় রেডি আইডিয়াসমূহ (ক্লিক করলেই সেট হয়ে যাবে):"
            : "Popular Ready Ideas (Click to auto-fill):"}
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(p)}
              className="px-3.5 py-2 rounded-xl bg-[#0D1240] border border-[#27255C] hover:border-[#8B35FF] hover:bg-[#1A1852] text-xs font-medium text-white transition-all hover:scale-105 shadow-[0_2px_10px_rgba(5,7,25,0.4)]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="space-y-4">
        {/* Optional Website Name */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-bold text-[#D5D2E5] uppercase tracking-wider block">
              {language === "bn" ? "ওয়েবসাইট / প্রতিষ্ঠানের নাম (ঐচ্ছিক)" : "Website / Brand Name (Optional)"}
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder={
                language === "bn"
                  ? "যেমন: আমার রেস্টুরেন্ট বা ডিজিটাল স্টুডিও"
                  : "e.g. Royal Cafe or Digital Studio"
              }
              className="w-full px-4 py-2.5 rounded-xl bg-[#060822] border border-[#27255C] text-white text-xs placeholder-[#94A3B8]/60 focus:border-[#8B35FF] focus:shadow-[0_0_15px_rgba(139,53,255,0.35)] focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#D5D2E5] uppercase tracking-wider block">
              {language === "bn" ? "ক্যাটাগরি" : "Category"}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#060822] border border-[#27255C] text-white text-xs focus:border-[#8B35FF] focus:shadow-[0_0_15px_rgba(139,53,255,0.35)] focus:outline-none transition-all"
            >
              <option value="Business">Business</option>
              <option value="Portfolio">Portfolio</option>
              <option value="Agency">Agency</option>
              <option value="Personal Website">Personal</option>
              <option value="Blog">Blog</option>
              <option value="Online Store">Online Store</option>
            </select>
          </div>
        </div>

        {/* Main Prompt Textarea */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#D5D2E5] uppercase tracking-wider flex items-center justify-between">
            <span>
              {language === "bn"
                ? "আপনার আইডিয়া বা ব্যবসা সম্পর্কে লিখুন:"
                : "Describe your business, vision, or desired sections:"}
            </span>
            <span className="text-[10px] text-[#38BDF8]">
              {language === "bn" ? "বাংলা বা ইংরেজি যেকোনো ভাষায় লিখতে পারেন" : "Type in any language"}
            </span>
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                language === "bn"
                  ? "যেমন: আমি একটি সুন্দর আধুনিক রেস্টুরেন্টের ওয়েবসাইট বানাতে চাই, যাতে আমাদের স্পেশাল খাবার, দাম, রিভিউ এবং অনলাইনে বুকিং ও হোয়াটসঅ্যাপে অর্ডার দেওয়ার বাটন থাকে..."
                  : "e.g. I want to build a modern bakery website with cake catalog, price list, customer testimonials, and direct WhatsApp order button..."
              }
              className="w-full px-4 py-3 rounded-2xl bg-[#060822] border border-[#27255C] text-white text-xs sm:text-sm placeholder-[#94A3B8]/60 focus:border-[#8B35FF] focus:shadow-[0_0_15px_rgba(139,53,255,0.35)] focus:outline-none transition-all leading-relaxed shadow-inner"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading / Progress State */}
        {loading && (
          <div className="p-4 rounded-2xl bg-[#170E3B] border border-[#8B35FF]/60 space-y-2.5 animate-pulse">
            <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8]">
              <Loader2 className="w-4 h-4 animate-spin text-[#38BDF8]" />
              <span>{stage}</span>
            </div>
            <div className="w-full bg-[#0D0B24] h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#7C3AED] via-[#38BDF8] to-[#10B981] h-full w-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#8B35FF] to-[#38BDF8] hover:from-[#6D28D9] hover:to-[#0284C7] disabled:opacity-70 text-white font-extrabold text-sm sm:text-base shadow-[0_0_35px_rgba(124,58,237,0.55)] hover:shadow-[0_0_50px_rgba(56,189,248,0.75)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>
                {language === "bn"
                  ? "এআই দিয়ে ওয়েবসাইট তৈরি হচ্ছে..."
                  : "AI is Creating Your Website..."}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-white" />
              <span>
                {language === "bn"
                  ? "এআই দিয়ে ওয়েবসাইট তৈরি করুন ⚡"
                  : "Generate Complete Website with AI ⚡"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07091E]/80 backdrop-blur-xl animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl bg-[#090D2E]/95 border border-[#7C3AED]/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(124,58,237,0.45),0_0_30px_rgba(56,189,248,0.2)] overflow-hidden">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-[#7C3AED]/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-[#38BDF8]/20 blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-[#15194D] text-[#D5D2E5] hover:text-white hover:bg-[#202770] border border-[#27255C] transition-colors z-10"
          >
            ✕
          </button>
          <div className="relative z-10">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 sm:p-8 rounded-3xl bg-[#090D2E]/90 backdrop-blur-2xl border border-[#8B35FF]/40 shadow-[0_0_50px_rgba(139,53,255,0.3)]">
      {content}
    </div>
  );
}
