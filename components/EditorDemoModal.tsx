"use client";

import React, { useState } from "react";
import { X, Layout, Code, Palette, Sparkles, Check, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EditorDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBuilder: () => void;
}

export default function EditorDemoModal({
  isOpen,
  onClose,
  onOpenBuilder,
}: EditorDemoModalProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"visual" | "code">("visual");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0D0B24] border border-[#2D2A5D] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(139,53,255,0.35)] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#170E3B] to-[#0D0B24] border-b border-[#2D2A5D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F59E0B] to-[#EF4444] flex items-center justify-center text-white shadow-lg">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {language === "bn"
                  ? "ভিজুয়াল ড্র্যাগ & ড্রপ এবং কোড এডিটর"
                  : "Visual Drag & Drop and Code Editor"}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {language === "bn"
                  ? "যেভাবে নিজের ইচ্ছামতো প্রতিটি লেখা, ছবি, বাটন ও কোড লাইভ পরিবর্তন করবেন"
                  : "How to live-edit text, sections, styles, and custom CSS easily"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1A1642] text-[#D5D2E5] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-4 bg-[#0A0724] border-b border-[#2D2A5D] flex items-center gap-3">
          <button
            onClick={() => setActiveTab("visual")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "visual"
                ? "bg-gradient-to-r from-[#7C3AED] to-[#38BDF8] text-white shadow-md"
                : "bg-[#13112E] text-[#94A3B8] hover:text-white"
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "ভিজুয়াল মোড (Visual Canvas)" : "Visual Canvas"}</span>
          </button>

          <button
            onClick={() => setActiveTab("code")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "code"
                ? "bg-gradient-to-r from-[#7C3AED] to-[#38BDF8] text-white shadow-md"
                : "bg-[#13112E] text-[#94A3B8] hover:text-white"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "কোড ও সিএসএস মোড (Code/CSS)" : "Code / CSS View"}</span>
          </button>
        </div>

        {/* Interactive Simulated Preview */}
        <div className="p-6">
          {activeTab === "visual" ? (
            <div className="rounded-2xl border border-[#2D2A5D] bg-[#060515] p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[#8B35FF] border-b border-[#2D2A5D] pb-3">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  {language === "bn" ? "লাইভ ভিজুয়াল এডিটর সক্রিয়" : "Live Visual Canvas Active"}
                </span>
                <span className="text-[#38BDF8]">Drag & Drop Ready</span>
              </div>

              {/* Editable Hero Component Simulation */}
              <div className="p-4 rounded-xl bg-[#0D0B24] border border-[#8B35FF]/40 space-y-2 relative group hover:border-[#38BDF8] transition-colors">
                <span className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-[#8B35FF]/20 text-[#C084FC]">
                  Section: Hero
                </span>
                <h4 className="text-base font-extrabold text-white">
                  {language === "bn" ? "স্মার্ট বিজনেস সল্যুশন ২০২৬" : "Smart Business Solutions 2026"}
                </h4>
                <p className="text-xs text-[#D5D2E5]">
                  {language === "bn"
                    ? "যেকোনো লেখার ওপর ক্লিক করে সরাসরি পরিবর্তন করুন। ফন্ট সাইজ, ব্যাকগ্রাউন্ড ও স্পেসিং নিয়ন্ত্রণ করুন।"
                    : "Click any text to edit directly inline. Full control over typography, colors, and layout."}
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="px-3 py-1 rounded-lg bg-[#7C3AED] text-white text-xs font-bold">
                    Primary Button
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#181340] border border-[#2D2A5D] text-[#D5D2E5] text-xs">
                    Secondary Button
                  </span>
                </div>
              </div>

              {/* Editable Features Component Simulation */}
              <div className="p-4 rounded-xl bg-[#0D0B24] border border-[#2D2A5D] space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8]">
                  Section: Features Grid (3 Columns)
                </span>
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-[#D5D2E5]">
                  <div className="p-2 rounded bg-[#060515] border border-white/5">✓ 99.9% Uptime</div>
                  <div className="p-2 rounded bg-[#060515] border border-white/5">✓ Global Edge CDN</div>
                  <div className="p-2 rounded bg-[#060515] border border-white/5">✓ Free SSL Certificate</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#2D2A5D] bg-[#060515] p-5 font-mono text-xs text-[#D5D2E5] space-y-3 overflow-x-auto">
              <div className="flex items-center justify-between text-xs text-[#8B35FF] border-b border-[#2D2A5D] pb-2">
                <span>custom-styles.css / HTML Export</span>
                <span className="text-[10px] text-[#10B981]">Editable Code Snippets</span>
              </div>
              <pre className="text-[#38BDF8] leading-relaxed">
{`/* ASHA Platform Custom Styling */
.hero-section {
  background: radial-gradient(circle, #170E3B 0%, #060515 100%);
  color: #FFFFFF;
  border-radius: 24px;
}

.cta-button {
  background: linear-gradient(135deg, #7C3AED, #38BDF8);
  box-shadow: 0 0 25px rgba(124, 58, 237, 0.5);
  transition: all 0.3s ease;
}`}
              </pre>
            </div>
          )}

          {/* CTA Footer */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#94A3B8]">
              {language === "bn"
                ? "আমাদের ভিজুয়াল এডিটরে যে কেউ প্রোগ্রামিং ছাড়াই কিংবা কোড সহ কাস্টমাইজ করতে পারবেন।"
                : "Visual drag & drop + custom CSS export available in the live editor."}
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenBuilder();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#38BDF8] text-white text-xs font-bold shadow-md hover:scale-105 transition-all"
            >
              <span>{language === "bn" ? "এডিটরে ওয়েবসাইট শুরু করুন" : "Open Live Editor"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
