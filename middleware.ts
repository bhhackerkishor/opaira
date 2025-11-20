// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET = process.env.NEXTAUTH_SECRET!;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET });
  const { pathname } = req.nextUrl;

  // === 1. Public routes (always allow) ===
  const publicPaths = ["/login", "/register", "/api", "/_next", "/favicon.ico"];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // === 2. No token → allow (they'll be redirected by page-level auth if needed) ===
  if (!token) {
    return NextResponse.next();
  }

  // === 3. Onboarding flow (your existing logic) ===
  if (!token.hasOnboarded && !pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
  if (token.hasOnboarded && pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // === 4. ADMIN-ONLY ROUTES: Only allow kishornaveen2193@gmail.com ===
  const adminRoutes = ["/track", "/analytics", "/admin", "/dashboard/analytics"];
  
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    const isAllowedEmail = token.email === "kishornaveen2193@gmail.com";

    if (!isAllowedEmail) {
      // Option A: Redirect to custom 403 page
      return NextResponse.redirect(new URL("/403", req.url));

      // Option B: Or just block with 403 response
      // return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // === 5. All good → continue ===
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};