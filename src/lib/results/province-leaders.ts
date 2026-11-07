export interface LeaderClub {
  readonly id: string;
  readonly name: string;
  readonly color: string;
}

export interface ProvinceLeader {
  readonly clubId: string;
  readonly clubName: string;
  readonly color: string;
  /** Porcentaje de los votos de la provincia, redondeado. */
  readonly percentage: number;
}

/** Votos de cada club (por id) en cada provincia (por código ISO). */
export type ProvinceVotes = Readonly<
  Record<string, Readonly<Record<string, number>>>
>;

export type ProvinceLeaders = Readonly<Record<string, ProvinceLeader>>;

/**
 * Calcula el club líder de cada provincia según docs/DATOS_INFORMATION.md (Módulo 5):
 * gana quien tiene más votos y un empate se resuelve alfabéticamente por nombre.
 * Una provincia sin votos no aparece en el resultado.
 */
export function getProvinceLeaders(
  votes: ProvinceVotes,
  clubs: readonly LeaderClub[],
): ProvinceLeaders {
  const leaders: Record<string, ProvinceLeader> = {};

  for (const [provinceId, provinceVotes] of Object.entries(votes)) {
    const ranked = clubs
      .map((club) => ({ club, total: provinceVotes[club.id] ?? 0 }))
      .filter(({ total }) => total > 0)
      .sort(
        (a, b) =>
          b.total - a.total || a.club.name.localeCompare(b.club.name, "es"),
      );

    const first = ranked[0];
    if (!first) continue;

    const provinceTotal = ranked.reduce((sum, { total }) => sum + total, 0);
    leaders[provinceId] = {
      clubId: first.club.id,
      clubName: first.club.name,
      color: first.club.color,
      percentage: Math.round((first.total / provinceTotal) * 100),
    };
  }

  return leaders;
}
