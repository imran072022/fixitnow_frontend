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
    const response = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const setCookie = response.headers.get("set-cookie");
    const newAccessToken = response.headers
      .get("set-cookie")
      ?.match(/accessToken=([^;]+)/)?.[1];

    if (!newAccessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Update the request that downstream Next.js code will see.
    request.cookies.set("accessToken", newAccessToken);

    // Create ONE response object.
    const nextResponse = NextResponse.next({ request });

    // Update the browser's cookie as well.
    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie);
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
