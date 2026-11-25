import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const where: any = {};
    if (search && search.trim().length > 0) {
      where.OR = [
        { name: { contains: search.trim() } },
        { email: { contains: search.trim() } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        _count: {
          select: { websites: true, mediaAssets: true },
        },
        planUsage: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Super Admin privileges required." }, { status: 403 });
    }
    console.error("Admin GET users error:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { userId, role, status } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Protect against self-demotion or self-suspension
    if (userId === admin.id && (status === "SUSPENDED" || role === "USER")) {
      return NextResponse.json(
        { error: "Super Admin cannot suspend or demote their own account." },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role ? { role } : {}),
        ...(status ? { status } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json({ user: updated, message: "User status updated successfully." });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Super Admin privileges required." }, { status: 403 });
    }
    console.error("Admin PUT user error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
