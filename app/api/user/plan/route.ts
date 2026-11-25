import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    let usage = await prisma.userPlanUsage.findUnique({
      where: { userId: user.id },
    });

    if (!usage) {
      usage = await prisma.userPlanUsage.create({
        data: {
          userId: user.id,
          planName: "Free",
          maxWebsites: 3,
          maxAiGenerations: 10,
          maxStorageMb: 50,
        },
      });
    }

    const currentWebsites = await prisma.website.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      planUsage: {
        ...usage,
        currentWebsites,
        storageUsedMb: Number((usage.storageUsedBytes / (1024 * 1024)).toFixed(2)),
      },
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/user/plan error:", err);
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { planName } = body;

    const allowedPlans: Record<
      string,
      { maxWebsites: number; maxAiGenerations: number; maxStorageMb: number }
    > = {
      Free: { maxWebsites: 3, maxAiGenerations: 10, maxStorageMb: 50 },
      Pro: { maxWebsites: 10, maxAiGenerations: 50, maxStorageMb: 250 },
      Agency: { maxWebsites: 99, maxAiGenerations: 200, maxStorageMb: 5000 },
    };

    if (!allowedPlans[planName]) {
      return NextResponse.json({ error: "Invalid plan name" }, { status: 400 });
    }

    const config = allowedPlans[planName];

    const updated = await prisma.userPlanUsage.upsert({
      where: { userId: user.id },
      update: {
        planName,
        maxWebsites: config.maxWebsites,
        maxAiGenerations: config.maxAiGenerations,
        maxStorageMb: config.maxStorageMb,
      },
      create: {
        userId: user.id,
        planName,
        maxWebsites: config.maxWebsites,
        maxAiGenerations: config.maxAiGenerations,
        maxStorageMb: config.maxStorageMb,
      },
    });

    return NextResponse.json({
      planUsage: updated,
      message: `Plan successfully upgraded to ${planName}!`,
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/user/plan error:", err);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}
