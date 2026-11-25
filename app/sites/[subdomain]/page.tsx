import { prisma } from "@/lib/db";
import PublicSiteViewer from "@/components/sites/PublicSiteViewer";
import Link from "next/link";
import { Globe } from "lucide-react";

interface PageProps {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function PublishedWebsitePage({ params, searchParams }: PageProps) {
  const { subdomain } = await params;
  const { page } = await searchParams;

  const cleanSubdomain = subdomain.toLowerCase().trim();

  const snapshotRecord = await prisma.publishedSnapshot.findUnique({
    where: { subdomain: cleanSubdomain },
  });

  if (!snapshotRecord) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-asha-bg p-4 selection:bg-asha-light selection:text-asha-primary">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-asha-primary flex items-center justify-center mx-auto">
            <Globe className="w-8 h-8 text-asha-bright" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-asha-navy">Website Offline or Not Found</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              The website at{" "}
              <span className="font-mono font-bold text-slate-700">
                /sites/{cleanSubdomain}
              </span>{" "}
              is either not published yet, has been taken offline, or has not been registered.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/"
              className="py-3 px-4 rounded-xl bg-asha-primary text-white font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
              Build Your Own Website with ASHA
            </Link>
            <Link
              href="/dashboard"
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const snapshotData = JSON.parse(snapshotRecord.snapshotJson);

  return <PublicSiteViewer initialData={snapshotData} initialPageSlug={page || "home"} />;
}
