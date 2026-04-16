import { NextResponse, type NextRequest } from "next/server";

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");

    const json = atob(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard/auth/login";
    return NextResponse.redirect(url);
  }

  const payload = decodeJwtPayload(token);
  if (!payload || payload.role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
