import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import FloatingAtmosphere from "@/components/FloatingAtmosphere";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ASHA — AI-Powered Website Builder & Publishing Platform",
  description:
    "Describe your idea. Build your website. Customize it. Publish it. Professional websites in minutes with no coding required.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased text-[#D5D2E5] bg-[#08071F] selection:bg-[#8B35FF]/30 selection:text-white">
        <LanguageProvider>
          <FloatingAtmosphere />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <WhatsAppWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
