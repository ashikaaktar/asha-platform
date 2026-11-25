"use client";

import { useEffect, useState } from "react";
import SectionRenderer from "@/components/renderer/SectionRenderer";
import { SectionData } from "@/lib/types";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface PublishedPage {
  id: string;
  title: string;
  slug: string;
  isHomepage: boolean;
  orderIndex: number;
  sections: SectionData[];
}

interface PublishedData {
  websiteId: string;
  name: string;
  subdomain: string;
  themeConfig: {
    primaryColor: string;
    fontFamily: string;
    borderRadius: string;
  };
  pages: PublishedPage[];
  publishedAt: string;
}

export default function PublicSiteViewer({
  initialData,
  initialPageSlug = "home",
}: {
  initialData: PublishedData;
  initialPageSlug?: string;
}) {
  const [activePageSlug, setActivePageSlug] = useState<string>(initialPageSlug);

  useEffect(() => {
    // Record real analytics page view event on mount and page switch
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        websiteId: initialData.websiteId,
        pageSlug: activePageSlug,
        referrer: typeof document !== "undefined" ? document.referrer : null,
      }),
    }).catch(() => {});
  }, [activePageSlug, initialData.websiteId]);

  const activePage =
    initialData.pages.find((p) => p.slug === activePageSlug) || initialData.pages[0];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Public Published Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            {initialData.name}
          </span>

          <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
            {initialData.pages.map((p) => (
              <button
                key={p.slug}
                onClick={() => setActivePageSlug(p.slug)}
                className={`transition-colors cursor-pointer ${
                  activePageSlug === p.slug
                    ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
                    : "hover:text-blue-600"
                }`}
              >
                {p.title}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Render Active Page Sections */}
      <main className="flex-1">
        {activePage?.sections.map((section, idx) => (
          <SectionRenderer key={section.id || idx} section={section} isEditor={false} />
        ))}
      </main>

      {/* ASHA Powered Badge */}
      <div className="py-4 bg-slate-900 text-slate-400 text-center text-xs flex items-center justify-center gap-2">
        <span>Published with</span>
        <Link href="/" className="font-bold text-white hover:text-blue-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" /> ASHA
        </Link>
      </div>
    </div>
  );
}
