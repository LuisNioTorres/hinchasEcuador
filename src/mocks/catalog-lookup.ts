import { CANTONS, CLUBS, PROVINCES, type Club } from "@/mocks/catalogs";

/** Búsquedas por id sobre la copia de los catálogos. */
export const CLUB_BY_ID: ReadonlyMap<string, Club> = new Map(
  CLUBS.map((c) => [c.id, c]),
);
export const PROVINCE_NAME: ReadonlyMap<string, string> = new Map(
  PROVINCES.map((p) => [p.id, p.name]),
);
export const CANTON_NAME: ReadonlyMap<string, string> = new Map(
  CANTONS.map((c) => [c.id, c.name]),
);

export function clubOf(clubId: string): Club {
  const club = CLUB_BY_ID.get(clubId);
  if (!club) throw new Error(`Club desconocido: ${clubId}`);
  return club;
}
