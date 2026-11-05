import type { ClubResult } from "@/mocks/national-results";

interface TopFiveListProps {
  clubs: readonly ClubResult[];
}

/** Alto de fila, compartido con el estado "cargando" para que no salte el layout. */
export const TOP_FIVE_ROW_HEIGHT =
  "h-14 phone:h-[3.75rem] phone:first:h-[4.75rem] tablet:h-[clamp(3.75rem,7.2vw,4.5rem)] wide:h-[clamp(3rem,6vw,4.25rem)] lg:h-[4.48vw]";

/** Tipografía de nombre y porcentaje por dispositivo (phone se define en cada celda). */
const ROW_TEXT =
  "text-xl tablet:text-[3.2vw] wide:text-[clamp(1.125rem,2.6vw,1.75rem)] lg:text-[2.66vw]";

/**
 * Barras del TOP 5 (Sección 2): nombre del club sobre su color y porcentaje
 * en celda blanca. Medidas desktop sobre el lienzo de 1920px:
 * fila 588x86 px, borde 4px, separación 32px, celda de nombre 459px.
 *
 * En phone funciona como marcador: posición en celda negra, nombre alineado a la
 * izquierda, sombra sólida y la primera fila más grande para destacar al líder.
 */
export function TopFiveList({ clubs }: TopFiveListProps) {
  return (
    <ol className="flex flex-col gap-3 phone:gap-3.5 lg:gap-[1.67vw]">
      {clubs.map((club, index) => (
        <li
          key={club.id}
          className={`grid grid-cols-[78.06%_1fr] border-4 border-black font-bold leading-none phone:grid-cols-[2.5rem_minmax(0,1fr)_4.5rem] phone:border-[3px] phone:shadow-[3px_3px_0_0_#000] phone:first:[&>span]:text-[clamp(1.125rem,5.8vw,1.75rem)] lg:border-[length:max(3px,0.21vw)] ${TOP_FIVE_ROW_HEIGHT}`}
        >
          <span
            aria-hidden="true"
            className="hidden items-center justify-center bg-black text-white phone:flex phone:text-lg"
          >
            {index + 1}
          </span>
          <span
            className={`flex items-center justify-center border-r-4 border-black px-2 text-center phone:justify-start phone:border-r-[3px] phone:px-3 phone:text-left phone:text-[clamp(1rem,5vw,1.5rem)] lg:border-r-[length:max(3px,0.21vw)] ${ROW_TEXT}`}
            style={{ backgroundColor: club.color, color: club.textColor }}
          >
            {club.name}
          </span>
          <span
            className={`flex items-baseline justify-center bg-white text-black max-lg:flex-wrap max-lg:content-center phone:text-[clamp(1.25rem,6vw,1.625rem)] lg:pt-[0.4vw] ${ROW_TEXT}`}
          >
            {club.percentage}
            <span className="ml-[0.08em] text-[0.7em]">%</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
