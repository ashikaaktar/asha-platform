import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const where: any = { userId: user.id };
    if (search && search.trim().length > 0) {
      where.originalName = { contains: search.trim() };
    }

    const assets = await prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assets });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/media error:", err);
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime type (allow images)
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG images are allowed." },
        { status: 400 }
      );
    }

    // Validate size (max 5MB per image)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size limit of 5MB." },
        { status: 400 }
      );
    }

    // Check user's storage quota
    const usage = await prisma.userPlanUsage.findUnique({
      where: { userId: user.id },
    });
    const maxStorageBytes = (usage?.maxStorageMb ?? 50) * 1024 * 1024;
    const currentStorageBytes = usage?.storageUsedBytes ?? 0;

    if (currentStorageBytes + file.size > maxStorageBytes && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Storage limit reached for your plan. Please delete existing files or upgrade." },
        { status: 403 }
      );
    }

    // Ensure uploads directory exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Generate unique safe filename
    const ext = path.extname(file.name) || ".png";
    const safeUniqueName = `${user.id.slice(-6)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeUniqueName);

    // Save file bytes to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeUniqueName}`;

    // Record in database
    const asset = await prisma.mediaAsset.create({
      data: {
        userId: user.id,
        filename: safeUniqueName,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        url: publicUrl,
      },
    });

    // Update user's used storage
    if (usage) {
      await prisma.userPlanUsage.update({
        where: { id: usage.id },
        data: { storageUsedBytes: { increment: file.size } },
      });
    }

    return NextResponse.json({
      asset,
      message: "Image uploaded successfully.",
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
