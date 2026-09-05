import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    const body = await request.json();
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    payload = await backendResponse.json().catch(() => null);

    const nextResponse = NextResponse.json(
      payload ?? { message: "Login failed." },
      {
        status: backendResponse.status,
      },
    );

    if (
      backendResponse.ok &&
      payload &&
      typeof payload === "object" &&
      "data" in payload &&
      payload.data &&
      typeof payload.data === "object" &&
      "accessToken" in payload.data &&
      "refreshToken" in payload.data
    ) {
      const tokens = payload.data as {
        accessToken: string;
        refreshToken: string;
      };

      nextResponse.cookies.set("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      nextResponse.cookies.set("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return nextResponse;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the authentication server.",
      },
      {
        status: 502,
      },
    );
  }
}
