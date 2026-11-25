import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signToken, AUTH_COOKIE_NAME, getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. If already logged in, return existing user
    const existingUser = await getSessionUser();
    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // 2. Find or create demo user
    let user = await prisma.user.findUnique({
      where: { email: "demo@asha.site" },
      include: { planUsage: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Creator",
          email: "demo@asha.site",
          passwordHash: "demo_hash_placeholder",
          role: "USER",
          status: "ACTIVE",
          planUsage: {
            create: {
              planName: "Pro",
              maxWebsites: 100,
              maxAiGenerations: 200,
              maxStorageMb: 500,
            },
          },
        },
        include: { planUsage: true },
      });
    } else if (user.planUsage && (user.planUsage.maxWebsites < 100 || user.planUsage.maxAiGenerations < 200)) {
      await prisma.userPlanUsage.update({
        where: { id: user.planUsage.id },
        data: {
          maxWebsites: 100,
          maxAiGenerations: 200,
          planName: "Pro",
        },
      });
    }

    // 3. Sign session token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    const isHttps = req.headers.get("x-forwarded-proto") === "https" || req.url.startsWith("https://");

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("POST /api/auth/guest error:", err);
    return NextResponse.json({ error: "Failed to establish guest session" }, { status: 500 });
  }
}
