import { inkOn } from "@/lib/color";
import type { ProvinceLeaders } from "@/lib/results/province-leaders";
import { buildRanking, sumVotes, type Ranking } from "@/lib/results/rankings";
import type {
  NationalResults,
  ProvinceResults,
  ResultsData,
} from "@/lib/results/types";
import { clubOf } from "@/mocks/catalog-lookup";
import { CANTONS, CONTINENTS, PROVINCES } from "@/mocks/catalogs";

export interface NationalRow {
  readonly slug: string;
  readonly total_votos: number;
}
export interface ProvincialRow extends NationalRow {
  readonly codigo_iso: string;
}
export interface CantonalRow extends ProvincialRow {
  readonly canton: string;
}
export interface ContinentalRow extends NationalRow {
  readonly continente: string;
}
export interface LeaderRow {
  readonly codigo_iso: string;
  readonly slug: string;
  readonly nombre_popular: string;
  readonly color_hex: string;
  readonly porcentaje_dominio: number;
}

export interface ResultRows {
  readonly national: readonly NationalRow[];
  readonly provincial: readonly ProvincialRow[];
  readonly cantonal: readonly CantonalRow[];
  readonly continental: readonly ContinentalRow[];
}

/** Continentes del mapa: América reúne las dos Américas del catálogo. */
const MAP_CONTINENTS: Readonly<Record<string, readonly string[]>> = {
  america: ["america-del-norte", "america-del-sur"],
  europa: ["europa"],
  asia: ["asia"],
  africa: ["africa"],
  oceania: ["oceania"],
};

const nameOf = (clubId: string) => clubOf(clubId).name;

function votesBy<Row extends NationalRow>(
  rows: readonly Row[],
  keyOf: (row: Row) => string,
) {
  const groups = new Map<string, Map<string, number>>();
  for (const row of rows) {
    const key = keyOf(row);
    const votes = groups.get(key) ?? new Map<string, number>();
    votes.set(row.slug, row.total_votos);
    groups.set(key, votes);
  }
  return groups;
}

const NO_VOTES: ReadonlyMap<string, number> = new Map();

function rankingFrom(rows: readonly NationalRow[]): Ranking {
  return buildRanking(
    new Map(rows.map((row) => [row.slug, row.total_votos])),
    nameOf,
  );
}

/** Convierte las filas de las vistas en los rankings que usa la interfaz. */
export function buildResultsData(rows: ResultRows): ResultsData {
  const byProvince = votesBy(rows.provincial, (r) => r.codigo_iso);
  const byCanton = votesBy(rows.cantonal, (r) => `${r.codigo_iso}|${r.canton}`);
  const byContinent = votesBy(rows.continental, (r) => r.continente);

  const provinceResults = new Map<string, ProvinceResults>(
    PROVINCES.map((province) => [
      province.id,
      {
        ranking: buildRanking(byProvince.get(province.id) ?? NO_VOTES, nameOf),
        cantonRankings: new Map(
          CANTONS.filter((c) => c.provinceId === province.id).map((canton) => [
            canton.id,
            buildRanking(
              byCanton.get(`${province.id}|${canton.name}`) ?? NO_VOTES,
              nameOf,
            ),
          ]),
        ),
      },
    ]),
  );

  const continentVotes = (id: string) => {
    const name = CONTINENTS.find((c) => c.id === id)?.name ?? "";
    return byContinent.get(name) ?? NO_VOTES;
  };

  return {
    nationalRanking: rankingFrom(rows.national),
    provinceResults,
    continentRankings: new Map(
      Object.entries(MAP_CONTINENTS).map(([id, parts]) => [
        id,
        buildRanking(sumVotes(parts.map(continentVotes)), nameOf),
      ]),
    ),
    // vista_ranking_continental no trae el total del exterior: es la suma de los continentes.
    internationalRanking: buildRanking(sumVotes(byContinent.values()), nameOf),
  };
}

/** El contador y el TOP 5 de la página principal. */
export function buildHomeResults(
  national: readonly NationalRow[],
): NationalResults {
  const ranking = rankingFrom(national);
  return {
    totalFans: ranking.total,
    top: ranking.entries.slice(0, 5).map((entry) => {
      const club = clubOf(entry.clubId);
      return {
        id: club.id,
        name: club.name,
        percentage: Math.round(entry.percentage),
        color: club.color,
        textColor: inkOn(club.color),
        crest: club.crest,
      };
    }),
  };
}

export function buildProvinceLeaders(
  leaders: readonly LeaderRow[],
): ProvinceLeaders {
  return Object.fromEntries(
    leaders.map((row) => [
      row.codigo_iso,
      {
        clubId: row.slug,
        clubName: row.nombre_popular,
        color: row.color_hex,
        percentage: Math.round(row.porcentaje_dominio),
      },
    ]),
  );
}
