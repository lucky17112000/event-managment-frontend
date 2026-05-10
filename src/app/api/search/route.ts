import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getBackendSearchUrl = (): string => {
  if (!API_BASE_URL) return "";
  const base = API_BASE_URL.replace(/\/$/, "");
  // If the env already points to the API version root (e.g. http://localhost:5000/api/v1)
  // then we only need to append /search.
  if (/\/api\/v\d+$/i.test(base)) return `${base}/search`;
  // Otherwise, assume the backend expects the versioned prefix.
  return `${base}/api/v1/search`;
};

const getAccessTokenFromCookie = (cookieHeader: string): string | null => {
  const match = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export async function GET(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { success: false, message: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  const { searchParams } = request.nextUrl;
  const backendUrl = new URL(getBackendSearchUrl(), API_BASE_URL);

  // Forward query parameters to the backend
  searchParams.forEach((value, key) => {
    backendUrl.searchParams.append(key, value);
  });

  const cookie = request.headers.get("cookie") ?? "";
  const accessToken = cookie ? getAccessTokenFromCookie(cookie) : null;

  const headers: Record<string, string> = {};
  if (cookie) headers.cookie = cookie;
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;

  try {
    const res = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: Object.keys(headers).length ? headers : undefined,
      cache: "no-store",
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch search suggestions" },
      { status: 500 },
    );
  }
}
