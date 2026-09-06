import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const frontendCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function getRequiredRole(pathname: string) {
  if (pathname.startsWith("/admin")) {
    return "ADMIN";
  }
  if (pathname.startsWith("/technician")) {
    return "TECHNICIAN";
  }
  if (pathname.startsWith("/customer")) {
    return "CUSTOMER";
  }
  return null;
}

function extractSetCookieValue(headers: Headers, name: string) {
  const setCookieHeaders = headers.getSetCookie?.() ?? [];
  const headersToSearch = setCookieHeaders.length
    ? setCookieHeaders
    : [headers.get("set-cookie") ?? ""];
  const cookiePattern = new RegExp(`(?:^|[,;]\\s*)${name}=([^;,\\s]+)`);

  for (const header of headersToSearch) {
    const value = header.match(cookiePattern)?.[1];
    if (value) {
      return value;
    }
  }

  return null;
}

async function getRefreshTokens(response: Response) {
  const accessToken = extractSetCookieValue(response.headers, "accessToken");
  const refreshToken = extractSetCookieValue(response.headers, "refreshToken");

  if (accessToken) {
    return { accessToken, refreshToken };
  }

  const payload = (await response
    .clone()
    .json()
    .catch(() => null)) as {
    data?: {
      accessToken?: unknown;
      refreshToken?: unknown;
    };
  } | null;

  return {
    accessToken:
      typeof payload?.data?.accessToken === "string"
        ? payload.data.accessToken
        : null,
    refreshToken:
      typeof payload?.data?.refreshToken === "string"
        ? payload.data.refreshToken
        : null,
  };
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
  const accessToken = request.cookies.get("accessToken")?.value;
  const requiredRole = getRequiredRole(pathname);

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, accessSecret);
      if (requiredRole && payload.role !== requiredRole) {
        return NextResponse.redirect(new URL("/403", request.url));
      }
      return NextResponse.next();
    } catch {
      // Try the refresh token below when the access token is expired or invalid.
    }
  }

  {
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

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await getRefreshTokens(response);

    if (!newAccessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    let payload;
    try {
      ({ payload } = await jwtVerify(newAccessToken, accessSecret));
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (requiredRole && payload.role !== requiredRole) {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    request.cookies.set("accessToken", newAccessToken);
    if (newRefreshToken) {
      request.cookies.set("refreshToken", newRefreshToken);
    }

    const nextResponse = NextResponse.next({ request });
    nextResponse.cookies.set(
      "accessToken",
      newAccessToken,
      frontendCookieOptions,
    );
    if (newRefreshToken) {
      nextResponse.cookies.set(
        "refreshToken",
        newRefreshToken,
        frontendCookieOptions,
      );
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
