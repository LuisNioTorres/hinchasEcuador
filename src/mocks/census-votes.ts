/**
 * VOTOS FICTICIOS para diseñar la página de resultados del usuario logueado.
 *
 * No son datos reales ni una estimación: se generan con una semilla fija, así que
 * siempre salen iguales (también entre servidor y navegador). Se reparten por
 * cantón dando más peso a los clubes grandes, a los de la región y a los de la
 * propia provincia, para que el mapa y los rankings se vean creíbles.
 *
 * Al conectar la base de datos, esto se reemplaza por las vistas de
 * docs/DATOS_INFORMATION.md (Módulo 5): vista_ranking_nacional,
 * vista_ranking_provincial, vista_lideres_provinciales y vista_ranking_cantonal.
 */
import { CANTONS, CLUBS, PROVINCES } from "@/mocks/catalogs";
import { buildRanking, sumVotes, type Ranking } from "@/lib/results/rankings";

/** Generador pseudoaleatorio con semilla (mulberry32). */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Peso de partida de los clubes con más hinchada (el resto parte de 0,25). */
const BASE_WEIGHT: Readonly<Record<string, number>> = {
  barcelona: 30,
  emelec: 22,
  "liga-quito": 14,
  "el-nacional": 7,
  "independiente-del-valle": 5,
  aucas: 4,
  "deportivo-cuenca": 3.5,
  delfin: 2.2,
  "universidad-catolica": 2,
  macara: 1.5,
};
/** Votos de cada provincia: proporcionales a su población aproximada (miles de habitantes / 250). */
const PROVINCE_VOTES: Readonly<Record<string, number>> = {
  "EC-G": 17560,
  "EC-P": 12360,
  "EC-M": 6370,
  "EC-R": 3600,
  "EC-A": 3200,
  "EC-O": 2860,
  "EC-T": 2250,
  "EC-E": 2210,
  "EC-SD": 1970,
  "EC-L": 1940,
  "EC-H": 1880,
  "EC-X": 1880,
  "EC-I": 1880,
  "EC-SE": 1540,
  "EC-F": 910,
  "EC-B": 800,
  "EC-U": 800,
  "EC-S": 770,
  "EC-D": 730,
  "EC-C": 690,
  "EC-N": 530,
  "EC-Y": 440,
  "EC-Z": 440,
  "EC-W": 110,
};
const COAST = new Set([
  "EC-G",
  "EC-M",
  "EC-O",
  "EC-R",
  "EC-SE",
  "EC-E",
  "EC-W",
]);
const SIERRA = new Set([
  "EC-P",
  "EC-I",
  "EC-C",
  "EC-X",
  "EC-T",
  "EC-H",
  "EC-B",
  "EC-A",
  "EC-F",
  "EC-L",
]);
const SIERRA_CLUBS = new Set([
  "liga-quito",
  "el-nacional",
  "aucas",
  "independiente-del-valle",
  "universidad-catolica",
  "deportivo-cuenca",
]);
const COAST_CLUBS = new Set(["barcelona", "emelec"]);

const clubName = new Map(CLUBS.map((c) => [c.id, c.name]));
export const nameOfClub = (clubId: string) => clubName.get(clubId) ?? clubId;

function weightsFor(provinceId: string) {
  return CLUBS.map((club) => {
    const base = BASE_WEIGHT[club.id];
    let w = base ?? 0.25;
    if (COAST.has(provinceId) && COAST_CLUBS.has(club.id)) w *= 1.6;
    if (SIERRA.has(provinceId) && COAST_CLUBS.has(club.id)) w *= 0.55;
    if (SIERRA.has(provinceId) && SIERRA_CLUBS.has(club.id)) w *= 2;
    // Hinchada local: los clubes de la provincia tienen un empuje claro.
    if (club.provinceId === provinceId) w = w * 3 + (base ? 6 : 3);
    return w;
  });
}

const random = seeded(20261107);
const cantonsByProvince = new Map(
  PROVINCES.map((p) => [p.id, CANTONS.filter((c) => c.provinceId === p.id)]),
);
/** Reparto de los votos de cada provincia: la cabecera (primer cantón del catálogo) se lleva la mitad. */
const cantonTotals = new Map<string, number>();
for (const [provinceId, cantons] of cantonsByProvince) {
  const shares = cantons.map((_, i) => (i === 0 ? 0 : 0.2 + random()));
  const rest = shares.reduce((a, b) => a + b, 0);
  const total = PROVINCE_VOTES[provinceId] ?? 0;
  cantons.forEach((c, i) => {
    const share =
      cantons.length === 1
        ? 1
        : i === 0
          ? 0.5
          : (0.5 * (shares[i] ?? 0)) / rest;
    cantonTotals.set(c.id, Math.max(12, Math.round(total * share)));
  });
}

/** Votos por club de cada cantón. */
export const VOTES_BY_CANTON: ReadonlyMap<
  string,
  ReadonlyMap<string, number>
> = new Map(
  CANTONS.map((canton) => {
    const total = cantonTotals.get(canton.id) ?? 0;
    const weights = weightsFor(canton.provinceId).map(
      (w) => w * (0.35 + random() * 1.3),
    );
    const sum = weights.reduce((a, b) => a + b, 0);
    const votes = new Map<string, number>();
    CLUBS.forEach((club, i) => {
      const v = Math.round((total * (weights[i] ?? 0)) / sum);
      if (v > 0) votes.set(club.id, v);
    });
    return [canton.id, votes];
  }),
);

export interface ProvinceResults {
  readonly ranking: Ranking;
  /** Club líder de cada cantón de la provincia (para el mapa cantonal). */
  readonly cantonRankings: ReadonlyMap<string, Ranking>;
}

export const PROVINCE_RESULTS: ReadonlyMap<string, ProvinceResults> = new Map(
  PROVINCES.map((province) => {
    const cantons = CANTONS.filter((c) => c.provinceId === province.id);
    const cantonRankings = new Map(
      cantons.map((c) => [
        c.id,
        buildRanking(VOTES_BY_CANTON.get(c.id) ?? new Map(), nameOfClub),
      ]),
    );
    const ranking = buildRanking(
      sumVotes(cantons.map((c) => VOTES_BY_CANTON.get(c.id) ?? new Map())),
      nameOfClub,
    );
    return [province.id, { ranking, cantonRankings }];
  }),
);

/** Ranking nacional: solo votos con provincia (los del exterior van aparte). */
export const NATIONAL_RANKING: Ranking = buildRanking(
  sumVotes(VOTES_BY_CANTON.values()),
  nameOfClub,
);
