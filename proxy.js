import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { pathname } = request.nextUrl;
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  // Hanya periksa rute /admin
  if (!normalizedPath.startsWith("/admin")) {
    return response;
  }

  // Kecualikan /admin/login
  if (normalizedPath === "/admin/login") {
    return response;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const normalizedUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  const supabase = createServerClient(normalizedUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const middleware = proxy;
export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};

