import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search && search.trim().length > 0) {
      where.OR = [
        { name: { contains: search.trim() } },
        { publishedSubdomain: { contains: search.trim() } },
        { user: { name: { contains: search.trim() } } },
        { user: { email: { contains: search.trim() } } },
      ];
    }

    const websites = await prisma.website.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { pages: true, analyticsEvents: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ websites });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Super Admin privileges required." }, { status: 403 });
    }
    console.error("Admin GET websites error:", err);
    return NextResponse.json({ error: "Failed to fetch websites" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { websiteId, action } = body;

    if (!websiteId) {
      return NextResponse.json({ error: "websiteId is required" }, { status: 400 });
    }

    if (action === "unpublish") {
      await prisma.publishedSnapshot.deleteMany({
        where: { websiteId },
      });
      const updated = await prisma.website.update({
        where: { id: websiteId },
        data: {
          status: "DRAFT",
          publishedSubdomain: null,
        },
      });
      return NextResponse.json({ website: updated, message: "Website unpublished by admin." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Super Admin privileges required." }, { status: 403 });
    }
    console.error("Admin PUT website error:", err);
    return NextResponse.json({ error: "Failed to update website" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get("websiteId");

    if (!websiteId) {
      return NextResponse.json({ error: "websiteId is required" }, { status: 400 });
    }

    await prisma.website.delete({
      where: { id: websiteId },
    });

    return NextResponse.json({ message: "Website deleted by administrator." });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Super Admin privileges required." }, { status: 403 });
    }
    console.error("Admin DELETE website error:", err);
    return NextResponse.json({ error: "Failed to delete website" }, { status: 500 });
  }
}
