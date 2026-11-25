import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const planUsage = await prisma.userPlanUsage.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json({
    user: {
      ...user,
      planUsage,
    },
  });
}
