import { NextResponse } from "next/server";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST(request: Request) {
  try {
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(await request.json()),
      },
    );
    const body = await backendResponse.text();
    let payload: unknown;

    try {
      payload = JSON.parse(body);
    } catch {
      payload = null;
    }

    const response = new NextResponse(body, {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get("content-type") || "application/json",
      },
    });

    if (
      backendResponse.ok &&
      payload &&
      typeof payload === "object" &&
      "data" in payload &&
      payload.data &&
      typeof payload.data === "object" &&
      "accessToken" in payload.data &&
      "refreshToken" in payload.data &&
      typeof payload.data.accessToken === "string" &&
      typeof payload.data.refreshToken === "string"
    ) {
      response.cookies.set(
        "accessToken",
        payload.data.accessToken,
        cookieOptions,
      );
      response.cookies.set(
        "refreshToken",
        payload.data.refreshToken,
        cookieOptions,
      );
    }

    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the authentication server.",
      },
      { status: 502 },
    );
  }
}
