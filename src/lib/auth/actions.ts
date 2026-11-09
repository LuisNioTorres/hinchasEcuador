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

/** Cambia el nombre y el apellido. Nunca toca el voto. */
export async function saveName(
  firstName: unknown,
  lastName: unknown,
): Promise<{ ok: boolean }> {
  const nombre = cleanName(firstName);
  const apellido = cleanName(lastName);
  if (!nombre || !apellido) return { ok: false };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { error } = await supabase
    .from("profiles")
    .update({ nombre, apellido })
    .eq("id", user.id);
  if (error) return { ok: false };

  revalidatePath(AUTH_ROUTES.userInfo);
  return { ok: true };
}

/** Cierra la sesión solo en este dispositivo. */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
}
