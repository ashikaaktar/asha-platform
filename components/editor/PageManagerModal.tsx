"use client";

import { useState } from "react";
import { X, Plus, Trash2, Home, Check, AlertCircle } from "lucide-react";
import { PageData } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

interface PageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteId: string;
  pages: PageData[];
  currentPageSlug: string;
  onSelectPage: (slug: string) => void;
  onPagesUpdated: () => void;
}

export default function PageManagerModal({
  isOpen,
  onClose,
  websiteId,
  pages,
  currentPageSlug,
  onSelectPage,
  onPagesUpdated,
}: PageManagerModalProps) {
  const { t, language } = useLanguage();
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    setCreating(true);
    setError(null);

    try {
      const res = await fetch(`/api/websites/${websiteId}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPageTitle.trim(),
          slug: newPageSlug.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewPageTitle("");
      setNewPageSlug("");
      onPagesUpdated();
      onSelectPage(data.page.slug);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleSetHomepage = async (pageId: string) => {
    try {
      const res = await fetch(`/api/websites/${websiteId}/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHomepage: true }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      onPagesUpdated();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeletePage = async (pageId: string, title: string) => {
    if (pages.length <= 1) {
      setError(language === "bn" ? "ওয়েবসাইটের একমাত্র পেজটি মুছে ফেলা সম্ভব নয়।" : "Cannot delete the only page in your website.");
      return;
    }
    if (!confirm(`Delete page "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/websites/${websiteId}/pages/${pageId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      onPagesUpdated();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#191638] rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-[0_0_50px_rgba(139,53,255,0.3)] border border-[#8B35FF]/40 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#24164A] bg-[#100D2B] flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{t("page_mgr.title")}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[#D5D2E5] hover:text-white rounded-lg hover:bg-[#24164A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 bg-[#191638]">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Add Page Form */}
          <form
            onSubmit={handleCreatePage}
            className="p-4 rounded-2xl bg-[#100D2B] border border-[#24164A] space-y-3"
          >
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              {t("page_mgr.add_page")}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder={t("page_mgr.page_title_label")}
                value={newPageTitle}
                onChange={(e) => {
                  setNewPageTitle(e.target.value);
                  setNewPageSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "")
                  );
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#24164A] text-xs bg-[#07051A] text-white focus:border-[#8B35FF]"
              />
              <input
                type="text"
                placeholder={t("page_mgr.page_slug_label")}
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#24164A] text-xs bg-[#07051A] text-white focus:border-[#8B35FF]"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold text-xs shadow-md shadow-[#8B35FF]/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              {creating ? "..." : t("page_mgr.btn_add")}
            </button>
          </form>

          {/* Existing Pages List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D5D2E5] uppercase tracking-wider block">
              {t("editor.page_mgr_btn")} ({pages.length})
            </span>
            {pages.map((p) => {
              const isCurrent = p.slug === currentPageSlug;
              return (
                <div
                  key={p.slug}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors ${
                    isCurrent
                      ? "border-[#8B35FF] bg-[#24164A]/60"
                      : "border-[#24164A] bg-[#100D2B] hover:bg-[#24164A]/30"
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectPage(p.slug);
                      onClose();
                    }}
                    className="cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{p.title}</span>
                      {p.isHomepage && (
                        <span className="px-2 py-0.5 rounded-md bg-[#8B35FF]/20 text-[#C084FC] border border-[#8B35FF]/30 text-[10px] font-bold">
                          {t("page_mgr.homepage")}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-md bg-[#176BFF]/20 text-[#38BDF8] border border-[#176BFF]/30 text-[10px] font-semibold">
                          Editing
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#D5D2E5]/60 font-mono">/{p.slug}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!p.isHomepage && (
                      <button
                        onClick={() => p.id && handleSetHomepage(p.id)}
                        title={t("page_mgr.set_homepage")}
                        className="p-1.5 rounded-lg text-[#D5D2E5] hover:text-[#38BDF8] hover:bg-[#181340] text-xs flex items-center gap-1"
                      >
                        <Home className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{t("page_mgr.set_homepage")}</span>
                      </button>
                    )}
                    {pages.length > 1 && (
                      <button
                        onClick={() => p.id && handleDeletePage(p.id, p.title)}
                        title={t("page_mgr.delete")}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-[#24164A] bg-[#100D2B] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#24164A] hover:bg-[#8B35FF]/30 text-white font-semibold text-xs border border-[#8B35FF]/30 transition-colors"
          >
            {t("export_modal.btn_close")}
          </button>
        </div>
      </div>
    </div>
  );
}
