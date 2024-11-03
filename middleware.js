import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    try {
      const session = await getSession(request);
      if (!session || !session.user) {
        const loginUrl = new URL("/api/auth/login", request.url);
        loginUrl.searchParams.set("returnTo", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error("Error in middleware:", error);
      const loginUrl = new URL("/api/auth/login", request.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/success") {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    const email = request.nextUrl.searchParams.get("email");

    if (!sessionId || !email) {
      return NextResponse.redirect(new URL("/dashboard/purchase", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/success"],
};
