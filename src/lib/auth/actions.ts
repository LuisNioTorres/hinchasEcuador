"use server";

import { revalidatePath } from "next/cache";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

const MAX_NAME_LENGTH = 70;

function cleanName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const clean = value.trim().replace(/\s+/g, " ");
  return clean && clean.length <= MAX_NAME_LENGTH ? clean : null;
}

/**
 * Cambia el nombre y el apellido. Nunca toca el voto.
 *
 * `expectedUserId` es la cuenta que mostraba la pantalla. No da permisos (la cuenta
 * sale siempre de la sesión): si no coincide, la sesión cambió en otra pestaña y no
 * se guarda nada.
 */
export async function saveName(
  firstName: unknown,
  lastName: unknown,
  expectedUserId?: unknown,
): Promise<{ ok: boolean; accountChanged?: boolean }> {
  const nombre = cleanName(firstName);
  const apellido = cleanName(lastName);
  if (!nombre || !apellido) return { ok: false };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  if (expectedUserId !== undefined && user.id !== expectedUserId) {
    return { ok: false, accountChanged: true };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ nombre, apellido })
    .eq("id", user.id);
  if (error) return { ok: false };

  revalidatePath(AUTH_ROUTES.userInfo);
  return { ok: true };
}
