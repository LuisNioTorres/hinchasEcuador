"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Ranking } from "@/lib/results/rankings";
import {
  CONTINENT_RANKINGS,
  INTERNATIONAL_RANKING,
} from "@/mocks/abroad-votes";
import {
  NATIONAL_RANKING,
  PROVINCE_RESULTS,
  type ProvinceResults,
} from "@/mocks/census-votes";

export interface ResultsData {
  readonly nationalRanking: Ranking;
  readonly provinceResults: ReadonlyMap<string, ProvinceResults>;
  readonly continentRankings: ReadonlyMap<string, Ranking>;
  readonly internationalRanking: Ranking;
}

const ResultsDataContext = createContext<ResultsData>({
  nationalRanking: NATIONAL_RANKING,
  provinceResults: PROVINCE_RESULTS,
  continentRankings: CONTINENT_RANKINGS,
  internationalRanking: INTERNATIONAL_RANKING,
});

export const useResultsData = () => useContext(ResultsDataContext);

/** Permite mostrar la página con otros datos; sin él, usa los datos por defecto. */
export function ResultsDataProvider({
  value,
  children,
}: {
  value: ResultsData;
  children: ReactNode;
}) {
  return (
    <ResultsDataContext.Provider value={value}>
      {children}
    </ResultsDataContext.Provider>
  );
}
