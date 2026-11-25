"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  X,
  Palette,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { TEMPLATE_CATEGORIES } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (websiteId: string) => void;
}

const AVAILABLE_SECTIONS = [
  { id: "hero", label: "Hero Banner", default: true },
  { id: "about", label: "About Mission", default: true },
  { id: "features", label: "Features Grid", default: true },
  { id: "services", label: "Services & Pricing", default: true },
  { id: "gallery", label: "Visual Gallery", default: false },
  { id: "testimonials", label: "Client Testimonials", default: true },
  { id: "faq", label: "FAQ Accordion", default: true },
  { id: "contact", label: "Contact Form", default: true },
  { id: "cta", label: "Call to Action", default: true },
  { id: "footer", label: "Footer", default: true },
];

export default function AiGeneratorModal({ isOpen, onClose, onSuccess }: AiGeneratorModalProps) {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Business");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [style, setStyle] = useState("Modern & Professional");
  const [brandColor, setBrandColor] = useState("#8B35FF");
  const [multiPage, setMultiPage] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "hero",
    "about",
    "features",
    "services",
    "testimonials",
    "faq",
    "cta",
    "contact",
    "footer",
  ]);

  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSection = (id: string) => {
    if (selectedSections.includes(id)) {
      if (selectedSections.length > 2) {
        setSelectedSections(selectedSections.filter((s) => s !== id));
      }
    } else {
      setSelectedSections([...selectedSections, id]);
    }
  };

  const stepsList = [
    t("ai_modal.step1"),
    t("ai_modal.step2"),
    t("ai_modal.step3"),
    t("ai_modal.step4"),
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(language === "bn" ? "অনুগ্রহ করে ওয়েবসাইটের একটি নাম দিন।" : "Please enter a website name.");
      return;
    }
    if (!description.trim()) {
      setError(language === "bn" ? "অনুগ্রহ করে ওয়েবসাইট বা ব্যবসা সম্পর্কে কিছু লিখুন।" : "Please describe what your business or project does.");
      return;
    }

    setError(null);
    setGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < stepsList.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          description,
          targetAudience,
          style,
          language,
          requiredSections: selectedSections,
          brandColor,
          multiPage,
        }),
      });

      clearInterval(stepInterval);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Generation failed.");
      }

      setGenerationStep(3);
      setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess(data.website.id);
        } else {
          router.push(`/editor/${data.website.id}`);
        }
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message);
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#191638] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-[0_0_50px_rgba(139,53,255,0.3)] border border-[#8B35FF]/40 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#24164A] bg-[#100D2B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#24164A] text-[#C084FC] flex items-center justify-center shadow-xs border border-[#8B35FF]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{t("ai_modal.title")}</h3>
              <p className="text-xs text-[#D5D2E5]">
                {t("ai_modal.desc")}
              </p>
            </div>
          </div>
          {!generating && (
            <button
              onClick={onClose}
              className="p-2 text-[#D5D2E5] hover:text-white rounded-xl hover:bg-[#24164A]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content / Form */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#191638]">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {generating ? (
            <div className="py-12 px-4 text-center space-y-8">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#8B35FF]/30 animate-ping opacity-75" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#8B35FF] to-[#176BFF] text-white flex items-center justify-center shadow-lg shadow-[#8B35FF]/30 animate-pulse">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                <h4 className="text-lg font-bold text-white">
                  {name}
                </h4>
                <div className="h-2 w-full bg-[#24164A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8B35FF] to-[#176BFF] transition-all duration-500"
                    style={{ width: `${((generationStep + 1) / stepsList.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-[#C084FC] animate-pulse">
                  {stepsList[generationStep]}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left text-xs">
                {stepsList.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                      idx <= generationStep
                        ? "border-[#20A887]/40 bg-[#20A887]/20 text-[#20A887]"
                        : "border-[#24164A] bg-[#100D2B] text-[#D5D2E5]/50"
                    }`}
                  >
                    <CheckCircle
                      className={`w-3.5 h-3.5 shrink-0 ${
                        idx <= generationStep ? "text-[#20A887]" : "text-[#D5D2E5]/30"
                      }`}
                    />
                    <span className="truncate">{step.split("...")[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form id="ai-generator-form" onSubmit={handleGenerate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D5D2E5] mb-1.5">
                    {t("ai_modal.name_label")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("ai_modal.name_placeholder")}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#24164A] bg-[#100D2B] text-white text-sm focus:border-[#8B35FF] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D5D2E5] mb-1.5">
                    {t("ai_modal.cat_label")}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#24164A] bg-[#100D2B] text-white text-sm focus:border-[#8B35FF] transition-colors"
                  >
                    {TEMPLATE_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D5D2E5] mb-1.5">
                  {t("ai_modal.desc_label")} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("ai_modal.desc_placeholder")}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#24164A] bg-[#100D2B] text-white text-sm focus:border-[#8B35FF] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D5D2E5] mb-1.5">
                    {t("ai_modal.style_label")}
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Modern, Minimal, Tech, Luxury"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#24164A] bg-[#100D2B] text-white text-sm focus:border-[#8B35FF] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D5D2E5] mb-1.5">
                    {t("ai_modal.style_label")}
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#24164A] bg-[#100D2B] text-white text-sm focus:border-[#8B35FF] transition-colors"
                  >
                    <option value="Modern Blue Brand">Modern Blue Brand (Clean & SaaS)</option>
                    <option value="Minimalist Studio">Minimalist Studio (Clean Typography)</option>
                    <option value="Bold Dark & Tech">Bold Dark & Tech</option>
                    <option value="Warm Natural">Warm Natural Organic</option>
                  </select>
                </div>
              </div>

              {/* Brand Color & Multi-page options */}
              <div className="p-4 rounded-2xl bg-[#100D2B] border border-[#24164A] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-white block">{t("ai_modal.color_label")}</span>
                    <span className="text-[11px] text-[#D5D2E5]">
                      Applied across buttons, badges, and highlights
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      "#8B35FF",
                      "#176BFF",
                      "#38BDF8",
                      "#A855F7",
                      "#20A887",
                      "#D97706",
                      "#DC2626",
                    ].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setBrandColor(col)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          brandColor === col ? "scale-125 ring-2 ring-offset-2 ring-[#8B35FF]" : ""
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#24164A] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {t("ai_modal.multi_page_label")}
                    </span>
                    <span className="text-[11px] text-[#D5D2E5]">
                      {t("ai_modal.multi_page_sub")}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={multiPage}
                      onChange={(e) => setMultiPage(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#24164A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#24164A] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B35FF]" />
                  </label>
                </div>
              </div>

              {/* Sections Checklist */}
              <div>
                <label className="block text-xs font-semibold text-[#D5D2E5] mb-2">
                  {t("ai_modal.sections_label")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_SECTIONS.map((sec) => {
                    const checked = selectedSections.includes(sec.id);
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => toggleSection(sec.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                          checked
                            ? "border-[#8B35FF] bg-[#24164A] text-[#C084FC]"
                            : "border-[#24164A] bg-[#100D2B] text-[#D5D2E5] hover:bg-[#24164A]"
                        }`}
                      >
                        <span>{sec.label}</span>
                        {checked && <CheckCircle className="w-3.5 h-3.5 text-[#C084FC] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer actions */}
        {!generating && (
          <div className="p-6 border-t border-[#24164A] flex items-center justify-end gap-3 bg-[#100D2B]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#24164A] font-semibold text-sm text-[#D5D2E5] hover:bg-[#24164A] hover:text-white"
            >
              {t("blank_modal.btn_cancel")}
            </button>
            <button
              type="submit"
              form="ai-generator-form"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold text-sm shadow-md shadow-[#8B35FF]/30"
            >
              <Sparkles className="w-4 h-4" />
              {t("ai_modal.btn_generate")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
