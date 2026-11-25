"use client";

import { useState } from "react";
import { X, Palette, Image as ImageIcon, Check, Sliders, Eye } from "lucide-react";
import { SectionData } from "@/lib/types";
import MediaPickerModal from "./MediaPickerModal";

interface SectionSettingsDrawerProps {
  section: SectionData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSection: SectionData) => void;
}

export default function SectionSettingsDrawer({
  section,
  isOpen,
  onClose,
  onSave,
}: SectionSettingsDrawerProps) {
  const [mediaPickerTarget, setMediaPickerTarget] = useState<string | null>(null);

  if (!isOpen || !section) return null;

  const content = section.content || {};
  const styles = section.styles || {};

  const updateContentField = (field: string, value: any) => {
    onSave({
      ...section,
      content: {
        ...content,
        [field]: value,
      },
    });
  };

  const updateStylesField = (field: string, value: any) => {
    onSave({
      ...section,
      styles: {
        ...styles,
        [field]: value,
      },
    });
  };

  return (
    <>
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-asha-primary" />
            <h3 className="text-sm font-bold text-asha-navy uppercase tracking-wider">
              {section.type} Settings
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* 1. STYLING CONTROLS */}
          <div className="space-y-4 pb-4 border-b border-slate-100">
            <span className="font-bold text-slate-500 uppercase tracking-wider block">
              Colors & Background
            </span>

            {/* Quick Theme Presets */}
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-semibold">Quick Theme Presets</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSave({
                      ...section,
                      styles: {
                        ...styles,
                        backgroundColor: "#FFFFFF",
                        textColor: "#102A56",
                        accentColor: "#2563EB",
                      },
                    });
                  }}
                  className="p-2 rounded-xl border border-slate-200 text-left hover:border-blue-500 bg-white shadow-xs"
                >
                  <span className="font-bold text-slate-800 block text-[11px]">Modern Light</span>
                  <span className="text-[10px] text-slate-400">White & Navy</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSave({
                      ...section,
                      styles: {
                        ...styles,
                        backgroundColor: "#EFF6FF",
                        textColor: "#102A56",
                        accentColor: "#3B82F6",
                      },
                    });
                  }}
                  className="p-2 rounded-xl border border-blue-200 text-left hover:border-blue-500 bg-blue-50/50 shadow-xs"
                >
                  <span className="font-bold text-blue-900 block text-[11px]">Soft Blue</span>
                  <span className="text-[10px] text-blue-600">Light Blue Canvas</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSave({
                      ...section,
                      styles: {
                        ...styles,
                        backgroundColor: "#102A56",
                        textColor: "#FFFFFF",
                        accentColor: "#38BDF8",
                      },
                    });
                  }}
                  className="p-2 rounded-xl border border-slate-800 text-left hover:border-blue-400 bg-slate-900 text-white shadow-xs"
                >
                  <span className="font-bold text-white block text-[11px]">Navy Dark</span>
                  <span className="text-[10px] text-sky-400">Deep Executive</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSave({
                      ...section,
                      styles: {
                        ...styles,
                        backgroundColor: "#F8FAFC",
                        textColor: "#0F172A",
                        accentColor: "#7C3AED",
                      },
                    });
                  }}
                  className="p-2 rounded-xl border border-slate-200 text-left hover:border-purple-400 bg-slate-100 shadow-xs"
                >
                  <span className="font-bold text-slate-800 block text-[11px]">Warm Slate</span>
                  <span className="text-[10px] text-purple-600">Purple Accent</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.backgroundColor || "#FFFFFF"}
                    onChange={(e) => updateStylesField("backgroundColor", e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={styles.backgroundColor || "#FFFFFF"}
                    onChange={(e) => updateStylesField("backgroundColor", e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.textColor || "#102A56"}
                    onChange={(e) => updateStylesField("textColor", e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={styles.textColor || "#102A56"}
                    onChange={(e) => updateStylesField("textColor", e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Accent / Button Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.accentColor || "#2563EB"}
                  onChange={(e) => updateStylesField("accentColor", e.target.value)}
                  className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={styles.accentColor || "#2563EB"}
                  onChange={(e) => updateStylesField("accentColor", e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Vertical Padding</label>
                <select
                  value={styles.paddingY || "md"}
                  onChange={(e) => updateStylesField("paddingY", e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  <option value="sm">Compact (sm)</option>
                  <option value="md">Standard (md)</option>
                  <option value="lg">Spacious (lg)</option>
                  <option value="xl">Ultra Wide (xl)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Text Alignment</label>
                <select
                  value={styles.textAlign || "left"}
                  onChange={(e) => updateStylesField("textAlign", e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  <option value="left">Left Aligned</option>
                  <option value="center">Centered</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. TEXT & HEADINGS */}
          <div className="space-y-4">
            <span className="font-bold text-slate-500 uppercase tracking-wider block">
              Content & Text
            </span>

            {content.badge !== undefined && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={content.badge || ""}
                  onChange={(e) => updateContentField("badge", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            )}

            {content.heading !== undefined && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Heading</label>
                <input
                  type="text"
                  value={content.heading || ""}
                  onChange={(e) => updateContentField("heading", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
            )}

            {content.subheading !== undefined && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subheading</label>
                <textarea
                  rows={2}
                  value={content.subheading || ""}
                  onChange={(e) => updateContentField("subheading", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            )}

            {content.description !== undefined && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={content.description || ""}
                  onChange={(e) => updateContentField("description", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            )}

            {/* Image control */}
            {content.imageUrl !== undefined && (
              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">Section Image</label>
                {content.imageUrl && (
                  <img
                    src={content.imageUrl}
                    alt="Preview"
                    className="w-full h-28 object-cover rounded-xl border border-slate-200"
                  />
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={content.imageUrl || ""}
                    onChange={(e) => updateContentField("imageUrl", e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget("imageUrl")}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 flex items-center gap-1 shrink-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Pick
                  </button>
                </div>
              </div>
            )}

            {/* Buttons */}
            {content.primaryButtonText !== undefined && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Primary Button</label>
                  <input
                    type="text"
                    value={content.primaryButtonText || ""}
                    onChange={(e) => updateContentField("primaryButtonText", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Button Link</label>
                  <input
                    type="text"
                    value={content.primaryButtonLink || ""}
                    onChange={(e) => updateContentField("primaryButtonLink", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            )}

            {content.secondaryButtonText !== undefined && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Secondary Button</label>
                  <input
                    type="text"
                    value={content.secondaryButtonText || ""}
                    onChange={(e) => updateContentField("secondaryButtonText", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Secondary Link</label>
                  <input
                    type="text"
                    value={content.secondaryButtonLink || ""}
                    onChange={(e) => updateContentField("secondaryButtonLink", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Contact details */}
            {section.type === "contact" && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Email</label>
                  <input
                    type="text"
                    value={content.email || ""}
                    onChange={(e) => updateContentField("email", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={content.phone || ""}
                    onChange={(e) => updateContentField("phone", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Address</label>
                  <input
                    type="text"
                    value={content.address || ""}
                    onChange={(e) => updateContentField("address", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-asha-primary text-white font-bold text-xs hover:bg-blue-700 shadow-sm"
          >
            Done Editing
          </button>
        </div>
      </div>

      {/* Media Picker Modal */}
      {mediaPickerTarget && (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setMediaPickerTarget(null)}
          onSelectImage={(url) => {
            updateContentField(mediaPickerTarget, url);
            setMediaPickerTarget(null);
          }}
        />
      )}
    </>
  );
}
