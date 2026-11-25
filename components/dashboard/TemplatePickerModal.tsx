"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Search, Eye, AlertCircle } from "lucide-react";
import { TEMPLATE_CATEGORIES } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (websiteId: string) => void;
}

export default function TemplatePickerModal({
  isOpen,
  onClose,
  onSuccess,
}: TemplatePickerModalProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : { templates: [] }))
      .then((data) => {
        setTemplates(data.templates || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const getCategoryLabel = (cat: string) => {
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

  const filtered = templates.filter((tItem) => {
    const matchesCat =
      selectedCategory === "All" ||
      tItem.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      tItem.title.toLowerCase().includes(search.toLowerCase()) ||
      tItem.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUseTemplate = async (template: any) => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${template.title} Site`,
          category: template.category,
          templateId: template.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create website from template");
      }

      onClose();
      if (onSuccess) {
        onSuccess(data.website.id);
      } else {
        router.push(`/editor/${data.website.id}`);
      }
    } catch (err: any) {
      setError(err.message);
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#191638] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-[0_0_50px_rgba(139,53,255,0.3)] border border-[#8B35FF]/40 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#24164A] flex items-center justify-between bg-[#100D2B]">
          <div>
            <h3 className="text-xl font-bold text-white">{t("tmpl_modal.title")}</h3>
            <p className="text-xs text-[#D5D2E5]">
              {t("tmpl_modal.desc")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#D5D2E5] hover:text-white rounded-xl hover:bg-[#24164A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and search */}
        <div className="p-6 pb-2 border-b border-[#24164A] space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-gradient-to-r from-[#8B35FF] to-[#176BFF] text-white shadow-md shadow-[#8B35FF]/30"
                      : "bg-[#100D2B] border border-[#24164A] text-[#D5D2E5] hover:bg-[#24164A] hover:text-white"
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#B98AFF] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("tmpl_modal.search")}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#24164A] bg-[#100D2B] text-white text-xs placeholder-[#D5D2E5]/50 focus:border-[#8B35FF] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Gallery List */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#D5D2E5]">Loading templates...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#D5D2E5]">
              No templates found matching your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filtered.map((tItem) => (
                <div
                  key={tItem.id}
                  className="rounded-2xl border border-[#24164A] overflow-hidden bg-[#100D2B] shadow-lg hover:shadow-[0_0_20px_rgba(139,53,255,0.2)] hover:border-[#8B35FF]/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#08071F] overflow-hidden relative">
                      <img
                        src={tItem.thumbnail || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"}
                        alt={tItem.title}
                        className="w-full h-full object-cover opacity-90"
                      />
                      <span className="absolute top-2 left-2 bg-[#08071F]/90 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded text-[#C084FC] border border-[#8B35FF]/30 shadow-xs">
                        {getCategoryLabel(tItem.category)}
                      </span>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h4 className="font-bold text-sm text-white">{tItem.title}</h4>
                      <p className="text-xs text-[#D5D2E5] line-clamp-2">{tItem.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => setPreviewTemplate(tItem)}
                      className="flex-1 py-2 px-2.5 rounded-lg border border-[#24164A] bg-[#191638] text-[#D5D2E5] hover:bg-[#24164A] hover:text-white text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t("tmpl_modal.preview")}
                    </button>
                    <button
                      disabled={creating}
                      onClick={() => handleUseTemplate(tItem)}
                      className="flex-1 py-2 px-2.5 rounded-lg bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white disabled:opacity-50 text-xs font-semibold flex items-center justify-center gap-1 shadow-md shadow-[#8B35FF]/20"
                    >
                      {creating ? "..." : t("tmpl_modal.use")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Inner Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-60 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#191638] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-[0_0_50px_rgba(139,53,255,0.3)] border border-[#8B35FF]/40 flex flex-col">
            <div className="p-5 border-b border-[#24164A] bg-[#100D2B] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#C084FC]">
                  {getCategoryLabel(previewTemplate.category)}
                </span>
                <h4 className="text-lg font-bold text-white">{previewTemplate.title}</h4>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 text-[#D5D2E5] hover:text-white hover:bg-[#24164A] rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 bg-[#191638]">
              <img
                src={previewTemplate.thumbnail}
                alt={previewTemplate.title}
                className="w-full h-72 object-cover rounded-xl shadow-md border border-[#24164A]"
              />
              <p className="text-xs text-[#D5D2E5] leading-relaxed">
                {previewTemplate.description}
              </p>
            </div>
            <div className="p-4 border-t border-[#24164A] bg-[#100D2B] flex items-center justify-end gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-lg border border-[#24164A] text-xs font-semibold text-[#D5D2E5] hover:bg-[#24164A] hover:text-white"
              >
                {t("editor.back")}
              </button>
              <button
                disabled={creating}
                onClick={() => handleUseTemplate(previewTemplate)}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white text-xs font-bold shadow-md shadow-[#8B35FF]/30"
              >
                {creating ? "..." : t("tmpl_modal.use")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
