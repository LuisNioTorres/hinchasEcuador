/**
 * DATOS MOCK — Resultados nacionales (Sección 2).
 *
 * Datos estáticos de desarrollo tomados literalmente de la referencia
 * `PAG PRINCIPAL 2.jpg`. NO son resultados reales. Se reemplazarán por datos
 * del backend en un hito posterior; los componentes solo dependen de los tipos.
 *
 * Colores de los clubes: muestreados de la referencia (JPG). PENDIENTES de que
 * el dueño apruebe el HEX exacto de cada equipo.
 */

export type ResultsStatus = "ok" | "error" | "offline" | "loading";

export interface ClubResult {
  readonly id: string;
  readonly name: string;
  /** Porcentaje de votos válidos en el ámbito nacional. */
  readonly percentage: number;
  /** Color asignado al club (HEX). */
  readonly color: string;
  /** Color del texto sobre `color`, según la referencia. */
  readonly textColor: string;
}

export interface NationalResults {
  readonly totalFans: number;
  readonly top: readonly ClubResult[];
}

export interface NationalResultsResponse {
  readonly status: ResultsStatus;
  readonly data: NationalResults | null;
}

const mockTop5: readonly ClubResult[] = [
  {
    id: "emelec",
    name: "EMELEC",
    percentage: 30,
    color: "#376CD3",
    textColor: "#FFFFFF",
  },
  {
    id: "barcelona",
    name: "BARCELONA",
    percentage: 30,
    color: "#FBDB66",
    textColor: "#000000",
  },
  {
    id: "el-nacional",
    name: "EL NACIONAL",
    percentage: 30,
    color: "#F13836",
    textColor: "#FFFFFF",
  },
  {
    id: "liga-de-quito",
    name: "LIGA DE QUITO",
    percentage: 30,
    color: "#FFFFFF",
    textColor: "#000000",
  },
  {
    id: "chacarita",
    name: "CHACARITA",
    percentage: 30,
    color: "#00BF62",
    textColor: "#FFFFFF",
  },
];

/**
 * Respuesta mock. Para revisar los otros estados visuales, cambiar `status`
 * a "error", "offline" o "loading".
 */
export const mockNationalResults: NationalResultsResponse = {
  status: "ok",
  data: { totalFans: 3000, top: mockTop5 },
};
