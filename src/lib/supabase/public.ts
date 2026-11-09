import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "./env";

/** Cliente sin sesión para datos públicos; se puede usar dentro de "use cache". */
export function createPublicClient() {
  const { url, publishableKey } = getSupabaseEnv();

  return createClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
