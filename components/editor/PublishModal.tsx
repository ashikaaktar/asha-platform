"use client";

import { useState, useEffect } from "react";
import {
  X,
  Globe,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Share2,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteId: string;
  websiteName: string;
  currentSubdomain?: string | null;
  status: "DRAFT" | "PUBLISHED";
  onPublishedSuccess: (subdomain: string) => void;
  onUnpublishedSuccess: () => void;
}

export default function PublishModal({
  isOpen,
  onClose,
  websiteId,
  websiteName,
  currentSubdomain,
  status,
  onPublishedSuccess,
  onUnpublishedSuccess,
}: PublishModalProps) {
  const { t, language } = useLanguage();

  const getCleanFallback = () => {
    const cleanName = (websiteName || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (cleanName && cleanName.length >= 3) return cleanName.slice(0, 24);
    const shortId = (websiteId || "").replace(/[^a-z0-9]/gi, "").slice(-6).toLowerCase() || "site";
    return `site-${shortId}`;
  };

  const [subdomain, setSubdomain] = useState(() => currentSubdomain || getCleanFallback());
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(
    currentSubdomain ? `/sites/${currentSubdomain}` : null
  );
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicTunnelBase, setPublicTunnelBase] = useState<string | null>(null);

  // Fetch live public cloud tunnel from /api/tunnel
  useEffect(() => {
    fetch("/api/tunnel")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.tunnelUrl) {
          setPublicTunnelBase(data.tunnelUrl);
        }
      })
      .catch(() => { });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateRandom = () => {
    const prefixes = ["royal", "smart", "nova", "prime", "apex", "swift", "modern", "elite", "star"];
    const topics = ["web", "site", "hub", "studio", "pro", "point", "shop", "zone"];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const top = topics[Math.floor(Math.random() * topics.length)];
    const num = Math.floor(100 + Math.random() * 900);
    setSubdomain(`${p}-${top}-${num}`);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPublishing(true);

    let cleanSub = subdomain
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!cleanSub || cleanSub.length < 3) {
      cleanSub = getCleanFallback();
      setSubdomain(cleanSub);
    }

    try {
      const res = await fetch(`/api/websites/${websiteId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain: cleanSub }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish");

      setPublishedUrl(data.publicUrl);
      setSubdomain(data.subdomain);
      onPublishedSuccess(data.subdomain);

      // Re-fetch tunnel if needed
      fetch("/api/tunnel")
        .then((r) => r.json())
        .then((td) => {
          if (td?.tunnelUrl) setPublicTunnelBase(td.tunnelUrl);
        })
        .catch(() => { });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm(language === "bn" ? "আপনি কি ওয়েবসাইটটি অফলাইন করতে নিশ্চিত?" : "Are you sure you want to take this website offline?")) return;
    setError(null);
    setUnpublishing(true);

    try {
      const res = await fetch(`/api/websites/${websiteId}/unpublish`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to unpublish");

      setPublishedUrl(null);
      onUnpublishedSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUnpublishing(false);
    }
  };

  const fullDomainDisplay = `/sites/${subdomain || "yourname"}`;
  const resolvedPath = publishedUrl || `/sites/${subdomain}`;

  // If public Cloudflare Tunnel is available, use it as primary so ANYONE in the world can open it!
  const getFullLiveUrl = () => {
    if (publicTunnelBase) {
      return `${publicTunnelBase}${resolvedPath}`;
    }
    if (typeof window !== "undefined") {
      return `${window.location.origin}${resolvedPath}`;
    }
    return `http://localhost:3000${resolvedPath}`;
  };

  const handleOpenLiveSite = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const url = getFullLiveUrl();
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = () => {
    const liveAbsoluteUrl = getFullLiveUrl();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(liveAbsoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const liveAbsoluteUrl = getFullLiveUrl();
    const msg = language === "bn"
      ? `আমার নতুন ওয়েবসাইটটি দেখুন: ${liveAbsoluteUrl}`
      : `Check out my new website: ${liveAbsoluteUrl}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#191638] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(139,53,255,0.3)] border border-[#8B35FF]/40 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#24164A] bg-[#100D2B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#24164A] text-[#C084FC] flex items-center justify-center border border-[#8B35FF]/30">
              <Globe className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {language === "bn" ? "ওয়েবসাইট পাবলিশ করুন" : t("publish_modal.title")}
              </h3>
              <p className="text-xs text-[#D5D2E5]">
                {language === "bn" ? "মুহূর্তেই বিশ্বজুড়ে সবার জন্য উন্মুক্ত করুন" : t("publish_modal.desc")}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#D5D2E5] hover:text-white rounded-lg hover:bg-[#24164A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#191638]">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {status === "PUBLISHED" && (
            <div className="p-5 rounded-2xl bg-[#092B20] border-2 border-[#10B981] text-[#10B981] space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5 text-[#34D399]">
                  <CheckCircle className="w-4 h-4 text-[#10B981]" />
                  {language === "bn" ? "🎉 আপনার ওয়েবসাইট ইন্টারনেটে লাইভ পাবলিশ হয়েছে!" : t("publish_modal.live_success")}
                </span>
                <button
                  type="button"
                  disabled={unpublishing}
                  onClick={handleUnpublish}
                  className="text-xs text-red-400 hover:underline font-semibold"
                >
                  {unpublishing ? "Taking offline..." : t("publish_modal.btn_unpublish")}
                </button>
              </div>

              {/* Working Worldwide Public Link Box */}
              <div className="p-3.5 bg-[#061712] rounded-xl border border-[#10B981]/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#A7F3D0] uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
                    {language === "bn" ? "বিশ্বজুড়ে উন্মুক্ত পাবলিক লাইভ লিংক:" : "Worldwide Public Live Link:"}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="p-1 px-2.5 bg-[#100D2B] text-[#D5D2E5] hover:text-white rounded-lg border border-[#24164A] hover:border-[#38BDF8] text-[11px] flex items-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3 h-3 text-[#38BDF8]" />
                    <span>{copied ? (language === "bn" ? "কপি হয়েছে!" : t("publish_modal.copied")) : (language === "bn" ? "কপি করুন" : t("publish_modal.copy_link"))}</span>
                  </button>
                </div>

                <a
                  href={getFullLiveUrl()}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleOpenLiveSite}
                  className="block font-mono text-sm sm:text-base font-extrabold text-[#38BDF8] hover:text-[#7DD3FC] underline break-all cursor-pointer transition-colors"
                >
                  {getFullLiveUrl()}
                </a>

                <div className="p-2.5 rounded-lg bg-[#081F18] border border-[#10B981]/30 text-[11px] text-[#A7F3D0] leading-relaxed">
                  {language === "bn" ? (
                    <>
                      ✅ <b>এটি কোনো লোকাল লিংক নয়!</b> আসল ইন্টারনেটে ১০০% লাইভ। আপনার মোবাইল, বন্ধু বা গ্রাহকদের এই লিংক পাঠিয়ে দিলে পৃথিবীর যেকোনো স্থান থেকে যে কেউ সরাসরি আপনার ওয়েবসাইটটি দেখতে পাবে।
                    </>
                  ) : (
                    <>
                      ✅ <b>This is a real live public internet link!</b> Anyone on mobile or desktop from anywhere can visit this website instantly.
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons: Open & WhatsApp Share */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleOpenLiveSite}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{language === "bn" ? "🚀 সরাসরি লাইভ সাইট ওপেন করুন" : "🚀 Open Live Website"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{language === "bn" ? "📲 হোয়াটসঅ্যাপে শেয়ার করুন" : "📲 Share on WhatsApp"}</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#D5D2E5]">
                  {language === "bn" ? "আপনার ওয়েবসাইটের নাম / সাবডোমেন:" : t("publish_modal.subdomain_label")}
                </label>
                <button
                  type="button"
                  onClick={handleGenerateRandom}
                  className="text-[11px] font-bold text-[#38BDF8] hover:text-[#7DD3FC] hover:underline"
                >
                  {language === "bn" ? "🎲 নতুন নাম সাজেস্ট করুন" : "🎲 Suggest Random Name"}
                </button>
              </div>
              <div className="flex items-center rounded-xl border border-[#24164A] bg-[#100D2B] overflow-hidden focus-within:border-[#8B35FF]">
                <span className="bg-[#191638] text-[#C084FC] text-xs font-mono px-3.5 py-2.5 border-r border-[#24164A] font-bold">
                  /sites/
                </span>
                <input
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  placeholder="mybrand"
                  className="w-full px-3 py-2.5 text-sm bg-transparent text-white focus:outline-none font-mono"
                />
              </div>

              {/* Real Public Tunnel Preview Indicator */}
              <div className="space-y-1 mt-2 p-2.5 rounded-xl bg-[#100D2B] border border-[#24164A] text-[11px] font-mono">
                <p className="text-[#38BDF8] break-all">
                  🌍 {language === "bn" ? "পাবলিক লাইভ ঠিকানা:" : "Public Live Address:"}{" "}
                  <b>{publicTunnelBase ? `${publicTunnelBase}/sites/${subdomain || "mybrand"}` : `http://localhost:3000/sites/${subdomain || "mybrand"}`}</b>
                </p>
              </div>

              {language === "bn" && (
                <p className="text-[11px] text-[#A7F3D0] mt-1.5 font-medium">
                  💡 নিচে <b>&quot;পাবলিশ করুন&quot;</b> বাটনে চাপ দিলেই ১ ক্লিকে আপনার ওয়েবসাইটটি আসল ইন্টারনেটে লাইভ হয়ে যাবে এবং সবার জন্য উন্মুক্ত লিংক পেয়ে যাবেন।
                </p>
              )}
            </div>

            {/* Publishing details note */}
            <div className="p-3.5 rounded-xl bg-[#100D2B] border border-[#24164A] space-y-1.5 text-xs text-[#D5D2E5]">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                Cloudflare Global Edge CDN & SSL
              </div>
              <p className="text-[11px] leading-relaxed text-[#D5D2E5]/70">
                {language === "bn"
                  ? "বিশ্বজুড়ে যেকোনো ডিভাইস থেকে নিমেষেই দ্রুত লোড হওয়ার জন্য স্বয়ংক্রিয় ক্লাউডফ্লেয়ার টানেল ও ফ্রি SSL সিকিউরিটি সক্রিয় রয়েছে।"
                  : t("feat.publish_desc")}
              </p>
            </div>

            <button
              type="submit"
              disabled={publishing || !subdomain.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#8B35FF] to-[#38BDF8] hover:from-[#6D28D9] hover:to-[#0284C7] disabled:opacity-50 text-white font-extrabold text-sm shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === "bn" ? "ইন্টারনেটে লাইভ পাবলিশ হচ্ছে..." : t("publish_modal.btn_publishing")}
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>{language === "bn" ? "🚀 বিশ্বজুড়ে লাইভ পাবলিশ করুন" : t("publish_modal.btn_publish")}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
