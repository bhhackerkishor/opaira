import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Allow public routes (no redirect)
  const publicPaths = ["/login", "/register", "/api", "/_next", "/favicon.ico"];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Unauthenticated → let them go to login/register
  if (!token) {
    return NextResponse.next();
  }

  // Logged in but not onboarded
  if (!token.hasOnboarded && !pathname.startsWith("/onboarding")) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // Already onboarded but trying to visit onboarding again
  if (token.hasOnboarded && pathname.startsWith("/onboarding")) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
