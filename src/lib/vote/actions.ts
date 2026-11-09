"use server";

import { updateTag } from "next/cache";
import { RESULTS_CACHE_TAG } from "@/lib/results/tag";
import { CANTONS, CLUBS, CONTINENTS, PROVINCES } from "@/mocks/catalogs";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type VoteInput = {
  scope: unknown;
  provinceId: unknown;
  cantonId: unknown;
  continentId: unknown;
  clubId: unknown;
};

export type VoteResult = "ok" | "ya-voto" | "sin-sesion" | "invalido" | "error";

/**
 * Registra el voto. La cuenta sale siempre de la sesión del servidor, nunca de lo
 * que envía el navegador. Las reglas definitivas están en la base de datos.
 */
export async function registerVote(input: VoteInput): Promise<VoteResult> {
  const club = CLUBS.find((c) => c.id === input.clubId);
  if (!club) return "invalido";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "sin-sesion";

  const clubRow = await supabase
    .from("clubes")
    .select("id")
    .eq("slug", club.id)
    .single();
  if (!clubRow.data) return "error";

  let location: Record<string, string>;
  if (input.scope === "nacional") {
    const province = PROVINCES.find((p) => p.id === input.provinceId);
    const canton = CANTONS.find(
      (c) => c.id === input.cantonId && c.provinceId === province?.id,
    );
    if (!province || !canton) return "invalido";

    const provinceRow = await supabase
      .from("provincias")
      .select("id")
      .eq("codigo_iso", province.id)
      .single();
    if (!provinceRow.data) return "error";

    const cantonRow = await supabase
      .from("cantones")
      .select("id")
      .eq("provincia_id", provinceRow.data.id)
      .eq("nombre", canton.name)
      .single();
    if (!cantonRow.data) return "error";

    location = {
      provincia_id: provinceRow.data.id,
      canton_id: cantonRow.data.id,
    };
  } else if (input.scope === "internacional") {
    const continent = CONTINENTS.find((c) => c.id === input.continentId);
    if (!continent) return "invalido";

    const continentRow = await supabase
      .from("continentes")
      .select("id")
      .eq("nombre", continent.name)
      .single();
    if (!continentRow.data) return "error";

    location = { continente_id: continentRow.data.id };
  } else {
    return "invalido";
  }

  const { error } = await createAdminClient()
    .from("votos")
    .insert({ usuario_id: user.id, club_id: clubRow.data.id, ...location });

  if (!error) {
    updateTag(RESULTS_CACHE_TAG);
    return "ok";
  }
  return error.code === "23505" ? "ya-voto" : "error";
}
