import Image from "next/image";
import { SelectableClubRow } from "@/components/home/results/club-selection";
import type { ClubResult } from "@/mocks/national-results";

interface TopFiveListProps {
  clubs: readonly ClubResult[];
}

/**
 * Alto de fila, compartido con el estado "cargando" para que no salte el layout.
 * En lg+, fila y separación suman lo mismo que antes: la lista conserva su alto.
 */
export const TOP_FIVE_ROW_HEIGHT =
  "h-14 phone:h-(--top-row) tablet:h-[clamp(3.25rem,6.6vw,4.25rem)] wide:h-[clamp(3rem,6vw,4.25rem)] lg:h-[4.984vw]";

/** Separación entre filas, compartida con el estado "cargando". */
export const TOP_FIVE_GAP = "gap-3 phone:gap-1.5 tablet:gap-2 lg:gap-[1.04vw]";

/** Tipografía de nombre y porcentaje por dispositivo (phone se define en cada celda). */
const ROW_TEXT =
  "text-xl tablet:text-[clamp(1.0625rem,2.2vw,1.375rem)] wide:text-[clamp(1.125rem,2.6vw,1.75rem)] lg:text-[1.67vw]";

/**
 * Escudo del club sobre una insignia blanca, para que se vea sobre el color de
 * cualquier club. Sin archivo, la insignia queda vacía.
 */
function ClubCrest({ crest }: { crest: string | null }) {
  return (
    <span
      className={`relative size-[1.75em] shrink-0 rounded-full bg-white tablet:size-[1.95em] lg:size-[2.1em] ${
        crest ? "ring-1 ring-black/15" : "border border-dashed border-black/30"
      }`}
    >
      {crest && (
        <Image
          src={crest}
          alt=""
          fill
          sizes="(min-width: 64rem) 4vw, 2.75rem"
          className="object-contain p-[9%]"
        />
      )}
    </span>
  );
}

/**
 * Barras del TOP 5 (Sección 2), con el mismo estilo en phone, tablet y lg+: barra
 * redondeada y compacta con posición, escudo y nombre sobre el color del club, y
 * porcentaje en celda blanca. Un borde negro suave mantiene visible también al club
 * blanco. El líder va en un peso mayor. En lg+ las medidas escalan con el ancho.
 */
export function TopFiveList({ clubs }: TopFiveListProps) {
  return (
    <ol className={`flex flex-col ${TOP_FIVE_GAP}`}>
      {clubs.map((club, index) => (
        <SelectableClubRow
          key={club.id}
          club={{ id: club.id, name: club.name, color: club.color }}
          label={`${club.name}, ${club.percentage}%. Resaltar en el mapa las provincias donde lidera`}
          className={`grid grid-cols-[78.06%_1fr] border-4 border-black font-bold leading-none phone:grid-cols-[2rem_minmax(0,1fr)_3.75rem] phone:overflow-hidden phone:rounded-lg phone:border phone:border-black/60 phone:font-semibold phone:first:font-extrabold tablet:grid-cols-[2.75rem_minmax(0,1fr)_4.5rem] tablet:overflow-hidden tablet:rounded-xl tablet:border tablet:border-black/60 tablet:font-semibold tablet:first:font-extrabold lg:grid-cols-[12.5%_minmax(0,1fr)_20.5%] lg:overflow-hidden lg:rounded-[0.95vw] lg:border lg:border-black/60 lg:font-semibold lg:first:font-extrabold ${TOP_FIVE_ROW_HEIGHT}`}
        >
          <span
            aria-hidden="true"
            className="hidden items-center justify-center tabular-nums phone:flex phone:text-sm tablet:flex tablet:text-base lg:flex lg:text-[1.5vw]"
            style={{ backgroundColor: club.color, color: club.textColor }}
          >
            {index + 1}
          </span>
          <span
            className={`flex items-center justify-center gap-[0.5em] border-r-4 border-black px-2 text-center phone:justify-start phone:border-r phone:border-black/60 phone:pr-2 phone:pl-0 phone:text-left phone:text-[clamp(0.9375rem,4.1vw,1.0625rem)] phone:tracking-tight tablet:justify-start tablet:border-r tablet:border-black/60 tablet:pr-3 tablet:pl-0 tablet:text-left tablet:tracking-tight lg:justify-start lg:border-r lg:border-black/60 lg:pr-[0.8vw] lg:pl-0 lg:text-left lg:tracking-tight ${ROW_TEXT}`}
            style={{ backgroundColor: club.color, color: club.textColor }}
          >
            <ClubCrest crest={club.crest} />
            <span className="min-w-0">{club.name}</span>
          </span>
          <span
            className={`flex flex-wrap content-center items-baseline justify-center bg-white text-black phone:text-[clamp(0.9375rem,4.1vw,1.0625rem)] phone:tabular-nums tablet:tabular-nums lg:tabular-nums ${ROW_TEXT}`}
          >
            {club.percentage}
            <span className="ml-[0.08em] text-[0.7em] phone:text-[0.85em] tablet:text-[0.8em] lg:text-[0.8em]">
              %
            </span>
          </span>
        </SelectableClubRow>
      ))}
    </ol>
  );
}
