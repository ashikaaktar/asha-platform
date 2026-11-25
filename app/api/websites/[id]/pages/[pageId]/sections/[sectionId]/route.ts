import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string; sectionId: string }> }
) {
  try {
    const user = await requireAuth();
    const { id, pageId, sectionId } = await params;

    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        page: {
          include: { website: true },
        },
      },
    });

    if (!section || section.pageId !== pageId || section.page.websiteId !== id) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    if (section.page.website.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { content, styles, isVisible, orderIndex } = body;

    const updated = await prisma.section.update({
      where: { id: sectionId },
      data: {
        ...(content ? { contentJson: JSON.stringify(content) } : {}),
        ...(styles ? { stylesJson: JSON.stringify(styles) } : {}),
        ...(isVisible !== undefined ? { isVisible: Boolean(isVisible) } : {}),
        ...(orderIndex !== undefined ? { orderIndex: Number(orderIndex) } : {}),
      },
    });

    return NextResponse.json({
      section: {
        ...updated,
        content: content || JSON.parse(updated.contentJson),
        styles: styles || JSON.parse(updated.stylesJson),
      },
      message: "Section updated successfully.",
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update section error:", err);
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string; sectionId: string }> }
) {
  try {
    const user = await requireAuth();
    const { id, pageId, sectionId } = await params;

    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        page: {
          include: { website: true },
        },
      },
    });

    if (!section || section.pageId !== pageId || section.page.websiteId !== id) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    if (section.page.website.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.section.delete({
      where: { id: sectionId },
    });

    return NextResponse.json({ message: "Section deleted successfully." });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete section error:", err);
    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
  }
}
