import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generalApiRateLimit, checkRateLimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com https://*.upstash.io; frame-src https://accounts.google.com;"
  );
  
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    try {
      const identifier = request.ip ?? "anonymous";
      await checkRateLimit(
        generalApiRateLimit,
        identifier,
        "Too many requests. Please slow down."
      );
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : "Rate limit exceeded" 
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    // Match all API routes
    "/api/:path*",
    // Match all pages except static files and images
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};