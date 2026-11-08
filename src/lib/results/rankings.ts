/**
 * Cálculo de rankings a partir de votos por club (docs/DATOS_INFORMATION.md, Módulo 5):
 * porcentaje sobre el total del ámbito y desempate alfabético por nombre popular.
 */

export interface RankingEntry {
  readonly clubId: string;
  readonly votes: number;
  /** Porcentaje sobre el total de votos del ámbito (0–100). */
  readonly percentage: number;
  /** Posición 1..n tras ordenar por votos y desempatar por nombre. */
  readonly position: number;
}

export interface Ranking {
  readonly total: number;
  readonly entries: readonly RankingEntry[];
}

/** Ordena por votos (desc) y, en empate, por nombre popular. Omite clubes sin votos. */
export function buildRanking(
  votesByClub: ReadonlyMap<string, number>,
  nameOf: (clubId: string) => string,
): Ranking {
  const total = [...votesByClub.values()].reduce((sum, v) => sum + v, 0);
  const entries = [...votesByClub.entries()]
    .filter(([, votes]) => votes > 0)
    .sort(
      ([a, va], [b, vb]) => vb - va || nameOf(a).localeCompare(nameOf(b), "es"),
    )
    .map(([clubId, votes], index) => ({
      clubId,
      votes,
      percentage: total ? (votes / total) * 100 : 0,
      position: index + 1,
    }));
  return { total, entries };
}

/** Suma varios conteos de votos por club en uno solo. */
export function sumVotes(
  parts: Iterable<ReadonlyMap<string, number>>,
): Map<string, number> {
  const out = new Map<string, number>();
  for (const part of parts) {
    for (const [clubId, votes] of part) {
      out.set(clubId, (out.get(clubId) ?? 0) + votes);
    }
  }
  return out;
}

/** Porcentaje con un decimal, en formato de Ecuador ("30,5 %"). */
export function formatPercentage(value: number) {
  return `${value.toLocaleString("es-EC", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
}

/** Cantidad de votos con su palabra: "1 voto", "48.213 votos". */
export function formatVoteCount(value: number) {
  return `${formatVotes(value)} ${value === 1 ? "voto" : "votos"}`;
}

/** Número con separador de miles ("48.213"). */
export function formatVotes(value: number) {
  return value.toLocaleString("es-EC");
}
