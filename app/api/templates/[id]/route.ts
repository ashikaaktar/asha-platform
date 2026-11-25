import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { title, category, description, thumbnail, isFeatured, isPublished, data } = body;

    const updated = await prisma.template.update({
      where: { id },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(category ? { category } : {}),
        ...(description ? { description: description.trim() } : {}),
        ...(thumbnail !== undefined ? { thumbnail } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
        ...(data ? { dataJson: JSON.stringify(data) } : {}),
      },
    });

    return NextResponse.json({ template: updated, message: "Template updated successfully." });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("PUT /api/templates/[id] error:", err);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.template.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Template deleted successfully." });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("DELETE /api/templates/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
