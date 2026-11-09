import type { Metadata } from "next";
import { VoteScreen } from "@/components/vote/vote-screen";
import { getTopClubSlugs } from "@/lib/results/load";
import { POPULAR_CLUB_IDS } from "@/mocks/popular-clubs";

export const metadata: Metadata = {
  title: "Registra tu voto · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

const POPULAR_COUNT = 10;

/**
 * Destino del usuario que inició sesión. "Los más elegidos" son los clubes con más
 * votos; mientras haya menos de 10 con votos, se completa con una lista inicial.
 */
export default async function CuentaPage() {
  const top = await getTopClubSlugs(POPULAR_COUNT);
  const popularClubIds = [...new Set([...top, ...POPULAR_CLUB_IDS])].slice(
    0,
    POPULAR_COUNT,
  );

  return <VoteScreen popularClubIds={popularClubIds} />;
}
