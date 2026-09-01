import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
  const accessToken = request.cookies.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(accessToken, accessSecret);

    let requiredRole: string;

    if (request.nextUrl.pathname.startsWith("/admin")) {
      requiredRole = "ADMIN";
    } else if (request.nextUrl.pathname.startsWith("/technician")) {
      requiredRole = "TECHNICIAN";
    } else {
      requiredRole = "CUSTOMER";
    }
    if (payload.role !== requiredRole) {
      return NextResponse.redirect(new URL("/403", request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/technician/:path*", "/customer/:path*"],
};
