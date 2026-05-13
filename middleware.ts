import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  let { nextUrl } = request;

  const hasToken = request.cookies.has("userType");
  console.log("middleware", request.nextUrl.pathname, hasToken);
  console.log("Middleware request URL:");
  if (request.nextUrl.pathname == "/login") {
    if (hasToken) {
      return NextResponse.redirect(new URL("/", request.url));
    } else {
      return NextResponse.next();
    }
  }
  if (hasToken && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
