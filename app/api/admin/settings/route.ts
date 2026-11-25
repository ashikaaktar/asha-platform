import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await prisma.platformSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
    return NextResponse.json({ settings: settingsMap });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Super Admin privileges required." }, { status: 403 });
    }
    console.error("Admin GET settings error:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "settings object is required" }, { status: 400 });
    }

    for (const [key, value] of Object.entries(settings)) {
      await prisma.platformSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return NextResponse.json({ message: "Platform settings updated successfully." });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Super Admin privileges required." }, { status: 403 });
    }
    console.error("Admin PUT settings error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
