import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(
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

    const theme = JSON.parse(website.themeConfig || "{}");
    const primaryColor = theme.primaryColor || "#2563EB";

    // Generate standalone production HTML with Tailwind CDN
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(website.name)}</title>
  <meta name="description" content="${escapeHtml(website.description || "Created with ASHA")}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #102A56; }
  </style>
</head>
<body class="bg-white antialiased">
  <!-- Navigation -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <span class="font-extrabold text-xl tracking-tight text-slate-900">${escapeHtml(website.name)}</span>
      <nav class="flex items-center gap-6 text-sm font-semibold text-slate-600">
        ${website.pages
          .map(
            (p) =>
              `<a href="#page-${p.slug}" class="hover:text-blue-600 transition-colors">${escapeHtml(
                p.title
              )}</a>`
          )
          .join("\n        ")}
      </nav>
    </div>
  </header>

  <!-- Pages Content -->
  ${website.pages
    .map(
      (page) => `
  <section id="page-${page.slug}" class="py-12 border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      ${page.sections
        .filter((s) => s.isVisible)
        .map((s) => renderSectionHtml(s, primaryColor))
        .join("\n")}
    </div>
  </section>`
    )
    .join("\n")}

  <!-- Footer -->
  <footer class="py-8 bg-slate-900 text-slate-400 text-center text-xs">
    <p>© ${new Date().getFullYear()} ${escapeHtml(website.name)}. Built and exported with ASHA Website Builder.</p>
  </footer>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${website.slug}.html"`,
      },
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Export error:", err);
    return NextResponse.json({ error: "Failed to export website" }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderSectionHtml(section: any, primaryColor: string): string {
  const content = JSON.parse(section.contentJson || "{}");
  const styles = JSON.parse(section.stylesJson || "{}");
  const bg = styles.backgroundColor || "#FFFFFF";
  const textColor = styles.textColor || "#102A56";
  const accent = styles.accentColor || primaryColor;

  if (section.type === "hero") {
    return `
      <div class="py-12" style="background-color: ${bg}; color: ${textColor};">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 space-y-6">
            ${content.badge ? `<span class="inline-block px-3 py-1 rounded-full text-xs font-semibold" style="background-color: ${accent}20; color: ${accent};">${escapeHtml(content.badge)}</span>` : ""}
            <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">${escapeHtml(content.heading || "")}</h1>
            <p class="text-lg opacity-85 leading-relaxed">${escapeHtml(content.subheading || "")}</p>
            <div class="flex gap-4 pt-2">
              ${content.primaryButtonText ? `<a href="${content.primaryButtonLink || "#"}" class="px-6 py-3 rounded-xl font-bold text-white shadow-md inline-block" style="background-color: ${accent};">${escapeHtml(content.primaryButtonText)}</a>` : ""}
              ${content.secondaryButtonText ? `<a href="${content.secondaryButtonLink || "#"}" class="px-6 py-3 rounded-xl font-bold border border-slate-300 inline-block hover:bg-slate-50">${escapeHtml(content.secondaryButtonText)}</a>` : ""}
            </div>
          </div>
          ${content.imageUrl ? `<div class="lg:col-span-5"><img src="${content.imageUrl}" class="w-full h-80 object-cover rounded-2xl shadow-xl" alt="Hero"></div>` : ""}
        </div>
      </div>`;
  }

  if (section.type === "features") {
    return `
      <div class="py-12" style="background-color: ${bg}; color: ${textColor};">
        <div class="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <h2 class="text-3xl font-extrabold tracking-tight">${escapeHtml(content.heading || "Features")}</h2>
          ${content.subheading ? `<p class="opacity-80">${escapeHtml(content.subheading)}</p>` : ""}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${(content.features || [])
            .map(
              (f: any) => `
            <div class="p-6 rounded-2xl border border-slate-200 bg-white/80 shadow-xs space-y-3">
              <h3 class="font-bold text-lg">${escapeHtml(f.title || "")}</h3>
              <p class="text-sm opacity-80 leading-relaxed">${escapeHtml(f.description || "")}</p>
            </div>`
            )
            .join("\n")}
        </div>
      </div>`;
  }

  // Generic fallback rendering for other sections
  return `
    <div class="py-8" style="background-color: ${bg}; color: ${textColor};">
      <h3 class="text-2xl font-bold mb-3">${escapeHtml(content.heading || section.type)}</h3>
      <p class="opacity-80">${escapeHtml(content.subheading || content.description || "")}</p>
    </div>`;
}
