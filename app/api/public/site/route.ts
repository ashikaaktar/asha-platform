import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subdomain = searchParams.get("subdomain");

    if (!subdomain) {
      return NextResponse.json({ error: "subdomain parameter required" }, { status: 400 });
    }

    const cleanSubdomain = subdomain.toLowerCase().trim();

    const snapshot = await prisma.publishedSnapshot.findUnique({
      where: { subdomain: cleanSubdomain },
    });

    if (!snapshot) {
      return NextResponse.json({ error: "Published site not found" }, { status: 404 });
    }

    const parsedData = JSON.parse(snapshot.snapshotJson);

    return NextResponse.json({
      snapshot: parsedData,
      publishedAt: snapshot.publishedAt,
    });
  } catch (err: any) {
    console.error("GET /api/public/site error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
