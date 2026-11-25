import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  try {
    const user = await requireAuth();
    const { id, pageId } = await params;

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: { website: true },
    });

    if (!page || page.websiteId !== id) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    if (page.website.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, isHomepage } = body;

    if (isHomepage) {
      // Unset previous homepage
      await prisma.page.updateMany({
        where: { websiteId: id, isHomepage: true },
        data: { isHomepage: false },
      });
    }

    const updated = await prisma.page.update({
      where: { id: pageId },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(slug ? { slug: slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") } : {}),
        ...(isHomepage !== undefined ? { isHomepage: Boolean(isHomepage) } : {}),
      },
    });

    return NextResponse.json({ page: updated, message: "Page updated successfully." });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update page error:", err);
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  try {
    const user = await requireAuth();
    const { id, pageId } = await params;

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: { website: true },
    });

    if (!page || page.websiteId !== id) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    if (page.website.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const totalPages = await prisma.page.count({
      where: { websiteId: id },
    });

    if (totalPages <= 1) {
      return NextResponse.json(
        { error: "A website must have at least one page. You cannot delete the only page." },
        { status: 400 }
      );
    }

    await prisma.page.delete({
      where: { id: pageId },
    });

    // If deleted page was homepage, make the first remaining page the homepage
    if (page.isHomepage) {
      const firstRemaining = await prisma.page.findFirst({
        where: { websiteId: id },
        orderBy: { orderIndex: "asc" },
      });
      if (firstRemaining) {
        await prisma.page.update({
          where: { id: firstRemaining.id },
          data: { isHomepage: true },
        });
      }
    }

    return NextResponse.json({ message: "Page deleted successfully." });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete page error:", err);
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
