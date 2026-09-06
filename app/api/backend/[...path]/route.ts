import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const methodsWithBodies = new Set(["POST", "PUT", "PATCH", "DELETE"]);

async function forwardRequest(
  request: Request,
  path: string[],
): Promise<Response> {
  const targetUrl = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/${path.join("/")}`,
  );
  targetUrl.search = new URL(request.url).search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookieHeader = (await cookies()).toString();

  if (contentType) {
    headers.set("Content-Type", contentType);
  }
  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }

  return fetch(targetUrl, {
    method: request.method,
    headers,
    body: methodsWithBodies.has(request.method)
      ? await request.arrayBuffer()
      : undefined,
    cache: "no-store",
  });
}

async function handleRequest(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await context.params;
    const backendResponse = await forwardRequest(request, path);
    const responseHeaders = new Headers();
    const contentType = backendResponse.headers.get("content-type");

    if (contentType) {
      responseHeaders.set("Content-Type", contentType);
    }

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the API server.",
      },
      { status: 502 },
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
