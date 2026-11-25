"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Users,
  Layout,
  Globe,
  Sliders,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  ExternalLink,
  Plus,
  BarChart3,
  HardDrive,
  Sparkles,
  Lock,
} from "lucide-react";
import { TEMPLATE_CATEGORIES } from "@/lib/constants";

export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "websites" | "templates" | "settings"
  >("overview");

  // Admin stats
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentWebsites, setRecentWebsites] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Users tab state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Websites tab state
  const [websitesList, setWebsitesList] = useState<any[]>([]);
  const [websiteSearch, setWebsiteSearch] = useState("");
  const [websiteStatusFilter, setWebsiteStatusFilter] = useState("ALL");
  const [loadingWebsites, setLoadingWebsites] = useState(false);

  // Templates tab state
  const [templatesList, setTemplatesList] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [newTemplateModal, setNewTemplateModal] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState("Business");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");

  // Platform settings
  const [settings, setSettings] = useState<Record<string, string>>({
    platform_name: "ASHA",
    default_website_limit: "5",
    default_ai_limit: "20",
    default_storage_mb: "100",
    subdomain_suffix: "asha.site",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Feedback notifications
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch admin overview stats
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401 || res.status === 403) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      setStats(data.stats);
      setRecentUsers(data.recentUsers || []);
      setRecentWebsites(data.recentWebsites || []);
    } catch {
      setError("Failed to fetch admin statistics.");
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(
        `/api/admin/users${userSearch ? `?search=${encodeURIComponent(userSearch)}` : ""}`
      );
      const data = await res.json();
      setUsersList(data.users || []);
    } catch {
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch websites
  const fetchWebsites = async () => {
    setLoadingWebsites(true);
    try {
      const query = new URLSearchParams();
      if (websiteSearch) query.set("search", websiteSearch);
      if (websiteStatusFilter !== "ALL") query.set("status", websiteStatusFilter);

      const res = await fetch(`/api/admin/websites?${query.toString()}`);
      const data = await res.json();
      setWebsitesList(data.websites || []);
    } catch {
    } finally {
      setLoadingWebsites(false);
    }
  };

  // Fetch templates
  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      setTemplatesList(data.templates || []);
    } catch {
    } finally {
      setLoadingTemplates(false);
    }
  };

  // Fetch platform settings
  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch {
    }
  };

  useEffect(() => {
    fetchStats();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "websites") fetchWebsites();
    if (activeTab === "templates") fetchTemplates();
  }, [activeTab]);

  // Handle user status update (ACTIVE / SUSPENDED)
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeedback(`User status changed to ${newStatus}.`);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle admin unpublishing website
  const handleAdminUnpublish = async (websiteId: string) => {
    try {
      const res = await fetch("/api/admin/websites", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId, action: "unpublish" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeedback("Website unpublished by administrator.");
      fetchWebsites();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle admin deleting website
  const handleAdminDeleteWebsite = async (websiteId: string, name: string) => {
    if (!confirm(`Delete website "${name}" permanently?`)) return;
    try {
      const res = await fetch(`/api/admin/websites?websiteId=${websiteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeedback("Website deleted.");
      fetchWebsites();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle saving platform settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeedback("Platform settings saved successfully.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  // Create template
  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle.trim() || !newTemplateDesc.trim()) return;

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTemplateTitle.trim(),
          category: newTemplateCategory,
          description: newTemplateDesc.trim(),
          thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
          isFeatured: false,
          isPublished: true,
          data: { pages: [] },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewTemplateModal(false);
      setNewTemplateTitle("");
      setNewTemplateDesc("");
      setFeedback("Template added successfully.");
      fetchTemplates();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTemplate = async (templateId: string, title: string) => {
    if (!confirm(`Delete template "${title}"?`)) return;
    try {
      const res = await fetch(`/api/templates/${templateId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeedback("Template removed.");
      fetchTemplates();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loadingStats) {
    return (
      <div className="min-h-screen flex flex-col bg-[#08071F]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#8B35FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#D5D2E5] font-medium">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#08071F] text-[#D5D2E5] selection:bg-[#8B35FF]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2D2A5D]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#181340] text-[#C084FC] flex items-center justify-center shadow-xs border border-[#8B35FF]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">{language === "bn" ? "সুপার এডমিন ড্যাশবোর্ড" : "Super Admin Dashboard"}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#181340] text-[#C084FC] text-[10px] font-bold uppercase tracking-wider border border-[#8B35FF]/30">
                  Full Authorization
                </span>
              </div>
              <p className="text-xs text-[#D5D2E5]">
                {language === "bn" ? "গ্লোবাল ইউজার পরিচালনা, ওয়েবসাইট মডারেশন, টেমপ্লেট কন্ট্রোল এবং প্ল্যাটফর্ম সেটিংস।" : "Manage global users, review published websites, control templates, and adjust platform limits."}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] text-xs font-semibold text-[#D5D2E5] hover:bg-[#181340] hover:text-white"
          >
            {language === "bn" ? "ইউজার ভিউতে যান" : "Switch to User View"}
          </Link>
        </div>

        {/* Feedback / Error Alerts */}
        {feedback && (
          <div className="p-4 rounded-2xl bg-[#20A887]/20 border border-[#20A887]/40 text-[#20A887] text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#20A887]" />
              {feedback}
            </span>
            <button onClick={() => setFeedback(null)} className="text-[#20A887] font-bold">
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

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#2D2A5D] pb-2">
          {[
            { id: "overview", label: "Overview & Analytics", icon: BarChart3 },
            { id: "users", label: "User Management", icon: Users },
            { id: "websites", label: "Website Moderation", icon: Layout },
            { id: "templates", label: "Template Catalog", icon: Sparkles },
            { id: "settings", label: "Platform Limits & Config", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${active
                    ? "bg-gradient-to-r from-[#8B35FF] to-[#176BFF] text-white shadow-md shadow-[#8B35FF]/30"
                    : "bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] text-[#D5D2E5] hover:bg-[#181340] hover:text-white"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-5 rounded-2xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-1">
                <span className="text-[10px] font-bold text-[#D5D2E5] uppercase tracking-wider">
                  Total Users
                </span>
                <div className="text-2xl font-extrabold text-white">
                  {stats?.totalUsers ?? "..."}
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-1">
                <span className="text-[10px] font-bold text-[#D5D2E5] uppercase tracking-wider">
                  Total Websites
                </span>
                <div className="text-2xl font-extrabold text-white">
                  {stats?.totalWebsites ?? "..."}
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-1">
                <span className="text-[10px] font-bold text-[#D5D2E5] uppercase tracking-wider">
                  Published
                </span>
                <div className="text-2xl font-extrabold text-[#20A887]">
                  {stats?.publishedWebsites ?? "..."}
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-1">
                <span className="text-[10px] font-bold text-[#D5D2E5] uppercase tracking-wider">
                  Drafts
                </span>
                <div className="text-2xl font-extrabold text-amber-400">
                  {stats?.draftWebsites ?? "..."}
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-1">
                <span className="text-[10px] font-bold text-[#D5D2E5] uppercase tracking-wider">
                  Templates
                </span>
                <div className="text-2xl font-extrabold text-[#C084FC]">
                  {stats?.totalTemplates ?? "..."}
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-1">
                <span className="text-[10px] font-bold text-[#D5D2E5] uppercase tracking-wider">
                  Total Visits
                </span>
                <div className="text-2xl font-extrabold text-[#38BDF8]">
                  {stats?.totalAnalyticsEvents ?? "..."}
                </div>
              </div>
            </div>

            {/* Recent Activity Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div className="p-6 rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Recent Registrations</span>
                  <span className="text-xs text-[#C084FC] font-semibold cursor-pointer" onClick={() => setActiveTab("users")}>View all</span>
                </h3>
                <div className="divide-y divide-[#24164A]">
                  {recentUsers.map((u) => (
                    <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[#D5D2E5] font-mono">{u.email}</span>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === "ADMIN" ? "bg-[#181340] text-[#C084FC] border border-[#8B35FF]/30" : "bg-[#07051A] text-[#D5D2E5] border border-[#2D2A5D]"
                          }`}>
                          {u.role}
                        </span>
                        <span className="text-[10px] text-[#D5D2E5]/70 block mt-1">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Websites */}
              <div className="p-6 rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Latest Created Websites</span>
                  <span className="text-xs text-[#C084FC] font-semibold cursor-pointer" onClick={() => setActiveTab("websites")}>View all</span>
                </h3>
                <div className="divide-y divide-[#24164A]">
                  {recentWebsites.map((w) => (
                    <div key={w.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{w.name}</span>
                        <span className="text-[#D5D2E5]">by {w.user?.name} ({w.category})</span>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${w.status === "PUBLISHED" ? "bg-[#20A887]/20 text-[#20A887] border border-[#20A887]/30" : "bg-amber-950/40 text-amber-400 border border-amber-500/30"
                          }`}>
                          {w.status}
                        </span>
                        <span className="text-[10px] text-[#D5D2E5]/70 block mt-1">
                          {new Date(w.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="p-6 rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Registered Users</h3>
                <p className="text-xs text-[#D5D2E5]">
                  Manage platform users, inspect project counts, and toggle account statuses.
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#B98AFF] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                  placeholder="Search user by name or email..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white text-xs placeholder-[#D5D2E5]/50 focus:border-[#8B35FF]"
                />
              </div>
            </div>

            {loadingUsers ? (
              <div className="py-12 text-center text-xs text-[#D5D2E5]">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#07051A] border-b border-[#2D2A5D] text-[#D5D2E5] font-bold uppercase">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Websites</th>
                      <th className="p-3">AI Quota</th>
                      <th className="p-3">Created</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#24164A]">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-[#181340]/30 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-white block">{u.name}</span>
                          <span className="text-[#D5D2E5] font-mono text-[11px]">{u.email}</span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${u.role === "ADMIN"
                                ? "bg-[#181340] text-[#C084FC] border border-[#8B35FF]/30"
                                : "bg-[#07051A] text-[#D5D2E5] border border-[#2D2A5D]"
                              }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${u.status === "ACTIVE"
                                ? "bg-[#20A887]/20 text-[#20A887] border border-[#20A887]/30"
                                : "bg-red-950/40 text-red-400 border border-red-500/30"
                              }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-white">{u._count?.websites || 0}</td>
                        <td className="p-3 text-[#D5D2E5]">
                          {u.planUsage?.aiGenerationsUsed || 0} / {u.planUsage?.maxAiGenerations || 10}
                        </td>
                        <td className="p-3 text-[#D5D2E5]/70">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] border transition-colors ${u.status === "ACTIVE"
                                ? "border-red-500/40 text-red-400 hover:bg-red-950/40"
                                : "border-[#20A887]/40 text-[#20A887] hover:bg-[#20A887]/20"
                              }`}
                          >
                            {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WEBSITE MODERATION */}
        {activeTab === "websites" && (
          <div className="p-6 rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Platform Websites</h3>
                <p className="text-xs text-[#D5D2E5]">
                  Global inventory of websites created by all platform users.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={websiteStatusFilter}
                  onChange={(e) => setWebsiteStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white text-xs"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PUBLISHED">Published Only</option>
                  <option value="DRAFT">Drafts Only</option>
                </select>
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-[#B98AFF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={websiteSearch}
                    onChange={(e) => setWebsiteSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchWebsites()}
                    placeholder="Search websites..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white text-xs placeholder-[#D5D2E5]/50 focus:border-[#8B35FF]"
                  />
                </div>
              </div>
            </div>

            {loadingWebsites ? (
              <div className="py-12 text-center text-xs text-[#D5D2E5]">Loading websites...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#07051A] border-b border-[#2D2A5D] text-[#D5D2E5] font-bold uppercase">
                    <tr>
                      <th className="p-3">Website</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Subdomain / Live URL</th>
                      <th className="p-3">Visits</th>
                      <th className="p-3 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#24164A]">
                    {websitesList.map((w) => (
                      <tr key={w.id} className="hover:bg-[#181340]/30 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-white block">{w.name}</span>
                          <span className="text-[#D5D2E5]/70 text-[10px]">{w._count?.pages || 0} pages</span>
                        </td>
                        <td className="p-3 text-[#D5D2E5] font-medium">
                          {w.user?.name}
                          <span className="text-[10px] text-[#D5D2E5]/60 block">{w.user?.email}</span>
                        </td>
                        <td className="p-3 text-[#D5D2E5]">{w.category}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${w.status === "PUBLISHED"
                                ? "bg-[#20A887]/20 text-[#20A887] border border-[#20A887]/30"
                                : "bg-amber-950/40 text-amber-400 border border-amber-500/30"
                              }`}
                          >
                            {w.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px]">
                          {w.publishedSubdomain ? (
                            <Link
                              href={`/sites/${w.publishedSubdomain}`}
                              target="_blank"
                              className="text-[#38BDF8] hover:underline flex items-center gap-1"
                            >
                              /sites/{w.publishedSubdomain}
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            <span className="text-[#D5D2E5]/50">—</span>
                          )}
                        </td>
                        <td className="p-3 font-semibold text-[#C084FC]">
                          {w._count?.analyticsEvents || 0}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {w.status === "PUBLISHED" && (
                            <button
                              onClick={() => handleAdminUnpublish(w.id)}
                              className="px-2.5 py-1 rounded-lg border border-amber-500/40 text-amber-400 hover:bg-amber-950/40 font-semibold text-[11px]"
                            >
                              Unpublish
                            </button>
                          )}
                          <button
                            onClick={() => handleAdminDeleteWebsite(w.id, w.name)}
                            className="px-2.5 py-1 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-950/40 font-semibold text-[11px]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TEMPLATE CATALOG */}
        {activeTab === "templates" && (
          <div className="p-6 rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Template Library Management</h3>
                <p className="text-xs text-[#D5D2E5]">
                  Add, configure, or remove designer templates visible in the public gallery.
                </p>
              </div>
              <button
                onClick={() => setNewTemplateModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold text-xs shadow-md shadow-[#8B35FF]/30"
              >
                <Plus className="w-4 h-4" /> Add Template
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {templatesList.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-[#2D2A5D] overflow-hidden bg-[#07051A] shadow-xs p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="aspect-[16/10] bg-[#08071F] rounded-xl overflow-hidden">
                      <img src={t.thumbnail} alt={t.title} className="w-full h-full object-cover opacity-90" />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#C084FC]">
                      {t.category}
                    </span>
                    <h4 className="font-bold text-sm text-white">{t.title}</h4>
                    <p className="text-xs text-[#D5D2E5] line-clamp-2">{t.description}</p>
                  </div>
                  <div className="pt-2 border-t border-[#2D2A5D] flex items-center justify-between">
                    <span className="text-[10px] text-[#20A887] font-semibold">Active</span>
                    <button
                      onClick={() => handleDeleteTemplate(t.id, t.title)}
                      className="p-1.5 text-[#D5D2E5] hover:text-red-400 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PLATFORM SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl p-8 rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-lg space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Platform Limits & Configuration</h3>
              <p className="text-xs text-[#D5D2E5]">
                Server-side defaults for newly registered users and platform parameters.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div>
                <label className="block text-[#D5D2E5] font-semibold mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={settings.platform_name || "ASHA"}
                  onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#D5D2E5] font-semibold mb-1">
                    Default Website Limit (Free Plan)
                  </label>
                  <input
                    type="number"
                    value={settings.default_website_limit || "5"}
                    onChange={(e) =>
                      setSettings({ ...settings, default_website_limit: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#D5D2E5] font-semibold mb-1">
                    Default AI Generation Limit (Free Plan)
                  </label>
                  <input
                    type="number"
                    value={settings.default_ai_limit || "20"}
                    onChange={(e) =>
                      setSettings({ ...settings, default_ai_limit: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#D5D2E5] font-semibold mb-1">
                  Default Storage Limit (MB)
                </label>
                <input
                  type="number"
                  value={settings.default_storage_mb || "100"}
                  onChange={(e) =>
                    setSettings({ ...settings, default_storage_mb: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white"
                />
              </div>

              <div>
                <label className="block text-[#D5D2E5] font-semibold mb-1">
                  Subdomain Suffix
                </label>
                <input
                  type="text"
                  value={settings.subdomain_suffix || "asha.site"}
                  onChange={(e) =>
                    setSettings({ ...settings, subdomain_suffix: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold text-xs shadow-md shadow-[#8B35FF]/30"
              >
                {savingSettings ? "Saving Settings..." : "Save Platform Settings"}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />

      {/* Add Template Modal */}
      {newTemplateModal && (
        <div className="fixed inset-0 z-50 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0B24]/85 backdrop-blur-xl rounded-3xl max-w-md w-full p-6 space-y-4 shadow-[0_0_50px_rgba(139,53,255,0.3)] border border-[#8B35FF]/40">
            <h3 className="text-lg font-bold text-white">Add New Template</h3>
            <form onSubmit={handleCreateTemplate} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#D5D2E5] font-semibold mb-1">Template Title</label>
                <input
                  type="text"
                  required
                  value={newTemplateTitle}
                  onChange={(e) => setNewTemplateTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white"
                />
              </div>
              <div>
                <label className="block text-[#D5D2E5] font-semibold mb-1">Category</label>
                <select
                  value={newTemplateCategory}
                  onChange={(e) => setNewTemplateCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white"
                >
                  {TEMPLATE_CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#D5D2E5] font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#2D2A5D]">
                <button
                  type="button"
                  onClick={() => setNewTemplateModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#2D2A5D] text-[#D5D2E5] font-semibold hover:bg-[#181340] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold shadow-md shadow-[#8B35FF]/30"
                >
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
