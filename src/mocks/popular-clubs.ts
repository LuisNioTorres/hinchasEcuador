/**
 * PROVISIONAL: accesos directos del formulario de voto ("Los más elegidos").
 *
 * Lista elegida a mano mientras no haya votos. Con datos reales, se tomarán los
 * 10 primeros del ranking nacional del propio censo, así nadie decide a mano qué
 * equipos aparecen primero. Son `id` de src/mocks/catalogs.ts.
 */
export const POPULAR_CLUB_IDS = [
  "barcelona",
  "emelec",
  "liga-quito",
  "el-nacional",
  "independiente-del-valle",
  "aucas",
  "deportivo-cuenca",
  "universidad-catolica",
  "delfin",
  "macara",
] as const;
