import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { DEFAULT_SECTION_TEMPLATES } from "@/lib/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const website = await prisma.website.findUnique({
      where: { id },
      include: { pages: true },
    });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    if (website.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Page title is required." }, { status: 400 });
    }

    const cleanTitle = title.trim();
    const cleanSlug = (slug || cleanTitle)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check slug uniqueness within website
    const existingPage = website.pages.find((p) => p.slug === cleanSlug);
    if (existingPage) {
      return NextResponse.json(
        { error: `A page with URL slug "/${cleanSlug}" already exists.` },
        { status: 409 }
      );
    }

    const orderIndex = website.pages.length;

    // Create page with default Hero and Contact sections
    const newPage = await prisma.page.create({
      data: {
        websiteId: website.id,
        title: cleanTitle,
        slug: cleanSlug,
        isHomepage: website.pages.length === 0,
        orderIndex,
        sections: {
          create: [
            {
              type: "hero",
              contentJson: JSON.stringify({
                ...DEFAULT_SECTION_TEMPLATES.hero.content,
                heading: cleanTitle,
                subheading: `Discover more about ${cleanTitle.toLowerCase()} at ${website.name}.`,
              }),
              stylesJson: JSON.stringify(DEFAULT_SECTION_TEMPLATES.hero.styles),
              orderIndex: 0,
              isVisible: true,
            },
            {
              type: "features",
              contentJson: JSON.stringify(DEFAULT_SECTION_TEMPLATES.features.content),
              stylesJson: JSON.stringify(DEFAULT_SECTION_TEMPLATES.features.styles),
              orderIndex: 1,
              isVisible: true,
            },
          ],
        },
      },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    return NextResponse.json({
      page: {
        ...newPage,
        sections: newPage.sections.map((s) => ({
          ...s,
          content: JSON.parse(s.contentJson),
          styles: JSON.parse(s.stylesJson),
        })),
      },
      message: "Page created successfully.",
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create page error:", err);
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
