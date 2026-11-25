"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Layout,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Globe,
  Check,
  ChevronDown,
  Moon,
} from "lucide-react";
import { useLanguage, AVAILABLE_LANGUAGES } from "@/context/LanguageContext";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const currentLang =
    AVAILABLE_LANGUAGES.find((l) => l.code === language) || AVAILABLE_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-[#080B26]/90 backdrop-blur-2xl border-b border-[#25225C]/70 shadow-[0_4px_30px_rgba(5,7,25,0.7)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo matching screenshot */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0EA5E9] via-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-xl tracking-tight text-white leading-none">
              ASHA
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-[#38BDF8] uppercase mt-0.5">
              {t("nav.brand_sub")}
            </span>
          </div>
        </Link>

        {/* Center Navigation Links matching screenshot */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#D5D2E5]">
          <Link
            href="/#how-it-works"
            className="hover:text-white transition-colors flex items-center gap-1 group"
          >
            <span>{t("nav.how_it_works")}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-white transition-colors" />
          </Link>
          <Link href="/#features" className="hover:text-white transition-colors">
            {t("nav.features")}
          </Link>
          <Link href="/#templates" className="hover:text-white transition-colors">
            {t("nav.templates")}
          </Link>
          <Link href="/#pricing" className="hover:text-white transition-colors">
            {t("nav.pricing")}
          </Link>
          <Link href="/#faq" className="hover:text-white transition-colors">
            {t("nav.support")}
          </Link>
          <Link href="/#about" className="hover:text-white transition-colors">
            {t("nav.about")}
          </Link>
        </nav>

        {/* Satkhira Pill Badge matching screenshot */}
        <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D0B24]/90 border border-[#2D2A5D] text-xs font-medium text-[#D5D2E5] shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_#10B981]" />
          <span>{t("nav.satkhira_badge")}</span>
        </div>

        {/* Right CTA / Auth Status matching screenshot */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2D2A5D] bg-[#0D0B24] hover:bg-[#15123A] text-xs font-semibold text-white transition-colors shadow-sm"
              aria-label="Language selection"
            >
              <Globe className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>{currentLang.label.split(" ")[0]}</span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </button>

            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-[#0D0B24] rounded-2xl shadow-2xl border border-[#2D2A5D] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1 text-[10px] font-bold text-[#A855F7] uppercase tracking-wider border-b border-[#2D2A5D] mb-1">
                    {t("nav.select_language")}
                  </div>
                  {AVAILABLE_LANGUAGES.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#1A1642] transition-colors ${isSelected ? "text-[#38BDF8] font-bold bg-[#1A1642]/80" : "text-[#D5D2E5] font-medium"
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#38BDF8]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {loading ? (
            <div className="w-24 h-9 bg-[#0D0B24] rounded-xl animate-pulse border border-[#2D2A5D]" />
          ) : user ? (
            <div className="flex items-center gap-2.5">
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#C084FC] bg-[#1A1642] hover:bg-[#251F5E] rounded-xl border border-[#8B35FF]/40 transition-colors shadow-[0_0_15px_rgba(139,53,255,0.2)]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A855F7]" />
                  {t("nav.admin")}
                </Link>
              )}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:from-[#6D28D9] hover:to-[#2563EB] rounded-xl shadow-lg shadow-[#7C3AED]/30 transition-all hover:scale-105"
              >
                <Layout className="w-3.5 h-3.5" />
                {t("nav.dashboard")}
              </Link>
              <button
                onClick={handleLogout}
                title={t("nav.logout")}
                className="p-2 text-[#D5D2E5] hover:text-[#EF4444] hover:bg-[#0D0B24] rounded-xl transition-colors border border-transparent hover:border-[#2D2A5D]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Login link with moon icon */}
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#D5D2E5] hover:text-white transition-colors"
              >
                <Moon className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>{t("nav.login")}</span>
              </Link>

              {/* Sign Up Rocket Button matching screenshot */}
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#7C3AED] hover:from-[#0369A1] hover:to-[#6D28D9] shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] transition-all hover:scale-105"
              >
                <span>{t("nav.signup_rocket")}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#D5D2E5] hover:text-white rounded-xl bg-[#0D0B24] border border-[#2D2A5D]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#2D2A5D] bg-[#060515]/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-4">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D0B24] border border-[#2D2A5D] text-xs">
            <span className="font-bold text-[#D5D2E5] flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#A855F7]" /> {t("nav.language")}:
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-[#15123A] border border-[#2D2A5D] rounded-lg px-2.5 py-1 font-bold text-white text-xs outline-none"
            >
              {AVAILABLE_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          <nav className="flex flex-col space-y-2 text-sm font-semibold text-[#D5D2E5]">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#0D0B24] hover:text-white"
            >
              {t("nav.how_it_works")}
            </Link>
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#0D0B24] hover:text-white"
            >
              {t("nav.features")}
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#0D0B24] hover:text-white"
            >
              {t("nav.pricing")}
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#0D0B24] hover:text-white"
            >
              {t("nav.support")}
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#0D0B24] hover:text-white"
            >
              {t("nav.about")}
            </Link>
          </nav>

          <div className="pt-2 border-t border-[#2D2A5D] flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white font-bold text-xs shadow-md"
                >
                  {t("nav.dashboard")}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-bold text-[#EF4444]"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-[#0D0B24] border border-[#2D2A5D] text-white font-bold text-xs"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white font-bold text-xs shadow-md"
                >
                  {t("nav.signup_rocket")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
