import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;

  if ((!request.auth || request.auth.error) && pathname !== "/") {
    const url = new URL("/", request.nextUrl.origin);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
