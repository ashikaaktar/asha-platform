import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { DEFAULT_SECTION_TEMPLATES } from "@/lib/constants";

export async function GET() {
  try {
    const user = await requireAuth();

    const websites = await prisma.website.findMany({
      where: { userId: user.id },
      include: {
        pages: {
          select: { id: true, title: true, slug: true, isHomepage: true },
          orderBy: { orderIndex: "asc" },
        },
        _count: {
          select: { analyticsEvents: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ websites });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/websites error:", err);
    return NextResponse.json({ error: "Failed to fetch websites" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    // Ensure plan limits never block creation
    const usage = await prisma.userPlanUsage.findUnique({
      where: { userId: user.id },
    });
    const currentCount = await prisma.website.count({
      where: { userId: user.id },
    });

    const maxAllowed = usage?.maxWebsites ?? 50;
    if (currentCount >= maxAllowed && user.role !== "ADMIN") {
      if (usage) {
        await prisma.userPlanUsage.update({
          where: { id: usage.id },
          data: { maxWebsites: currentCount + 50, planName: "Pro" },
        });
      }
    }

    const body = await req.json();
    const { name, category = "General", templateId, initialPages, themeConfig } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Website name is required." }, { status: 400 });
    }

    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${baseSlug || "site"}-${Date.now().toString(36)}`;

    // Prepare pages to create
    let pagesToCreate: any[] = [];

    if (templateId) {
      const template = await prisma.template.findUnique({
        where: { id: templateId },
      });
      if (template) {
        try {
          const parsed = JSON.parse(template.dataJson);
          if (parsed.pages && Array.isArray(parsed.pages)) {
            pagesToCreate = parsed.pages;
          }
        } catch (e) {
          console.error("Error parsing template JSON:", e);
        }
      }
    } else if (initialPages && Array.isArray(initialPages) && initialPages.length > 0) {
      pagesToCreate = initialPages;
    } else {
      // Default blank starter with 1 homepage and default Hero + Features + Footer
      pagesToCreate = [
        {
          title: "Home",
          slug: "home",
          isHomepage: true,
          orderIndex: 0,
          sections: [
            {
              type: "hero",
              content: {
                ...DEFAULT_SECTION_TEMPLATES.hero.content,
                heading: `Welcome to ${name.trim()}`,
              },
              styles: DEFAULT_SECTION_TEMPLATES.hero.styles,
              orderIndex: 0,
            },
            {
              type: "features",
              content: DEFAULT_SECTION_TEMPLATES.features.content,
              styles: DEFAULT_SECTION_TEMPLATES.features.styles,
              orderIndex: 1,
            },
            {
              type: "footer",
              content: {
                ...DEFAULT_SECTION_TEMPLATES.footer.content,
                brandName: name.trim(),
              },
              styles: DEFAULT_SECTION_TEMPLATES.footer.styles,
              orderIndex: 2,
            },
          ],
        },
      ];
    }

    const website = await prisma.website.create({
      data: {
        userId: user.id,
        name: name.trim(),
        slug,
        category: category || "General",
        status: "DRAFT",
        themeConfig: themeConfig ? JSON.stringify(themeConfig) : JSON.stringify({
          primaryColor: "#2563EB",
          fontFamily: "Inter",
          borderRadius: "md",
        }),
        pages: {
          create: pagesToCreate.map((page: any, pIdx: number) => ({
            title: page.title || "Home",
            slug: page.slug || (pIdx === 0 ? "home" : `page-${pIdx + 1}`),
            isHomepage: page.isHomepage ?? pIdx === 0,
            orderIndex: page.orderIndex ?? pIdx,
            sections: {
              create: (page.sections || []).map((sec: any, sIdx: number) => ({
                type: sec.type || "hero",
                contentJson: JSON.stringify(sec.content || {}),
                stylesJson: JSON.stringify(sec.styles || {}),
                orderIndex: sec.orderIndex ?? sIdx,
                isVisible: sec.isVisible ?? true,
              })),
            },
          })),
        },
      },
      include: {
        pages: {
          include: {
            sections: {
              orderBy: { orderIndex: "asc" },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    return NextResponse.json({ website, message: "Website created successfully." });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/websites error:", err);
    return NextResponse.json({ error: "Failed to create website" }, { status: 500 });
  }
}
