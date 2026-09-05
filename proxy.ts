import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
  const accessToken = request.cookies.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(accessToken, accessSecret);
    let requiredRole: string | null = null;
    if (pathname.startsWith("/admin")) {
      requiredRole = "ADMIN";
    } else if (pathname.startsWith("/technician")) {
      requiredRole = "TECHNICIAN";
    } else if (pathname.startsWith("/customer")) {
      requiredRole = "CUSTOMER";
    }

    if (requiredRole && payload.role !== requiredRole) {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    return NextResponse.next();
  } catch {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
    const nextResponse = NextResponse.next({ request });

    const parsedCookies = new Map<string, string>();
    for (const header of setCookieHeaders.length > 0
      ? setCookieHeaders
      : [response.headers.get("set-cookie") ?? ""]) {
      const match = header.match(/^([^=;]+)=([^;]+)/);
      if (!match) continue;
      const [, name, value] = match;
      parsedCookies.set(name, value);
    }

    const newAccessToken = parsedCookies.get("accessToken");
    const newRefreshToken = parsedCookies.get("refreshToken");

    if (!newAccessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    request.cookies.set("accessToken", newAccessToken);
    if (newRefreshToken) {
      request.cookies.set("refreshToken", newRefreshToken);
    }

    nextResponse.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    if (newRefreshToken) {
      nextResponse.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return nextResponse;
  }
}
export const config = {
  matcher: [
    "/profile/:path*",
    "/admin/:path*",
    "/technician/:path*",
    "/customer/:path*",
  ],
};
