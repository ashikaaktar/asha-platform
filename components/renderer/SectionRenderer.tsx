"use client";

import React, { useState } from "react";
import {
  Zap,
  Shield,
  ShieldCheck,
  Globe,
  Smartphone,
  BarChart3,
  Layers,
  Sparkles,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Compass,
  Palette,
  TrendingUp,
  Cpu,
  Clock,
  CheckCircle,
  Bookmark,
  Users,
  MoveUp,
  MoveDown,
  Trash2,
  Copy,
  Settings,
} from "lucide-react";
import { SectionData, SectionType } from "@/lib/types";

interface SectionRendererProps {
  section: SectionData;
  isEditor?: boolean;
  onEdit?: (section: SectionData) => void;
  onDelete?: (sectionId: string) => void;
  onDuplicate?: (section: SectionData) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  Shield,
  ShieldCheck,
  Globe,
  Smartphone,
  BarChart3,
  Layers,
  Sparkles,
  Compass,
  Palette,
  TrendingUp,
  Cpu,
  Clock,
  CheckCircle,
  Bookmark,
  Users,
};

export default function SectionRenderer({
  section,
  isEditor = false,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: SectionRendererProps) {
  const { type, content, styles, isVisible } = section;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!isVisible && !isEditor) return null;

  const bgStyle = styles?.backgroundColor || "#FFFFFF";
  const textColor = styles?.textColor || "#102A56";
  const accentColor = styles?.accentColor || "#2563EB";
  const textAlign = styles?.textAlign || "left";

  const paddingYClass =
    styles?.paddingY === "xl"
      ? "py-24"
      : styles?.paddingY === "lg"
      ? "py-16 md:py-20"
      : styles?.paddingY === "sm"
      ? "py-8"
      : "py-12";

  const renderIcon = (name?: string, className = "w-5 h-5") => {
    const IconComp = (name && ICON_MAP[name]) ? ICON_MAP[name] : Zap;
    return <IconComp className={className} />;
  };

  return (
    <div
      className={`relative transition-all group/section ${
        isEditor ? "hover:ring-2 hover:ring-blue-500/60 ring-offset-2" : ""
      } ${!isVisible ? "opacity-50" : ""}`}
      style={{ backgroundColor: bgStyle, color: textColor }}
    >
      {/* Editor Floating Action Controls */}
      {isEditor && (
        <div className="absolute top-3 right-4 z-40 opacity-0 group-hover/section:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg p-1.5 flex items-center gap-1">
          <span className="text-[11px] font-bold text-slate-500 px-2 uppercase tracking-wider">
            {type}
          </span>
          {canMoveUp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp?.();
              }}
              title="Move Up"
              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <MoveUp className="w-3.5 h-3.5" />
            </button>
          )}
          {canMoveDown && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown?.();
              }}
              title="Move Down"
              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <MoveDown className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate?.(section);
            }}
            title="Duplicate Section"
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(section);
            }}
            title="Edit Section Settings"
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (section.id) onDelete?.(section.id);
            }}
            title="Delete Section"
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SECTION CONTENT BY TYPE */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${paddingYClass}`}>
        {/* HERO SECTION */}
        {type === "hero" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div
              className={`space-y-6 ${
                content.imageUrl ? "lg:col-span-7" : "lg:col-span-10 lg:col-start-2 text-center"
              } ${textAlign === "center" ? "text-center mx-auto" : ""}`}
            >
              {content.badge && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                  style={{
                    backgroundColor: `${accentColor}18`,
                    color: accentColor,
                  }}
                >
                  {content.badge}
                </span>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                {content.heading}
              </h1>
              <p className="text-lg sm:text-xl opacity-80 max-w-2xl leading-relaxed">
                {content.subheading}
              </p>
              <div
                className={`flex flex-wrap items-center gap-4 pt-2 ${
                  textAlign === "center" || !content.imageUrl ? "justify-center" : ""
                }`}
              >
                {content.primaryButtonText && (
                  <a
                    href={content.primaryButtonLink || "#"}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/20 hover:opacity-95 transition-all text-sm sm:text-base"
                    style={{ backgroundColor: accentColor }}
                  >
                    {content.primaryButtonText}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
                {content.secondaryButtonText && (
                  <a
                    href={content.secondaryButtonLink || "#"}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold border border-slate-300 hover:bg-slate-50 transition-all text-sm sm:text-base"
                  >
                    {content.secondaryButtonText}
                  </a>
                )}
              </div>
            </div>

            {content.imageUrl && (
              <div className="lg:col-span-5 relative">
                <div
                  className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl -z-10"
                  style={{ backgroundColor: accentColor }}
                />
                <img
                  src={content.imageUrl}
                  alt={content.imageAlt || "Hero visual"}
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-2xl border border-white/20"
                />
              </div>
            )}
          </div>
        )}

        {/* ABOUT SECTION */}
        {type === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {content.imageUrl && (
              <div className="lg:col-span-5 relative">
                <img
                  src={content.imageUrl}
                  alt="About visual"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-xl"
                />
                {content.statNumber && (
                  <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-blue-600">{content.statNumber}</span>
                    <span className="text-xs font-medium text-slate-500">{content.statLabel}</span>
                  </div>
                )}
              </div>
            )}
            <div className={`space-y-6 ${content.imageUrl ? "lg:col-span-7" : "lg:col-span-12"}`}>
              {content.badge && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                >
                  {content.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {content.heading}
              </h2>
              <p className="text-base sm:text-lg opacity-85 leading-relaxed">
                {content.description}
              </p>
              {content.bulletPoints && content.bulletPoints.length > 0 && (
                <ul className="space-y-3 pt-2">
                  {content.bulletPoints.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white"
                        style={{ backgroundColor: accentColor }}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <span className="opacity-90">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* FEATURES SECTION */}
        {type === "features" && (
          <div className="space-y-12">
            <div className={`max-w-3xl ${textAlign === "center" ? "mx-auto text-center" : ""}`}>
              {content.badge && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3"
                  style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                >
                  {content.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {content.heading}
              </h2>
              {content.subheading && (
                <p className="mt-3 text-base sm:text-lg opacity-80">{content.subheading}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(content.features || []).map((feat: any, idx: number) => (
                <div
                  key={idx}
                  className="p-7 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: accentColor }}
                  >
                    {renderIcon(feat.icon)}
                  </div>
                  <h3 className="text-xl font-bold">{feat.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVICES SECTION */}
        {type === "services" && (
          <div className="space-y-12">
            <div className={`max-w-3xl ${textAlign === "center" ? "mx-auto text-center" : ""}`}>
              {content.badge && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3"
                  style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                >
                  {content.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {content.heading}
              </h2>
              {content.subheading && (
                <p className="mt-3 text-base sm:text-lg opacity-80">{content.subheading}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(content.services || []).map((serv: any, idx: number) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      {renderIcon(serv.icon, "w-5 h-5")}
                    </div>
                    <h3 className="text-xl font-bold">{serv.title}</h3>
                    <p className="text-sm opacity-80 leading-relaxed">{serv.description}</p>
                  </div>
                  {serv.price && (
                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-lg font-extrabold text-blue-600">{serv.price}</span>
                      <button
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                      >
                        Learn More
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY SECTION */}
        {type === "gallery" && (
          <div className="space-y-12">
            <div className={`max-w-3xl ${textAlign === "center" ? "mx-auto text-center" : ""}`}>
              {content.badge && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3"
                  style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                >
                  {content.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {content.heading}
              </h2>
              {content.subheading && (
                <p className="mt-3 text-base sm:text-lg opacity-80">{content.subheading}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(content.items || []).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="group/gal overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <div className="overflow-hidden aspect-video relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/gal:scale-105 transition-transform duration-300"
                    />
                    {item.category && (
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS SECTION */}
        {type === "testimonials" && (
          <div className="space-y-12">
            <div className={`max-w-3xl ${textAlign === "center" ? "mx-auto text-center" : ""}`}>
              {content.badge && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3"
                  style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                >
                  {content.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {content.heading}
              </h2>
              {content.subheading && (
                <p className="mt-3 text-base sm:text-lg opacity-80">{content.subheading}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(content.testimonials || []).map((t: any, idx: number) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between"
                >
                  <p className="italic text-base sm:text-lg leading-relaxed opacity-90">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl}
                        alt={t.author}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                        style={{ backgroundColor: accentColor }}
                      >
                        {t.author.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-base leading-snug">{t.author}</h4>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ SECTION */}
        {type === "faq" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              {content.badge && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                >
                  {content.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {content.heading}
              </h2>
              {content.subheading && (
                <p className="text-base sm:text-lg opacity-80">{content.subheading}</p>
              )}
            </div>

            <div className="space-y-4 pt-4">
              {(content.items || []).map((item: any, idx: number) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-base sm:text-lg text-slate-800 hover:text-blue-600 transition-colors"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-blue-600" : "text-slate-400"
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTACT SECTION */}
        {type === "contact" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              {content.badge && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                >
                  {content.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {content.heading}
              </h2>
              <p className="text-base sm:text-lg opacity-85 leading-relaxed">
                {content.subheading}
              </p>
              <div className="space-y-4 pt-4 text-sm sm:text-base">
                {content.email && (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Mail className="w-4 h-4" />
                    </div>
                    <span>{content.email}</span>
                  </div>
                )}
                {content.phone && (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>{content.phone}</span>
                  </div>
                )}
                {content.address && (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span>{content.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
                {contactSubmitted ? (
                  <div className="text-center py-10 space-y-3">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800">Message Delivered!</h4>
                    <p className="text-sm text-slate-500">
                      Thank you for contacting us. We will respond to your inquiry shortly.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Jane Doe"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="jane@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="How can we help your team?"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-xl text-white font-semibold shadow-md hover:opacity-95 transition-all text-sm"
                      style={{ backgroundColor: accentColor }}
                    >
                      {content.formButtonText || "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CTA SECTION */}
        {type === "cta" && (
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {content.heading}
            </h2>
            <p className="text-base sm:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              {content.subheading}
            </p>
            <div className="pt-4">
              <a
                href={content.buttonLink || "#"}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xl transition-all text-base"
              >
                {content.buttonText}
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </a>
            </div>
          </div>
        )}

        {/* FOOTER SECTION */}
        {type === "footer" && (
          <div className="pt-6 border-t border-slate-200/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-extrabold text-lg tracking-tight">{content.brandName}</span>
              <p className="opacity-75 text-xs">{content.tagline}</p>
            </div>
            {content.links && content.links.length > 0 && (
              <div className="flex flex-wrap items-center gap-6 text-xs opacity-80">
                {content.links.map((link: any, idx: number) => (
                  <a key={idx} href={link.url} className="hover:opacity-100 transition-opacity">
                    {link.label}
                  </a>
                ))}
              </div>
            )}
            <p className="text-xs opacity-60 text-center sm:text-right">
              {content.copyrightText || `© ${new Date().getFullYear()} ${content.brandName}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
