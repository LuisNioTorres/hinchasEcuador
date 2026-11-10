import "server-only";

import { connection } from "next/server";
import { redirect } from "next/navigation";
import type { SessionAccount } from "@/lib/auth/account";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

export type FanVote = {
  numero_voto: number;
  club_slug: string;
  provincia: string | null;
  continente: string | null;
};

/** Perfil de quien hizo la petición; sin sesión, lo envía al login. */
export async function requireProfile() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(AUTH_ROUTES.login);

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, apellido")
    .eq("id", user.id)
    .single();
  if (!profile) redirect(AUTH_ROUTES.login);

  const firstName = profile.nombre ?? "";
  const lastName = profile.apellido ?? "";
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
  };
}

/** Cuenta de quien hizo la petición, para mostrarla; sin sesión, lo envía al login. */
export async function requireAccount(): Promise<SessionAccount> {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(AUTH_ROUTES.login);

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, apellido")
    .eq("id", user.id)
    .single();
  const fullName =
    `${profile?.nombre ?? ""} ${profile?.apellido ?? ""}`.trim() || null;

  return {
    userId: user.id,
    email: user.email ?? "",
    fullName,
    provider: user.app_metadata.provider === "google" ? "google" : "email",
  };
}

/** El voto de quien hizo la petición; si aún no vota, lo envía al formulario. */
export async function requireOwnVote(): Promise<FanVote> {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.rpc("mi_voto");
  const vote = (data as FanVote[] | null)?.[0];
  if (!vote) redirect(AUTH_ROUTES.loggedIn);
  return vote;
}
