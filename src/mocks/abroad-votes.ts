/**
 * VOTOS FICTICIOS del exterior para diseñar la sección Internacional de /resultados.
 *
 * No son datos reales ni una estimación: se generan con una semilla fija, así que
 * siempre salen iguales (también entre servidor y navegador).
 *
 * Al conectar la base de datos, esto se reemplaza por vista_ranking_continental
 * (docs/DATOS_INFORMATION.md, Módulo 5).
 */
import { buildRanking, sumVotes, type Ranking } from "@/lib/results/rankings";
import { CLUBS, CONTINENTS } from "@/mocks/catalogs";
import { nameOfClub } from "@/mocks/census-votes";

/** Votos ficticios por continente. Antártida queda en 0 para diseñar ese estado. */
const CONTINENT_VOTES: Readonly<Record<string, number>> = {
  "america-del-norte": 3650,
  europa: 3120,
  "america-del-sur": 860,
  asia: 140,
  oceania: 70,
  africa: 35,
  antartida: 0,
};

/** Peso de partida de los clubes con más hinchada (el resto parte de 0,2). */
const BASE_WEIGHT: Readonly<Record<string, number>> = {
  barcelona: 30,
  emelec: 22,
  "liga-quito": 16,
  "el-nacional": 8,
  "independiente-del-valle": 7,
  aucas: 4,
  "deportivo-cuenca": 3,
};

function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = seeded(20261108);

const VOTES_BY_CONTINENT = new Map(
  CONTINENTS.map((continent) => {
    const total = CONTINENT_VOTES[continent.id] ?? 0;
    const weights = CLUBS.map(
      (club) => (BASE_WEIGHT[club.id] ?? 0.2) * (0.5 + random()),
    );
    const sum = weights.reduce((a, b) => a + b, 0);
    const votes = new Map<string, number>();
    CLUBS.forEach((club, i) => {
      const v = Math.round((total * (weights[i] ?? 0)) / sum);
      if (v > 0) votes.set(club.id, v);
    });
    return [continent.id, votes] as const;
  }),
);

/** Continentes del mapa: América reúne las dos Américas del catálogo. */
const MAP_CONTINENTS: Readonly<Record<string, readonly string[]>> = {
  america: ["america-del-norte", "america-del-sur"],
  europa: ["europa"],
  asia: ["asia"],
  africa: ["africa"],
  oceania: ["oceania"],
};

/** Ranking de cada continente del mapa, a partir de los votos por continente. */
export const CONTINENT_RANKINGS: ReadonlyMap<string, Ranking> = new Map(
  Object.entries(MAP_CONTINENTS).map(([id, parts]) => [
    id,
    buildRanking(
      sumVotes(parts.map((p) => VOTES_BY_CONTINENT.get(p) ?? new Map())),
      nameOfClub,
    ),
  ]),
);

/** Ranking de todos los votos del exterior (suma de los continentes). */
export const INTERNATIONAL_RANKING: Ranking = buildRanking(
  sumVotes(VOTES_BY_CONTINENT.values()),
  nameOfClub,
);
