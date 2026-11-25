import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { DEFAULT_SECTION_TEMPLATES } from "@/lib/constants";
import { SectionType } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  try {
    const user = await requireAuth();
    const { id, pageId } = await params;

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        website: true,
        sections: { orderBy: { orderIndex: "asc" } },
      },
    });

    if (!page || page.websiteId !== id) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    if (page.website.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { type, content, styles, insertAtIndex } = body;

    const sectionType = (type || "features") as SectionType;
    const defaultData = DEFAULT_SECTION_TEMPLATES[sectionType] || DEFAULT_SECTION_TEMPLATES.features;

    const finalContent = content || defaultData.content;
    const finalStyles = styles || defaultData.styles;

    const currentCount = page.sections.length;
    const targetIndex = typeof insertAtIndex === "number" && insertAtIndex >= 0 && insertAtIndex <= currentCount
      ? insertAtIndex
      : currentCount;

    // Shift sections at or after targetIndex
    if (targetIndex < currentCount) {
      for (let i = currentCount - 1; i >= targetIndex; i--) {
        await prisma.section.update({
          where: { id: page.sections[i].id },
          data: { orderIndex: i + 1 },
        });
      }
    }

    const newSection = await prisma.section.create({
      data: {
        pageId,
        type: sectionType,
        contentJson: JSON.stringify(finalContent),
        stylesJson: JSON.stringify(finalStyles),
        orderIndex: targetIndex,
        isVisible: true,
      },
    });

    return NextResponse.json({
      section: {
        ...newSection,
        content: finalContent,
        styles: finalStyles,
      },
      message: "Section added successfully.",
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Add section error:", err);
    return NextResponse.json({ error: "Failed to add section" }, { status: 500 });
  }
}

// Reorder sections
export async function PATCH(
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
    const { sectionIds } = body;

    if (!Array.isArray(sectionIds)) {
      return NextResponse.json({ error: "sectionIds array is required" }, { status: 400 });
    }

    for (let index = 0; index < sectionIds.length; index++) {
      await prisma.section.updateMany({
        where: { id: sectionIds[index], pageId },
        data: { orderIndex: index },
      });
    }

    return NextResponse.json({ message: "Sections reordered successfully." });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Reorder sections error:", err);
    return NextResponse.json({ error: "Failed to reorder sections" }, { status: 500 });
  }
}
