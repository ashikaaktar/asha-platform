import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = { isPublished: true };

    if (category && category !== "All") {
      where.category = category;
    }

    if (search && search.trim().length > 0) {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    const formatted = templates.map((t) => ({
      ...t,
      data: JSON.parse(t.dataJson || "{}"),
    }));

    return NextResponse.json({ templates: formatted });
  } catch (err: any) {
    console.error("GET /api/templates error:", err);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { title, category, description, thumbnail, isFeatured, isPublished, data } = body;

    if (!title || !category || !description) {
      return NextResponse.json(
        { error: "Title, category, and description are required." },
        { status: 400 }
      );
    }

    const template = await prisma.template.create({
      data: {
        title: title.trim(),
        category,
        description: description.trim(),
        thumbnail: thumbnail || null,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        dataJson: JSON.stringify(data || {}),
      },
    });

    return NextResponse.json({ template, message: "Template created successfully." });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("POST /api/templates error:", err);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}
