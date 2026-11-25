"use client";

import { X, Plus } from "lucide-react";
import { SectionType } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

interface SectionLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (type: SectionType) => void;
}

const SECTION_CATALOG: { type: SectionType; titleKey: string; descKey: string; icon: string }[] = [
  {
    type: "hero",
    titleKey: "feat.ai_title",
    descKey: "feat.ai_desc",
    icon: "🚀",
  },
  {
    type: "features",
    titleKey: "feat.title",
    descKey: "feat.subtitle",
    icon: "⚡",
  },
  {
    type: "about",
    titleKey: "nav.about",
    descKey: "footer.brand_desc",
    icon: "📖",
  },
  {
    type: "services",
    titleKey: "price.title",
    descKey: "price.subtitle",
    icon: "💼",
  },
  {
    type: "gallery",
    titleKey: "feat.media_title",
    descKey: "feat.media_desc",
    icon: "🎨",
  },
  {
    type: "testimonials",
    titleKey: "hero.stat_trust_count",
    descKey: "hero.stat_trust_desc",
    icon: "⭐",
  },
  {
    type: "faq",
    titleKey: "faq.title",
    descKey: "faq.subtitle",
    icon: "❓",
  },
  {
    type: "cta",
    titleKey: "cta.title",
    descKey: "cta.subtitle",
    icon: "🎯",
  },
  {
    type: "contact",
    titleKey: "whatsapp.title",
    descKey: "whatsapp.subtitle",
    icon: "📬",
  },
  {
    type: "footer",
    titleKey: "footer.rights",
    descKey: "footer.tagline",
    icon: "⚓",
  },
];

export default function SectionLibraryModal({
  isOpen,
  onClose,
  onAddSection,
}: SectionLibraryModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#191638] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-[0_0_50px_rgba(139,53,255,0.3)] border border-[#8B35FF]/40 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#24164A] bg-[#100D2B] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{t("sec_lib.title")}</h3>
            <p className="text-xs text-[#D5D2E5]">
              {t("sec_lib.desc")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#D5D2E5] hover:text-white rounded-lg hover:bg-[#24164A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Catalog */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#191638]">
          {SECTION_CATALOG.map((sec) => (
            <div
              key={sec.type}
              onClick={() => {
                onAddSection(sec.type);
                onClose();
              }}
              className="p-4 rounded-2xl border border-[#24164A] bg-[#100D2B] hover:border-[#8B35FF] hover:bg-[#24164A]/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{sec.icon}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-[#C084FC] flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> +
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-[#C084FC] transition-colors">
                  {t(sec.titleKey)}
                </h4>
                <p className="text-xs text-[#D5D2E5]/70 leading-relaxed line-clamp-2">{t(sec.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
