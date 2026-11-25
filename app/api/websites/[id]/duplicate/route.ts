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

    const original = await prisma.website.findUnique({
      where: { id },
      include: {
        pages: {
          include: {
            sections: true,
          },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!original) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    if (original.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check plan limits
    const usage = await prisma.userPlanUsage.findUnique({
      where: { userId: user.id },
    });
    const currentCount = await prisma.website.count({
      where: { userId: user.id },
    });
    const maxAllowed = usage?.maxWebsites ?? 5;
    if (currentCount >= maxAllowed && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Website limit reached for your plan." },
        { status: 403 }
      );
    }

    const duplicateName = `${original.name} (Copy)`;
    const slug = `${original.slug}-copy-${Date.now().toString(36)}`;

    const duplicate = await prisma.website.create({
      data: {
        userId: user.id,
        name: duplicateName,
        slug,
        category: original.category,
        description: original.description,
        status: "DRAFT", // always reset to draft
        themeConfig: original.themeConfig,
        thumbnail: original.thumbnail,
        pages: {
          create: original.pages.map((p) => ({
            title: p.title,
            slug: p.slug,
            isHomepage: p.isHomepage,
            orderIndex: p.orderIndex,
            sections: {
              create: p.sections.map((s) => ({
                type: s.type,
                contentJson: s.contentJson,
                stylesJson: s.stylesJson,
                orderIndex: s.orderIndex,
                isVisible: s.isVisible,
              })),
            },
          })),
        },
      },
      include: {
        pages: {
          include: {
            sections: true,
          },
        },
      },
    });

    return NextResponse.json({
      website: duplicate,
      message: "Website duplicated successfully.",
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Duplicate website error:", err);
    return NextResponse.json({ error: "Failed to duplicate website" }, { status: 500 });
  }
}
