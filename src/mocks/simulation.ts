/**
 * SIMULACIÓN TEMPORAL de escenarios con pocos votos (máximo 5 en todo el sistema).
 *
 * Solo la usan las rutas /simulacion/*, que no existen en producción. No se mezcla
 * con los demás datos de la página ni toca la base de datos.
 */
import type { ResultsData } from "@/components/results/results-data";
import { inkOn } from "@/lib/color";
import { buildRanking, type Ranking } from "@/lib/results/rankings";
import {
  getProvinceLeaders,
  type ProvinceLeaders,
} from "@/lib/results/province-leaders";
import { clubOf } from "@/mocks/catalog-lookup";
import { CANTONS, CLUBS, PROVINCES } from "@/mocks/catalogs";
import type { NationalResultsResponse } from "@/mocks/national-results";

type Vote =
  | { readonly club: string; readonly province: string }
  | { readonly club: string; readonly continent: string };

export interface Scenario {
  readonly id: string;
  readonly label: string;
  readonly votes: readonly Vote[];
}

export const SCENARIOS: readonly Scenario[] = [
  { id: "cero", label: "0 votos", votes: [] },
  {
    id: "uno",
    label: "1 equipo",
    votes: [{ club: "barcelona", province: "EC-G" }],
  },
  {
    id: "dos",
    label: "2 equipos",
    votes: [
      { club: "barcelona", province: "EC-G" },
      { club: "barcelona", province: "EC-G" },
      { club: "emelec", province: "EC-P" },
      { club: "emelec", continent: "america-del-norte" },
      { club: "barcelona", continent: "europa" },
    ],
  },
  {
    id: "tres",
    label: "3 equipos",
    votes: [
      { club: "barcelona", province: "EC-G" },
      { club: "barcelona", province: "EC-M" },
      { club: "emelec", province: "EC-G" },
      { club: "liga-quito", province: "EC-P" },
      { club: "barcelona", continent: "europa" },
    ],
  },
  {
    id: "cinco",
    label: "5 equipos",
    votes: [
      { club: "barcelona", province: "EC-G" },
      { club: "emelec", province: "EC-M" },
      { club: "liga-quito", province: "EC-P" },
      { club: "el-nacional", province: "EC-A" },
      { club: "independiente-del-valle", province: "EC-T" },
    ],
  },
];

const nameOf = (clubId: string) => clubOf(clubId).name;

function tally(clubs: readonly string[]) {
  const out = new Map<string, number>();
  for (const club of clubs) out.set(club, (out.get(club) ?? 0) + 1);
  return out;
}

const firstCanton = (province: string) =>
  CANTONS.find((c) => c.provinceId === province)?.id;

function inEcuador(votes: readonly Vote[]) {
  return votes.flatMap((v) => ("province" in v ? [v] : []));
}

function nationalRanking(votes: readonly Vote[]): Ranking {
  return buildRanking(tally(inEcuador(votes).map((v) => v.club)), nameOf);
}

export function resultsDataFor(scenario: Scenario): ResultsData {
  const { votes } = scenario;
  const national = inEcuador(votes);
  const abroad = votes.flatMap((v) => ("continent" in v ? [v] : []));
  const continentRanking = (ids: readonly string[]) =>
    buildRanking(
      tally(abroad.filter((v) => ids.includes(v.continent)).map((v) => v.club)),
      nameOf,
    );

  return {
    nationalRanking: nationalRanking(votes),
    provinceResults: new Map(
      PROVINCES.map((province) => {
        const here = national.filter((v) => v.province === province.id);
        return [
          province.id,
          {
            ranking: buildRanking(tally(here.map((v) => v.club)), nameOf),
            cantonRankings: new Map(
              CANTONS.filter((c) => c.provinceId === province.id).map((c) => [
                c.id,
                buildRanking(
                  tally(
                    c.id === firstCanton(province.id)
                      ? here.map((v) => v.club)
                      : [],
                  ),
                  nameOf,
                ),
              ]),
            ),
          },
        ];
      }),
    ),
    continentRankings: new Map([
      ["america", continentRanking(["america-del-norte", "america-del-sur"])],
      ["europa", continentRanking(["europa"])],
      ["asia", continentRanking(["asia"])],
      ["africa", continentRanking(["africa"])],
      ["oceania", continentRanking(["oceania"])],
    ]),
    internationalRanking: buildRanking(
      tally(abroad.map((v) => v.club)),
      nameOf,
    ),
  };
}

export function homeDataFor(scenario: Scenario): {
  results: NationalResultsResponse;
  provinceLeaders: ProvinceLeaders;
} {
  const national = inEcuador(scenario.votes);
  const ranking = nationalRanking(scenario.votes);
  const provinceVotes = Object.fromEntries(
    PROVINCES.map((p) => [
      p.id,
      Object.fromEntries(
        tally(national.filter((v) => v.province === p.id).map((v) => v.club)),
      ),
    ]),
  );
  return {
    results: {
      status: "ok",
      data: {
        totalFans: national.length,
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
      },
    },
    provinceLeaders: getProvinceLeaders(
      provinceVotes,
      CLUBS.map((c) => ({ id: c.id, name: c.name, color: c.color })),
    ),
  };
}
