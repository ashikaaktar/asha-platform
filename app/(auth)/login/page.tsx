"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle, ShieldCheck, Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage, AVAILABLE_LANGUAGES } from "@/context/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role: "admin" | "demo") => {
    if (role === "admin") {
      setEmail("admin@asha.site");
      setPassword("Admin@Asha2026!");
    } else {
      setEmail("demo@asha.site");
      setPassword("Demo@Asha2026!");
    }
  };

  const currentLang = AVAILABLE_LANGUAGES.find((l) => l.code === language) || AVAILABLE_LANGUAGES[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#08071F] selection:bg-[#8B35FF]/30 selection:text-white relative">
      {/* Top Language Selector */}
      <div className="absolute top-6 right-6 z-50">
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
              <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
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
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#1A1642] transition-colors ${
                        isSelected ? "text-[#38BDF8] font-bold bg-[#1A1642]/80" : "text-[#D5D2E5] font-medium"
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
      </div>

      <div className="max-w-md w-full bg-[#191638] rounded-3xl border border-[#24164A] shadow-[0_0_40px_rgba(139,53,255,0.2)] p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B35FF] via-[#A855F7] to-[#176BFF] flex items-center justify-center text-white shadow-md shadow-[#8B35FF]/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">ASHA</span>
          </Link>
          <h2 className="text-2xl font-bold text-white">{t("auth.login_title")}</h2>
          <p className="text-xs text-[#D5D2E5]">
            {t("auth.login_subtitle")}
          </p>
        </div>

        {/* Quick Fill Testing Helper */}
        <div className="p-3.5 rounded-2xl bg-[#100D2B] border border-[#24164A] space-y-2">
          <span className="text-[11px] font-bold text-[#B98AFF] uppercase tracking-wider block">
            {t("auth.demo_fill_title")}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("demo")}
              className="flex-1 py-1.5 px-3 rounded-lg bg-[#191638] border border-[#24164A] text-xs font-semibold text-[#D5D2E5] hover:bg-[#24164A] hover:text-white transition-colors shadow-xs"
            >
              {t("auth.demo_user")}
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("admin")}
              className="flex-1 py-1.5 px-3 rounded-lg bg-[#24164A] border border-[#8B35FF]/40 text-xs font-semibold text-[#C084FC] hover:bg-[#8B35FF]/20 transition-colors shadow-xs flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {t("auth.super_admin")}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#D5D2E5] mb-1.5">{t("auth.email_label")}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#B98AFF] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.email_placeholder")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#100D2B] border border-[#24164A] text-white text-sm focus:border-[#8B35FF] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D5D2E5] mb-1.5">{t("auth.password_label")}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#B98AFF] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.password_placeholder")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#100D2B] border border-[#24164A] text-white text-sm focus:border-[#8B35FF] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-[#8B35FF] to-[#176BFF] hover:from-[#7828E0] hover:to-[#1258D6] disabled:opacity-50 shadow-md shadow-[#8B35FF]/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              t("auth.btn_signing_in")
            ) : (
              <>
                {t("auth.btn_signin")}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#D5D2E5]">
          {t("auth.no_account")}{" "}
          <Link href="/register" className="font-semibold text-[#C084FC] hover:underline">
            {t("auth.create_account")}
          </Link>
        </div>
      </div>
    </div>
  );
}
