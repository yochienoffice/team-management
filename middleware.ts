import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest, res: NextResponse) {
  const response = NextResponse.next({
    request: {
      headers: new Headers(req.headers),
    },
  });
  console.info("Request:", req.nextUrl.pathname);

  const sessionToken = req.cookies.get("token");
  const sessionActivity = req.cookies.get("sessionActivity");

  if (!sessionToken && req.nextUrl.pathname !== "/login") {
    // No session token found, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (sessionActivity) {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const lastActivityTime = parseInt(sessionActivity.value, 10); // Last activity time

    const sessionTimeout = 30 * 60; // 30 minutes in seconds

    if (currentTime - lastActivityTime > sessionTimeout) {
      // Session has expired
      const response = NextResponse.redirect(new URL("/login", req.url));
      // response.cookies.delete("sessionToken");
      // response.cookies.delete("sessionActivity");
      return response;
    }

    // If the session is still valid, update sessionActivity time
    const newActivityTime = currentTime.toString();
    const response = NextResponse.next();
    
    // Update the session activity timestamp
    response.cookies.set("sessionActivity", newActivityTime, {
      maxAge: sessionTimeout,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  }

  if (
    !req.cookies.getAll().find((c) => c.name === "token")?.value &&
    req.nextUrl.pathname !== "/login"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/login",
    "/personal-management/:path*",
    "/record/:path*",
    "/schedule-management/:path*",
    "/team-board/:path*",
    "/team-overview/:path*",
    "/users/:path*",
  ],
};
