import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "asha-super-secret-jwt-key-for-modern-blue-brand-platform-2026"
);
const AUTH_COOKIE_NAME = "asha_session";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Check if it's a static file or internal API route
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/uploads") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Protect /admin and /dashboard: strictly restrict access
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/dashboard")) {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (url.pathname.startsWith("/admin") && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Remove port if present for checking
  const hostWithoutPort = hostname.split(":")[0];

  // Check for subdomain routing
  // Matches e.g. "mybrand.asha.site" or "mybrand.localhost"
  const isAshaSite = hostWithoutPort.endsWith(".asha.site");
  const isLocalhostSubdomain =
    hostWithoutPort.endsWith(".localhost") && hostWithoutPort !== "localhost";

  let subdomain: string | null = null;

  if (isAshaSite) {
    const candidate = hostWithoutPort.replace(".asha.site", "");
    if (candidate !== "www" && candidate !== "app" && candidate !== "admin") {
      subdomain = candidate;
    }
  } else if (isLocalhostSubdomain) {
    const candidate = hostWithoutPort.replace(".localhost", "");
    if (candidate !== "www" && candidate !== "app" && candidate !== "admin") {
      subdomain = candidate;
    }
  }

  // If subdomain identified and path isn't already `/sites/...`
  if (subdomain && !url.pathname.startsWith("/sites")) {
    const newUrl = new URL(`/sites/${subdomain}${url.pathname === "/" ? "" : url.pathname}`, req.url);
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
