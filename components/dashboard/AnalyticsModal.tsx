"use client";

import { useEffect, useState } from "react";
import {
  X,
  BarChart3,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteId: string;
  websiteName: string;
  subdomain?: string | null;
}

export default function AnalyticsModal({
  isOpen,
  onClose,
  websiteId,
  websiteName,
  subdomain,
}: AnalyticsModalProps) {
  const { t } = useLanguage();
  const [data, setData] = useState<{
    totalViews: number;
    topPages: { slug: string; count: number }[];
    recentEvents: { id: string; pageSlug: string; referrer: string | null; createdAt: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch(`/api/analytics?websiteId=${websiteId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isOpen, websiteId]);

  if (!isOpen) return null;

  const totalViews = data?.totalViews || 0;
  const topPages = data?.topPages || [];
  const recentEvents = data?.recentEvents || [];

  return (
    <div className="fixed inset-0 z-60 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#191638] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(139,53,255,0.3)] border border-[#8B35FF]/40 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#24164A] bg-[#100D2B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#24164A] text-[#C084FC] flex items-center justify-center border border-[#8B35FF]/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{websiteName}</h3>
                {subdomain && (
                  <span className="text-[11px] font-mono text-[#38BDF8] bg-[#100D2B] px-2 py-0.5 rounded-md border border-[#24164A]">
                    /sites/{subdomain}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#D5D2E5]">
                {t("analytics_modal.desc")} {websiteName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#D5D2E5] hover:text-white rounded-lg hover:bg-[#24164A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#191638]">
          {loading ? (
            <div className="py-16 text-center text-xs text-[#D5D2E5] space-y-2">
              <div className="w-8 h-8 border-3 border-[#8B35FF] border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Loading analytics...</p>
            </div>
          ) : (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#100D2B] border border-[#24164A] space-y-1">
                  <span className="text-[10px] font-bold text-[#C084FC] uppercase tracking-wider block">
                    {t("analytics_modal.total_views")}
                  </span>
                  <div className="text-3xl font-extrabold text-white">{totalViews}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#100D2B] border border-[#24164A] space-y-1">
                  <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider block">
                    {t("dash.card_pages")}
                  </span>
                  <div className="text-3xl font-extrabold text-white">{topPages.length}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#100D2B] border border-[#24164A] space-y-1">
                  <span className="text-[10px] font-bold text-[#20A887] uppercase tracking-wider block">
                    {t("dash.metric_visits")}
                  </span>
                  <div className="text-3xl font-extrabold text-white">{recentEvents.length}</div>
                </div>
              </div>

              {/* Top Pages Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span>{t("analytics_modal.top_pages")}</span>
                  <span className="text-[11px] text-[#D5D2E5] font-normal">{t("dash.card_views")}</span>
                </h4>
                {topPages.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#100D2B] border border-[#24164A] text-center text-xs text-[#D5D2E5]">
                    {t("analytics_modal.no_visits")}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {topPages.map((page) => {
                      const percentage = Math.round((page.count / Math.max(totalViews, 1)) * 100);
                      return (
                        <div
                          key={page.slug}
                          className="p-3 rounded-xl border border-[#24164A] bg-[#100D2B] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-semibold text-white">
                              /{page.slug}
                            </span>
                            <span className="font-bold text-[#C084FC]">
                              {page.count} ({percentage}%)
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-[#24164A] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#8B35FF] to-[#176BFF] rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Activity Log */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t("analytics_modal.recent_visits")}
                </h4>
                {recentEvents.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#100D2B] border border-[#24164A] text-center text-xs text-[#D5D2E5]">
                    {t("analytics_modal.no_visits")}
                  </div>
                ) : (
                  <div className="divide-y divide-[#24164A] border border-[#24164A] rounded-2xl overflow-hidden bg-[#100D2B]">
                    {recentEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3 flex items-center justify-between text-xs hover:bg-[#24164A]/30 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <span className="font-mono font-semibold text-white block">
                            Visited /{evt.pageSlug}
                          </span>
                          <span className="text-[11px] text-[#D5D2E5]/70">
                            Referrer: {evt.referrer || "Direct"}
                          </span>
                        </div>
                        <div className="text-right text-[11px] text-[#D5D2E5]/70 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#B98AFF]" />
                          <span>{new Date(evt.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#24164A] bg-[#100D2B] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#24164A] hover:bg-[#8B35FF]/30 text-white font-semibold text-xs border border-[#8B35FF]/30 transition-colors"
          >
            {t("analytics_modal.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
