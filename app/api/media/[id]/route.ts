import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    if (asset.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete file from disk if exists
    try {
      const filePath = path.join(UPLOADS_DIR, asset.filename);
      await fs.unlink(filePath);
    } catch (e) {
      console.warn("File could not be deleted from disk (may already be gone):", e);
    }

    // Decrement user's storage usage
    const usage = await prisma.userPlanUsage.findUnique({
      where: { userId: asset.userId },
    });
    if (usage) {
      await prisma.userPlanUsage.update({
        where: { id: usage.id },
        data: {
          storageUsedBytes: {
            decrement: Math.min(usage.storageUsedBytes, asset.sizeBytes),
          },
        },
      });
    }

    // Delete record from DB
    await prisma.mediaAsset.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Media deleted successfully." });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete media error:", err);
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }
}
