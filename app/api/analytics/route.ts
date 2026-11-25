import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Public endpoint to record page view event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { websiteId, pageSlug = "home", referrer } = body;

    if (!websiteId) {
      return NextResponse.json({ error: "websiteId is required" }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    await prisma.analyticsEvent.create({
      data: {
        websiteId,
        pageSlug,
        eventType: "PAGEVIEW",
        referrer: referrer || null,
        userAgent: userAgent ? userAgent.slice(0, 255) : null,
        ipAddress: ipAddress ? ipAddress.slice(0, 50) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Record analytics error:", err);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}

// Protected endpoint to retrieve real analytics for a user's website
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get("websiteId");

    if (!websiteId) {
      return NextResponse.json({ error: "websiteId query parameter is required" }, { status: 400 });
    }

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
    });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    if (website.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const totalViews = await prisma.analyticsEvent.count({
      where: { websiteId },
    });

    // Group by page slug
    const pageEvents = await prisma.analyticsEvent.findMany({
      where: { websiteId },
      select: { pageSlug: true },
    });

    const pageCounts: Record<string, number> = {};
    for (const e of pageEvents) {
      pageCounts[e.pageSlug] = (pageCounts[e.pageSlug] || 0) + 1;
    }

    const topPages = Object.entries(pageCounts)
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count);

    const recentEvents = await prisma.analyticsEvent.findMany({
      where: { websiteId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        pageSlug: true,
        referrer: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      totalViews,
      topPages,
      recentEvents,
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET analytics error:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
