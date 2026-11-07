import { SelectableClubRow } from "@/components/home/results/club-selection";
import type { ClubResult } from "@/mocks/national-results";

interface TopFiveListProps {
  clubs: readonly ClubResult[];
}

/** Alto de fila, compartido con el estado "cargando" para que no salte el layout. */
export const TOP_FIVE_ROW_HEIGHT =
  "h-14 phone:h-(--top-row) tablet:h-[clamp(3.25rem,6.6vw,4.25rem)] wide:h-[clamp(3rem,6vw,4.25rem)] lg:h-[4.48vw]";

/** Tipografía de nombre y porcentaje por dispositivo (phone se define en cada celda). */
const ROW_TEXT =
  "text-xl tablet:text-[clamp(1.0625rem,2.2vw,1.375rem)] wide:text-[clamp(1.125rem,2.6vw,1.75rem)] lg:text-[2.66vw]";

/**
 * Barras del TOP 5 (Sección 2): nombre del club sobre su color y porcentaje
 * en celda blanca. Medidas desktop sobre el lienzo de 1920px:
 * fila 588x86 px, borde 4px, separación 32px, celda de nombre 459px.
 *
 * En phone y tablet cada fila conserva el color del club como en desktop, en una barra
 * redondeada y compacta: posición y nombre sobre el color, porcentaje en celda
 * blanca. Un borde negro suave mantiene visible también al club blanco.
 * El líder va en un peso mayor.
 */
export function TopFiveList({ clubs }: TopFiveListProps) {
  return (
    <ol className="flex flex-col gap-3 phone:gap-1.5 tablet:gap-2 lg:gap-[1.67vw]">
      {clubs.map((club, index) => (
        <SelectableClubRow
          key={club.id}
          club={{ id: club.id, name: club.name, color: club.color }}
          label={`${club.name}, ${club.percentage}%. Resaltar en el mapa las provincias donde lidera`}
          className={`grid grid-cols-[78.06%_1fr] border-4 border-black font-bold leading-none phone:grid-cols-[2rem_minmax(0,1fr)_3.75rem] phone:overflow-hidden phone:rounded-lg phone:border phone:border-black/60 phone:font-semibold phone:first:font-extrabold tablet:grid-cols-[2.75rem_minmax(0,1fr)_4.5rem] tablet:overflow-hidden tablet:rounded-xl tablet:border tablet:border-black/60 tablet:font-semibold tablet:first:font-extrabold lg:border-[length:max(3px,0.21vw)] ${TOP_FIVE_ROW_HEIGHT}`}
        >
          <span
            aria-hidden="true"
            className="hidden items-center justify-center tabular-nums phone:flex phone:text-sm tablet:flex tablet:text-base"
            style={{ backgroundColor: club.color, color: club.textColor }}
          >
            {index + 1}
          </span>
          <span
            className={`flex items-center justify-center border-r-4 border-black px-2 text-center phone:justify-start phone:border-r phone:border-black/60 phone:pr-2 phone:pl-0 phone:text-left phone:text-[clamp(0.9375rem,4.1vw,1.0625rem)] phone:tracking-tight tablet:justify-start tablet:border-r tablet:border-black/60 tablet:pr-3 tablet:pl-0 tablet:text-left tablet:tracking-tight lg:border-r-[length:max(3px,0.21vw)] ${ROW_TEXT}`}
            style={{ backgroundColor: club.color, color: club.textColor }}
          >
            {club.name}
          </span>
          <span
            className={`flex items-baseline justify-center bg-white text-black max-lg:flex-wrap max-lg:content-center phone:text-[clamp(0.9375rem,4.1vw,1.0625rem)] phone:tabular-nums tablet:tabular-nums lg:pt-[0.4vw] ${ROW_TEXT}`}
          >
            {club.percentage}
            <span className="ml-[0.08em] text-[0.7em] phone:text-[0.85em] tablet:text-[0.8em]">
              %
            </span>
          </span>
        </SelectableClubRow>
      ))}
    </ol>
  );
}
