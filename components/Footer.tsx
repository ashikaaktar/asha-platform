"use client";

import Link from "next/link";
import { Sparkles, Globe, Shield, Lock, MessageCircle, Phone, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t, language } = useLanguage();

  const phoneNumber = "01938267920";
  const whatsappUrl = `https://wa.me/8801938267920?text=${encodeURIComponent(
    language === "bn"
      ? "আসসালামু আলাইকুম! আমি ওয়েবসাইট তৈরির বিষয়ে জানতে চাই।"
      : "Hello! I would like to inquire about building a website."
  )}`;

  return (
    <footer className="bg-[#06081A] text-[#D5D2E5] border-t border-[#25225C]/70 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0EA5E9] via-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">ASHA</span>
            </Link>
            <p className="text-sm text-[#D5D2E5] leading-relaxed max-w-sm">
              {t("footer.brand_desc")}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#94A3B8] pt-2">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#38BDF8]" /> {t("footer.security")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#38BDF8]" /> {t("footer.cdn")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#38BDF8]" /> {t("footer.ssl")}
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              {t("footer.product")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#features" className="hover:text-[#38BDF8] transition-colors">
                  {t("feat.ai_title")}
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-[#38BDF8] transition-colors">
                  {t("feat.editor_title")}
                </Link>
              </li>
              <li>
                <Link href="/#templates" className="hover:text-[#38BDF8] transition-colors">
                  {t("nav.templates")}
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#38BDF8] transition-colors">
                  {t("nav.pricing")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Template Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              {t("footer.templates")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#templates" className="hover:text-[#38BDF8] transition-colors">
                  {t("cat.business") || "Business & SaaS"}
                </Link>
              </li>
              <li>
                <Link href="/#templates" className="hover:text-[#38BDF8] transition-colors">
                  {t("cat.portfolio") || "Portfolio & Creative"}
                </Link>
              </li>
              <li>
                <Link href="/#templates" className="hover:text-[#38BDF8] transition-colors">
                  {t("cat.agency") || "Agencies & Studios"}
                </Link>
              </li>
              <li>
                <Link href="/#templates" className="hover:text-[#38BDF8] transition-colors">
                  {t("cat.store") || "E-Commerce Stores"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Safe Account Links & ATTRACTIVE WHATSAPP CONNECT */}
          <div className="space-y-6">
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
                {t("footer.account")}
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/login" className="hover:text-[#38BDF8] transition-colors flex items-center gap-1.5">
                    <span>{t("footer.signin")}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-[#38BDF8] transition-colors flex items-center gap-1.5">
                    <span>{t("footer.signup")}</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Gorgeous WhatsApp Direct Connect Card */}
            <div className="p-4 rounded-2xl bg-[#0D0B24] border border-[#10B981]/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  {t("whatsapp.online")}
                </span>
                <MessageCircle className="w-4 h-4 text-[#10B981]" />
              </div>

              <div>
                <p className="text-xs font-medium text-[#D5D2E5]">
                  {t("whatsapp.title")}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-base font-extrabold text-white tracking-wider">
                    {phoneNumber}
                  </span>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-md transition-all group"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>{t("whatsapp.btn_chat")}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2D2A5D]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>© {new Date().getFullYear()} ASHA Platform. {t("footer.rights")}</p>
          <p className="flex items-center gap-1">
            {t("footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
