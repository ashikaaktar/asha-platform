import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const website = await prisma.website.findUnique({
      where: { id },
      include: {
        pages: {
          include: {
            sections: {
              orderBy: { orderIndex: "asc" },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    if (website.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (website.pages.length === 0) {
      return NextResponse.json(
        { error: "Cannot publish a website without any pages." },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    let requestedSubdomain = body.subdomain ? String(body.subdomain).toLowerCase().trim() : "";

    // Clean requested subdomain: only allow lowercase letters, numbers, and hyphens
    requestedSubdomain = requestedSubdomain
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    // If empty or too short (e.g. site named in Bengali or non-English), generate a clean valid subdomain
    if (!requestedSubdomain || requestedSubdomain.length < 3) {
      const nameCandidate = (website.name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (nameCandidate && nameCandidate.length >= 3) {
        requestedSubdomain = nameCandidate.slice(0, 24);
      } else {
        const catClean = (website.category || "site")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "") || "site";
        const shortId = website.id.replace(/[^a-z0-9]/gi, "").slice(-6).toLowerCase() || Date.now().toString(36).slice(-4);
        requestedSubdomain = `${catClean}-${shortId}`;
      }
    }

    // Ensure length between 3 and 30 characters
    if (requestedSubdomain.length < 3) {
      requestedSubdomain = `${requestedSubdomain}-web`;
    }
    if (requestedSubdomain.length > 30) {
      requestedSubdomain = requestedSubdomain.slice(0, 30).replace(/-+$/, "");
    }

    // Check reserved subdomains
    const reserved = ["www", "admin", "api", "app", "dashboard", "editor", "sites", "auth", "login", "register"];
    if (reserved.includes(requestedSubdomain)) {
      requestedSubdomain = `${requestedSubdomain}-${Date.now().toString(36).slice(-3)}`;
    }

    // If subdomain is already taken by another website, auto-append a unique short suffix so it ALWAYS succeeds
    const existing = await prisma.website.findFirst({
      where: {
        publishedSubdomain: requestedSubdomain,
        NOT: { id: website.id },
      },
    });

    if (existing) {
      const suffix = Date.now().toString(36).slice(-3);
      requestedSubdomain = `${requestedSubdomain.slice(0, 26)}-${suffix}`;
    }

    // Prepare frozen snapshot
    const snapshotData = {
      websiteId: website.id,
      name: website.name,
      subdomain: requestedSubdomain,
      themeConfig: JSON.parse(website.themeConfig || "{}"),
      pages: website.pages.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        isHomepage: p.isHomepage,
        orderIndex: p.orderIndex,
        sections: p.sections.map((s) => ({
          id: s.id,
          type: s.type,
          content: JSON.parse(s.contentJson || "{}"),
          styles: JSON.parse(s.stylesJson || "{}"),
          orderIndex: s.orderIndex,
          isVisible: s.isVisible,
        })),
      })),
      publishedAt: new Date().toISOString(),
    };

    // Upsert published snapshot
    await prisma.publishedSnapshot.upsert({
      where: { websiteId: website.id },
      update: {
        subdomain: requestedSubdomain,
        snapshotJson: JSON.stringify(snapshotData),
        updatedAt: new Date(),
      },
      create: {
        websiteId: website.id,
        subdomain: requestedSubdomain,
        snapshotJson: JSON.stringify(snapshotData),
      },
    });

    // Update website record
    const updatedWebsite = await prisma.website.update({
      where: { id: website.id },
      data: {
        status: "PUBLISHED",
        publishedSubdomain: requestedSubdomain,
      },
    });

    const publicUrl = `/sites/${requestedSubdomain}`;

    return NextResponse.json({
      website: updatedWebsite,
      subdomain: requestedSubdomain,
      publicUrl,
      message: `Website published successfully!`,
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Publish error:", err);
    return NextResponse.json({ error: "Failed to publish website" }, { status: 500 });
  }
}
