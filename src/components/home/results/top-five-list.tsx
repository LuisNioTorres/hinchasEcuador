import type { ClubResult } from "@/mocks/national-results";

interface TopFiveListProps {
  clubs: readonly ClubResult[];
}

/**
 * Barras del TOP 5 (Sección 2): nombre del club sobre su color y porcentaje
 * en celda blanca. Medidas desktop sobre el lienzo de 1920px:
 * fila 588x86 px, borde 4px, separación 32px, celda de nombre 459px.
 */
export function TopFiveList({ clubs }: TopFiveListProps) {
  return (
    <ol className="flex flex-col gap-3 lg:gap-[1.67vw]">
      {clubs.map((club) => (
        <li
          key={club.id}
          className="grid h-14 grid-cols-[78.06%_1fr] border-4 border-black font-bold leading-none lg:h-[4.48vw] lg:border-[length:max(3px,0.21vw)]"
        >
          <span
            className="flex items-center justify-center border-r-4 border-black px-2 text-center text-xl lg:border-r-[length:max(3px,0.21vw)] lg:text-[2.66vw]"
            style={{ backgroundColor: club.color, color: club.textColor }}
          >
            {club.name}
          </span>
          <span className="flex items-baseline justify-center bg-white text-xl text-black lg:pt-[0.4vw] lg:text-[2.66vw]">
            {club.percentage}
            <span className="ml-[0.08em] text-[0.7em]">%</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
