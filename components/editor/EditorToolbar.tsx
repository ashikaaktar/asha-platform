"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  CheckCircle,
  Loader2,
  Globe,
  Layers,
  Settings,
  Save,
  Download,
  Check,
  ChevronDown,
} from "lucide-react";
import { PageData } from "@/lib/types";
import { useLanguage, AVAILABLE_LANGUAGES } from "@/context/LanguageContext";

interface EditorToolbarProps {
  websiteName: string;
  websiteId: string;
  status: "DRAFT" | "PUBLISHED";
  publishedSubdomain?: string | null;
  pages: PageData[];
  currentPageSlug: string;
  onSelectPage: (slug: string) => void;
  onOpenPageManager: () => void;
  deviceView: "desktop" | "tablet" | "mobile";
  onChangeDeviceView: (v: "desktop" | "tablet" | "mobile") => void;
  isPreviewMode: boolean;
  onTogglePreviewMode: () => void;
  saveStatus: "saved" | "saving" | "unsaved";
  onSave: () => void;
  onOpenPublishModal: () => void;
  onOpenThemeSettings: () => void;
  onOpenExportModal?: () => void;
}

export default function EditorToolbar({
  websiteName,
  websiteId,
  status,
  publishedSubdomain,
  pages,
  currentPageSlug,
  onSelectPage,
  onOpenPageManager,
  deviceView,
  onChangeDeviceView,
  isPreviewMode,
  onTogglePreviewMode,
  saveStatus,
  onSave,
  onOpenPublishModal,
  onOpenThemeSettings,
  onOpenExportModal,
}: EditorToolbarProps) {
  const { t, language, setLanguage } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const currentLang = AVAILABLE_LANGUAGES.find((l) => l.code === language) || AVAILABLE_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-[#060515]/95 backdrop-blur-xl border-b border-[#2D2A5D] shadow-lg h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Left section: Back, Website title, Page switcher */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          title={t("editor.back")}
          className="p-2 text-[#D5D2E5] hover:text-white hover:bg-[#181340] rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="h-5 w-px bg-[#2D2A5D] hidden sm:block" />

        <div className="flex flex-col">
          <span className="font-bold text-sm text-white truncate max-w-[140px] sm:max-w-[200px]">
            {websiteName}
          </span>
          <div className="flex items-center gap-1.5 text-[10px]">
            {status === "PUBLISHED" && publishedSubdomain ? (
              <a
                href={`/sites/${publishedSubdomain}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Open live website in new tab"
                className="text-[#20A887] hover:text-[#34D399] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#20A887] animate-pulse" />
                <span>/sites/{publishedSubdomain} ➔</span>
              </a>
            ) : (
              <span className="text-amber-400 font-medium">{t("dash.filter_draft")}</span>
            )}
          </div>
        </div>

        <div className="h-5 w-px bg-[#2D2A5D] hidden md:block" />

        {/* Page selector dropdown */}
        <div className="flex items-center gap-1.5 bg-[#0D0B24] border border-[#2D2A5D] rounded-xl p-1">
          <select
            value={currentPageSlug}
            onChange={(e) => onSelectPage(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#D5D2E5] pl-2 pr-6 py-1 focus:outline-none cursor-pointer"
          >
            {pages.map((p) => (
              <option key={p.slug} value={p.slug} className="bg-[#0D0B24] text-white">
                {p.title} {p.isHomepage ? `(${t("page_mgr.homepage")})` : ""}
              </option>
            ))}
          </select>
          <button
            onClick={onOpenPageManager}
            title={t("editor.page_mgr_btn")}
            className="p-1 text-[#B98AFF] hover:text-white hover:bg-[#181340] rounded-lg transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Device View Switcher (Desktop / Tablet / Mobile) */}
      <div className="hidden lg:flex items-center gap-1 bg-[#0D0B24] p-1 rounded-xl border border-[#2D2A5D]">
        <button
          onClick={() => onChangeDeviceView("desktop")}
          title={t("editor.device_desktop")}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${deviceView === "desktop"
              ? "bg-[#181340] text-[#C084FC] border border-[#8B35FF]/40 shadow-xs"
              : "text-[#D5D2E5] hover:text-white"
            }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>{t("editor.device_desktop")}</span>
        </button>
        <button
          onClick={() => onChangeDeviceView("tablet")}
          title={t("editor.device_tablet")}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${deviceView === "tablet"
              ? "bg-[#181340] text-[#C084FC] border border-[#8B35FF]/40 shadow-xs"
              : "text-[#D5D2E5] hover:text-white"
            }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>{t("editor.device_tablet")}</span>
        </button>
        <button
          onClick={() => onChangeDeviceView("mobile")}
          title={t("editor.device_mobile")}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${deviceView === "mobile"
              ? "bg-[#181340] text-[#C084FC] border border-[#8B35FF]/40 shadow-xs"
              : "text-[#D5D2E5] hover:text-white"
            }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{t("editor.device_mobile")}</span>
        </button>
      </div>

      {/* Right: Language, Theme settings, Save status, Preview toggle, Publish */}
      <div className="flex items-center gap-2.5">
        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#2D2A5D] bg-[#0D0B24] hover:bg-[#181340] text-xs font-semibold text-white transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#A855F7]" />
            <span className="hidden sm:inline">{currentLang.label.split(" ")[0]}</span>
            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
          </button>

          {langMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-[#0D0B24] rounded-2xl shadow-2xl border border-[#2D2A5D] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1 text-[10px] font-bold text-[#A855F7] uppercase tracking-wider border-b border-[#2D2A5D] mb-1">
                  {t("nav.select_language")}
                </div>
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#181340] transition-colors ${isSelected ? "text-[#38BDF8] font-bold bg-[#181340]" : "text-[#D5D2E5] font-medium"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#38BDF8]" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Global theme */}
        <button
          onClick={onOpenThemeSettings}
          title={t("editor.theme_btn")}
          className="p-2 text-[#D5D2E5] hover:text-white hover:bg-[#181340] rounded-xl transition-colors hidden sm:flex border border-[#2D2A5D]"
        >
          <Settings className="w-4 h-4 text-[#B98AFF]" />
        </button>

        {/* Export HTML */}
        {onOpenExportModal && (
          <button
            onClick={onOpenExportModal}
            title={t("editor.export_btn")}
            className="p-2 text-[#D5D2E5] hover:text-white hover:bg-[#181340] rounded-xl transition-colors hidden sm:flex border border-[#2D2A5D]"
          >
            <Download className="w-4 h-4 text-[#38BDF8]" />
          </button>
        )}

        {/* Save status badge / button */}
        <div className="flex items-center gap-1.5">
          {saveStatus === "saving" ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D5D2E5] px-2 py-1 bg-[#0D0B24] border border-[#2D2A5D] rounded-lg">
              <Loader2 className="w-3 h-3 animate-spin text-[#38BDF8]" />
              {t("editor.saving")}
            </span>
          ) : saveStatus === "unsaved" ? (
            <button
              onClick={onSave}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 rounded-lg transition-colors"
            >
              <Save className="w-3 h-3" />
              {t("editor.save_btn")}
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#20A887] px-2 py-1 bg-[#20A887]/10 border border-[#20A887]/30 rounded-lg hidden sm:flex">
              <CheckCircle className="w-3 h-3 text-[#20A887]" />
              {t("editor.saved")}
            </span>
          )}
        </div>

        {/* Preview mode toggle */}
        <button
          onClick={onTogglePreviewMode}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${isPreviewMode
              ? "bg-[#8B35FF] text-white border-[#8B35FF] shadow-md shadow-[#8B35FF]/30"
              : "border-[#2D2A5D] bg-[#0D0B24] text-[#D5D2E5] hover:bg-[#181340] hover:text-white"
            }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {isPreviewMode ? t("editor.exit_preview") : t("editor.preview")}
          </span>
        </button>

        {/* Publish button */}
        <button
          onClick={onOpenPublishModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold text-xs shadow-md shadow-[#8B35FF]/30 transition-all"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{t("editor.publish_btn")}</span>
        </button>
      </div>
    </header>
  );
}
