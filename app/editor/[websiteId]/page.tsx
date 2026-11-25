"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EditorToolbar from "@/components/editor/EditorToolbar";
import SectionRenderer from "@/components/renderer/SectionRenderer";
import PageManagerModal from "@/components/editor/PageManagerModal";
import SectionLibraryModal from "@/components/editor/SectionLibraryModal";
import SectionSettingsDrawer from "@/components/editor/SectionSettingsDrawer";
import PublishModal from "@/components/editor/PublishModal";
import ExportModal from "@/components/editor/ExportModal";
import { PageData, SectionData, SectionType, WebsiteData } from "@/lib/types";
import { Plus, Sparkles, Layers, Sliders, Settings, AlertCircle } from "lucide-react";

export default function WebsiteEditorPage({
  params,
}: {
  params: Promise<{ websiteId: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { websiteId } = use(params);

  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active page state
  const [currentPageSlug, setCurrentPageSlug] = useState<string>("home");

  // View state
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

  // Modals & Drawers
  const [pageManagerOpen, setPageManagerOpen] = useState(false);
  const [sectionLibraryOpen, setSectionLibraryOpen] = useState(false);
  const [insertSectionIndex, setInsertSectionIndex] = useState<number | undefined>(undefined);
  const [editingSection, setEditingSection] = useState<SectionData | null>(null);
  const [publishModalOpen, setPublishModalOpen] = useState(
    searchParams.get("publish") === "true"
  );
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const fetchWebsiteData = async () => {
    try {
      const res = await fetch(`/api/websites/${websiteId}`);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setWebsite(data.website);

      // Default to homepage if exists, or first page
      const homePage = data.website.pages.find((p: any) => p.isHomepage);
      if (homePage) {
        setCurrentPageSlug(homePage.slug);
      } else if (data.website.pages.length > 0) {
        setCurrentPageSlug(data.website.pages[0].slug);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load website.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsiteData();
  }, [websiteId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-asha-bg">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading website editor...</p>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-asha-bg p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-asha-navy">Editor Error</h2>
          <p className="text-xs text-slate-500">{error || "Website not found."}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2.5 rounded-xl bg-asha-primary text-white text-xs font-bold hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const activePage =
    website.pages.find((p) => p.slug === currentPageSlug) || website.pages[0];

  // Save section edits to database
  const handleSaveSection = async (updatedSection: SectionData) => {
    if (!activePage || !updatedSection.id) return;
    setSaveStatus("saving");

    try {
      const res = await fetch(
        `/api/websites/${website.id}/pages/${activePage.id}/sections/${updatedSection.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: updatedSection.content,
            styles: updatedSection.styles,
            isVisible: updatedSection.isVisible,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save section changes");

      // Update local state
      setWebsite((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((p) => {
            if (p.id !== activePage.id) return p;
            return {
              ...p,
              sections: p.sections.map((s) => (s.id === updatedSection.id ? updatedSection : s)),
            };
          }),
        };
      });

      setSaveStatus("saved");
    } catch {
      setSaveStatus("unsaved");
    }
  };

  // Add new section to active page
  const handleAddSection = async (type: SectionType) => {
    if (!activePage) return;
    setSaveStatus("saving");

    try {
      const res = await fetch(
        `/api/websites/${website.id}/pages/${activePage.id}/sections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            insertAtIndex: insertSectionIndex,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await fetchWebsiteData();
      setSaveStatus("saved");
      setInsertSectionIndex(undefined);
    } catch {
      setSaveStatus("unsaved");
    }
  };

  // Delete section
  const handleDeleteSection = async (sectionId: string) => {
    if (!activePage) return;
    if (!confirm("Are you sure you want to remove this section?")) return;

    setSaveStatus("saving");
    try {
      const res = await fetch(
        `/api/websites/${website.id}/pages/${activePage.id}/sections/${sectionId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      await fetchWebsiteData();
      setSaveStatus("saved");
    } catch {
      setSaveStatus("unsaved");
    }
  };

  // Duplicate section
  const handleDuplicateSection = async (section: SectionData) => {
    if (!activePage) return;
    setSaveStatus("saving");

    try {
      const res = await fetch(
        `/api/websites/${website.id}/pages/${activePage.id}/sections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: section.type,
            content: section.content,
            styles: section.styles,
            insertAtIndex: section.orderIndex + 1,
          }),
        }
      );
      if (!res.ok) throw new Error("Duplicate failed");
      await fetchWebsiteData();
      setSaveStatus("saved");
    } catch {
      setSaveStatus("unsaved");
    }
  };

  // Move section Up or Down
  const handleMoveSection = async (index: number, direction: "up" | "down") => {
    if (!activePage) return;
    const sections = [...activePage.sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= sections.length) return;

    // Swap
    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;

    const sectionIds = sections.map((s) => s.id!).filter(Boolean);

    setSaveStatus("saving");
    try {
      const res = await fetch(
        `/api/websites/${website.id}/pages/${activePage.id}/sections`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionIds }),
        }
      );
      if (!res.ok) throw new Error("Reorder failed");
      await fetchWebsiteData();
      setSaveStatus("saved");
    } catch {
      setSaveStatus("unsaved");
    }
  };

  // Update theme settings
  const handleSaveTheme = async (primaryColor: string) => {
    try {
      const updatedTheme = { ...website.themeConfig, primaryColor };
      const res = await fetch(`/api/websites/${website.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeConfig: updatedTheme }),
      });
      if (res.ok) {
        setWebsite((prev) => (prev ? { ...prev, themeConfig: updatedTheme } : prev));
        setThemeModalOpen(false);
      }
    } catch {
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Top Editor Toolbar */}
      <EditorToolbar
        websiteName={website.name}
        websiteId={website.id}
        status={website.status}
        publishedSubdomain={website.publishedSubdomain}
        pages={website.pages}
        currentPageSlug={currentPageSlug}
        onSelectPage={(slug) => setCurrentPageSlug(slug)}
        onOpenPageManager={() => setPageManagerOpen(true)}
        deviceView={deviceView}
        onChangeDeviceView={(v) => setDeviceView(v)}
        isPreviewMode={isPreviewMode}
        onTogglePreviewMode={() => setIsPreviewMode(!isPreviewMode)}
        saveStatus={saveStatus}
        onSave={() => setSaveStatus("saved")}
        onOpenPublishModal={() => setPublishModalOpen(true)}
        onOpenThemeSettings={() => setThemeModalOpen(true)}
        onOpenExportModal={() => setExportModalOpen(true)}
      />

      {/* Main Editing Canvas Area */}
      <main className="flex-1 overflow-y-auto py-8 px-4 flex justify-center items-start">
        <div
          className={`bg-white transition-all duration-300 shadow-xl overflow-hidden min-h-[80vh] ${
            deviceView === "mobile"
              ? "w-[375px] rounded-[40px] border-[10px] border-slate-800 shadow-2xl my-4"
              : deviceView === "tablet"
              ? "w-[768px] rounded-[32px] border-[8px] border-slate-700 shadow-2xl my-4"
              : "w-full max-w-7xl rounded-2xl border border-slate-200"
          }`}
        >
          {/* In-canvas Page Navigation Bar */}
          <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-asha-navy">
                {website.name}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              {website.pages.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setCurrentPageSlug(p.slug)}
                  className={`py-1 px-2.5 rounded-lg transition-colors ${
                    p.slug === currentPageSlug
                      ? "text-blue-600 bg-blue-50"
                      : "hover:text-blue-600"
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Render Sections of Active Page */}
          {activePage?.sections.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <p className="text-sm text-slate-500">This page has no sections yet.</p>
              <button
                onClick={() => {
                  setInsertSectionIndex(0);
                  setSectionLibraryOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-asha-primary text-white text-xs font-bold shadow-md"
              >
                Add Your First Section
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activePage?.sections.map((section, index) => (
                <div key={section.id || index} className="relative group/canvas-sec">
                  <SectionRenderer
                    section={section}
                    isEditor={!isPreviewMode}
                    onEdit={(sec) => setEditingSection(sec)}
                    onDelete={(id) => handleDeleteSection(id)}
                    onDuplicate={(sec) => handleDuplicateSection(sec)}
                    onMoveUp={() => handleMoveSection(index, "up")}
                    onMoveDown={() => handleMoveSection(index, "down")}
                    canMoveUp={index > 0}
                    canMoveDown={index < activePage.sections.length - 1}
                  />

                  {/* Add Section Interstitial Trigger Button */}
                  {!isPreviewMode && (
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 z-30 opacity-0 group-hover/canvas-sec:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setInsertSectionIndex(index + 1);
                          setSectionLibraryOpen(true);
                        }}
                        className="py-1 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-lg flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Section
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Bottom Add Section Button */}
          {!isPreviewMode && activePage && (
            <div className="p-8 text-center border-t border-dashed border-slate-200 bg-slate-50/50">
              <button
                onClick={() => {
                  setInsertSectionIndex(activePage.sections.length);
                  setSectionLibraryOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-asha-navy font-bold text-xs hover:border-blue-500 hover:text-blue-600 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 text-blue-500" />
                Add Another Section
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Page Manager Modal */}
      <PageManagerModal
        isOpen={pageManagerOpen}
        onClose={() => setPageManagerOpen(false)}
        websiteId={website.id}
        pages={website.pages}
        currentPageSlug={currentPageSlug}
        onSelectPage={(slug) => setCurrentPageSlug(slug)}
        onPagesUpdated={() => fetchWebsiteData()}
      />

      {/* Section Library Modal */}
      <SectionLibraryModal
        isOpen={sectionLibraryOpen}
        onClose={() => setSectionLibraryOpen(false)}
        onAddSection={(type) => handleAddSection(type)}
      />

      {/* Section Settings Drawer */}
      <SectionSettingsDrawer
        isOpen={Boolean(editingSection)}
        section={editingSection}
        onClose={() => setEditingSection(null)}
        onSave={(updated) => {
          setEditingSection(updated);
          handleSaveSection(updated);
        }}
      />

      {/* Publish Modal */}
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        websiteId={website.id}
        websiteName={website.name}
        currentSubdomain={website.publishedSubdomain}
        status={website.status}
        onPublishedSuccess={(subdomain) => {
          setWebsite((prev) =>
            prev ? { ...prev, status: "PUBLISHED", publishedSubdomain: subdomain } : prev
          );
        }}
        onUnpublishedSuccess={() => {
          setWebsite((prev) =>
            prev ? { ...prev, status: "DRAFT", publishedSubdomain: null } : prev
          );
        }}
      />

      {/* Global Theme Settings Modal */}
      {themeModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-asha-navy">Theme Settings</h3>
              <button onClick={() => setThemeModalOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">
                  Primary Brand Accent
                </label>
                <div className="flex items-center gap-2">
                  {[
                    "#2563EB",
                    "#102A56",
                    "#38BDF8",
                    "#7C3AED",
                    "#16A34A",
                    "#D97706",
                    "#DC2626",
                  ].map((c) => (
                    <button
                      key={c}
                      onClick={() => handleSaveTheme(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        website.themeConfig.primaryColor === c
                          ? "scale-125 ring-2 ring-offset-2 ring-blue-500"
                          : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setThemeModalOpen(false)}
                className="px-4 py-2 bg-asha-primary text-white font-bold text-xs rounded-xl"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export HTML Modal */}
      {exportModalOpen && (
        <ExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          websiteId={website.id}
          websiteName={website.name}
        />
      )}
    </div>
  );
}
