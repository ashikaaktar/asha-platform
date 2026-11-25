import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { generateWebsiteWithAi, AiGenerationPrompt } from "@/lib/ai-generator";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    // Ensure AI and website limits never block generation
    const usage = await prisma.userPlanUsage.findUnique({
      where: { userId: user.id },
    });

    const maxAi = usage?.maxAiGenerations ?? 50;
    const usedAi = usage?.aiGenerationsUsed ?? 0;
    const currentWebsites = await prisma.website.count({
      where: { userId: user.id },
    });
    const maxWebsites = usage?.maxWebsites ?? 50;

    if (usage && (usedAi >= maxAi || currentWebsites >= maxWebsites)) {
      await prisma.userPlanUsage.update({
        where: { id: usage.id },
        data: {
          maxAiGenerations: Math.max(maxAi, usedAi + 50),
          maxWebsites: Math.max(maxWebsites, currentWebsites + 50),
          planName: "Pro",
        },
      });
    }

    const body = (await req.json()) as AiGenerationPrompt;
    const { name, category, description } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Website name is required." }, { status: 400 });
    }

    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Business or project description is required for AI generation." },
        { status: 400 }
      );
    }

    // Generate website structure
    const { result, provider } = await generateWebsiteWithAi(body);

    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${baseSlug || "site"}-${Date.now().toString(36)}`;

    // Create the website in database with all generated pages and sections
    const website = await prisma.website.create({
      data: {
        userId: user.id,
        name: name.trim(),
        slug,
        category: category || "Business",
        description: description.trim(),
        status: "DRAFT",
        themeConfig: JSON.stringify(result.themeConfig),
        pages: {
          create: result.pages.map((p, pIdx) => ({
            title: p.title,
            slug: p.slug,
            isHomepage: p.isHomepage,
            orderIndex: p.orderIndex ?? pIdx,
            sections: {
              create: p.sections.map((s, sIdx) => ({
                type: s.type,
                contentJson: JSON.stringify(s.content || {}),
                stylesJson: JSON.stringify(s.styles || {}),
                orderIndex: s.orderIndex ?? sIdx,
                isVisible: s.isVisible ?? true,
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

    // Increment AI usage counter
    if (usage) {
      await prisma.userPlanUsage.update({
        where: { id: usage.id },
        data: { aiGenerationsUsed: { increment: 1 } },
      });
    }

    return NextResponse.json({
      website,
      provider,
      remainingAiGenerations: Math.max(0, maxAi - (usedAi + 1)),
      message: `Website successfully generated with ${provider}!`,
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("AI Generation endpoint error:", err);
    return NextResponse.json(
      { error: "Failed to generate website. Please try again." },
      { status: 500 }
    );
  }
}
