import { type NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/converged-signin-page")) {
    // only allow access to the signin page within the iframe
    const context = req.headers.get("sec-fetch-dest");
    if (context !== "iframe") {
      console.warn(
        `invalid access to signin page. sec-fetch-dest='${context}'`,
      );
      return NextResponse.error();
    }
  }

  return NextResponse.next();
}
