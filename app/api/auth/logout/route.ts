import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function clearAuthCookies(response: NextResponse) {
  response.cookies.set("accessToken", "", {
    ...cookieOptions,
    maxAge: 0,
  });
  response.cookies.set("refreshToken", "", {
    ...cookieOptions,
    maxAge: 0,
  });
}

export async function POST() {
  const cookieHeader = (await cookies()).toString();

  try {
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {
        method: "POST",
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      },
    );
    const body = await backendResponse.text();
    const response = new NextResponse(body, {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get("content-type") || "application/json",
      },
    });

    clearAuthCookies(response);
    return response;
  } catch {
    const response = NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the authentication server.",
      },
      { status: 502 },
    );

    clearAuthCookies(response);
    return response;
  }
}
