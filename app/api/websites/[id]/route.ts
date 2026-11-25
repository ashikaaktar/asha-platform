import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const website = await prisma.website.findUnique({
      where: { id },
      include: {
        pages: {
          include: {
            sections: {
              orderBy: { orderIndex: "asc" },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        publishedSnapshot: {
          select: { subdomain: true, publishedAt: true },
        },
      },
    });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    if (website.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse JSON fields for client convenience
    const formattedWebsite = {
      ...website,
      themeConfig: JSON.parse(website.themeConfig || "{}"),
      pages: website.pages.map((p) => ({
        ...p,
        sections: p.sections.map((s) => ({
          ...s,
          content: JSON.parse(s.contentJson || "{}"),
          styles: JSON.parse(s.stylesJson || "{}"),
        })),
      })),
    };

    return NextResponse.json({ website: formattedWebsite });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/websites/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch website" }, { status: 500 });
  }
}

export async function PUT(
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

    const body = await req.json();
    const { name, category, description, themeConfig, thumbnail } = body;

    const updated = await prisma.website.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(category ? { category } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(thumbnail !== undefined ? { thumbnail } : {}),
        ...(themeConfig ? { themeConfig: JSON.stringify(themeConfig) } : {}),
      },
    });

    return NextResponse.json({ website: updated, message: "Website updated successfully" });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("PUT /api/websites/[id] error:", err);
    return NextResponse.json({ error: "Failed to update website" }, { status: 500 });
  }
}

export async function DELETE(
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

    await prisma.website.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Website deleted successfully" });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/websites/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete website" }, { status: 500 });
  }
}
