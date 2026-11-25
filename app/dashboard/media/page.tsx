"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import {
  UploadCloud,
  Search,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  FileImage,
  ArrowLeft,
  HardDrive,
} from "lucide-react";
import Link from "next/link";

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const { t } = useLanguage();
  const [assets, setAssets] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch(`/api/media${search ? `?search=${encodeURIComponent(search)}` : ""}`);
      const data = await res.json();
      setAssets(data.assets || []);
    } catch {
      setError("Failed to fetch media assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [search]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setError("Invalid file type. Please upload a JPG, PNG, WEBP, GIF, or SVG image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB limit.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(`"${file.name}" uploaded successfully!`);
      fetchMedia();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Media asset deleted.");
      fetchMedia();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalBytes = assets.reduce((acc, curr) => acc + curr.sizeBytes, 0);
  const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col bg-[#08071F] text-[#D5D2E5] selection:bg-[#8B35FF]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B98AFF] hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> {t("editor.back")}
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              {t("media.title")}
            </h1>
            <p className="text-sm text-[#D5D2E5] mt-1">
              {t("media.subtitle")}
            </p>
          </div>

          {/* Quick upload button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <button
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[#8B35FF]/30 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              {uploading ? t("media.uploading") : t("media.upload_btn")}
            </button>
          </div>
        </div>

        {/* Notifications */}
        {success && (
          <div className="p-4 rounded-2xl bg-[#20A887]/20 border border-[#20A887]/40 text-[#20A887] text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#20A887]" />
              {success}
            </span>
            <button onClick={() => setSuccess(null)} className="text-[#20A887] font-bold">
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

        {/* Storage & Search Bar */}
        <div className="p-6 rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#181340] border border-[#8B35FF]/40 text-[#C084FC] flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {assets.length} Images ({totalMb} MB {t("media.storage_used")})
              </span>
              <span className="text-[11px] text-[#D5D2E5]/70">
                Supports JPG, PNG, WEBP, GIF, SVG up to 5MB
              </span>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#B98AFF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("media.search_placeholder")}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#2D2A5D] bg-[#07051A] text-white text-xs placeholder-[#D5D2E5]/50 focus:border-[#8B35FF] transition-colors"
            />
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm text-[#D5D2E5]">Loading...</div>
        ) : assets.length === 0 ? (
          <div className="py-20 px-4 text-center rounded-3xl bg-[#0D0B24]/85 backdrop-blur-xl border border-[#2D2A5D] shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#181340] text-[#C084FC] flex items-center justify-center mx-auto">
              <FileImage className="w-8 h-8 text-[#A855F7]" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-white">{t("media.empty")}</h3>
              <p className="text-xs text-[#D5D2E5]/70">
                {t("media.subtitle")}
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] text-white font-bold text-xs shadow-md shadow-[#8B35FF]/30"
            >
              {t("media.upload_btn")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group rounded-2xl border border-[#2D2A5D] bg-[#0D0B24]/85 backdrop-blur-xl overflow-hidden shadow-lg hover:shadow-[0_10px_25px_rgba(139,53,255,0.25)] hover:border-[#8B35FF]/60 transition-all flex flex-col justify-between"
              >
                <div className="aspect-square bg-[#07051A] relative overflow-hidden flex items-center justify-center">
                  <img
                    src={asset.url}
                    alt={asset.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#08071F]/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => handleCopyUrl(asset.url, asset.id)}
                      title={t("media.copy_link")}
                      className="p-2 rounded-lg bg-[#181340] border border-[#8B35FF]/40 text-white hover:bg-[#8B35FF]/30 text-xs shadow-xs"
                    >
                      {copiedId === asset.id ? (
                        <CheckCircle className="w-4 h-4 text-[#20A887]" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#38BDF8]" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      title={t("media.delete")}
                      className="p-2 rounded-lg bg-red-600/90 text-white hover:bg-red-700 text-xs shadow-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <p className="text-xs font-semibold text-white truncate" title={asset.originalName}>
                    {asset.originalName}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#D5D2E5]/60">
                    <span>{(asset.sizeBytes / 1024).toFixed(0)} KB</span>
                    <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
