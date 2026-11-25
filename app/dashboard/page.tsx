"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiGeneratorModal from "@/components/dashboard/AiGeneratorModal";
import TemplatePickerModal from "@/components/dashboard/TemplatePickerModal";
import AnalyticsModal from "@/components/dashboard/AnalyticsModal";
import PlanUpgradeModal from "@/components/dashboard/PlanUpgradeModal";
import ExportModal from "@/components/editor/ExportModal";
import {
  Sparkles,
  Plus,
  Layout,
  Globe,
  MoreVertical,
  ExternalLink,
  Edit3,
  Copy,
  Trash2,
  CheckCircle,
  Clock,
  BarChart3,
  Search,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Zap,
  FileCode,
} from "lucide-react";

interface WebsiteItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: "DRAFT" | "PUBLISHED";
  publishedSubdomain: string | null;
  thumbnail: string | null;
  updatedAt: string;
  createdAt: string;
  pages: { id: string; title: string; slug: string; isHomepage: boolean }[];
  _count?: { analyticsEvents: number };
}

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [publicTunnelUrl, setPublicTunnelUrl] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tunnel")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.tunnelUrl) setPublicTunnelUrl(d.tunnelUrl);
      })
      .catch(() => {});
  }, []);

  // Modals state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [blankModalOpen, setBlankModalOpen] = useState(false);
  const [blankName, setBlankName] = useState("");
  const [blankCategory, setBlankCategory] = useState("Business");

  // Renaming modal
  const [renameTarget, setRenameTarget] = useState<WebsiteItem | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Deletion modal
  const [deleteTarget, setDeleteTarget] = useState<WebsiteItem | null>(null);

  // Analytics modal
  const [analyticsSite, setAnalyticsSite] = useState<WebsiteItem | null>(null);

  // Plan modal
  const [planModalOpen, setPlanModalOpen] = useState(false);

  // Export modal
  const [exportSite, setExportSite] = useState<WebsiteItem | null>(null);

  // General error / notification
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWebsites = async () => {
    try {
      const res = await fetch("/api/websites");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setWebsites(data.websites || []);
    } catch {
      setError("Failed to load websites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const totalCount = websites.length;
  const publishedCount = websites.filter((w) => w.status === "PUBLISHED").length;
  const draftCount = websites.filter((w) => w.status === "DRAFT").length;
  const totalViews = websites.reduce((acc, curr) => acc + (curr._count?.analyticsEvents || 0), 0);

  const filteredWebsites = websites.filter((w) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && w.status === "PUBLISHED") ||
      (statusFilter === "DRAFT" && w.status === "DRAFT");
    const matchesSearch =
      !search.trim() ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.category.toLowerCase().includes(search.toLowerCase()) ||
      (w.publishedSubdomain && w.publishedSubdomain.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleCreateBlank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blankName.trim()) return;
    try {
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: blankName, category: blankCategory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBlankModalOpen(false);
      setBlankName("");
      router.push(`/editor/${data.website.id}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDuplicate = async (site: WebsiteItem) => {
    try {
      const res = await fetch(`/api/websites/${site.id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(`"${site.name}" duplicate created.`);
      fetchWebsites();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget || !renameValue.trim()) return;
    try {
      const res = await fetch(`/api/websites/${renameTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRenameTarget(null);
      setMessage("Website renamed successfully.");
      fetchWebsites();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/websites/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDeleteTarget(null);
      setMessage("Website deleted successfully.");
      fetchWebsites();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUnpublish = async (site: WebsiteItem) => {
    try {
      const res = await fetch(`/api/websites/${site.id}/unpublish`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(`"${site.name}" unpublished.`);
      fetchWebsites();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08071F] text-[#D5D2E5] selection:bg-[#8B35FF]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Banner / Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <span className="text-xs font-bold text-[#C084FC] uppercase tracking-wider">
              {t("dash.top_tag")}
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              {t("dash.title")}
            </h1>
            <p className="text-sm text-[#D5D2E5] mt-1">
              {t("dash.subtitle")}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/media"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2D2A5D] bg-[#0D0B24]/85 backdrop-blur-xl hover:bg-[#181340] text-[#D5D2E5] hover:text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-[#B98AFF]" />
              {t("dash.btn_media")}
            </Link>

            <button
              onClick={() => setPlanModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#8B35FF]/40 bg-[#181340] hover:bg-[#8B35FF]/20 text-[#C084FC] font-semibold text-xs shadow-xs transition-colors"
            >
              <Zap className="w-4 h-4 text-[#A855F7]" />
              {t("dash.btn_plans")}
            </button>

            <button
              onClick={() => setAiModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold text-xs shadow-md shadow-[#8B35FF]/30 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              {t("dash.btn_ai_gen")}
            </button>

            <div className="relative group">
              <button
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold text-xs shadow-md shadow-[#8B35FF]/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                {t("dash.btn_new_website")}
              </button>
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#0D0B24]/95 backdrop-blur-xl border border-[#2D2A5D] rounded-2xl shadow-xl py-2 hidden group-hover:block z-30">
                <button
                  onClick={() => setAiModalOpen(true)}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#D5D2E5] hover:bg-[#181340] hover:text-[#C084FC] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#A855F7]" />
                  {t("dash.btn_ai_gen")}
                </button>
                <button
                  onClick={() => setTemplateModalOpen(true)}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#D5D2E5] hover:bg-[#181340] hover:text-[#C084FC] flex items-center gap-2"
                >
                  <Layout className="w-4 h-4 text-[#38BDF8]" />
                  {t("dash.btn_choose_template")}
                </button>
                <button
                  onClick={() => setBlankModalOpen(true)}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#D5D2E5] hover:bg-[#181340] hover:text-[#C084FC] flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#B98AFF]" />
                  {t("dash.btn_start_blank")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts / Feedback */}
        {message && (
          <div className="p-4 rounded-2xl bg-[#20A887]/20 border border-[#20A887]/40 text-[#20A887] text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#20A887]" />
              {message}
            </span>
            <button onClick={() => setMessage(null)} className="text-[#20A887] font-bold">
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              {error}
            </span>
            <button onClick={() => setError(null)} className="text-red-400 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Dashboard Overview Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-xl hover:-translate-y-1 hover:border-[#8B35FF]/60 hover:shadow-[0_12px_35px_rgba(139,53,255,0.25)] transition-all duration-300 space-y-2">
            <div className="flex items-center justify-between text-[#D5D2E5]">
              <span className="text-xs font-bold uppercase tracking-wider">{t("dash.metric_total_sites")}</span>
              <Layout className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="text-3xl font-extrabold text-white">{totalCount}</div>
            <p className="text-[11px] text-[#D5D2E5]">{t("dash.metric_total_desc")}</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-xl hover:-translate-y-1 hover:border-[#8B35FF]/60 hover:shadow-[0_12px_35px_rgba(139,53,255,0.25)] transition-all duration-300 space-y-2">
            <div className="flex items-center justify-between text-[#D5D2E5]">
              <span className="text-xs font-bold uppercase tracking-wider">{t("dash.metric_published")}</span>
              <Globe className="w-4 h-4 text-[#20A887]" />
            </div>
            <div className="text-3xl font-extrabold text-[#20A887]">{publishedCount}</div>
            <p className="text-[11px] text-[#D5D2E5]">{t("dash.metric_pub_desc")}</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-xl hover:-translate-y-1 hover:border-[#8B35FF]/60 hover:shadow-[0_12px_35px_rgba(139,53,255,0.25)] transition-all duration-300 space-y-2">
            <div className="flex items-center justify-between text-[#D5D2E5]">
              <span className="text-xs font-bold uppercase tracking-wider">{t("dash.metric_drafts")}</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400">{draftCount}</div>
            <p className="text-[11px] text-[#D5D2E5]">{t("dash.metric_draft_desc")}</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-xl hover:-translate-y-1 hover:border-[#8B35FF]/60 hover:shadow-[0_12px_35px_rgba(139,53,255,0.25)] transition-all duration-300 space-y-2">
            <div className="flex items-center justify-between text-[#D5D2E5]">
              <span className="text-xs font-bold uppercase tracking-wider">{t("dash.metric_visits")}</span>
              <BarChart3 className="w-4 h-4 text-[#C084FC]" />
            </div>
            <div className="text-3xl font-extrabold text-[#C084FC]">{totalViews}</div>
            <p className="text-[11px] text-[#D5D2E5]">{t("dash.metric_visit_desc")}</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === "ALL"
                  ? "bg-gradient-to-r from-[#8B35FF] to-[#176BFF] text-white shadow-md shadow-[#8B35FF]/30"
                  : "bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] text-[#D5D2E5] hover:bg-[#181340] hover:text-white"
              }`}
            >
              {t("dash.filter_all")} ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter("PUBLISHED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === "PUBLISHED"
                  ? "bg-[#20A887] text-white shadow-md shadow-[#20A887]/30"
                  : "bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] text-[#D5D2E5] hover:bg-[#181340] hover:text-white"
              }`}
            >
              {t("dash.filter_published")} ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter("DRAFT")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === "DRAFT"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                  : "bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] text-[#D5D2E5] hover:bg-[#181340] hover:text-white"
              }`}
            >
              {t("dash.filter_draft")} ({draftCount})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#B98AFF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("dash.search_placeholder")}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white text-xs placeholder-[#D5D2E5]/50 focus:border-[#8B35FF] transition-colors"
            />
          </div>
        </div>

        {/* Websites Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm text-[#D5D2E5]">Loading...</div>
        ) : filteredWebsites.length === 0 ? (
          <div className="py-20 px-4 text-center rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-[#181340] text-[#C084FC] flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-8 h-8 text-[#A855F7]" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-xl font-bold text-white">{t("dash.empty_title")}</h3>
              <p className="text-xs text-[#D5D2E5] leading-relaxed">
                {t("dash.empty_desc")}
              </p>
            </div>
            {websites.length === 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setAiModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold text-xs shadow-md shadow-[#8B35FF]/30 transition-all"
                >
                  {t("dash.btn_create_first")}
                </button>
                <button
                  onClick={() => setTemplateModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-[#181340] border border-[#8B35FF]/40 text-[#C084FC] hover:bg-[#8B35FF]/20 font-semibold text-xs transition-colors"
                >
                  {t("dash.btn_choose_template")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.map((site) => (
              <div
                key={site.id}
                className="rounded-3xl border border-[#2D2A5D] bg-[#0D0B24]/85 backdrop-blur-xl overflow-hidden shadow-lg hover:shadow-[0_15px_35px_rgba(139,53,255,0.3)] hover:border-[#8B35FF]/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail / Header Preview */}
                  <div className="aspect-[16/9] bg-[#07051A] relative overflow-hidden border-b border-[#2D2A5D]">
                    <img
                      src={
                        site.thumbnail ||
                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={site.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />

                    {/* Status badge */}
                    <div className="absolute top-3 left-3">
                      {site.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#20A887]/90 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
                          <CheckCircle className="w-3 h-3" /> {t("dash.filter_published")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
                          <Clock className="w-3 h-3" /> {t("dash.filter_draft")}
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg bg-[#08071F]/90 backdrop-blur-md text-[#C084FC] border border-[#8B35FF]/30 text-[11px] font-bold shadow-xs">
                        {site.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-white leading-snug truncate">
                        {site.name}
                      </h3>
                    </div>

                    {/* Subdomain link or draft note */}
                    {site.status === "PUBLISHED" && site.publishedSubdomain ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono text-[#38BDF8] bg-[#07051A] px-3 py-2 rounded-xl border border-[#10B981]/40">
                          <a
                            href={publicTunnelUrl ? `${publicTunnelUrl}/sites/${site.publishedSubdomain}` : `/sites/${site.publishedSubdomain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-[#38BDF8] hover:text-[#7DD3FC] hover:underline flex items-center gap-1.5 font-bold"
                            title="Open live website in new tab"
                          >
                            <Globe className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                            <span className="truncate">/sites/{site.publishedSubdomain}</span>
                          </a>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                const fullUrl = publicTunnelUrl
                                  ? `${publicTunnelUrl}/sites/${site.publishedSubdomain}`
                                  : `${window.location.origin}/sites/${site.publishedSubdomain}`;
                                navigator.clipboard.writeText(fullUrl);
                                setCopiedId(site.id);
                                setTimeout(() => setCopiedId(null), 2000);
                              }}
                              title="Copy real live website link"
                              className="p-1 px-1.5 bg-[#100D2B] hover:bg-[#1E1642] text-[#D5D2E5] hover:text-white rounded-lg border border-[#2D2A5D] text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Copy className="w-3 h-3 text-[#38BDF8]" />
                              <span>{copiedId === site.id ? (language === "bn" ? "কপি হয়েছে!" : "Copied!") : (language === "bn" ? "কপি" : "Copy")}</span>
                            </button>
                            <a
                              href={publicTunnelUrl ? `${publicTunnelUrl}/sites/${site.publishedSubdomain}` : `/sites/${site.publishedSubdomain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open live website in new tab"
                              className="p-1 px-2 bg-[#10B981]/20 hover:bg-[#10B981]/40 text-[#34D399] rounded-lg border border-[#10B981]/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>{language === "bn" ? "ভিজিট" : "Visit"}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-[#D5D2E5]/60 font-medium">
                        {t("publish_modal.desc")}
                      </div>
                    )}

                    {/* Metadata & Visits */}
                    <div className="pt-2 border-t border-[#2D2A5D] flex items-center justify-between text-[11px] text-[#D5D2E5]">
                      <span>{site.pages.length} {t("dash.card_pages")}</span>
                      <button
                        onClick={() => setAnalyticsSite(site)}
                        title="View real visitor analytics"
                        className="flex items-center gap-1 font-semibold text-[#C084FC] hover:text-white hover:underline cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-[#C084FC]" />
                        {site._count?.analyticsEvents || 0} {t("dash.card_views")}
                      </button>
                      <span>
                        {t("dash.card_updated")} {new Date(site.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-6 pt-0 border-t border-[#2D2A5D] flex items-center justify-between gap-2">
                  <Link
                    href={`/editor/${site.id}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#8B35FF]/20 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {t("dash.card_edit")}
                  </Link>

                  {site.status === "PUBLISHED" ? (
                    <button
                      onClick={() => handleUnpublish(site)}
                      title="Unpublish website"
                      className="py-2 px-3 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-[#D5D2E5] hover:bg-amber-950/40 hover:text-amber-400 hover:border-amber-500/40 text-xs font-semibold transition-colors"
                    >
                      {t("dash.card_unpublish")}
                    </button>
                  ) : (
                    <Link
                      href={`/editor/${site.id}?publish=true`}
                      className="py-2 px-3 rounded-xl border border-[#8B35FF]/40 bg-[#07051A] text-[#C084FC] hover:bg-[#8B35FF]/20 text-xs font-semibold transition-colors"
                    >
                      {t("editor.publish_btn")}
                    </Link>
                  )}

                  {/* More actions dropdown menu */}
                  <div className="relative group/menu">
                    <button className="p-2 text-[#D5D2E5] hover:text-white rounded-xl hover:bg-[#181340] transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 bottom-full mb-1 w-44 bg-[#0D0B24]/95 backdrop-blur-xl border border-[#2D2A5D] rounded-2xl shadow-xl py-1.5 hidden group-hover/menu:block z-30">
                      <button
                        onClick={() => setAnalyticsSite(site)}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[#C084FC] hover:bg-[#181340] flex items-center gap-2"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-[#C084FC]" />
                        {t("dash.card_analytics")}
                      </button>
                      <button
                        onClick={() => {
                          setRenameTarget(site);
                          setRenameValue(site.name);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[#D5D2E5] hover:bg-[#181340] hover:text-white flex items-center gap-2"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#B98AFF]" />
                        {t("dash.card_rename")}
                      </button>
                      <button
                        onClick={() => handleDuplicate(site)}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[#D5D2E5] hover:bg-[#181340] hover:text-white flex items-center gap-2"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#B98AFF]" />
                        {t("dash.card_duplicate")}
                      </button>
                      <button
                        onClick={() => setExportSite(site)}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[#38BDF8] hover:bg-[#181340] flex items-center gap-2"
                      >
                        <FileCode className="w-3.5 h-3.5 text-[#38BDF8]" />
                        {t("dash.card_export")}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(site)}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        {t("dash.card_delete")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* AI Generator Modal */}
      <AiGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSuccess={() => fetchWebsites()}
      />

      {/* Template Picker Modal */}
      <TemplatePickerModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSuccess={() => fetchWebsites()}
      />

      {/* Blank Starter Modal */}
      {blankModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0B24]/95 backdrop-blur-xl rounded-3xl max-w-md w-full p-6 space-y-6 shadow-[0_0_50px_rgba(139,53,255,0.3)] border border-[#8B35FF]/40">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D2A5D]">
              <h3 className="text-xl font-bold text-white">{t("blank_modal.title")}</h3>
              <button
                onClick={() => setBlankModalOpen(false)}
                className="p-1 text-[#D5D2E5] hover:text-white rounded-lg hover:bg-[#181340]"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateBlank} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#D5D2E5] mb-1">
                  {t("blank_modal.name_label")}
                </label>
                <input
                  type="text"
                  required
                  value={blankName}
                  onChange={(e) => setBlankName(e.target.value)}
                  placeholder={t("blank_modal.name_placeholder")}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white text-sm focus:border-[#8B35FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#D5D2E5] mb-1">{t("blank_modal.category_label")}</label>
                <select
                  value={blankCategory}
                  onChange={(e) => setBlankCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white text-sm"
                >
                  <option value="Business">{t("cat.business")}</option>
                  <option value="Portfolio">{t("cat.portfolio")}</option>
                  <option value="Agency">{t("cat.agency")}</option>
                  <option value="Personal Website">{t("cat.personal")}</option>
                  <option value="Blog">{t("cat.blog")}</option>
                  <option value="Landing Page">{t("cat.landing")}</option>
                  <option value="Online Store">{t("cat.store")}</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2D2A5D]">
                <button
                  type="button"
                  onClick={() => setBlankModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#2D2A5D] text-xs font-semibold text-[#D5D2E5] hover:bg-[#181340] hover:text-white"
                >
                  {t("blank_modal.btn_cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold text-xs shadow-md shadow-[#8B35FF]/30"
                >
                  {t("blank_modal.btn_create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0B24]/95 backdrop-blur-xl rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-[0_0_50px_rgba(139,53,255,0.3)] border border-[#8B35FF]/40">
            <h3 className="text-lg font-bold text-white">{t("rename_modal.title")}</h3>
            <form onSubmit={handleRename} className="space-y-4">
              <input
                type="text"
                required
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white text-sm focus:border-[#8B35FF]"
              />
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2D2A5D]">
                <button
                  type="button"
                  onClick={() => setRenameTarget(null)}
                  className="px-4 py-2 rounded-xl border border-[#2D2A5D] text-xs font-semibold text-[#D5D2E5] hover:bg-[#181340] hover:text-white"
                >
                  {t("rename_modal.btn_cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white text-xs font-bold shadow-md shadow-[#8B35FF]/30"
                >
                  {t("rename_modal.btn_save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0B24]/95 backdrop-blur-xl rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-[0_0_50px_rgba(239,68,68,0.2)] border border-red-500/40">
            <div className="w-12 h-12 rounded-2xl bg-red-950/50 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">{t("delete_modal.title")}</h3>
              <p className="text-xs text-[#D5D2E5]">
                {t("delete_modal.desc")}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#2D2A5D] text-xs font-semibold text-[#D5D2E5] hover:bg-[#181340] hover:text-white"
              >
                {t("delete_modal.btn_cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20"
              >
                {t("delete_modal.btn_confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {analyticsSite && (
        <AnalyticsModal
          isOpen={Boolean(analyticsSite)}
          onClose={() => setAnalyticsSite(null)}
          websiteId={analyticsSite.id}
          websiteName={analyticsSite.name}
          subdomain={analyticsSite.publishedSubdomain}
        />
      )}

      {/* Plan Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        onPlanUpdated={() => fetchWebsites()}
      />

      {/* Export Modal */}
      {exportSite && (
        <ExportModal
          isOpen={Boolean(exportSite)}
          onClose={() => setExportSite(null)}
          websiteId={exportSite.id}
          websiteName={exportSite.name}
        />
      )}
    </div>
  );
}
