import { cacheLife, cacheTag } from "next/cache";
import {
  buildHomeResults,
  buildProvinceLeaders,
  totalAbroad,
  type CantonalRow,
  type ContinentalRow,
  type LeaderRow,
  type NationalRow,
  type ProvincialRow,
  type ResultRows,
} from "@/lib/results/build";
import type { ProvinceLeaders } from "@/lib/results/province-leaders";
import { RESULTS_CACHE_TAG } from "@/lib/results/tag";
import type { NationalResultsResponse } from "@/lib/results/types";
import { createPublicClient } from "@/lib/supabase/public";

/** Supabase devuelve como máximo 1000 filas por consulta. */
const PAGE_SIZE = 1000;

/** Lee una vista completa, por páginas y en un orden estable. */
async function readAll<Row>(
  view: string,
  columns: string,
  orderBy: readonly string[],
): Promise<Row[]> {
  const supabase = createPublicClient();
  const rows: Row[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    let query = supabase.from(view).select(columns);
    for (const column of orderBy) query = query.order(column);
    const { data, error } = await query.range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`${view}: ${error.message}`);
    rows.push(...(data as Row[]));
    if (data.length < PAGE_SIZE) return rows;
  }
}

const readNational = () =>
  readAll<NationalRow>("vista_ranking_nacional", "slug, total_votos", ["slug"]);

/** Todas las filas que necesita /resultados. */
export async function getResultRows(): Promise<ResultRows> {
  "use cache";
  cacheTag(RESULTS_CACHE_TAG);
  cacheLife("minutes");

  const [national, provincial, cantonal, continental] = await Promise.all([
    readNational(),
    readAll<ProvincialRow>(
      "vista_ranking_provincial",
      "codigo_iso, slug, total_votos",
      ["codigo_iso", "slug"],
    ),
    readAll<CantonalRow>(
      "vista_ranking_cantonal",
      "codigo_iso, canton, slug, total_votos",
      ["codigo_iso", "canton", "slug"],
    ),
    readAll<ContinentalRow>(
      "vista_ranking_continental",
      "continente, slug, total_votos",
      ["continente", "slug"],
    ),
  ]);
  return { national, provincial, cantonal, continental };
}

/** Lo que necesita la página principal. Un fallo se reintenta al minuto. */
export async function getHomeResults(): Promise<{
  results: NationalResultsResponse;
  provinceLeaders: ProvinceLeaders;
}> {
  "use cache";
  cacheTag(RESULTS_CACHE_TAG);
  cacheLife("minutes");

  try {
    const [national, continental, leaders] = await Promise.all([
      readNational(),
      readAll<ContinentalRow>(
        "vista_ranking_continental",
        "continente, slug, total_votos",
        ["continente", "slug"],
      ),
      readAll<LeaderRow>(
        "vista_lideres_provinciales",
        "codigo_iso, slug, nombre_popular, color_hex, porcentaje_dominio",
        ["codigo_iso"],
      ),
    ]);
    return {
      results: {
        status: "ok",
        data: buildHomeResults(national, totalAbroad(continental)),
      },
      provinceLeaders: buildProvinceLeaders(leaders),
    };
  } catch {
    return { results: { status: "error", data: null }, provinceLeaders: {} };
  }
}

/** Los clubes con más votos, para "Los más elegidos" del formulario. */
export async function getTopClubSlugs(limit: number): Promise<string[]> {
  "use cache";
  cacheTag(RESULTS_CACHE_TAG);
  cacheLife("minutes");

  const { data, error } = await createPublicClient()
    .from("vista_ranking_nacional")
    .select("slug")
    .order("posicion_ranking")
    .limit(limit);
  return error ? [] : data.map((row) => row.slug as string);
}
