import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const website = await prisma.website.findUnique({
      where: { id },
    });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    if (website.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Remove published snapshot
    await prisma.publishedSnapshot.deleteMany({
      where: { websiteId: website.id },
    });

    // Update website record
    const updated = await prisma.website.update({
      where: { id: website.id },
      data: {
        status: "DRAFT",
        publishedSubdomain: null,
      },
    });

    return NextResponse.json({
      website: updated,
      message: "Website has been unpublished and taken offline.",
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Unpublish error:", err);
    return NextResponse.json({ error: "Failed to unpublish website" }, { status: 500 });
  }
}
