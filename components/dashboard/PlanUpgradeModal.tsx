"use client";

import { useEffect, useState } from "react";
import { X, Check, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanUpdated?: () => void;
}

export default function PlanUpgradeModal({
  isOpen,
  onClose,
  onPlanUpdated,
}: PlanUpgradeModalProps) {
  const { t } = useLanguage();
  const [currentUsage, setCurrentUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanUsage = async () => {
    try {
      const res = await fetch("/api/user/plan");
      const data = await res.json();
      setCurrentUsage(data.planUsage);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchPlanUsage();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpgrade = async (planName: string) => {
    setUpgrading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(`Upgraded to ${planName} Plan!`);
      await fetchPlanUsage();
      onPlanUpdated?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpgrading(false);
    }
  };

  const currentPlanName = currentUsage?.planName || "Free";

  return (
    <div className="fixed inset-0 z-60 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#191638] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(139,53,255,0.3)] border border-[#8B35FF]/40 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#24164A] bg-[#100D2B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#24164A] text-[#C084FC] flex items-center justify-center border border-[#8B35FF]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{t("plan_modal.title")}</h3>
              <p className="text-xs text-[#D5D2E5]">
                {t("plan_modal.desc")}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#D5D2E5] hover:text-white rounded-lg hover:bg-[#24164A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#191638]">
          {message && (
            <div className="p-3.5 rounded-xl bg-[#20A887]/20 border border-[#20A887]/40 text-[#20A887] text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#20A887] shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Current Quota Consumption Progress Bars */}
          {currentUsage && (
            <div className="p-5 rounded-2xl bg-[#100D2B] border border-[#24164A] space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                {t("plan_modal.current_badge")}: <span className="text-[#C084FC]">{currentPlanName}</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Websites */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-[#D5D2E5]">
                    <span>{t("dash.metric_total_sites")}</span>
                    <span className="text-white">
                      {currentUsage.currentWebsites} / {currentUsage.maxWebsites}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#24164A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8B35FF] to-[#176BFF] rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (currentUsage.currentWebsites / currentUsage.maxWebsites) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* AI Generations */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-[#D5D2E5]">
                    <span>{t("feat.ai_title")}</span>
                    <span className="text-white">
                      {currentUsage.aiGenerationsUsed} / {currentUsage.maxAiGenerations}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#24164A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#A855F7] to-[#C084FC] rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (currentUsage.aiGenerationsUsed / currentUsage.maxAiGenerations) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Storage */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-[#D5D2E5]">
                    <span>{t("media.storage_used")}</span>
                    <span className="text-white">
                      {currentUsage.storageUsedMb} / {currentUsage.maxStorageMb} MB
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#24164A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#20A887] rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (currentUsage.storageUsedMb / currentUsage.maxStorageMb) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Plan Tiers Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Free Tier */}
            <div
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                currentPlanName === "Free"
                  ? "border-[#8B35FF]/60 bg-[#100D2B]"
                  : "border-[#24164A] bg-[#100D2B]"
              }`}
            >
              <div className="space-y-2">
                <span className="font-bold text-sm text-white block">{t("price.free")}</span>
                <div className="text-2xl font-extrabold text-white">{t("price.free_price")}</div>
                <ul className="space-y-2 text-[11px] text-[#D5D2E5]">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> {t("price.free_feat1")}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> {t("price.free_feat2")}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> {t("price.free_feat3")}
                  </li>
                </ul>
              </div>
              <button
                disabled={currentPlanName === "Free" || upgrading}
                onClick={() => handleUpgrade("Free")}
                className="w-full py-2 rounded-xl border border-[#24164A] font-bold text-xs text-[#D5D2E5] disabled:opacity-50 hover:bg-[#24164A] hover:text-white"
              >
                {currentPlanName === "Free" ? t("plan_modal.current_btn") : t("price.free")}
              </button>
            </div>

            {/* Pro Tier */}
            <div
              className={`p-5 rounded-2xl border-2 flex flex-col justify-between space-y-4 relative ${
                currentPlanName === "Pro"
                  ? "border-[#8B35FF] bg-gradient-to-b from-[#24164A] to-[#100D2B] shadow-[0_0_25px_rgba(139,53,255,0.3)]"
                  : "border-[#8B35FF]/50 bg-[#100D2B]"
              }`}
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#8B35FF] to-[#176BFF] text-white text-[10px] font-bold uppercase shadow-sm">
                {t("price.popular")}
              </span>
              <div className="space-y-2">
                <span className="font-bold text-sm text-white block">{t("price.pro")}</span>
                <div className="text-2xl font-extrabold text-white">
                  {t("price.pro_price")} <span className="text-xs font-normal text-[#D5D2E5]">{t("price.per_month")}</span>
                </div>
                <ul className="space-y-2 text-[11px] text-[#D5D2E5]">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#C084FC]" /> {t("price.pro_feat1")}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#C084FC]" /> {t("price.pro_feat2")}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#C084FC]" /> {t("price.pro_feat3")}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#C084FC]" /> {t("price.pro_feat4")}
                  </li>
                </ul>
              </div>
              <button
                disabled={currentPlanName === "Pro" || upgrading}
                onClick={() => handleUpgrade("Pro")}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold text-xs disabled:opacity-50 shadow-md shadow-[#8B35FF]/30"
              >
                {currentPlanName === "Pro" ? t("plan_modal.current_btn") : (upgrading ? t("plan_modal.upgrading") : t("plan_modal.btn_upgrade_pro"))}
              </button>
            </div>

            {/* Agency Tier */}
            <div
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                currentPlanName === "Agency"
                  ? "border-[#8B35FF] bg-gradient-to-b from-[#24164A] to-[#100D2B]"
                  : "border-[#24164A] bg-[#100D2B]"
              }`}
            >
              <div className="space-y-2">
                <span className="font-bold text-sm text-white block">{t("price.agency")}</span>
                <div className="text-2xl font-extrabold text-white">
                  {t("price.agency_price")} <span className="text-xs font-normal text-[#D5D2E5]">{t("price.per_month")}</span>
                </div>
                <ul className="space-y-2 text-[11px] text-[#D5D2E5]">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> {t("price.agency_feat1")}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> {t("price.agency_feat2")}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> {t("price.agency_feat3")}
                  </li>
                </ul>
              </div>
              <button
                disabled={currentPlanName === "Agency" || upgrading}
                onClick={() => handleUpgrade("Agency")}
                className="w-full py-2 rounded-xl bg-[#24164A] border border-[#8B35FF]/40 text-[#C084FC] font-bold text-xs hover:bg-[#8B35FF]/20 disabled:opacity-50 shadow-sm"
              >
                {currentPlanName === "Agency" ? t("plan_modal.current_btn") : t("price.contact_agency")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
