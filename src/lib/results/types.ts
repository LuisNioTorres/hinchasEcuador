import type { Ranking } from "@/lib/results/rankings";

export type ResultsStatus = "ok" | "error" | "offline" | "loading";

export interface ClubResult {
  readonly id: string;
  readonly name: string;
  /** Porcentaje de votos válidos en el ámbito nacional. */
  readonly percentage: number;
  /** Color asignado al club (HEX). */
  readonly color: string;
  /** Color del texto sobre `color`. */
  readonly textColor: string;
  /** Ruta del escudo, o `null` mientras no se tenga el archivo. */
  readonly crest: string | null;
}

export interface NationalResults {
  readonly totalFans: number;
  readonly top: readonly ClubResult[];
}

export interface NationalResultsResponse {
  readonly status: ResultsStatus;
  readonly data: NationalResults | null;
}

export interface ProvinceResults {
  readonly ranking: Ranking;
  /** Ranking de cada cantón de la provincia (para el mapa cantonal). */
  readonly cantonRankings: ReadonlyMap<string, Ranking>;
}

export interface ResultsData {
  readonly nationalRanking: Ranking;
  readonly provinceResults: ReadonlyMap<string, ProvinceResults>;
  readonly continentRankings: ReadonlyMap<string, Ranking>;
  readonly internationalRanking: Ranking;
}
