import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

/** Regreso desde Google. La protección de páginas envía al usuario a su destino. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(AUTH_ROUTES.login, request.url));
}
