import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy API route for Graphinya backend requests.
 * Avoids CORS issues when the Graphinya backend is on a different host.
 * 
 * POST /api/grafinya/proxy
 * Body: { path: string, method: string, body?: unknown, baseUrl: string, accessToken?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { path, method = "GET", body, baseUrl, accessToken } = await request.json();

    if (!baseUrl || !path) {
      return NextResponse.json(
        { error: "baseUrl and path are required" },
        { status: 400 }
      );
    }

    const targetUrl = `${baseUrl}/api/v1${path}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept-Language": "ru-RU",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
