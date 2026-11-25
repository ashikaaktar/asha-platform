"use client";

import { useEffect, useState, useRef } from "react";
import { X, UploadCloud, Search, CheckCircle, Image as ImageIcon } from "lucide-react";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelectImage,
}: MediaPickerModalProps) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setAssets(data.assets || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchAssets();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.asset) {
        onSelectImage(data.asset.url);
        onClose();
      }
    } catch {
    } finally {
      setUploading(false);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onSelectImage(customUrl.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-asha-navy">Choose or Upload Image</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Direct External URL input */}
          <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
            <input
              type="url"
              placeholder="Or paste an image URL (e.g. Unsplash URL)..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-asha-primary"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-900"
            >
              Use URL
            </button>
          </form>

          {/* Upload Button */}
          <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3 hover:border-blue-400 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <UploadCloud className="w-8 h-8 text-blue-500 mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700">Upload an image from your computer</p>
              <p className="text-[11px] text-slate-400">JPG, PNG, WEBP, GIF up to 5MB</p>
            </div>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-asha-primary text-white font-bold text-xs hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Browse Local File"}
            </button>
          </div>

          {/* User's uploaded media */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Your Media Library ({assets.length})
            </span>
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading media...</div>
            ) : assets.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No uploaded media yet. Upload above or paste a web URL.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => {
                      onSelectImage(asset.url);
                      onClose();
                    }}
                    className="aspect-square rounded-xl overflow-hidden border border-slate-200 hover:ring-2 hover:ring-blue-500 cursor-pointer relative group"
                  >
                    <img
                      src={asset.url}
                      alt={asset.originalName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                      Select
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
