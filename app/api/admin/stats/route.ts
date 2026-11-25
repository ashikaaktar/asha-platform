import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalUsers,
      totalWebsites,
      publishedWebsites,
      draftWebsites,
      totalTemplates,
      totalAnalyticsEvents,
      recentUsers,
      recentWebsites,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.website.count(),
      prisma.website.count({ where: { status: "PUBLISHED" } }),
      prisma.website.count({ where: { status: "DRAFT" } }),
      prisma.template.count(),
      prisma.analyticsEvent.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
      }),
      prisma.website.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          category: true,
          status: true,
          publishedSubdomain: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalWebsites,
        publishedWebsites,
        draftWebsites,
        totalTemplates,
        totalAnalyticsEvents,
      },
      recentUsers,
      recentWebsites,
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Super Admin privileges required." }, { status: 403 });
    }
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
