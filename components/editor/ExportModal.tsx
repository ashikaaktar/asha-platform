"use client";

import { useEffect, useState } from "react";
import { X, Download, Copy, FileCode, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteId: string;
  websiteName: string;
}

export default function ExportModal({
  isOpen,
  onClose,
  websiteId,
  websiteName,
}: ExportModalProps) {
  const { t } = useLanguage();
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch(`/api/websites/${websiteId}/export`)
      .then((res) => (res.ok ? res.text() : ""))
      .then((text) => {
        setHtmlCode(text);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isOpen, websiteId]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${websiteName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-60 bg-[#08071F]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#191638] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(139,53,255,0.3)] border border-[#8B35FF]/40 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#24164A] bg-[#100D2B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#24164A] text-[#C084FC] flex items-center justify-center border border-[#8B35FF]/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{t("export_modal.title")}</h3>
              <p className="text-xs text-[#D5D2E5]">
                {t("export_modal.desc")}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#D5D2E5] hover:text-white rounded-lg hover:bg-[#24164A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#191638]">
          {/* Quick Actions */}
          <div className="p-4 rounded-2xl bg-[#100D2B] border border-[#24164A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-xs text-white block">{t("export_modal.title")}</span>
              <p className="text-[11px] text-[#D5D2E5]/70">
                {t("export_modal.desc")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl bg-[#191638] border border-[#24164A] text-[#D5D2E5] hover:bg-[#24164A] hover:text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#20A887]" /> : <Copy className="w-3.5 h-3.5 text-[#38BDF8]" />}
                <span>{copied ? t("export_modal.copied") : t("export_modal.btn_copy")}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#8B35FF]/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t("export_modal.btn_download")}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D5D2E5] uppercase tracking-wider block">
              HTML Preview
            </span>
            {loading ? (
              <div className="h-48 bg-[#0D0B24] rounded-2xl flex items-center justify-center text-xs text-[#D5D2E5]/60">
                Generating standalone HTML...
              </div>
            ) : (
              <pre className="p-4 bg-[#0D0B24] border border-[#24164A] text-[#D5D2E5] rounded-2xl text-[11px] font-mono overflow-x-auto max-h-64 scrollbar-thin">
                <code>{htmlCode}</code>
              </pre>
            )}
          </div>
        </div>

        {/* Footer */}
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
