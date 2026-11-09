// Phase 1 — request tracing + structured logging (v0.5.0).
// Every request gets an x-request-id (echoed on the response, reused if the
// caller sent one) and one structured JSON log line on stdout, which is the
// container log stream in production and dev.log in this sandbox.

import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/api/:path*"],
};

export function middleware(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-request-id", requestId);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("x-request-id", requestId);
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "info",
      msg: "http_request",
      requestId,
      method: req.method,
      path: req.nextUrl.pathname,
    }),
  );
  return res;
}
