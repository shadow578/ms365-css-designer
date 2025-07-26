import { type NextRequest, NextResponse } from "next/server";
import { getBaseUrl } from "./util/baseUrl";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/converged-signin-page")) {
    // only allow access to the signin page within the iframe
    const referer = req.headers.get("referer");
    const context = req.headers.get("sec-fetch-dest");
    if (!referer?.startsWith(getBaseUrl()) || context !== "iframe") {
      return NextResponse.error();
    }
  }

  return NextResponse.next();
}
