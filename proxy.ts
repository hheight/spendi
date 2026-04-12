import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken, validateJWT } from "./lib/auth/session";
import { config as authConfig } from "./lib/auth/config";

const protectedRoutes = ["/dashboard", "/expenses", "/budgets"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const accessToken = req.cookies?.get("access_token")?.value;
  const refreshToken = req.cookies?.get("refresh_token")?.value;

  if (!refreshToken && !accessToken && isPublicRoute) {
    return NextResponse.next();
  }

  if (accessToken) {
    const isValid = validateJWT(accessToken, authConfig.jwt.secret);

    if (isValid && isProtectedRoute) {
      return NextResponse.next();
    }
  }

  const userId = await refreshAccessToken(refreshToken);

  if (isProtectedRoute && !userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/expenses", "/budgets", "/login", "/signup", "/"]
};
