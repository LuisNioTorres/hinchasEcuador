import "server-only";

import {
  isAuthRetryableFetchError,
  isAuthSessionMissingError,
} from "@supabase/supabase-js";
import type { SessionStatus } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";

/** Qué cuenta tiene hoy la sesión de quien hizo la petición. */
export async function readSessionStatus(): Promise<SessionStatus> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (data.user) return { status: "signed-in", userId: data.user.id };
  if (
    error &&
    !isAuthSessionMissingError(error) &&
    (isAuthRetryableFetchError(error) || (error.status ?? 0) >= 500)
  ) {
    return { status: "unknown" };
  }
  return { status: "signed-out" };
}
