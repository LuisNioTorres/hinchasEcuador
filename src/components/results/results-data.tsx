"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ResultsData } from "@/lib/results/types";

const ResultsDataContext = createContext<ResultsData | null>(null);

export function useResultsData() {
  const data = useContext(ResultsDataContext);
  if (!data) throw new Error("Falta ResultsDataProvider.");
  return data;
}

/** Entrega a la página sus resultados: reales en /resultados, de ejemplo en /simulacion. */
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
